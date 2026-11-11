/*
|-----------------------------------------
| setting up MCQ examination management and summary API hooks
|-----------------------------------------
*/

import type { McqExam, McqExamInput, McqExamSummary, McqResult, McqResultsPage } from "@/lib/dashboard/mcq-exams";
import { apiSlice } from "@/redux/api/apiSlice";

const mcqApi = apiSlice.enhanceEndpoints({ addTagTypes: ["McqExam"] }).injectEndpoints({
  endpoints: (build) => ({
    getMcqExams: build.query<{ items: McqExamSummary[]; total: number; page: number }, number>({
      query: (page) => ({ url: "mcq/v1", params: { page } }),
      providesTags: ["McqExam"],
    }),
    getMcqExam: build.query<McqExam, string>({
      query: (id) => ({ url: "mcq/v1", params: { id } }),
      providesTags: ["McqExam"],
    }),
    saveMcqExam: build.mutation<McqExam, McqExamInput & { id?: string }>({
      query: (body) => ({ url: "mcq/v1", method: body.id ? "PATCH" : "POST", body }),
      invalidatesTags: ["McqExam"],
    }),
    deleteMcqExam: build.mutation<{ ok: boolean; deletedAttempts: number; deletedStudents: number }, string>({
      query: (id) => ({ url: "mcq/v1", method: "DELETE", params: { id } }),
      invalidatesTags: ["McqExam"],
    }),
    getMcqResults: build.query<McqResultsPage, { id: string; page: number }>({
      query: (params) => ({ url: "mcq/v1", params: { ...params, results: "true" } }),
      providesTags: ["McqExam"],
    }),
    getMcqResult: build.query<McqResult, { id: string; attemptId: string }>({
      query: (params) => ({ url: "mcq/v1", params }),
      providesTags: ["McqExam"],
    }),
  }),
});
export const {
  useGetMcqExamsQuery,
  useGetMcqExamQuery,
  useSaveMcqExamMutation,
  useDeleteMcqExamMutation,
  useGetMcqResultsQuery,
  useGetMcqResultQuery,
} = mcqApi;
