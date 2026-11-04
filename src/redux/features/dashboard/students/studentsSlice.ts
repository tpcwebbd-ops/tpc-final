/*
|-----------------------------------------
| setting up studentsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import { apiSlice } from "@/redux/api/apiSlice";

export type StudentEnrollment = {
  courseId: string;
  courseName: string;
  progress: number;
  paymentStatus: "paid" | "unpaid";
};
export type StudentItem = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  createdAt: string | null;
  enrollments: StudentEnrollment[];
};
export type StudentsQuery = {
  page: number;
  limit: number;
  search?: string;
  courseId?: string;
  payment?: "" | "paid" | "unpaid" | "not-enrolled";
};
export type StudentsResponse = {
  items: StudentItem[];
  total: number;
  page: number;
  limit: number;
  summary: {
    registered: number;
    enrolled: number;
    notEnrolled: number;
    paid: number;
    courses: {
      id: string;
      name: string;
      enrolled: number;
      enrolledPercent: number;
      paid: number;
      averageProgress: number;
    }[];
  };
};

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStudents: build.query<StudentsResponse, StudentsQuery>({
      query: ({ page, limit, search, courseId, payment }) => ({
        url: "students/v1",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(courseId ? { courseId } : {}),
          ...(payment ? { payment } : {}),
        },
      }),
      providesTags: ["Student"],
    }),
  }),
});

export const { useGetStudentsQuery } = studentsApi;
