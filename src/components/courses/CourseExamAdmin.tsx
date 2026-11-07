/*
|-----------------------------------------
| setting up staff overview of exam participation, results, and additional attempts
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { examDuration } from "@/lib/dashboard/course-exams";
import { examStatus, learningStatus } from "@/lib/dashboard/course-status";
import {
  useGetAdminCourseExamsQuery,
  useReviewExamAllowanceMutation,
} from "@/redux/features/dashboard/course-exams/courseExamsSlice";

import { ExamStatusLegend, StatusBadge } from "./CourseStatus";

export default function CourseExamAdmin({ courseId }: { courseId: string }) {
  const [page, setPage] = useState(1);
  const { data, error, isFetching, refetch } = useGetAdminCourseExamsQuery(
    { courseId, page },
    { refetchOnMountOrArgChange: true },
  );
  const [review, reviewState] = useReviewExamAllowanceMutation();
  async function reviewRequest(userId: string, requestId: string, action: "approve" | "reject") {
    try {
      await review({ courseId, userId, requestId, action }).unwrap();
      toast.success(action === "approve" ? "20 more exam attempts granted for this course." : "Request declined.");
    } catch {
      toast.error("Could not review this request. Refresh and try again.");
    }
  }
  return (
    <section className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Exam results and allowances</h3>
        <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
          Refresh results
        </button>
      </header>
      {error && <p className="text-sm text-red-700">Could not load exam results.</p>}
      {!data && !error && <p className="text-sm text-stone-500">Loading exam results…</p>}
      {data && (
        <>
          <h4 className="text-sm font-semibold">Student allowances</h4>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {data.accounts.map((account) => (
              <div
                className={
                  "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm " +
                  learningStatus(account.progress).style
                }
                key={account.userId}
              >
                <div>
                  <p className="font-medium">{account.studentName}</p>
                  <div className="my-2">
                    <StatusBadge {...learningStatus(account.progress)} />{" "}
                    <span className="text-xs">{account.progress}% complete</span>
                  </div>
                  <progress
                    aria-label={account.studentName + " course progress"}
                    max={100}
                    value={account.progress}
                    className="h-1.5 w-44 accent-emerald-600"
                  />
                  <p className="break-all text-xs text-stone-500">{account.studentEmail}</p>
                  <p className="mt-1">
                    {account.quota.used} / {account.quota.limit} attempts used
                  </p>
                </div>
                {account.quota.request?.status === "pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="w-full text-xs text-amber-800">
                      Requested {new Date(account.quota.request.requestedAt).toLocaleString()}
                    </span>
                    <button
                      className="primary-button"
                      disabled={reviewState.isLoading}
                      onClick={() => void reviewRequest(account.userId, account.quota.request!.id, "approve")}
                      type="button"
                    >
                      Approve +20 exams
                    </button>
                    <button
                      className="secondary-button"
                      disabled={reviewState.isLoading}
                      onClick={() => void reviewRequest(account.userId, account.quota.request!.id, "reject")}
                      type="button"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-stone-500">
                    {account.quota.request ? `Last request ${account.quota.request.status}` : "No pending request"}
                  </span>
                )}
              </div>
            ))}
            {!data.accounts.length && <p className="text-sm text-stone-500">No enrolled students yet.</p>}
          </div>
          <ExamStatusLegend />
          <h4 className="text-sm font-semibold">Exam participation ({data.total})</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="bg-amber-50 text-stone-600">
                <tr>
                  <th className="p-2">Student</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">Started / submitted</th>
                  <th className="p-2">Time taken</th>
                  <th className="p-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {data.attempts.map((attempt) => (
                  <tr className={"border-t border-white align-top " + examStatus(attempt).style} key={attempt.id}>
                    <td className="p-2">
                      {attempt.studentName}
                      <span className="block text-xs text-stone-500">{attempt.studentEmail}</span>
                    </td>
                    <td className="p-2">
                      {attempt.examTitle}
                      <div className="mt-2">
                        <StatusBadge {...examStatus(attempt)} />
                      </div>
                    </td>
                    <td className="p-2 text-xs">
                      {new Date(attempt.startedAt).toLocaleString()}
                      <span className="mt-1 block">
                        {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "In progress"}
                      </span>
                    </td>
                    <td className="p-2">
                      {attempt.elapsedSeconds === null ? "In progress" : examDuration(attempt.elapsedSeconds)}
                    </td>
                    <td className="p-2 font-semibold">
                      {attempt.score === null ? "Pending" : `${attempt.score} / ${attempt.totalMarks}`}
                      {examStatus(attempt).percentage !== null && (
                        <span className="mt-1 block text-xs">{examStatus(attempt).percentage}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.attempts.length && <p className="text-sm text-stone-500">No exams have been started yet.</p>}
          <div className="flex items-center justify-end gap-3 text-sm">
            <button
              className="secondary-button"
              disabled={isFetching || page === 1}
              onClick={() => setPage(page - 1)}
              type="button"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.max(1, Math.ceil(data.total / 50))}
            </span>
            <button
              className="secondary-button"
              disabled={isFetching || page * 50 >= data.total}
              onClick={() => setPage(page + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
