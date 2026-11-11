/*
|-----------------------------------------
| setting up durable public MCQ exams, student quotas, and attempts
|-----------------------------------------
*/

import "server-only";

import type { McqExam, McqQuestion } from "@/lib/dashboard/mcq-exams";
import { database } from "@/lib/db";

export type McqExamDocument = McqExam & { _id: string; deleting?: boolean };
export type McqAccountDocument = {
  _id: string;
  examId: string;
  mobile: string;
  used: number;
  activeAttemptId: string | null;
  reservationAt: string | null;
};
export type McqAttemptDocument = {
  _id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  mobile: string;
  tokenHash: string;
  attemptNumber: number;
  status: "in-progress" | "submitted";
  startedAt: string;
  questionStartedAt: string;
  submittedAt: string | null;
  questions: McqQuestion[];
  answers: number[];
  questionTimesMs: number[];
  answeredCount: number;
  score: number;
  totalTimeMs: number;
};
export const mcqExamsCollection = () => database().collection<McqExamDocument>("mcq_exams");
export const mcqAccountsCollection = () => database().collection<McqAccountDocument>("mcq_accounts");
export const mcqAttemptsCollection = () => database().collection<McqAttemptDocument>("mcq_attempts");

let indexes: Promise<unknown> | undefined;
export function ensureMcqIndexes() {
  indexes ??= Promise.all([
    mcqExamsCollection().createIndex({ slug: 1 }, { unique: true }),
    mcqAccountsCollection().createIndex({ examId: 1, mobile: 1 }, { unique: true }),
    mcqAttemptsCollection().createIndex({ examId: 1, status: 1, submittedAt: -1 }),
    mcqAttemptsCollection().createIndex({ examId: 1, tokenHash: 1, startedAt: -1 }),
  ]).catch((error) => {
    indexes = undefined;
    throw error;
  });
  return indexes;
}
