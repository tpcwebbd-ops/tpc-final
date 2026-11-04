/* Course enrollment and exam regression checks. Uses isolated in-memory collections, never the app database. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

function load(file, imports = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "module", "exports", code)(
    (id) => (Object.hasOwn(imports, id) ? imports[id] : require(id)),
    module,
    module.exports,
  );
  return module.exports;
}
const courses = load("src/lib/dashboard/courses.ts");
const rules = load("src/lib/dashboard/course-exams.ts", { "./courses": courses });
const clone = (value) => structuredClone(value);
const get = (object, key) =>
  key
    .split(".")
    .reduce((value, part) => (Array.isArray(value) ? value.flatMap((item) => item?.[part]) : value?.[part]), object);
function condition(value, expected) {
  if (expected && typeof expected === "object" && !Array.isArray(expected)) {
    if ("$ne" in expected) return !condition(value, expected.$ne);
    if ("$in" in expected) return expected.$in.some((item) => condition(value, item));
    if ("$not" in expected) return !condition(value, expected.$not);
    if ("$elemMatch" in expected)
      return Array.isArray(value) && value.some((item) => matches(item, expected.$elemMatch));
  }
  if (Array.isArray(value)) return value.some((item) => condition(item, expected));
  if (value instanceof Date && expected instanceof Date) return value.getTime() === expected.getTime();
  return expected === null ? value == null : value === expected;
}
function matches(row, filter) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$expr") {
      const [operator, operands] = Object.entries(expected)[0];
      const values = operands.map((operand) =>
        typeof operand === "string" && operand.startsWith("$") ? get(row, operand.slice(1)) : operand,
      );
      if (operator === "$lt") return values[0] < values[1];
      if (operator === "$gte") return values[0] >= values[1];
      throw new Error(`Unhandled expression ${operator}`);
    }
    return condition(get(row, key), expected);
  });
}
function collection() {
  const store = { rows: [], failInsert: false };
  function set(row, key, value, filter) {
    const parts = key.split(".");
    let target = row;
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === "$") {
        const parent = parts[i - 1];
        target =
          target.find((item) => matches(item, filter[parent].$elemMatch)) ??
          target.find((item) => item.id === filter[parent].$elemMatch.id);
      } else target = target[parts[i]] ??= {};
    }
    target[parts.at(-1)] = clone(value);
  }
  function update(filter, changes, options = {}) {
    let row = store.rows.find((item) => matches(item, filter));
    let inserted = false;
    if (!row && options.upsert) {
      row = { ...filter, ...clone(changes.$setOnInsert ?? {}) };
      store.rows.push(row);
      inserted = true;
    }
    if (!row) return null;
    for (const [key, value] of Object.entries(changes.$set ?? {})) set(row, key, value, filter);
    for (const [key, value] of Object.entries(changes.$inc ?? {})) set(row, key, (get(row, key) ?? 0) + value, filter);
    for (const [key, value] of Object.entries(changes.$push ?? {})) {
      row[key] ??= [];
      row[key].push(clone(value));
    }
    for (const [key, value] of Object.entries(changes.$pull ?? {}))
      row[key] = row[key].filter((item) => !matches(item, value));
    return { row, inserted };
  }
  return Object.assign(store, {
    createIndex: async () => "test-index",
    findOne: async (filter) => clone(store.rows.find((row) => matches(row, filter)) ?? null),
    updateOne: async (filter, changes, options) => {
      const result = update(filter, changes, options);
      return { modifiedCount: result ? 1 : 0, upsertedCount: result?.inserted ? 1 : 0 };
    },
    findOneAndUpdate: async (filter, changes, options) => clone(update(filter, changes, options)?.row ?? null),
    insertOne: async (row) => {
      if (store.failInsert) throw new Error("Synthetic insertion failure");
      assert.ok(!store.rows.some((item) => item._id && item._id === row._id));
      store.rows.push(clone(row));
      return { insertedId: row._id };
    },
    countDocuments: async (filter) => store.rows.filter((row) => matches(row, filter)).length,
    find(filter, options = {}) {
      let order = {},
        offset = 0,
        count = Infinity;
      return {
        sort(value) {
          order = value;
          return this;
        },
        skip(value) {
          offset = value;
          return this;
        },
        limit(value) {
          count = value;
          return this;
        },
        async toArray() {
          const rows = clone(store.rows.filter((row) => matches(row, filter)))
            .sort((a, b) => {
              for (const [key, direction] of Object.entries(order))
                if (a[key] !== b[key]) return (a[key] > b[key] ? 1 : -1) * direction;
              return 0;
            })
            .slice(offset, offset + count);
          return rows.map((row) => {
            for (const [key, value] of Object.entries(options.projection ?? {})) if (!value) delete row[key];
            return row;
          });
        },
      };
    },
  });
}
const courseDb = collection(),
  accountDb = collection(),
  attemptDb = collection();
const imports = {
  "server-only": {},
  "@/lib/dashboard/course-exams": rules,
  "@/lib/dashboard/courses": courses,
  "@/lib/models/courses": { coursesCollection: () => courseDb },
  "@/lib/models/course-exams": {
    ensureExamIndexes: async () => {},
    examAccountsCollection: () => accountDb,
    examAttemptsCollection: () => attemptDb,
  },
};
const service = load("src/lib/services/course-exams.ts", imports);
const enrollments = load("src/lib/services/courses.ts", {
  ...imports,
  "@/lib/models/auth": { usersCollection: () => collection() },
});
const alpha = { id: "alpha", name: "Alpha Student", email: "alpha@example.test" };
const beta = { id: "beta", name: "Beta Student", email: "beta@example.test" };
const question = {
  id: "q1",
  type: "mcq",
  title: "First question",
  question: "Which option?",
  options: ["Yes", "No"],
  correctOptionIndex: 0,
  explanation: "Yes is correct.",
};
const second = { ...question, id: "q2", title: "Second question", marks: 2.5, correctOptionIndex: 1 };
function fixture(id = "course-a") {
  return {
    id,
    ...clone(courses.courseDefaults),
    name: "English course",
    content: [
      clone(question),
      clone(second),
      { id: "pdf1", type: "pdf", title: "Notes", mediaId: "m1", mediaUrl: "https://example.test/notes.pdf" },
    ],
    exams: [{ id: "exam1", title: "Exam one", questionIds: ["q1", "q2"] }],
    studentsList: [alpha, beta].map((student) => ({
      userId: student.id,
      name: student.name,
      email: student.email,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      paymentStatus: "unpaid",
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
function reset() {
  courseDb.rows = [fixture(), fixture("course-b")];
  accountDb.rows = [];
  attemptDb.rows = [];
  attemptDb.failInsert = false;
}
let passed = 0;
async function check(name, test) {
  reset();
  await test();
  passed++;
  console.log(`PASS ${name}`);
}
const rejects = (run, status) =>
  assert.rejects(run, (error) => error instanceof service.CourseExamError && error.status === status);

(async () => {
  await check("legacy questions default to one mark; named exams validate references and decimal weights", async () => {
    const input = { ...fixture(), exams: undefined };
    const parsed = courses.parseCourseInput(input);
    assert.equal(parsed.content[0].marks, 1);
    assert.equal(parsed.exams[0].questionIds.length, 2);
    for (const marks of [0, -1, Infinity, 100.01, 1.001])
      assert.equal(courses.parseCourseInput({ ...fixture(), content: [{ ...question, marks }] }), null);
    assert.ok(
      courses.parseCourseInput({
        ...fixture(),
        content: [{ ...question, marks: 1.1 }],
        exams: [{ id: "e", title: "E", questionIds: ["q1"] }],
      }),
    );
    assert.equal(
      courses.parseCourseInput({ ...fixture(), exams: [{ id: "e", title: "E", questionIds: ["pdf1"] }] }),
      null,
    );
    assert.equal(
      courses.parseCourseInput({ ...fixture(), exams: [{ id: "e", title: "E", questionIds: ["q1", "q1"] }] }),
      null,
    );
  });
  await check("weighted grading handles wrong and unanswered questions and rejects forged indices", async () => {
    assert.deepEqual(rules.gradeExam([question, second], [0, 1]), {
      answers: [0, 1],
      correctCount: 2,
      score: 3.5,
      totalMarks: 3.5,
    });
    assert.equal(rules.gradeExam([question, second], [null, 1]).score, 2.5);
    for (const answers of [[0], [0, 9], ["0", 1], [-1, 0], [0.5, 1], { score: 999 }])
      assert.equal(rules.gradeExam([question, second], answers), null);
  });
  await check("result sheets distinguish weighted marks from answer counts", async () => {
    const result = {
      questions: [question, second],
      questionCount: 2,
      correctCount: 1,
      answers: [null, 1],
      score: 2.5,
      totalMarks: 3.5,
    };
    assert.deepEqual(rules.examResultSummary(result), { correct: 1, incorrect: 0, unanswered: 1, percentage: 71.4 });
    assert.deepEqual(rules.examResultSummary({ ...result, answers: [1, 0], correctCount: 0, score: 0 }), {
      correct: 0,
      incorrect: 2,
      unanswered: 0,
      percentage: 0,
    });
    assert.equal(rules.examResultSummary({ ...result, totalMarks: 0 }).percentage, 0);
  });
  await check("unapproved enrollment cannot expose documents or start exams; approval unlocks the course", async () => {
    const student = { id: "pending", name: "Pending", email: "pending@example.test" };
    await rejects(() => service.studentCourseWorkspace(student, "course-a"), 403);
    await rejects(() => service.startCourseExam(student, "course-a", "exam1"), 403);
    const request = await enrollments.createEnrollmentRequestForApi(student, "course-a");
    assert.equal(request.kind, "created");
    assert.equal(
      (await enrollments.reviewEnrollmentRequestForApi("course-a", request.request.id, "enroll")).kind,
      "updated",
    );
    assert.equal((await service.studentCourseWorkspace(student, "course-a")).course.content[0].type, "pdf");
    assert.equal(accountDb.rows.length, 1);
  });
  await check(
    "question keys and explanations stay hidden until submission and other students cannot read results",
    async () => {
      const attempt = await service.startCourseExam(alpha, "course-a", "exam1");
      const workspace = await service.studentCourseWorkspace(alpha, "course-a");
      for (const value of [attempt, workspace]) {
        assert.ok(!JSON.stringify(value).includes("correctOptionIndex"));
        assert.ok(!JSON.stringify(value).includes("explanation"));
      }
      await rejects(() => service.studentExamResult(alpha, "course-a", attempt.id), 409);
      await rejects(() => service.studentExamResult(beta, "course-a", attempt.id), 404);
      await rejects(() => service.submitCourseExam(beta, "course-a", attempt.id, [0, 1]), 404);
      await rejects(() => service.submitCourseExam(alpha, "course-b", attempt.id, [0, 1]), 404);
      const result = await service.submitCourseExam(alpha, "course-a", attempt.id, [0, 1]);
      assert.equal(result.questions[0].correctOptionIndex, 0);
      assert.equal(result.score, 3.5);
    },
  );
  await check(
    "active exams resume without another credit and final submissions are immutable and timed on the server",
    async () => {
      const attempt = await service.startCourseExam(alpha, "course-a", "exam1");
      assert.equal((await service.startCourseExam(alpha, "course-a", "exam1")).id, attempt.id);
      assert.equal(accountDb.rows[0].used, 1);
      attemptDb.rows[0].startedAt = new Date(Date.now() - 13_000).toISOString();
      courseDb.rows[0].content[0].correctOptionIndex = 1;
      courseDb.rows[0].content[1].marks = 99;
      const [first, duplicate] = await Promise.all([
        service.submitCourseExam(alpha, "course-a", attempt.id, [0, 1]),
        service.submitCourseExam(alpha, "course-a", attempt.id, [1, 0]),
      ]);
      assert.equal(first.score, duplicate.score);
      assert.equal(first.score, 3.5);
      assert.ok(first.elapsedSeconds >= 13);
      assert.equal((await service.submitCourseExam(alpha, "course-a", attempt.id, [1, 0])).score, 3.5);
      assert.equal(accountDb.rows[0].activeAttemptId, null);
    },
  );
  await check("20 complete attempts exhaust only this student's allowance in this course", async () => {
    await rejects(() => service.requestExamAllowance(alpha, "course-a"), 409);
    for (let index = 0; index < 20; index++) {
      const attempt = await service.startCourseExam(alpha, "course-a", "exam1");
      await service.submitCourseExam(alpha, "course-a", attempt.id, [0, null]);
    }
    await rejects(() => service.startCourseExam(alpha, "course-a", "exam1"), 409);
    const quota = (await service.studentCourseWorkspace(alpha, "course-a")).quota;
    assert.equal(quota.remaining, 0);
    assert.equal(quota.used, 20);
    assert.equal((await service.studentCourseWorkspace(beta, "course-a")).quota.remaining, 20);
    assert.equal((await service.studentCourseWorkspace(alpha, "course-b")).quota.remaining, 20);
  });
  await check("concurrent starts at the last credit cannot exceed the allowance", async () => {
    await service.studentCourseWorkspace(alpha, "course-a");
    accountDb.rows[0].used = 19;
    const starts = await Promise.allSettled(
      Array.from({ length: 12 }, () => service.startCourseExam(alpha, "course-a", "exam1")),
    );
    assert.ok(starts.some((value) => value.status === "fulfilled"));
    assert.equal(accountDb.rows[0].used, 20);
    assert.equal(attemptDb.rows.length, 1);
    assert.equal(
      new Set(starts.filter((value) => value.status === "fulfilled").map((value) => value.value.id)).size,
      1,
    );
    await rejects(() => service.requestExamAllowance(alpha, "course-a"), 409);
  });
  await check("extra requests grant exactly 20 once, reject duplicate moderation, and retain their audit", async () => {
    await service.studentCourseWorkspace(alpha, "course-a");
    accountDb.rows[0].used = 20;
    const requested = await service.requestExamAllowance(alpha, "course-a");
    await rejects(() => service.requestExamAllowance(alpha, "course-a"), 409);
    const reviews = await Promise.allSettled(
      Array.from({ length: 8 }, () =>
        service.reviewExamAllowance("course-a", alpha.id, requested.request.id, true, "admin"),
      ),
    );
    assert.equal(reviews.filter((value) => value.status === "fulfilled").length, 1);
    assert.equal(accountDb.rows[0].limit, 40);
    assert.equal(accountDb.rows[0].request.reviewedBy, "admin");
    await rejects(() => service.requestExamAllowance(alpha, "course-a"), 409);
    assert.equal((await service.studentCourseWorkspace(alpha, "course-b")).quota.limit, 20);
    const overview = await service.adminCourseExams("course-a");
    assert.equal(overview.accounts.find((student) => student.userId === alpha.id).quota.remaining, 20);
  });
  await check("declining an allowance does not add credits and a later request can be reviewed", async () => {
    await service.studentCourseWorkspace(alpha, "course-a");
    accountDb.rows[0].used = 20;
    const requested = await service.requestExamAllowance(alpha, "course-a");
    const declined = await service.reviewExamAllowance("course-a", alpha.id, requested.request.id, false, "admin");
    assert.equal(declined.limit, 20);
    assert.equal(declined.request.status, "rejected");
    assert.notEqual((await service.requestExamAllowance(alpha, "course-a")).request.id, requested.request.id);
  });
  await check("failed inserts roll back reservations and interrupted starts or grading can recover", async () => {
    attemptDb.failInsert = true;
    await assert.rejects(() => service.startCourseExam(alpha, "course-a", "exam1"), /Synthetic/);
    assert.equal(accountDb.rows[0].used, 0);
    assert.equal(accountDb.rows[0].activeAttemptId, null);
    attemptDb.failInsert = false;
    Object.assign(accountDb.rows[0], {
      used: 1,
      activeAttemptId: "missing",
      reservationAt: new Date(Date.now() - 180_000).toISOString(),
    });
    assert.equal((await service.studentCourseWorkspace(alpha, "course-a")).quota.used, 0);
    const attempt = await service.startCourseExam(alpha, "course-a", "exam1");
    await service.submitCourseExam(alpha, "course-a", attempt.id, [null, null]);
    accountDb.rows[0].activeAttemptId = attempt.id;
    assert.equal((await service.studentCourseWorkspace(alpha, "course-a")).active, null);
    assert.equal(accountDb.rows[0].activeAttemptId, null);
  });
  await check("student API takes identity from the session, never a client user id or marks", async () => {
    const routes = load("src/app/api/dashboard/my-course/v1/exams/route.ts", {
      "@/app/api/lib/course-exam-access": {
        authorizeCourseExam: async () => ({ session: { user: alpha }, error: null }),
        examId: (value) => (typeof value === "string" ? value.trim() : ""),
        examError: (error) => Response.json({ error: error.message }, { status: error.status ?? 500 }),
      },
      "@/lib/services/course-exams": service,
    });
    const response = await routes.POST(
      new Request("http://local/api/dashboard/my-course/v1/exams", {
        method: "POST",
        body: JSON.stringify({
          action: "start",
          courseId: "course-a",
          examId: "exam1",
          userId: beta.id,
          score: 999,
          startedAt: "2000-01-01",
        }),
      }),
    );
    assert.equal(response.status, 200);
    const attempt = (await response.json()).attempt;
    assert.equal(attempt.userId, alpha.id);
    assert.equal(attempt.score, null);
    assert.ok(!JSON.stringify(attempt).includes("correctOptionIndex"));
    const invalid = await routes.POST(new Request("http://local", { method: "POST", body: "{}" }));
    assert.equal(invalid.status, 400);
  });
  await check("staff exam API rejects anonymous and unauthorized sessions before reading results", async () => {
    let called = false;
    for (const status of [401, 403]) {
      const routes = load("src/app/api/dashboard/courses/v1/exams/route.ts", {
        "@/app/api/lib/course-exam-access": {
          authorizeCourseExam: async () => ({ error: Response.json({ error: "Denied" }, { status }) }),
        },
        "@/lib/services/course-exams": {
          adminCourseExams: async () => {
            called = true;
          },
        },
      });
      assert.equal((await routes.GET(new Request("http://local?courseId=course-a"))).status, status);
      assert.equal((await routes.PATCH(new Request("http://local", { method: "PATCH" }))).status, status);
    }
    assert.equal(called, false);
  });
  console.log(`Course exams: ${passed} scenarios passed, without live database writes.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
