/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

"use client";

import { BookOpen, Clock3, Eye, Loader2, Pencil, Plus, RefreshCw, Trash2, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import CourseExamAdmin from "@/components/courses/CourseExamAdmin";
import { toast } from "@/components/ui/global-toast";
import { courseDefaults, questionMarks } from "@/lib/dashboard/courses";
import {
  type CourseInput,
  type CourseItem,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "@/redux/features/dashboard/courses/coursesSlice";

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

export default function CoursePage() {
  const router = useRouter();
  const confirmDelete = useConfirmDelete();
  const { data, error, isFetching, isLoading, refetch } = useGetCoursesQuery();
  const [create, createState] = useCreateCourseMutation();
  const [update, updateState] = useUpdateCourseMutation();
  const [remove, removeState] = useDeleteCourseMutation();
  const [formTarget, setFormTarget] = useState<CourseItem | null | undefined>(undefined);
  const [viewing, setViewing] = useState<CourseItem | null>(null);
  const busy = createState.isLoading || updateState.isLoading || removeState.isLoading;
  const courses = data?.items ?? [];

  async function save(input: CourseInput) {
    try {
      if (formTarget) {
        await update({ ...input, id: formTarget.id }).unwrap();
        toast.success("Course details updated.");
        setFormTarget(undefined);
        return;
      }
      const result = await create(input).unwrap();
      toast.success("Course created. Add its students and learning content next.");
      setFormTarget(undefined);
      router.push(`/dashboard/course/edit?id=${encodeURIComponent(result.item.id)}`);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not save the course."));
    }
  }

  async function destroy(course: CourseItem) {
    if (!(await confirmDelete(`Delete “${course.name}”? Its enrollments and course content will also be removed.`)))
      return;
    try {
      await remove(course.id).unwrap();
      toast.success("Course deleted.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete the course."));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
              <BookOpen className="h-5 w-5 text-amber-700" /> Courses
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-stone-600">
              Create courses, enrol students, and build each course from questions, PDFs, and videos in the media
              library.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button className="primary-button" onClick={() => setFormTarget(null)} type="button">
              <Plus className="h-4 w-4" /> New course
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error, "Could not load courses.")}
          </p>
        )}

        {isLoading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2" role="status">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-52 animate-pulse rounded-sm bg-amber-50" key={index} />
            ))}
          </div>
        ) : !courses.length ? (
          <div className="mt-6 rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] px-5 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-amber-700" />
            <h2 className="mt-3 text-base font-semibold text-stone-900">Start your first course</h2>
            <p className="mx-auto mt-1 max-w-lg text-sm text-stone-600">
              Set the course basics first, then use the editor to add students and course learning items.
            </p>
            <button className="primary-button mt-5" onClick={() => setFormTarget(null)} type="button">
              <Plus className="h-4 w-4" /> Create course
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <article
                className="flex min-w-0 flex-col rounded-sm border border-[#eadfca] bg-[#fffdfa] p-4"
                key={course.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-stone-900" title={course.name}>
                      {course.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-stone-600">
                      {course.description || "No description added yet."}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    <span className="rounded-sm bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                      {course.content.length} item{course.content.length === 1 ? "" : "s"}
                    </span>
                    {course.enrollmentRequests.some((request) => request.status === "pending") && (
                      <span className="rounded-sm bg-stone-200 px-2 py-1 text-xs font-semibold text-stone-700">
                        {course.enrollmentRequests.filter((request) => request.status === "pending").length} request
                        {course.enrollmentRequests.filter((request) => request.status === "pending").length === 1
                          ? ""
                          : "s"}
                      </span>
                    )}
                  </div>
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
                    <dt className="text-stone-400">Students</dt>
                    <dd className="mt-1 font-semibold text-stone-800">{course.studentsList.length}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eadfca] pt-3">
                  <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                    <Clock3 className="h-3.5 w-3.5" /> {course.time || "Time not set"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      aria-label={`View ${course.name}`}
                      className="icon-button"
                      onClick={() => setViewing(course)}
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Quick edit ${course.name}`}
                      className="icon-button"
                      onClick={() => setFormTarget(course)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <Link
                      aria-label={`Open editor for ${course.name}`}
                      className="icon-button"
                      href={`/dashboard/course/edit?id=${encodeURIComponent(course.id)}`}
                      title="Open course editor"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Link>
                    <button
                      aria-label={`Delete ${course.name}`}
                      className="icon-button border-red-100 text-red-700 hover:bg-red-50"
                      disabled={busy}
                      onClick={() => void destroy(course)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {formTarget !== undefined && (
        <CourseForm busy={busy} close={() => setFormTarget(undefined)} initial={formTarget} save={save} />
      )}
      {viewing && <CourseView close={() => setViewing(null)} course={viewing} />}
    </main>
  );
}

function CourseForm({
  busy,
  close,
  initial,
  save,
}: {
  busy: boolean;
  close: () => void;
  initial: CourseItem | null;
  save: (input: CourseInput) => Promise<void>;
}) {
  const [form, setForm] = useState<CourseInput>(
    initial ? { ...initial } : { ...courseDefaults, studentsList: [], content: [] },
  );
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <form
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          void save(form);
        }}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div>
            <h2 className="text-lg font-semibold">{initial ? "Edit course details" : "Create a course"}</h2>
            <p className="mt-1 text-sm text-stone-600">
              Students and course learning items are managed in the course editor.
            </p>
          </div>
          <button aria-label="Close course form" className="icon-button" disabled={busy} onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="mt-5 grid gap-4">
          <Field label="Course name">
            <input
              autoFocus
              className="input"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              value={form.name}
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-28 resize-y"
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={4}
              value={form.description}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Duration">
              <input
                className="input"
                onChange={(event) => setForm({ ...form, duration: event.target.value })}
                placeholder="e.g. 8 weeks"
                value={form.duration}
              />
            </Field>
            <Field label="Total classes">
              <input
                className="input"
                min="0"
                onChange={(event) => setForm({ ...form, totalClasses: Number(event.target.value) || 0 })}
                type="number"
                value={form.totalClasses}
              />
            </Field>
            <Field label="Class time">
              <input
                className="input"
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                placeholder="e.g. Sat 7 PM"
                value={form.time}
              />
            </Field>
          </div>
        </div>
        <footer className="mt-5 flex justify-end gap-2">
          <button className="secondary-button" disabled={busy} onClick={close} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={busy} type="submit">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : initial ? (
              "Save details"
            ) : (
              "Create and continue"
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}

function CourseView({ close, course }: { close: () => void; course: CourseItem }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">{course.name}</h2>
            <p className="mt-1 text-sm text-stone-500">Course overview</p>
          </div>
          <button aria-label="Close course overview" className="icon-button" onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </header>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-600">
          {course.description || "No description provided."}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Metric label="Duration" value={course.duration || "—"} />
          <Metric label="Classes" value={String(course.totalClasses)} />
          <Metric label="Time" value={course.time || "—"} />
        </div>
        <section className="mt-5 rounded-sm border border-[#eadfca] bg-white p-4">
          <h3 className="flex items-center gap-2 font-semibold text-stone-900">
            <Users className="h-4 w-4" /> Students ({course.studentsList.length})
          </h3>
          <div className="mt-3 space-y-2">
            {course.studentsList.slice(0, 8).map((student) => (
              <div className="flex items-center justify-between gap-3 text-sm" key={student.userId}>
                <span className="min-w-0 truncate">
                  {student.name} <span className="text-stone-400">· {student.email}</span>
                </span>
                <span className="shrink-0 text-stone-500">
                  {student.progress}% · {student.paymentStatus}
                </span>
              </div>
            ))}
            {!course.studentsList.length && <p className="text-sm text-stone-500">No students enrolled yet.</p>}
            {course.studentsList.length > 8 && (
              <p className="text-xs text-stone-500">+{course.studentsList.length - 8} more students</p>
            )}
          </div>
        </section>
        <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4">
          <h3 className="font-semibold text-stone-900">Learning content ({course.content.length})</h3>
          <div className="mt-3 space-y-3">
            {course.content.map((content) => (
              <article className="rounded-sm border border-stone-200 p-3 text-sm" key={content.id}>
                <h4 className="font-semibold">
                  {content.type.toUpperCase()} · {content.title}
                </h4>
                {content.type === "mcq" ? (
                  <>
                    <p className="mt-2 whitespace-pre-wrap">{content.question}</p>
                    <p className="mt-1 text-xs text-stone-500">{questionMarks(content)} mark(s)</p>
                    <ol className="mt-2 space-y-1">
                      {content.options.map((option, index) => (
                        <li
                          className={
                            index === content.correctOptionIndex
                              ? "rounded-sm bg-emerald-50 p-2 font-medium text-emerald-800"
                              : "p-2"
                          }
                          key={index}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                          {index === content.correctOptionIndex ? " ✓ Correct answer" : ""}
                        </li>
                      ))}
                    </ol>
                    {content.explanation && (
                      <p className="mt-2 whitespace-pre-wrap text-stone-600">Explanation: {content.explanation}</p>
                    )}
                  </>
                ) : (
                  <a
                    className="mt-2 inline-block text-amber-800 underline"
                    href={content.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {content.type.toUpperCase()}
                  </a>
                )}
              </article>
            ))}
            {!course.content.length && <p className="text-sm text-stone-500">No learning content added yet.</p>}
          </div>
        </section>
        <CourseExamAdmin courseId={course.id} />
      </section>
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#eadfca] bg-white p-3">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 truncate font-semibold text-stone-900" title={value}>
        {value}
      </p>
    </div>
  );
}
