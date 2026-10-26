/*
|-----------------------------------------
| setting up trackingSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type TrackingProvider = "facebook" | "gtm" | "ga4" | "tiktok";
export type TrackingItem = { id: string; provider: TrackingProvider; pixelId: string; enabled: boolean; createdAt: string; updatedAt: string };
type TrackingPayload = Pick<TrackingItem, "provider" | "pixelId" | "enabled">;
export const trackingApi = apiSlice.injectEndpoints({ endpoints: (build) => ({
  getTracking: build.query<{ items: TrackingItem[] }, void>({ query: () => "tracking/v1", providesTags: ["Tracking"] }),
  createTracking: build.mutation<{ item: TrackingItem }, TrackingPayload>({
    query: (body) => ({ url: "tracking/v1", method: "POST", body }),
    async onQueryStarted(item, { dispatch, queryFulfilled }) {
      try {
        const { data } = await queryFulfilled;
        dispatch(trackingApi.util.updateQueryData("getTracking", undefined, (draft) => { draft.items.push(data.item); }));
      } catch { /* the form reports the API error */ }
    },
  }),
  updateTracking: build.mutation<{ item: TrackingItem }, Pick<TrackingItem, "id" | "pixelId" | "enabled">>({
    query: ({ id, ...body }) => ({ url: `tracking/v1/${id}`, method: "PATCH", body }),
    async onQueryStarted(item, { dispatch, queryFulfilled }) {
      const patch = dispatch(trackingApi.util.updateQueryData("getTracking", undefined, (draft) => {
        const current = draft.items.find((entry) => entry.id === item.id);
        if (current) Object.assign(current, item, { updatedAt: new Date().toISOString() });
      }));
      try { await queryFulfilled; } catch { patch.undo(); }
    },
  }),
  deleteTracking: build.mutation<{ ok: boolean }, string>({
    query: (id) => ({ url: `tracking/v1/${id}`, method: "DELETE" }),
    async onQueryStarted(id, { dispatch, queryFulfilled }) {
      const patch = dispatch(trackingApi.util.updateQueryData("getTracking", undefined, (draft) => { draft.items = draft.items.filter((item) => item.id !== id); }));
      try { await queryFulfilled; } catch { patch.undo(); }
    },
  }),
  deleteTrackings: build.mutation<{ ok: boolean; deletedCount: number }, string[]>({
    query: (ids) => ({ url: "tracking/v1/bulk", method: "DELETE", body: { ids } }),
    async onQueryStarted(ids, { dispatch, queryFulfilled }) {
      const patch = dispatch(trackingApi.util.updateQueryData("getTracking", undefined, (draft) => { draft.items = draft.items.filter((item) => !ids.includes(item.id)); }));
      try { await queryFulfilled; } catch { patch.undo(); }
    },
  }),
}) });
export const { useGetTrackingQuery, useCreateTrackingMutation, useUpdateTrackingMutation, useDeleteTrackingMutation, useDeleteTrackingsMutation } = trackingApi;
