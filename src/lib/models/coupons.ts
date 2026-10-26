/*
|-----------------------------------------
| setting up coupons model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import type { Document } from "mongodb";

import type { Coupon } from "@/lib/dashboard/coupons";
import { database } from "@/lib/db";

export const couponsCollection = <T extends Document>() => database().collection<T>("coupons");
export const ensureCouponIndexes = () =>
  couponsCollection<Coupon>().createIndex({ code: 1 }, { name: "coupon_code_unique", unique: true });
export const listCoupons = () => couponsCollection<Coupon>().find({}).sort({ createdAt: -1 }).toArray();
export const createCoupon = (coupon: Coupon) => couponsCollection<Coupon>().insertOne(coupon);
export const updateCoupon = (id: string, data: Omit<Coupon, "id" | "createdAt" | "updatedAt">) =>
  couponsCollection<Coupon>().findOneAndUpdate(
    { id },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
export const deleteCoupon = (id: string) => couponsCollection<Coupon>().deleteOne({ id });
