/*
|-----------------------------------------
| setting up profileSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type Profile = { name: string; email: string; mobileNumber: string; address: string; bio: string; profilePicture: string; gender: "" | "Male" | "Female" | "Other" };

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<{ profile: Profile }, void>({ query: () => "profile/v1", providesTags: ["Profile"] }),
    updateProfile: build.mutation<{ profile: Profile }, Omit<Profile, "email">>({
      query: (body) => ({ url: "profile/v1", method: "PATCH", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(profileApi.util.updateQueryData("getProfile", undefined, (draft) => { Object.assign(draft.profile, body); }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
