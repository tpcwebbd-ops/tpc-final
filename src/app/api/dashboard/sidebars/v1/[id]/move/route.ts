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
import { moveSidebar } from "@/lib/services/sidebars";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "sidebar-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/sidebars/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { direction?: "up" | "down" } | null;
  if (body?.direction !== "up" && body?.direction !== "down")
    return Response.json({ error: "Invalid move direction." }, { status: 400 });
  const result = await moveSidebar(id, body.direction);
  if (result.kind === "not-found") return Response.json({ error: "Sidebar item not found." }, { status: 404 });
  if (result.kind === "boundary")
    return Response.json(
      { error: `This sidebar item is already at the ${body.direction === "up" ? "top" : "bottom"}.` },
      { status: 409 },
    );
  return Response.json({ success: true });
}
