/*
|-----------------------------------------
| setting up public MCQ examination contracts and validation
|-----------------------------------------
*/

export const DEFAULT_MCQ_ATTEMPTS = 3;
export const MAX_MCQ_QUESTIONS = 200;
export type McqQuestion = { id: string; question: string; options: string[]; correctOptionIndex: number };
export type McqExamInput = { title: string; maxAttempts: number; questions: McqQuestion[] };
export type McqExam = McqExamInput & { id: string; slug: string; createdAt: string; updatedAt: string };
export type McqExamSummary = Omit<McqExam, "questions"> & {
  questionCount: number;
  participants: number;
  completedAttempts: number;
};
export type McqAttemptSummary = {
  id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  mobile: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  totalTimeMs: number;
};
export type McqResult = McqAttemptSummary & {
  questions: McqQuestion[];
  answers: number[];
  questionTimesMs: number[];
};
export type McqActiveAttempt = {
  id: string;
  studentName: string;
  mobile: string;
  attemptNumber: number;
  questionCount: number;
  questionIndex: number;
  question: Omit<McqQuestion, "correctOptionIndex">;
  startedAt: string;
  questionStartedAt: string;
  serverNow: string;
};
export type McqStudentState =
  { status: "in-progress"; attempt: McqActiveAttempt } | { status: "submitted"; result: McqResult };
export type McqPublicExam = {
  title: string;
  questionCount: number;
  maxAttempts: number;
  state: McqStudentState | null;
};
export type McqResultsPage = { items: McqAttemptSummary[]; total: number; participants: number; page: number };

export class McqExamError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function normalizeMcqMobile(value: unknown) {
  if (typeof value !== "string" || value.length > 40 || !/^[+\d\s().\-০-৯]+$/u.test(value)) return null;
  let digits = value.replace(/[০-৯]/gu, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit))).replace(/\D/g, "");
  if (digits.startsWith("00880")) digits = digits.slice(2);
  if (/^8801\d{9}$/.test(digits)) digits = digits.slice(2);
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

export function validateMcqExam(value: unknown): McqExamInput {
  if (!value || typeof value !== "object") throw new McqExamError(400, "Provide examination details.");
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const maxAttempts = input.maxAttempts ?? DEFAULT_MCQ_ATTEMPTS;
  if (!title || title.length > 240) throw new McqExamError(400, "Enter an exam title of up to 240 characters.");
  if (typeof maxAttempts !== "number" || !Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 100)
    throw new McqExamError(400, "Maximum attempts must be between 1 and 100.");
  if (!Array.isArray(input.questions) || !input.questions.length || input.questions.length > MAX_MCQ_QUESTIONS)
    throw new McqExamError(400, `Add 1–${MAX_MCQ_QUESTIONS} questions.`);
  const ids = new Set<string>();
  const questions = input.questions.map((item: unknown, index) => {
    if (!item || typeof item !== "object") throw new McqExamError(400, `Question ${index + 1} is invalid.`);
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const question = typeof row.question === "string" ? row.question.trim() : "";
    if (!id || id.length > 128 || ids.has(id) || !question || question.length > 4000)
      throw new McqExamError(
        400,
        `Question ${index + 1} needs a unique ID and question text (up to 4,000 characters).`,
      );
    ids.add(id);
    if (!Array.isArray(row.options) || ![3, 4].includes(row.options.length))
      throw new McqExamError(400, `Question ${index + 1} must have 3 or 4 options.`);
    const options = row.options.map((option) => (typeof option === "string" ? option.trim() : ""));
    if (options.some((option) => !option || option.length > 1000) || new Set(options).size !== options.length)
      throw new McqExamError(400, `Question ${index + 1} needs distinct, non-empty options (up to 1,000 characters).`);
    const correctOptionIndex = row.correctOptionIndex;
    if (
      typeof correctOptionIndex !== "number" ||
      !Number.isInteger(correctOptionIndex) ||
      correctOptionIndex < 0 ||
      correctOptionIndex >= options.length
    )
      throw new McqExamError(400, `Select the correct answer for question ${index + 1}.`);
    return { id, question, options, correctOptionIndex };
  });
  return { title, maxAttempts, questions };
}

export function mcqDuration(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  return `${hours ? `${hours}h ` : ""}${Math.floor((seconds % 3600) / 60)}m ${seconds % 60}s`;
}

export const mcqDate = (value: string) => new Date(value).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
