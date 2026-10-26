/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { RichTextPreview } from "@/components/sections/section-1/RichTextEditor";

import {
  defaultDataDetailsPage,
  defaultLayout,
  toRichTextContent,
  type IDetailsPageData,
  type DetailsPagePayload,
  type DetailsPageProps,
} from "./data";

const iconMapNode = (icon: keyof typeof iconMap) => iconMap[icon];
const Check = (props: { className?: string }) => {
  void props;
  return iconMapNode("Check");
};
const Download = (props: { className?: string }) => {
  void props;
  return iconMapNode("Download");
};
const ExternalLink = (props: { className?: string }) => {
  void props;
  return iconMapNode("ExternalLink");
};
const Play = (props: { className?: string }) => {
  void props;
  return iconMapNode("Play");
};

const getData = (data?: IDetailsPageData | DetailsPagePayload | string): DetailsPagePayload => {
  if (!data) return { ...defaultDataDetailsPage, ...defaultLayout };
  try {
    return { ...defaultDataDetailsPage, ...defaultLayout, ...(typeof data === "string" ? JSON.parse(data) : data) };
  } catch {
    return { ...defaultDataDetailsPage, ...defaultLayout };
  }
};

export default function QueryDetailsPage({ data }: DetailsPageProps) {
  const page = getData(data);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  return (
    <section
      style={{
        paddingInline: `${Math.max(0, Number(page.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(page.paddingY) || 0)}px`,
      }}
      className="bg-white px-4 py-12 text-slate-700 sm:px-6 custom-parent-border"
    >
      <div className="mx-auto grid max-w-6xl gap-10 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div className="relative aspect-video overflow-hidden rounded-sm border border-slate-200 bg-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
          <Image
            alt={page.imageAlt}
            className="object-cover"
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={page.imageUrl}
          />
        </div>
        <div className="">
          <h1 className="mt-3 text-2xl font-bold text-slate-950">{page.productTitle}</h1>
          <p className="mt-4 text-xl font-bold text-teal-700">
            {page.priceLabel}: {page.price}
          </p>
          <ul className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2">
            {page.features.map((feature) => (
              <li className="flex items-center gap-2" key={feature}>
                <Check className="h-4 w-4 text-teal-700" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-4 py-3 font-semibold text-white"
              href={page.liveDemoUrl}
            >
              <ExternalLink className="h-4 w-4" />
              {page.buyButtonText}
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              href={page.videoUrl}
            >
              <Play className="h-4 w-4" />
              {page.tutorialButtonText}
            </a>
            <button
              className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              type="button"
            >
              {iconMapNode("ShoppingCart")}
              {page.membershipButtonText}
            </button>
          </div>
          <a
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline underline-offset-4"
            href={page.downloadUrl}
          >
            <Download className="h-4 w-4" />
            {page.downloadLinkText}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-6xl">
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <button
            aria-controls="details-page-description"
            aria-expanded={isDescriptionOpen}
            className="group cursor-pointer flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-bold text-slate-950 transition-colors duration-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 sm:px-8"
            onClick={() => setIsDescriptionOpen((open) => !open)}
            type="button"
          >
            Description
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-teal-700 transition-all duration-500 ease-in-out group-hover:border-teal-200 group-hover:bg-teal-50 ${isDescriptionOpen ? "rotate-180 bg-teal-50" : "rotate-0"}`}
            >
              {iconMapNode("ChevronDown")}
            </span>
          </button>
          <div
            className={`grid border-t border-slate-200 transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isDescriptionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            id="details-page-description"
            role="region"
          >
            <div className="min-h-0 overflow-hidden">
              <div className="px-6 py-6 sm:px-8">
                <RichTextPreview value={toRichTextContent(page.productDescriptions)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
