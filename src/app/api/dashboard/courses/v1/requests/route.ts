/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { reviewEnrollmentRequestForApi, type EnrollmentRequestAction } from "@/lib/services/courses";

export async function PATCH(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-course-requests-api", 60, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/courses/v1/requests", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    action?: unknown;
    courseId?: unknown;
    requestId?: unknown;
  } | null;
  const courseId = typeof body?.courseId === "string" ? body.courseId.trim().slice(0, 128) : "";
  const requestId = typeof body?.requestId === "string" ? body.requestId.trim().slice(0, 128) : "";
  const action = body?.action;
  if (!courseId || !requestId || !["enroll", "block", "unblock"].includes(String(action)))
    return Response.json({ error: "Provide a course, request, and valid action." }, { status: 400 });

  const result = await reviewEnrollmentRequestForApi(courseId, requestId, action as EnrollmentRequestAction);
  if (result.kind === "updated") return Response.json({ item: result.item });
  if (result.kind === "course-not-found") return Response.json({ error: "Course not found." }, { status: 404 });
  if (result.kind === "request-not-found")
    return Response.json({ error: "Enrollment request not found." }, { status: 404 });
  if (result.kind === "request-not-blocked")
    return Response.json({ error: "This student is no longer blocked from this course." }, { status: 409 });
  return Response.json({ error: "This enrollment request is no longer pending." }, { status: 409 });
}
