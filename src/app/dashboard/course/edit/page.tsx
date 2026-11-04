/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Ban,
  CheckCircle2,
  FileQuestion,
  FileText,
  Film,
  Loader2,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import CourseExamAdmin from "@/components/courses/CourseExamAdmin";
import CourseExamsEditor from "@/components/courses/CourseExamsEditor";
import { toast } from "@/components/ui/global-toast";
import { questionMarks } from "@/lib/dashboard/courses";
import {
  type CourseContent,
  type CourseEnrollmentRequest,
  type CourseInput,
  type CourseStudent,
  type CourseItem,
  useGetCourseStudentsQuery,
  useGetCoursesQuery,
  useReviewCourseEnrollmentRequestMutation,
  useUpdateCourseMutation,
} from "@/redux/features/dashboard/courses/coursesSlice";
import { useGetMediaQuery, type MediaItem } from "@/redux/features/dashboard/media/mediaSlice";

type EditorTab = "details" | "students" | "requests" | "content" | "exams" | "results";
type ContentEditor = { type: CourseContent["type"]; content?: CourseContent };

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

export default function EditCoursePage() {
  const id = useSearchParams().get("id") ?? "";
  const { data, isError, isLoading } = useGetCoursesQuery();
  const course = useMemo(() => data?.items.find((item) => item.id === id), [data, id]);

  if (isLoading)
    return (
      <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] text-sm text-stone-600">
        Loading course editor…
      </main>
    );
  if (isError) return <EditorMessage text="Could not load this course." />;
  if (!course) return <EditorMessage text="Course not found. It may have been deleted." />;
  return <CourseEditor course={course} key={course.id} />;
}

function EditorMessage({ text }: { text: string }) {
  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-4">
      <div className="rounded-sm border border-[#eadfca] bg-white p-6 text-center">
        <p className="text-sm text-stone-600">{text}</p>
        <Link className="secondary-button mt-4" href="/dashboard/course">
          Back to courses
        </Link>
      </div>
    </main>
  );
}

