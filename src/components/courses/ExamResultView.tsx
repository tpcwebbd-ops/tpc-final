/*
|-----------------------------------------
| setting up saved exam scores, answer review, and downloadable marksheets
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { examDuration, type ExamResult } from "@/lib/dashboard/course-exams";
import { questionMarks } from "@/lib/dashboard/courses";
import { downloadExamMarksheet } from "@/lib/dashboard/exam-marksheet";

export default function ExamResultView({ result, onBack }: { result: ExamResult; onBack: () => void }) {
  const [downloading, setDownloading] = useState(false);
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
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{result.examTitle}</h3>
          <p className="mt-1 text-sm text-stone-600">Saved result · {new Date(result.submittedAt!).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="secondary-button" onClick={onBack} type="button">
            Back to course
          </button>
          <button className="primary-button" disabled={downloading} onClick={() => void download()} type="button">
            {downloading ? "Creating PDF…" : "Download marksheet PDF"}
          </button>
        </div>
      </header>
      <div className="grid gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-3">
        <p>
          <span className="block text-xs text-stone-600">Marks</span>
          <strong className="text-xl">
            {result.score} / {result.totalMarks}
          </strong>
        </p>
        <p>
          <span className="block text-xs text-stone-600">Correct answers</span>
          <strong>
            {result.correctCount} / {result.questionCount}
          </strong>
        </p>
        <p>
          <span className="block text-xs text-stone-600">Time taken</span>
          <strong>{examDuration(result.elapsedSeconds ?? 0)}</strong>
        </p>
      </div>
      {result.questions.map((question, index) => (
        <article className="rounded-sm border border-stone-200 bg-white p-4" key={question.id}>
          <h4 className="font-semibold">
            {index + 1}. {question.title}
            <span className="ml-2 text-sm text-stone-500">
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
