/*
|-----------------------------------------
| setting up MCQ examination permissions, private responses, and errors
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { McqExamError } from "@/lib/dashboard/mcq-exams";

export async function authorizeMcqAdmin(request: Request) {
  const limited = await rateLimitDistributed(request, "admin-mcq-exams", 90, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return mcqJson({ error: "Sign in required." }, 401);
  const access = await authorizeDashboardRequest(session, "/api/dashboard/mcq/v1", request.method);
  return access.allowed ? null : mcqJson({ error: access.state.message || "Unauthorized." }, 403);
}

export const mcqJson = (value: unknown, status = 200) =>
  Response.json(value, { status, headers: { "Cache-Control": "private, no-store" } });
export function mcqError(error: unknown) {
  if (error instanceof McqExamError) return mcqJson({ error: error.message }, error.status);
  console.error("MCQ examination operation failed", error);
  return mcqJson({ error: "Could not complete the examination operation. Please retry." }, 500);
}
export function mcqPage(value: string | null) {
  const page = Number(value || 1);
  if (!Number.isInteger(page) || page < 1 || page > 100_000)
    throw new McqExamError(400, "Provide a valid page number.");
  return page;
}
