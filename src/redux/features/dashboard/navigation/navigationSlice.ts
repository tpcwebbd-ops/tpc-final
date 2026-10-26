/*
|-----------------------------------------
| setting up navigationSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August 2026
|-----------------------------------------
*/

import type { NavigationData } from "@/app/api/dashboard/navigation/v1/route";
import { apiSlice } from "@/redux/api/apiSlice";
type Response = { navigation: NavigationData };
export const navigationApi = apiSlice.injectEndpoints({ endpoints: (build) => ({ getNavigation: build.query<Response, void>({ query: () => "navigation/v1?dashboard=1", providesTags: ["Navigation"] }), saveNavigation: build.mutation<Response, NavigationData>({ query: (body) => ({ url: "navigation/v1", method: "POST", body }), async onQueryStarted(body, { dispatch, queryFulfilled }) { const patch = dispatch(navigationApi.util.updateQueryData("getNavigation", undefined, (draft) => { draft.navigation = body; })); try { await queryFulfilled; } catch { patch.undo(); } }, invalidatesTags: ["Navigation"] }) }) });
export const { useGetNavigationQuery, useSaveNavigationMutation } = navigationApi;
