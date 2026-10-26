/*
|-----------------------------------------
| setting up customer distribution pie chart
| @author: Codex
|-----------------------------------------
*/

import { useState } from "react";

import type {
  LeadCouncilorSummaries,
  LeadOtherCustomerSummary,
  LeadCouncilorSummary,
  LeadStatus,
} from "@/lib/dashboard/leads";

import { leadPanel } from "./presentation";

const colors = ["#059669", "#d97706", "#2563eb", "#db2777", "#7c3aed", "#0891b2", "#ea580c", "#65a30d"];
type DistributionDetail = {
  id: string;
  name: string;
  customerCount: number;
  statuses: Record<LeadStatus, number>;
};
type DistributionEntry = {
  id: string;
  name: string;
  customerCount: number;
  customerStatuses: Record<LeadStatus, number>;
  details: DistributionDetail[];
};

function piePath(start: number, end: number) {
  const point = (angle: number) => ({ x: 110 + 94 * Math.cos(angle), y: 110 + 94 * Math.sin(angle) });
  const first = point(start);
  const last = point(end);
  if (end - start >= 2 * Math.PI - 0.000001) {
    const opposite = point(start + Math.PI);
    return `M 110 110 L ${first.x} ${first.y} A 94 94 0 1 1 ${opposite.x} ${opposite.y} A 94 94 0 1 1 ${first.x} ${first.y} Z`;
  }
  return `M 110 110 L ${first.x} ${first.y} A 94 94 0 ${end - start > Math.PI ? 1 : 0} 1 ${last.x} ${last.y} Z`;
}

