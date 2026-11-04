/*
|-----------------------------------------
| setting up courses.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import {
  type CourseEnrollmentRequest,
  type CourseEnrollmentRequestStatus,
  type CourseInput,
  type CourseStudent,
} from "@/lib/dashboard/courses";
import { type UserDocument, usersCollection } from "@/lib/models/auth";
import { coursesCollection, type CourseDocument } from "@/lib/models/courses";

export type SerializedCourse = Omit<CourseDocument, "_id" | "createdAt" | "updatedAt" | "enrollmentRequests"> & {
  createdAt: string;
  enrollmentRequests: CourseEnrollmentRequest[];
  updatedAt: string;
};

const serializeCourse = (course: CourseDocument): SerializedCourse => ({
  id: course.id,
  name: course.name,
  description: course.description,
  duration: course.duration,
  totalClasses: course.totalClasses,
  time: course.time,
  studentsList: course.studentsList ?? [],
  enrollmentRequests: course.enrollmentRequests ?? [],
  content: course.content ?? [],
  createdAt: course.createdAt.toISOString(),
  updatedAt: course.updatedAt.toISOString(),
});

export async function listCoursesForApi() {
  const items = await coursesCollection().find({}).sort({ updatedAt: -1, name: 1 }).toArray();
  return { items: items.map(serializeCourse) };
}

export async function createCourseForApi(input: CourseInput) {
  const now = new Date();
  const item: CourseDocument = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  await coursesCollection().insertOne(item);
  return serializeCourse(item);
}

export async function updateCourseForApi(id: string, input: CourseInput) {
  // Enrollment requests are acted on through the dedicated moderation endpoint.
  // Do not let a stale details/editor save erase requests submitted in another tab.
  const { enrollmentRequests, ...editableFields } = input;
  void enrollmentRequests;
  const item = await coursesCollection().findOneAndUpdate(
    { id },
    { $set: { ...editableFields, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return item ? serializeCourse(item) : null;
}

export async function deleteCourseForApi(id: string) {
  const result = await coursesCollection().deleteOne({ id });
  return Boolean(result.deletedCount);
}

export type StudentCourseItem = {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalClasses: number;
  time: string;
  contentCount: number;
  enrollmentStatus: "not-requested" | "pending" | "enrolled" | "blocked";
  requestedAt: string | null;
  enrolledAt: string | null;
};

export type EnrollmentRequester = { id: string; name?: string | null; email?: string | null };
export type EnrollmentRequestAction = "enroll" | "block" | "unblock";

function latestRequestForStudent(course: CourseDocument, userId: string) {
  return [...(course.enrollmentRequests ?? [])].reverse().find((request) => request.userId === userId);
}

function enrollmentStatusFor(
  course: CourseDocument,
  userId: string,
): {
  enrollment: CourseStudent | null;
  request: CourseEnrollmentRequest | undefined;
  status: StudentCourseItem["enrollmentStatus"];
} {
  const enrollment = (course.studentsList ?? []).find((student) => student.userId === userId);
  if (enrollment) return { enrollment, request: latestRequestForStudent(course, userId), status: "enrolled" as const };
  const request = latestRequestForStudent(course, userId);
  const status =
    request?.status === "blocked" ? "blocked" : request?.status === "pending" ? "pending" : "not-requested";
  return { enrollment: null, request, status };
}

/** List the course catalogue with only the current student's enrollment state. */
export async function listCoursesForStudentForApi(userId: string) {
  const courses = await coursesCollection().find({}).sort({ updatedAt: -1, name: 1 }).toArray();
  const items: StudentCourseItem[] = courses.map((course) => {
    const enrollment = enrollmentStatusFor(course, userId);
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      duration: course.duration,
      totalClasses: course.totalClasses,
      time: course.time,
      contentCount: course.content?.length ?? 0,
      enrollmentStatus: enrollment.status,
      requestedAt: enrollment.request?.requestedAt ?? null,
      enrolledAt: enrollment.enrollment?.enrolledAt ?? null,
    };
  });
  return { items };
}

export type CreateEnrollmentRequestResult =
  | { kind: "created"; request: CourseEnrollmentRequest }
  | { kind: "course-not-found" }
  | { kind: "student-email-missing" }
  | { kind: "already-enrolled" }
  | { kind: "already-requested" }
  | { kind: "blocked" };

