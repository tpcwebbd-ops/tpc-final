/*
|-----------------------------------------
| setting up sidebarSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import type { LeadActor } from "@/lib/dashboard/leads";
import type { DashboardPermissions } from "@/lib/dashboard/permissions";
import { apiSlice } from "@/redux/api/apiSlice";
import { type SidebarItem } from "@/redux/features/dashboard/types";

type SidebarResponse = {
  items: SidebarItem[];
  roleName: string | null;
  access: DashboardPermissions;
  leadsActor: LeadActor | null;
};

export const sidebarsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getSidebars: build.query<SidebarResponse, void>({ query: () => "sidebars/v1", providesTags: ["Sidebar"] }),
    createSidebar: build.mutation<
      { item: SidebarItem },
      Pick<SidebarItem, "name" | "url" | "icon"> & { parentId?: string | null }
    >({
      query: (body) => ({ url: "sidebars/v1", method: "POST", body: { ...body, parentId: body.parentId ?? null } }),
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads"],
    }),
    moveSidebar: build.mutation<void, { id: string; direction: "up" | "down" }>({
      query: ({ id, direction }) => ({ url: `sidebars/v1/${id}/move`, method: "POST", body: { direction } }),
      async onQueryStarted({ id, direction }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sidebarsApi.util.updateQueryData("getSidebars", undefined, (draft) => {
            const current = draft.items.find((item) => item.id === id);
            if (!current) return;
            const siblings = draft.items
              .filter((item) => item.parentId === current.parentId)
              .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
            const other = siblings[siblings.findIndex((item) => item.id === id) + (direction === "up" ? -1 : 1)];
            if (other) [current.position, other.position] = [other.position, current.position];
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads"],
    }),
    updateSidebar: build.mutation<void, SidebarItem>({
      query: ({ id, ...body }) => ({ url: `sidebars/v1/${id}`, method: "PATCH", body }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sidebarsApi.util.updateQueryData("getSidebars", undefined, (draft) => {
            const index = draft.items.findIndex((current) => current.id === item.id);
            if (index >= 0) draft.items[index] = item;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads"],
    }),
    deleteSidebar: build.mutation<void, string>({
      query: (id) => ({ url: `sidebars/v1/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sidebarsApi.util.updateQueryData("getSidebars", undefined, (draft) => {
            const toRemove = new Set<string>([id]);
            let changed = true;
            while (changed) {
              changed = false;
              for (const item of draft.items) {
                if (item.parentId && toRemove.has(item.parentId) && !toRemove.has(item.id)) {
                  toRemove.add(item.id);
                  changed = true;
                }
              }
            }
            draft.items = draft.items.filter((item) => !toRemove.has(item.id));
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads"],
    }),
  }),
});

export const {
  useGetSidebarsQuery,
  useCreateSidebarMutation,
  useMoveSidebarMutation,
  useUpdateSidebarMutation,
  useDeleteSidebarMutation,
} = sidebarsApi;
