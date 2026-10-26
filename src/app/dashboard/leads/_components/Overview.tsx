/*
|-----------------------------------------
| setting up Leads overview and monthly graphs
| @author: Codex
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { toast } from "@/components/ui/global-toast";
import { leadCan, leadIsManager } from "@/lib/dashboard/leads";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";
import {
  useGetLeadsCouncilorSummariesQuery,
  useGetLeadsOverviewQuery,
} from "@/redux/features/dashboard/leads/leadsSlice";

import CustomerPie from "./CustomerPie";
import { leadPanel, leadPresentation } from "./presentation";
import {
  Action,
  EmptyState,
  errorMessage,
  LeadsSkeleton,
  PageHeading,
  Pagination,
  useRefreshCooldown,
} from "./ui";

function ChartHeading({ title, description, icon }: { title: string; description?: string; icon: string }) {
  return (
    <div className="flex items-start gap-3 px-5 pt-5 pb-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-amber-100 bg-amber-50 text-amber-700">
        <Icon name={icon} className="size-4" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
    timeZone: "Asia/Dhaka",
  });
function MonthlyChart({
  title,
  months,
  series,
}: {
  title: string;
  months: string[];
  series: { label: string; color: string; values: number[] }[];
}) {
  const [valuePage, setValuePage] = useState(1);
  const [valueSize, setValueSize] = useState(10);
  const max = Math.ceil(Math.max(4, ...series.flatMap((entry) => entry.values)) / 4) * 4;
  const width = 660,
    height = 220,
    left = 42,
    bottom = 30,
    top = 16;
  const plotWidth = width - left - 10,
    plotHeight = height - bottom - top;
  const step = plotWidth / Math.max(1, months.length);
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 pb-3 text-[11px] text-slate-500">
        {series.map((entry) => (
          <span key={entry.label} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm" style={{ background: entry.color }} />
            {entry.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto px-3 pb-3">
        <svg aria-label={title} role="img" viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[480px]">
          <title>{title}</title>
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <g key={fraction}>
              <line
                x1={left}
                x2={width - 10}
                y1={top + (1 - fraction) * plotHeight}
                y2={top + (1 - fraction) * plotHeight}
                stroke="#f1eadc"
                strokeDasharray={fraction ? "4 4" : undefined}
              />
              <text
                x={left - 5}
                y={top + (1 - fraction) * plotHeight + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
              >
                {Math.round(max * fraction).toLocaleString("en", { notation: "compact" })}
              </text>
            </g>
          ))}
          {months.map((month, index) => (
            <g key={month}>
              {series.map((entry, seriesIndex) => {
                const barWidth = Math.max(3, Math.min(24, (step - 12) / series.length)),
                  value = entry.values[index] ?? 0,
                  barHeight = (value / max) * plotHeight;
                return (
                  <rect
                    key={entry.label}
                    x={left + index * step + (step - barWidth * series.length) / 2 + seriesIndex * barWidth}
                    y={top + plotHeight - barHeight}
                    width={barWidth - 2}
                    height={barHeight}
                    fill={entry.color}
                    rx={2}
                    opacity={0.9}
                  >
                    <title>
                      {monthLabel(month)} · {entry.label}: {value}
                    </title>
                  </rect>
                );
              })}
              <text x={left + (index + 0.5) * step} y={height - 10} textAnchor="middle" fontSize="9" fill="#64748b">
                {monthLabel(month)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <details className="border-t border-[#eadfca] bg-[#fffdf7] px-5 py-3 text-xs text-slate-500">
        <summary className="cursor-pointer font-semibold hover:text-amber-800">View chart values</summary>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left [&_td]:py-2 [&_th]:py-2 [&_th]:font-medium">
            <thead>
              <tr>
                <th className="py-2">Month</th>
                {series.map((entry) => (
                  <th key={entry.label}>{entry.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.slice((valuePage - 1) * valueSize, valuePage * valueSize).map((month, index) => (
                <tr key={month} className="border-t border-[#eadfca]">
                  <td className="py-1">{monthLabel(month)}</td>
                  {series.map((entry) => (
                    <td key={entry.label}>{entry.values[(valuePage - 1) * valueSize + index] ?? 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {months.length > 10 && (
          <Pagination
            page={valuePage}
            total={months.length}
            pageSize={valueSize}
            onPage={setValuePage}
            onSize={(size) => {
              setValueSize(size);
              setValuePage(1);
            }}
          />
        )}
      </details>
    </div>
  );
}
export default function Overview() {
  const { can } = useDashboardPermissions("/dashboard/leads/overview");
  const { data, isLoading, isFetching, error, refetch } = useGetLeadsOverviewQuery(undefined, { skip: !can("read") });
  const canViewDistribution = Boolean(
    data?.actor && leadIsManager(data.actor) && leadCan(data.actor, "councilors", "read"),
  );
  const {
    data: distributionData,
    isLoading: distributionLoading,
    error: distributionError,
  } = useGetLeadsCouncilorSummariesQuery(undefined, { skip: !canViewDistribution });
  const cooldown = useRefreshCooldown();
  const [distributionGroup, setDistributionGroup] = useState<"councilor" | "funnel">("councilor");
  const months = data?.months.map((item) => item.month) ?? [];
  const panel = leadPanel;
  async function refresh() {
    cooldown.start();
    try {
      await refetch().unwrap();
      toast.success("Overview refreshed.");
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  }
  return (
    <section className="grid min-w-0 gap-5">
      <PageHeading title="Leads overview" icon="BarChart" iconClass={leadPresentation.overview.iconClass}>
        <Action disabled={!can("read") || isFetching || Boolean(cooldown.remaining)} onClick={refresh}>
          <Icon name="RefreshCw" className={isFetching ? "animate-spin" : ""} />
          {cooldown.remaining ? `Refresh (${cooldown.remaining}s)` : "Refresh"}
        </Action>
      </PageHeading>
      {!can("read") ? (
        <div className={panel}>
          <EmptyState
            icon="Lock"
            title="Read access required"
            description="Read permission is required to display the overview."
          />
        </div>
      ) : error ? (
        <div className={panel} role="alert">
          <EmptyState icon="AlertCircle" title="Could not load overview" description={errorMessage(error)} />
        </div>
      ) : isLoading || !data ? (
        <LeadsSkeleton />
      ) : (
        <>
          {canViewDistribution ? (
            distributionData ? (
              <CustomerPie
                key={distributionGroup}
                data={distributionData}
                groupBy={distributionGroup}
                showGroupByToggle
                onGroupByChange={setDistributionGroup}
              />
            ) : (
              <section className={panel}>
                <ChartHeading title="Customer distribution" icon="PieChart" />
                {distributionLoading ? (
                  <p className="px-5 pb-5 text-sm text-slate-500" role="status">
                    Loading customer distribution…
                  </p>
                ) : distributionError ? (
                  <p className="mx-5 mb-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {errorMessage(distributionError)}
                  </p>
                ) : (
                  <EmptyState icon="PieChart" title="Customer distribution unavailable" />
                )}
              </section>
            )
          ) : (
            <section className={panel}>
              <ChartHeading title="Customer distribution" icon="PieChart" />
              <MonthlyChart
                title="Active and inactive customers by creation month"
                months={months}
                series={[
                  { label: "Active", color: "#059669", values: data.months.map((item) => item.active) },
                  { label: "Inactive", color: "#e11d48", values: data.months.map((item) => item.inactive) },
                ]}
              />
            </section>
          )}
          <section aria-label="Summary" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "All customers",
                value: data.summary.all,
                icon: "Users",
                color: "border-sky-100 bg-sky-50 text-sky-700",
              },
              {
                label: "New in 30 days",
                value: data.summary.new30Days,
                icon: "TrendingUp",
                color: "border-amber-100 bg-amber-50 text-amber-700",
              },
              {
                label: "Active customers",
                value: data.summary.active,
                icon: "Activity",
                color: "border-emerald-100 bg-emerald-50 text-emerald-700",
              },
              {
                label: "Inactive customers",
                value: data.summary.inactive,
                icon: "Clock",
                color: "border-stone-200 bg-stone-50 text-stone-500",
              },
            ].map((card) => (
              <div key={card.label} className={`${panel} group relative overflow-hidden p-5`}>
                <span aria-hidden="true" className="absolute -right-5 -bottom-6 size-20 rounded-full bg-amber-50" />
                <div className="flex items-center justify-between gap-2">
                  <span className="relative text-xs font-semibold text-slate-500">{card.label}</span>
                  <span className={`relative grid size-10 shrink-0 place-items-center rounded-sm border ${card.color}`}>
                    <Icon name={card.icon} className="size-4" />
                  </span>
                </div>
                <p className="relative mt-3 text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
                  {card.value.toLocaleString()}
                </p>
              </div>
            ))}
          </section>
          <section aria-label="Overview navigation" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Funnels", path: "funnels", icon: "Filter", count: data.counts.funnels },
              { label: "Customers", path: "customers", icon: "Users", count: data.counts.customers },
              { label: "Councilors", path: "councilors", icon: "User", count: data.counts.councilors },
              { label: "My Leads", path: "my-leads", icon: "FileText", count: data.counts.mine },
            ].map((card) => (
              <Link
                key={card.path}
                href={`/dashboard/leads/${card.path}`}
                className="group flex items-center gap-3 rounded-sm border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none transition duration-700 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/60 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none"
              >
                <Icon name={card.icon} className="size-4 shrink-0 text-amber-700" />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2 text-xs font-semibold text-slate-600">
                  {card.label}{" "}
                  <strong className="text-sm text-slate-900 tabular-nums">{card.count.toLocaleString()}</strong>
                </span>
                <Icon
                  name="ChevronRight"
                  className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </section>
        </>
      )}
      {isFetching && !isLoading && (
        <p role="status" className="flex items-center gap-2 text-xs text-amber-800">
          <Icon name="RefreshCw" className="size-3 animate-spin" />
          Refreshing overview…
        </p>
      )}
    </section>
  );
}
