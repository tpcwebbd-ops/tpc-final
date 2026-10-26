/*
|-----------------------------------------
| setting up the empty-workspace Leads demo data import
| @author: Codex
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGetLeadsDemoStateQuery, useSeedLeadsDemoMutation } from "@/redux/features/dashboard/leads/leadsSlice";

type ImportNotice = { error?: boolean; message: string };

function errorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "error" in error.data &&
    typeof error.data.error === "string"
  )
    return error.data.error;
  return error instanceof Error ? error.message : "Could not add the Leads demo data.";
}

export default function ImportLeads({ onNotice }: { onNotice: (notice: ImportNotice) => void }) {
  const [confirming, setConfirming] = useState(false);
  const { data } = useGetLeadsDemoStateQuery();
  const [seed, { isLoading }] = useSeedLeadsDemoMutation();
  if (!data?.available) return null;

  async function insertDemo() {
    try {
      const result = await seed().unwrap();
      setConfirming(false);
      onNotice({
        message: `${result.customers} demo customers, ${result.funnels} funnels, ${result.councilors} councilors, and ${result.notes} notes added.`,
      });
    } catch (error) {
      onNotice({ error: true, message: errorMessage(error) });
    }
  }

  return (
    <section className="rounded-sm border border-dashed border-amber-300 bg-amber-50/70 p-5 shadow-[0_2px_8px_rgba(120,80,30,0.035)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-sm border border-amber-200 bg-white text-amber-700">
            {iconMap.Database}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">Import Leads demo data</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
              Add a realistic Leads workspace to explore every Leads tab. This is available only while all Leads data is
              empty.
            </p>
          </div>
        </div>
        <Button
          className="cursor-pointer bg-amber-700 text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800"
          disabled={isLoading}
          onClick={() => setConfirming(true)}
          size="sm"
        >
          {iconMap.Plus}
          Add demo data
        </Button>
      </div>
      <div className="mt-4 grid gap-2 border-t border-amber-200/80 pt-4 text-xs text-stone-600 sm:grid-cols-4">
        <p>
          <strong className="text-stone-800">200</strong> demo customers
        </p>
        <p>
          <strong className="text-stone-800">5</strong> business funnels
        </p>
        <p>
          <strong className="text-stone-800">5</strong> councilors · 189 assigned, 11 unassigned
        </p>
        <p>
          <strong className="text-stone-800">200</strong> councilor-authored notes
        </p>
      </div>
      <AlertDialog
        open={confirming}
        title="Add Leads demo data?"
        description="This creates 200 customers with notes, 5 funnels, and 5 councilors. It can only run while all Leads data is empty."
        busy={isLoading}
        confirmLabel="Add demo data"
        busyLabel="Adding demo data…"
        onCancel={() => setConfirming(false)}
        onConfirm={() => void insertDemo()}
      />
    </section>
  );
}
