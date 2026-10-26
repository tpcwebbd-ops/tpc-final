/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";

import { defaultData, defaultSections, type AboutSection } from "./data";

const parseSections = (value?: string): AboutSection[] => {
  try {
    const parsed = JSON.parse(value ?? defaultData.sectionsJson) as AboutSection[];
    return Array.isArray(parsed) ? parsed : defaultSections;
  } catch {
    return defaultSections;
  }
};
const numberOrZero = (value?: string) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(300, Math.max(0, number)) : 0;
};

export default function Query({ data = defaultData }: { data?: Record<string, string> }) {
  const sections = parseSections(data.sectionsJson);
  return (
    <main
      className="custom-parent-border overflow-hidden bg-[#fffaf0] text-stone-700"
      style={{ paddingInline: `${numberOrZero(data.paddingX)}px`, paddingBlock: `${numberOrZero(data.paddingY)}px` }}
    >
      <section className="border-b border-[#eadfca] bg-[#fffdf8] px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            {data.showEyebrow !== "false" && (
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">
                {data.eyebrow || defaultData.eyebrow}
              </p>
            )}
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-.05em] text-stone-950 sm:text-6xl">
              {data.title || defaultData.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">{data.intro || defaultData.intro}</p>
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_20px_60px_rgba(120,83,35,0.12)] sm:min-h-80">
            <Image
              alt="About us"
              className="object-cover"
              fill
              loading="eager"
              priority
              sizes="(max-width: 1024px) 92vw, 42vw"
              src={data.image || defaultData.image}
            />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-20">
        {sections.map((section, index) => (
          <article
            className="rounded-sm border border-[#eadfca] bg-white p-6 shadow-[0_12px_35px_rgba(120,83,35,0.06)] sm:p-8"
            key={section.id || index}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {section.showEyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">{section.eyebrow}</p>
                )}
                <h2 className="mt-3 text-2xl font-bold tracking-[-.03em] text-stone-900">{section.title}</h2>
              </div>
              <span className="text-sm font-semibold text-stone-300">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-4 leading-7 text-stone-600">{section.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
