/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { listAccounts } from "@/lib/services/accounts";

const MAX_PAGE_SIZE = 100;

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-accounts-api", 30, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/accounts/v1", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const url = new URL(request.url);
  const page = positiveInteger(url.searchParams.get("page"), 1);
  const limit = Math.min(positiveInteger(url.searchParams.get("limit"), 25), MAX_PAGE_SIZE);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const { accounts, total } = await listAccounts({ page, limit, q });
  return Response.json({ accounts, total, page, limit });
}
