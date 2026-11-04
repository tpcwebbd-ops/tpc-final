/*
|-----------------------------------------
| setting up course exam contracts and server grading rules
|-----------------------------------------
*/

import { questionMarks, type CourseMcqContent, type CourseMediaContent } from "./courses";

export const EXAM_ALLOWANCE = 20;
export type ExamQuestion = Omit<CourseMcqContent, "correctOptionIndex" | "explanation">;
export type ExamAllowanceRequest = {
  id: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
};
export type ExamQuota = { limit: number; used: number; remaining: number; request: ExamAllowanceRequest | null };
export type ExamAttemptSummary = {
  id: string;
  courseId: string;
  courseName: string;
  examId: string;
  examTitle: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  status: "in-progress" | "submitted";
  startedAt: string;
  submittedAt: string | null;
  elapsedSeconds: number | null;
  score: number | null;
  totalMarks: number;
  correctCount: number | null;
  questionCount: number;
};
export type ExamResult = ExamAttemptSummary & {
  status: "submitted";
  questions: CourseMcqContent[];
  answers: (number | null)[];
};
export type ActiveExam = ExamAttemptSummary & { questions: ExamQuestion[] };
export type CourseWorkspace = {
  course: { id: string; name: string; content: CourseMediaContent[] };
  exams: { id: string; title: string; questionCount: number; totalMarks: number }[];
  quota: ExamQuota;
  attempts: ExamAttemptSummary[];
  active: ActiveExam | null;
};
export type ExamAdminOverview = {
  attempts: ExamAttemptSummary[];
  page: number;
  total: number;
  accounts: { userId: string; studentName: string; studentEmail: string; quota: ExamQuota }[];
};

export function publicExamQuestions(questions: CourseMcqContent[]): ExamQuestion[] {
  return questions.map(({ id, type, title, question, options, marks }) => ({
    id,
    type,
    title,
    question,
    options: [...options],
    marks: marks ?? 1,
  }));
}

/** Accept only answer indices; scores, answer keys, and timing never come from the client. */
export function gradeExam(questions: CourseMcqContent[], value: unknown) {
  if (!Array.isArray(value) || value.length !== questions.length) return null;
  if (
    value.some(
      (answer, index) =>
        answer !== null && (!Number.isInteger(answer) || answer < 0 || answer >= questions[index].options.length),
    )
  )
    return null;
  const answers = value as (number | null)[];
  let correctCount = 0;
  let score = 0;
  let totalMarks = 0;
  questions.forEach((question, index) => {
    const marks = questionMarks(question);
    totalMarks += marks;
    if (answers[index] === question.correctOptionIndex) {
      correctCount++;
      score += marks;
    }
  });
  return {
    answers,
    correctCount,
    score: Math.round(score * 100) / 100,
    totalMarks: Math.round(totalMarks * 100) / 100,
  };
}

export function examDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}

export function examResultSummary(result: ExamResult) {
  const unanswered = result.questions.filter((_, index) => result.answers[index] == null).length;
  const correct =
    result.correctCount ??
    result.questions.filter((question, index) => result.answers[index] === question.correctOptionIndex).length;
  return {
    correct,
    unanswered,
    incorrect: Math.max(0, result.questionCount - unanswered - correct),
    percentage: result.totalMarks > 0 ? Math.round(((result.score ?? 0) / result.totalMarks) * 1000) / 10 : 0,
  };
}
