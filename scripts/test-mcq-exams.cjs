/* Public MCQ regression checks. All database operations use isolated in-memory collections. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { randomUUID } = require("node:crypto");
const ts = require("typescript");

function load(file, imports = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function("require", "module", "exports", code)(
    (id) => (Object.hasOwn(imports, id) ? imports[id] : require(id)),
    module,
    module.exports,
  );
  return module.exports;
}
const clone = (value) => structuredClone(value);
const pathValue = (row, path) => path.split(".").reduce((value, key) => value?.[key], row);
function matches(row, filter) {
  return Object.entries(filter).every(([key, expected]) => {
    const value = pathValue(row, key);
    if (expected && typeof expected === "object") {
      if ("$ne" in expected) return value !== expected.$ne;
      if ("$lt" in expected) return value < expected.$lt;
      if ("$in" in expected) return expected.$in.includes(value);
    }
    return expected === null ? value == null : value === expected;
  });
}
function collection() {
  const store = { rows: [], failInsert: false, failDelete: false };
  function update(filter, changes, options = {}) {
    let row = store.rows.find((item) => matches(item, filter));
    if (!row && options.upsert) {
      row = { ...clone(filter), ...clone(changes.$setOnInsert) };
      store.rows.push(row);
    }
    if (!row) return null;
    Object.assign(row, clone(changes.$set ?? {}));
    for (const [key, amount] of Object.entries(changes.$inc ?? {})) row[key] = (row[key] ?? 0) + amount;
    return clone(row);
  }
  const expression = (row, value) => {
    if (typeof value === "string" && value.startsWith("$")) return pathValue(row, value.slice(1));
    if (value && typeof value === "object")
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, expression(row, item)]));
    return value;
  };
  return Object.assign(store, {
    findOne: async (filter) => clone(store.rows.find((row) => matches(row, filter)) ?? null),
    updateOne: async (filter, changes, options) => ({ modifiedCount: update(filter, changes, options) ? 1 : 0 }),
    findOneAndUpdate: async (filter, changes, options) => update(filter, changes, options),
    deleteOne: async (filter) => {
      const index = store.rows.findIndex((row) => matches(row, filter));
      if (index < 0) return { deletedCount: 0 };
      store.rows.splice(index, 1);
      return { deletedCount: 1 };
    },
    deleteMany: async (filter) => {
      if (store.failDelete) throw new Error("Synthetic delete failure");
      const count = store.rows.length;
      store.rows = store.rows.filter((row) => !matches(row, filter));
      return { deletedCount: count - store.rows.length };
    },
    insertOne: async (row) => {
      if (store.failInsert) throw new Error("Synthetic insert failure");
      if (store.rows.some((item) => item._id === row._id)) throw Object.assign(new Error("Duplicate"), { code: 11000 });
      store.rows.push(clone(row));
      return { insertedId: row._id };
    },
    countDocuments: async (filter) => store.rows.filter((row) => matches(row, filter)).length,
    find(filter) {
      let order = {},
        skip = 0,
        limit = Infinity;
      return {
        sort(value) {
          order = value;
          return this;
        },
        skip(value) {
          skip = value;
          return this;
        },
        limit(value) {
          limit = value;
          return this;
        },
        async toArray() {
          return clone(
            store.rows
              .filter((row) => matches(row, filter))
              .sort((a, b) => {
                for (const [key, direction] of Object.entries(order))
                  if (a[key] !== b[key]) return (a[key] > b[key] ? 1 : -1) * direction;
                return 0;
              })
              .slice(skip, skip + limit),
          );
        },
      };
    },
    aggregate(pipeline) {
      let rows = clone(store.rows);
      for (const stage of pipeline) {
        if (stage.$match) rows = rows.filter((row) => matches(row, stage.$match));
        if (stage.$group) {
          const groups = new Map();
          for (const row of rows) {
            const _id = expression(row, stage.$group._id),
              key = JSON.stringify(_id);
            const target = groups.get(key) ?? { _id };
            for (const [field, accumulator] of Object.entries(stage.$group))
              if (field !== "_id") {
                assert.ok("$sum" in accumulator);
                target[field] = (target[field] ?? 0) + expression(row, accumulator.$sum);
              }
            groups.set(key, target);
          }
          rows = [...groups.values()];
        }
        if (stage.$count) rows = rows.length ? [{ [stage.$count]: rows.length }] : [];
      }
      return { toArray: async () => rows };
    },
  });
}
const rules = load("src/lib/dashboard/mcq-exams.ts");
const exams = collection(),
  accounts = collection(),
  attempts = collection();
const service = load("src/lib/services/mcq-exams.ts", {
  "server-only": {},
  "@/lib/dashboard/mcq-exams": rules,
  "@/lib/models/mcq-exams": {
    ensureMcqIndexes: async () => {},
    mcqExamsCollection: () => exams,
    mcqAccountsCollection: () => accounts,
    mcqAttemptsCollection: () => attempts,
  },
});
const input = (count = 2, maxAttempts) => ({
  title: "MCQ practice",
  ...(maxAttempts === undefined ? {} : { maxAttempts }),
  questions: Array.from({ length: count }, (_, index) => ({
    id: `q-${index}`,
    question: `Question ${index + 1}`,
    options: index % 2 ? ["One", "Two", "Three"] : ["One", "Two", "Three", "Four"],
    correctOptionIndex: index % 2,
  })),
});
let now = Date.parse("2026-11-11T06:00:00.000Z");
const RealDate = Date;
global.Date = class extends RealDate {
  constructor(value) {
    super(value === undefined ? now : value);
  }
  static now() {
    return now;
  }
};
let passed = 0;
const check = async (title, run) => {
  await run();
  passed++;
  console.log(`PASS ${title}`);
};
const register = (mobile = "01712345678", name = "Test Student") => ({ name, mobile, attemptId: randomUUID() });
async function finish(exam, token, registration = register()) {
  let state = await service.startMcqExam(exam.slug, token, registration);
  while (state.status === "in-progress") {
    now += 1500;
    state = await service.answerMcqQuestion(exam.slug, token, {
      attemptId: state.attempt.id,
      questionIndex: state.attempt.questionIndex,
      answer: state.attempt.questionIndex % 2,
    });
  }
  return state.result;
}
(async () => {
  await check("question marks default to two, accept editable decimal values, and reject invalid weights", async () => {
    assert.equal(rules.validateMcqExam(input()).questions[0].marks, 2);
    for (const marks of [0.01, 0.1, 1, 2, 2.5, 100]) {
      const value = input();
      value.questions[0].marks = marks;
      assert.equal(rules.validateMcqExam(value).questions[0].marks, marks);
    }
    for (const marks of [0, -1, 100.01, 1.001, NaN, Infinity, null, "2", true]) {
      const value = input();
      value.questions[0].marks = marks;
      assert.throws(() => rules.validateMcqExam(value), { status: 400 });
    }
  });
  await check(
    "weighted marks are saved, exposed without answer keys, and graded from the immutable attempt",
    async () => {
      const value = input();
      value.questions[0].marks = 2.5;
      value.questions[1].marks = 3;
      const exam = await service.saveMcqExam(value);
      assert.deepEqual(
        (await service.getMcqExam(exam.id)).questions.map((question) => question.marks),
        [2.5, 3],
      );
      assert.equal((await service.publicMcqExam(exam.slug, "weights")).totalMarks, 5.5);
      const active = await service.startMcqExam(exam.slug, "weights", register());
      assert.equal(active.attempt.question.marks, 2.5);
      assert.equal(active.attempt.totalMarks, 5.5);
      assert.ok(!JSON.stringify(active).includes("correctOptionIndex"));
      const changed = input();
      changed.questions[0].marks = 9;
      changed.questions[1].marks = 10;
      await service.saveMcqExam(changed, exam.id);
      const next = await service.answerMcqQuestion(exam.slug, "weights", {
        attemptId: active.attempt.id,
        questionIndex: 0,
        answer: 0,
        marks: 99,
        score: 999,
      });
      assert.equal(next.attempt.question.marks, 3);
      const completed = await service.answerMcqQuestion(exam.slug, "weights", {
        attemptId: active.attempt.id,
        questionIndex: 1,
        answer: 0,
      });
      assert.equal(completed.result.score, 2.5);
      assert.equal(completed.result.totalMarks, 5.5);
      assert.deepEqual(
        completed.result.questions.map((question) => question.marks),
        [2.5, 3],
      );
      assert.equal((await service.mcqExamResults(exam.id, 1)).items[0].score, 2.5);
      assert.equal((await service.listMcqExams(1)).items.find((item) => item.id === exam.id).totalMarks, 19);
    },
  );
  await check("decimal mark totals and scores avoid floating point accumulation", async () => {
    const value = input();
    value.questions[0].marks = 0.1;
    value.questions[1].marks = 0.2;
    const exam = await service.saveMcqExam(value);
    const completed = await finish(exam, "decimal-marks");
    assert.equal(completed.score, 0.3);
    assert.equal(completed.totalMarks, 0.3);
  });
  await check(
    "older exams adopt the new default while old attempts retain their original one-mark scores",
    async () => {
      const exam = await service.saveMcqExam(input());
      const saved = exams.rows.find((row) => row.id === exam.id);
      saved.questions.forEach((question) => delete question.marks);
      assert.deepEqual(
        (await service.getMcqExam(exam.id)).questions.map((question) => question.marks),
        [2, 2],
      );
      assert.equal((await service.publicMcqExam(exam.slug, "legacy")).totalMarks, 4);
      const active = await service.startMcqExam(exam.slug, "legacy", register());
      const attempt = attempts.rows.find((row) => row._id === active.attempt.id);
      attempt.questions.forEach((question) => delete question.marks);
      await service.answerMcqQuestion(exam.slug, "legacy", {
        attemptId: active.attempt.id,
        questionIndex: 0,
        answer: 0,
      });
      const completed = await service.answerMcqQuestion(exam.slug, "legacy", {
        attemptId: active.attempt.id,
        questionIndex: 1,
        answer: 1,
      });
      assert.equal(completed.result.score, 2);
      assert.equal(completed.result.totalMarks, 2);
      assert.equal((await service.mcqExamResult(exam.id, active.attempt.id)).totalMarks, 2);
      assert.equal((await finish(exam, "new-default")).score, 4);
    },
  );
  await check("the question editor shows editable marks and the correct examination total", async () => {
    const React = require("react");
    const { renderToStaticMarkup } = require("react-dom/server");
    const editor = load("src/components/mcq/McqExamEditor.tsx", {
      "@/components/ui/global-toast": { toast: {} },
      "@/lib/dashboard/mcq-exams": rules,
      "@/redux/features/dashboard/mcq-exams/mcqExamsSlice": {
        useSaveMcqExamMutation: () => [() => {}, { isLoading: false }],
      },
      "./mcq-ui": load("src/components/mcq/mcq-ui.tsx"),
    }).default;
    const createHtml = renderToStaticMarkup(React.createElement(editor, { onClose: () => {} }));
    assert.match(createHtml, /aria-label="Marks for question 1"[^>]*value="2"/);
    const value = input();
    value.questions[0].marks = 2.5;
    value.questions[1].marks = 4;
    const editHtml = renderToStaticMarkup(React.createElement(editor, { exam: value, onClose: () => {} }));
    assert.match(editHtml, /aria-label="Marks for question 1"[^>]*value="2.5"/);
    assert.ok(editHtml.includes("6.5"));
  });
  await check(
    "exam validation accepts 25, 30, and 50 questions, 3/4 options, and defaults to three attempts",
    async () => {
      for (const count of [25, 30, 50]) assert.equal(rules.validateMcqExam(input(count)).questions.length, count);
      assert.equal(rules.validateMcqExam(input()).maxAttempts, 3);
      for (const value of [input(0), input(201), input(2, 0), input(2, 1.5), input(2, 101)])
        assert.throws(() => rules.validateMcqExam(value));
      const value = input();
      value.questions[0].options = ["a", "b"];
      assert.throws(() => rules.validateMcqExam(value));
      value.questions[0].options = ["a", "a", "b"];
      assert.throws(() => rules.validateMcqExam(value));
      value.questions[0].options = ["a", "b", "c"];
      value.questions[0].correctOptionIndex = 3;
      assert.throws(() => rules.validateMcqExam(value));
      assert.equal(rules.normalizeMcqMobile("+880 1712-345678"), "01712345678");
      assert.equal(rules.normalizeMcqMobile("০০৮৮০১৭১২৩৪৫৬৭৮"), "01712345678");
      assert.equal(rules.normalizeMcqMobile("017ABC12345678"), null);
    },
  );
  await check("public links are unique and registration never reveals answer keys or future questions", async () => {
    const exam = await service.saveMcqExam(input());
    assert.notEqual(exam.slug, (await service.saveMcqExam(input())).slug);
    const info = await service.publicMcqExam(exam.slug, "guest");
    assert.equal(info.state, null);
    assert.ok(!("questions" in info));
    const state = await service.startMcqExam(exam.slug, "guest", register());
    assert.equal(state.attempt.questionIndex, 0);
    assert.equal(state.attempt.question.options.length, 4);
    assert.ok(!JSON.stringify(state).includes("correctOptionIndex"));
    assert.ok(!JSON.stringify(state).includes("Question 2"));
    await assert.rejects(() => service.startMcqExam("missing", "guest", register()), { status: 404 });
  });
  await check("registration retries and refresh resume one attempt; other guests cannot access it", async () => {
    const exam = await service.saveMcqExam(input());
    const body = register();
    const first = await service.startMcqExam(exam.slug, "guest", body);
    assert.deepEqual(await service.startMcqExam(exam.slug, "guest", body), first);
    assert.equal((await service.publicMcqExam(exam.slug, "guest")).state.attempt.id, first.attempt.id);
    assert.equal((await service.publicMcqExam(exam.slug, "other")).state, null);
    await assert.rejects(() => service.startMcqExam(exam.slug, "other", register()), { status: 409 });
    await assert.rejects(
      () => service.answerMcqQuestion(exam.slug, "other", { attemptId: first.attempt.id, questionIndex: 0, answer: 0 }),
      { status: 404 },
    );
    assert.equal(accounts.rows.find((row) => row.examId === exam.id).used, 1);
  });
  await check(
    "only sequential valid answers advance; duplicate submissions are idempotent and server timing is exact",
    async () => {
      const exam = await service.saveMcqExam(input());
      const token = "timing";
      const state = await service.startMcqExam(exam.slug, token, register());
      const base = { attemptId: state.attempt.id };
      await assert.rejects(
        () => service.answerMcqQuestion(exam.slug, token, { ...base, questionIndex: 1, answer: 0 }),
        { status: 409 },
      );
      for (const answer of [-1, 4, null, 1.5])
        await assert.rejects(() => service.answerMcqQuestion(exam.slug, token, { ...base, questionIndex: 0, answer }), {
          status: 400,
        });
      now += 1250;
      const next = await service.answerMcqQuestion(exam.slug, token, {
        ...base,
        questionIndex: 0,
        answer: 0,
        score: 999,
        questionTimeMs: 1,
      });
      assert.equal(next.attempt.questionIndex, 1);
      assert.equal(next.attempt.question.options.length, 3);
      assert.deepEqual(
        await service.answerMcqQuestion(exam.slug, token, { ...base, questionIndex: 0, answer: 0 }),
        next,
      );
      await assert.rejects(
        () => service.answerMcqQuestion(exam.slug, token, { ...base, questionIndex: 0, answer: 2 }),
        { status: 409 },
      );
      now += 2750;
      const completed = await service.answerMcqQuestion(exam.slug, token, {
        ...base,
        questionIndex: 1,
        answer: 0,
        score: 999,
        elapsedSeconds: 0,
      });
      assert.equal(completed.status, "submitted");
      assert.equal(completed.result.score, 2);
      assert.equal(completed.result.totalMarks, 4);
      assert.equal(completed.result.totalTimeMs, 4000);
      const detail = await service.mcqExamResult(exam.id, base.attemptId);
      assert.deepEqual(detail.questionTimesMs, [1250, 2750]);
      assert.equal(
        detail.questionTimesMs.reduce((a, b) => a + b, 0),
        detail.totalTimeMs,
      );
      assert.equal(completed.result.questions[0].correctOptionIndex, 0);
      assert.deepEqual(completed.result.answers, [0, 0]);
      assert.deepEqual(completed.result.questionTimesMs, [1250, 2750]);
      assert.ok(!JSON.stringify(completed).includes("tokenHash"));
      assert.ok(!JSON.stringify(detail).includes("tokenHash"));
      now += 9999;
      assert.deepEqual(
        await service.answerMcqQuestion(exam.slug, token, { ...base, questionIndex: 1, answer: 0 }),
        completed,
      );
      assert.deepEqual((await service.publicMcqExam(exam.slug, token)).state, completed);
    },
  );
  await check(
    "edits keep the public link stable and preserve in-progress and historical question snapshots",
    async () => {
      const exam = await service.saveMcqExam(input());
      const state = await service.startMcqExam(exam.slug, "snapshot", register());
      const changed = input(3);
      changed.title = "Changed exam";
      changed.questions[0].correctOptionIndex = 2;
      const edited = await service.saveMcqExam(changed, exam.id);
      assert.equal(edited.slug, exam.slug);
      await service.answerMcqQuestion(exam.slug, "snapshot", {
        attemptId: state.attempt.id,
        questionIndex: 0,
        answer: 0,
      });
      const result = await service.answerMcqQuestion(exam.slug, "snapshot", {
        attemptId: state.attempt.id,
        questionIndex: 1,
        answer: 1,
      });
      assert.equal(result.result.score, 4);
      assert.equal(result.result.totalMarks, 4);
      assert.equal(result.result.examTitle, "MCQ practice");
      const detail = await service.mcqExamResult(exam.id, state.attempt.id);
      assert.equal(detail.questions[0].correctOptionIndex, 0);
    },
  );
  await check(
    "three attempts exhaust a normalized mobile number across browsers and stay separate per examination",
    async () => {
      const exam = await service.saveMcqExam(input(1));
      for (let i = 0; i < 3; i++) {
        const result = await finish(exam, `browser-${i}`, register(i % 2 ? "+8801712345678" : "01712345678"));
        assert.equal(result.attemptNumber, i + 1);
      }
      await assert.rejects(() => service.startMcqExam(exam.slug, "another", register()), { status: 403 });
      const other = await service.saveMcqExam(input(1));
      assert.equal((await finish(other, "another")).attemptNumber, 1);
      assert.equal((await finish(exam, "different-student", register("01812345678"))).attemptNumber, 1);
      await service.saveMcqExam(input(1, 4), exam.id);
      assert.equal((await finish(exam, "extra")).attemptNumber, 4);
    },
  );
  await check("concurrent starts and answers cannot exceed quotas or double-count marks", async () => {
    const exam = await service.saveMcqExam(input(1, 1));
    const starts = await Promise.allSettled([
      service.startMcqExam(exam.slug, "race-a", register()),
      service.startMcqExam(exam.slug, "race-b", register()),
    ]);
    assert.equal(starts.filter((item) => item.status === "fulfilled").length, 1);
    const active = attempts.rows.find((row) => row.examId === exam.id);
    const value = { attemptId: active._id, questionIndex: 0, answer: 0 };
    const results = await Promise.all([
      service.answerMcqQuestion(exam.slug, active.tokenHash, value),
      service.answerMcqQuestion(exam.slug, active.tokenHash, value),
    ]);
    assert.equal(results[0].result.score, 2);
    assert.deepEqual(results[0], results[1]);
    assert.equal(accounts.rows.find((row) => row.examId === exam.id).used, 1);
  });
  await check("failed inserts roll back credits and stale reservations recover", async () => {
    const exam = await service.saveMcqExam(input(1, 1));
    attempts.failInsert = true;
    await assert.rejects(() => service.startMcqExam(exam.slug, "recover", register()));
    attempts.failInsert = false;
    const account = accounts.rows.find((row) => row.examId === exam.id);
    assert.equal(account.used, 0);
    assert.equal(account.activeAttemptId, null);
    account.used = 1;
    account.activeAttemptId = randomUUID();
    account.reservationAt = new Date(now - 120001).toISOString();
    assert.equal((await finish(exam, "recover")).attemptNumber, 1);
  });
  await check(
    "admin summaries count unique students, separate exams, paginate results, and keep zero-participant exams",
    async () => {
      const exam = await service.saveMcqExam(input(1, 100));
      await finish(exam, "summary-a");
      await finish(exam, "summary-b");
      await finish(exam, "summary-c", register("01812345678"));
      const overview = await service.listMcqExams(1);
      const item = overview.items.find((row) => row.id === exam.id);
      assert.equal(item.participants, 2);
      assert.equal(item.completedAttempts, 3);
      assert.ok(!("questions" in item));
      const results = await service.mcqExamResults(exam.id, 1);
      assert.equal(results.total, 3);
      assert.equal(results.participants, 2);
      assert.equal(results.items.length, 3);
      assert.equal((await service.mcqExamResults(exam.id, 2)).items.length, 0);
      const empty = await service.saveMcqExam(input(1));
      assert.equal((await service.listMcqExams(1)).items.find((row) => row.id === empty.id).participants, 0);
      await assert.rejects(() => service.mcqExamResult(empty.id, results.items[0].id), { status: 404 });
    },
  );
  await check("admin APIs reject anonymous/unauthorized requests before accessing data", async () => {
    for (const status of [401, 403]) {
      const routes = load("src/app/api/dashboard/mcq/v1/route.ts", {
        "@/app/api/lib/mcq-exam-access": {
          authorizeMcqAdmin: async () => Response.json({ error: "Denied" }, { status }),
        },
        "@/lib/dashboard/mcq-exams": rules,
        "@/lib/services/mcq-exams": {},
      });
      for (const method of ["GET", "POST", "PATCH", "DELETE"])
        assert.equal((await routes[method](new Request("http://local", { method }))).status, status);
    }
  });
  await check(
    "deleting an exam removes its registrations, active attempts, results, and public link, preserving other exams",
    async () => {
      const exam = await service.saveMcqExam(input());
      const other = await service.saveMcqExam(input());
      const completed = await finish(exam, "delete-completed");
      await service.startMcqExam(exam.slug, "delete-active", register("01812345678"));
      const kept = await finish(other, "delete-keep");
      const removed = await service.deleteMcqExam(exam.id);
      assert.equal(removed.deletedAttempts, 2);
      assert.equal(removed.deletedStudents, 2);
      assert.ok(!exams.rows.some((row) => row.id === exam.id));
      assert.ok(!accounts.rows.some((row) => row.examId === exam.id));
      assert.ok(!attempts.rows.some((row) => row.examId === exam.id));
      await assert.rejects(() => service.publicMcqExam(exam.slug, "delete-completed"), { status: 404 });
      await assert.rejects(() => service.mcqExamResult(exam.id, completed.id), { status: 404 });
      await assert.rejects(() => service.startMcqExam(exam.slug, "delete-new", register()), { status: 404 });
      assert.equal((await service.mcqExamResult(other.id, kept.id)).id, kept.id);
    },
  );
  await check("interrupted deletion blocks new participation and can be retried safely", async () => {
    const exam = await service.saveMcqExam(input());
    await finish(exam, "delete-retry");
    attempts.failDelete = true;
    await assert.rejects(() => service.deleteMcqExam(exam.id));
    attempts.failDelete = false;
    assert.equal(exams.rows.find((row) => row.id === exam.id).deleting, true);
    await assert.rejects(() => service.startMcqExam(exam.slug, "delete-retry", register()), { status: 404 });
    await assert.rejects(() => service.saveMcqExam(input(), exam.id), { status: 404 });
    assert.ok((await service.listMcqExams(1)).items.some((row) => row.id === exam.id));
    assert.equal((await service.deleteMcqExam(exam.id)).ok, true);
    assert.ok(!attempts.rows.some((row) => row.examId === exam.id));
  });
  await check("a registration racing with deletion cannot recreate orphaned student data", async () => {
    for (const phase of ["account", "attempt"]) {
      const exam = await service.saveMcqExam(input());
      const target = phase === "account" ? accounts : attempts;
      const method = phase === "account" ? "updateOne" : "insertOne";
      const original = target[method];
      let deleted = false;
      target[method] = async (...args) => {
        if (!deleted) {
          deleted = true;
          await service.deleteMcqExam(exam.id);
        }
        return original(...args);
      };
      try {
        await assert.rejects(() => service.startMcqExam(exam.slug, "delete-race", register()), { status: 404 });
      } finally {
        target[method] = original;
      }
      assert.ok(!accounts.rows.some((row) => row.examId === exam.id));
      assert.ok(!attempts.rows.some((row) => row.examId === exam.id));
    }
  });
  await check(
    "the dashboard renders the exam summary above its student table and respects delete permissions",
    async () => {
      const React = require("react");
      const { renderToStaticMarkup } = require("react-dom/server");
      const exam = await service.saveMcqExam(input());
      const result = await finish(exam, "same-window");
      const summary = { ...exam, participants: 1, completedAttempts: 1, questionCount: 2, totalMarks: 4 };
      let allowDelete = true;
      const page = load("src/app/dashboard/course/mcq/page.tsx", {
        "next/link": { default: ({ children, href }) => React.createElement("a", { href }, children) },
        "@/components/confirm-delete-provider": { useConfirmDelete: () => async () => false },
        "@/components/mcq/mcq-ui": load("src/components/mcq/mcq-ui.tsx"),
        "@/components/mcq/McqExamEditor": { default: () => null },
        "@/components/mcq/McqResultView": { default: () => null },
        "@/components/ui/global-toast": { toast: {} },
        "@/lib/dashboard/mcq-exams": rules,
        "@/lib/dashboard/use-dashboard-permissions": {
          useDashboardPermissions: () => ({ can: (operation) => operation !== "delete" || allowDelete }),
        },
        "@/redux/features/dashboard/mcq-exams/mcqExamsSlice": {
          useDeleteMcqExamMutation: () => [() => {}, { isLoading: false }],
          useGetMcqExamQuery: () => ({}),
          useGetMcqExamsQuery: () => ({ currentData: { items: [summary], total: 1 } }),
          useGetMcqResultsQuery: () => ({ currentData: { items: [result], total: 1, participants: 1 } }),
          useGetMcqResultQuery: () => ({}),
        },
      }).default;
      const html = renderToStaticMarkup(React.createElement(page));
      assert.ok(html.includes("Summary dashboard"));
      assert.ok(html.includes("Students and results"));
      assert.ok(html.includes("<table"));
      assert.ok(html.indexOf("Summary dashboard") < html.indexOf("<table"));
      assert.ok(html.includes("Test Student"));
      assert.ok(html.includes(`Delete examination: ${exam.title}`));
      allowDelete = false;
      assert.ok(!renderToStaticMarkup(React.createElement(page)).includes("Delete examination:"));
    },
  );
  await check("the delete endpoint validates its exam ID and returns cascade cleanup results", async () => {
    let removedId = null;
    const routes = load("src/app/api/dashboard/mcq/v1/route.ts", {
      "@/app/api/lib/mcq-exam-access": {
        authorizeMcqAdmin: async () => null,
        mcqJson: (value, status = 200) => Response.json(value, { status }),
        mcqError: (error) => Response.json({ error: error.message }, { status: error.status ?? 500 }),
      },
      "@/lib/dashboard/mcq-exams": rules,
      "@/lib/services/mcq-exams": {
        deleteMcqExam: async (id) => {
          removedId = id;
          return { ok: true, deletedAttempts: 2, deletedStudents: 1 };
        },
      },
    });
    assert.equal((await routes.DELETE(new Request("http://local", { method: "DELETE" }))).status, 400);
    assert.equal(removedId, null);
    const response = await routes.DELETE(new Request("http://local?id=exam-to-delete", { method: "DELETE" }));
    assert.equal(removedId, "exam-to-delete");
    assert.deepEqual(await response.json(), { ok: true, deletedAttempts: 2, deletedStudents: 1 });
  });
  console.log(`Public MCQ exams: ${passed} scenarios passed, without live database writes.`);
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    global.Date = RealDate;
  });
