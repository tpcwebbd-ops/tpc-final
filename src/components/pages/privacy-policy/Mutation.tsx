/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
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

import { defaultDataPage4, type ISection4Data, type PrivacySection } from "./data";

type PrivacyForm = ISection4Data;
const normalize = (data?: ISection4Data): PrivacyForm => ({
  ...defaultDataPage4,
  ...data,
  sections: Array.isArray(data?.sections)
    ? data.sections.map((section, index) => ({
        ...section,
        id: `${section.title || "section"}-${index}`,
        showEyebrow: section.showEyebrow !== false,
        items: Array.isArray(section.items) ? section.items : [],
      }))
    : defaultDataPage4.sections,
});

const MediaPreview = ({ src }: { src: string }) => (
  <div className="relative mt-3 h-40 overflow-hidden rounded-sm border border-[#eadfca] bg-white">
    <Image
      alt="Privacy policy selected image"
      className="object-contain p-2"
      fill
      loading="eager"
      sizes="(max-width: 640px) 90vw, 420px"
      src={src}
    />
  </div>
);

export default function Mutation({
  data,
  onChange,
}: {
  data?: ISection4Data;
  onChange?: (values: ISection4Data) => void;
}) {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<PrivacyForm>(() => normalize(data));
  const [mediaOpen, setMediaOpen] = useState(false);
  const [paddingX, setPaddingX] = useState(() => Math.min(300, Math.max(-300, Number(data?.paddingX) || 0)));
  const [paddingY, setPaddingY] = useState(() => Math.min(300, Math.max(-300, Number(data?.paddingY) || 0)));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const next = normalize(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    setPaddingX(Math.min(300, Math.max(-300, Number(next.paddingX) || 0)));
    setPaddingY(Math.min(300, Math.max(-300, Number(next.paddingY) || 0)));
  }, [data]);
  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const update = <K extends keyof PrivacyForm>(field: K, value: PrivacyForm[K]) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const updateSection = (index: number, field: keyof PrivacySection, value: string | boolean | string[]) =>
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, itemIndex) =>
        itemIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  const inputClass = "border-[#eadfca] bg-white text-stone-800 placeholder:text-stone-400 focus-visible:ring-amber-500";

  return (
    <div className="custom-parent-border px-4 min-h-full bg-[#fffaf0] text-stone-700 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_18px_60px_rgba(120,83,35,0.08)]">
        <header className="border-b border-[#eadfca] bg-[#fffdf8] p-6">
          <h2 className="text-xl font-bold text-stone-900">Edit Privacy Policy</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage policy content with guided fields. No JSON editor is needed.
          </p>
        </header>
        <div className="grid gap-5 md:p-8">
          <section className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900">Page introduction</h3>
              <div className="space-y-2">
                <Label>Page name</Label>
                <Input
                  className={inputClass}
                  value={formData.pageName}
                  onChange={(event) => update("pageName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <div className="flex items-center gap-3">
                  <Input
                    className={inputClass}
                    value={formData.eyebrow}
                    onChange={(event) => update("eyebrow", event.target.value)}
                  />
                  <Switch
                    checked={formData.showEyebrow}
                    onCheckedChange={(checked) => update("showEyebrow", checked)}
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
                  className={`${inputClass} min-h-32 resize-y`}
                  value={formData.subtitle}
                  onChange={(event) => update("subtitle", event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Highlight title</Label>
                  <Input
                    className={inputClass}
                    value={formData.highlightTitle ?? ""}
                    onChange={(event) => update("highlightTitle", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Highlight description</Label>
                  <Textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    value={formData.highlightDescription ?? ""}
                    onChange={(event) => update("highlightDescription", event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-stone-900">Policy image</h3>
              <Button type="button" size="sm" onClick={() => setMediaOpen(true)}>
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
                  onValueChange={([next]) => (field === "paddingX" ? setPaddingX(next) : setPaddingY(next))}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-900">Policy sections</h3>
                <p className="text-sm text-stone-500">Edit headings, copy, and bullet points one section at a time.</p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  update("sections", [
                    ...formData.sections,
                    {
                      id: `section-${Date.now()}`,
                      eyebrow: "New section",
                      showEyebrow: true,
                      title: "New policy section",
                      description: "Add the policy explanation here.",
                      items: ["Add a key point"],
                    },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add section
              </Button>
            </div>
            <div className="grid gap-4">
              {formData.sections.map((section, index) => (
                <article
                  className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5"
                  key={section.id ?? `${section.title}-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-stone-900">Section {index + 1}</h4>
                    <Button
                      aria-label={`Remove policy section ${index + 1}`}
                      className="text-red-700"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        update(
                          "sections",
                          formData.sections.filter((_, itemIndex) => itemIndex !== index),
                        )
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
                  <div className="space-y-2">
                    <Label>Key points (one per line)</Label>
                    <Textarea
                      className={`${inputClass} min-h-28 resize-y`}
                      value={section.items.join("\n")}
                      onChange={(event) =>
                        updateSection(
                          index,
                          "items",
                          event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      {mediaOpen && (
        <ImagePickerModal
          close={() => setMediaOpen(false)}
          onSelect={(url) => {
            update("image", url);
            setMediaOpen(false);
          }}
          title="Choose Privacy Policy image"
          description="Select an existing image or upload a new image to Media Library."
          uploadLabel="Upload Privacy image"
        />
      )}
    </div>
  );
}
