/*
|-----------------------------------------
| setting up installInfoSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type InstallInfo = { appName: string; desktopHint: string; mobileHint: string };

export const installInfoApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInstallInfo: build.query<InstallInfo, void>({ query: () => "install/v1", providesTags: ["Install"] }),
  }),
});

export const { useGetInstallInfoQuery } = installInfoApi;
