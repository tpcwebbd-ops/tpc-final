/*
|-----------------------------------------
| setting up pagesSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type PageBlockType = "form" | "section" | "all-page" | "rich-text" | "container";
export type PageBlockVariant =
  | "container-1"
  | "container-2"
  | "form-1"
  | "form-2"
  | "form-3"
  | "section-1"
  | "section-2"
  | "section-3"
  | "section-4"
  | "section-5"
  | "section-6"
  | "section-7"
  | "section-8"
  | "section-9"
  | "section-10"
  | "section-11"
  | "section-12"
  | "section-13"
  | "section-14"
  | "section-15"
  | "section-16"
  | "section-17"
  | "section-18"
  | "section-19"
  | "section-20"
  | "section-21"
  | "section-22"
  | "section-23"
  | "section-24"
  | "section-25"
  | "section-26"
  | "section-27"
  | "section-28"
  | "section-29"
  | "section-30"
  | "section-31"
  | "section-32"
  | "section-33"
  | "section-34"
  | "section-35"
  | "section-36"
  | "section-37"
  | "section-38"
  | "section-39"
  | "section-40"
  | "section-41"
  | "section-42"
  | "section-43"
  | "section-44"
  | "section-45"
  | "section-46"
  | "section-47"
  | "section-48"
  | "all-home"
  | "company-story"
  | "whatsapp-faq"
  | "security"
  | "site-terms-and-conditions"
  | "delivery-policy"
  | "cookie-policy"
  | "leadership-team"
  | "country-directory"
  | "about-the-country"
  | "details-page"
  | "visa-requirements"
  | "visa-services"
  | "visa-application-support"
  | "visa-consultancy"
  | "visa-service-catalogue"
  | "visa-insights"
  | "all-about-us"
  | "all-contact-us"
  | "all-frequently-ask-questions"
  | "all-privacy"
  | "all-refund"
  | "all-team-member"
  | "all-terms"
  | "rich-text";

export type PageBlock = {
  id: string;
  type: PageBlockType;
  variant: PageBlockVariant;
  title?: string;
  data: Record<string, unknown>;
};
export type SitePage = {
  id: string;
  title: string;
  path: string;
  description: string;
  published: boolean;
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
};
export const pagesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPages: build.query<{ items: SitePage[] }, void>({
      query: () => "pages/v1",
      providesTags: (r) => [...(r?.items.map((p) => ({ type: "Page" as const, id: p.id })) ?? []), "Page"],
    }),
    createPage: build.mutation<{ item: SitePage }, Pick<SitePage, "title" | "path" | "description">>({
      query: (body) => ({ url: "pages/v1", method: "POST", body }),
      invalidatesTags: ["Page"],
    }),
    updatePage: build.mutation<{ item: SitePage }, Partial<SitePage> & Pick<SitePage, "id">>({
      query: (body) => ({ url: "pages/v1", method: "PUT", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          pagesApi.util.updateQueryData("getPages", undefined, (d) => {
            const i = d.items.findIndex((x) => x.id === body.id);
            if (i >= 0) d.items[i] = { ...d.items[i], ...body };
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Page"],
    }),
    deletePage: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `pages/v1?id=${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["Page"],
    }),
    revalidatePages: build.mutation<{ count: number; path?: string }, { path?: string } | void>({
      query: (body) => ({ url: "pages/v1/revalidate", method: "POST", body: body ?? {} }),
    }),
    getSubmissions: build.query<
      {
        items: { id: string; pageId: string; blockId: string; values: Record<string, string>; createdAt: string }[];
        total: number;
        page: number;
        limit: number;
      },
      { pageId: string; page: number; limit: number; q?: string }
    >({
      query: ({ pageId, page, limit, q }) =>
        `pages/v1/submissions?${new URLSearchParams({ pageId, page: String(page), limit: String(limit), ...(q ? { q } : {}) })}`,
      providesTags: ["PageSubmission"],
    }),
    updateSubmission: build.mutation<{ ok: boolean }, { id: string; values: Record<string, string> }>({
      query: (body) => ({ url: "pages/v1/submissions", method: "PUT", body }),
      invalidatesTags: ["PageSubmission"],
    }),
    deleteSubmission: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `pages/v1/submissions?id=${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["PageSubmission"],
    }),
    bulkDeleteSubmissions: build.mutation<{ ok: boolean; count: number }, string[]>({
      query: (ids) => ({ url: "pages/v1/submissions", method: "DELETE", body: { ids } }),
      invalidatesTags: ["PageSubmission"],
    }),
  }),
});
export const {
  useGetPagesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useRevalidatePagesMutation,
  useGetSubmissionsQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
  useBulkDeleteSubmissionsMutation,
} = pagesApi;
