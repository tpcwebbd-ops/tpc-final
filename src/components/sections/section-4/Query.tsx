/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| public preview for section-4
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import { defaultDataSection4, type DashboardMetric, type ModerationItem, type Section4Data } from "./data";

type Section4Input = Partial<Section4Data>;
type Section4ResolvedData = Required<Omit<Section4Data, "id">>;

function readData(data?: Section4Input | string): Section4ResolvedData {
  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return {
      paddingX: Math.max(-300, Math.min(300, Number(parsed?.paddingX) || 0)),
      paddingY: Math.max(-300, Math.min(300, Number(parsed?.paddingY) || 0)),
      showEyebrow: parsed?.showEyebrow !== false,
      badge: parsed?.badge ?? defaultDataSection4.badge,
      title: parsed?.title ?? defaultDataSection4.title,
      subTitle: parsed?.subTitle ?? defaultDataSection4.subTitle,
      metrics: parsed?.metrics ?? defaultDataSection4.metrics,
      moderationQueue: parsed?.moderationQueue ?? defaultDataSection4.moderationQueue,
    };
  } catch {
    return defaultDataSection4;
  }
}

export default function QuerySection4({ data }: { data?: Section4Input | string }) {
  const sectionData = useMemo(() => readData(data), [data]);
  const [queue, setQueue] = useState(sectionData.moderationQueue);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  return (
    <section
      className="custom-parent-border mx-auto w-full max-w-7xl bg-white text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#eadfca] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              {sectionData.showEyebrow && (
                <span className="inline-flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
                  <Icon name="Activity" /> {sectionData.badge}
                </span>
              )}
              <h2 className="mt-3 truncate text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                {sectionData.title}
              </h2>
              <p className="mt-2 max-w-2xl truncate text-sm text-stone-600 sm:text-base" title={sectionData.subTitle}>
                {sectionData.subTitle}
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
              <Icon name="Check" /> System operational
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {sectionData.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-stone-900">
                  <Icon name="ShieldCheck" /> Moderation queue
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  {queue.length} item{queue.length === 1 ? "" : "s"} awaiting review
                </p>
              </div>
              <span className="rounded-sm bg-stone-100 px-2.5 py-1 text-xs text-stone-600">Live demo</span>
            </div>
            <div className="mt-4 space-y-3">
              {queue.length ? (
                queue.map((item) => (
                  <QueueItem
                    item={item}
                    key={item.id}
                    onAction={() => setQueue((items) => items.filter((entry) => entry.id !== item.id))}
                  />
                ))
              ) : (
                <div className="rounded-sm border border-dashed border-[#d9c9aa] bg-emerald-50 p-8 text-center text-sm text-emerald-900">
                  <Icon name="Check" /> All caught up.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  const palette =
    metric.status === "critical"
      ? "border-red-200 bg-red-50 text-red-800"
      : metric.status === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-emerald-200 bg-emerald-50 text-emerald-900";
  return (
    <div className={cn("rounded-sm border p-4", palette)}>
      <p className="truncate text-xs font-medium uppercase tracking-wide" title={metric.label}>
        {metric.label}
      </p>
      <p className="mt-2 truncate text-2xl font-semibold text-stone-900" title={metric.value}>
        {metric.value}
      </p>
      <p className="mt-2 text-xs">
        {metric.trend >= 0 ? "+" : ""}
        {metric.trend}% from last hour
      </p>
    </div>
  );
}

function QueueItem({ item, onAction }: { item: ModerationItem; onAction: () => void }) {
  return (
    <article className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        {item.author.avatar ? (
          <Image
            alt={item.author.name}
            className="size-11 rounded-sm border border-[#eadfca] object-cover"
            height={44}
            loading="eager"
            src={item.author.avatar}
            width={44}
          />
        ) : (
          <span className="grid size-11 place-items-center rounded-sm bg-amber-100 text-amber-800">
            <Icon name="User" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-900" title={item.author.name}>
            {item.author.name}
          </p>
          <p className="text-xs text-stone-500">Trust score {item.author.trustScore}</p>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-sm bg-amber-100 px-2 py-1 text-amber-900">{item.severity}</span>
          <span className="rounded-sm bg-stone-100 px-2 py-1 text-stone-600">{item.flagReason}</span>
        </div>
        <p className="mt-2 truncate text-sm text-stone-700" title={item.content}>
          {item.content}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer bg-emerald-100 text-emerald-900 transition duration-700 hover:bg-emerald-200"
          onClick={onAction}
          size="sm"
        >
          <Icon name="Check" /> Approve
        </Button>
        <Button
          className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:bg-red-200"
          onClick={onAction}
          size="sm"
        >
          <Icon name="X" /> Reject
        </Button>
      </div>
    </article>
  );
}
