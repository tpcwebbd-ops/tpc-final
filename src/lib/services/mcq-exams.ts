/*
|-----------------------------------------
| setting up atomic public MCQ attempts, server timing, and result reporting
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "node:crypto";

import {
  McqExamError,
  mcqExamQuestions,
  mcqQuestionMarks,
  mcqTotalMarks,
  normalizeMcqMobile,
  validateMcqExam,
  type McqAttemptSummary,
  type McqExam,
  type McqExamSummary,
  type McqPublicExam,
  type McqResult,
  type McqStudentState,
} from "@/lib/dashboard/mcq-exams";
import {
  ensureMcqIndexes,
  mcqAccountsCollection,
  mcqAttemptsCollection,
  mcqExamsCollection,
  type McqAttemptDocument,
  type McqExamDocument,
} from "@/lib/models/mcq-exams";

const accountId = (examId: string, mobile: string) => JSON.stringify([examId, mobile]);
const examView = ({ _id, deleting, ...exam }: McqExamDocument): McqExam => {
  void _id;
  void deleting;
  return { ...exam, questions: mcqExamQuestions(exam.questions) };
};
function attemptSummary(attempt: McqAttemptDocument): McqAttemptSummary {
  if (attempt.status !== "submitted" || !attempt.submittedAt)
    throw new McqExamError(409, "Complete this exam to view its result.");
  return {
    id: attempt._id,
    examId: attempt.examId,
    examTitle: attempt.examTitle,
    studentName: attempt.studentName,
    mobile: attempt.mobile,
    attemptNumber: attempt.attemptNumber,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    score: attempt.score,
    totalMarks: mcqTotalMarks(attempt.questions),
    totalTimeMs: attempt.totalTimeMs,
  };
}
function attemptResult(attempt: McqAttemptDocument): McqResult {
  return {
    ...attemptSummary(attempt),
    questions: attempt.questions,
    answers: attempt.answers,
    questionTimesMs: attempt.questionTimesMs,
  };
}
function studentState(attempt: McqAttemptDocument): McqStudentState {
  if (attempt.status === "submitted") return { status: "submitted", result: attemptResult(attempt) };
  const currentQuestion = attempt.questions[attempt.answeredCount];
  const { id, question, options } = currentQuestion;
  return {
    status: "in-progress",
    attempt: {
      id: attempt._id,
      studentName: attempt.studentName,
      mobile: attempt.mobile,
      attemptNumber: attempt.attemptNumber,
      questionCount: attempt.questions.length,
      totalMarks: mcqTotalMarks(attempt.questions),
      questionIndex: attempt.answeredCount,
      question: { id, question, options, marks: mcqQuestionMarks(currentQuestion) },
      startedAt: attempt.startedAt,
      questionStartedAt: attempt.questionStartedAt,
      serverNow: new Date().toISOString(),
    },
  };
}
async function examBySlug(slug: string) {
  const exam = await mcqExamsCollection().findOne({ slug, deleting: { $ne: true } });
  if (!exam) throw new McqExamError(404, "This examination link was not found.");
  return { ...exam, questions: mcqExamQuestions(exam.questions) };
}

export async function saveMcqExam(value: unknown, id?: string) {
  const input = validateMcqExam(value);
  await ensureMcqIndexes();
  const now = new Date().toISOString();
  if (id) {
    const updated = await mcqExamsCollection().findOneAndUpdate(
      { _id: id, deleting: { $ne: true } },
      { $set: { ...input, updatedAt: now } },
      { returnDocument: "after" },
    );
    if (!updated) throw new McqExamError(404, "Examination not found.");
    return examView(updated);
  }
  const exam: McqExamDocument = {
    ...input,
    _id: randomUUID(),
    id: "",
    slug: randomUUID().replaceAll("-", ""),
    createdAt: now,
    updatedAt: now,
  };
  exam.id = exam._id;
  await mcqExamsCollection().insertOne(exam);
  return examView(exam);
}

export async function getMcqExam(id: string) {
  const exam = await mcqExamsCollection().findOne({ _id: id, deleting: { $ne: true } });
  if (!exam) throw new McqExamError(404, "Examination not found.");
  return examView(exam);
}

export async function deleteMcqExam(id: string) {
  // Block new registrations before cleanup. Keeping this record until cleanup
  // succeeds lets an administrator safely retry an interrupted deletion.
  const exam = await mcqExamsCollection().findOneAndUpdate(
    { _id: id },
    { $set: { deleting: true } },
    { returnDocument: "after" },
  );
  if (!exam) throw new McqExamError(404, "Examination not found.");
  const [attempts, accounts] = await Promise.all([
    mcqAttemptsCollection().deleteMany({ examId: id }),
    mcqAccountsCollection().deleteMany({ examId: id }),
  ]);
  await mcqExamsCollection().deleteOne({ _id: id });
  return { ok: true, deletedAttempts: attempts.deletedCount, deletedStudents: accounts.deletedCount };
}

async function ensureRegistrationExamExists(examId: string) {
  const exam = await mcqExamsCollection().findOne({ _id: examId, deleting: { $ne: true } });
  if (exam) return;
  // An already-running registration may finish a write after deletion started.
  // Remove those late writes rather than leaving orphaned student data.
  await Promise.all([mcqAttemptsCollection().deleteMany({ examId }), mcqAccountsCollection().deleteMany({ examId })]);
  throw new McqExamError(404, "This examination is no longer available.");
}

export async function listMcqExams(page: number) {
  await ensureMcqIndexes();
  const [exams, total] = await Promise.all([
    mcqExamsCollection()
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * 25)
      .limit(25)
      .toArray(),
    mcqExamsCollection().countDocuments({}),
  ]);
  const ids = exams.map((exam) => exam.id);
  const counts = await mcqAttemptsCollection()
    .aggregate<{ _id: string; participants: number; completedAttempts: number }>([
      { $match: { examId: { $in: ids }, status: "submitted" } },
      { $group: { _id: { examId: "$examId", mobile: "$mobile" }, count: { $sum: 1 } } },
      { $group: { _id: "$_id.examId", participants: { $sum: 1 }, completedAttempts: { $sum: "$count" } } },
    ])
    .toArray();
  const items: McqExamSummary[] = exams.map((exam) => {
    const { questions, ...item } = examView(exam);
    const count = counts.find((entry) => entry._id === exam.id);
    return {
      ...item,
      questionCount: questions.length,
      totalMarks: mcqTotalMarks(questions),
      participants: count?.participants ?? 0,
      completedAttempts: count?.completedAttempts ?? 0,
    };
  });
  return { items, total, page };
}

export async function publicMcqExam(slug: string, tokenHash: string): Promise<McqPublicExam> {
  const exam = await examBySlug(slug);
  const latest = await mcqAttemptsCollection()
    .find({ examId: exam.id, tokenHash })
    .sort({ startedAt: -1 })
    .limit(1)
    .toArray();
  return {
    title: exam.title,
    questionCount: exam.questions.length,
    totalMarks: mcqTotalMarks(exam.questions),
    maxAttempts: exam.maxAttempts,
    state: latest[0] ? studentState(latest[0]) : null,
  };
}

export async function startMcqExam(slug: string, tokenHash: string, value: unknown): Promise<McqStudentState> {
  const body = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const studentName = typeof body.name === "string" ? body.name.trim() : "";
  const mobile = normalizeMcqMobile(body.mobile);
  const id = typeof body.attemptId === "string" ? body.attemptId : "";
  if (!studentName || studentName.length > 120 || !mobile || !/^[a-f0-9-]{36}$/i.test(id))
    throw new McqExamError(400, "Enter your name (up to 120 characters) and a valid mobile number.");
  const exam = await examBySlug(slug);
  await ensureMcqIndexes();
  // A repeated registration request returns the same attempt without consuming another slot.
  const previous = await mcqAttemptsCollection().findOne({ _id: id });
  if (previous) {
    if (previous.examId !== exam.id || previous.tokenHash !== tokenHash || previous.mobile !== mobile)
      throw new McqExamError(409, "Please reload the examination and try again.");
    return studentState(previous);
  }
  const _id = accountId(exam.id, mobile);
  try {
    await mcqAccountsCollection().updateOne(
      { _id },
      { $setOnInsert: { examId: exam.id, mobile, used: 0, activeAttemptId: null, reservationAt: null } },
      { upsert: true },
    );
  } catch (error) {
    if (!error || typeof error !== "object" || !("code" in error) || error.code !== 11000) throw error;
  }
  await ensureRegistrationExamExists(exam.id);
  let account = await mcqAccountsCollection().findOne({ _id });
  if (!account) throw new McqExamError(503, "Could not start the examination. Please retry.");
  if (account.activeAttemptId) {
    const active = await mcqAttemptsCollection().findOne({ _id: account.activeAttemptId });
    if (active?.status === "in-progress") {
      if (active.tokenHash !== tokenHash)
        throw new McqExamError(
          409,
          "An examination is already in progress for this mobile number. Continue in the browser where it was started.",
        );
      return studentState(active);
    }
    if (active?.status === "submitted") {
      await mcqAccountsCollection().updateOne(
        { _id, activeAttemptId: active._id },
        { $set: { activeAttemptId: null, reservationAt: null } },
      );
    } else if (!active && account.reservationAt && Date.now() - Date.parse(account.reservationAt) > 120_000) {
      // Recover a slot left behind by a server restart during registration.
      await mcqAccountsCollection().updateOne(
        { _id, activeAttemptId: account.activeAttemptId, reservationAt: account.reservationAt },
        { $inc: { used: -1 }, $set: { activeAttemptId: null, reservationAt: null } },
      );
    }
  }
  const reserved = await mcqAccountsCollection().findOneAndUpdate(
    { _id, activeAttemptId: null, used: { $lt: exam.maxAttempts } },
    { $inc: { used: 1 }, $set: { activeAttemptId: id, reservationAt: new Date().toISOString() } },
    { returnDocument: "after" },
  );
  if (!reserved) {
    account = await mcqAccountsCollection().findOne({ _id });
    if ((account?.used ?? 0) >= exam.maxAttempts)
      throw new McqExamError(403, `The maximum of ${exam.maxAttempts} attempts for this examination has been reached.`);
    throw new McqExamError(409, "Your examination is starting. Please retry in a moment.");
  }
  const now = new Date().toISOString();
  const attempt: McqAttemptDocument = {
    _id: id,
    examId: exam.id,
    examTitle: exam.title,
    studentName,
    mobile,
    tokenHash,
    attemptNumber: reserved.used,
    status: "in-progress",
    startedAt: now,
    questionStartedAt: now,
    submittedAt: null,
    questions: exam.questions,
    answers: [],
    questionTimesMs: [],
    answeredCount: 0,
    score: 0,
    totalTimeMs: 0,
  };
  try {
    await mcqAttemptsCollection().insertOne(attempt);
  } catch (error) {
    // If another identical request inserted the same attempt, keep its reservation.
    const saved = await mcqAttemptsCollection().findOne({ _id: id, examId: exam.id, tokenHash });
    if (saved) {
      await ensureRegistrationExamExists(exam.id);
      return studentState(saved);
    }
    await mcqAccountsCollection().updateOne(
      { _id, activeAttemptId: id },
      { $inc: { used: -1 }, $set: { activeAttemptId: null, reservationAt: null } },
    );
    throw error;
  }
  await ensureRegistrationExamExists(exam.id);
  return studentState(attempt);
}

export async function answerMcqQuestion(slug: string, tokenHash: string, value: unknown): Promise<McqStudentState> {
  const body = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const exam = await examBySlug(slug);
  const attempt = await mcqAttemptsCollection().findOne({
    _id: typeof body.attemptId === "string" ? body.attemptId : "",
    examId: exam.id,
    tokenHash,
  });
  if (!attempt) throw new McqExamError(404, "Your examination session was not found. Reload the page.");
  const index = body.questionIndex;
  const answer = body.answer;
  if (
    typeof index !== "number" ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= attempt.questions.length ||
    typeof answer !== "number" ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= attempt.questions[index].options.length
  )
    throw new McqExamError(400, "Select a valid answer for the current question.");
  if (index < attempt.answeredCount && attempt.answers[index] === answer) return studentState(attempt);
  if (attempt.status !== "in-progress" || index !== attempt.answeredCount)
    throw new McqExamError(
      409,
      "This question has already been submitted. Reload to continue from your saved progress.",
    );
  const now = new Date();
  const questionTimesMs = [
    ...attempt.questionTimesMs,
    Math.max(0, now.getTime() - Date.parse(attempt.questionStartedAt)),
  ];
  const answers = [...attempt.answers, answer];
  const finished = answers.length === attempt.questions.length;
  const saved = await mcqAttemptsCollection().findOneAndUpdate(
    { _id: attempt._id, tokenHash, status: "in-progress", answeredCount: index },
    {
      $set: {
        answers,
        questionTimesMs,
        answeredCount: answers.length,
        questionStartedAt: now.toISOString(),
        totalTimeMs: questionTimesMs.reduce((sum, time) => sum + time, 0),
        score:
          Math.round(
            (attempt.score +
              (answer === attempt.questions[index].correctOptionIndex
                ? mcqQuestionMarks(attempt.questions[index])
                : 0)) *
              100,
          ) / 100,
        ...(finished ? { status: "submitted" as const, submittedAt: now.toISOString() } : {}),
      },
    },
    { returnDocument: "after" },
  );
  if (!saved) {
    const current = await mcqAttemptsCollection().findOne({ _id: attempt._id, tokenHash });
    if (current && current.answers[index] === answer) return studentState(current);
    throw new McqExamError(409, "Another tab submitted this question. Reload to continue.");
  }
  return studentState(saved);
}

export async function mcqExamResults(examId: string, page: number) {
  await getMcqExam(examId);
  const filter = { examId, status: "submitted" as const };
  const [attempts, total, counts] = await Promise.all([
    mcqAttemptsCollection()
      .find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * 50)
      .limit(50)
      .toArray(),
    mcqAttemptsCollection().countDocuments(filter),
    mcqAttemptsCollection()
      .aggregate<{ count: number }>([{ $match: filter }, { $group: { _id: "$mobile" } }, { $count: "count" }])
      .toArray(),
  ]);
  return { items: attempts.map(attemptSummary), total, participants: counts[0]?.count ?? 0, page };
}

export async function mcqExamResult(examId: string, attemptId: string): Promise<McqResult> {
  await getMcqExam(examId);
  const attempt = await mcqAttemptsCollection().findOne({ _id: attemptId, examId, status: "submitted" });
  if (!attempt) throw new McqExamError(404, "Examination result not found.");
  return attemptResult(attempt);
}
