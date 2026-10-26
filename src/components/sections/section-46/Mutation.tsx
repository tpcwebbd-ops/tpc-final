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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataSection46,
  defaultLayout,
  type Section46Data,
  type Section46Institution,
  type Section46Payload,
} from "./data";

const Building2 = iconMap.FolderKanban;
const ImageIcon = iconMap.Image;
const Link2 = iconMap.Link;
const Palette = iconMap.Palette;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Type = iconMap.FileText;

export interface Section46FormProps {
  data?: Section46Data | Section46Payload;
  onChange?: (values: Section46Data | Section46Payload) => void;
}

const cloneData = (data: Section46Data): Section46Data => ({
  ...data,
  institutions: data.institutions.map((institution) => ({ ...institution })),
});

const normalizeData = (data?: Section46Data | Section46Payload): Section46Data => {
  if (!data) return cloneData(defaultDataSection46);
  return {
    ...defaultDataSection46,
    ...data,
    showEyebrow: data.showEyebrow !== false,
    institutions: Array.isArray(data.institutions)
      ? data.institutions.map((institution) => ({ ...institution }))
      : defaultDataSection46.institutions.map((institution) => ({ ...institution })),
  };
};

const colorFields: Array<{
  field: "backgroundColor" | "headingColor" | "textColor" | "accentColor" | "cardColor" | "badgeColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "headingColor", label: "Headings" },
  { field: "textColor", label: "Body text" },
  { field: "accentColor", label: "Accent and links" },
  { field: "cardColor", label: "Cards" },
  { field: "badgeColor", label: "Badges" },
];

const MutationSection46 = ({ data, onChange }: Section46FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section46Payload = { ...defaultDataSection46, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section46Data>(() => normalizeData(data));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [mediaPickerInstitutionId, setMediaPickerInstitutionId] = useState<string | null>(null);

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

  const updateField = <K extends keyof Section46Data>(field: K, value: Section46Data[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateInstitution = <K extends keyof Omit<Section46Institution, "id">>(
    id: string,
    field: K,
    value: Section46Institution[K],
  ) => {
    setFormData((current) => ({
      ...current,
      institutions: current.institutions.map((institution) =>
        institution.id === id ? { ...institution, [field]: value } : institution,
      ),
    }));
  };

  const addInstitution = () => {
    updateField("institutions", [
      ...formData.institutions,
      {
        id: `institution-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: "New University",
        level: "UNDERGRADUATE",
        imageUrl: "/images/all-pages-placeholder.png",
        imageAlt: "University campus",
        buttonText: "Apply via NexaMart →",
        buttonUrl: "/applicaton",
      },
    ]);
  };

  const removeInstitution = (id: string) => {
    updateField(
      "institutions",
      formData.institutions.filter((institution) => institution.id !== id),
    );
  };

  const fieldClassName =
    "border-[#eadfca] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-pink-500";

  return (
    <div className="custom-parent-border min-h-screen bg-white text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex items-center gap-3 border-b border-[#eadfca] bg-white p-6">
          <div className="rounded-sm border border-pink-500/20 bg-pink-500/10 p-2.5">
            <Building2 className="h-6 w-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Partner Universities Section</h2>
            <p className="text-sm text-slate-500">
              Manage the heading, institution cards, images, application links, and colors.
            </p>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <section className="grid gap-5">
            <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Type className="h-4 w-4" /> Section content
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 rounded-sm border border-[#eadfca] bg-white p-3">
                  <div>
                    <Label htmlFor="section-46-eyebrow-visibility">Show eyebrow</Label>
                    <p className="mt-1 text-xs text-slate-500">Hide or display the eyebrow above the heading.</p>
                  </div>
                  <Switch
                    checked={formData.showEyebrow !== false}
                    id="section-46-eyebrow-visibility"
                    onCheckedChange={(checked) => updateField("showEyebrow", checked)}
                  />
                </div>
                {formData.showEyebrow !== false && (
                  <div className="space-y-2">
                    <Label>Eyebrow text</Label>
                    <Input
                      value={formData.eyebrow}
                      onChange={(event) => updateField("eyebrow", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className={`${fieldClassName} min-h-36 resize-y`}
                  rows={6}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Palette className="h-4 w-4" /> Colors
              </h3>
              <div className="grid gap-4">
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
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Building2 className="h-4 w-4" /> Institutions
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInstitution}
                className="cursor-pointer border-amber-200 bg-amber-100 text-amber-900 transition-all duration-700 hover:bg-amber-200 hover:text-amber-950"
              >
                <Plus className="mr-2 h-4 w-4" /> Add institution
              </Button>
            </div>

            <div className="grid gap-5">
              {formData.institutions.map((institution, index) => (
                <div
                  key={institution.id}
                  className="relative space-y-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5"
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeInstitution(institution.id)}
                    className="absolute right-2 top-2 z-10 h-8 w-8 cursor-pointer p-0 transition-all duration-700"
                    aria-label={`Remove institution ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="pr-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-600">
                      <ImageIcon className="h-4 w-4" /> Institution {index + 1} image
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[#eadfca] bg-white">
                        {institution.imageUrl ? (
                          <Image
                            alt={institution.imageAlt || `${institution.name} image preview`}
                            className="object-cover"
                            fill
                            src={institution.imageUrl}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">
                            <ImageIcon className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <button
                        className="rounded-sm border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-900 transition-colors hover:bg-pink-100"
                        onClick={() => setMediaPickerInstitutionId(institution.id)}
                        type="button"
                      >
                        Edit image
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={institution.name}
                        onChange={(event) => updateInstitution(institution.id, "name", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Programme badge</Label>
                      <Input
                        value={institution.level}
                        onChange={(event) => updateInstitution(institution.id, "level", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image alternative text</Label>
                      <Input
                        value={institution.imageAlt}
                        onChange={(event) => updateInstitution(institution.id, "imageAlt", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5" /> Button text
                      </Label>
                      <Input
                        value={institution.buttonText}
                        onChange={(event) => updateInstitution(institution.id, "buttonText", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button URL</Label>
                      <Input
                        value={institution.buttonUrl}
                        onChange={(event) => updateInstitution(institution.id, "buttonUrl", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
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

        {mediaPickerInstitutionId && (
          <ImagePickerModal
            close={() => setMediaPickerInstitutionId(null)}
            description="Select an existing institution image or upload a new one."
            onSelect={(url) => {
              updateInstitution(mediaPickerInstitutionId, "imageUrl", url);
              setMediaPickerInstitutionId(null);
            }}
            title="Choose institution image"
            uploadLabel="Upload institution image"
          />
        )}
      </div>
    </div>
  );
};

export default MutationSection46;
