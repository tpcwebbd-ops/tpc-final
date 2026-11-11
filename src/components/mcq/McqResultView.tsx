/*
|-----------------------------------------
| setting up public MCQ result sheets and admin question timing review
|-----------------------------------------
*/

"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { mcqDate, mcqDuration, type McqResult } from "@/lib/dashboard/mcq-exams";
import { downloadMcqMarksheet } from "@/lib/dashboard/mcq-marksheet";

export default function McqResultView({ result, detail }: { result: McqResult; detail?: McqResult }) {
  const [downloading, setDownloading] = useState(false);
  async function download() {
    setDownloading(true);
    try {
      await downloadMcqMarksheet(result);
    } catch {
      toast.error("Could not create the PDF result sheet. Please try again.");
    } finally {
      setDownloading(false);
    }
  }
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#cf302b]">Examination result</p>
          <h2 className="mt-1 break-words text-xl font-semibold text-stone-900">{result.examTitle}</h2>
          <p className="mt-1 text-sm text-stone-600">{mcqDate(result.submittedAt)} (Bangladesh time)</p>
        </div>
        <button className="primary-button" disabled={downloading} onClick={() => void download()} type="button">
          <Download className="h-4 w-4" /> {downloading ? "Creating PDF…" : "Download result PDF"}
        </button>
      </header>
      <dl className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-stone-500">Student</dt>
          <dd className="mt-1 break-words font-semibold">{result.studentName}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Mobile number</dt>
          <dd className="mt-1 font-semibold">{result.mobile}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Marks obtained</dt>
          <dd className="mt-2 text-4xl font-bold text-[#cf302b]">
            {result.score} <span className="text-xl text-stone-500">/ {result.totalMarks}</span>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Total examination time</dt>
          <dd className="mt-2 text-2xl font-semibold">{mcqDuration(result.totalTimeMs)}</dd>
          <p className="mt-2 text-xs text-stone-500">Attempt {result.attemptNumber}</p>
        </div>
      </dl>
      {detail && (
        <section className="space-y-3">
          <h3 className="font-semibold">Question-wise time and answers</h3>
          {detail.questions.map((question, index) => (
            <article className="rounded-sm border border-[#eadfca] p-4" key={question.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="min-w-0 flex-1 whitespace-pre-wrap break-words font-medium">
                  {index + 1}. {question.question}
                </h4>
                <span className="shrink-0 rounded-sm bg-amber-50 px-2 py-1 text-sm text-amber-900">
                  {mcqDuration(detail.questionTimesMs[index])} ({(detail.questionTimesMs[index] / 1000).toFixed(2)}s)
                </span>
              </div>
              <p
                className={`mt-3 whitespace-pre-wrap break-words text-sm ${detail.answers[index] === question.correctOptionIndex ? "text-emerald-800" : "text-red-700"}`}
              >
                Selected: {question.options[detail.answers[index]]} ·{" "}
                {detail.answers[index] === question.correctOptionIndex ? "Correct · 1 mark" : "Incorrect · 0 marks"}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-stone-600">
                Correct answer: {question.options[question.correctOptionIndex]}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
