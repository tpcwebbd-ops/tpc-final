/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { MoveHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

import {
  defaultDataAboutTheCountry,
  defaultLayout,
  type AboutTheCountryPayload,
  type IAboutTheCountryData,
} from "./data";

export interface AboutTheCountryFormProps {
  data?: IAboutTheCountryData | AboutTheCountryPayload;
  onChange?: (values: AboutTheCountryPayload) => void;
}

const normalizeData = (data?: IAboutTheCountryData | AboutTheCountryPayload): AboutTheCountryPayload => ({
  ...defaultDataAboutTheCountry,
  ...defaultLayout,
  ...data,
  pageUid: "about-the-country-uid",
  pageName: "Home",
  sections: Array.isArray(data?.sections) ? data.sections : defaultDataAboutTheCountry.sections,
});

const MutationAboutTheCountry = ({ data, onChange }: AboutTheCountryFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IAboutTheCountryData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const nextData = normalizeData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX((current) => (current === nextData.paddingX ? current : nextData.paddingX));
    setPaddingY((current) => (current === nextData.paddingY ? current : nextData.paddingY));
  }, [data]);

  useEffect(() => {
    onChangeRef.current?.({
      ...formData,
      paddingX,
      paddingY,
      pageUid: "about-the-country-uid",
      pageName: "About the Country",
    });
  }, [formData, paddingX, paddingY]);
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };
  const updateSection = (index: number, field: "eyebrow" | "title" | "description" | "items", value: string) =>
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]:
                field === "items"
                  ? value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : value,
            }
          : section,
      ),
    }));
  const removeSection = () => {
    if (deleteIndex === null) return;
    setFormData((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== deleteIndex) }));
    setDeleteIndex(null);
    setToast("Section removed.");
  };
  return (
    <div className="custom-parent-border bg-white text-slate-800">
      <Toast message={toast} onDismiss={() => setToast("")} />
      <div className="mx-auto max-w-7xl border-x border-[#eadfca]">
        <header className="flex flex-col gap-3 border-b border-[#eadfca] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-stone-900">Edit Home Page</h2>
            <p className="truncate text-sm text-stone-600">about-the-country-uid · Content and feature sections</p>
          </div>
        </header>
        <ScrollArea className="max-h-[calc(100vh-12rem)] p-4">
          <div className="grid gap-4 pb-4 lg:grid-cols-2">
            <section className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="about-the-country-name">Page name</Label>
                  <Input
                    id="about-the-country-name"
                    value={formData.pageName}
                    onChange={(event) => setFormData((current) => ({ ...current, pageName: event.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="about-the-country-eyebrow">Eyebrow</Label>
                  <Input
                    id="about-the-country-eyebrow"
                    value={formData.eyebrow}
                    onChange={(event) => setFormData((current) => ({ ...current, eyebrow: event.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="about-the-country-title">Title</Label>
                <Input
                  id="about-the-country-title"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="about-the-country-subtitle">Subtitle</Label>
                <Textarea
                  id="about-the-country-subtitle"
                  value={formData.subtitle}
                  onChange={(event) => setFormData((current) => ({ ...current, subtitle: event.target.value }))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="about-the-country-primary">Primary action</Label>
                  <Input
                    id="about-the-country-primary"
                    value={formData.primaryAction}
                    onChange={(event) => setFormData((current) => ({ ...current, primaryAction: event.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="about-the-country-secondary">Secondary action</Label>
                  <Input
                    id="about-the-country-secondary"
                    value={formData.secondaryAction}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, secondaryAction: event.target.value }))
                    }
                  />
                </div>
              </div>
            </section>
            <section className="grid gap-4 rounded-sm border border-cyan-100 bg-cyan-50/60 p-4 lg:col-span-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MoveHorizontal className="inline-block" size={16} /> Section spacing
              </div>
              {(
                [
                  ["paddingX", "Padding X", paddingX],
                  ["paddingY", "Padding Y", paddingY],
                ] as const
              ).map(([field, label, value]) => (
                <div key={field} className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label>{label}</Label>
                    <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">
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
            {formData.sections.map((section, index) => (
              <section
                className="grid gap-3 rounded-sm border border-[#eadfca] p-4 lg:col-span-2"
                key={`${section.title}-${index}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate font-semibold text-stone-900">Section {index + 1}</h3>
                  <Button
                    aria-label={`Delete ${section.title}`}
                    className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:bg-red-200"
                    onClick={() => setDeleteIndex(index)}
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    {iconMap.Trash2} Delete
                  </Button>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`about-the-country-section-eyebrow-${index}`}>Eyebrow</Label>
                  <Input
                    id={`about-the-country-section-eyebrow-${index}`}
                    value={section.eyebrow}
                    onChange={(event) => updateSection(index, "eyebrow", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`about-the-country-section-title-${index}`}>Section title</Label>
                  <Input
                    id={`about-the-country-section-title-${index}`}
                    value={section.title}
                    onChange={(event) => updateSection(index, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`about-the-country-section-description-${index}`}>Section description</Label>
                  <Textarea
                    id={`about-the-country-section-description-${index}`}
                    value={section.description}
                    onChange={(event) => updateSection(index, "description", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`about-the-country-section-items-${index}`}>Points (one per line)</Label>
                  <Textarea
                    id={`about-the-country-section-items-${index}`}
                    value={section.items.join("\n")}
                    onChange={(event) => updateSection(index, "items", event.target.value)}
                  />
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
      <AlertDialog
        busy={false}
        description="This removes the section from the current editor."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={removeSection}
        open={deleteIndex !== null}
        title="Delete this section?"
      />
    </div>
  );
};
export default MutationAboutTheCountry;
