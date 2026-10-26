/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { type OrderStatus, orderStatuses, serializeOrder } from "@/lib/dashboard/orders";
import { allowedOrderTransitions, orders, restoreOrderStock } from "@/lib/orders/management";

async function access(request: Request, method: "GET" | "PATCH" | "DELETE") {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/api/dashboard/orders/v1", method);
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorized = await access(request, "GET");
  if ("error" in authorized) return authorized.error;
  const item = await orders().findOne({ id: (await params).id });
  return item
    ? Response.json({ item: serializeOrder(item) })
    : Response.json({ error: "Order not found." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorized = await access(request, "PATCH");
  if ("error" in authorized) return authorized.error;
  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
  if (!body || !orderStatuses.includes(body.status as OrderStatus))
    return Response.json({ error: "Choose a valid order status." }, { status: 400 });
  const id = (await params).id;
  const current = await orders().findOne({ id });
  if (!current) return Response.json({ error: "Order not found." }, { status: 404 });
  const status = body.status as OrderStatus;
  if (!allowedOrderTransitions[current.status].includes(status))
    return Response.json({ error: `Cannot change an order from ${current.status} to ${status}.` }, { status: 409 });
  const now = new Date();
  const updated = await orders().findOneAndUpdate(
    { id, status: current.status },
    { $set: { status, updatedAt: now, statusUpdatedAt: now } },
    { returnDocument: "after" },
  );
  if (!updated) return Response.json({ error: "Order status changed; refresh and try again." }, { status: 409 });
  if (status === "cancelled") await restoreOrderStock({ ...updated, status: current.status }, now);
  return Response.json({ item: serializeOrder(updated) });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorized = await access(request, "DELETE");
  if ("error" in authorized) return authorized.error;
  const removed = await orders().findOneAndDelete({ id: (await params).id });
  if (!removed) return Response.json({ error: "Order not found." }, { status: 404 });
  await restoreOrderStock(removed);
  return Response.json({ deletedCount: 1 });
}