function CourseEditor({ course }: { course: CourseItem }) {
  const [update, updateState] = useUpdateCourseMutation();
  const [reviewRequest, reviewRequestState] = useReviewCourseEnrollmentRequestMutation();
  const [draft, setDraft] = useState<CourseInput>(() => ({
    name: course.name,
    description: course.description,
    duration: course.duration,
    totalClasses: course.totalClasses,
    time: course.time,
    studentsList: course.studentsList,
    enrollmentRequests: course.enrollmentRequests,
    content: course.content,
    exams: course.exams,
  }));
  const [tab, setTab] = useState<EditorTab>("details");
  const [studentSearch, setStudentSearch] = useState("");
  const [contentEditor, setContentEditor] = useState<ContentEditor | null>(null);
  const { data: userData, isFetching: usersLoading } = useGetCourseStudentsQuery({
    page: 1,
    limit: 100,
    ...(studentSearch.trim() ? { q: studentSearch.trim() } : {}),
  });
  const { data: mediaData, isFetching: mediaLoading } = useGetMediaQuery();
  const enrolledIds = useMemo(() => new Set(draft.studentsList.map((student) => student.userId)), [draft.studentsList]);
  const availableUsers = (userData?.users ?? []).filter((user) => !enrolledIds.has(user.id));

  async function save() {
    try {
      await update({ ...draft, id: course.id }).unwrap();
      toast.success("Course changes saved.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not save course changes."));
    }
  }

  function enrolStudent(student: { id: string; name: string; email: string }) {
    setDraft((current) => ({
      ...current,
      studentsList: [
        ...current.studentsList,
        {
          userId: student.id,
          name: student.name || "Unnamed student",
          email: student.email,
          progress: 0,
          paymentStatus: "unpaid",
          enrolledAt: new Date().toISOString(),
        },
      ],
    }));
  }

  function updateStudent(id: string, changes: Partial<CourseStudent>) {
    setDraft((current) => ({
      ...current,
      studentsList: current.studentsList.map((student) =>
        student.userId === id ? { ...student, ...changes } : student,
      ),
    }));
  }

  async function reviewEnrollmentRequest(request: CourseEnrollmentRequest, action: "enroll" | "block" | "unblock") {
    try {
      const result = await reviewRequest({ courseId: course.id, requestId: request.id, action }).unwrap();
      setDraft((current) => ({
        ...current,
        studentsList: result.item.studentsList,
        enrollmentRequests: result.item.enrollmentRequests,
      }));
      toast.success(
        action === "enroll"
          ? `${request.name} is now enrolled.`
          : action === "block"
            ? `${request.name} has been blocked from this course.`
            : `${request.name} can request enrollment again.`,
      );
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not update this enrollment request."));
    }
  }

  function saveContent(item: CourseContent) {
    setDraft((current) => ({
      ...current,
      content: contentEditor?.content
        ? current.content.map((entry) => (entry.id === item.id ? item : entry))
        : [...current.content, item],
    }));
    setContentEditor(null);
  }

  function moveContent(id: string, direction: "up" | "down") {
    setDraft((current) => {
      const index = current.content.findIndex((item) => item.id === id);
      const nextIndex = index + (direction === "up" ? -1 : 1);
      if (index < 0 || nextIndex < 0 || nextIndex >= current.content.length) return current;
      const content = [...current.content];
      [content[index], content[nextIndex]] = [content[nextIndex], content[index]];
      return { ...current, content };
    });
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <Link
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:underline"
              href="/dashboard/course"
            >
              <ArrowLeft className="h-4 w-4" /> Courses
            </Link>
            <h1 className="mt-2 truncate text-xl font-semibold text-stone-900">{draft.name || "Untitled course"}</h1>
            <p className="mt-1 text-sm text-stone-600">
              Build the course details, enrollment list, and learning content.
            </p>
          </div>
          <button className="primary-button" disabled={updateState.isLoading} onClick={() => void save()} type="button">
            {updateState.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save course
              </>
            )}
          </button>
        </header>

        <nav
          aria-label="Course editor sections"
          className="mt-4 flex flex-wrap gap-2 rounded-sm border border-[#eadfca] bg-white p-2"
        >
          <Tab active={tab === "details"} label="Course details" onClick={() => setTab("details")} />
          <Tab
            active={tab === "students"}
            label={`Students (${draft.studentsList.length})`}
            onClick={() => setTab("students")}
          />
          <Tab
            active={tab === "requests"}
            label={`Requests (${draft.enrollmentRequests.filter((request) => request.status === "pending").length})`}
            onClick={() => setTab("requests")}
          />
          <Tab
            active={tab === "content"}
            label={`Learning content (${draft.content.length})`}
            onClick={() => setTab("content")}
          />
          <Tab active={tab === "exams"} label={`MCQ exams (${draft.exams.length})`} onClick={() => setTab("exams")} />
          <Tab active={tab === "results"} label="Exam results & requests" onClick={() => setTab("results")} />
        </nav>

        {tab === "exams" && (
          <CourseExamsEditor
            content={draft.content}
            exams={draft.exams}
            onChange={(exams) => setDraft({ ...draft, exams })}
          />
        )}
        {tab === "results" && <CourseExamAdmin courseId={course.id} />}

        {tab === "details" && (
          <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-6">
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-stone-900">Course details</h2>
              <p className="mt-1 text-sm text-stone-600">
                These details are shown to administrators and can be used wherever your course is listed.
              </p>
            </div>
            <div className="mt-5 grid max-w-3xl gap-4">
              <Field label="Course name">
                <input
                  className="input"
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  required
                  value={draft.name}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className="input min-h-32 resize-y"
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  rows={5}
                  value={draft.description}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Duration">
                  <input
                    className="input"
                    onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
                    placeholder="e.g. 8 weeks"
                    value={draft.duration}
                  />
                </Field>
                <Field label="Total classes">
                  <input
                    className="input"
                    min="0"
                    onChange={(event) => setDraft({ ...draft, totalClasses: Number(event.target.value) || 0 })}
                    type="number"
                    value={draft.totalClasses}
                  />
                </Field>
                <Field label="Class time">
                  <input
                    className="input"
                    onChange={(event) => setDraft({ ...draft, time: event.target.value })}
                    placeholder="e.g. Sat 7 PM"
                    value={draft.time}
                  />
                </Field>
              </div>
            </div>
          </section>
        )}

        {tab === "students" && (
          <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-6">
            <header>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <Users className="h-5 w-5 text-amber-700" /> Enrolled students
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Assign students, set payment state, and record their course progress. Save course to keep changes.
              </p>
            </header>
            <div className="mt-5 rounded-sm border border-amber-200 bg-amber-50 p-3">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  aria-label="Search students to enroll"
                  className="input bg-white pl-9"
                  onChange={(event) => setStudentSearch(event.target.value)}
                  placeholder="Search registered students by name, email, or phone"
                  value={studentSearch}
                />
              </label>
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                {usersLoading && <p className="text-sm text-stone-500">Searching students…</p>}
                {!usersLoading &&
                  availableUsers.map((student) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-sm bg-white px-3 py-2 text-sm"
                      key={student.id}
                    >
                      <span className="min-w-0 truncate">
                        <b>{student.name || "Unnamed student"}</b>{" "}
                        <span className="text-stone-500">· {student.email}</span>
                      </span>
                      <button
                        className="secondary-button shrink-0 py-1"
                        onClick={() => enrolStudent(student)}
                        type="button"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Enroll
                      </button>
                    </div>
                  ))}
                {!usersLoading && !availableUsers.length && (
                  <p className="text-sm text-stone-500">No available registered students match this search.</p>
                )}
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-sm border border-[#eadfca]">
              {draft.studentsList.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Enrolled</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft.studentsList.map((student) => (
                        <tr className="border-t border-stone-100" key={student.userId}>
                          <td className="p-3">
                            <p className="font-medium text-stone-900">{student.name}</p>
                            <p className="text-xs text-stone-500">{student.email}</p>
                          </td>
                          <td className="p-3">
                            <label className="flex items-center gap-2">
                              <input
                                aria-label={`${student.name} progress`}
                                className="w-20 rounded-sm border border-[#eadfca] px-2 py-1"
                                max="100"
                                min="0"
                                onChange={(event) =>
                                  updateStudent(student.userId, {
                                    progress: Math.min(100, Math.max(0, Number(event.target.value) || 0)),
                                  })
                                }
                                type="number"
                                value={student.progress}
                              />
                              <span>%</span>
                            </label>
                          </td>
                          <td className="p-3">
                            <select
                              aria-label={`${student.name} payment status`}
                              className="rounded-sm border border-[#eadfca] bg-white px-2 py-1"
                              onChange={(event) =>
                                updateStudent(student.userId, {
                                  paymentStatus: event.target.value as CourseStudent["paymentStatus"],
                                })
                              }
                              value={student.paymentStatus}
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="paid">Paid</option>
                            </select>
                          </td>
                          <td className="p-3 text-stone-600">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                          <td className="p-3 text-right">
                            <button
                              aria-label={`Remove ${student.name} from this course`}
                              className="icon-button border-red-100 text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setDraft({
                                  ...draft,
                                  studentsList: draft.studentsList.filter((entry) => entry.userId !== student.userId),
                                })
                              }
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-8 text-center text-sm text-stone-500">No students enrolled in this course yet.</p>
              )}
            </div>
          </section>
        )}

        {tab === "requests" && (
          <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-6">
            <header>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <UserCheck className="h-5 w-5 text-amber-700" /> Enrollment requests
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Approve a pending request to enroll the student, or block the student from requesting this course.
              </p>
            </header>
            <div className="mt-5 overflow-hidden rounded-sm border border-[#eadfca]">
              {draft.enrollmentRequests.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Requested</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft.enrollmentRequests.map((request) => (
                        <tr className="border-t border-stone-100" key={request.id}>
                          <td className="p-3">
                            <p className="font-medium text-stone-900">{request.name}</p>
                            <p className="text-xs text-stone-500">{request.email}</p>
                          </td>
                          <td className="p-3 text-stone-600">{new Date(request.requestedAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <RequestStatusBadge status={request.status} />
                          </td>
                          <td className="p-3 text-right">
                            {request.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  className="secondary-button py-1"
                                  disabled={reviewRequestState.isLoading}
                                  onClick={() => void reviewEnrollmentRequest(request, "enroll")}
                                  type="button"
                                >
                                  <UserCheck className="h-3.5 w-3.5" /> Enroll
                                </button>
                                <button
                                  className="secondary-button border-red-200 py-1 text-red-700 hover:bg-red-50"
                                  disabled={reviewRequestState.isLoading}
                                  onClick={() => void reviewEnrollmentRequest(request, "block")}
                                  type="button"
                                >
                                  <Ban className="h-3.5 w-3.5" /> Block
                                </button>
                              </div>
                            ) : request.status === "blocked" ? (
                              <button
                                className="secondary-button py-1"
                                disabled={reviewRequestState.isLoading}
                                onClick={() => void reviewEnrollmentRequest(request, "unblock")}
                                type="button"
                              >
                                Unblock
                              </button>
                            ) : (
                              <span className="text-xs font-medium text-emerald-700">Student enrolled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-8 text-center text-sm text-stone-500">No enrollment requests for this course yet.</p>
              )}
            </div>
          </section>
        )}

        {tab === "content" && (
          <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Learning content</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Choose what to add, then edit the content in its own focused form.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="secondary-button" onClick={() => setContentEditor({ type: "mcq" })} type="button">
                  <FileQuestion className="h-4 w-4" /> MCQ question
                </button>
                <button className="secondary-button" onClick={() => setContentEditor({ type: "pdf" })} type="button">
                  <FileText className="h-4 w-4" /> Content PDF
                </button>
                <button className="secondary-button" onClick={() => setContentEditor({ type: "video" })} type="button">
                  <Film className="h-4 w-4" /> Video from Media
                </button>
              </div>
            </header>
            <div className="mt-5 space-y-3">
              {draft.content.map((item, index) => (
                <ContentCard
                  content={item}
                  index={index}
                  key={item.id}
                  move={moveContent}
                  onDelete={() =>
                    setDraft({
                      ...draft,
                      content: draft.content.filter((entry) => entry.id !== item.id),
                      exams: draft.exams
                        .map((exam) => ({ ...exam, questionIds: exam.questionIds.filter((id) => id !== item.id) }))
                        .filter((exam) => exam.questionIds.length),
                    })
                  }
                  onEdit={() => setContentEditor({ type: item.type, content: item })}
                  total={draft.content.length}
                />
              ))}
              {!draft.content.length && (
                <div className="rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] p-10 text-center text-sm text-stone-500">
                  Choose MCQ question, Content PDF, or Video from Media to build the first learning item.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      {contentEditor && (
        <ContentDialog
          content={contentEditor.content}
          key={contentEditor.content?.id ?? contentEditor.type}
          media={mediaData?.items ?? []}
          mediaLoading={mediaLoading}
          onClose={() => setContentEditor(null)}
          onSave={saveContent}
          type={contentEditor.type}
        />
      )}
    </main>
  );
}

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-sm px-3 py-2 text-sm font-medium ${active ? "bg-amber-700 text-white" : "text-stone-600 hover:bg-amber-50"}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function RequestStatusBadge({ status }: { status: CourseEnrollmentRequest["status"] }) {
  const labels = { approved: "Enrolled", blocked: "Blocked", pending: "Pending" };
  const tone = {
    approved: "bg-emerald-100 text-emerald-800",
    blocked: "bg-red-100 text-red-800",
    pending: "bg-amber-100 text-amber-900",
  };
  return <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${tone[status]}`}>{labels[status]}</span>;
}
function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function ContentCard({
  content,
  index,
  move,
  onDelete,
  onEdit,
  total,
}: {
  content: CourseContent;
  index: number;
  move: (id: string, direction: "up" | "down") => void;
  onDelete: () => void;
  onEdit: () => void;
  total: number;
}) {
  const summary = content.type === "mcq" ? content.question : content.mediaUrl;
  const Icon = content.type === "mcq" ? FileQuestion : content.type === "pdf" ? FileText : Film;
  return (
    <article className="rounded-sm border border-[#eadfca] bg-[#fffdfa] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-amber-100 text-amber-800">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-stone-900">{content.title}</p>
            <p className="mt-1 truncate text-sm text-stone-600" title={summary}>
              {summary}
            </p>
            <span className="mt-2 inline-flex rounded-sm bg-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-600">
              {content.type}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            aria-label={`Move ${content.title} up`}
            className="icon-button"
            disabled={index === 0}
            onClick={() => move(content.id, "up")}
            type="button"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            aria-label={`Move ${content.title} down`}
            className="icon-button"
            disabled={index === total - 1}
            onClick={() => move(content.id, "down")}
            type="button"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button className="secondary-button py-1" onClick={onEdit} type="button">
            Edit
          </button>
          <button
            aria-label={`Delete ${content.title}`}
            className="icon-button border-red-100 text-red-700 hover:bg-red-50"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ContentDialog({
  content,
  media,
  mediaLoading,
  onClose,
  onSave,
  type,
}: {
  content?: CourseContent;
  media: MediaItem[];
  mediaLoading: boolean;
  onClose: () => void;
  onSave: (item: CourseContent) => void;
  type: CourseContent["type"];
}) {
  const mcq = content?.type === "mcq" ? content : undefined;
  const existingMedia = content?.type === "pdf" || content?.type === "video" ? content : undefined;
  const [title, setTitle] = useState(content?.title ?? "");
  const [question, setQuestion] = useState(mcq?.question ?? "");
  const [options, setOptions] = useState<string[]>(mcq?.options ?? ["", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(mcq?.correctOptionIndex ?? 0);
  const [explanation, setExplanation] = useState(mcq?.explanation ?? "");
  const [marks, setMarks] = useState(mcq ? questionMarks(mcq) : 1);
  const [selectedMediaId, setSelectedMediaId] = useState(existingMedia?.mediaId ?? "");
  const selectedMedia = media.find((item) => item.id === selectedMediaId);
  const suitableMedia = media.filter((item) => item.type === (type === "pdf" ? "pdf" : "video"));
  const dialogTitle = type === "mcq" ? "MCQ question" : type === "pdf" ? "Content PDF" : "Video from Media";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = content?.id ?? crypto.randomUUID();
    if (type === "mcq") {
      const cleanOptions = options.map((option) => option.trim());
      if (
        !title.trim() ||
        !question.trim() ||
        cleanOptions.some((option) => !option) ||
        correctOptionIndex >= cleanOptions.length
      )
        return;
      onSave({
        id,
        type: "mcq",
        title: title.trim(),
        question: question.trim(),
        options: cleanOptions,
        correctOptionIndex,
        marks,
        explanation: explanation.trim(),
      });
      return;
    }
    if (!selectedMedia || !title.trim()) return;
    onSave({ id, type, title: title.trim(), mediaId: selectedMedia.id, mediaUrl: selectedMedia.url });
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <form
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={submit}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {content ? `Edit ${dialogTitle}` : `Add ${dialogTitle}`}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {type === "mcq"
                ? "Write the question, answers, and correct option."
                : "Choose a file already available in the Media library."}
            </p>
          </div>
          <button aria-label="Close content editor" className="icon-button" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="mt-5 grid gap-4">
          <Field label="Title">
            <input
              autoFocus
              className="input"
              onChange={(event) => setTitle(event.target.value)}
              placeholder={type === "mcq" ? "e.g. Listening practice 1" : "e.g. Course introduction"}
              required
              value={title}
            />
          </Field>
          {type === "mcq" ? (
            <>
              <Field label="Marks for this question (default 1)">
                <input
                  className="input"
                  min="0.01"
                  max="100"
                  step="0.01"
                  type="number"
                  required
                  value={marks}
                  onChange={(event) => setMarks(Number(event.target.value))}
                />
              </Field>
              <Field label="Question">
                <textarea
                  className="input min-h-28 resize-y"
                  onChange={(event) => setQuestion(event.target.value)}
                  required
                  rows={4}
                  value={question}
                />
              </Field>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Answer options</span>
                  {options.length < 6 && (
                    <button
                      className="text-xs font-semibold text-amber-800 hover:underline"
                      onClick={() => setOptions([...options, ""])}
                      type="button"
                    >
                      + Add option
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <input
                        aria-label={`Option ${index + 1}`}
                        checked={correctOptionIndex === index}
                        className="h-4 w-4"
                        name="correct-option"
                        onChange={() => setCorrectOptionIndex(index)}
                        type="radio"
                      />
                      <input
                        className="input flex-1"
                        onChange={(event) =>
                          setOptions(
                            options.map((value, optionIndex) => (optionIndex === index ? event.target.value : value)),
                          )
                        }
                        placeholder={`Option ${index + 1}`}
                        required
                        value={option}
                      />
                      {options.length > 2 && (
                        <button
                          aria-label={`Remove option ${index + 1}`}
                          className="icon-button"
                          onClick={() => {
                            const next = options.filter((_, optionIndex) => optionIndex !== index);
                            setOptions(next);
                            setCorrectOptionIndex(
                              correctOptionIndex === index
                                ? 0
                                : correctOptionIndex > index
                                  ? correctOptionIndex - 1
                                  : correctOptionIndex,
                            );
                          }}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Field label="Explanation (optional)">
                <textarea
                  className="input min-h-24 resize-y"
                  onChange={(event) => setExplanation(event.target.value)}
                  rows={3}
                  value={explanation}
                />
              </Field>
            </>
          ) : (
            <>
              <Field label={type === "pdf" ? "PDF from Media" : "Video from Media"}>
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-sm border border-[#eadfca] bg-white p-2">
                  {mediaLoading && <p className="p-2 text-sm text-stone-500">Loading Media library…</p>}
                  {!mediaLoading &&
                    suitableMedia.map((item) => (
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-sm border p-3 ${selectedMediaId === item.id ? "border-amber-500 bg-amber-50" : "border-transparent hover:bg-stone-50"}`}
                        key={item.id}
                      >
                        <input
                          checked={selectedMediaId === item.id}
                          name="course-media"
                          onChange={() => {
                            setSelectedMediaId(item.id);
                            if (!title) setTitle(item.name);
                          }}
                          type="radio"
                        />
                        <span className="min-w-0">
                          <b className="block truncate text-sm text-stone-900">{item.name}</b>
                          <span className="block truncate text-xs text-stone-500">{item.url}</span>
                        </span>
                      </label>
                    ))}
                  {!mediaLoading && !suitableMedia.length && (
                    <p className="p-3 text-sm text-stone-500">
                      No {type.toUpperCase()} files are in Media yet. Upload one in the Media Library first.
                    </p>
                  )}
                </div>
              </Field>
              {selectedMedia && (
                <p className="flex items-center gap-1 text-xs text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Selected: {selectedMedia.name}
                </p>
              )}
            </>
          )}
        </div>
        <footer className="mt-5 flex justify-end gap-2">
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={type !== "mcq" && !selectedMediaId} type="submit">
            Save {dialogTitle}
          </button>
        </footer>
      </form>
    </div>
  );
}
