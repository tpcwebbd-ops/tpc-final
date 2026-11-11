/*
|-----------------------------------------
| setting up MCQ examination titles, attempt limits, and question editing
|-----------------------------------------
*/

"use client";

import { Plus, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";

import { toast } from "@/components/ui/global-toast";
import {
  DEFAULT_MCQ_ATTEMPTS,
  MAX_MCQ_QUESTIONS,
  validateMcqExam,
  type McqExam,
  type McqQuestion,
} from "@/lib/dashboard/mcq-exams";
import { useSaveMcqExamMutation } from "@/redux/features/dashboard/mcq-exams/mcqExamsSlice";

import { mcqApiError } from "./mcq-ui";

const blankQuestion = (): McqQuestion => ({
  id: crypto.randomUUID(),
  question: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});
export default function McqExamEditor({ exam, onClose }: { exam?: McqExam; onClose: () => void }) {
  const [title, setTitle] = useState(exam?.title ?? "");
  const [maxAttempts, setMaxAttempts] = useState(exam?.maxAttempts ?? DEFAULT_MCQ_ATTEMPTS);
  const [questions, setQuestions] = useState<McqQuestion[]>(() =>
    exam ? structuredClone(exam.questions) : [blankQuestion()],
  );
  const [save, { isLoading }] = useSaveMcqExamMutation();
  function update(index: number, patch: Partial<McqQuestion>) {
    setQuestions((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const input = validateMcqExam({ title, maxAttempts, questions });
      await save({ ...input, ...(exam ? { id: exam.id } : {}) }).unwrap();
      toast.success(exam ? "Examination updated." : "Examination created. Its public link is ready to share.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : mcqApiError(error));
    }
  }
  function fillTo(count: number) {
    if (questions.length < count)
      setQuestions([...questions, ...Array.from({ length: count - questions.length }, blankQuestion)]);
  }
  return (
    <form className="space-y-5" onSubmit={(event) => void submit(event)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{exam ? "Edit examination" : "New examination"}</h2>
        <button className="secondary-button" disabled={isLoading} onClick={onClose} type="button">
          Cancel
        </button>
      </header>
      <fieldset className="space-y-5" disabled={isLoading}>
        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <label className="block text-sm font-medium">
            Examination title
            <input
              className="input mt-1"
              maxLength={240}
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </label>
          <label className="block text-sm font-medium">
            Maximum attempts per student
            <input
              className="input mt-1"
              min={1}
              max={100}
              onChange={(event) => setMaxAttempts(Number(event.target.value))}
              required
              type="number"
              value={maxAttempts}
            />
          </label>
        </div>
        <p className="text-sm text-stone-600">
          Each question carries 1 mark. Students are identified by mobile number.{" "}
          {exam
            ? "Changes apply to new attempts; saved results keep their original questions."
            : "The default allowance is 3 attempts per student for this exam."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mr-auto font-semibold">Questions ({questions.length})</h3>
          {[25, 30, 50].map((count) => (
            <button
              className="secondary-button"
              disabled={questions.length >= count}
              key={count}
              onClick={() => fillTo(count)}
              type="button"
            >
              Fill to {count}
            </button>
          ))}
        </div>
        {questions.map((question, index) => (
          <article className="space-y-3 rounded-sm border border-[#eadfca] bg-[#fffdfa] p-4" key={question.id}>
            <header className="flex flex-wrap items-center gap-3">
              <h4 className="mr-auto text-sm font-semibold">Question {index + 1}</h4>
              <label className="flex items-center gap-2 text-sm">
                Options
                <select
                  aria-label={`Number of options for question ${index + 1}`}
                  className="input w-auto py-1"
                  onChange={(event) => {
                    const count = Number(event.target.value);
                    update(index, {
                      options: Array.from({ length: count }, (_, i) => question.options[i] ?? ""),
                      correctOptionIndex: question.correctOptionIndex < count ? question.correctOptionIndex : 0,
                    });
                  }}
                  value={question.options.length}
                >
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <button
                aria-label={`Remove question ${index + 1}`}
                className="icon-button text-red-700"
                disabled={questions.length === 1}
                onClick={() => setQuestions(questions.filter((row) => row.id !== question.id))}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </header>
            <label className="block text-sm">
              Question text
              <textarea
                className="input mt-1 min-h-24"
                maxLength={4000}
                onChange={(event) => update(index, { question: event.target.value })}
                required
                value={question.question}
              />
            </label>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs text-stone-600">Enter each option and select the correct answer.</legend>
              {question.options.map((option, optionIndex) => (
                <div className="flex items-center gap-3" key={optionIndex}>
                  <input
                    aria-label={`Option ${String.fromCharCode(65 + optionIndex)} is correct for question ${index + 1}`}
                    checked={question.correctOptionIndex === optionIndex}
                    className="h-4 w-4 shrink-0 accent-emerald-700"
                    name={`correct-${question.id}`}
                    onChange={() => update(index, { correctOptionIndex: optionIndex })}
                    type="radio"
                  />
                  <label className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                    <span>{String.fromCharCode(65 + optionIndex)}.</span>
                    <input
                      aria-label={`Question ${index + 1}, option ${String.fromCharCode(65 + optionIndex)}`}
                      className="input"
                      maxLength={1000}
                      onChange={(event) =>
                        update(index, {
                          options: question.options.map((text, i) => (i === optionIndex ? event.target.value : text)),
                        })
                      }
                      required
                      value={option}
                    />
                  </label>
                </div>
              ))}
            </fieldset>
          </article>
        ))}
        <button
          className="secondary-button"
          disabled={questions.length >= MAX_MCQ_QUESTIONS}
          onClick={() => setQuestions([...questions, blankQuestion()])}
          type="button"
        >
          <Plus className="h-4 w-4" /> Add question
        </button>
        <div className="flex flex-wrap gap-2 border-t border-[#eadfca] pt-4">
          <button className="primary-button" type="submit">
            {isLoading ? "Saving…" : "Save examination"}
          </button>
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
}
