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
  defaultDataDeliveryPolicy,
  defaultDeliveryPolicySection,
  defaultLayout,
  type DeliveryPolicySection,
  type DeliveryPolicyPayload,
  type IDeliveryPolicyData,
} from "./data";
export interface DeliveryPolicyFormProps {
  data?: IDeliveryPolicyData | DeliveryPolicyPayload;
  onChange?: (values: DeliveryPolicyPayload) => void;
}
const normalizeData = (data?: IDeliveryPolicyData | DeliveryPolicyPayload): DeliveryPolicyPayload => ({
  ...defaultDataDeliveryPolicy,
  ...defaultLayout,
  ...data,
  pageUid: "delivery-policy-uid",
  pageName: "Delivery Policy",
  sections: Array.isArray(data?.sections) ? data.sections : defaultDataDeliveryPolicy.sections,
});
const emptySection = (): DeliveryPolicySection => ({ ...defaultDeliveryPolicySection, items: [] });
const MutationDeliveryPolicy = ({ data, onChange }: DeliveryPolicyFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IDeliveryPolicyData>(initialPayload);
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
      pageUid: "delivery-policy-uid",
      pageName: "Delivery Policy",
    });
  }, [formData, paddingX, paddingY]);
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };
  const updateSection = (index: number, field: keyof DeliveryPolicySection, value: string | string[]) =>
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  const remove = () => {
    if (deleteIndex === null) return;
    setFormData((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== deleteIndex) }));
    setDeleteIndex(null);
    setToast("Policy section removed.");
  };
  return (
    <div className="custom-parent-border bg-white text-stone-800">
      <Toast message={toast} onDismiss={() => setToast("")} />
      <div className="mx-auto max-w-7xl border-x border-[#eadfca]">
        <header className="flex flex-col gap-3 border-b border-[#eadfca] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Edit Delivery Policy</h2>
            <p className="text-sm text-stone-600">delivery-policy-uid · Delivery details and customer support</p>
          </div>
        </header>
        <ScrollArea className="max-h-[calc(100vh-12rem)] p-4">
          <div className="grid gap-4 pb-4 lg:grid-cols-2">
            <section className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-name">Page name</Label>
                <Input
                  id="delivery-policy-name"
                  value={formData.pageName}
                  onChange={(event) => setFormData((current) => ({ ...current, pageName: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-title">Title</Label>
                <Input
                  id="delivery-policy-title"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-updated">Last updated label</Label>
                <Input
                  id="delivery-policy-updated"
                  value={formData.lastUpdatedLabel}
                  onChange={(event) => setFormData((current) => ({ ...current, lastUpdatedLabel: event.target.value }))}
                />
              </div>
            </section>
            <section className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-help">Help title</Label>
                <Input
                  id="delivery-policy-help"
                  value={formData.helpTitle}
                  onChange={(event) => setFormData((current) => ({ ...current, helpTitle: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-description">Help description</Label>
                <Textarea
                  className="min-h-36"
                  id="delivery-policy-description"
                  value={formData.helpDescription}
                  onChange={(event) => setFormData((current) => ({ ...current, helpDescription: event.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-policy-email">Support email</Label>
                <Input
                  id="delivery-policy-email"
                  value={formData.supportEmail}
                  onChange={(event) => setFormData((current) => ({ ...current, supportEmail: event.target.value }))}
                />
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
                <div className="grid gap-3" key={field}>
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
            <section className="grid gap-3 rounded-sm border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-stone-900">Policy sections</h3>
                <Button
                  className="cursor-pointer bg-amber-100 text-amber-950 transition duration-700 hover:bg-amber-200"
                  onClick={() => {
                    setFormData((current) => ({ ...current, sections: [...current.sections, emptySection()] }));
                    setToast("New policy section added.");
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {iconMap.Plus} Add section
                </Button>
              </div>
              {formData.sections.map((section, index) => (
                <div
                  className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 lg:grid-cols-2"
                  key={`${section.title}-${index}`}
                >
                  <div className="flex items-center justify-between gap-2 lg:col-span-2">
                    <p className="font-medium">Section {index + 1}</p>
                    <Button
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
                    <Label htmlFor={`delivery-policy-section-title-${index}`}>Title</Label>
                    <Input
                      id={`delivery-policy-section-title-${index}`}
                      value={section.title}
                      onChange={(event) => updateSection(index, "title", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`delivery-policy-section-description-${index}`}>Description</Label>
                    <Textarea
                      className="min-h-36"
                      id={`delivery-policy-section-description-${index}`}
                      value={section.description ?? ""}
                      onChange={(event) => updateSection(index, "description", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 lg:col-span-2">
                    <Label htmlFor={`delivery-policy-section-items-${index}`}>Points (one per line)</Label>
                    <Textarea
                      className="min-h-36"
                      id={`delivery-policy-section-items-${index}`}
                      value={(section.items ?? []).join("\n")}
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
                </div>
              ))}
            </section>
          </div>
        </ScrollArea>
      </div>
      <AlertDialog
        busy={false}
        description="This removes the section from the current editor."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={remove}
        open={deleteIndex !== null}
        title="Delete this policy section?"
      />
    </div>
  );
};
export default MutationDeliveryPolicy;
