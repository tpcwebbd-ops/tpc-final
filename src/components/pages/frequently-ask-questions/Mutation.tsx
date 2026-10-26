/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { defaultData, defaultQuestions } from "./data";

type Question = { question: string; answer: string };
type FormData = { title: string; intro: string; questions: Question[] };

const parseQuestions = (value?: string): Question[] => {
  try {
    const parsed = JSON.parse(value ?? defaultData.questionsJson) as Partial<Question>[];
    const valid = Array.isArray(parsed)
      ? parsed.filter((item) => typeof item.question === "string" && typeof item.answer === "string")
      : [];
    return valid.length
      ? valid.map((item) => ({ question: item.question ?? "", answer: item.answer ?? "" }))
      : defaultQuestions;
  } catch {
    return defaultQuestions;
  }
};

const normalize = (data?: Record<string, string>): FormData => ({
  title: data?.title ?? defaultData.title,
  intro: data?.intro ?? defaultData.intro,
  questions: parseQuestions(data?.questionsJson),
});

export default function Mutation({
  data = defaultData,
  onChange,
}: {
  data?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<FormData>(() => normalize(data));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const next = normalize(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
  }, [data]);

  useEffect(() => {
    onChangeRef.current({
      title: formData.title,
      intro: formData.intro,
      questionsJson: JSON.stringify(formData.questions),
    });
  }, [formData]);

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    setFormData((current) => ({
      ...current,
      questions: current.questions.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  const inputClass = "border-[#eadfca] bg-white text-stone-800 placeholder:text-stone-400 focus-visible:ring-amber-500";

  return (
    <div className="custom-parent-border px-4 min-h-full bg-[#fffaf0] text-stone-700 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_18px_60px_rgba(120,83,35,0.08)]">
        <header className="border-b border-[#eadfca] bg-[#fffdf8] p-6">
          <h2 className="text-xl font-bold text-stone-900">Edit Frequently Asked Questions</h2>
          <p className="mt-1 text-sm text-stone-500">
            Edit each question and answer in a guided card. No JSON editor is required.
          </p>
        </header>
        <div className="grid gap-5 md:p-8">
          <section className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5">
            <div className="space-y-2">
              <Label htmlFor="faq-title">Page title</Label>
              <Input
                id="faq-title"
                className={inputClass}
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-intro">Introduction</Label>
              <Textarea
                id="faq-intro"
                className={`${inputClass} min-h-24 resize-y`}
                value={formData.intro}
                onChange={(event) => setFormData((current) => ({ ...current, intro: event.target.value }))}
              />
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-900">Questions and answers</h3>
                <p className="text-sm text-stone-500">{formData.questions.length} questions</p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    questions: [...current.questions, { question: "New question", answer: "Add the answer here." }],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add question
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {formData.questions.map((item, index) => (
                <article
                  className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5"
                  key={`${index}-${item.question}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-stone-900">Question {index + 1}</h4>
                    <Button
                      aria-label={`Remove question ${index + 1}`}
                      className="text-red-700"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          questions: current.questions.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                    <Input
                      id={`faq-question-${index}`}
                      className={inputClass}
                      value={item.question}
                      onChange={(event) => updateQuestion(index, "question", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                    <Textarea
                      id={`faq-answer-${index}`}
                      className={`${inputClass} min-h-32 resize-y`}
                      value={item.answer}
                      onChange={(event) => updateQuestion(index, "answer", event.target.value)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
