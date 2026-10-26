/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { FileText, MoveHorizontal, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataPage7, defaultRefundPolicySection, type IPage7Data, type RefundPolicySection } from "./data";

export interface Page7FormProps {
  data?: IPage7Data;
  onChange?: (values: IPage7Data) => void;
}

const createEmptySection = (): RefundPolicySection => ({ ...defaultRefundPolicySection, items: [] });

const cloneData = (data: IPage7Data): IPage7Data => ({
  ...data,
  sections: data.sections.map((section) => ({
    ...section,
    items: [...(section.items ?? [])],
  })),
});

const MediaPreview = ({ src }: { src: string }) => (
  <div className="relative h-40 overflow-hidden rounded-sm border border-[#eadfca] bg-white">
    <Image
      alt="Refund policy selected image"
      className="object-contain p-2"
      fill
      loading="eager"
      sizes="420px"
      src={src}
    />
  </div>
);

const MutationPage7 = ({ data, onChange }: Page7FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<IPage7Data>(cloneData({ ...defaultDataPage7, ...data }));
  const [mediaOpen, setMediaOpen] = useState(false);
  const [paddingX, setPaddingX] = useState(data?.paddingX ?? 0);
  const [paddingY, setPaddingY] = useState(data?.paddingY ?? 0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const nextData = cloneData(data ?? defaultDataPage7);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX(nextData.paddingX ?? 0);
    setPaddingY(nextData.paddingY ?? 0);
  }, [data]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateField = <K extends keyof IPage7Data>(field: K, value: IPage7Data[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSection = (index: number, field: keyof RefundPolicySection, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  };

  const addSection = () => {
    setFormData((prev) => ({ ...prev, sections: [...prev.sections, createEmptySection()] }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({ ...prev, sections: prev.sections.filter((_, sectionIndex) => sectionIndex !== index) }));
  };

  return (
    <div className="custom-parent-border px-4 min-h-full bg-[#fffaf0] text-stone-700 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_18px_60px_rgba(120,83,35,0.08)]">
        <div className="flex items-center gap-3 border-b border-[#eadfca] bg-[#fffdf8] p-6">
          <div className="rounded-sm bg-amber-100 p-2">
            <FileText className="text-amber-800" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Edit Refund Policy Page</h2>
            <p className="text-sm text-stone-500">Edit guided policy cards, spacing, visibility, and media.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5">
            <h3 className="font-semibold text-stone-900">Page Header</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input
                  value={formData.pageName}
                  onChange={(e) => updateField("pageName", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={formData.eyebrow}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="border-[#eadfca] bg-white"
                  />
                  <Switch
                    checked={formData.showEyebrow}
                    onCheckedChange={(checked) => updateField("showEyebrow", checked)}
                  />
                  <span className="text-xs text-stone-500">Visible</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Updated Label</Label>
                <Input
                  value={formData.lastUpdatedLabel}
                  onChange={(e) => updateField("lastUpdatedLabel", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight Title</Label>
                <Input
                  value={formData.highlightTitle}
                  onChange={(e) => updateField("highlightTitle", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight Description</Label>
                <Textarea
                  value={formData.highlightDescription}
                  onChange={(e) => updateField("highlightDescription", e.target.value)}
                  className="min-h-24 resize-none border-[#eadfca] bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5">
            <h3 className="font-semibold text-stone-900">Contact Block</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Contact Title</Label>
                <Input
                  value={formData.contactTitle}
                  onChange={(e) => updateField("contactTitle", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Description</Label>
                <Textarea
                  value={formData.contactDescription}
                  onChange={(e) => updateField("contactDescription", e.target.value)}
                  className="min-h-28 resize-none border-[#eadfca] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input
                  value={formData.supportEmail}
                  onChange={(e) => updateField("supportEmail", e.target.value)}
                  className="border-[#eadfca] bg-white"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Policy image</Label>
              <Button type="button" size="sm" onClick={() => setMediaOpen(true)}>
                Edit image
              </Button>
              <MediaPreview src={formData.image} />
            </div>
          </div>
        </div>

        <section className="mx-6 mb-6 grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 sm:grid-cols-2">
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
                onValueChange={([next]) => {
                  const nextValue = Math.min(300, Math.max(-300, next ?? 0));
                  if (field === "paddingX") setPaddingX(nextValue);
                  else setPaddingY(nextValue);
                }}
              />
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>-300px</span>
                <span>0px</span>
                <span>+300px</span>
              </div>
            </div>
          ))}
        </section>

        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-stone-900">Policy Sections</h3>
            <Button onClick={addSection} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {formData.sections.map((section, index) => (
              <div key={index} className="space-y-3 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">Section {index + 1}</p>
                  <Button onClick={() => removeSection(index)} variant="destructive" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Input
                      value={section.eyebrow ?? ""}
                      onChange={(e) => updateSection(index, "eyebrow", e.target.value)}
                      className="border-[#eadfca] bg-white"
                      placeholder="Section eyebrow"
                    />
                    <Switch
                      checked={section.showEyebrow}
                      onCheckedChange={(checked) => updateSection(index, "showEyebrow", checked)}
                    />
                    <span className="text-xs text-stone-500">Visible</span>
                  </div>
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                    className="border-[#eadfca] bg-white"
                  />
                  <Textarea
                    value={section.description ?? ""}
                    onChange={(e) => updateSection(index, "description", e.target.value)}
                    className="min-h-24 resize-none border-[#eadfca] bg-white"
                    placeholder="Section paragraph"
                  />
                  <Textarea
                    value={(section.items ?? []).join("\n")}
                    onChange={(e) =>
                      updateSection(
                        index,
                        "items",
                        e.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                    className="min-h-24 resize-none border-[#eadfca] bg-white"
                    placeholder="One bullet point per line"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {mediaOpen && (
          <ImagePickerModal
            close={() => setMediaOpen(false)}
            onSelect={(url) => {
              updateField("image", url);
              setMediaOpen(false);
            }}
            title="Choose Refund Policy image"
            description="Select an existing image or upload a new image to Media Library."
            uploadLabel="Upload Refund image"
          />
        )}
      </div>
    </div>
  );
};

export default MutationPage7;
