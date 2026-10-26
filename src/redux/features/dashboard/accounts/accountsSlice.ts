/*
|-----------------------------------------
| setting up accountsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type AccountItem = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AccountsQuery = { page: number; limit: number; q?: string };
type AccountsResponse = { accounts: AccountItem[]; total: number; page: number; limit: number };

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<AccountsResponse, AccountsQuery>({
      query: ({ page, limit, q }) => ({
        url: "accounts/v1",
        params: { page, limit, ...(q ? { q } : {}) },
      }),
      providesTags: ["Account"],
    }),
    updateAccount: build.mutation<{ success: true }, AccountItem>({
      query: ({ id, ...body }) => ({ url: `accounts/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Account"],
    }),
    deleteAccount: build.mutation<{ success: true }, string>({
      query: (id) => ({ url: `accounts/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Account"],
    }),
    deleteAccounts: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "accounts/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const { useDeleteAccountMutation, useDeleteAccountsMutation, useGetAccountsQuery, useUpdateAccountMutation } =
  accountsApi;
