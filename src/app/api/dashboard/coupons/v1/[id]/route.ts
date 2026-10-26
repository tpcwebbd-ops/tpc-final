/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 09 September, 2026
|-----------------------------------------
*/

import { authorizeCouponRequest } from "@/app/api/lib/catalog-authorization";
import { parseCouponInput, serializeCoupon } from "@/lib/dashboard/coupons";
import { removeCoupon, updateCouponForApi } from "@/lib/services/coupons";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeCouponRequest(request, "PATCH");
  if ("error" in access) return access.error;
  const data = parseCouponInput(await request.json().catch(() => null));
  if (!data) return Response.json({ error: "Enter a valid coupon code and discount." }, { status: 400 });
  const { id } = await params;
  const result = await updateCouponForApi(id, data);
  if (result.kind === "duplicate") return Response.json({ error: "That coupon code already exists." }, { status: 409 });
  if (result.kind === "not-found") return Response.json({ error: "Coupon not found." }, { status: 404 });
  return Response.json({ item: serializeCoupon(result.item) });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeCouponRequest(request, "DELETE");
  if ("error" in access) return access.error;
  const { id } = await params;
  return (await removeCoupon(id))
    ? Response.json({ ok: true })
    : Response.json({ error: "Coupon not found." }, { status: 404 });
}
