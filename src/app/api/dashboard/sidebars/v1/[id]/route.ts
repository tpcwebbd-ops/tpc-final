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
import type { SidebarItem } from "@/lib/models/auth";
import { editSidebar, removeSidebar } from "@/lib/services/sidebars";
async function access(request: Request) {
  const limited = await rateLimitDistributed(request, "sidebar-api");
  if (limited) return { limited };
  const session = await auth.api.getSession({ headers: request.headers });
  return { limited: null, session };
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/sidebars/v1", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<SidebarItem> | null;
  const name = body?.name?.trim();
  const url = body?.url?.trim();
  const icon = body?.icon?.trim();
  if (!name || !url) return Response.json({ error: "Name and URL are required." }, { status: 400 });
  const result = await editSidebar(id, { name, url, icon, parentId: body?.parentId, position: body?.position });
  if (result.kind === "not-found") return Response.json({ error: "Sidebar item not found." }, { status: 404 });
  if (result.kind === "invalid-parent")
    return Response.json({ error: "An item cannot be placed inside itself or one of its children." }, { status: 400 });
  if (result.kind === "invalid-depth")
    return Response.json(
      { error: "Sidebar items support grand parent, parent, and child levels only." },
      { status: 400 },
    );
  return Response.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/sidebars/v1", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const result = await removeSidebar(id);
  if (result.kind === "not-found") return Response.json({ error: "Sidebar item not found." }, { status: 404 });
  return Response.json({ deletedCount: result.deletedCount });
}
