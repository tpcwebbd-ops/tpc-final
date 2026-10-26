/*
|-----------------------------------------
| setting up sessionsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type SessionItem = {
  id: string;
  userId: string;
  expiresAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  ipAddress: string;
  userAgent: string;
};
export type SessionsQuery = { page: number; limit: number; q?: string };
type SessionsResponse = { sessions: SessionItem[]; total: number; page: number; limit: number };

export const sessionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getSessions: build.query<SessionsResponse, SessionsQuery>({
      query: ({ page, limit, q }) => ({ url: "sessions/v1", params: { page, limit, ...(q ? { q } : {}) } }),
      providesTags: ["Session"],
    }),
    updateSession: build.mutation<{ success: true }, SessionItem>({
      query: ({ id, ...body }) => ({ url: `sessions/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Session"],
    }),
    deleteSession: build.mutation<{ success: true }, string>({
      query: (id) => ({ url: `sessions/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Session"],
    }),
    deleteSessions: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "sessions/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Session"],
    }),
  }),
});
export const { useDeleteSessionMutation, useDeleteSessionsMutation, useGetSessionsQuery, useUpdateSessionMutation } =
  sessionsApi;
