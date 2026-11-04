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
import { parseCourseInput } from "@/lib/dashboard/courses";
import { createCourseForApi, deleteCourseForApi, listCoursesForApi, updateCourseForApi } from "@/lib/services/courses";

async function authorize(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-courses-api", 60, 60_000);
  if (limited) return { error: limited };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/courses/v1", request.method);
  if (!authorization.allowed)
    return { error: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }) };
  return { error: null };
}

export async function GET(request: Request) {
  const access = await authorize(request);
  if (access.error) return access.error;
  return Response.json(await listCoursesForApi());
}

export async function POST(request: Request) {
  const access = await authorize(request);
  if (access.error) return access.error;
  const input = parseCourseInput(await request.json().catch(() => null));
  if (!input) return Response.json({ error: "Enter a course name and valid course details." }, { status: 400 });
  return Response.json({ item: await createCourseForApi(input) }, { status: 201 });
}

export async function PUT(request: Request) {
  const access = await authorize(request);
  if (access.error) return access.error;
  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const input = parseCourseInput(body);
  if (!id || !input) return Response.json({ error: "Provide a course id and valid course details." }, { status: 400 });
  const item = await updateCourseForApi(id, input);
  if (!item) return Response.json({ error: "Course not found." }, { status: 404 });
  return Response.json({ item });
}

export async function DELETE(request: Request) {
  const access = await authorize(request);
  if (access.error) return access.error;
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) return Response.json({ error: "Course id is required." }, { status: 400 });
  if (!(await deleteCourseForApi(id))) return Response.json({ error: "Course not found." }, { status: 404 });
  return Response.json({ ok: true });
}
