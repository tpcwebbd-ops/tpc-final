/*
|-----------------------------------------
| setting up coupons service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import { MongoServerError } from "mongodb";

import { type Coupon, type CouponInput, serializeCoupon } from "@/lib/dashboard/coupons";
import { createCoupon, deleteCoupon, ensureCouponIndexes, listCoupons, updateCoupon } from "@/lib/models/coupons";

export { ensureCouponIndexes };
export async function listCouponsForApi() {
  return (await listCoupons()).map(serializeCoupon);
}
export async function createCouponForApi(data: CouponInput) {
  const now = new Date(),
    item: Coupon = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  try {
    await ensureCouponIndexes();
    await createCoupon(item);
    return { kind: "created" as const, item };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return { kind: "duplicate" as const };
    throw error;
  }
}
export async function updateCouponForApi(id: string, data: CouponInput) {
  try {
    await ensureCouponIndexes();
    const item = await updateCoupon(id, data);
    return item ? { kind: "updated" as const, item } : { kind: "not-found" as const };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return { kind: "duplicate" as const };
    throw error;
  }
}
export async function removeCoupon(id: string) {
  return (await deleteCoupon(id)).deletedCount > 0;
}
