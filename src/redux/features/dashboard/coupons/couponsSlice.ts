/*
|-----------------------------------------
| setting up couponsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 09 September, 2026
|-----------------------------------------
*/

import { type Coupon, type CouponInput } from "@/lib/dashboard/coupons";
import { apiSlice } from "@/redux/api/apiSlice";

export type CouponItem = Omit<Coupon, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };

export const couponsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCoupons: build.query<{ items: CouponItem[] }, void>({
      query: () => "coupons/v1",
      providesTags: ["Coupon"],
    }),
    createCoupon: build.mutation<{ item: CouponItem }, CouponInput>({
      query: (body) => ({ url: "coupons/v1", method: "POST", body }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: build.mutation<{ item: CouponItem }, CouponInput & { id: string }>({
      query: ({ id, ...body }) => ({ url: `coupons/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: build.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `coupons/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const { useCreateCouponMutation, useDeleteCouponMutation, useGetCouponsQuery, useUpdateCouponMutation } =
  couponsApi;
