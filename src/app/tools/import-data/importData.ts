/*
|-----------------------------------------
| setting up importData.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type ImportDataRequest = {
  pagePaths: string[];
  sidebarUrls: string[];
};
export type ImportDataResult = { inserted: number; updated: number; pagesInserted: number };

const importDataApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getImportStatus: build.query<
      { sidebarUrls: string[]; pagePaths: string[]; canImportSidebars: boolean; canImportPages: boolean },
      void
    >({
      query: () => "../tools/import-data/v1",
      providesTags: ["Sidebar", "Page", "Role", "Access"],
    }),
    importData: build.mutation<ImportDataResult, ImportDataRequest>({
      query: (body) => ({ url: "../tools/import-data/v1", method: "POST", body }),
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads", "Page"],
    }),
  }),
});

export const { useGetImportStatusQuery, useImportDataMutation } = importDataApi;
