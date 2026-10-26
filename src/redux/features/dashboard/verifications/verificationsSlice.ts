/*
|-----------------------------------------
| setting up verificationsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type VerificationItem = {
  id: string;
  identifier: string;
  type: string;
  expiresAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type VerificationsQuery = { page: number; limit: number; q?: string };
type VerificationsResponse = { verifications: VerificationItem[]; total: number; page: number; limit: number };

export const verificationsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getVerifications: build.query<VerificationsResponse, VerificationsQuery>({
      query: ({ page, limit, q }) => ({ url: "verifications/v1", params: { page, limit, ...(q ? { q } : {}) } }),
      providesTags: ["Verification"],
    }),
    updateVerification: build.mutation<{ success: true }, VerificationItem>({
      query: ({ id, ...body }) => ({ url: `verifications/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Verification"],
    }),
    deleteVerification: build.mutation<{ success: true }, string>({
      query: (id) => ({ url: `verifications/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Verification"],
    }),
    deleteVerifications: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "verifications/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Verification"],
    }),
  }),
});

export const {
  useDeleteVerificationMutation,
  useDeleteVerificationsMutation,
  useGetVerificationsQuery,
  useUpdateVerificationMutation,
} = verificationsApi;
