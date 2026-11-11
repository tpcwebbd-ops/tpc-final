/*
|-----------------------------------------
| setting up the MCQ management and summary dashboard
|-----------------------------------------
*/

"use client";

import { Copy, ExternalLink, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { McqError, McqPagination, mcqApiError } from "@/components/mcq/mcq-ui";
import McqExamEditor from "@/components/mcq/McqExamEditor";
import McqResultView from "@/components/mcq/McqResultView";
import { toast } from "@/components/ui/global-toast";
import { mcqDate, mcqDuration, type McqAttemptSummary, type McqExamSummary } from "@/lib/dashboard/mcq-exams";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";
import {
  useDeleteMcqExamMutation,
  useDeleteMcqResultMutation,
  useGetMcqExamQuery,
  useGetMcqExamsQuery,
  useGetMcqResultQuery,
  useGetMcqResultsQuery,
} from "@/redux/features/dashboard/mcq-exams/mcqExamsSlice";

export default function McqExaminationsPage() {
  const permissions = useDashboardPermissions("/dashboard/course/mcq");
  const confirmDelete = useConfirmDelete();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remove, removeState] = useDeleteMcqExamMutation();
  const canRead = permissions.can("read");
  const list = useGetMcqExamsQuery(page, {
    skip: !canRead,
    refetchOnFocus: true,
    pollingInterval: 30_000,
    skipPollingIfUnfocused: true,
  });
  const exam = useGetMcqExamQuery(editing ?? "", { skip: !editing || editing === "new" });
  const items = list.currentData?.items ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  async function copyLink(slug: string) {
    try {
      await navigator.clipboard.writeText(new URL(`/mcq/${slug}`, window.location.origin).href);
      toast.success("Public examination link copied.");
    } catch {
      toast.error("Could not copy the link. Open the public exam and copy its address.");
    }
  }
  async function destroy(item: McqExamSummary) {
    if (
      !(await confirmDelete(
        `Delete "${item.title}"? This permanently removes the examination, all student registrations, active attempts, saved answers, timings, and results for this exam. This cannot be undone.`,
      ))
    )
      return;
    try {
      await remove(item.id).unwrap();
      if (selected?.id === item.id) setSelectedId(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      toast.success("Examination and its student data deleted.");
    } catch (error) {
      toast.error(mcqApiError(error));
    }
  }
  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link className="text-xs text-amber-800 hover:underline" href="/dashboard/course">
              Courses
            </Link>
            <h1 className="mt-1 text-xl font-semibold text-stone-900">MCQ examinations</h1>
            <p className="mt-1 text-sm text-stone-600">Manage public examinations and view student results.</p>
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-2">
              {canRead && (
                <button
                  className="secondary-button"
                  disabled={list.isFetching}
                  onClick={() => void list.refetch()}
                  type="button"
                >
                  <RefreshCw className={`h-4 w-4 ${list.isFetching ? "animate-spin" : ""}`} /> Refresh
                </button>
              )}
              {permissions.can("create") && (
                <button className="primary-button" onClick={() => setEditing("new")} type="button">
                  <Plus className="h-4 w-4" /> New examination
                </button>
              )}
            </div>
          )}
        </header>
        {editing ? (
          <>
            {editing !== "new" && exam.isFetching && (
              <p className="py-6 text-sm text-stone-500" role="status">
                Loading examination...
              </p>
            )}
            {exam.error && editing !== "new" && <McqError error={exam.error} retry={() => void exam.refetch()} />}
            {(editing === "new" || (!exam.isFetching && exam.currentData)) && (
              <McqExamEditor
                exam={editing === "new" ? undefined : exam.currentData}
                key={editing}
                onClose={() => setEditing(null)}
              />
            )}
            {editing !== "new" && !exam.currentData && (
              <button className="secondary-button" onClick={() => setEditing(null)} type="button">
                Back
              </button>
            )}
          </>
        ) : !canRead ? (
          <p className="text-sm text-stone-600">
            Read permission for Courses is required to view examinations and results.
          </p>
        ) : (
          <>
            <h2 className="mb-3 text-lg font-semibold">Summary dashboard</h2>
            {list.error && <McqError error={list.error} retry={() => void list.refetch()} />}
            {list.isFetching && !list.currentData && (
              <p className="py-6 text-sm text-stone-500" role="status">
                Loading examinations...
              </p>
            )}
            {!list.isFetching && !list.error && !items.length && (
              <div className="rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] p-8 text-center">
                <p className="font-semibold">No examinations yet</p>
                <p className="mt-1 text-sm text-stone-600">
                  Create an examination to generate a public link and start collecting results.
                </p>
              </div>
            )}
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  aria-label={`Summary for ${item.title}`}
                  className={`rounded-sm border bg-[#fffdfa] p-4 ${selected?.id === item.id ? "border-amber-400" : "border-[#eadfca]"}`}
                  key={item.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {item.questionCount} questions · {item.totalMarks} marks · {item.maxAttempts} attempts per
                        student
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {permissions.can("update") && (
                        <button
                          className="secondary-button"
                          disabled={removeState.isLoading}
                          onClick={() => setEditing(item.id)}
                          type="button"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                      )}
                      <button className="secondary-button" onClick={() => void copyLink(item.slug)} type="button">
                        <Copy className="h-4 w-4" /> Copy link
                      </button>
                      <Link
                        aria-label={`Open public examination: ${item.title}`}
                        className="secondary-button"
                        href={`/mcq/${item.slug}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" /> Open exam
                      </Link>
                      {permissions.can("delete") && (
                        <button
                          aria-label={`Delete examination: ${item.title}`}
                          className="secondary-button border-red-200 text-red-700 hover:bg-red-50"
                          disabled={removeState.isLoading}
                          onClick={() => void destroy(item)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />{" "}
                          {removeState.isLoading && removeState.originalArgs === item.id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#eadfca] pt-3 text-sm">
                    <span>
                      <strong>{item.participants}</strong> students participated
                    </span>
                    <span>
                      <strong>{item.completedAttempts}</strong> completed attempts
                    </span>
                    <button
                      aria-controls="mcq-student-results"
                      aria-pressed={selected?.id === item.id}
                      className="secondary-button ml-auto"
                      onClick={() => setSelectedId(item.id)}
                      type="button"
                    >
                      {selected?.id === item.id ? "Students shown below" : "Show students"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <McqPagination
              onChange={(value) => {
                setPage(value);
                setSelectedId(null);
              }}
              page={page}
              pageSize={25}
              total={list.currentData?.total ?? 0}
            />
            {selected && (
              <section className="mt-6 border-t border-[#eadfca] pt-5" id="mcq-student-results">
                <McqExamResults canDelete={permissions.can("delete")} exam={selected} key={selected.id} />
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function McqExamResults({ exam, canDelete }: { exam: McqExamSummary; canDelete: boolean }) {
  const confirmDelete = useConfirmDelete();
  const [page, setPage] = useState(1);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [remove, removeState] = useDeleteMcqResultMutation();
  const results = useGetMcqResultsQuery(
    { id: exam.id, page },
    { pollingInterval: 30_000, skipPollingIfUnfocused: true },
  );
  const detail = useGetMcqResultQuery({ id: exam.id, attemptId: attemptId ?? "" }, { skip: !attemptId });
  async function destroy(item: McqAttemptSummary) {
    if (
      !(await confirmDelete(
        `Delete the result for "${item.studentName}", attempt ${item.attemptNumber} in "${exam.title}"? This permanently removes this result, its saved answers, and timings. This cannot be undone.`,
      ))
    )
      return;
    try {
      await remove({ id: exam.id, attemptId: item.id }).unwrap();
      if (attemptId === item.id) setAttemptId(null);
      if (results.currentData?.items.length === 1 && page > 1) setPage(page - 1);
      toast.success("Student result deleted.");
    } catch (error) {
      toast.error(mcqApiError(error));
    }
  }
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Students and results</h2>
          <h3 className="mt-1 break-words font-medium">{exam.title}</h3>
          <p className="mt-1 text-sm text-stone-600">
            {results.currentData?.participants ?? exam.participants} students ·{" "}
            {results.currentData?.total ?? exam.completedAttempts} completed attempts
          </p>
        </div>
        <button
          className="secondary-button"
          disabled={results.isFetching}
          onClick={() => void results.refetch()}
          type="button"
        >
          <RefreshCw className="h-4 w-4" /> Refresh results
        </button>
      </header>
      {results.error && <McqError error={results.error} retry={() => void results.refetch()} />}
      {results.isFetching && !results.currentData && <p role="status">Loading results...</p>}
      {!results.isFetching && !results.error && !results.currentData?.items.length && (
        <p className="py-6 text-sm text-stone-500">Completed examination results will appear here automatically.</p>
      )}
      {!!results.currentData?.items.length && (
        <div className="overflow-x-auto rounded-sm border border-[#eadfca]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Student examination results for {exam.title}</caption>
            <thead className="bg-[#fffaf0] text-stone-600">
              <tr>
                {["Student", "Mobile", "Attempt", "Marks", "Total time", "Completed (BD)", "Actions"].map((heading) => (
                  <th className="whitespace-nowrap px-3 py-3 font-medium" key={heading} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.currentData.items.map((item) => (
                <tr className={`border-t border-[#eadfca] ${attemptId === item.id ? "bg-amber-50" : ""}`} key={item.id}>
                  <td className="max-w-60 break-words px-3 py-3 font-medium">{item.studentName}</td>
                  <td className="px-3 py-3">{item.mobile}</td>
                  <td className="px-3 py-3">{item.attemptNumber}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {item.score} / {item.totalMarks}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{mcqDuration(item.totalTimeMs)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{mcqDate(item.submittedAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`View result for ${item.studentName}, attempt ${item.attemptNumber}`}
                        className="secondary-button"
                        onClick={() => setAttemptId(item.id)}
                        type="button"
                      >
                        View
                      </button>
                      {canDelete && (
                        <button
                          aria-label={`Delete result for ${item.studentName}, attempt ${item.attemptNumber}`}
                          className="secondary-button border-red-200 text-red-700 hover:bg-red-50"
                          disabled={removeState.isLoading}
                          onClick={() => void destroy(item)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          {removeState.isLoading && removeState.originalArgs?.attemptId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <McqPagination onChange={setPage} page={page} pageSize={50} total={results.currentData?.total ?? 0} />
      {attemptId && (
        <section className="space-y-4 border-t border-[#eadfca] pt-4">
          <div className="flex justify-end">
            <button className="secondary-button" onClick={() => setAttemptId(null)} type="button">
              Close result
            </button>
          </div>
          {detail.isFetching && <p role="status">Loading result...</p>}
          {detail.error && <McqError error={detail.error} retry={() => void detail.refetch()} />}
          {detail.currentData && <McqResultView detail={detail.currentData} result={detail.currentData} />}
        </section>
      )}
    </div>
  );
}
