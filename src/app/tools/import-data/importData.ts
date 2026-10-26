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
export type ResetImportDataResult = { pagesDeleted: number; sidebarsDeleted: number };

export type ImportDataStatus = {
  sidebarUrls: string[];
  pagePaths: string[];
  canImportSidebars: boolean;
  canImportPages: boolean;
  canReset: boolean;
  resettableSidebarCount: number;
  resettablePageCount: number;
};

const importDataApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getImportStatus: build.query<ImportDataStatus, void>({
      query: () => "../tools/import-data/v1",
      providesTags: ["Sidebar", "Page", "Role", "Access"],
    }),
    importData: build.mutation<ImportDataResult, ImportDataRequest>({
      query: (body) => ({ url: "../tools/import-data/v1", method: "POST", body }),
      invalidatesTags: ["Sidebar", "Role", "Access", "Leads", "Page"],
    }),
    resetImportData: build.mutation<ResetImportDataResult, void>({
      query: () => ({ url: "../tools/import-data/v1", method: "DELETE" }),
      invalidatesTags: ["Sidebar", "Role", "Access", "Page"],
    }),
  }),
});

export const { useGetImportStatusQuery, useImportDataMutation, useResetImportDataMutation } = importDataApi;
