/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest, getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import { mediaIsAdministrator, removeMediaBulkForApi } from "@/lib/services/media";
export async function DELETE(request: Request) {
  const limited = await rateLimitDistributed(request, "media-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/media/v1/bulk", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids)
    ? [...new Set(body.ids.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 100))]
    : [];
  if (!ids.length) return Response.json({ error: "Choose at least one media item." }, { status: 400 });
  const access = await getDashboardAccessState(session),
    result = await removeMediaBulkForApi(
      ids,
      access.bypassed || mediaIsAdministrator(access.roleName),
      session.user.email,
    );
  if (result.kind === "forbidden")
    return Response.json({ error: "One or more media items could not be deleted." }, { status: 403 });
  if (result.kind === "remote-failed") return Response.json({ error: result.error }, { status: 502 });
  return Response.json({ success: true, deletedCount: result.deletedCount });
}
