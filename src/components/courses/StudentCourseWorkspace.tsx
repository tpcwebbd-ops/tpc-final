/*
|-----------------------------------------
| setting up enrolled student materials, resumable exams, and result history
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { examDuration, type ActiveExam, type ExamResult } from "@/lib/dashboard/course-exams";
import {
  useGetCourseWorkspaceQuery,
  useLazyGetStudentExamResultQuery,
  useRequestExamAllowanceMutation,
  useStartCourseExamMutation,
  useSubmitCourseExamMutation,
} from "@/redux/features/dashboard/course-exams/courseExamsSlice";

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
  const [start, startState] = useStartCourseExamMutation();
  const [requestMore, requestState] = useRequestExamAllowanceMutation();
  const [loadResult, resultState] = useLazyGetStudentExamResultQuery();
  const [running, setRunning] = useState<ActiveExam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  async function startExam(examId: string) {
    try {
      setRunning((await start({ courseId, examId }).unwrap()).attempt);
    } catch (error) {
      toast.error(message(error));
    }
  }
  async function viewResult(attemptId: string) {
    try {
      setResult((await loadResult({ courseId, attemptId }).unwrap()).result);
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
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-3 backdrop-blur-sm sm:p-5">
      <section
        aria-label="Course learning workspace"
        aria-modal="true"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 shadow-2xl sm:p-6"
        role="dialog"
      >
        <header className="mb-5 flex items-start justify-between gap-3 border-b border-[#eadfca] pb-4">
          <h2 className="text-xl font-semibold">{data?.course.name || "Course workspace"}</h2>
          <button className="secondary-button" onClick={close} type="button">
            {running ? "Save and close" : "Close"}
          </button>
        </header>
        {error && <p className="rounded-sm bg-red-50 p-3 text-sm text-red-700">{message(error)}</p>}
        {running ? (
          <ExamRunner
            attempt={running}
            key={running.id}
            onBack={() => setRunning(null)}
            onResult={(result) => {
              setRunning(null);
              setResult(result);
            }}
          />
        ) : result ? (
          <ExamResultView onBack={() => setResult(null)} result={result} />
        ) : data ? (
          <div className="space-y-6">
            <section>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Exam allowance</h3>
                  <p className="mt-1 text-sm">
                    {data.quota.used} / {data.quota.limit} attempts used · {data.quota.remaining} remaining for this
                    course.
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Starting an exam uses one attempt. Resume an unfinished exam without using another attempt.
                  </p>
                </div>
                <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
                  Refresh
                </button>
              </div>
              {data.quota.request?.status === "pending" && (
                <p className="mt-3 text-sm text-amber-800">Your request for 20 more exams is pending approval.</p>
              )}
              {data.quota.request?.status === "rejected" && (
                <p className="mt-3 text-sm text-red-700">
                  Your previous request was declined. You can contact your course administrator or request again.
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
              <h3 className="font-semibold">Learning documents and videos</h3>
              <div className="mt-3 space-y-2">
                {data.course.content.map((item) => (
                  <article
                    className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-200 bg-white p-3"
                    key={item.id}
                  >
                    <p className="text-sm font-medium">
                      {item.title} <span className="text-xs text-stone-500">{item.type.toUpperCase()}</span>
                    </p>
                    <a className="secondary-button" href={item.mediaUrl} rel="noopener noreferrer" target="_blank">
                      {item.type === "pdf" ? "Read document" : "Watch video"}
                    </a>
                  </article>
                ))}
                {!data.course.content.length && (
                  <p className="text-sm text-stone-500">No documents or videos added yet.</p>
                )}
              </div>
            </section>
            <section>
              <h3 className="font-semibold">MCQ exams</h3>
              {data.active && (
                <div className="mt-3 rounded-sm border border-amber-300 bg-amber-50 p-4">
                  <p className="font-medium">In progress: {data.active.examTitle}</p>
                  <button className="primary-button mt-2" onClick={() => setRunning(data.active)} type="button">
                    Resume exam
                  </button>
                </div>
              )}
              <div className="mt-3 space-y-2">
                {data.exams.map((exam) => (
                  <article
                    className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-200 bg-white p-3"
                    key={exam.id}
                  >
                    <div>
                      <h4 className="font-medium">{exam.title}</h4>
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
            <section>
              <h3 className="font-semibold">Saved results</h3>
              <div className="mt-3 space-y-2">
                {data.attempts
                  .filter((attempt) => attempt.status === "submitted")
                  .map((attempt) => (
                    <article
                      className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-200 bg-white p-3"
                      key={attempt.id}
                    >
                      <div>
                        <h4 className="font-medium">{attempt.examTitle}</h4>
                        <p className="text-sm text-stone-600">
                          {attempt.score} / {attempt.totalMarks} marks · {examDuration(attempt.elapsedSeconds ?? 0)}
                        </p>
                        <p className="text-xs text-stone-500">{new Date(attempt.submittedAt!).toLocaleString()}</p>
                      </div>
                      <button
                        className="secondary-button"
                        disabled={resultState.isFetching}
                        onClick={() => void viewResult(attempt.id)}
                        type="button"
                      >
                        View result / marksheet
                      </button>
                    </article>
                  ))}
                {!data.attempts.some((attempt) => attempt.status === "submitted") && (
                  <p className="text-sm text-stone-500">Your submitted exams and PDF marksheets will appear here.</p>
                )}
              </div>
            </section>
          </div>
        ) : (
          !error && <p className="text-sm text-stone-500">Loading course…</p>
        )}
      </section>
    </div>
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
