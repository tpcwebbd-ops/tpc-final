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

import { defaultDataSection42, defaultLayout, type Section42Data, type Section42Payload } from "./data";

const FileText = iconMap.FileText;
const ImageIcon = iconMap.Image;
const Palette = iconMap.Palette;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Type = iconMap.FileText;

export interface Section42FormProps {
  data?: Section42Data | Section42Payload;
  onChange?: (values: Section42Data | Section42Payload) => void;
  onSubmit?: (values: Section42Data | Section42Payload) => void;
}

const colorFields: Array<{
  field: "backgroundColor" | "headingColor" | "textColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Paragraph text" },
];

const MutationSection42 = ({ data, onChange }: Section42FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section42Payload = { ...defaultDataSection42, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section42Data>(() => ({
    ...initialPayload,
    paragraphs: [...initialPayload.paragraphs],
  }));
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

  const updateField = <K extends keyof Section42Data>(field: K, value: Section42Data[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    setFormData((current) => ({
      ...current,
      paragraphs: current.paragraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? value : paragraph)),
    }));
  };

  const addParagraph = () => {
    setFormData((current) => ({
      ...current,
      paragraphs: [...current.paragraphs, "Add your new paragraph here."],
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData((current) => ({
      ...current,
      paragraphs: current.paragraphs.filter((_, paragraphIndex) => paragraphIndex !== index),
    }));
  };

  const fieldClassName =
    "border-[#eadfca] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-[#eadfca] bg-white p-6">
          <div className="rounded-sm border border-indigo-500/20 bg-indigo-500/10 p-2.5">
            <FileText className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Study Destination Section</h2>
            <p className="text-sm text-slate-500">Manage the left image, right-side content, and section colors.</p>
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

                {formData.paragraphs.map((paragraph, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Paragraph {index + 1}</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeParagraph(index)}
                        className="h-8 w-8 cursor-pointer p-0 transition-all duration-700"
                        aria-label={`Remove paragraph ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={paragraph}
                      onChange={(event) => updateParagraph(index, event.target.value)}
                      className={`${fieldClassName} min-h-36 resize-y`}
                      rows={6}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addParagraph}
                  className="cursor-pointer border-amber-200 bg-amber-100 text-amber-900 transition-all duration-700 hover:bg-amber-200 hover:text-amber-950"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add paragraph
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <ImageIcon className="h-4 w-4" /> Left image
              </h3>
              <div className="space-y-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[#eadfca] bg-white">
                    {formData.imageUrl ? (
                      <Image
                        alt={formData.imageAlt || "Study destination preview"}
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
                    className="rounded-sm border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 transition-colors hover:bg-indigo-100"
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
            description="Select an existing section image or upload a new one."
            onSelect={(url) => {
              updateField("imageUrl", url);
              setMediaPickerOpen(false);
            }}
            title="Choose section image"
            uploadLabel="Upload section image"
          />
        )}
      </div>
    </div>
  );
};

export default MutationSection42;
