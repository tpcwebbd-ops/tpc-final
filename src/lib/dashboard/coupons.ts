/*
|-----------------------------------------
| setting up coupons.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 09 September, 2026
|-----------------------------------------
*/

export type CouponDiscountType = "flat" | "percent";

export type Coupon = {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maximumDiscount: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponInput = Omit<Coupon, "id" | "createdAt" | "updatedAt">;

const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

export function parseCouponInput(value: unknown): CouponInput | null {
  if (!isObject(value)) return null;
  const code = typeof value.code === "string" ? value.code.trim().toUpperCase() : "";
  const discountType = value.discountType;
  const discountValue = value.discountValue;
  const maximumDiscount = value.maximumDiscount;
  if (!/^[A-Z0-9][A-Z0-9_-]{1,59}$/.test(code)) return null;
  if (discountType !== "flat" && discountType !== "percent") return null;
  if (typeof discountValue !== "number" || !Number.isFinite(discountValue) || discountValue <= 0) return null;
  if (discountType === "percent" && discountValue > 100) return null;
  if (discountType === "percent") {
    if (typeof maximumDiscount !== "number" || !Number.isFinite(maximumDiscount) || maximumDiscount <= 0) return null;
  }
  return {
    code,
    discountType,
    discountValue: Math.round(discountValue * 100) / 100,
    maximumDiscount: discountType === "percent" ? Math.round((maximumDiscount as number) * 100) / 100 : null,
    active: Boolean(value.active),
  };
}

export function couponDiscount(
  coupon: Pick<Coupon, "discountType" | "discountValue" | "maximumDiscount">,
  subtotal: number,
) {
  const raw = coupon.discountType === "percent" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  const capped = coupon.discountType === "percent" ? Math.min(raw, coupon.maximumDiscount ?? 0) : raw;
  return Math.min(Math.max(0, subtotal), Math.round(capped));
}

export function serializeCoupon(coupon: Coupon) {
  return { ...coupon, createdAt: coupon.createdAt.toISOString(), updatedAt: coupon.updatedAt.toISOString() };
}
