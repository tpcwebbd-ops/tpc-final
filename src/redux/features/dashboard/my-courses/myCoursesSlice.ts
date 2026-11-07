/*
|-----------------------------------------
| setting up myCoursesSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type StudentCourseItem = {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalClasses: number;
  time: string;
  contentCount: number;
  progress: { percentage: number; completed: number; total: number };
  enrollmentStatus: "not-requested" | "pending" | "enrolled" | "blocked";
  requestedAt: string | null;
  enrolledAt: string | null;
};

export const myCoursesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyCourses: build.query<{ items: StudentCourseItem[] }, void>({
      query: () => "my-course/v1",
      providesTags: ["Course"],
    }),
    requestCourseEnrollment: build.mutation<{ request: { id: string } }, string>({
      query: (courseId) => ({ url: "my-course/v1", method: "POST", body: { courseId } }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const { useGetMyCoursesQuery, useRequestCourseEnrollmentMutation } = myCoursesApi;
