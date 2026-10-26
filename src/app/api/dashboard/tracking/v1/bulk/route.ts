/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { removeTrackingRecords } from "@/lib/services/tracking";

export async function DELETE(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-tracking-api", 30, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const allowed = await authorizeDashboardRequest(session, "/dashboard/admin/tracking", "DELETE");
  if (!allowed.allowed) return Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids)
    ? [...new Set(body.ids.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 100))]
    : [];
  if (!ids.length) return Response.json({ error: "Choose at least one tracking record." }, { status: 400 });
  const result = await removeTrackingRecords(ids);
  return Response.json({ ok: true, deletedCount: result.deletedCount });
}
