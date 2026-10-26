/*
|-----------------------------------------
| setting up roleSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";
import { type RoleItem, type SidebarItem } from "@/redux/features/dashboard/types";

type RoleResponse = { roles: RoleItem[]; sidebars: SidebarItem[] };

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<RoleResponse, void | { options: true }>({
      query: (params) => ({ url: "roles/v1", params: params || undefined }),
      providesTags: ["Role"],
    }),
    createRole: build.mutation<{ role: RoleItem }, Omit<RoleItem, "id">>({
      query: (body) => ({ url: "roles/v1", method: "POST", body }),
      invalidatesTags: ["Role", "Access", "Sidebar", "Leads"],
    }),
    updateRole: build.mutation<void, RoleItem>({
      query: ({ id, ...body }) => ({ url: `roles/v1/${id}`, method: "PATCH", body }),
      async onQueryStarted(role, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          rolesApi.util.updateQueryData("getRoles", undefined, (draft) => {
            const index = draft.roles.findIndex((current) => current.id === role.id);
            if (index >= 0) draft.roles[index] = role;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Role", "Access", "Sidebar", "Leads"],
    }),
    moveRole: build.mutation<void, { id: string; direction: "up" | "down" }>({
      query: ({ id, direction }) => ({ url: `roles/v1/${id}/move`, method: "POST", body: { direction } }),
      async onQueryStarted({ id, direction }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          rolesApi.util.updateQueryData("getRoles", undefined, (draft) => {
            const sorted = [...draft.roles].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
            const current = draft.roles.find((role) => role.id === id);
            const other = sorted[sorted.findIndex((role) => role.id === id) + (direction === "up" ? -1 : 1)];
            if (current && other) [current.position, other.position] = [other.position, current.position];
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Role", "Access", "Sidebar", "Leads"],
    }),
    deleteRole: build.mutation<void, string>({
      query: (id) => ({ url: `roles/v1/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          rolesApi.util.updateQueryData("getRoles", undefined, (draft) => {
            draft.roles = draft.roles.filter((role) => role.id !== id);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Role", "Access", "Sidebar", "Leads"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useMoveRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
