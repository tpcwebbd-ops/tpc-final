/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

"use client";

import { BookOpen, CheckCircle2, CreditCard, Search, UserRoundX, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { useGetStudentsQuery, type StudentsQuery } from "@/redux/features/dashboard/students/studentsSlice";

const pageSizes = [10, 25, 50, 100] as const;
const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

export default function StudentsPage() {
  const [query, setQuery] = useState<StudentsQuery>({ page: 1, limit: 10, search: "", courseId: "", payment: "" });
  const { data, error, isFetching, isLoading } = useGetStudentsQuery(query);
  const students = data?.items ?? [];
  const summary = data?.summary;
  const page = data?.page ?? query.page;
  const limit = data?.limit ?? query.limit;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const rangeStart = total ? (page - 1) * limit + 1 : 0;
  const filterLabel = useMemo(
    () => summary?.courses.find((course) => course.id === query.courseId)?.name,
    [query.courseId, summary],
  );

  function updateQuery(changes: Partial<StudentsQuery>) {
    setQuery((current) => ({ ...current, ...changes }));
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
              <Users className="h-5 w-5 text-amber-700" /> Students
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-stone-600">
              Track every registered student, their course enrollment, completion percentage, and payment state.
            </p>
          </div>
          {filterLabel && (
            <span className="rounded-sm bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900">
              Course filter: {filterLabel}
            </span>
          )}
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={<Users />} label="Registered students" value={summary?.registered ?? 0} />
          <SummaryCard icon={<CheckCircle2 />} label="Enrolled in a course" value={summary?.enrolled ?? 0} />
          <SummaryCard icon={<UserRoundX />} label="Not enrolled" value={summary?.notEnrolled ?? 0} tone="amber" />
          <SummaryCard
            icon={<CreditCard />}
            label="Students with a payment"
            value={summary?.paid ?? 0}
            tone="emerald"
          />
        </section>

        <section className="mt-5 rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
          <header>
            <h2 className="text-lg font-semibold text-stone-900">Course enrollment summary</h2>
            <p className="mt-1 text-sm text-stone-600">
              Enrollment percentage is calculated from all registered students, not only the current table page.
            </p>
          </header>
          {!summary?.courses.length ? (
            <p className="mt-4 rounded-sm bg-amber-50 p-4 text-sm text-stone-600">
              Create a course and enroll students to see course-level percentages here.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {summary.courses.map((course) => (
                <article className="rounded-sm border border-[#eadfca] bg-[#fffdfa] p-4" key={course.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-stone-900">{course.name}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {course.enrolled} enrolled · {course.paid} paid
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-semibold text-amber-800">{course.enrolledPercent}%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-amber-600" style={{ width: `${course.enrolledPercent}%` }} />
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-stone-500">
                    <BookOpen className="h-3.5 w-3.5" /> Average progress: {course.averageProgress}%
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
          <header>
            <h2 className="text-lg font-semibold text-stone-900">Student directory</h2>
            <p className="mt-1 text-sm text-stone-600">
              Search and filter the complete student record. “Not enrolled” includes registered users without a course.
            </p>
          </header>
          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem_12rem]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                aria-label="Search students"
                className="input pl-9"
                onChange={(event) => updateQuery({ page: 1, search: event.target.value })}
                placeholder="Search name, email, or phone"
                value={query.search ?? ""}
              />
            </label>
            <select
              aria-label="Filter students by course"
              className="input"
              onChange={(event) => updateQuery({ page: 1, courseId: event.target.value })}
              value={query.courseId ?? ""}
            >
              <option value="">All courses</option>
              {(summary?.courses ?? []).map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter students by payment"
              className="input"
              onChange={(event) => updateQuery({ page: 1, payment: event.target.value as StudentsQuery["payment"] })}
              value={query.payment ?? ""}
            >
              <option value="">All payment states</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="not-enrolled">Not enrolled</option>
            </select>
          </div>
          {error && (
            <p className="mt-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">
              {errorMessage(error, "Could not load students.")}
            </p>
          )}
          <div className="mt-5 overflow-hidden rounded-sm border border-[#eadfca]">
            {isLoading ? (
              <div className="space-y-2 p-4" role="status">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="h-12 animate-pulse rounded-sm bg-amber-50" key={index} />
                ))}
              </div>
            ) : students.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Courses & progress</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Enrollment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr className="border-t border-stone-100 align-top" key={student.id}>
                        <td className="p-3">
                          <p className="font-medium text-stone-900">{student.name}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            Joined {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}
                          </p>
                        </td>
                        <td className="p-3 text-stone-600">
                          <p>{student.email || "—"}</p>
                          <p className="mt-1 text-xs">{student.mobileNumber || "No phone"}</p>
                        </td>
                        <td className="p-3">
                          {student.enrollments.length ? (
                            <div className="space-y-2">
                              {student.enrollments.map((enrollment) => (
                                <div key={enrollment.courseId}>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium text-stone-800">{enrollment.courseName}</span>
                                    <span className="text-xs text-stone-500">{enrollment.progress}%</span>
                                  </div>
                                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-200">
                                    <div
                                      className="h-full rounded-full bg-amber-600"
                                      style={{ width: `${enrollment.progress}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-stone-500">No course</span>
                          )}
                        </td>
                        <td className="p-3">
                          {student.enrollments.length ? (
                            <div className="flex flex-wrap gap-1">
                              {student.enrollments.map((enrollment) => (
                                <Badge
                                  key={enrollment.courseId}
                                  tone={enrollment.paymentStatus === "paid" ? "emerald" : "stone"}
                                >
                                  {enrollment.paymentStatus}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          {student.enrollments.length ? (
                            <Badge tone="amber">Enrolled</Badge>
                          ) : (
                            <Badge tone="stone">Not enrolled</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-10 text-center text-sm text-stone-500">
                No students match the current search and filters.
              </p>
            )}
          </div>
          <footer className="mt-4 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {isFetching
                ? "Updating results…"
                : `Showing ${rangeStart}–${Math.min(page * limit, total)} of ${total} student${total === 1 ? "" : "s"}`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2">
                <span>Per page</span>
                <select
                  aria-label="Students per page"
                  className="h-9 rounded-sm border border-[#eadfca] bg-white px-2"
                  onChange={(event) => updateQuery({ page: 1, limit: Number(event.target.value) })}
                  value={limit}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="secondary-button"
                disabled={isFetching || page === 1}
                onClick={() => updateQuery({ page: page - 1 })}
                type="button"
              >
                Previous
              </button>
              <span className="min-w-20 text-center font-medium text-stone-800">
                Page {page} of {totalPages}
              </span>
              <button
                className="secondary-button"
                disabled={isFetching || page >= totalPages}
                onClick={() => updateQuery({ page: page + 1 })}
                type="button"
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  tone = "stone",
  value,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "stone" | "amber" | "emerald";
  value: number;
}) {
  const colors =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700"
        : "bg-stone-100 text-stone-700";
  return (
    <article className="rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm">
      <span className={`grid h-9 w-9 place-items-center rounded-sm ${colors}`}>{icon}</span>
      <p className="mt-4 text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-1 text-sm text-stone-600">{label}</p>
    </article>
  );
}
function Badge({ children, tone }: { children: React.ReactNode; tone: "stone" | "amber" | "emerald" }) {
  const colors =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "amber"
        ? "bg-amber-100 text-amber-900"
        : "bg-stone-100 text-stone-600";
  return <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${colors}`}>{children}</span>;
}
