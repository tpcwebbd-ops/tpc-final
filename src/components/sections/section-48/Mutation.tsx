/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { defaultDataSection48, defaultLayout, type Section48Data, type Section48Payload } from "./data";

const Stamp = iconMap.Award;
const Type = iconMap.FileText;

export interface Section48FormProps {
  data?: Section48Data | Section48Payload;
  onChange?: (values: Section48Payload) => void;
}

const normalizeData = (data?: Section48Data | Section48Payload): Section48Payload => ({
  ...defaultDataSection48,
  ...defaultLayout,
  ...(data || {}),
});

const MutationSection48 = ({ data, onChange }: Section48FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<Section48Data>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateField = (field: keyof Section48Data, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const fieldClass =
    "h-12 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#cf0a2c]";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 sm:p-5 lg:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="border-b border-[#eadfca] p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#cf0a2c]">Section 48</p>
          <h2 className="mt-2 text-2xl font-black">Bangla heading and trust stamp</h2>
          <p className="mt-2 text-sm text-slate-500">
            Only the Bangla heading and stamp text are editable. The globe, consultation form, layout, and animation
            stay fixed.
          </p>
        </header>

        <div className="grid gap-5 p-5 sm:p-7">
          <section className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-5">
            <h3 className="flex items-center gap-2 font-bold">
              <Type className="h-4 w-4 text-[#ef4765]" /> Bangla text
            </h3>

            <div className="space-y-2">
              <Label htmlFor="section-48-bangla-line-one">First line</Label>
              <Input
                id="section-48-bangla-line-one"
                value={formData.banglaFirstLine}
                onChange={(event) => updateField("banglaFirstLine", event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section-48-bangla-line-two">Second line</Label>
              <Input
                id="section-48-bangla-line-two"
                value={formData.banglaSecondLine}
                onChange={(event) => updateField("banglaSecondLine", event.target.value)}
                className={fieldClass}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-5">
            <h3 className="flex items-center gap-2 font-bold">
              <Stamp className="h-4 w-4 text-[#ef4765]" /> Circle stamp
            </h3>

            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="section-48-stamp-value">Center text</Label>
                <Input
                  id="section-48-stamp-value"
                  value={formData.stampValue}
                  onChange={(event) => updateField("stampValue", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-48-stamp-text">Circular text</Label>
                <Input
                  id="section-48-stamp-text"
                  value={formData.stampText}
                  onChange={(event) => updateField("stampText", event.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-sm border border-rose-100 bg-rose-50/60 p-5">
            <h3 className="flex items-center gap-2 font-bold">
              <Type className="h-4 w-4 text-[#cf0a2c]" /> Section spacing
            </h3>
            {(
              [
                ["paddingX", "Padding X", paddingX],
                ["paddingY", "Padding Y", paddingY],
              ] as const
            ).map(([field, label, value]) => (
              <div key={field} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>{label}</Label>
                  <span className="rounded-full bg-[#cf0a2c] px-2.5 py-1 text-xs font-semibold text-white">
                    {value}px
                  </span>
                </div>
                <Slider
                  min={-300}
                  max={300}
                  step={1}
                  value={[value]}
                  onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
                  aria-label={label}
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>-300px</span>
                  <span>0px</span>
                  <span>+300px</span>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MutationSection48;
