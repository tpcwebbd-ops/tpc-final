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
  defaultDataSecurity,
  defaultLayout,
  defaultSecuritySection,
  type ISecurityData,
  type SecurityPayload,
} from "./data";

export interface SecurityFormProps {
  data?: ISecurityData | SecurityPayload;
  onChange?: (values: SecurityPayload) => void;
}
const normalizeData = (data?: ISecurityData | SecurityPayload): SecurityPayload => ({
  ...defaultDataSecurity,
  ...defaultLayout,
  ...data,
  pageUid: "security-uid",
  pageName: "Security",
  sections: Array.isArray(data?.sections) ? data.sections : defaultDataSecurity.sections,
});
const emptySection = () => ({ ...defaultSecuritySection, items: [...defaultSecuritySection.items] });
const SecurityMutation = ({ data, onChange }: SecurityFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<ISecurityData>(initialPayload);
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
      pageUid: "security-uid",
      pageName: "Security",
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
    setToast("Policy section removed.");
  };
  const addSection = () => {
    setFormData((current) => ({ ...current, sections: [...current.sections, emptySection()] }));
    setToast("New policy section added.");
  };
  return (
    <div className="custom-parent-border bg-white text-stone-800">
      <Toast message={toast} onDismiss={() => setToast("")} />
      <div className="mx-auto max-w-7xl border-x border-[#eadfca]">
        <header className="flex flex-col gap-3 border-y border-[#eadfca] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-stone-900">Edit Security</h2>
            <p className="truncate text-sm text-stone-600">security-uid · Website safeguards and incident response</p>
          </div>
        </header>
        <ScrollArea className="max-h-[calc(100vh-12rem)] p-4">
          <div className="grid gap-4 pb-4 grid-cols-1">
            <section className="grid gap-3 rounded-sm border border-[#eadfca] p-4 ">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="security-name">Page name</Label>
                  <Input
                    id="security-name"
                    value={formData.pageName}
                    onChange={(event) => setFormData((current) => ({ ...current, pageName: event.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="security-eyebrow">Eyebrow</Label>
                  <Input
                    id="security-eyebrow"
                    value={formData.eyebrow}
                    onChange={(event) => setFormData((current) => ({ ...current, eyebrow: event.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="security-title">Title</Label>
                <Input
                  id="security-title"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="security-subtitle">Subtitle</Label>
                <Textarea
                  className="min-h-36"
                  id="security-subtitle"
                  value={formData.subtitle}
                  onChange={(event) => setFormData((current) => ({ ...current, subtitle: event.target.value }))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="security-primary">Primary action</Label>
                  <Input
                    id="security-primary"
                    value={formData.primaryAction}
                    onChange={(event) => setFormData((current) => ({ ...current, primaryAction: event.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="security-secondary">Secondary action</Label>
                  <Input
                    id="security-secondary"
                    value={formData.secondaryAction}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, secondaryAction: event.target.value }))
                    }
                  />
                </div>
              </div>
            </section>
            <section className="grid gap-4 rounded-sm border border-cyan-100 bg-cyan-50/60 p-4 ">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MoveHorizontal className="inline-block" size={16} /> Page spacing
              </div>
              {(
                [
                  ["paddingX", "Padding X", paddingX],
                  ["paddingY", "Padding Y", paddingY],
                ] as const
              ).map(([field, label, value]) => (
                <div className="grid gap-3" key={field}>
                  <div className="flex items-center justify-between gap-3">
                    <Label>{label}</Label>
                    <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    max={300}
                    min={-300}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
                    step={1}
                    value={[value]}
                  />
                  <div className="flex justify-between text-[11px] font-medium text-slate-500">
                    <span>-300px</span>
                    <span>0px</span>
                    <span>+300px</span>
                  </div>
                </div>
              ))}
            </section>
            <div className="flex items-center justify-between gap-3 ">
              <h3 className="font-semibold text-stone-900">Policy sections</h3>
              <Button
                className="cursor-pointer bg-amber-100 text-amber-950 transition duration-700 hover:bg-amber-200"
                onClick={addSection}
                size="sm"
                type="button"
                variant="outline"
              >
                {iconMap.Plus} Add section
              </Button>
            </div>
            {formData.sections.map((section, index) => (
              <section className="grid gap-3 rounded-sm border border-[#eadfca] p-4" key={`${section.title}-${index}`}>
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
                  <Label htmlFor={`security-section-eyebrow-${index}`}>Eyebrow</Label>
                  <Input
                    id={`security-section-eyebrow-${index}`}
                    value={section.eyebrow}
                    onChange={(event) => updateSection(index, "eyebrow", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`security-section-title-${index}`}>Title</Label>
                  <Input
                    id={`security-section-title-${index}`}
                    value={section.title}
                    onChange={(event) => updateSection(index, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`security-section-description-${index}`}>Description</Label>
                  <Textarea
                    className="min-h-48"
                    id={`security-section-description-${index}`}
                    value={section.description}
                    onChange={(event) => updateSection(index, "description", event.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`security-section-items-${index}`}>Points (one per line)</Label>
                  <Textarea
                    className="min-h-48"
                    id={`security-section-items-${index}`}
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
        description="This removes the policy section from the current editor."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={removeSection}
        open={deleteIndex !== null}
        title="Delete this policy section?"
      />
    </div>
  );
};
export default SecurityMutation;
