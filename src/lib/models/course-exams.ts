/*
|-----------------------------------------
| setting up persistent course exam attempts and per-course student allowances
|-----------------------------------------
*/

import "server-only";

import type { ExamAllowanceRequest, ExamAttemptSummary } from "@/lib/dashboard/course-exams";
import type { CourseMcqContent } from "@/lib/dashboard/courses";
import { database } from "@/lib/db";

export type ExamAccountDocument = {
  _id: string;
  courseId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  limit: number;
  used: number;
  activeAttemptId: string | null;
  reservationAt: string | null;
  request: ExamAllowanceRequest | null;
};
export type ExamAttemptDocument = ExamAttemptSummary & {
  _id: string;
  questions: CourseMcqContent[];
  answers: (number | null)[];
};
export const examAccountsCollection = () => database().collection<ExamAccountDocument>("course_exam_accounts");
export const examAttemptsCollection = () => database().collection<ExamAttemptDocument>("course_exam_attempts");

let indexes: Promise<unknown> | undefined;
export function ensureExamIndexes() {
  indexes ??= Promise.all([
    examAttemptsCollection().createIndex({ courseId: 1, userId: 1, startedAt: -1 }),
    examAttemptsCollection().createIndex({ courseId: 1, startedAt: -1 }),
    examAccountsCollection().createIndex({ courseId: 1 }),
  ]).catch((error) => {
    indexes = undefined;
    throw error;
  });
  return indexes;
}
