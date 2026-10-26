/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { defaultData } from "./data";

const questions = [
  {
    question: "What does NexaMart do?",
    answer:
      "NexaMart is a Bangladesh-based technology company that helps businesses with digital products, web solutions, software services, and practical technical support.",
  },
  {
    question: "How can I request a project or quotation?",
    answer:
      "Share your requirements through our official contact channel. Our team will review the scope, clarify priorities, and provide the next steps, timeline, and pricing where applicable.",
  },
  {
    question: "How are project costs and payments handled?",
    answer:
      "Project pricing, payment milestones, and any required deposit are confirmed in the relevant proposal or invoice. Fees are communicated in Bangladeshi Taka unless stated otherwise.",
  },
  {
    question: "Can you support an existing website or software product?",
    answer:
      "Yes. After an initial review, we can advise whether ongoing support, improvements, maintenance, or a separate development engagement is the best fit.",
  },
  {
    question: "How do you protect project information?",
    answer:
      "We use reasonable safeguards and limit access to people who need information to deliver authorised work. Please avoid sending sensitive credentials through unsecured channels.",
  },
  {
    question: "Where can I get help after delivery?",
    answer:
      "Your proposal or service agreement will describe the included support period. For further help, contact NexaMart through our official support channel with the relevant project details.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer:
      "Yes. We work with businesses at different stages and can recommend a practical approach based on your current goals, budget, and technical needs.",
  },
  {
    question: "Can NexaMart build a mobile-friendly website?",
    answer:
      "Yes. Our web solutions are planned to work well across modern desktop, tablet, and mobile devices, subject to the agreed project scope.",
  },
  {
    question: "Will I receive updates during the project?",
    answer:
      "Yes. We share progress updates at the milestones agreed for your project and may request feedback or approval before moving to the next stage.",
  },
  {
    question: "Can I request changes after a project starts?",
    answer:
      "Yes. We will review each change request. Changes outside the approved scope may affect the price, timeline, or both before work continues.",
  },
  {
    question: "Do you provide domain and hosting services?",
    answer:
      "We can help you choose, set up, or manage suitable domain and hosting services where included in your agreement. Third-party provider fees and terms may apply.",
  },
  {
    question: "Who owns the final project deliverables?",
    answer:
      "Ownership of final deliverables is set out in your agreement and normally transfers after all applicable payments are received. NexaMart retains ownership of its pre-existing tools, methods, and reusable code.",
  },
  {
    question: "Can you integrate third-party tools or payment gateways?",
    answer:
      "Yes, where technically suitable and included in scope. Third-party platforms, payment gateways, and APIs remain subject to their own approval processes, fees, and service terms.",
  },
  {
    question: "What should I prepare before starting a project?",
    answer:
      "Please prepare your goals, key requirements, brand assets, content, preferred timeline, and the main contact person who can provide decisions and feedback.",
  },
  {
    question: "Can I cancel a project or request a refund?",
    answer:
      "You may contact us to discuss cancellation or a refund request. Eligibility depends on the completed work, payments made, and the applicable proposal, invoice, or Refund Policy.",
  },
  {
    question: "How can I contact NexaMart?",
    answer:
      "Please use our official website contact or support channel and include your name, organisation, and a short description of what you need so our team can respond efficiently.",
  },
];

const parseQuestions = (value?: string) => {
  try {
    const parsed = JSON.parse(value ?? "") as { question?: string; answer?: string }[];
    return parsed.filter((item) => item.question && item.answer) as { question: string; answer: string }[];
  } catch {
    return questions;
  }
};

