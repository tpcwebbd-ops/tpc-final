/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest, getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import { mediaIsAdministrator, removeMediaForApi, renameMediaForApi } from "@/lib/services/media";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "media-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, new URL(request.url).pathname, "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const access = await getDashboardAccessState(session),
    result = await removeMediaForApi(id, access.bypassed || mediaIsAdministrator(access.roleName), session.user.email);
  if (result.kind === "not-found") return Response.json({ error: "Media not found." }, { status: 404 });
  if (result.kind === "forbidden")
    return Response.json({ error: "You can only delete your own media." }, { status: 403 });
  if (result.kind === "remote-failed") return Response.json({ error: result.error }, { status: 502 });
  return Response.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "media-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, new URL(request.url).pathname, "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name) return Response.json({ error: "Name is required." }, { status: 400 });
  const access = await getDashboardAccessState(session),
    result = await renameMediaForApi(
      id,
      name,
      access.bypassed || mediaIsAdministrator(access.roleName),
      session.user.email,
    );
  if (result.kind === "not-found") return Response.json({ error: "Media not found." }, { status: 404 });
  if (result.kind === "forbidden")
    return Response.json({ error: "You can only edit your own media." }, { status: 403 });
  return Response.json({ success: true });
}
