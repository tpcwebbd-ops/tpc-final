/*
|-----------------------------------------
| setting up named MCQ exams assembled from the course question bank
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { questionMarks, type CourseContent, type CourseExam } from "@/lib/dashboard/courses";

export default function CourseExamsEditor({
  content,
  exams,
  onChange,
}: {
  content: CourseContent[];
  exams: CourseExam[];
  onChange: (exams: CourseExam[]) => void;
}) {
  const [editing, setEditing] = useState<CourseExam | null>(null);
  const questions = content.filter((item) => item.type === "mcq");
  return (
    <section className="mt-4 space-y-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">MCQ exams</h2>
          <p className="mt-1 text-sm text-stone-600">
            Select questions for each exam. Save the course to publish your changes. Each student starts with 20
            attempts for this course, including retakes.
          </p>
        </div>
        <button
          className="primary-button"
          disabled={!questions.length || Boolean(editing)}
          onClick={() => setEditing({ id: crypto.randomUUID(), title: "", questionIds: [] })}
          type="button"
        >
          Add exam
        </button>
      </header>
      {!questions.length && <p className="text-sm text-stone-500">Add MCQ questions in Learning content first.</p>}
      {exams.map((exam) => (
        <article
          className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-200 p-3"
          key={exam.id}
        >
          <div>
            <h3 className="font-semibold">{exam.title}</h3>
            <p className="text-sm text-stone-600">
              {exam.questionIds.length} questions ·{" "}
              {Math.round(
                questions
                  .filter((question) => exam.questionIds.includes(question.id))
                  .reduce((total, question) => total + questionMarks(question), 0) * 100,
              ) / 100}{" "}
              marks
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="secondary-button"
              onClick={() => setEditing({ ...exam, questionIds: [...exam.questionIds] })}
              type="button"
            >
              Edit
            </button>
            <button
              className="secondary-button text-red-700"
              onClick={() => onChange(exams.filter((item) => item.id !== exam.id))}
              type="button"
            >
              Remove
            </button>
          </div>
        </article>
      ))}
      {!exams.length && questions.length > 0 && (
        <p className="text-sm text-stone-500">Create an exam so students can take these questions.</p>
      )}
      {editing && (
        <form
          className="space-y-4 rounded-sm border border-amber-200 bg-amber-50/40 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!editing.title.trim() || !editing.questionIds.length) return;
            const next = { ...editing, title: editing.title.trim() };
            onChange(
              exams.some((exam) => exam.id === next.id)
                ? exams.map((exam) => (exam.id === next.id ? next : exam))
                : [...exams, next],
            );
            setEditing(null);
          }}
        >
          <label className="block text-sm font-medium">
            Exam title
            <input
              className="input mt-1"
              maxLength={240}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              required
              value={editing.title}
            />
          </label>
          <p className="text-sm">Select 1–200 questions ({editing.questionIds.length} selected).</p>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {questions.map((question) => (
              <label className="flex items-start gap-3 rounded-sm border bg-white p-3 text-sm" key={question.id}>
                <input
                  checked={editing.questionIds.includes(question.id)}
                  disabled={editing.questionIds.length >= 200 && !editing.questionIds.includes(question.id)}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      questionIds: event.target.checked
                        ? [...editing.questionIds, question.id]
                        : editing.questionIds.filter((id) => id !== question.id),
                    })
                  }
                  type="checkbox"
                />
                <span>
                  <strong>{question.title}</strong> · {questionMarks(question)} mark(s)
                  <span className="mt-1 block whitespace-pre-wrap">{question.question}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="primary-button" disabled={!editing.questionIds.length} type="submit">
              Keep exam
            </button>
            <button className="secondary-button" onClick={() => setEditing(null)} type="button">
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
