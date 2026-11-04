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
import { listUsers } from "@/lib/services/users";

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-course-students-api", 60, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/courses/v1/users", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const params = new URL(request.url).searchParams;
  const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);
  const requestedLimit = Number.parseInt(params.get("limit") ?? "100", 10);
  return Response.json(
    await listUsers(
      Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
      Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 100, 1), 100),
      params.get("q")?.trim() ?? "",
    ),
  );
}
