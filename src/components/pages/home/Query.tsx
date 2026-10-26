/*
|-----------------------------------------
| setting up Query.tsx for the App
|-----------------------------------------
*/

"use client";

import Image from "next/image";

import { defaultCards, defaultData, type HomeCard, type HomeData } from "./data";

const value = (first: unknown, second: unknown, fallback: string) => {
  const candidates = [first, second, fallback];
  return candidates.find((item): item is string => typeof item === "string" && item.trim().length > 0) ?? fallback;
};

function cards(valueToParse: string | undefined): HomeCard[] {
  try {
    const parsed: unknown = JSON.parse(valueToParse ?? defaultData.sectionsJson);
    if (!Array.isArray(parsed)) return defaultCards;
    const validCards = parsed
      .filter((item): item is Partial<HomeCard> => typeof item === "object" && item !== null)
      .map((item) => ({
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
      }))
      .filter((item) => item.title || item.description);
    return validCards.length ? validCards : defaultCards;
  } catch {
    return defaultCards;
  }
}

export default function Query({ data }: { data?: Partial<HomeData> }) {
  const own = { ...defaultData, ...data };
  const title = value(own.title, undefined, defaultData.title);
  const intro = value(own.intro, undefined, defaultData.intro);
  const eyebrow = value(own.eyebrow, undefined, defaultData.eyebrow);
  const sectionCards = cards(own.sectionsJson);
  const paddingX = Math.min(300, Math.max(0, Number(own.paddingX) || 0));
  const paddingY = Math.min(300, Math.max(0, Number(own.paddingY) || 0));

  return (
    <section
      className="custom-parent-border overflow-hidden bg-white"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="mx-auto grid max-w-7xl gap-6 bg-stone-950 px-4 py-6 text-white sm:px-6 md:grid-cols-2 md:py-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-300">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">{intro}</p>
        </div>
        <Image
          alt={own.imageAlt || defaultData.imageAlt}
          className="h-56 w-full rounded-sm object-cover grayscale"
          height={640}
          loading="eager"
          src={own.imageUrl || defaultData.imageUrl}
          width={960}
        />
      </div>
      <div className="mx-auto grid max-w-7xl gap-px bg-[#eadfca] sm:grid-cols-2 lg:grid-cols-3">
        {sectionCards.map((section, index) => (
          <article className="min-h-36 bg-white p-5" key={`${section.title}-${index}`}>
            <p className="text-xs font-semibold text-amber-700">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-semibold text-stone-900">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
