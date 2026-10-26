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
import { deleteAccess, updateAccess } from "@/lib/services/access";

async function access(request: Request) {
  const limited = await rateLimitDistributed(request, "access-api");
  if (limited) return { limited };
  return { limited: null, session: await auth.api.getSession({ headers: request.headers }) };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/access/v1", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { roleId?: string; blocked?: boolean } | null;
  const roleId = body?.roleId?.trim();
  if (!roleId) return Response.json({ error: "Role is required." }, { status: 400 });
  const result = await updateAccess({
    id: (await params).id,
    roleId,
    blocked: Boolean(body?.blocked),
    actorEmail: session.user.email,
  });
  if (result.kind === "role-not-found") return Response.json({ error: "Role was not found." }, { status: 404 });
  if (result.kind === "not-found") return Response.json({ error: "Access record not found." }, { status: 404 });
  if (result.kind === "self-block")
    return Response.json({ error: "You cannot block your own account." }, { status: 400 });
  return Response.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/access/v1", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const result = await deleteAccess({ id: (await params).id, actorEmail: session.user.email });
  if (result.kind === "not-found") return Response.json({ error: "Access record not found." }, { status: 404 });
  if (result.kind === "self-delete")
    return Response.json({ error: "You cannot remove your own access." }, { status: 400 });
  return Response.json({ success: true });
}
