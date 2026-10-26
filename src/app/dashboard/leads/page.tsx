/*
|-----------------------------------------
| setting up the five Leads landing cards
| @author: Codex
|-----------------------------------------
*/

"use client";

import Link from "next/link";

import { Icon } from "@/components/all-icons/all-icons";
import { leadTabs } from "@/lib/dashboard/leads";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";

import { leadPanel, leadPresentation } from "./_components/presentation";

export default function LeadsPage() {
  const { canEnter } = useDashboardPermissions("/dashboard/leads");
  return (
    <main className="grid min-w-0 gap-4">
      <section
        aria-label="Leads workspace sections"
        className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {leadTabs
          .filter((tab) => canEnter(`/dashboard/leads/${tab.path}`))
          .map((tab) => (
            <div
              key={tab.path}
              className={`${leadPanel} group relative overflow-hidden border-t-4 ${leadPresentation[tab.path].accentClass}`}
            >
              <Link
                href={`/dashboard/leads/${tab.path}`}
                className="flex h-full min-h-60 flex-col items-start p-5 outline-none transition duration-700 hover:-translate-y-0.5 hover:bg-[#fffdf7] focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <span
                  className={`mb-7 grid size-12 place-items-center rounded-sm border ${leadPresentation[tab.path].iconClass}`}
                >
                  <Icon name={tab.icon} className="size-5" />
                </span>
                <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                  {leadPresentation[tab.path].caption}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{tab.label}</h2>
                <p className="mt-2 mb-6 text-sm leading-6 text-slate-500">{leadPresentation[tab.path].description}</p>
                <span className="mt-auto flex w-full items-center justify-between gap-2 border-t border-[#eadfca] pt-4 text-xs font-bold text-amber-700">
                  Open {tab.label.toLowerCase()}
                  <Icon
                    name="ArrowRight"
                    className="size-4 rounded-full bg-amber-50 p-0.5 transition-transform duration-700 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </div>
          ))}
      </section>
    </main>
  );
}
