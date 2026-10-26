/*
|-----------------------------------------
| setting up PageTemplateQuery.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import { ArrowRight, CheckCircle2 } from "lucide-react";

import type { PageTemplateData } from "./page-types";

interface PageTemplateQueryProps<TData extends PageTemplateData> {
  data?: TData | string;
  fallbackData: TData;
  accent?: "emerald" | "sky" | "violet" | "amber" | "rose";
}

const accentStyles = {
  emerald: {
    text: "text-emerald-300",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/10",
    gradient: "from-emerald-400 via-teal-300 to-sky-300",
    button: "from-emerald-500 to-teal-500",
  },
  sky: {
    text: "text-sky-300",
    border: "border-sky-400/30",
    bg: "bg-sky-400/10",
    gradient: "from-sky-400 via-cyan-300 to-emerald-300",
    button: "from-sky-500 to-cyan-500",
  },
  violet: {
    text: "text-violet-300",
    border: "border-violet-400/30",
    bg: "bg-violet-400/10",
    gradient: "from-violet-400 via-fuchsia-300 to-sky-300",
    button: "from-violet-500 to-fuchsia-500",
  },
  amber: {
    text: "text-amber-300",
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    gradient: "from-amber-300 via-orange-300 to-rose-300",
    button: "from-amber-500 to-orange-500",
  },
  rose: {
    text: "text-rose-300",
    border: "border-rose-400/30",
    bg: "bg-rose-400/10",
    gradient: "from-rose-300 via-pink-300 to-violet-300",
    button: "from-rose-500 to-pink-500",
  },
};

const parseData = <TData extends PageTemplateData>(data: TData | string | undefined, fallbackData: TData) => {
  if (!data) return fallbackData;
  if (typeof data !== "string") return data;

  try {
    return JSON.parse(data) as TData;
  } catch {
    return fallbackData;
  }
};

const PageTemplateQuery = <TData extends PageTemplateData>({
  data,
  fallbackData,
  accent = "emerald",
}: PageTemplateQueryProps<TData>) => {
  const pageData = parseData(data, fallbackData);
  const style = accentStyles[accent];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className={`absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full ${style.bg} blur-3xl`} />
        <div className="relative mx-auto max-w-6xl">
          <div
            className={`mb-5 inline-flex rounded-full border ${style.border} ${style.bg} px-4 py-2 text-sm font-semibold ${style.text}`}
          >
            {pageData.eyebrow}
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1
                className={`max-w-4xl bg-gradient-to-r ${style.gradient} bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl`}
              >
                {pageData.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{pageData.subtitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className={`rounded-2xl border ${style.border} bg-white/[0.03] p-5 shadow-2xl shadow-black/20`}>
                <p className="text-sm text-slate-400">Primary action</p>
                <p className="mt-2 text-xl font-semibold">{pageData.primaryAction}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
                <p className="text-sm text-slate-400">Secondary action</p>
                <p className="mt-2 text-xl font-semibold">{pageData.secondaryAction}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {pageData.sections?.map((section, index) => (
            <article
              key={`${section.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/20"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${style.button} text-sm font-bold text-white`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${style.text}`}>{section.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{section.description}</p>
                </div>
              </div>

              {section && section.items && section.items.length > 0 && (
                <div className="mt-6 grid gap-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className={`mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border ${style.border} bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div>
            <p className={`text-sm font-semibold ${style.text}`}>{pageData.pageName}</p>
            <h2 className="mt-1 text-2xl font-bold">Ready for the next step?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${style.button} px-5 py-3 text-sm font-semibold text-white`}
            >
              {pageData.primaryAction}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100">
              {pageData.secondaryAction}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageTemplateQuery;
