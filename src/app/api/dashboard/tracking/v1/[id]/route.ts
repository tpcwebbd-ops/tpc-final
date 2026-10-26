/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { editTracking, removeTracking } from "@/lib/services/tracking";

async function access(request: Request, method: "PATCH" | "DELETE") {
  const limited = await rateLimitDistributed(request, "dashboard-tracking-api", 30, 60_000);
  if (limited) return { error: limited };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/dashboard/admin/tracking", method);
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await access(request, "PATCH");
  if ("error" in result) return result.error;
  const body = (await request.json().catch(() => null)) as { pixelId?: string; enabled?: boolean } | null;
  const pixelId = body?.pixelId?.trim() ?? "";
  if (!pixelId || pixelId.length > 150 || !/^[A-Za-z0-9_\-GTM]+$/.test(pixelId) || typeof body?.enabled !== "boolean")
    return Response.json({ error: "Enter a valid tracking ID." }, { status: 400 });
  const update = await editTracking((await params).id, pixelId, body.enabled);
  if (update.kind === "not-found") return Response.json({ error: "Tracking ID not found." }, { status: 404 });
  return Response.json({ item: update.item });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await access(request, "DELETE");
  if ("error" in result) return result.error;
  const removed = await removeTracking((await params).id);
  return removed.kind === "success"
    ? Response.json({ ok: true })
    : Response.json({ error: "Tracking ID not found." }, { status: 404 });
}
