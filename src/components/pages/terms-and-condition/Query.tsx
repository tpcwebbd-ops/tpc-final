/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";

import { defaultDataPage5, type ISection5Data, type Section5Props } from "./data";

const parseData = (data: ISection5Data | string | undefined) => {
  if (!data) return defaultDataPage5;
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data) as ISection5Data;
  } catch {
    return defaultDataPage5;
  }
};

const sectionIcons = ["ShieldCheck", "FileText", "FileSignature", "ScrollText"];

const QueryPage5 = ({ data }: Section5Props) => {
  const pageData = parseData(data);
  const sections = useMemo(() => pageData.sections ?? [], [pageData.sections]);
  const principles = sections[0]?.items ?? [];
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const updateActiveSection = () => {
      const firstVisibleSection = sections.find((_, index) => {
        const element = document.getElementById(`term-${index + 1}`);
        if (!element) return false;
        const position = element.getBoundingClientRect();
        return position.bottom > 112 && position.top < window.innerHeight;
      });
      const index = firstVisibleSection ? sections.indexOf(firstVisibleSection) : -1;
      if (index >= 0) setActiveSection((current) => (current === index ? current : index));
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const selectSection = (index: number) => {
    setActiveSection(index);
    document.getElementById(`term-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      className="custom-parent-border min-h-screen bg-[#fffdf8] text-slate-900"
      style={{
        paddingInline: `${Math.min(300, Math.max(0, Number(pageData.paddingX) || 0))}px`,
        paddingBlock: `${Math.min(300, Math.max(0, Number(pageData.paddingY) || 0))}px`,
      }}
    >
      <section className="bg-[#fffaf0] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.7fr] lg:text-left">
          <div className="text-center lg:text-left">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-amber-100 text-amber-800 shadow-sm">
              {iconMap.ScrollText}
            </div>
            {pageData.showEyebrow && pageData.eyebrow && (
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{pageData.eyebrow}</p>
            )}
            <h1 className="mt-7 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{pageData.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{pageData.subtitle}</p>
            <p className="mt-7 text-sm font-medium text-slate-500">Last updated: 24 August 2026</p>
          </div>
          <div className="relative min-h-56 overflow-hidden rounded-sm border border-amber-100 bg-white shadow-[0_18px_50px_rgba(120,83,20,0.08)] sm:min-h-72">
            <Image
              alt="Terms and conditions"
              className="object-cover"
              fill
              loading="eager"
              priority
              sizes="(max-width: 1024px) 92vw, 38vw"
              src={pageData.image}
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_2.1fr]">
          <aside className="h-fit rounded-sm border border-amber-100 bg-white p-6 shadow-[0_14px_40px_rgba(120,83,20,0.06)] lg:sticky lg:top-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">At a glance</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              These terms explain how we work with website users and clients in Bangladesh.
            </p>
            <div className="mt-6 space-y-3">
              {sections.map((section, index) => {
                const active = activeSection === index;
                return (
                  <a
                    key={`${section.title}-${index}`}
                    className={`block rounded-sm px-2 py-2 text-sm transition ${active ? "bg-amber-100 font-bold text-amber-950" : "font-medium text-slate-700 hover:bg-[#fffaf0] hover:text-amber-800"}`}
                    href={`#term-${index + 1}`}
                    onClick={(event) => {
                      event.preventDefault();
                      selectSection(index);
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}. {section.title}
                  </a>
                );
              })}
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-sm border border-amber-100 bg-white p-6 shadow-[0_14px_40px_rgba(120,83,20,0.06)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700">
                  {iconMap.ShieldCheck}
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">{pageData.highlightTitle}</h2>
              </div>
              <p className="mt-4 leading-7 text-slate-600">{pageData.highlightDescription}</p>
              {principles.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {principles.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-sm bg-[#fffaf0] p-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-700">{iconMap.Check}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {sections.map((section, index) => {
              const Icon = sectionIcons[index] ?? "FileText";
              return (
                <article
                  id={`term-${index + 1}`}
                  key={`${section.title}-${index}`}
                  className={`scroll-mt-24 rounded-sm border bg-white p-6 shadow-[0_14px_40px_rgba(120,83,20,0.06)] sm:p-8 ${activeSection === index ? "border-amber-400 ring-2 ring-amber-100" : "border-amber-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-amber-50 text-amber-800">
                      {iconMap[Icon]}
                    </div>
                    {section.showEyebrow && (
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
                        {String(index + 1).padStart(2, "0")} · {section.eyebrow}
                      </p>
                    )}
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-slate-950">{section.title}</h2>
                  <p className="mt-4 leading-7 text-slate-600">{section.description}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`} className="flex gap-3 text-sm leading-6 text-slate-700">
                          <span className="mt-1 shrink-0 text-emerald-700">{iconMap.Check}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-sm border border-amber-200 bg-[#fff8e8] p-6 text-center sm:p-8">
          <p className="text-sm leading-7 text-slate-600">
            By continuing to use Site services, you acknowledge that you have read and accepted these Terms and
            Conditions. For clarification, please contact us through our official support channel.
          </p>
        </div>
      </section>
    </main>
  );
};

export default QueryPage5;
