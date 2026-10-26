/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 09 September, 2026
|-----------------------------------------
*/

import { authorizeCouponRequest } from "@/app/api/lib/dashboard-resource-authorization";
import { parseCouponInput, serializeCoupon } from "@/lib/dashboard/coupons";
import { createCouponForApi, listCouponsForApi } from "@/lib/services/coupons";

export async function GET(request: Request) {
  const access = await authorizeCouponRequest(request, "GET");
  if ("error" in access) return access.error;
  return Response.json({ items: await listCouponsForApi() });
}

export async function POST(request: Request) {
  const access = await authorizeCouponRequest(request, "POST");
  if ("error" in access) return access.error;
  const data = parseCouponInput(await request.json().catch(() => null));
  if (!data) return Response.json({ error: "Enter a valid coupon code and discount." }, { status: 400 });
  const result = await createCouponForApi(data);
  if (result.kind === "duplicate") return Response.json({ error: "That coupon code already exists." }, { status: 409 });
  return Response.json({ item: serializeCoupon(result.item) }, { status: 201 });
}