export default function CustomerPie({
  data,
  groupBy = "councilor",
  showGroupByToggle = false,
  onGroupByChange,
}: {
  data: LeadCouncilorSummaries;
  groupBy?: "councilor" | "funnel";
  showGroupByToggle?: boolean;
  onGroupByChange?: (groupBy: "councilor" | "funnel") => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const councilorEntries: (LeadCouncilorSummary | LeadOtherCustomerSummary)[] = [
    ...[...data.others].sort((first, second) => Number(second.id === "unassigned") - Number(first.id === "unassigned")),
    ...data.items,
  ];
  const councilorDistributions: DistributionEntry[] = councilorEntries.map((councilor) => ({
    id: councilor.id,
    name: councilor.name,
    customerCount: councilor.customerCount,
    customerStatuses: councilor.customerStatuses,
    details: councilor.funnels.map((funnel) => ({ ...funnel, statuses: funnel.statuses })),
  }));
  const funnelDistributions = new Map<string, DistributionEntry>();
  councilorDistributions.forEach((councilor) => {
    councilor.details.forEach((funnel) => {
      const distribution = funnelDistributions.get(funnel.id) ?? {
        id: funnel.id,
        name: funnel.name,
        customerCount: 0,
        customerStatuses: { active: 0, inactive: 0 },
        details: [],
      };
      distribution.customerCount += funnel.customerCount;
      distribution.customerStatuses.active += funnel.statuses.active;
      distribution.customerStatuses.inactive += funnel.statuses.inactive;
      distribution.details.push({ ...funnel, id: councilor.id, name: councilor.name });
      funnelDistributions.set(funnel.id, distribution);
    });
  });
  const entries = groupBy === "funnel" ? Array.from(funnelDistributions.values()) : councilorDistributions;
  const total = entries.reduce((sum, entry) => sum + entry.customerCount, 0);
  const defaultEntry =
    groupBy === "councilor"
      ? entries.find((entry) => entry.id === data.items[0]?.id)
      : entries.find((entry) => entry.customerCount > 0) ?? entries[0];
  const visible =
    entries.find((entry) => entry.id === hovered) ??
    entries.find((entry) => entry.id === selected) ??
    defaultEntry ??
    entries.find((entry) => entry.customerCount > 0) ??
    entries[0];
  const visibleFunnels = visible?.details ?? [];
  const maxFunnelCount = Math.max(0, ...visibleFunnels.map((funnel) => funnel.customerCount));
  const funnelScaleMax = Math.max(4, Math.ceil(maxFunnelCount / 4) * 4);
  const funnelChartWidth = Math.max(360, visibleFunnels.length * 76 + 48);
  const funnelChartHeight = 168;
  const funnelChartLeft = 36;
  const funnelChartRight = 12;
  const funnelChartTop = 10;
  const funnelChartBottom = 30;
  const funnelPlotWidth = funnelChartWidth - funnelChartLeft - funnelChartRight;
  const funnelPlotHeight = funnelChartHeight - funnelChartTop - funnelChartBottom;
  let angle = -Math.PI / 2;
  const segments = entries.map((entry, index) => {
    const start = angle;
    angle += total ? (entry.customerCount / total) * Math.PI * 2 : 0;
    return { entry, start, end: angle, color: colors[index % colors.length] };
  });
  const chartHeight = Math.max(220, entries.length * 26 + 20);
  const centerY = chartHeight / 2;
  const labelStart = (chartHeight - entries.length * 26) / 2 + 13;

  function connector(start: number, end: number, labelY: number) {
    const middle = (start + end) / 2;
    const cosine = Math.cos(middle);
    const sine = Math.sin(middle);
    const edgeX = 110 + 94 * cosine;
    const edgeY = centerY + 94 * sine;
    const outerX = 110 + 105 * cosine;
    const outerY = centerY + 105 * sine;
    if (cosine >= 0) return `M ${edgeX} ${edgeY} L ${outerX} ${outerY} L 225 ${labelY} L 235 ${labelY}`;
    const lower = sine >= 0;
    const routeY = centerY + (lower ? 105 : -105);
    return `M ${edgeX} ${edgeY} L ${outerX} ${outerY} A 105 105 0 0 ${lower ? 0 : 1} 110 ${routeY} L 220 ${routeY} L 225 ${labelY} L 235 ${labelY}`;
  }

  return (
    <section className={`${leadPanel} min-w-0 p-4 sm:p-5`} aria-labelledby="customer-pie-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="customer-pie-title" className="text-sm font-semibold text-slate-900">
          {groupBy === "funnel" ? "Customer distribution by funnel" : "Customer distribution by councilor"}
        </h2>
        {showGroupByToggle && onGroupByChange && (
          <div className="flex rounded-sm border border-[#eadfca] bg-[#fffdf8] p-0.5" aria-label="Distribution breakdown">
            {(["councilor", "funnel"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={groupBy === value}
                className={`rounded-sm px-2.5 py-1.5 text-[11px] font-semibold capitalize ${groupBy === value ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50"}`}
                onClick={() => onGroupByChange(value)}
              >
                By {value}
              </button>
            ))}
          </div>
        )}
      </div>
      {total === 0 ? (
        <p className="py-6 text-sm text-slate-500">No customers to display yet.</p>
      ) : (
        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,1fr)]">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-slate-800">{total.toLocaleString()} customers</p>
            <svg
              viewBox={`0 0 500 ${chartHeight}`}
              className="mx-auto w-full max-w-[500px]"
              aria-label={`Customer distribution by ${groupBy}: ${total} customers`}
            >
              <g transform={`translate(0 ${centerY - 110})`}>
                {segments
                  .filter(({ entry }) => entry.customerCount > 0)
                  .map(({ entry, start, end, color }) => (
                    <path
                      key={entry.id}
                      d={piePath(start, end)}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      tabIndex={0}
                      role="button"
                      aria-label={`${entry.name}: ${entry.customerCount} customers`}
                      aria-pressed={visible?.id === entry.id}
                      className="cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus-visible:stroke-stone-900"
                      onMouseEnter={() => setHovered(entry.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(entry.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(entry.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelected(entry.id);
                        }
                      }}
                    >
                      <title>
                        {entry.name}: {entry.customerCount}
                      </title>
                    </path>
                  ))}
              </g>
              {segments.map(({ entry, start, end, color }, index) => {
                const labelY = labelStart + index * 26;
                return (
                  <g key={entry.id}>
                    {entry.customerCount > 0 && visible?.id === entry.id && (
                      <path
                        d={connector(start, end, labelY)}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.2"
                        opacity="0.8"
                        pointerEvents="none"
                      />
                    )}
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`${entry.name}: ${entry.customerCount} customers`}
                      aria-pressed={visible?.id === entry.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(entry.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(entry.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(entry.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelected(entry.id);
                        }
                      }}
                    >
                      <title>
                        {entry.name}: {entry.customerCount}
                      </title>
                      <rect
                        x="236"
                        y={labelY - 11}
                        width="260"
                        height="22"
                        rx="3"
                        fill={visible?.id === entry.id ? "#fffbeb" : "transparent"}
                      />
                      <circle cx="246" cy={labelY} r="4" fill={color} />
                      <text
                        x="257"
                        y={labelY + 4}
                        fill="#334155"
                        fontSize="12"
                        fontWeight={visible?.id === entry.id ? "600" : "400"}
                      >
                        {entry.name.length > 25 ? `${entry.name.slice(0, 24)}…` : entry.name}
                      </text>
                      <text x="489" y={labelY + 4} textAnchor="end" fill="#475569" fontSize="12">
                        {entry.customerCount.toLocaleString()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
          {visible && (
            <div className="min-w-0 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-3" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h3 className="break-words text-sm font-semibold text-slate-900">{visible.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <span className="tabular-nums text-slate-500">
                    {visible.customerCount.toLocaleString()} customers · {((visible.customerCount / total) * 100).toFixed(1)}%
                  </span>
                  <span className="whitespace-nowrap text-emerald-700">
                    Active <strong className="tabular-nums">{visible.customerStatuses.active.toLocaleString()}</strong>
                  </span>
                  <span className="whitespace-nowrap text-sky-800">
                    Inactive <strong className="tabular-nums">{visible.customerStatuses.inactive.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                {groupBy === "funnel" && (
                  <h4 className="mr-auto text-xs font-semibold text-slate-800">Customers by councilor</h4>
                )}
                {visibleFunnels.length ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500" aria-label="Chart legend">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-sm bg-emerald-500" aria-hidden="true" /> Active
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-sm bg-sky-700" aria-hidden="true" /> Inactive
                    </span>
                  </div>
                ) : null}
              </div>
              {visibleFunnels.length ? (
                <div className="mt-1 overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${funnelChartWidth} ${funnelChartHeight}`}
                      className="block h-auto w-full"
                      style={{ minWidth: `${funnelChartWidth}px` }}
                      role="img"
                      aria-label={`Grouped bar chart of active and inactive customers by ${groupBy === "funnel" ? "councilor" : "funnel"} for ${visible.name}`}
                    >
                      {[0, 1, 2, 3, 4].map((step) => {
                        const value = (funnelScaleMax / 4) * step;
                        const y = funnelChartTop + funnelPlotHeight * (1 - step / 4);

                        return (
                          <g key={step}>
                            <line
                              x1={funnelChartLeft}
                              x2={funnelChartWidth - funnelChartRight}
                              y1={y}
                              y2={y}
                              stroke="#e7e5e4"
                              strokeDasharray={step === 0 ? undefined : "3 4"}
                            />
                            <text
                              x={funnelChartLeft - 6}
                              y={y + 3}
                              textAnchor="end"
                              fill="#78716c"
                              fontSize="9"
                            >
                              {value.toLocaleString()}
                            </text>
                          </g>
                        );
                      })}
                      {visibleFunnels.map((funnel, index) => {
                        const slotWidth = funnelPlotWidth / visibleFunnels.length;
                        const centerX = funnelChartLeft + slotWidth * (index + 0.5);
                        const barWidth = Math.min(22, slotWidth * 0.28);
                        const activeHeight = (funnel.statuses.active / funnelScaleMax) * funnelPlotHeight;
                        const inactiveHeight = (funnel.statuses.inactive / funnelScaleMax) * funnelPlotHeight;
                        const baseY = funnelChartTop + funnelPlotHeight;
                        const label = funnel.name.length > 12 ? `${funnel.name.slice(0, 11)}…` : funnel.name;

                        return (
                          <g key={funnel.id}>
                            <rect
                              x={centerX - barWidth - 2}
                              y={baseY - activeHeight}
                              width={barWidth}
                              height={activeHeight}
                              rx="2"
                              fill="#10b981"
                              tabIndex={0}
                              role="img"
                              aria-label={`${funnel.name}: ${funnel.statuses.active} active customers`}
                            >
                              <title>{`${funnel.name} · Active: ${funnel.statuses.active.toLocaleString()}`}</title>
                            </rect>
                            <rect
                              x={centerX + 2}
                              y={baseY - inactiveHeight}
                              width={barWidth}
                              height={inactiveHeight}
                              rx="2"
                              fill="#0369a1"
                              tabIndex={0}
                              role="img"
                              aria-label={`${funnel.name}: ${funnel.statuses.inactive} inactive customers`}
                            >
                              <title>{`${funnel.name} · Inactive: ${funnel.statuses.inactive.toLocaleString()}`}</title>
                            </rect>
                            <text
                              x={centerX}
                              y={baseY + 16}
                              textAnchor="middle"
                              fill="#475569"
                              fontSize="9"
                            >
                              <title>{funnel.name}</title>
                              {label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  No {groupBy === "funnel" ? "councilors" : "funnels"} available.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
