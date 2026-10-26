/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| copyright: Toufiquer, 15 August 2026
|-----------------------------------------
*/
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { BuildItem, BuildTarget } from "@/app/api/dashboard/build/v1/route";
import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

type BuildResponse = { cooldowns: Record<string, string | null>; items?: BuildItem[]; error?: string };
type ToastState = { message: string; error?: boolean } | null;
const action = "cursor-pointer transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200";
const time = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function BuildPage() {
  const [data, setData] = useState<BuildResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, string | null>>({});
  const [runningTarget, setRunningTarget] = useState<BuildTarget | null>(null);
  const [now, setNow] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);
  const [search, setSearch] = useState("");

  const loadStatus = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/dashboard/build/v1", { cache: "no-store", credentials: "same-origin" });
      const result = (await response.json().catch(() => null)) as BuildResponse | null;
      if (!response.ok || !result?.items) throw new Error(result?.error ?? "Could not load build status.");
      setData(result);
      setCooldowns(result.cooldowns ?? {});
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load build status.");
    }
  }, []);

  useEffect(() => {
    const task = window.setTimeout(() => void loadStatus(), 0);
    return () => window.clearTimeout(task);
  }, [loadStatus]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const execute = async (target: BuildTarget, name: string) => {
    setRunningTarget(target);
    try {
      const response = await fetch("/api/dashboard/build/v1", {
        method: "POST",
        cache: "no-store",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const result = (await response.json().catch(() => null)) as BuildResponse | null;
      if (!response.ok) {
        if (result?.cooldowns) setCooldowns((current) => ({ ...current, ...result.cooldowns }));
        throw new Error(result?.error ?? "Could not revalidate.");
      }
      setCooldowns((current) => ({ ...current, ...(result?.cooldowns ?? {}) }));
      await loadStatus();
      setToast({ message: `${name} revalidated.` });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Could not revalidate.", error: true });
    } finally {
      setRunningTarget(null);
    }
  };

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const pages = useMemo(
    () =>
      items.filter(
        (item) => item.kind === "page" && `${item.name} ${item.path}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );
  const components = items.filter((item) => item.kind === "component");
  if (!data) return <LoadingState error={loadError} onRetry={loadStatus} />;

  const allSeconds = secondsRemaining(cooldowns.all, now);
  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[90] max-w-[calc(100vw-2rem)] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.error ? "bg-red-700" : "bg-emerald-700"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      {runningTarget && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-stone-950/15 p-4 backdrop-blur-[1px]"
          role="status"
        >
          <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-white px-5 py-4 text-sm font-semibold text-stone-800 shadow-xl">
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-amber-100 border-t-amber-600"
            />
            Revalidating…
          </div>
        </div>
      )}
      <section className="mx-auto max-w-5xl rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-semibold text-stone-900">Build</h1>
            <p className="mt-1 text-sm text-stone-600">Revalidate components and individual pages.</p>
          </div>
          <Button
            className="cursor-pointer bg-emerald-100 text-emerald-900 transition duration-700 hover:bg-emerald-200"
            disabled={Boolean(runningTarget) || Boolean(allSeconds)}
            onClick={() => void execute("all", "Everything")}
            size="sm"
          >
            {runningTarget === "all" ? "Revalidating…" : allSeconds ? time(allSeconds) : "Revalidate all"}
          </Button>
        </div>
        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold">Components</h2>
          <div className="grid gap-2">
            {components.map((item) => (
              <Card
                cooldownUntil={cooldowns[item.id]}
                item={item}
                key={item.id}
                now={now}
                running={Boolean(runningTarget)}
                runningTarget={runningTarget}
                run={execute}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 border-t border-stone-100 pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Pages</h2>
            <input
              className="h-8 cursor-text rounded-sm border border-stone-200 px-2 text-sm"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pages"
              value={search}
            />
          </div>
          <div className="grid max-h-[55vh] gap-2 overflow-y-auto">
            {pages.map((item) => (
              <Card
                cooldownUntil={cooldowns[item.id]}
                item={item}
                key={item.id}
                now={now}
                running={Boolean(runningTarget)}
                runningTarget={runningTarget}
                run={execute}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-500">Each revalidation button has its own 3-minute cooldown.</p>
      </section>
    </main>
  );
}

function LoadingState({ error, onRetry }: { error: string | null; onRetry: () => Promise<void> }) {
  return (
    <main className="grid min-h-[calc(100vh-65px)] flex-1 place-items-center bg-[#fffaf0] p-4">
      <section className="w-full max-w-sm rounded-sm border border-[#eadfca] bg-white p-8 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)]">
        {error ? (
          <>
            <p className="break-words text-sm font-medium text-red-700">{error}</p>
            <Button className="mt-5 cursor-pointer" onClick={() => void onRetry()} size="sm">
              Try again
            </Button>
          </>
        ) : (
          <div>
            <span
              aria-hidden="true"
              className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-amber-100 border-t-amber-600"
            />
            <p className="mt-4 text-sm font-semibold text-stone-800">Loading build status…</p>
          </div>
        )}
      </section>
    </main>
  );
}

function secondsRemaining(cooldownUntil: string | null | undefined, now: number) {
  return cooldownUntil ? Math.max(0, Math.ceil((new Date(cooldownUntil).getTime() - now) / 1000)) : 0;
}

function Card({
  item,
  run,
  running,
  runningTarget,
  cooldownUntil,
  now,
}: {
  item: BuildItem;
  run: (target: BuildTarget, name: string) => Promise<void>;
  running: boolean;
  runningTarget: BuildTarget | null;
  cooldownUntil?: string | null;
  now: number;
}) {
  const seconds = secondsRemaining(cooldownUntil, now);
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 sm:flex-row sm:items-center">
      <span className="text-amber-900">{item.kind === "component" ? iconMap.RefreshCw : iconMap.FileText}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={item.name}>
          {item.name}
        </p>
        {item.path && (
          <p className="truncate text-xs text-stone-500" title={item.path}>
            {item.path}
          </p>
        )}
      </div>
      <Button
        className={`${action} self-end sm:self-auto`}
        disabled={running || Boolean(seconds)}
        onClick={() => void run(item.id, item.name)}
        size="sm"
        variant="outline"
      >
        {runningTarget === item.id ? "Revalidating…" : seconds ? time(seconds) : "Revalidate"}
      </Button>
    </article>
  );
}
