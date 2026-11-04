/*
|-----------------------------------------
| setting up courses.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

export type CoursePaymentStatus = "paid" | "unpaid";
export type CourseContentType = "mcq" | "pdf" | "video";
export type CourseEnrollmentRequestStatus = "pending" | "approved" | "blocked";

export type CourseStudent = {
  userId: string;
  name: string;
  email: string;
  progress: number;
  paymentStatus: CoursePaymentStatus;
  enrolledAt: string;
};

/** A student's request to join a course. Requests are approved or blocked by course staff. */
export type CourseEnrollmentRequest = {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: CourseEnrollmentRequestStatus;
  requestedAt: string;
  processedAt?: string;
};

export type CourseMcqContent = {
  id: string;
  type: "mcq";
  title: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export type CourseMediaContent = {
  id: string;
  type: "pdf" | "video";
  title: string;
  mediaId: string;
  mediaUrl: string;
};

export type CourseContent = CourseMcqContent | CourseMediaContent;

export type CourseInput = {
  name: string;
  description: string;
  duration: string;
  totalClasses: number;
  time: string;
  studentsList: CourseStudent[];
  enrollmentRequests: CourseEnrollmentRequest[];
  content: CourseContent[];
};

export const courseDefaults: CourseInput = {
  name: "",
  description: "",
  duration: "",
  totalClasses: 0,
  time: "",
  studentsList: [],
  enrollmentRequests: [],
  content: [],
};

const text = (value: unknown, maxLength = 2_000) => (typeof value === "string" ? value.trim().slice(0, maxLength) : "");

function parseStudent(value: unknown): CourseStudent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Partial<CourseStudent>;
  const userId = text(item.userId, 128);
  const email = text(item.email, 320);
  if (!userId || !email) return null;
  const progress = Number(item.progress);
  return {
    userId,
    name: text(item.name, 160) || "Unnamed student",
    email,
    progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0,
    paymentStatus: item.paymentStatus === "paid" ? "paid" : "unpaid",
    enrolledAt: text(item.enrolledAt, 64) || new Date().toISOString(),
  };
}

function parseEnrollmentRequest(value: unknown): CourseEnrollmentRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Partial<CourseEnrollmentRequest>;
  const id = text(item.id, 128);
  const userId = text(item.userId, 128);
  const email = text(item.email, 320);
  if (!id || !userId || !email) return null;
  return {
    id,
    userId,
    name: text(item.name, 160) || "Unnamed student",
    email,
    status: item.status === "approved" || item.status === "blocked" ? item.status : "pending",
    requestedAt: text(item.requestedAt, 64) || new Date().toISOString(),
    ...(text(item.processedAt, 64) ? { processedAt: text(item.processedAt, 64) } : {}),
  };
}

function parseContent(value: unknown): CourseContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Partial<CourseContent>;
  const id = text(item.id, 128);
  const title = text(item.title, 240);
  if (!id || !title) return null;

  if (item.type === "mcq") {
    const options = Array.isArray(item.options) ? item.options.map((option) => text(option, 500)).filter(Boolean) : [];
    const correctOptionIndex = Number(item.correctOptionIndex);
    const question = text(item.question, 5_000);
    if (!question || options.length < 2 || options.length > 6 || !Number.isInteger(correctOptionIndex)) return null;
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) return null;
    return {
      id,
      type: "mcq",
      title,
      question,
      options,
      correctOptionIndex,
      explanation: text(item.explanation, 5_000),
    };
  }

  if (item.type !== "pdf" && item.type !== "video") return null;
  const mediaId = text(item.mediaId, 128);
  const mediaUrl = text(item.mediaUrl, 4_000);
  if (!mediaId || !mediaUrl) return null;
  return { id, type: item.type, title, mediaId, mediaUrl };
}

/** Parse and normalize the editable course fields accepted by the dashboard API. */
export function parseCourseInput(value: unknown): CourseInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Partial<CourseInput>;
  const name = text(item.name, 160);
  if (!name) return null;
  const totalClasses = Number(item.totalClasses);
  if (!Number.isInteger(totalClasses) || totalClasses < 0 || totalClasses > 10_000) return null;
  if (!Array.isArray(item.studentsList) || !Array.isArray(item.content)) return null;

  const students = item.studentsList.map(parseStudent);
  // Older course documents predate enrollment requests. Treat their absent
  // field as an empty request list so they remain editable without migration.
  const enrollmentRequests = Array.isArray(item.enrollmentRequests)
    ? item.enrollmentRequests.map(parseEnrollmentRequest)
    : [];
  const content = item.content.map(parseContent);
  if (
    students.some((student) => !student) ||
    enrollmentRequests.some((request) => !request) ||
    content.some((entry) => !entry)
  )
    return null;
  const studentIds = students.map((student) => student!.userId);
  const requestIds = enrollmentRequests.map((request) => request!.id);
  const requestUserIds = enrollmentRequests.map((request) => request!.userId);
  const contentIds = content.map((entry) => entry!.id);
  if (
    new Set(studentIds).size !== studentIds.length ||
    new Set(requestIds).size !== requestIds.length ||
    new Set(requestUserIds).size !== requestUserIds.length ||
    new Set(contentIds).size !== contentIds.length
  )
    return null;

  return {
    name,
    description: text(item.description, 10_000),
    duration: text(item.duration, 160),
    totalClasses,
    time: text(item.time, 160),
    studentsList: students as CourseStudent[],
    enrollmentRequests: enrollmentRequests as CourseEnrollmentRequest[],
    content: content as CourseContent[],
  };
}
