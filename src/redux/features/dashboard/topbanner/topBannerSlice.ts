/*
|-----------------------------------------
| setting up topBannerSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type TopBannerData = import("@/components/topbanner/TopBannerIndex").TopBannerData;
export type TopBannerResponse = { banner: { variant: string; data: Record<string, unknown> } | null };

export const topBannerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTopBanner: build.query<TopBannerResponse, void>({ query: () => "topbanner/v1", providesTags: ["TopBanner"] }),
    saveTopBanner: build.mutation<TopBannerResponse, { variant: string; data: Record<string, unknown> }>({
      query: (body) => ({ url: "topbanner/v1", method: "POST", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          topBannerApi.util.updateQueryData("getTopBanner", undefined, (draft) => {
            draft.banner = body;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["TopBanner"],
    }),
    deleteTopBanner: build.mutation<TopBannerResponse, void>({
      query: () => ({ url: "topbanner/v1", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          topBannerApi.util.updateQueryData("getTopBanner", undefined, (draft) => {
            draft.banner = null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["TopBanner"],
    }),
  }),
});

export const { useGetTopBannerQuery, useSaveTopBannerMutation, useDeleteTopBannerMutation } = topBannerApi;