/** Create one pending enrollment request. The student identity always comes from the session. */
export async function createEnrollmentRequestForApi(
  requester: EnrollmentRequester,
  courseId: string,
): Promise<CreateEnrollmentRequestResult> {
  const course = await coursesCollection().findOne({ id: courseId });
  if (!course) return { kind: "course-not-found" };

  const current = enrollmentStatusFor(course, requester.id);
  if (current.status === "enrolled") return { kind: "already-enrolled" };
  if (current.status === "pending") return { kind: "already-requested" };
  if (current.status === "blocked") return { kind: "blocked" };

  const request: CourseEnrollmentRequest = {
    id: randomUUID(),
    userId: requester.id,
    name: requester.name?.trim().slice(0, 160) || "Unnamed student",
    email: requester.email?.trim().slice(0, 320) || "",
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  if (!request.email) return { kind: "student-email-missing" };

  // The filter prevents duplicate pending requests even when the student
  // double-clicks or sends concurrent requests from different tabs.
  const result = await coursesCollection().updateOne(
    {
      id: courseId,
      "studentsList.userId": { $ne: requester.id },
      enrollmentRequests: {
        $not: { $elemMatch: { userId: requester.id, status: { $in: ["pending", "blocked"] } } },
      },
    },
    { $push: { enrollmentRequests: request }, $set: { updatedAt: new Date() } },
  );
  if (result.modifiedCount) return { kind: "created", request };

  const latest = await coursesCollection().findOne({ id: courseId });
  if (!latest) return { kind: "course-not-found" };
  const latestStatus = enrollmentStatusFor(latest, requester.id).status;
  if (latestStatus === "enrolled") return { kind: "already-enrolled" };
  if (latestStatus === "blocked") return { kind: "blocked" };
  return { kind: "already-requested" };
}

export type ReviewEnrollmentRequestResult =
  | { kind: "updated"; item: SerializedCourse }
  | { kind: "course-not-found" }
  | { kind: "request-not-found" }
  | { kind: "request-not-pending" }
  | { kind: "request-not-blocked" };

async function refreshedCourseResult(courseId: string): Promise<ReviewEnrollmentRequestResult> {
  const updated = await coursesCollection().findOne({ id: courseId });
  return updated ? { kind: "updated", item: serializeCourse(updated) } : { kind: "course-not-found" };
}

/** Approve, block, or unblock a student's request from the course editor. */
export async function reviewEnrollmentRequestForApi(
  courseId: string,
  requestId: string,
  action: EnrollmentRequestAction,
): Promise<ReviewEnrollmentRequestResult> {
  const course = await coursesCollection().findOne({ id: courseId });
  if (!course) return { kind: "course-not-found" };
  const request = (course.enrollmentRequests ?? []).find((item) => item.id === requestId);
  if (!request) return { kind: "request-not-found" };
  const now = new Date();

  if (action === "unblock") {
    if (request.status !== "blocked") return { kind: "request-not-blocked" };
    const result = await coursesCollection().updateOne(
      { id: courseId, enrollmentRequests: { $elemMatch: { id: requestId, status: "blocked" } } },
      { $pull: { enrollmentRequests: { id: requestId, status: "blocked" } }, $set: { updatedAt: now } },
    );
    return result.modifiedCount ? refreshedCourseResult(courseId) : { kind: "request-not-blocked" };
  }

  if (request.status !== "pending") return { kind: "request-not-pending" };

  if (action === "block") {
    const result = await coursesCollection().updateOne(
      { id: courseId, enrollmentRequests: { $elemMatch: { id: requestId, status: "pending" } } },
      {
        $set: {
          "enrollmentRequests.$.status": "blocked" as CourseEnrollmentRequestStatus,
          "enrollmentRequests.$.processedAt": now.toISOString(),
          updatedAt: now,
        },
      },
    );
    return result.modifiedCount ? refreshedCourseResult(courseId) : { kind: "request-not-pending" };
  }

  const student: CourseStudent = {
    userId: request.userId,
    name: request.name,
    email: request.email,
    progress: 0,
    paymentStatus: "unpaid",
    enrolledAt: now.toISOString(),
  };
  const alreadyEnrolled = (course.studentsList ?? []).some((item) => item.userId === request.userId);
  const result = await coursesCollection().updateOne(
    { id: courseId, enrollmentRequests: { $elemMatch: { id: requestId, status: "pending" } } },
    alreadyEnrolled
      ? {
          $set: {
            "enrollmentRequests.$.status": "approved" as CourseEnrollmentRequestStatus,
            "enrollmentRequests.$.processedAt": now.toISOString(),
            updatedAt: now,
          },
        }
      : {
          $set: {
            "enrollmentRequests.$.status": "approved" as CourseEnrollmentRequestStatus,
            "enrollmentRequests.$.processedAt": now.toISOString(),
            updatedAt: now,
          },
          $push: { studentsList: student },
        },
  );
  return result.modifiedCount ? refreshedCourseResult(courseId) : { kind: "request-not-pending" };
}

export type StudentsQuery = {
  page: number;
  limit: number;
  search: string;
  courseId: string;
  payment: "" | "paid" | "unpaid" | "not-enrolled";
};

type StudentRow = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  createdAt: string | null;
  enrollments: { courseId: string; courseName: string; progress: number; paymentStatus: "paid" | "unpaid" }[];
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeStudent(user: UserDocument, courses: CourseDocument[]): StudentRow {
  const id = user.id || user._id?.toHexString() || "";
  const enrollments = courses.flatMap((course) => {
    const enrollment = course.studentsList.find((student) => student.userId === id);
    return enrollment
      ? [
          {
            courseId: course.id,
            courseName: course.name,
            progress: enrollment.progress,
            paymentStatus: enrollment.paymentStatus,
          },
        ]
      : [];
  });
  return {
    id,
    name: user.name ?? "Unnamed student",
    email: user.email ?? "",
    mobileNumber: user.mobileNumber ?? "",
    address: user.address ?? "",
    createdAt: user.createdAt?.toISOString() ?? null,
    enrollments,
  };
}

/** Build a student directory from Better Auth users and the enrollment records stored on courses. */
export async function listStudentsForApi(query: StudentsQuery) {
  const userFilter = query.search
    ? {
        $or: [
          { name: { $regex: escapeRegex(query.search), $options: "i" } },
          { email: { $regex: escapeRegex(query.search), $options: "i" } },
          { mobileNumber: { $regex: escapeRegex(query.search), $options: "i" } },
        ],
      }
    : {};
  const [courses, allUsers, filteredUsers] = await Promise.all([
    coursesCollection().find({}).sort({ name: 1 }).toArray(),
    usersCollection<UserDocument>().find({}).toArray(),
    usersCollection<UserDocument>().find(userFilter).sort({ createdAt: -1, name: 1 }).toArray(),
  ]);
  const allRows = allUsers.map((user) => serializeStudent(user, courses));
  const rows = filteredUsers
    .map((user) => serializeStudent(user, courses))
    .filter((row) => {
      if (query.courseId && !row.enrollments.some((enrollment) => enrollment.courseId === query.courseId)) return false;
      if (query.payment === "not-enrolled") return row.enrollments.length === 0;
      if (query.payment) return row.enrollments.some((enrollment) => enrollment.paymentStatus === query.payment);
      return true;
    });
  const enrolledCount = allRows.filter((row) => row.enrollments.length > 0).length;
  const paidCount = allRows.filter((row) =>
    row.enrollments.some((enrollment) => enrollment.paymentStatus === "paid"),
  ).length;
  const courseSummaries = courses.map((course) => {
    const enrollments = course.studentsList.filter((student) => allRows.some((row) => row.id === student.userId));
    const paid = enrollments.filter((student) => student.paymentStatus === "paid").length;
    const averageProgress = enrollments.length
      ? Math.round(enrollments.reduce((sum, student) => sum + student.progress, 0) / enrollments.length)
      : 0;
    return {
      id: course.id,
      name: course.name,
      enrolled: enrollments.length,
      enrolledPercent: allRows.length ? Math.round((enrollments.length / allRows.length) * 100) : 0,
      paid,
      averageProgress,
    };
  });
  const total = rows.length;
  const start = (query.page - 1) * query.limit;
  return {
    items: rows.slice(start, start + query.limit),
    total,
    page: query.page,
    limit: query.limit,
    summary: {
      registered: allRows.length,
      enrolled: enrolledCount,
      notEnrolled: allRows.length - enrolledCount,
      paid: paidCount,
      courses: courseSummaries,
    },
  };
}
