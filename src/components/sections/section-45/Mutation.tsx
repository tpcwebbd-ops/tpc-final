/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection45, defaultLayout, type Section45Data, type Section45Payload } from "./data";

const FileCheck2 = iconMap.FileSignature;
const ImageIcon = iconMap.Image;
const Palette = iconMap.Palette;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Type = iconMap.FileText;

export interface Section45FormProps {
  data?: Section45Data | Section45Payload;
  onChange?: (values: Section45Data | Section45Payload) => void;
}

const cloneData = (data: Section45Data): Section45Data => ({
  ...data,
  documents: data.documents.map((document) => ({ ...document })),
});

const normalizeData = (data?: Section45Data | Section45Payload): Section45Data => {
  if (!data) return cloneData(defaultDataSection45);
  return {
    ...defaultDataSection45,
    ...data,
    documents: Array.isArray(data.documents)
      ? data.documents.map((document) => ({ ...document }))
      : defaultDataSection45.documents.map((document) => ({ ...document })),
  };
};

const colorFields: Array<{
  field: "backgroundColor" | "headingColor" | "textColor" | "accentColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Body text" },
  { field: "accentColor", label: "Check marks" },
];

const MutationSection45 = ({ data, onChange }: Section45FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section45Payload = { ...defaultDataSection45, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section45Data>(() => normalizeData(data));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

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

  const updateField = <K extends keyof Section45Data>(field: K, value: Section45Data[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateDocument = (id: string, text: string) => {
    setFormData((current) => ({
      ...current,
      documents: current.documents.map((document) => (document.id === id ? { ...document, text } : document)),
    }));
  };

  const addDocument = () => {
    updateField("documents", [
      ...formData.documents,
      {
        id: `document-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: "Add a required document.",
      },
    ]);
  };

  const removeDocument = (id: string) => {
    updateField(
      "documents",
      formData.documents.filter((document) => document.id !== id),
    );
  };

  const fieldClassName =
    "border-[#eadfca] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-fuchsia-500";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-[#eadfca] bg-white p-6">
          <div className="rounded-sm border border-fuchsia-500/20 bg-fuchsia-500/10 p-2.5">
            <FileCheck2 className="h-6 w-6 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Essential Visa Documents Section</h2>
            <p className="text-sm text-slate-500">
              Manage the section heading, checklist, university image, and colors.
            </p>
          </div>
        </header>

        <div className="grid gap-8 p-6 md:p-8">
          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Type className="h-4 w-4" /> Content
              </h3>
              <div className="space-y-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={formData.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Introduction</Label>
                  <Textarea
                    value={formData.introduction}
                    onChange={(event) => updateField("introduction", event.target.value)}
                    className={`${fieldClassName} min-h-36 resize-y`}
                    rows={6}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  <FileCheck2 className="h-4 w-4" /> Document checklist
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                  className="cursor-pointer border-amber-200 bg-amber-100 text-amber-900 transition-all duration-700 hover:bg-amber-200 hover:text-amber-950"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add document
                </Button>
              </div>
              <div className="space-y-3">
                {formData.documents.map((document, index) => (
                  <div
                    key={document.id}
                    className="flex items-start gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <Label>Document {index + 1}</Label>
                      <Textarea
                        value={document.text}
                        onChange={(event) => updateDocument(document.id, event.target.value)}
                        className={`${fieldClassName} min-h-36 resize-y`}
                        rows={6}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeDocument(document.id)}
                      className="mt-6 h-8 w-8 shrink-0 cursor-pointer p-0 transition-all duration-700"
                      aria-label={`Remove document ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <ImageIcon className="h-4 w-4" /> University image
              </h3>
              <div className="space-y-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[#eadfca] bg-white">
                    {formData.imageUrl ? (
                      <Image
                        alt={formData.imageAlt || "University image preview"}
                        className="object-cover"
                        fill
                        src={formData.imageUrl}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <button
                    className="rounded-sm border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-medium text-fuchsia-900 transition-colors hover:bg-fuchsia-100"
                    onClick={() => setMediaPickerOpen(true)}
                    type="button"
                  >
                    Edit image
                  </button>
                </div>
                <div className="space-y-2">
                  <Label>Image alternative text</Label>
                  <Input
                    value={formData.imageAlt}
                    onChange={(event) => updateField("imageAlt", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Palette className="h-4 w-4" /> Colors
              </h3>
              <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                {colorFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-sm border border-[#eadfca] bg-white p-1"
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
          <div className="grid grid-cols-1 gap-4">
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
                <Input
                  aria-label={`${label} manual value`}
                  className={fieldClassName}
                  max={300}
                  min={-300}
                  onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                  step={1}
                  type="number"
                  value={value}
                />
              </div>
            ))}
          </div>
        </section>

        {mediaPickerOpen && (
          <ImagePickerModal
            close={() => setMediaPickerOpen(false)}
            description="Select an existing university image or upload a new one."
            onSelect={(url) => {
              updateField("imageUrl", url);
              setMediaPickerOpen(false);
            }}
            title="Choose university image"
            uploadLabel="Upload university image"
          />
        )}
      </div>
    </div>
  );
};

export default MutationSection45;
