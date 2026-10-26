/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import {
  authorizeDashboardRequest,
  getDashboardAccessState,
  getLeadsActor,
} from "@/app/api/lib/dashboard-authorization";
import type { SidebarItem } from "@/lib/models/auth";
import { addSidebar, listSidebars } from "@/lib/services/sidebars";
async function access(request: Request) {
  const limited = await rateLimitDistributed(request, "sidebar-api");
  if (limited) return { limited };
  const session = await auth.api.getSession({ headers: request.headers });
  return { limited: null, session };
}
export async function GET(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await getDashboardAccessState(session);
  if (authorization.blocked) return Response.json({ error: authorization.message ?? "Unauthorized." }, { status: 403 });
  const sidebars = await listSidebars(authorization.allowedSidebarIds, authorization.bypassed);
  return Response.json(
    {
      ...sidebars,
      roleName: authorization.roleName,
      access: authorization,
      leadsActor: await getLeadsActor(session, authorization),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/sidebars/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Partial<SidebarItem> | null;
  const name = body?.name?.trim();
  const url = body?.url?.trim();
  const icon = body?.icon?.trim() || "•";
  const parentId = body?.parentId || null;
  if (!name || !url) return Response.json({ error: "Name and URL are required." }, { status: 400 });
  const result = await addSidebar({ name, url, icon, parentId, position: body?.position });
  if (result.kind === "invalid-route")
    return Response.json({ error: "This dashboard route is no longer available." }, { status: 400 });
  if (result.kind === "invalid-depth")
    return Response.json(
      { error: "Sidebar items support grand parent, parent, and child levels only." },
      { status: 400 },
    );
  return Response.json({ item: result.item }, { status: 201 });
}
