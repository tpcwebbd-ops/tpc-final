/*
|-----------------------------------------
| setting up footerSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type FooterData = import("@/components/footer/FooterIndex").FooterData;
export type FooterResponse = {
  footer: { variant: string; data: Record<string, unknown> } | null;
  defaults?: FooterData[];
};

export const footerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getFooter: build.query<FooterResponse, void>({ query: () => "footer/v1", providesTags: ["Footer"] }),
    saveFooter: build.mutation<FooterResponse, { variant: string; data: Record<string, unknown> }>({
      query: (body) => ({ url: "footer/v1", method: "POST", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          footerApi.util.updateQueryData("getFooter", undefined, (draft) => {
            draft.footer = body;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Footer"],
    }),
    deleteFooter: build.mutation<FooterResponse, void>({
      query: () => ({ url: "footer/v1", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          footerApi.util.updateQueryData("getFooter", undefined, (draft) => {
            draft.footer = null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Footer"],
    }),
  }),
});

export const { useGetFooterQuery, useSaveFooterMutation, useDeleteFooterMutation } = footerApi;
