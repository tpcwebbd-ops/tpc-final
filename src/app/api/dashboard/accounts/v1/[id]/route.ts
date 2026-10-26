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
import { removeAccount, updateAccountDetails } from "@/lib/services/accounts";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "dashboard-accounts-api", 30, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/accounts/v1", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { accountId?: string; providerId?: string } | null;
  const accountId = body?.accountId?.trim();
  const providerId = body?.providerId?.trim();
  if (!accountId || !providerId)
    return Response.json({ error: "Account ID and provider are required." }, { status: 400 });

  if (!(await updateAccountDetails(id, accountId, providerId)))
    return Response.json({ error: "Account not found." }, { status: 404 });
  return Response.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "dashboard-accounts-api", 30, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/accounts/v1", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const { id } = await params;
  if (!(await removeAccount(id))) return Response.json({ error: "Account not found." }, { status: 404 });
  return Response.json({ success: true });
}
