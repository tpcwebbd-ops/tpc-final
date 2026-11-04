/*
|-----------------------------------------
| setting up course exam workspace, grading, and staff review API hooks
|-----------------------------------------
*/

import type {
  ActiveExam,
  CourseWorkspace,
  ExamAdminOverview,
  ExamQuota,
  ExamResult,
} from "@/lib/dashboard/course-exams";
import { apiSlice } from "@/redux/api/apiSlice";

export const courseExamsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCourseWorkspace: build.query<CourseWorkspace, string>({
      query: (courseId) => ({ url: "my-course/v1/exams", params: { courseId } }),
      providesTags: ["Course"],
    }),
    startCourseExam: build.mutation<{ attempt: ActiveExam }, { courseId: string; examId: string }>({
      query: (body) => ({ url: "my-course/v1/exams", method: "POST", body: { ...body, action: "start" } }),
      invalidatesTags: ["Course"],
    }),
    submitCourseExam: build.mutation<
      { result: ExamResult },
      { courseId: string; attemptId: string; answers: (number | null)[] }
    >({
      query: (body) => ({ url: "my-course/v1/exams", method: "POST", body: { ...body, action: "submit" } }),
      invalidatesTags: ["Course"],
    }),
    getStudentExamResult: build.query<{ result: ExamResult }, { courseId: string; attemptId: string }>({
      query: (params) => ({ url: "my-course/v1/exams", params }),
    }),
    requestExamAllowance: build.mutation<{ quota: ExamQuota }, string>({
      query: (courseId) => ({ url: "my-course/v1/exams", method: "POST", body: { courseId, action: "request-more" } }),
      invalidatesTags: ["Course"],
    }),
    getAdminCourseExams: build.query<ExamAdminOverview, { courseId: string; page: number }>({
      query: (params) => ({ url: "courses/v1/exams", params }),
      providesTags: ["Course"],
    }),
    reviewExamAllowance: build.mutation<
      { quota: ExamQuota },
      { courseId: string; userId: string; requestId: string; action: "approve" | "reject" }
    >({
      query: (body) => ({ url: "courses/v1/exams", method: "PATCH", body }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCourseWorkspaceQuery,
  useStartCourseExamMutation,
  useSubmitCourseExamMutation,
  useLazyGetStudentExamResultQuery,
  useRequestExamAllowanceMutation,
  useGetAdminCourseExamsQuery,
  useReviewExamAllowanceMutation,
} = courseExamsApi;
