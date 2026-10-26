/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import { MoveHorizontal, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultAboutSection, defaultData, defaultSections, type AboutSection } from "./data";

type AboutForm = typeof defaultData & { sections: AboutSection[] };
type ImageField = "image";

const parseSections = (value?: string): AboutSection[] => {
  try {
    const parsed = JSON.parse(value ?? defaultData.sectionsJson) as Partial<AboutSection>[];
    return Array.isArray(parsed) && parsed.length
      ? parsed.map((item, index) => ({
          id: item.id || `section-${index + 1}`,
          eyebrow: item.eyebrow || defaultAboutSection.eyebrow,
          showEyebrow: item.showEyebrow !== false,
          title: item.title || defaultAboutSection.title,
          description: item.description || defaultAboutSection.description,
        }))
      : defaultSections;
  } catch {
    return defaultSections;
  }
};

const normalize = (data?: Record<string, string>): AboutForm => ({
  ...defaultData,
  ...data,
  sections: parseSections(data?.sectionsJson),
});

const MediaPreview = ({ src }: { src: string }) => (
  <div className="relative mt-3 h-40 overflow-hidden rounded-sm border border-[#eadfca] bg-white">
    <Image
      alt="About page selected image"
      className="object-contain p-2"
      fill
      loading="eager"
      sizes="(max-width: 640px) 90vw, 420px"
      src={src}
    />
  </div>
);

export default function Mutation({
  data = defaultData,
  onChange,
}: {
  data?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<AboutForm>(() => normalize(data));
  const [paddingX, setPaddingX] = useState(() => Number(normalize(data).paddingX) || 0);
  const [paddingY, setPaddingY] = useState(() => Number(normalize(data).paddingY) || 0);
  const [mediaField, setMediaField] = useState<ImageField | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const next = normalize(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    setPaddingX((current) => (current === Number(next.paddingX) ? current : Number(next.paddingX) || 0));
    setPaddingY((current) => (current === Number(next.paddingY) ? current : Number(next.paddingY) || 0));
  }, [data]);
  useEffect(() => {
    const { sections, ...serializable } = formData;
    onChangeRef.current({
      ...serializable,
      sectionsJson: JSON.stringify(sections),
      paddingX: String(paddingX),
      paddingY: String(paddingY),
    });
  }, [formData, paddingX, paddingY]);

  const update = (field: keyof AboutForm, value: string | boolean) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const updateSection = (index: number, field: keyof AboutSection, value: string | boolean) =>
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, itemIndex) =>
        itemIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };
  const inputClass = "border-[#eadfca] bg-white text-stone-800 placeholder:text-stone-400 focus-visible:ring-amber-500";

  return (
    <div className="custom-parent-border px-4 min-h-full bg-[#fffaf0] text-stone-700 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_18px_60px_rgba(120,83,35,0.08)]">
        <header className="border-b border-[#eadfca] bg-[#fffdf8] p-6">
          <h2 className="text-xl font-bold text-stone-900">Edit About Us</h2>
          <p className="mt-1 text-sm text-stone-500">
            Build the page with guided content cards, spacing controls, and media previews.
          </p>
        </header>
        <div className="grid gap-5 md:p-8">
          <section className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900">Hero content</h3>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <div className="flex items-center gap-3">
                  <Input
                    className={inputClass}
                    value={formData.eyebrow}
                    onChange={(event) => update("eyebrow", event.target.value)}
                  />
                  <Switch
                    checked={formData.showEyebrow === "true"}
                    onCheckedChange={(checked) => update("showEyebrow", String(checked))}
                  />
                  <span className="text-xs text-stone-500">Visible</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  className={inputClass}
                  value={formData.title}
                  onChange={(event) => update("title", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Introduction</Label>
                <Textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={formData.intro}
                  onChange={(event) => update("intro", event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-stone-900">Hero image</h3>
              <Button type="button" size="sm" onClick={() => setMediaField("image")}>
                Edit image
              </Button>
              <MediaPreview src={formData.image} />
            </div>
          </section>
          <section className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 sm:grid-cols-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900 sm:col-span-2">
              <MoveHorizontal className="h-4 w-4" /> Page spacing
            </div>
            {(
              [
                ["paddingX", "Padding X", paddingX],
                ["paddingY", "Padding Y", paddingY],
              ] as const
            ).map(([field, label, value]) => (
              <div className="space-y-3" key={field}>
                <div className="flex justify-between">
                  <Label>{label}</Label>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                    {value}px
                  </span>
                </div>
                <Slider
                  aria-label={label}
                  min={-300}
                  max={300}
                  step={1}
                  value={[value]}
                  onValueChange={([next]) => updateSpacing(field, next)}
                />
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>-300px</span>
                  <span>0px</span>
                  <span>+300px</span>
                </div>
              </div>
            ))}
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-stone-900">Story sections</h3>
                <p className="text-sm text-stone-500">Edit each section one by one. No JSON editor is needed.</p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    sections: [
                      ...current.sections,
                      {
                        id: `section-${Date.now()}`,
                        ...defaultAboutSection,
                      },
                    ],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add section
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {formData.sections.map((section, index) => (
                <article className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5" key={section.id}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-stone-900">Section {index + 1}</h4>
                    <Button
                      aria-label={`Remove section ${index + 1}`}
                      className="text-red-700"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          sections: current.sections.filter((item) => item.id !== section.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Eyebrow</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        className={inputClass}
                        value={section.eyebrow}
                        onChange={(event) => updateSection(index, "eyebrow", event.target.value)}
                      />
                      <Switch
                        checked={section.showEyebrow}
                        onCheckedChange={(checked) => updateSection(index, "showEyebrow", checked)}
                      />
                      <span className="text-xs text-stone-500">Visible</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      className={inputClass}
                      value={section.title}
                      onChange={(event) => updateSection(index, "title", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      className={`${inputClass} min-h-28 resize-y`}
                      value={section.description}
                      onChange={(event) => updateSection(index, "description", event.target.value)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      {mediaField && (
        <ImagePickerModal
          close={() => setMediaField(null)}
          onSelect={(url) => {
            update("image", url);
            setMediaField(null);
          }}
          title="Choose About Us image"
          description="Select an existing image or upload a new image to Media Library."
          uploadLabel="Upload About Us image"
        />
      )}
    </div>
  );
}
