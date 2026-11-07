/*
|-----------------------------------------
| setting up course-status.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 7 November, 2026
|-----------------------------------------
*/

import type { ExamAttemptSummary } from "./course-exams";

// Presentation threshold only; this does not change grading or stored marks.
export const EXAM_PASS_PERCENTAGE = 50;
export const statusStyles = {
  excellent: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 text-emerald-900",
  complete: "border-emerald-200 bg-emerald-50 text-emerald-900",
  passed: "border-sky-200 bg-sky-50 text-sky-900",
  failed: "border-rose-200 bg-rose-50 text-rose-900",
  unfinished: "border-rose-200 bg-rose-50 text-rose-900",
  learning: "border-sky-200 bg-sky-50 text-sky-900",
  pending: "border-amber-200 bg-amber-50 text-amber-900",
};
export function examStatus(attempt?: Pick<ExamAttemptSummary, "status" | "score" | "totalMarks">) {
  if (!attempt) return { label: "Not started", style: statusStyles.pending, percentage: null };
  if (attempt.status !== "submitted" || attempt.score === null)
    return { label: "Unfinished", style: statusStyles.unfinished, percentage: null };
  const percentage = attempt.totalMarks > 0 ? Math.round((attempt.score / attempt.totalMarks) * 1000) / 10 : 0;
  if (percentage > 80) return { label: "Excellent", style: statusStyles.excellent, percentage };
  if (percentage >= EXAM_PASS_PERCENTAGE) return { label: "Passed", style: statusStyles.passed, percentage };
  return { label: "Failed", style: statusStyles.failed, percentage };
}
export function learningStatus(progress: number) {
  return progress >= 100
    ? { label: "Completed", style: statusStyles.complete }
    : progress > 0
      ? { label: "In progress", style: statusStyles.learning }
      : { label: "Not started", style: statusStyles.pending };
}
