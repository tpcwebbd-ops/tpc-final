/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August, 2026
|-----------------------------------------
*/

"use client";

import { RotateCcw, SlidersHorizontal, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { defaultDataSection1, type Section1Data } from "./data";
import { RichTextEditor } from "./RichTextEditor";

const clampSpacing = (value: string | undefined) => Math.min(300, Math.max(-300, Number(value) || 0));

export default function Mutation({
  data = defaultDataSection1,
  onChange,
}: {
  data?: Section1Data;
  onChange: (data: Section1Data) => void;
}) {
  const formData = { ...defaultDataSection1, ...data };
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    onChange({ ...formData, [field]: String(clampSpacing(String(value))) });
  };

  return (
    <section className="custom-parent-border mx-auto grid w-full max-w-7xl overflow-hidden bg-white text-slate-800 shadow-sm lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="min-w-0 bg-white p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Type className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Section content</p>
              <p className="text-xs text-slate-500">Create readable, polished page copy.</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
            Rich text
          </span>
        </div>
        <RichTextEditor value={formData.content ?? ""} onChange={(content) => onChange({ ...formData, content })} />
      </div>

      <aside className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-6 lg:border-l lg:border-t-0">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-700">
              <SlidersHorizontal className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Layout controls</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">Tune the section breathing room from the editor.</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-sm border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() =>
              onChange({ ...formData, paddingX: defaultDataSection1.paddingX, paddingY: defaultDataSection1.paddingY })
            }
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>

        <div className="space-y-6">
          {(["paddingX", "paddingY"] as const).map((field) => {
            const value = clampSpacing(formData[field]);
            const label = field === "paddingX" ? "Padding X" : "Padding Y";
            return (
              <div key={field} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Label className="text-sm font-semibold text-slate-800">{label}</Label>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-700">
                    {value}px
                  </span>
                </div>
                <Slider
                  aria-label={label}
                  min={-300}
                  max={300}
                  step={1}
                  value={[value]}
                  onValueChange={([nextValue]) => updateSpacing(field, nextValue ?? 0)}
                  className="accent-blue-600"
                />
                <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                  <span>-300px</span>
                  <span>0</span>
                  <span>+300px</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 border-l-2 border-amber-300 pl-3 text-[11px] leading-4 text-slate-500">
          Negative padding values are accepted for editing, but the live preview clamps them to 0px because CSS padding
          cannot be negative.
        </p>
      </aside>
    </section>
  );
}
