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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection40, defaultLayout, type Section40Data, type Section40Payload } from "./data";

const CalendarDays = iconMap.Calendar;
const ImageIcon = iconMap.Image;
const Link2 = iconMap.Link;
const Palette = iconMap.Palette;
const Type = iconMap.FileText;

export interface Section40FormProps {
  data?: Section40Data | Section40Payload | string;
  onChange?: (values: Section40Data | Section40Payload) => void;
  onSubmit?: (values: Section40Data | Section40Payload) => void;
}

const imageFields: Array<{ field: "onlineAppointmentImage" | "physicalAppointmentImage"; label: string }> = [
  { field: "onlineAppointmentImage", label: "Online appointment image" },
  { field: "physicalAppointmentImage", label: "Physical appointment image" },
];

const colorFields: Array<{
  field: "backgroundColor" | "headingColor" | "accentColor" | "textColor" | "buttonColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "headingColor", label: "Heading" },
  { field: "accentColor", label: "Accent" },
  { field: "textColor", label: "Description" },
  { field: "buttonColor", label: "Button" },
];

const getFormData = (data?: Section40Data | Section40Payload | string): Section40Data => {
  let parsedData: Partial<Section40Payload> = {};

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data) as Partial<Section40Data>;
    } catch {
      parsedData = {};
    }
  } else if (data) {
    parsedData = data;
  }

  return {
    ...defaultDataSection40,
    ...parsedData,
    paragraphs: Array.isArray(parsedData.paragraphs)
      ? [...parsedData.paragraphs]
      : [...defaultDataSection40.paragraphs],
  };
};

const getPayloadData = (data?: Section40Data | Section40Payload | string): Section40Payload => {
  let parsedData: Partial<Section40Payload> = {};
  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data) as Partial<Section40Payload>;
    } catch {
      parsedData = {};
    }
  } else if (data) {
    parsedData = data;
  }
  return { ...defaultDataSection40, ...defaultLayout, ...parsedData };
};

const MutationSection40 = ({ data, onChange }: Section40FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = getPayloadData(data);
  const [formData, setFormData] = useState<Section40Data>(() => getFormData(data));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeImageField, setActiveImageField] = useState<(typeof imageFields)[number]["field"] | null>(null);

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

  const updateField = <K extends keyof Section40Data>(field: K, value: Section40Data[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    setFormData((current) => ({
      ...current,
      paragraphs: current.paragraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? value : paragraph)),
    }));
  };

  const fieldClassName =
    "border-[#eadfca] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-[#eadfca] bg-white p-6">
          <div className="rounded-sm border border-blue-500/20 bg-blue-500/10 p-2.5">
            <CalendarDays className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Appointment Section</h2>
            <p className="text-sm text-slate-500">Update the content, actions, images, and colors.</p>
          </div>
        </header>

        <div className="grid gap-8 p-6 md:p-8">
          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Type className="h-4 w-4" /> Content
              </h3>
              <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 rounded-sm border border-[#eadfca] bg-white p-3">
                    <div>
                      <Label>Eyebrow</Label>
                      <p className="mt-1 text-xs text-slate-500">Show or hide the eyebrow on the public section.</p>
                    </div>
                    <Switch
                      aria-label="Show eyebrow"
                      checked={formData.showEyebrow !== false}
                      onCheckedChange={(checked) => updateField("showEyebrow", checked)}
                    />
                  </div>
                  <Label>Eyebrow text</Label>
                  <Input
                    value={formData.eyebrow}
                    onChange={(event) => updateField("eyebrow", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                      value={formData.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted heading</Label>
                    <Input
                      value={formData.highlightedTitle}
                      onChange={(event) => updateField("highlightedTitle", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                </div>
                {formData.paragraphs.map((paragraph, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Paragraph {index + 1}</Label>
                    <Textarea
                      value={paragraph}
                      onChange={(event) => updateParagraph(index, event.target.value)}
                      className={`${fieldClassName} min-h-36 resize-y`}
                      rows={6}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Link2 className="h-4 w-4" /> Actions
              </h3>
              <div className="grid gap-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary button</Label>
                    <Input
                      value={formData.primaryButtonText}
                      onChange={(event) => updateField("primaryButtonText", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary URL</Label>
                    <Input
                      value={formData.primaryButtonUrl}
                      onChange={(event) => updateField("primaryButtonUrl", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Secondary button</Label>
                    <Input
                      value={formData.secondaryButtonText}
                      onChange={(event) => updateField("secondaryButtonText", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary URL</Label>
                    <Input
                      value={formData.secondaryButtonUrl}
                      onChange={(event) => updateField("secondaryButtonUrl", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <ImageIcon className="h-4 w-4" /> Appointment images
              </h3>
              <div className="space-y-5">
                {imageFields.map(({ field, label }) => (
                  <div key={field} className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
                    <Label className="mb-3 block">{label}</Label>
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[#eadfca] bg-white">
                        {formData[field] ? (
                          <Image alt={`${label} preview`} className="object-contain p-3" fill src={formData[field]} />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">
                            <ImageIcon className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <button
                        className="rounded-sm border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100"
                        onClick={() => setActiveImageField(field)}
                        type="button"
                      >
                        Edit image
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-400">
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

        {activeImageField && (
          <ImagePickerModal
            close={() => setActiveImageField(null)}
            description="Select an existing appointment image or upload a new one."
            onSelect={(url) => {
              updateField(activeImageField, url);
              setActiveImageField(null);
            }}
            title="Choose appointment image"
            uploadLabel="Upload appointment image"
          />
        )}
      </div>
    </div>
  );
};

export default MutationSection40;
