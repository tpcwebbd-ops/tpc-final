/*
|-----------------------------------------
| setting up authentication and permission boundaries for course exams
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { CourseExamError } from "@/lib/services/course-exams";

export async function authorizeCourseExam(request: Request, admin = false) {
  const limited = await rateLimitDistributed(
    request,
    admin ? "admin-course-exams" : "student-course-exams",
    90,
    60_000,
  );
  if (limited) return { error: limited, session: null };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }), session: null };
  const allowed = await authorizeDashboardRequest(
    session,
    admin ? "/api/dashboard/courses/v1/exams" : "/api/dashboard/my-course/v1/exams",
    request.method,
  );
  if (!allowed.allowed)
    return {
      error: Response.json({ error: allowed.state.message || "Unauthorized." }, { status: 403 }),
      session: null,
    };
  return { session, error: null };
}
export const examId = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 128) : "");
export function examError(error: unknown) {
  if (error instanceof CourseExamError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Course exam operation failed", error);
  return Response.json({ error: "Could not complete the exam operation. Please retry." }, { status: 500 });
}
