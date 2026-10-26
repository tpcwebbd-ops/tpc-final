/*
|-----------------------------------------
| setting up usersSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  mobileNumber: string;
  address: string;
  bio: string;
  profilePicture: string;
  gender: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UsersQuery = { page: number; limit: number; q?: string };
type UsersResponse = { users: UserItem[]; total: number; page: number; limit: number };

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, UsersQuery>({
      query: ({ page, limit, q }) => ({
        url: "users/v1",
        params: { page, limit, ...(q ? { q } : {}) },
      }),
      providesTags: ["User"],
    }),
    updateUser: build.mutation<{ success: true }, UserItem>({
      query: ({ id, ...body }) => ({ url: `users/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
    deleteUser: build.mutation<{ success: true }, string>({
      query: (id) => ({ url: `users/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    deleteUsers: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "users/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useDeleteUserMutation, useDeleteUsersMutation, useGetUsersQuery, useUpdateUserMutation } = usersApi;
