/*
|-----------------------------------------
| setting up enrolled student materials, resumable exams, and result history
|-----------------------------------------
*/

"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowLeft, BookOpen, ClipboardList, FileCheck2, FileText, Play, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { getYouTubeEmbedUrl } from "@/components/sections/section-34/data";
import { toast } from "@/components/ui/global-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { examDuration, type ActiveExam, type ExamResult } from "@/lib/dashboard/course-exams";
import { examStatus, learningStatus, statusStyles } from "@/lib/dashboard/course-status";
import type { CourseMediaContent } from "@/lib/dashboard/courses";
import {
  useCompleteCourseLectureMutation,
  useGetCourseWorkspaceQuery,
  useGetStudentExamResultQuery,
  useRequestExamAllowanceMutation,
  useStartCourseExamMutation,
  useSubmitCourseExamMutation,
} from "@/redux/features/dashboard/course-exams/courseExamsSlice";

import { ExamStatusLegend, StatusBadge } from "./CourseStatus";
import ExamResultView from "./ExamResultView";

const message = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : "Could not complete this action. Please try again.";

export default function StudentCourseWorkspace({ courseId, close }: { courseId: string; close: () => void }) {
  const { data, error, isFetching, refetch } = useGetCourseWorkspaceQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });
  const [completeLecture, lectureState] = useCompleteCourseLectureMutation();
  const [start, startState] = useStartCourseExamMutation();
  const [requestMore, requestState] = useRequestExamAllowanceMutation();
  const [running, setRunning] = useState<ActiveExam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const lecture = data?.course.content.find((item) => item.id === lectureId) ?? data?.course.content[0];
  const [tab, setTab] = useState("tutorials");
  const workspaceId = useId();
  const active = running ?? data?.active;
  const exams =
    active && !data?.exams.some((exam) => exam.id === active.examId)
      ? [
          {
            id: active.examId,
            title: active.examTitle,
            questionCount: active.questionCount,
            totalMarks: active.totalMarks,
          },
          ...(data?.exams ?? []),
        ]
      : (data?.exams ?? []);
  const exam = exams.find((item) => item.id === examId) ?? exams.find((item) => item.id === active?.examId) ?? exams[0];
  const latestAttempt =
    active?.examId === exam?.id ? active : data?.attempts.find((attempt) => attempt.examId === exam?.id);
  const completed = data?.attempts.filter((attempt) => attempt.status === "submitted") ?? [];
  if (result && !completed.some((attempt) => attempt.id === result.id)) completed.unshift(result);
  const selectedResult = completed.find((attempt) => attempt.id === resultId) ?? completed[0];
  const resultState = useGetStudentExamResultQuery(
    { courseId, attemptId: selectedResult?.id ?? "" },
    { skip: tab !== "results" || !selectedResult },
  );
  const displayedResult = resultState.currentData?.result ?? (result?.id === selectedResult?.id ? result : null);
  async function startExam(examId: string) {
    try {
      setRunning((await start({ courseId, examId }).unwrap()).attempt);
      setExamId(examId);
      setTab("exams");
    } catch (error) {
      toast.error(message(error));
    }
  }
  function viewResult(attemptId: string) {
    setResultId(attemptId);
    setTab("results");
  }
  async function more() {
    try {
      await requestMore(courseId).unwrap();
      toast.success("Your request for 20 more exams was sent.");
    } catch (error) {
      toast.error(message(error));
    }
  }
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 z-[100] flex h-dvh w-full flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50 text-stone-800 outline-none">
          <header className="shrink-0 border-b border-stone-200 bg-white">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative hidden h-12 w-28 shrink-0 overflow-hidden sm:block">
                  <Image alt="TestPrep Center" className="object-cover" fill sizes="112px" src="/Logo.png" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#cf302b]">My learning space</p>
                  <Dialog.Title className="mt-1 text-lg font-semibold leading-tight text-stone-900 sm:text-xl">
                    {data?.course.name || "Course workspace"}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-xs text-stone-500">
                    Your tutorials, exams, and saved results in one place.
                  </Dialog.Description>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Refresh course data"
                  className="icon-button"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  type="button"
                >
                  <RefreshCw aria-hidden="true" className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
                </button>
                <Dialog.Close className="secondary-button">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  <span>My Courses</span>
                </Dialog.Close>
              </div>
            </div>
          </header>
          <Tabs className="flex min-h-0 flex-1 flex-col" onValueChange={setTab} value={tab}>
            <div className="shrink-0 border-b border-stone-200 bg-white">
              <TabsList
                aria-label="Course sections"
                className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-1 px-3 sm:gap-3 sm:px-6 lg:px-8"
              >
                {[
                  { value: "tutorials", label: "Tutorial", count: data?.course.content.length ?? 0, Icon: BookOpen },
                  { value: "exams", label: "Exams", count: data?.exams.length ?? 0, Icon: ClipboardList },
                  { value: "results", label: "Result", count: completed.length, Icon: FileCheck2 },
                ].map(({ value, label, count, Icon }) => (
                  <TabsTrigger
                    aria-controls={`${workspaceId}-${value}-panel`}
                    className="flex min-h-16 items-center justify-center gap-2 border-b-2 border-transparent px-2 py-3 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#cf302b] data-[state=active]:border-[#cf302b] data-[state=active]:text-[#cf302b]"
                    id={`${workspaceId}-${value}-tab`}
                    key={value}
                    value={value}
                  >
                    <Icon aria-hidden="true" className="hidden size-4 sm:block" />
                    {label}
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{count}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {error && (
                  <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
                    {message(error)}
                  </p>
                )}
                {!data && !error && (
                  <p className="text-sm text-stone-500" role="status">
                    Loading course…
                  </p>
                )}
                {data && (
                  <>
                    <div className={"mb-6 rounded-2xl border p-4 " + learningStatus(data.progress.percentage).style}>
                      <StatusBadge {...learningStatus(data.progress.percentage)} />
                      <p className="mb-1 text-sm">
                        Course progress: {data.progress.completed} / {data.progress.total} completed -{" "}
                        {data.progress.percentage}%
                      </p>
                      <progress
                        aria-label="Course progress"
                        className="h-2 w-full accent-emerald-600"
                        max={100}
                        value={data.progress.percentage}
                      />
                    </div>
                    <div
                      aria-labelledby={`${workspaceId}-tutorials-tab`}
                      hidden={tab !== "tutorials"}
                      id={`${workspaceId}-tutorials-panel`}
                      role="tabpanel"
                      tabIndex={0}
                    >
                      {data.course.content.length ? (
                        <div className="grid items-start gap-5 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
                          <aside className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-sm md:sticky md:top-0">
                            <div className="border-b border-stone-200 p-4">
                              <h3 className="font-semibold text-stone-900">Tutorials</h3>
                              <p className="mt-1 text-xs text-stone-500">Choose a lesson to read or watch.</p>
                            </div>
                            <nav
                              aria-label="Tutorial lessons"
                              className="max-h-64 space-y-2 overflow-y-auto p-3 md:max-h-[70dvh]"
                            >
                              {data.course.content.map((item, index) => {
                                const selected = item.id === lecture?.id;
                                const done = data.progress.completedLectureIds.includes(item.id);
                                const Icon = item.type === "pdf" ? FileText : Play;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    aria-current={selected ? "true" : undefined}
                                    aria-controls={workspaceId + "-tutorial-viewer"}
                                    onClick={() => setLectureId(item.id)}
                                    className={
                                      "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 " +
                                      (selected
                                        ? "border-sky-400 bg-sky-100 text-sky-950 ring-1 ring-sky-200"
                                        : done
                                          ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                                          : "border-slate-200 bg-slate-50 text-stone-700 hover:bg-sky-50")
                                    }
                                  >
                                    <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                                    <span className="min-w-0">
                                      <span className="block break-words text-sm font-semibold">
                                        {index + 1}. {item.title}
                                      </span>
                                      <span className="mt-1 block text-xs text-stone-500">
                                        {item.type === "pdf" ? "PDF" : "Video"}
                                      </span>
                                      {done && (
                                        <span className="mt-1 block text-xs font-medium text-emerald-700">
                                          Completed
                                        </span>
                                      )}
                                    </span>
                                  </button>
                                );
                              })}
                            </nav>
                          </aside>
                          <div id={workspaceId + "-tutorial-viewer"} className="min-w-0">
                            {lecture && tab === "tutorials" && (
                              <TutorialViewer
                                key={lecture.id}
                                lecture={lecture}
                                completed={data.progress.completedLectureIds.includes(lecture.id)}
                                saving={lectureState.isLoading}
                                onComplete={async () => {
                                  try {
                                    await completeLecture({ courseId, lectureId: lecture.id }).unwrap();
                                    toast.success("Tutorial completed.");
                                  } catch (error) {
                                    toast.error(message(error));
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
                          <BookOpen aria-hidden="true" className="mx-auto mb-3 size-8 text-stone-400" />
                          <h3 className="font-semibold">Your tutorials will appear here</h3>
                          <p className="mt-1 text-sm text-stone-500">No documents or videos have been added yet.</p>
                        </div>
                      )}
                    </div>
                    {/* Keep the exam panel mounted when changing tabs so answers and confirmation state survive. */}
                    <div
                      aria-labelledby={`${workspaceId}-exams-tab`}
                      hidden={tab !== "exams"}
                      id={`${workspaceId}-exams-panel`}
                      role="tabpanel"
                      tabIndex={0}
                    >
                      <div className="grid items-start gap-5 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
                        <aside className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-sm md:sticky md:top-0">
                          <div className="border-b border-stone-200 p-4">
                            <h3 className="font-semibold text-stone-900">Exams</h3>
                            <p className="mt-1 text-xs text-stone-500">Choose an exam to view or take.</p>
                          </div>
                          <nav
                            aria-label="Course exams"
                            className="max-h-64 space-y-2 overflow-y-auto p-3 md:max-h-[70dvh]"
                          >
                            {exams.map((item, index) => {
                              const selected = item.id === exam?.id;
                              const attempt =
                                active?.examId === item.id
                                  ? active
                                  : data.attempts.find((attempt) => attempt.examId === item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  aria-current={selected ? "true" : undefined}
                                  aria-controls={workspaceId + "-exam-viewer"}
                                  onClick={() => setExamId(item.id)}
                                  className={
                                    "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 " +
                                    (selected
                                      ? "border-sky-400 bg-sky-100 text-sky-950 ring-1 ring-sky-200"
                                      : attempt
                                        ? examStatus(attempt).style + " hover:brightness-95"
                                        : "border-slate-200 bg-slate-50 text-stone-700 hover:bg-sky-50")
                                  }
                                >
                                  <ClipboardList aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                                  <span className="min-w-0">
                                    <span className="block break-words text-sm font-semibold">
                                      {index + 1}. {item.title}
                                    </span>
                                    <span className="mt-1 block text-xs text-stone-500">
                                      {item.questionCount} questions · {item.totalMarks} marks
                                    </span>
                                    <span className="mt-2 block">
                                      <StatusBadge {...examStatus(attempt)} />
                                    </span>
                                    {data.progress.completedExamIds.includes(item.id) && (
                                      <span className="mt-1 block text-xs font-medium text-emerald-700">Completed</span>
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                            {!exams.length && <p className="p-3 text-sm text-stone-500">No exams published yet.</p>}
                          </nav>
                        </aside>
                        <div id={workspaceId + "-exam-viewer"} className="min-w-0 space-y-5">
                          <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold">Exam allowance</h3>
                                <p className="mt-1 text-sm">
                                  {data.quota.used} / {data.quota.limit} attempts used · {data.quota.remaining}{" "}
                                  remaining for this course.
                                </p>
                                <p className="mt-1 text-xs text-stone-500">
                                  Starting an exam uses one attempt. Resume an unfinished exam without using another
                                  attempt.
                                </p>
                              </div>
                              <button
                                className="secondary-button"
                                disabled={isFetching}
                                onClick={() => void refetch()}
                                type="button"
                              >
                                Refresh
                              </button>
                            </div>
                            {data.quota.request?.status === "pending" && (
                              <p className="mt-3 text-sm text-amber-800">
                                Your request for 20 more exams is pending approval.
                              </p>
                            )}
                            {data.quota.request?.status === "rejected" && (
                              <p className="mt-3 text-sm text-red-700">
                                Your previous request was declined. You can contact your course administrator or request
                                again.
                              </p>
                            )}
                            {data.quota.remaining === 0 && !active && data.quota.request?.status !== "pending" && (
                              <button
                                className="primary-button mt-3"
                                disabled={requestState.isLoading}
                                onClick={() => void more()}
                                type="button"
                              >
                                Request 20 more exams
                              </button>
                            )}
                            {active && active.examId !== exam?.id && (
                              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                                <p className="break-words font-medium">Unfinished: {active.examTitle}</p>
                                <button
                                  className="primary-button mt-2"
                                  onClick={() => {
                                    setExamId(active.examId);
                                    setRunning(active);
                                  }}
                                  type="button"
                                >
                                  Resume exam
                                </button>
                              </div>
                            )}
                          </section>
                          <ExamStatusLegend />
                          {running && (
                            <div
                              hidden={running.examId !== exam?.id}
                              className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:p-6"
                            >
                              <ExamRunner
                                attempt={running}
                                key={running.id}
                                onBack={() => setRunning(null)}
                                onResult={(result) => {
                                  setRunning(null);
                                  setResult(result);
                                  setResultId(result.id);
                                  setTab("results");
                                }}
                              />
                            </div>
                          )}
                          {exam && running?.examId !== exam.id && (
                            <article className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
                              <header className="space-y-3 border-b border-stone-200 p-4 sm:p-6">
                                <h3 className="break-words text-xl font-semibold text-stone-900">{exam.title}</h3>
                                <StatusBadge {...examStatus(latestAttempt)} />
                              </header>
                              <div className="space-y-5 p-4 sm:p-6">
                                <dl className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div>
                                    <dt className="text-xs text-stone-500">Questions</dt>
                                    <dd className="mt-1 text-2xl font-semibold text-stone-900">{exam.questionCount}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs text-stone-500">Total marks</dt>
                                    <dd className="mt-1 text-2xl font-semibold text-stone-900">{exam.totalMarks}</dd>
                                  </div>
                                </dl>
                                <p className="text-sm leading-6 text-stone-600">
                                  Answer the multiple-choice questions and submit your answers to save your result. You
                                  can review your answers and download a marksheet after submission.
                                </p>
                                {active && active.examId !== exam.id ? (
                                  <p className="text-sm text-amber-800">
                                    Finish your unfinished exam before starting another.
                                  </p>
                                ) : !active && data.quota.remaining <= 0 ? (
                                  <p className="text-sm text-amber-800">
                                    Your exam allowance is used up. Request more attempts above to continue.
                                  </p>
                                ) : null}
                              </div>
                              <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-sky-200 bg-sky-50 p-4 sm:p-6">
                                <p className="text-sm text-stone-600">
                                  {active?.examId === exam.id
                                    ? "Continue your saved attempt without using another attempt."
                                    : "Starting this exam uses one attempt."}
                                </p>
                                <button
                                  className="primary-button"
                                  disabled={
                                    startState.isLoading ||
                                    (Boolean(active) && active?.examId !== exam.id) ||
                                    (!active && data.quota.remaining <= 0)
                                  }
                                  onClick={() => {
                                    if (active?.examId === exam.id) setRunning(active);
                                    else void startExam(exam.id);
                                  }}
                                  type="button"
                                >
                                  {active?.examId === exam.id
                                    ? "Resume exam"
                                    : startState.isLoading
                                      ? "Starting..."
                                      : "Start exam"}
                                </button>
                              </footer>
                            </article>
                          )}
                          {!exam && (
                            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
                              <ClipboardList aria-hidden="true" className="mx-auto mb-3 size-8 text-stone-400" />
                              <h3 className="font-semibold">Your exams will appear here</h3>
                              <p className="mt-1 text-sm text-stone-500">No exams have been published yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      aria-labelledby={`${workspaceId}-results-tab`}
                      hidden={tab !== "results"}
                      id={`${workspaceId}-results-panel`}
                      role="tabpanel"
                      tabIndex={0}
                    >
                      <div className="grid items-start gap-5 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
                        <aside className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-sm md:sticky md:top-0">
                          <div className="border-b border-stone-200 p-4">
                            <h3 className="font-semibold text-stone-900">Results</h3>
                            <p className="mt-1 text-xs text-stone-500">Choose an attempt to review your marks.</p>
                          </div>
                          <nav
                            aria-label="Saved exam results"
                            className="max-h-64 space-y-2 overflow-y-auto p-3 md:max-h-[70dvh]"
                          >
                            {completed.map((attempt) => {
                              const selected = attempt.id === selectedResult?.id;
                              return (
                                <button
                                  key={attempt.id}
                                  type="button"
                                  aria-current={selected ? "true" : undefined}
                                  aria-controls={workspaceId + "-result-viewer"}
                                  onClick={() => viewResult(attempt.id)}
                                  className={
                                    "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 " +
                                    (selected
                                      ? "border-sky-400 bg-sky-100 text-sky-950 ring-1 ring-sky-200"
                                      : examStatus(attempt).style + " hover:brightness-95")
                                  }
                                >
                                  <FileCheck2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                                  <span className="min-w-0">
                                    <span className="block break-words text-sm font-semibold">{attempt.examTitle}</span>
                                    <span className="mt-1 block text-xs text-stone-500">
                                      {new Date(attempt.submittedAt!).toLocaleString()}
                                    </span>
                                    <span className="mt-2 block text-sm font-semibold">
                                      {attempt.score} / {attempt.totalMarks} marks
                                    </span>
                                    <span className="mt-2 block">
                                      <StatusBadge {...examStatus(attempt)} />
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                            {!completed.length && (
                              <p className="p-3 text-sm text-stone-500">No completed attempts yet.</p>
                            )}
                          </nav>
                        </aside>
                        <div
                          id={workspaceId + "-result-viewer"}
                          className="min-w-0 space-y-5"
                          aria-busy={resultState.isFetching}
                        >
                          {selectedResult ? (
                            <>
                              <ExamStatusLegend />
                              <section className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:p-6">
                                {resultState.error && (
                                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
                                    <p>{message(resultState.error)}</p>
                                    <button
                                      className="secondary-button mt-3"
                                      disabled={resultState.isFetching}
                                      onClick={() => void resultState.refetch()}
                                      type="button"
                                    >
                                      Try again
                                    </button>
                                  </div>
                                )}
                                {displayedResult ? (
                                  <ExamResultView key={displayedResult.id} result={displayedResult} />
                                ) : resultState.isFetching ? (
                                  <p className="py-8 text-center text-sm text-stone-500" role="status">
                                    Loading result…
                                  </p>
                                ) : null}
                              </section>
                            </>
                          ) : (
                            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
                              <FileCheck2 aria-hidden="true" className="mx-auto mb-3 size-8 text-stone-400" />
                              <h4 className="font-semibold">No results yet</h4>
                              <p className="mt-1 text-sm text-stone-500">
                                Complete an exam to see your marks and download your marksheet.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Tabs>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function TutorialViewer({
  lecture,
  completed,
  saving,
  onComplete,
}: {
  lecture: CourseMediaContent;
  completed: boolean;
  saving: boolean;
  onComplete: () => Promise<void>;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [videoError, setVideoError] = useState(false);
  const youtube = lecture.type === "video" ? getYouTubeEmbedUrl(lecture.mediaUrl) : null;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start" });
  }, [lecture.id]);
  return (
    <article
      className={
        "overflow-hidden rounded-2xl border shadow-sm " +
        (completed ? statusStyles.complete : "border-sky-200 bg-white")
      }
    >
      <header className="space-y-3 border-b border-stone-200 p-4 sm:p-6">
        <h3
          ref={heading}
          tabIndex={-1}
          className="scroll-mt-4 break-words text-xl font-semibold text-stone-900 outline-none"
        >
          {lecture.title}
        </h3>
      </header>
      <div className="p-3 sm:p-6">
        {lecture.type === "pdf" ? (
          <iframe
            title={lecture.title + " PDF"}
            src={lecture.mediaUrl}
            className="h-[70dvh] min-h-96 w-full rounded-lg border border-stone-200"
          />
        ) : youtube ? (
          <iframe
            title={lecture.title + " video"}
            src={youtube}
            className="aspect-video w-full rounded-lg bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video
            aria-label={lecture.title}
            src={lecture.mediaUrl}
            controls
            playsInline
            preload="metadata"
            className="max-h-[75dvh] w-full rounded-lg bg-black"
            onError={() => setVideoError(true)}
          >
            Your browser does not support video playback.
          </video>
        )}
        {videoError && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            This video could not be loaded. Please refresh or contact your course administrator.
          </p>
        )}
      </div>
      <footer
        className={
          "flex flex-wrap items-center justify-between gap-4 border-t p-4 sm:p-6 " +
          (completed ? statusStyles.complete : statusStyles.learning)
        }
      >
        <p className="text-sm text-stone-600">
          {completed
            ? "You have completed this tutorial."
            : lecture.type === "pdf"
              ? "Finished reading? Complete this tutorial to save your progress."
              : "Finished watching? Complete this tutorial to save your progress."}
        </p>
        <button
          className="primary-button"
          type="button"
          disabled={saving || completed}
          onClick={() => void onComplete()}
        >
          {completed ? "Completed" : saving ? "Saving..." : "Complete tutorial"}
        </button>
      </footer>
    </article>
  );
}

function ExamRunner({
  attempt,
  onBack,
  onResult,
}: {
  attempt: ActiveExam;
  onBack: () => void;
  onResult: (result: ExamResult) => void;
}) {
  const storageKey = `course-exam-${attempt.userId}-${attempt.id}`;
  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        Array.isArray(saved) &&
        saved.length === attempt.questions.length &&
        saved.every(
          (answer, index) =>
            answer === null ||
            (Number.isInteger(answer) && answer >= 0 && answer < attempt.questions[index].options.length),
        )
      )
        return saved;
    } catch {
      /* Continue with empty answers when storage is unavailable. */
    }
    return attempt.questions.map(() => null);
  });
  const [elapsed, setElapsed] = useState(() => Math.max(0, (Date.now() - Date.parse(attempt.startedAt)) / 1000));
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submit, submitState] = useSubmitCourseExamMutation();
  const [failure, setFailure] = useState("");
  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsed(Math.max(0, (Date.now() - Date.parse(attempt.startedAt)) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [attempt.startedAt]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      /* Server grading does not depend on local storage. */
    }
  }, [answers, storageKey]);
  async function finish() {
    setFailure("");
    try {
      const saved = await submit({ courseId: attempt.courseId, attemptId: attempt.id, answers }).unwrap();
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* Result is already saved in the database. */
      }
      onResult(saved.result);
    } catch (error) {
      setFailure(message(error));
    }
  }
  const unanswered = answers.filter((answer) => answer === null).length;
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{attempt.examTitle}</h3>
          <p className="text-sm text-stone-600">
            {attempt.questionCount} questions · {attempt.totalMarks} marks · Elapsed {examDuration(elapsed)}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            The server records time from start to final submission, including time spent away.
          </p>
        </div>
        <button className="secondary-button" disabled={submitState.isLoading} onClick={onBack} type="button">
          Save and return to course
        </button>
      </header>
      {attempt.questions.map((question, index) => (
        <fieldset
          className="rounded-sm border border-stone-200 bg-white p-4"
          disabled={submitState.isLoading}
          key={question.id}
        >
          <legend className="px-1 font-semibold">
            Question {index + 1} · {question.marks} mark(s)
          </legend>
          <p className="whitespace-pre-wrap text-sm">{question.question}</p>
          <div className="mt-3 space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                className={`flex items-start gap-3 rounded-sm border p-3 text-sm ${answers[index] === optionIndex ? "border-amber-500 bg-amber-50" : "border-stone-200"}`}
                key={optionIndex}
              >
                <input
                  checked={answers[index] === optionIndex}
                  name={`question-${question.id}`}
                  onChange={() =>
                    setAnswers(answers.map((answer, position) => (position === index ? optionIndex : answer)))
                  }
                  type="radio"
                />
                <span>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </span>
              </label>
            ))}
          </div>
          <button
            className="mt-2 text-xs text-stone-500 underline"
            onClick={() => setAnswers(answers.map((answer, position) => (position === index ? null : answer)))}
            type="button"
          >
            Clear answer
          </button>
        </fieldset>
      ))}
      <p className="text-sm">{unanswered} unanswered question(s). Unanswered and incorrect answers receive 0 marks.</p>
      {failure && (
        <p className="rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
          {failure}
        </p>
      )}
      {confirmSubmit ? (
        <div className="rounded-sm border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm">
            Submit your final answers? You will not be able to change this result. {unanswered} question(s) are
            unanswered.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className="primary-button"
              disabled={submitState.isLoading}
              onClick={() => void finish()}
              type="button"
            >
              {submitState.isLoading ? "Submitting…" : "Confirm submission"}
            </button>
            <button
              className="secondary-button"
              disabled={submitState.isLoading}
              onClick={() => setConfirmSubmit(false)}
              type="button"
            >
              Keep working
            </button>
          </div>
        </div>
      ) : (
        <button className="primary-button" onClick={() => setConfirmSubmit(true)} type="button">
          Submit exam
        </button>
      )}
    </div>
  );
}
