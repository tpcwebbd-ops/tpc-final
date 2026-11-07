/*
|-----------------------------------------
| setting up enrolled student materials, resumable exams, and result history
|-----------------------------------------
*/

"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowLeft, BookOpen, ClipboardList, FileCheck2, FileText, Play, RefreshCw, Timer } from "lucide-react";
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
  useLazyGetStudentExamResultQuery,
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
  const [loadResult, resultState] = useLazyGetStudentExamResultQuery();
  const [running, setRunning] = useState<ActiveExam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const lecture = data?.course.content.find((item) => item.id === lectureId) ?? data?.course.content[0];
  const [tab, setTab] = useState("tutorials");
  const workspaceId = useId();
  const completed = data?.attempts.filter((attempt) => attempt.status === "submitted") ?? [];
  async function startExam(examId: string) {
    try {
      setRunning((await start({ courseId, examId }).unwrap()).attempt);
      setTab("exams");
    } catch (error) {
      toast.error(message(error));
    }
  }
  async function viewResult(attemptId: string) {
    try {
      setResult((await loadResult({ courseId, attemptId }).unwrap()).result);
      setTab("results");
    } catch (error) {
      toast.error(message(error));
    }
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
                      {running ? (
                        <ExamRunner
                          attempt={running}
                          key={running.id}
                          onBack={() => setRunning(null)}
                          onResult={(result) => {
                            setRunning(null);
                            setResult(result);
                            setTab("results");
                          }}
                        />
                      ) : (
                        <div className="space-y-6">
                          <section className="rounded-xl border border-stone-200 bg-white p-5">
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
                            {data.quota.remaining === 0 && !data.active && data.quota.request?.status !== "pending" && (
                              <button
                                className="primary-button mt-3"
                                disabled={requestState.isLoading}
                                onClick={() => void more()}
                                type="button"
                              >
                                Request 20 more exams
                              </button>
                            )}
                          </section>
                          <section>
                            <h3 className="mb-3 font-semibold">MCQ exams</h3>
                            <ExamStatusLegend />
                            {data.active && (
                              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                                <p className="font-medium">Unfinished: {data.active.examTitle}</p>
                                <button
                                  className="primary-button mt-2"
                                  onClick={() => setRunning(data.active)}
                                  type="button"
                                >
                                  Resume exam
                                </button>
                              </div>
                            )}
                            <div className="mt-3 space-y-2">
                              {data.exams.map((exam) => (
                                <article
                                  className={
                                    "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm " +
                                    examStatus(data.attempts.find((attempt) => attempt.examId === exam.id)).style
                                  }
                                  key={exam.id}
                                >
                                  <div>
                                    <h4 className="font-medium">
                                      {exam.title}{" "}
                                      <StatusBadge
                                        {...examStatus(data.attempts.find((attempt) => attempt.examId === exam.id))}
                                      />
                                      {data.progress.completedExamIds.includes(exam.id) && (
                                        <span className="text-emerald-700">(Completed)</span>
                                      )}
                                    </h4>
                                    <p className="text-sm text-stone-600">
                                      {exam.questionCount} questions · {exam.totalMarks} marks
                                    </p>
                                  </div>
                                  <button
                                    className="primary-button"
                                    disabled={startState.isLoading || Boolean(data.active) || data.quota.remaining <= 0}
                                    onClick={() => void startExam(exam.id)}
                                    type="button"
                                  >
                                    Start exam
                                  </button>
                                </article>
                              ))}
                              {!data.exams.length && <p className="text-sm text-stone-500">No exams published yet.</p>}
                            </div>
                          </section>
                        </div>
                      )}
                    </div>
                    <div
                      aria-labelledby={`${workspaceId}-results-tab`}
                      hidden={tab !== "results"}
                      id={`${workspaceId}-results-panel`}
                      role="tabpanel"
                      tabIndex={0}
                    >
                      {result ? (
                        <ExamResultView onBack={() => setResult(null)} result={result} />
                      ) : (
                        <section>
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-stone-900">Your results</h3>
                            <p className="mt-1 text-sm text-stone-500">
                              Review your marks, check the correct answers, and download a branded PDF marksheet.
                            </p>
                          </div>
                          <ExamStatusLegend />
                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            {completed.map((attempt) => (
                              <article
                                className={"rounded-2xl border p-5 shadow-sm " + examStatus(attempt).style}
                                key={attempt.id}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <h4 className="break-words font-semibold text-stone-900">{attempt.examTitle}</h4>
                                    <div className="mt-2">
                                      <StatusBadge {...examStatus(attempt)} />
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500">
                                      {new Date(attempt.submittedAt!).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-center">
                                    <strong className="text-2xl text-current">{attempt.score}</strong>
                                    <span className="ml-1 text-sm text-stone-500">/ {attempt.totalMarks}</span>
                                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                                      Marks obtained
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                                  <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                                    <Timer aria-hidden="true" className="size-4" />
                                    {examDuration(attempt.elapsedSeconds ?? 0)}
                                  </span>
                                  <button
                                    className="secondary-button"
                                    disabled={resultState.isFetching}
                                    onClick={() => void viewResult(attempt.id)}
                                    type="button"
                                  >
                                    View result / marksheet
                                  </button>
                                </div>
                              </article>
                            ))}
                          </div>
                          {!completed.length && (
                            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
                              <FileCheck2 aria-hidden="true" className="mx-auto mb-3 size-8 text-stone-400" />
                              <h4 className="font-semibold">No results yet</h4>
                              <p className="mt-1 text-sm text-stone-500">
                                Complete an exam to see your marks and download your marksheet.
                              </p>
                            </div>
                          )}
                        </section>
                      )}
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
