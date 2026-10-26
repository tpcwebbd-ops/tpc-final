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
import { removeSidebars } from "@/lib/services/sidebars";

export async function DELETE(request: Request) {
  const limited = await rateLimitDistributed(request, "sidebar-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/sidebars/v1", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { ids?: string[] } | null;
  const roots = [...new Set(body?.ids?.filter((id): id is string => typeof id === "string" && id.length > 0) ?? [])];
  if (!roots.length) return Response.json({ error: "Select at least one sidebar item." }, { status: 400 });
  const result = await removeSidebars(roots);
  return Response.json({ deletedCount: result.deletedCount });
}
