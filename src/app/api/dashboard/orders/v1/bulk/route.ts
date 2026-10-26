/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { type OrderStatus, orderStatuses } from "@/lib/dashboard/orders";
import { allowedOrderTransitions, orderIds, orders, restoreOrderStock } from "@/lib/orders/management";

async function access(request: Request, method: "PATCH" | "DELETE") {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/api/dashboard/orders/v1", method);
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export async function DELETE(request: Request) {
  const authorized = await access(request, "DELETE");
  if ("error" in authorized) return authorized.error;
  const ids = orderIds(await request.json().catch(() => null));
  if (!ids.length || ids.length > 100)
    return Response.json({ error: "Select between 1 and 100 orders." }, { status: 400 });
  const removed = await orders()
    .find({ id: { $in: ids } })
    .toArray();
  await orders().deleteMany({ id: { $in: removed.map((item) => item.id) } });
  await Promise.all(removed.map((item) => restoreOrderStock(item)));
  return Response.json({ deletedCount: removed.length });
}

export async function PATCH(request: Request) {
  const authorized = await access(request, "PATCH");
  if ("error" in authorized) return authorized.error;
  const body = (await request.json().catch(() => null)) as { ids?: unknown; status?: unknown } | null;
  const ids = orderIds(body);
  const status = body?.status as OrderStatus;
  if (!ids.length || ids.length > 100)
    return Response.json({ error: "Select between 1 and 100 orders." }, { status: 400 });
  if (!orderStatuses.includes(status)) return Response.json({ error: "Choose a valid order status." }, { status: 400 });
  const selected = await orders()
    .find({ id: { $in: ids } })
    .toArray();
  if (selected.length !== ids.length)
    return Response.json({ error: "One or more selected orders no longer exist." }, { status: 404 });
  if (selected.some((item) => !allowedOrderTransitions[item.status].includes(status)))
    return Response.json({ error: "The selected orders cannot all move to that status." }, { status: 409 });
  const now = new Date();
  const result = await orders().updateMany(
    { id: { $in: ids } },
    { $set: { status, updatedAt: now, statusUpdatedAt: now } },
  );
  if (status === "cancelled") await Promise.all(selected.map((item) => restoreOrderStock(item, now)));
  return Response.json({ updatedCount: result.modifiedCount });
}
