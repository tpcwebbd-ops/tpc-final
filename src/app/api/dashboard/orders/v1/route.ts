/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { orderStatuses, serializeOrder } from "@/lib/dashboard/orders";
import { orders } from "@/lib/orders/management";

const pageSizes = [10, 25, 50, 100];

async function access(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/api/dashboard/orders/v1", "GET");
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export async function GET(request: Request) {
  const authorized = await access(request);
  if ("error" in authorized) return authorized.error;
  const query = new URL(request.url).searchParams;
  const status = query.get("status");
  const selectedStatus = orderStatuses.find((orderStatus) => orderStatus === status);
  const filter: Record<string, unknown> = selectedStatus ? { status: selectedStatus } : {};
  const search = query.get("search")?.trim();
  if (search) filter.id = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const requestedPageSize = Number(query.get("pageSize"));
  const pageSize = pageSizes.includes(requestedPageSize) ? requestedPageSize : 10;
  const total = await orders().countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Number.parseInt(query.get("page") ?? "1", 10);
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
  const items = await orders()
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  return Response.json({ items: items.map(serializeOrder), total, page, pageSize });
}
