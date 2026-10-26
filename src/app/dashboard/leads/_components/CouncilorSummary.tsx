/*
|-----------------------------------------
| setting up councilor customer summary
| @author: Codex
|-----------------------------------------
*/

import type { LeadCouncilorSummaries } from "@/lib/dashboard/leads";

import CustomerPie from "./CustomerPie";
import { leadPanel } from "./presentation";
import { errorMessage } from "./ui";

export default function CouncilorSummary({
  data,
  isLoading,
  error,
  groupBy = "councilor",
}: {
  data?: LeadCouncilorSummaries;
  isLoading: boolean;
  error: unknown;
  groupBy?: "councilor" | "funnel";
}) {
  if (data) return <CustomerPie data={data} groupBy={groupBy} />;

  return (
    <section className={`${leadPanel} min-w-0 p-4 sm:p-5`} aria-label="Customer distribution">
      {isLoading ? (
        <p className="py-5 text-sm text-slate-500" role="status">
          Loading customer summary…
        </p>
      ) : error ? (
        <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errorMessage(error)}
        </p>
      ) : (
        <p className="py-5 text-sm text-slate-500">Customer summary is unavailable.</p>
      )}
    </section>
  );
}