export default function Query({ data = defaultData }: { data?: Record<string, string> }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [search, setSearch] = useState("");
  const pageQuestions = useMemo(() => parseQuestions(data.questionsJson), [data.questionsJson]);
  const filteredQuestions = useMemo(
    () =>
      pageQuestions
        .map((item, index) => ({ ...item, index }))
        .filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(search.trim().toLowerCase())),
    [pageQuestions, search],
  );

  useEffect(() => {
    const updateActiveQuestion = () => {
      const firstVisibleQuestion = filteredQuestions.find((item) => {
        const element = document.getElementById(`faq-question-${item.index + 1}`);
        if (!element) return false;
        const position = element.getBoundingClientRect();
        return position.bottom > 112 && position.top < window.innerHeight;
      });

      if (firstVisibleQuestion) {
        setActiveQuestion((current) => (current === firstVisibleQuestion.index ? current : firstVisibleQuestion.index));
      }
    };

    window.addEventListener("scroll", updateActiveQuestion, { passive: true });
    window.addEventListener("resize", updateActiveQuestion);
    return () => {
      window.removeEventListener("scroll", updateActiveQuestion);
      window.removeEventListener("resize", updateActiveQuestion);
    };
  }, [filteredQuestions]);

  const selectQuestion = (index: number) => {
    setActiveQuestion(index);
    document.getElementById(`faq-question-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <main className="min-h-screen custom-parent-border bg-[#fffdf8] text-slate-900">
      <section className="border-b border-amber-100/80 bg-[#fffaf0] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-amber-100 text-amber-800 shadow-sm">
            {iconMap.HelpCircle}
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:mt-7 sm:text-5xl">
            {data.title || defaultData.title}
          </h1>
        </div>
      </section>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <label className="relative mx-auto mb-6 block max-w-3xl">
            <span className="sr-only">Search frequently asked questions</span>
            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-amber-800">
              {iconMap.Search}
            </span>
            <Input
              className="h-12 rounded-sm border-amber-200 py-3 pl-12 pr-5 shadow-[0_10px_30px_rgba(120,83,20,0.05)] focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search questions and answers..."
              type="search"
              value={search}
            />
          </label>
          <p className="mb-6 text-center text-sm text-slate-500">
            Showing {filteredQuestions.length} of {pageQuestions.length} questions
          </p>
        </div>
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[0.8fr_2.2fr]">
          <aside className="h-fit rounded-sm border border-amber-100 bg-white p-4 shadow-[0_14px_40px_rgba(120,83,20,0.06)] sm:p-6 lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="flex items-center gap-3">
              <span className="text-emerald-700">{iconMap.ShieldCheck}</span>
              <h2 className="text-xl font-semibold text-slate-950">All questions</h2>
            </div>
            <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
              Select a question to read its answer.
            </p>
            <div className="mt-4 flex max-w-full flex-col gap-1.5 overflow-x-auto pb-1 lg:mt-6 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
              {filteredQuestions.map((item) => {
                const active = activeQuestion === item.index;
                return (
                  <Button
                    className={`h-auto w-72 shrink-0 cursor-pointer justify-start gap-3 rounded-sm px-3 py-2.5 text-left transition-all duration-700 lg:w-full ${active ? "bg-amber-100 text-amber-950 hover:bg-amber-100" : "text-slate-600 hover:bg-[#fffaf0] hover:text-slate-950"}`}
                    key={`sidebar-${item.question}`}
                    onClick={() => selectQuestion(item.index)}
                    title={item.question}
                    type="button"
                    size="sm"
                    variant="ghost"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-amber-700 text-white" : "bg-amber-50 text-amber-800"}`}
                    >
                      {String(item.index + 1).padStart(2, "0")}
                    </span>
                    <span className={`min-w-0 truncate text-sm ${active ? "font-bold" : "font-medium"}`}>
                      {item.question}
                    </span>
                  </Button>
                );
              })}
            </div>
          </aside>
          <div className="space-y-3">
            {filteredQuestions.map((item) => {
              const active = activeQuestion === item.index;
              return (
                <article
                  id={`faq-question-${item.index + 1}`}
                  key={item.question}
                  className={`scroll-mt-24 overflow-hidden rounded-sm border bg-white shadow-[0_10px_30px_rgba(120,83,20,0.05)] transition ${active ? "border-amber-400 ring-2 ring-amber-100" : "border-amber-100"}`}
                >
                  <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-6">
                    <span className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-amber-100 text-sm font-bold text-amber-900">
                        {String(item.index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 break-words text-base font-semibold text-slate-950">
                        {item.question}
                      </span>
                    </span>
                  </div>
                  <div className="border-t border-amber-100 px-4 pb-4 pt-3 text-sm leading-7 text-slate-600 sm:px-6 sm:pb-6 sm:pt-4">
                    {item.answer}
                  </div>
                </article>
              );
            })}
            {filteredQuestions.length === 0 && (
              <div className="rounded-sm border border-dashed border-amber-200 bg-white p-8 text-center text-sm text-slate-600">
                No matching questions or answers found. Try another search term.
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-sm border border-amber-200 bg-[#fff8e8] p-5 text-center sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Still have a question?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Send us your question and relevant project details. The NexaMart team will help with the right next step.
          </p>
          <Link
            className="mt-5 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-sm bg-amber-700 px-4 text-sm font-medium text-white transition-all duration-700 hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-200"
            href="/contact-us"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
