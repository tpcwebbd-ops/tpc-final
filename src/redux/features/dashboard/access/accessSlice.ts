/*
|-----------------------------------------
| setting up accessSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";
import { type AccessItem, type RoleItem } from "@/redux/features/dashboard/types";

type AccessResponse = { items: AccessItem[]; roles: Pick<RoleItem, "id" | "name">[] };
export type AccessQuery = {
  page: number;
  pageSize: number;
  search?: string;
  roleId?: string;
  missingRole?: boolean;
  options?: boolean;
};
type PaginatedAccessResponse = AccessResponse & {
  total: number;
  page: number;
  pageSize: number;
  roleCounts: Record<string, number>;
  missingRoleCount: number;
};

export const accessApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccess: build.query<PaginatedAccessResponse, AccessQuery>({
      query: ({ page, pageSize, search, roleId, missingRole, options }) => ({
        url: "access/v1",
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(roleId ? { roleId } : {}),
          ...(missingRole ? { missingRole: true } : {}),
          ...(options ? { options: true } : {}),
        },
      }),
      providesTags: ["Access"],
    }),
    createAccess: build.mutation<{ item: AccessItem }, Pick<AccessItem, "email" | "roleId" | "blocked">>({
      query: (body) => ({ url: "access/v1", method: "POST", body }),
      invalidatesTags: ["Access", "Sidebar", "Leads"],
    }),
    updateAccess: build.mutation<void, Pick<AccessItem, "id" | "roleId" | "blocked">>({
      query: ({ id, ...body }) => ({ url: `access/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Access", "Sidebar", "Leads"],
    }),
    deleteAccess: build.mutation<void, string>({
      query: (id) => ({ url: `access/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Access", "Sidebar", "Leads"],
    }),
    deleteAccesses: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "access/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Access", "Sidebar", "Leads"],
    }),
  }),
});

export const {
  useGetAccessQuery,
  useCreateAccessMutation,
  useUpdateAccessMutation,
  useDeleteAccessMutation,
  useDeleteAccessesMutation,
} = accessApi;
