/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| Study Abroad experience hero editor for Section 37
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection37, defaultLayout, type Section37Data, type Section37Payload } from "./data";

const LayoutTemplate = iconMap.Layout;
const Link2 = iconMap.Link;
const Palette = iconMap.Palette;
const Type = iconMap.FileText;

export interface Section37FormProps {
  data?: Section37Data | Section37Payload;
  onChange?: (values: Section37Data | Section37Payload) => void;
  onSubmit?: (values: Section37Data | Section37Payload) => void;
}

const colorFields: { field: keyof Section37Data; label: string }[] = [
  { field: "backgroundColor", label: "Background" },
  { field: "gridColor", label: "Grid lines" },
  { field: "headingColor", label: "Heading" },
  { field: "accentColor", label: "Accent" },
  { field: "descriptionColor", label: "Description" },
];

const MutationSection37 = ({ data, onChange }: Section37FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section37Payload = { ...defaultDataSection37, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section37Data>(() => ({ ...initialPayload }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateField = <Field extends keyof Section37Data>(field: Field, value: Section37Data[Field]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const fieldClassName =
    "border-[#eadfca] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-red-600";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-[#eadfca] bg-white p-6">
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-2.5">
            <LayoutTemplate className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Study Abroad Hero</h2>
            <p className="text-sm text-slate-500">
              Update the Bangla and English content, calls to action, and colors.
            </p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <Type className="h-4 w-4" /> Heading and description
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Bangla experience heading</Label>
                <Input
                  value={formData.titleLineOne}
                  onChange={(event) => updateField("titleLineOne", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>English service heading</Label>
                <Input
                  value={formData.titleEnglish}
                  onChange={(event) => updateField("titleEnglish", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Bangla heading suffix</Label>
                <Input
                  value={formData.titleEnglishSuffix}
                  onChange={(event) => updateField("titleEnglishSuffix", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Highlighted Bangla heading</Label>
                <Input
                  value={formData.titleHighlight}
                  onChange={(event) => updateField("titleHighlight", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Bangla description lead</Label>
                <Input
                  value={formData.descriptionLead}
                  onChange={(event) => updateField("descriptionLead", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Experience badge (start with a number)</Label>
                <Input
                  value={formData.descriptionAccent}
                  onChange={(event) => updateField("descriptionAccent", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Short description</Label>
                <Textarea
                  value={formData.descriptionTail}
                  onChange={(event) => updateField("descriptionTail", event.target.value)}
                  className={`${fieldClassName} min-h-28 resize-y`}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#eadfca]" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <Link2 className="h-4 w-4" /> Calls to action
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary button text</Label>
                <Input
                  value={formData.primaryButtonText}
                  onChange={(event) => updateField("primaryButtonText", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary button link</Label>
                <Input
                  value={formData.primaryButtonLink}
                  onChange={(event) => updateField("primaryButtonLink", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary button text</Label>
                <Input
                  value={formData.secondaryButtonText}
                  onChange={(event) => updateField("secondaryButtonText", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary button link</Label>
                <Input
                  value={formData.secondaryButtonLink}
                  onChange={(event) => updateField("secondaryButtonLink", event.target.value)}
                  className={fieldClassName}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#eadfca]" />

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <Palette className="h-4 w-4" /> Colors
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-sm border border-[#eadfca] bg-white p-1"
                      aria-label={`${label} color`}
                    />
                    <Input
                      value={formData[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mx-6 rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4 md:mx-8">
          <div className="flex items-start md:items-center justify-start md:justify-between flex-col md:flex-row gap-2">
            <div>
              <h3 className="font-bold text-slate-900">Section spacing</h3>
              <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
            </div>
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              -300 to +300 px
            </span>
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
                  <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">
                    {value}px
                  </span>
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
      </div>
    </div>
  );
};

export default MutationSection37;
