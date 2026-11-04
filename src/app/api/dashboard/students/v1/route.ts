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
import { listStudentsForApi } from "@/lib/services/courses";

const pageSizes = [10, 25, 50, 100];
const paymentFilters = new Set(["", "paid", "unpaid", "not-enrolled"]);

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-students-api", 60, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/students/v1", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const params = new URL(request.url).searchParams;
  const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);
  const requestedLimit = Number.parseInt(params.get("limit") ?? "10", 10);
  const payment = params.get("payment") ?? "";
  return Response.json(
    await listStudentsForApi({
      page: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
      limit: pageSizes.includes(requestedLimit) ? requestedLimit : 10,
      search: params.get("search")?.trim() ?? "",
      courseId: params.get("courseId")?.trim() ?? "",
      payment: paymentFilters.has(payment) ? (payment as "" | "paid" | "unpaid" | "not-enrolled") : "",
    }),
  );
}
