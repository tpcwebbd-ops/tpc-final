/*
|-----------------------------------------
| setting up enrollment-gated exams, atomic allowances, and immutable graded attempts
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import {
  EXAM_ALLOWANCE,
  gradeExam,
  publicExamQuestions,
  type ExamAdminOverview,
  type ExamQuota,
  type ExamResult,
} from "@/lib/dashboard/course-exams";
import { courseProgress, courseExams, questionMarks, type CourseMcqContent } from "@/lib/dashboard/courses";
import {
  ensureExamIndexes,
  examAccountsCollection,
  examAttemptsCollection,
  type ExamAccountDocument,
  type ExamAttemptDocument,
} from "@/lib/models/course-exams";
import { coursesCollection, type CourseDocument } from "@/lib/models/courses";

export class CourseExamError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
type Student = { id: string; name?: string | null; email?: string | null };
const accountId = (courseId: string, userId: string) => JSON.stringify([courseId, userId]);
const quota = (account: ExamAccountDocument): ExamQuota => ({
  limit: account.limit,
  used: account.used,
  remaining: Math.max(0, account.limit - account.used),
  request: account.request,
});
const summary = (attempt: ExamAttemptDocument) => {
  const { _id, questions, answers, ...item } = attempt;
  void _id;
  void questions;
  void answers;
  return item;
};
const result = (attempt: ExamAttemptDocument): ExamResult => {
  if (attempt.status !== "submitted") throw new CourseExamError(409, "Submit the exam before viewing its answers.");
  return { ...summary(attempt), status: "submitted", questions: attempt.questions, answers: attempt.answers };
};
const publicAttempt = (attempt: ExamAttemptDocument) => ({
  ...summary(attempt),
  questions: publicExamQuestions(attempt.questions),
});

async function enrolledCourse(courseId: string, userId: string) {
  const course = await coursesCollection().findOne({ id: courseId });
  if (!course) throw new CourseExamError(404, "Course not found.");
  if (!course.studentsList.some((student) => student.userId === userId))
    throw new CourseExamError(403, "Your enrollment must be approved before accessing this course.");
  return course;
}

async function accountFor(courseId: string, student: Student) {
  await ensureExamIndexes();
  const _id = accountId(courseId, student.id);
  try {
    await examAccountsCollection().updateOne(
      { _id },
      {
        $setOnInsert: {
          courseId,
          userId: student.id,
          studentName: student.name || "Student",
          studentEmail: student.email || "",
          limit: EXAM_ALLOWANCE,
          used: 0,
          activeAttemptId: null,
          reservationAt: null,
          request: null,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    if (!error || typeof error !== "object" || !("code" in error) || error.code !== 11000) throw error;
  }
  const account = await examAccountsCollection().findOne({ _id });
  if (!account) throw new CourseExamError(503, "Could not load your exam allowance. Please retry.");
  // Recover if the previous response was interrupted after grading but before clearing the active slot.
  if (account.activeAttemptId) {
    const attempt = await examAttemptsCollection().findOne({ _id: account.activeAttemptId, userId: student.id });
    if (attempt?.status === "submitted") {
      await examAccountsCollection().updateOne(
        { _id, activeAttemptId: attempt.id },
        { $set: { activeAttemptId: null, reservationAt: null } },
      );
      account.activeAttemptId = null;
    } else if (!attempt && account.reservationAt && Date.now() - Date.parse(account.reservationAt) > 120_000) {
      // A server restart between slot reservation and attempt insertion must not strand a student.
      const recovered = await examAccountsCollection().findOneAndUpdate(
        { _id, activeAttemptId: account.activeAttemptId, reservationAt: account.reservationAt },
        { $inc: { used: -1 }, $set: { activeAttemptId: null, reservationAt: null } },
        { returnDocument: "after" },
      );
      if (recovered) return recovered;
    }
  }
  return account;
}

function examQuestions(course: CourseDocument, examId: string) {
  const exam = courseExams(course).find((item) => item.id === examId);
  if (!exam) throw new CourseExamError(404, "Exam not found.");
  const questions = exam.questionIds.map((id) => course.content.find((item) => item.id === id && item.type === "mcq"));
  if (!questions.length || questions.length > 200 || questions.some((item) => !item))
    throw new CourseExamError(409, "This exam needs valid questions before it can be taken.");
  return {
    exam,
    questions: (questions as CourseMcqContent[]).map((item) => ({ ...item, marks: questionMarks(item) })),
  };
}

export async function studentCourseWorkspace(student: Student, courseId: string) {
  const course = await enrolledCourse(courseId, student.id);
  const account = await accountFor(courseId, student);
  const attempts = await examAttemptsCollection()
    .find({ courseId, userId: student.id }, { projection: { questions: 0, answers: 0 } })
    .sort({ startedAt: -1 })
    .toArray();
  const active = account.activeAttemptId
    ? await examAttemptsCollection().findOne({ _id: account.activeAttemptId, userId: student.id, courseId })
    : null;
  return {
    course: { id: course.id, name: course.name, content: course.content.filter((item) => item.type !== "mcq") },
    exams: courseExams(course).map((exam) => {
      const questions = exam.questionIds.map((id) =>
        course.content.find((item) => item.id === id && item.type === "mcq"),
      );
      return {
        id: exam.id,
        title: exam.title,
        questionCount: questions.length,
        totalMarks:
          Math.round(
            questions.reduce((total, item) => total + (item?.type === "mcq" ? questionMarks(item) : 0), 0) * 100,
          ) / 100,
      };
    }),
    progress: courseProgress(
      course,
      account.completedLectureIds ?? [],
      attempts.filter((item) => item.status === "submitted").map((item) => item.examId),
    ),
    quota: quota(account),
    attempts: attempts.map(summary),
    active: active?.status === "in-progress" ? publicAttempt(active) : null,
  };
}

export async function startCourseExam(student: Student, courseId: string, examId: string) {
  const course = await enrolledCourse(courseId, student.id);
  const account = await accountFor(courseId, student);
  if (account.activeAttemptId) {
    const active = await examAttemptsCollection().findOne({
      _id: account.activeAttemptId,
      userId: student.id,
      courseId,
    });
    if (!active) throw new CourseExamError(409, "Your exam is starting. Please retry in a moment.");
    return publicAttempt(active);
  }
  const { exam, questions } = examQuestions(course, examId);
  const id = randomUUID();
  const reserved = await examAccountsCollection().findOneAndUpdate(
    { _id: account._id, activeAttemptId: null, $expr: { $lt: ["$used", "$limit"] } },
    { $inc: { used: 1 }, $set: { activeAttemptId: id, reservationAt: new Date().toISOString() } },
    { returnDocument: "after" },
  );
  if (!reserved)
    throw new CourseExamError(409, "No exam slot is available. Resume your active exam or request more attempts.");
  const attempt: ExamAttemptDocument = {
    _id: id,
    id,
    courseId,
    courseName: course.name,
    examId,
    examTitle: exam.title,
    userId: student.id,
    studentName: student.name || "Student",
    studentEmail: student.email || "",
    status: "in-progress",
    startedAt: new Date().toISOString(),
    submittedAt: null,
    elapsedSeconds: null,
    score: null,
    correctCount: null,
    totalMarks: gradeExam(
      questions,
      questions.map(() => null),
    )!.totalMarks,
    questionCount: questions.length,
    questions,
    answers: [],
  };
  try {
    await examAttemptsCollection().insertOne(attempt);
  } catch (error) {
    await examAccountsCollection().updateOne(
      { _id: account._id, activeAttemptId: id },
      { $inc: { used: -1 }, $set: { activeAttemptId: null, reservationAt: null } },
    );
    throw error;
  }
  return publicAttempt(attempt);
}

export async function submitCourseExam(student: Student, courseId: string, attemptId: string, answers: unknown) {
  await enrolledCourse(courseId, student.id);
  const filter = { _id: attemptId, courseId, userId: student.id };
  const attempt = await examAttemptsCollection().findOne(filter);
  if (!attempt) throw new CourseExamError(404, "Exam attempt not found.");
  if (attempt.status === "submitted") return result(attempt);
  const account = await examAccountsCollection().findOne({
    _id: accountId(courseId, student.id),
    activeAttemptId: attemptId,
  });
  if (!account) throw new CourseExamError(409, "This exam no longer has a reserved attempt. Refresh your course.");
  const graded = gradeExam(attempt.questions, answers);
  if (!graded) throw new CourseExamError(400, "Provide one valid answer or an unanswered value for every question.");
  const now = new Date();
  const updated = await examAttemptsCollection().findOneAndUpdate(
    { ...filter, status: "in-progress" },
    {
      $set: {
        ...graded,
        status: "submitted",
        submittedAt: now.toISOString(),
        elapsedSeconds: Math.max(0, Math.floor((now.getTime() - Date.parse(attempt.startedAt)) / 1000)),
      },
    },
    { returnDocument: "after" },
  );
  const saved = updated ?? (await examAttemptsCollection().findOne(filter));
  if (!saved || saved.status !== "submitted")
    throw new CourseExamError(409, "Could not submit this exam. Please retry.");
  await examAccountsCollection().updateOne(
    { _id: accountId(courseId, student.id), activeAttemptId: attemptId },
    { $set: { activeAttemptId: null, reservationAt: null } },
  );
  return result(saved);
}

export async function studentExamResult(student: Student, courseId: string, attemptId: string) {
  await enrolledCourse(courseId, student.id);
  const attempt = await examAttemptsCollection().findOne({ _id: attemptId, courseId, userId: student.id });
  if (!attempt) throw new CourseExamError(404, "Exam attempt not found.");
  return result(attempt);
}

export async function requestExamAllowance(student: Student, courseId: string) {
  await enrolledCourse(courseId, student.id);
  const account = await accountFor(courseId, student);
  const updated = await examAccountsCollection().findOneAndUpdate(
    {
      _id: account._id,
      activeAttemptId: null,
      "request.status": { $ne: "pending" },
      $expr: { $gte: ["$used", "$limit"] },
    },
    { $set: { request: { id: randomUUID(), status: "pending", requestedAt: new Date().toISOString() } } },
    { returnDocument: "after" },
  );
  if (!updated)
    throw new CourseExamError(
      409,
      "Complete your available exams first, or wait for your pending request to be reviewed.",
    );
  return quota(updated);
}

export async function adminCourseExams(courseId: string, page = 1): Promise<ExamAdminOverview> {
  const course = await coursesCollection().findOne({ id: courseId });
  if (!course) throw new CourseExamError(404, "Course not found.");
  await ensureExamIndexes();
  const [attempts, total, accounts, submitted] = await Promise.all([
    examAttemptsCollection()
      .find({ courseId }, { projection: { questions: 0, answers: 0 } })
      .sort({ startedAt: -1 })
      .skip((page - 1) * 50)
      .limit(50)
      .toArray(),
    examAttemptsCollection().countDocuments({ courseId }),
    examAccountsCollection().find({ courseId }).toArray(),
    examAttemptsCollection()
      .find({ courseId, status: "submitted" }, { projection: { userId: 1, examId: 1 } })
      .toArray(),
  ]);
  return {
    attempts: attempts.map(summary),
    total,
    page,
    accounts: course.studentsList.map((student) => {
      const account = accounts.find((item) => item.userId === student.userId);
      return {
        userId: student.userId,
        studentName: student.name,
        studentEmail: student.email,
        progress: courseProgress(
          course,
          account?.completedLectureIds ?? [],
          submitted.filter((item) => item.userId === student.userId).map((item) => item.examId),
        ).percentage,
        quota: account ? quota(account) : { limit: EXAM_ALLOWANCE, used: 0, remaining: EXAM_ALLOWANCE, request: null },
      };
    }),
  };
}

export async function reviewExamAllowance(
  courseId: string,
  userId: string,
  requestId: string,
  approve: boolean,
  reviewerId: string,
) {
  await enrolledCourse(courseId, userId);
  const updated = await examAccountsCollection().findOneAndUpdate(
    {
      _id: accountId(courseId, userId),
      "request.id": requestId,
      "request.status": "pending",
    },
    {
      ...(approve ? { $inc: { limit: EXAM_ALLOWANCE } } : {}),
      $set: {
        "request.status": approve ? "approved" : "rejected",
        "request.reviewedAt": new Date().toISOString(),
        "request.reviewedBy": reviewerId,
      },
    },
    { returnDocument: "after" },
  );
  if (!updated) throw new CourseExamError(409, "This allowance request is no longer pending.");
  return quota(updated);
}

export async function completeCourseLecture(student: Student, courseId: string, lectureId: string) {
  const course = await enrolledCourse(courseId, student.id);
  if (!course.content.some((item) => item.id === lectureId && item.type !== "mcq"))
    throw new CourseExamError(404, "Tutorial not found.");
  const account = await accountFor(courseId, student);
  await examAccountsCollection().updateOne({ _id: account._id }, { $addToSet: { completedLectureIds: lectureId } });
  return studentCourseWorkspace(student, courseId);
}
