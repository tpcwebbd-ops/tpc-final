/*
|-----------------------------------------
| setting up apiSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| shared RTK Query cache service
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard/",
    credentials: "include",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("token")?.replaceAll('"', "");
        if (token) headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Sidebar",
    "Role",
    "Access",
    "Leads",
    "Media",
    "Install",
    "WhatsApp",
    "Profile",
    "TopBanner",
    "Footer",
    "Menu",
    "Navigation",
    "Build",
    "Tracking",
    "Category",
    "Page",
    "PageSubmission",
    "SeoSetting",
    "User",
    "Account",
    "Session",
    "Verification",
    "Coupon",
  ],
  endpoints: () => ({}),
});
