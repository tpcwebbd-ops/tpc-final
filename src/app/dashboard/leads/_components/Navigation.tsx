/*
|-----------------------------------------
| setting up route-backed Leads navigation
| @author: Codex
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { leadTabs } from "@/lib/dashboard/leads";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";

import { leadPanel } from "./presentation";

export default function Navigation({ role, email }: { role: string; email: string }) {
  const pathname = usePathname();
  const { canEnter, data: permissions } = useDashboardPermissions("/dashboard/leads");
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = pathname === "/dashboard/leads";
  const current = leadTabs.find((tab) => pathname === `/dashboard/leads/${tab.path}`);
  const availableTabs = leadTabs.filter((tab) => canEnter(`/dashboard/leads/${tab.path}`));
  useEffect(() => {
    const nav = navRef.current;
    const active = activeRef.current;
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft +=
      active.getBoundingClientRect().left -
      nav.getBoundingClientRect().left -
      (nav.clientWidth - active.clientWidth) / 2;
  }, [pathname, permissions]);
  return (
    <div className="grid min-w-0 gap-4">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 px-1 text-xs text-slate-500">
        <span
          tabIndex={0}
          title={email}
          aria-label={`${role}. Hover to see email: ${email}`}
          className="max-w-[min(40vw,12rem)] truncate rounded-sm bg-amber-50 px-2 py-1 font-semibold text-amber-800 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {role}
        </span>
        <Icon name="ChevronRight" className="size-3 shrink-0" />
        {isHome ? (
          <span className="truncate font-medium text-slate-800">Leads workspace</span>
        ) : (
          <>
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-1.5 rounded-sm font-medium text-slate-500 outline-none transition hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Icon name="FolderKanban" className="size-4 text-amber-600" />
              Leads workspace
            </Link>
            <Icon name="ChevronRight" className="hidden size-3 shrink-0 sm:block" />
            <span className="hidden truncate font-medium text-slate-800 sm:block">{current?.label}</span>
          </>
        )}
      </nav>
      {isHome ? (
        <header
          className={`${leadPanel} relative overflow-hidden bg-linear-to-br from-white via-[#fffdf7] to-amber-50 p-6 sm:p-8`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full border-[44px] border-amber-100/70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-16 bottom-[-5.5rem] size-48 rounded-full bg-amber-200/30 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-amber-700 uppercase">
              <span className="grid size-7 place-items-center rounded-sm bg-amber-600 text-white shadow-lg shadow-amber-200">
                <Icon name="FolderKanban" className="size-3.5" />
              </span>
              Lead management
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">Leads workspace</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              From the first conversation to the next opportunity. Choose a workspace to manage your pipeline, your
              team, and your customer relationships.
            </p>
          </div>
        </header>
      ) : (
        <>
          <div className="relative flex justify-end sm:hidden">
            <button
              type="button"
              aria-label={`${mobileMenuOpen ? "Close" : "Choose"} Leads tab. Current tab: ${current?.label ?? "Leads"}`}
              aria-expanded={mobileMenuOpen}
              aria-controls="leads-mobile-tabs"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`${leadPanel} flex w-full items-center justify-between gap-3 px-4 py-3 text-left outline-none transition hover:border-amber-300 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-500`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon name={current?.icon ?? "FolderKanban"} className="size-4 shrink-0 text-amber-700" />
                <span className="truncate text-sm font-semibold text-slate-800">{current?.label ?? "Leads tabs"}</span>
              </span>
              <Icon
                name="ChevronDown"
                className={`size-4 shrink-0 text-slate-500 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <nav
              id="leads-mobile-tabs"
              aria-label="Choose a Leads tab"
              className={`${leadPanel} absolute top-full right-0 z-40 mt-2 w-full gap-1.5 p-2 shadow-lg shadow-stone-300/40 ${mobileMenuOpen ? "grid" : "hidden"}`}
            >
              {availableTabs
                .filter((tab) => tab.path !== current?.path)
                .map((tab) => {
                  const href = `/dashboard/leads/${tab.path}`;
                  return (
                    <Link
                      key={tab.path}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold text-stone-600 outline-none transition hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <Icon name={tab.icon} className="size-4 shrink-0" />
                      <span className="flex-1">{tab.label}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>
          <nav
            ref={navRef}
            aria-label="Leads tabs"
            className={`${leadPanel} hidden min-w-0 gap-1.5 overflow-x-auto p-1.5 sm:grid sm:grid-cols-5`}
          >
            {availableTabs.map((tab) => {
              const href = `/dashboard/leads/${tab.path}`;
              return (
                <Link
                  key={tab.path}
                  ref={pathname === href ? activeRef : undefined}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`flex shrink-0 items-center justify-center gap-2 rounded-sm border px-3 py-3 text-sm font-semibold outline-none transition duration-700 focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none sm:min-w-0 ${pathname === href ? "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-200" : "border-transparent text-stone-500 hover:bg-[#fffdf7] hover:text-stone-900"}`}
                >
                  <Icon name={tab.icon} className="size-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
