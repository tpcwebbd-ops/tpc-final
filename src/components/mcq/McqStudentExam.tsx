/*
|-----------------------------------------
| setting up student registration, sequential MCQs, timing, and instant results
|-----------------------------------------
*/

"use client";

import { Clock3 } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import {
  mcqDuration,
  type McqActiveAttempt,
  type McqPublicExam,
  type McqStudentState,
} from "@/lib/dashboard/mcq-exams";

import McqResultView from "./McqResultView";

async function examRequest<T>(url: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    cache: "no-store",
    signal,
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(typeof data.error === "string" ? data.error : "Could not load the examination. Please retry.");
  return data;
}

export default function McqStudentExam({ slug }: { slug: string }) {
  const [exam, setExam] = useState<McqPublicExam | null>(null);
  const [state, setState] = useState<McqStudentState | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [registerAgain, setRegisterAgain] = useState(false);
  const endpoint = `/api/mcq/${encodeURIComponent(slug)}`;
  useEffect(() => {
    const controller = new AbortController();
    examRequest<McqPublicExam>(endpoint, undefined, controller.signal)
      .then((data) => {
        setExam(data);
        setState(data.state);
        setError("");
        setRegisterAgain(false);
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Could not load this examination.");
      });
    return () => controller.abort();
  }, [endpoint, reload]);
  function refresh() {
    setError("");
    setExam(null);
    setReload((value) => value + 1);
  }
  const result = state?.status === "submitted" ? state.result : null;
  return (
    <main className="min-h-[60vh] bg-[#fffaf0] px-4 py-8 sm:px-6">
      <section className="mx-auto max-w-3xl space-y-5 rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        {!exam && !error && (
          <p className="py-8 text-center text-stone-500" role="status">
            Loading examination…
          </p>
        )}
        {error && (
          <div className="rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
            <button className="ml-2 underline" onClick={refresh} type="button">
              Retry
            </button>
          </div>
        )}
        {exam && (
          <>
            {!state || registerAgain ? (
              <>
                <header>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#cf302b]">MCQ examination</p>
                  <h1 className="mt-2 break-words text-2xl font-semibold">{exam.title}</h1>
                  <p className="mt-2 text-sm text-stone-600">
                    {exam.questionCount} questions · 1 mark per question · Up to {exam.maxAttempts} attempts per student
                  </p>
                </header>
                <McqRegistration
                  endpoint={endpoint}
                  initialMobile={result?.mobile}
                  initialName={result?.studentName}
                  onStarted={(next) => {
                    setState(next);
                    setRegisterAgain(false);
                  }}
                />
                {registerAgain && (
                  <button className="secondary-button" onClick={() => setRegisterAgain(false)} type="button">
                    Back to result
                  </button>
                )}
              </>
            ) : state.status === "in-progress" ? (
              <>
                <header>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#cf302b]">MCQ examination</p>
                  <h1 className="mt-1 break-words text-xl font-semibold">{exam.title}</h1>
                </header>
                <McqQuestionStep
                  attempt={state.attempt}
                  endpoint={endpoint}
                  key={`${state.attempt.id}:${state.attempt.questionIndex}`}
                  onSaved={setState}
                  onReload={refresh}
                />
              </>
            ) : (
              <>
                <h1 className="text-lg font-semibold text-emerald-800">Examination completed</h1>
                <McqResultView result={state.result} />
                {state.result.attemptNumber < exam.maxAttempts && (
                  <button className="secondary-button" onClick={() => setRegisterAgain(true)} type="button">
                    Take another attempt
                  </button>
                )}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function McqRegistration({
  endpoint,
  initialName = "",
  initialMobile = "",
  onStarted,
}: {
  endpoint: string;
  initialName?: string;
  initialMobile?: string;
  onStarted: (state: McqStudentState) => void;
}) {
  const [name, setName] = useState(initialName);
  const [mobile, setMobile] = useState(initialMobile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const attemptId = useRef("");
  const inFlight = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    attemptId.current ||= crypto.randomUUID();
    try {
      onStarted(
        await examRequest<McqStudentState>(endpoint, { action: "start", name, mobile, attemptId: attemptId.current }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start the exam. Please retry.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <form className="space-y-4" onSubmit={(event) => void submit(event)}>
      <p className="text-sm text-stone-600">
        Enter your name and mobile number to begin. Answer one question at a time; each answer is saved when you
        continue. Time is recorded automatically.
      </p>
      <fieldset className="space-y-4" disabled={busy}>
        <label className="block text-sm font-medium">
          Name
          <input
            autoComplete="name"
            className="input mt-1"
            maxLength={120}
            onChange={(event) => {
              setName(event.target.value);
              attemptId.current = "";
            }}
            required
            value={name}
          />
        </label>
        <label className="block text-sm font-medium">
          Mobile number
          <input
            autoComplete="tel"
            className="input mt-1"
            inputMode="tel"
            maxLength={40}
            onChange={(event) => {
              setMobile(event.target.value);
              attemptId.current = "";
            }}
            required
            type="tel"
            value={mobile}
          />
        </label>
        {error && (
          <p className="rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" type="submit">
          {busy ? "Starting examination…" : "Start examination"}
        </button>
      </fieldset>
    </form>
  );
}

function McqQuestionStep({
  attempt,
  endpoint,
  onSaved,
  onReload,
}: {
  attempt: McqActiveAttempt;
  endpoint: string;
  onSaved: (state: McqStudentState) => void;
  onReload: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (answer === null || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      onSaved(
        await examRequest<McqStudentState>(endpoint, {
          action: "answer",
          attemptId: attempt.id,
          questionIndex: attempt.questionIndex,
          answer,
        }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your answer. Please retry.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <form className="space-y-5" onSubmit={(event) => void submit(event)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-stone-600">
          Question {attempt.questionIndex + 1} of {attempt.questionCount} · {attempt.studentName}
        </span>
        <span className="text-xs text-stone-500">Attempt {attempt.attemptNumber}</span>
      </div>
      <progress
        aria-label="Answered questions"
        className="h-2 w-full accent-emerald-700"
        max={attempt.questionCount}
        value={attempt.questionIndex}
      />
      <McqClock attempt={attempt} />
      <fieldset className="space-y-3" disabled={busy}>
        <legend className="mb-4 whitespace-pre-wrap break-words text-lg font-semibold">
          {attempt.question.question}
        </legend>
        {attempt.question.options.map((option, index) => (
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 text-sm ${answer === index ? "border-amber-400 bg-amber-50" : "border-[#eadfca] hover:bg-[#fffdfa]"}`}
            key={index}
          >
            <input
              checked={answer === index}
              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-700"
              name="answer"
              onChange={() => setAnswer(index)}
              required
              type="radio"
              value={index}
            />
            <span className="whitespace-pre-wrap break-words">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          </label>
        ))}
      </fieldset>
      {error && (
        <div className="rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
          <button className="ml-2 underline" onClick={onReload} type="button">
            Reload saved progress
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-stone-500">Submitted answers cannot be changed.</p>
        <button className="primary-button" disabled={answer === null || busy} type="submit">
          {busy
            ? "Saving answer…"
            : attempt.questionIndex === attempt.questionCount - 1
              ? "Submit examination"
              : "Next question"}
        </button>
      </div>
    </form>
  );
}

function McqClock({ attempt }: { attempt: McqActiveAttempt }) {
  const [now, setNow] = useState(Date.parse(attempt.serverNow));
  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => setNow(Date.parse(attempt.serverNow) + performance.now() - started), 1000);
    return () => window.clearInterval(timer);
  }, [attempt.serverNow]);
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-sm bg-[#fffaf0] p-3 text-sm text-stone-600">
      <span className="inline-flex items-center gap-2">
        <Clock3 className="h-4 w-4" />
        Total: {mcqDuration(now - Date.parse(attempt.startedAt))}
      </span>
      <span>This question: {mcqDuration(now - Date.parse(attempt.questionStartedAt))}</span>
    </div>
  );
}
