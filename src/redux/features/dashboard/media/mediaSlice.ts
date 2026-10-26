/*
|-----------------------------------------
| setting up mediaSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";
import { type MediaItem } from "@/redux/features/dashboard/types";

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMedia: build.query<{ items: MediaItem[] }, void>({ query: () => "media/v1", providesTags: ["Media"] }),
    createMedia: build.mutation<{ item: MediaItem }, Omit<MediaItem, "id" | "author" | "createdAt">>({
      query: (body) => ({ url: "media/v1", method: "POST", body }),
      invalidatesTags: ["Media"],
    }),
    updateMedia: build.mutation<void, Pick<MediaItem, "id" | "name">>({
      query: ({ id, ...body }) => ({ url: `media/v1/${id}`, method: "PATCH", body }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patch = dispatch(mediaApi.util.updateQueryData("getMedia", undefined, (draft) => {
          const media = draft.items.find((entry) => entry.id === item.id); if (media) media.name = item.name;
        }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
    deleteMedia: build.mutation<void, string>({
      query: (id) => ({ url: `media/v1/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(mediaApi.util.updateQueryData("getMedia", undefined, (draft) => { draft.items = draft.items.filter((item) => item.id !== id); }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
    deleteMediaMany: build.mutation<{ success: true; deletedCount: number }, string[]>({
      query: (ids) => ({ url: "media/v1/bulk", method: "DELETE", body: { ids } }),
      async onQueryStarted(ids, { dispatch, queryFulfilled }) {
        const patch = dispatch(mediaApi.util.updateQueryData("getMedia", undefined, (draft) => { draft.items = draft.items.filter((item) => !ids.includes(item.id)); }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
  }),
});

export const { useGetMediaQuery, useCreateMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation, useDeleteMediaManyMutation } = mediaApi;
export type { MediaItem } from "@/redux/features/dashboard/types";
