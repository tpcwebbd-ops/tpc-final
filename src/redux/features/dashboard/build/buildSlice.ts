/*
|-----------------------------------------
| setting up buildSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August 2026
|-----------------------------------------
*/
import type { BuildItem, BuildTarget } from "@/app/api/dashboard/build/v1/route";
import { apiSlice } from "@/redux/api/apiSlice";
type BuildResponse = { cooldowns: Record<string, string | null>; count?: number; items?: BuildItem[]; error?: string };
export const buildApi = apiSlice.injectEndpoints({ endpoints: (build) => ({ getBuildStatus: build.query<BuildResponse, void>({ query: () => "build/v1", providesTags: ["Build"] }), revalidateBuild: build.mutation<BuildResponse, BuildTarget>({ query: (target) => ({ url: "build/v1", method: "POST", body: { target } }), invalidatesTags: ["Build"] }) }) });
export const { useGetBuildStatusQuery, useRevalidateBuildMutation } = buildApi;
