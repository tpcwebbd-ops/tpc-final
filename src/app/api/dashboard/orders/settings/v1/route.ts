/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { serializeOrderSettings } from "@/lib/dashboard/orders";
import { getOrderSettings, updateOrderSettings } from "@/lib/orders/server";

async function access(request: Request, method: "GET" | "PATCH") {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/api/dashboard/orders/settings/v1", method);
  return allowed.allowed
    ? { session }
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export async function GET(request: Request) {
  const authorized = await access(request, "GET");
  if ("error" in authorized) return authorized.error;
  return Response.json({ settings: serializeOrderSettings(await getOrderSettings()) });
}

export async function PATCH(request: Request) {
  const authorized = await access(request, "PATCH");
  if ("error" in authorized) return authorized.error;
  const body = (await request.json().catch(() => null)) as {
    allowOrdersWithoutStockCheck?: unknown;
    orderLimitEnabled?: unknown;
    orderLimitMinutes?: unknown;
    orderLimitMaxOrders?: unknown;
  } | null;
  if (!body || typeof body.orderLimitEnabled !== "boolean")
    return Response.json({ error: "orderLimitEnabled must be true or false." }, { status: 400 });

  const current = await getOrderSettings();
  let allowOrdersWithoutStockCheck = current.allowOrdersWithoutStockCheck;
  if (body.allowOrdersWithoutStockCheck !== undefined) {
    if (typeof body.allowOrdersWithoutStockCheck !== "boolean")
      return Response.json({ error: "allowOrdersWithoutStockCheck must be true or false." }, { status: 400 });
    allowOrdersWithoutStockCheck = body.allowOrdersWithoutStockCheck;
  }

  let orderLimitMinutes = current.orderLimitMinutes;
  if (body.orderLimitMinutes !== undefined) {
    if (
      typeof body.orderLimitMinutes !== "number" ||
      !Number.isInteger(body.orderLimitMinutes) ||
      body.orderLimitMinutes < 1 ||
      body.orderLimitMinutes > 10080
    ) {
      return Response.json({ error: "orderLimitMinutes must be a whole number between 1 and 10080." }, { status: 400 });
    }
    orderLimitMinutes = body.orderLimitMinutes;
  }

  let orderLimitMaxOrders = current.orderLimitMaxOrders;
  if (body.orderLimitMaxOrders !== undefined) {
    if (
      typeof body.orderLimitMaxOrders !== "number" ||
      !Number.isInteger(body.orderLimitMaxOrders) ||
      body.orderLimitMaxOrders < 1 ||
      body.orderLimitMaxOrders > 1000
    ) {
      return Response.json(
        { error: "orderLimitMaxOrders must be a whole number between 1 and 1000." },
        { status: 400 },
      );
    }
    orderLimitMaxOrders = body.orderLimitMaxOrders;
  }

  const updated = await updateOrderSettings(
    { allowOrdersWithoutStockCheck, orderLimitEnabled: body.orderLimitEnabled, orderLimitMinutes, orderLimitMaxOrders },
    authorized.session.user.id,
  );
  return Response.json({ settings: serializeOrderSettings(updated!) });
}
