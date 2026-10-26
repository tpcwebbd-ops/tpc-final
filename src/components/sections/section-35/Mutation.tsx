/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { defaultDataSection35, Section35Data, Section35Payload, defaultLayout } from "./data";

export interface SectionFormProps {
  data?: Section35Data | Section35Payload;
  onChange?: (values: Section35Data | Section35Payload) => void;
  onSubmit?: (values: Section35Data | Section35Payload) => void;
}

const inputClass = "w-full rounded-sm border border-[#eadfca] bg-white text-sm focus-visible:ring-amber-200";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500";
const MutationSection35 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section35Payload = { ...defaultDataSection35, ...defaultLayout, ...(data || {}) };
  const [settings, setSettings] = useState<Section35Data>(() => ({ ...initialPayload }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...settings, paddingX, paddingY });
  }, [settings, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  return (
    <div className="custom-parent-border mx-auto max-w-7xl space-y-6 border-x border-[#eadfca] bg-white p-4 text-stone-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-stone-900">Edit Banner</h2>
          <p className="text-sm text-stone-600">Section 35 banner content</p>
        </div>
      </div>

      <section className="rounded-sm border border-[#eadfca] bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className={labelClass}>Banner Text</Label>
            <Input
              value={settings.text}
              onChange={(e) => setSettings((prev) => ({ ...prev, text: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <Label className={labelClass}>Link</Label>
            <Input
              value={settings.link}
              onChange={(e) => setSettings((prev) => ({ ...prev, link: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Gradient From</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.gradientFrom}
                onChange={(e) => setSettings((prev) => ({ ...prev, gradientFrom: e.target.value }))}
                className="h-10 w-12 rounded-sm border border-slate-200"
              />
              <input
                value={settings.gradientFrom}
                onChange={(e) => setSettings((prev) => ({ ...prev, gradientFrom: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Gradient To</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.gradientTo}
                onChange={(e) => setSettings((prev) => ({ ...prev, gradientTo: e.target.value }))}
                className="h-10 w-12 rounded-sm border border-slate-200"
              />
              <input
                value={settings.gradientTo}
                onChange={(e) => setSettings((prev) => ({ ...prev, gradientTo: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Section spacing</h3>
            <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
          </div>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">-300 to +300 px</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(
            [
              ["paddingX", paddingX, setPaddingX, "Padding X"],
              ["paddingY", paddingY, setPaddingY, "Padding Y"],
            ] as const
          ).map(([field, value, setter, label]) => (
            <div key={field} className="rounded-sm border border-white bg-white p-3 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
                <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">{value}px</span>
              </div>
              <Slider
                min={-300}
                max={300}
                step={1}
                value={[value]}
                onValueChange={([next]) => {
                  setter(next);
                  updateSpacing(field, next);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section
        className="cursor-pointer select-none rounded-sm border border-[#eadfca] px-4 py-5 text-center text-lg font-extrabold tracking-wide text-white transition-all duration-700 hover:opacity-95 sm:text-xl"
        style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})` }}
      >
        {settings.text}
      </section>
    </div>
  );
};

export default MutationSection35;
