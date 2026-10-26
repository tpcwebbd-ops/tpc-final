/*
|-----------------------------------------
| setting up whatsAppSettingsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type WhatsAppSettings = { number: string; paddingX: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl"; paddingY: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl"; marginX: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl"; marginY: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl"; position: "top-left" | "top-right" | "bottom-left" | "bottom-right"; defaultMessage: string; isVisible: boolean; desktopTextVisible: boolean };

export const whatsAppSettingsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getWhatsAppSettings: build.query<{ settings: WhatsAppSettings }, void>({ query: () => "whatsapp/v1", providesTags: ["WhatsApp"] }),
    updateWhatsAppSettings: build.mutation<{ settings: WhatsAppSettings }, WhatsAppSettings>({
      query: (body) => ({ url: "whatsapp/v1", method: "PATCH", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(whatsAppSettingsApi.util.updateQueryData("getWhatsAppSettings", undefined, (draft) => { draft.settings = body; }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ["WhatsApp"],
    }),
  }),
});

export const { useGetWhatsAppSettingsQuery, useUpdateWhatsAppSettingsMutation } = whatsAppSettingsApi;
