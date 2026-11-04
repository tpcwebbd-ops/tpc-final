/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

"use client";

import { BookOpen, CheckCircle2, Clock3, Loader2, LockKeyhole, RefreshCw, Send } from "lucide-react";
import { useState } from "react";

import StudentCourseWorkspace from "@/components/courses/StudentCourseWorkspace";
import { toast } from "@/components/ui/global-toast";
import {
  type StudentCourseItem,
  useGetMyCoursesQuery,
  useRequestCourseEnrollmentMutation,
} from "@/redux/features/dashboard/my-courses/myCoursesSlice";

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

export default function MyCoursePage() {
  const { data, error, isFetching, isLoading, refetch } = useGetMyCoursesQuery();
  const [requestEnrollment, requestState] = useRequestCourseEnrollmentMutation();
  const [confirming, setConfirming] = useState<StudentCourseItem | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const courses = data?.items ?? [];

  async function sendEnrollmentRequest() {
    if (!confirming) return;
    try {
      await requestEnrollment(confirming.id).unwrap();
      toast.success(`Your enrollment request for ${confirming.name} has been sent.`);
      setConfirming(null);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not send your enrollment request."));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
              <BookOpen className="h-5 w-5 text-amber-700" /> My Courses
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-stone-600">
              Browse every available course and send an enrollment request for the ones you want to join.
            </p>
          </div>
          <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </header>

        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error, "Could not load courses.")}
          </p>
        )}

        {isLoading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2" role="status">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-60 animate-pulse rounded-sm bg-amber-50" key={index} />
            ))}
          </div>
        ) : !courses.length ? (
          <div className="mt-6 rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] px-5 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-amber-700" />
            <h2 className="mt-3 text-base font-semibold text-stone-900">No courses available yet</h2>
            <p className="mt-1 text-sm text-stone-600">Please check again later.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <CourseCard
                course={course}
                key={course.id}
                onRequest={() => setConfirming(course)}
                onOpen={() => setViewing(course.id)}
              />
            ))}
          </div>
        )}
      </section>

      {viewing && <StudentCourseWorkspace close={() => setViewing(null)} courseId={viewing} />}

      {confirming && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
          <section
            aria-describedby="enrollment-request-description"
            aria-labelledby="enrollment-request-title"
            aria-modal="true"
            className="w-full max-w-md rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
            role="dialog"
          >
            <h2 className="text-lg font-semibold text-stone-900" id="enrollment-request-title">
              Send enrollment request?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600" id="enrollment-request-description">
              Send a request to join <strong>{confirming.name}</strong>? A course administrator must approve it before
              you are enrolled.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="secondary-button"
                disabled={requestState.isLoading}
                onClick={() => setConfirming(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="primary-button"
                disabled={requestState.isLoading}
                onClick={() => void sendEnrollmentRequest()}
                type="button"
              >
                {requestState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send request
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function CourseCard({
  course,
  onRequest,
  onOpen,
}: {
  course: StudentCourseItem;
  onRequest: () => void;
  onOpen: () => void;
}) {
  const requestable = course.enrollmentStatus === "not-requested";
  return (
    <article className="flex min-w-0 flex-col rounded-sm border border-[#eadfca] bg-[#fffdfa] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-stone-900" title={course.name}>
            {course.name}
          </h2>
          <p className="mt-1 line-clamp-3 min-h-15 text-sm text-stone-600">
            {course.description || "No description has been added yet."}
          </p>
        </div>
        <EnrollmentBadge status={course.enrollmentStatus} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-sm bg-white p-2 text-stone-600">
          <dt className="text-stone-400">Duration</dt>
          <dd className="mt-1 font-semibold text-stone-800">{course.duration || "—"}</dd>
        </div>
        <div className="rounded-sm bg-white p-2 text-stone-600">
          <dt className="text-stone-400">Classes</dt>
          <dd className="mt-1 font-semibold text-stone-800">{course.totalClasses}</dd>
        </div>
        <div className="rounded-sm bg-white p-2 text-stone-600">
          <dt className="text-stone-400">Learning items</dt>
          <dd className="mt-1 font-semibold text-stone-800">{course.contentCount}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eadfca] pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
          <Clock3 className="h-3.5 w-3.5" /> {course.time || "Time not set"}
        </span>
        {requestable ? (
          <button className="primary-button py-1.5" onClick={onRequest} type="button">
            <Send className="h-3.5 w-3.5" /> Enroll
          </button>
        ) : course.enrollmentStatus === "pending" ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800">
            <Clock3 className="h-3.5 w-3.5" /> Request pending
          </span>
        ) : course.enrollmentStatus === "enrolled" ? (
          <button className="primary-button py-1.5" onClick={onOpen} type="button">
            <CheckCircle2 className="h-3.5 w-3.5" /> Open course
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
            <LockKeyhole className="h-3.5 w-3.5" /> Enrollment unavailable
          </span>
        )}
      </div>
    </article>
  );
}

function EnrollmentBadge({ status }: { status: StudentCourseItem["enrollmentStatus"] }) {
  const badges = {
    blocked: { label: "Unavailable", tone: "bg-red-100 text-red-800" },
    enrolled: { label: "Enrolled", tone: "bg-emerald-100 text-emerald-800" },
    "not-requested": { label: "Available", tone: "bg-amber-100 text-amber-900" },
    pending: { label: "Pending", tone: "bg-stone-200 text-stone-700" },
  };
  const badge = badges[status];
  return <span className={`shrink-0 rounded-sm px-2 py-1 text-xs font-semibold ${badge.tone}`}>{badge.label}</span>;
}
