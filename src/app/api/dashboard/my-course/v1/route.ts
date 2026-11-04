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
import { createEnrollmentRequestForApi, listCoursesForStudentForApi } from "@/lib/services/courses";

async function authorize(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-my-course-api", 60, 60_000);
  if (limited) return { error: limited, session: null };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }), session: null };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/my-course/v1", request.method);
  if (!authorization.allowed)
    return {
      error: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }),
      session: null,
    };
  return { error: null, session };
}

export async function GET(request: Request) {
  const access = await authorize(request);
  if (access.error || !access.session) return access.error;
  return Response.json(await listCoursesForStudentForApi(access.session.user.id));
}

export async function POST(request: Request) {
  const access = await authorize(request);
  if (access.error || !access.session) return access.error;
  const body = (await request.json().catch(() => null)) as { courseId?: unknown } | null;
  const courseId = typeof body?.courseId === "string" ? body.courseId.trim().slice(0, 128) : "";
  if (!courseId) return Response.json({ error: "Course id is required." }, { status: 400 });

  const result = await createEnrollmentRequestForApi(access.session.user, courseId);
  if (result.kind === "created") return Response.json({ request: result.request }, { status: 201 });
  if (result.kind === "course-not-found") return Response.json({ error: "Course not found." }, { status: 404 });
  if (result.kind === "student-email-missing")
    return Response.json(
      { error: "Your account needs an email address before you can request enrollment." },
      { status: 400 },
    );
  if (result.kind === "already-enrolled")
    return Response.json({ error: "You are already enrolled in this course." }, { status: 409 });
  if (result.kind === "blocked")
    return Response.json({ error: "Enrollment is unavailable for this course." }, { status: 403 });
  return Response.json({ error: "You already have a pending enrollment request for this course." }, { status: 409 });
}
