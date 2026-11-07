/*
|-----------------------------------------
| setting up saved exam scores, answer review, and downloadable marksheets
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { examDuration, examResultSummary, type ExamResult } from "@/lib/dashboard/course-exams";
import { examStatus } from "@/lib/dashboard/course-status";
import { questionMarks } from "@/lib/dashboard/courses";
import { downloadExamMarksheet } from "@/lib/dashboard/exam-marksheet";

import { StatusBadge } from "./CourseStatus";

export default function ExamResultView({ result, onBack }: { result: ExamResult; onBack: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const status = examStatus(result);
  const summary = examResultSummary(result);
  async function download() {
    setDownloading(true);
    try {
      await downloadExamMarksheet(result);
    } catch {
      toast.error("Could not create the marksheet. Please try again.");
    } finally {
      setDownloading(false);
    }
  }
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#cf302b]">Examination result</p>
          <h3 className="text-xl font-semibold text-stone-900">{result.examTitle}</h3>
          <p className="mt-1 text-sm text-stone-600">Saved result · {new Date(result.submittedAt!).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="secondary-button" onClick={onBack} type="button">
            All results
          </button>
          <button className="primary-button" disabled={downloading} onClick={() => void download()} type="button">
            {downloading ? "Creating PDF…" : "Download marksheet PDF"}
          </button>
        </div>
      </header>
      <section aria-label="Marks summary" className={"overflow-hidden rounded-2xl border shadow-sm " + status.style}>
        <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-7">
          <div>
            <StatusBadge {...status} />
            <p className="mt-3 text-xs font-bold uppercase tracking-widest">Marks obtained</p>
            <p className="mt-2">
              <strong className="text-5xl font-bold tracking-tight text-current">{result.score ?? 0}</strong>
              <span className="ml-2 text-xl text-stone-500">/ {result.totalMarks}</span>
            </p>
            <p className="mt-3 text-sm text-stone-600">
              {result.studentName} · {result.courseName}
            </p>
          </div>
          <div className="rounded-xl border border-white bg-white/80 px-6 py-4 text-center">
            <strong className="text-3xl text-current">{summary.percentage}%</strong>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">Percentage</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:px-7">
          {[
            { label: "Correct", value: summary.correct, color: "text-emerald-800" },
            { label: "Incorrect", value: summary.incorrect, color: "text-red-800" },
            { label: "Unanswered", value: summary.unanswered, color: "text-amber-800" },
            { label: "Time taken", value: examDuration(result.elapsedSeconds ?? 0), color: "text-stone-800" },
          ].map(({ label, value, color }) => (
            <p key={label}>
              <span className="block text-xs text-stone-500">{label}</span>
              <strong className={`mt-1 block text-xl ${color}`}>{value}</strong>
            </p>
          ))}
        </div>
      </section>
      <div>
        <h4 className="font-semibold text-stone-900">Answer breakdown</h4>
        <p className="mt-1 text-sm text-stone-500">
          Compare your answers with the correct choices and see the marks for each question.
        </p>
      </div>
      {result.questions.map((question, index) => (
        <article className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5" key={question.id}>
          <h4 className="font-semibold">
            {index + 1}. {question.title}
            <span
              className={`ml-2 inline-block rounded-full px-3 py-1 text-sm ${result.answers[index] == null ? "bg-amber-50 text-amber-800" : result.answers[index] === question.correctOptionIndex ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
            >
              {result.answers[index] === question.correctOptionIndex ? questionMarks(question) : 0} /{" "}
              {questionMarks(question)} marks
            </span>
          </h4>
          <p className="mt-2 whitespace-pre-wrap text-sm">{question.question}</p>
          <ol className="mt-3 space-y-2 text-sm">
            {question.options.map((option, optionIndex) => (
              <li
                className={`rounded-sm border p-3 ${optionIndex === question.correctOptionIndex ? "border-emerald-300 bg-emerald-50" : optionIndex === result.answers[index] ? "border-red-200 bg-red-50" : "border-stone-200"}`}
                key={optionIndex}
              >
                {String.fromCharCode(65 + optionIndex)}. {option}
                <span className="ml-2 font-semibold">
                  {optionIndex === question.correctOptionIndex ? "Correct answer" : ""}
                  {optionIndex === result.answers[index] ? " · Your answer" : ""}
                </span>
              </li>
            ))}
          </ol>
          {result.answers[index] === null && (
            <p className="mt-2 text-sm text-amber-800">You left this question unanswered.</p>
          )}
          {question.explanation && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-stone-600">Explanation: {question.explanation}</p>
          )}
        </article>
      ))}
    </div>
  );
}
