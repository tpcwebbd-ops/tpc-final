/*
|-----------------------------------------
| setting up coursesSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import { type CourseInput } from "@/lib/dashboard/courses";
import { apiSlice } from "@/redux/api/apiSlice";
import { type UserItem, type UsersQuery } from "@/redux/features/dashboard/users/usersSlice";

export type CourseItem = CourseInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
export type { CourseContent, CourseEnrollmentRequest, CourseInput, CourseStudent } from "@/lib/dashboard/courses";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query<{ items: CourseItem[] }, void>({
      query: () => "courses/v1",
      providesTags: (result) => [
        ...(result?.items.map((item) => ({ type: "Course" as const, id: item.id })) ?? []),
        "Course",
      ],
    }),
    getCourseStudents: build.query<{ users: UserItem[]; total: number; page: number; limit: number }, UsersQuery>({
      query: ({ page, limit, q }) => ({
        url: "courses/v1/users",
        params: { page, limit, ...(q ? { q } : {}) },
      }),
    }),
    createCourse: build.mutation<{ item: CourseItem }, CourseInput>({
      query: (body) => ({ url: "courses/v1", method: "POST", body }),
      invalidatesTags: ["Course", "Student"],
    }),
    updateCourse: build.mutation<{ item: CourseItem }, CourseInput & Pick<CourseItem, "id">>({
      query: (body) => ({ url: "courses/v1", method: "PUT", body }),
      invalidatesTags: ["Course", "Student"],
    }),
    reviewCourseEnrollmentRequest: build.mutation<
      { item: CourseItem },
      { courseId: string; requestId: string; action: "enroll" | "block" | "unblock" }
    >({
      query: (body) => ({ url: "courses/v1/requests", method: "PATCH", body }),
      invalidatesTags: ["Course", "Student"],
    }),
    deleteCourse: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `courses/v1?id=${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["Course", "Student"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseStudentsQuery,
  useGetCoursesQuery,
  useReviewCourseEnrollmentRequestMutation,
  useUpdateCourseMutation,
} = coursesApi;
