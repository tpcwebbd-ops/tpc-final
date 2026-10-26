/*
|-----------------------------------------
| setting up menuSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type MenuData = import("@/app/dashboard/admin/menu/data").MenuData;
export type MenuResponse = { menu: { variant: MenuData["variant"]; data: MenuData } | null; defaults?: MenuData[] };

export const menuApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMenu: build.query<MenuResponse, void>({ query: () => "menu/v1", providesTags: ["Menu"] }),
    saveMenu: build.mutation<MenuResponse, { variant: MenuData["variant"]; data: MenuData }>({
      query: (body) => ({ url: "menu/v1", method: "POST", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(menuApi.util.updateQueryData("getMenu", undefined, (draft) => { draft.menu = body; }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ["Menu"],
    }),
    deleteMenu: build.mutation<MenuResponse, void>({
      query: () => ({ url: "menu/v1", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patch = dispatch(menuApi.util.updateQueryData("getMenu", undefined, (draft) => { draft.menu = null; }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const { useGetMenuQuery, useSaveMenuMutation, useDeleteMenuMutation } = menuApi;
