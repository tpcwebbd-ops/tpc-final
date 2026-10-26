/*
|-----------------------------------------
| setting up seoSettingsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type SeoTarget = { type: "layout" } | { type: "page"; pageId: string };
export type SeoPage = { id: string; title: string; path: string; canonicalUrl: string };
export type SeoSetting = {
  targetKey: "layout" | `page:${string}`;
  target: SeoTarget;
  title: string;
  description: string;
  socialImage: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  createdAt: string;
  updatedAt: string;
};
export type SeoListItem = { setting: SeoSetting; page: SeoPage | null };
export type SeoFields = Pick<SeoSetting, "title" | "description" | "socialImage" | "canonicalUrl" | "focusKeyword">;
type SaveSeoSettings = Omit<SeoFields, "focusKeyword"> & { target: SeoTarget };
type UpdateSeoSettings = Omit<SeoFields, "focusKeyword"> & { target: SeoTarget };

export const seoSettingsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getSeoSettingsList: build.query<{ items: SeoListItem[] }, void>({
      query: () => "seo/v1?list=true",
      providesTags: (result) => [
        "SeoSetting",
        ...(result?.items.map(({ setting }) => ({ type: "SeoSetting" as const, id: setting.targetKey })) ?? []),
      ],
    }),
    getPublishedSeoPages: build.query<{ items: SeoPage[] }, void>({
      query: () => "seo/v1?pages=true",
      providesTags: ["SeoSetting"],
    }),
    createSeoSettings: build.mutation<{ setting: SeoSetting }, SaveSeoSettings>({
      query: (body) => ({ url: "seo/v1", method: "POST", body }),
      invalidatesTags: ["SeoSetting"],
    }),
    updateSeoSettings: build.mutation<{ setting: SeoSetting }, UpdateSeoSettings>({
      query: (body) => ({ url: "seo/v1", method: "PUT", body }),
      invalidatesTags: ["SeoSetting"],
    }),
    deleteSeoSettings: build.mutation<{ ok: boolean }, SeoTarget>({
      query: (target) => ({
        url: `seo/v1?${target.type === "layout" ? "target=layout" : `target=page&pageId=${encodeURIComponent(target.pageId)}`}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SeoSetting"],
    }),
  }),
});

export const {
  useGetSeoSettingsListQuery,
  useGetPublishedSeoPagesQuery,
  useCreateSeoSettingsMutation,
  useUpdateSeoSettingsMutation,
  useDeleteSeoSettingsMutation,
} = seoSettingsApi;
