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
import { editUser, removeUser } from "@/lib/services/users";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "dashboard-users-api", 30, 60_000);
  if (limited) return limited;
  const activeSession = await auth.api.getSession({ headers: request.headers });
  if (!activeSession) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(activeSession, "/api/dashboard/users/v1", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    mobileNumber?: string;
    emailVerified?: boolean;
  } | null;
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  if (!name || !email) return Response.json({ error: "Name and email are required." }, { status: 400 });
  const result = await editUser(id, {
    name,
    email,
    mobileNumber: body?.mobileNumber?.trim() ?? "",
    emailVerified: Boolean(body?.emailVerified),
  });
  if (result.kind === "duplicate") return Response.json({ error: "This email is already in use." }, { status: 409 });
  if (result.kind === "not-found") return Response.json({ error: "User not found." }, { status: 404 });
  return Response.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "dashboard-users-api", 30, 60_000);
  if (limited) return limited;
  const activeSession = await auth.api.getSession({ headers: request.headers });
  if (!activeSession) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(activeSession, "/api/dashboard/users/v1", "DELETE");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { id } = await params;
  const result = await removeUser(id);
  if (result.kind === "not-found") return Response.json({ error: "User not found." }, { status: 404 });
  return Response.json({ success: true });
}
