/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { Section29Data, defaultDataSection29, Section29Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Phone = iconMap.Phone;
const Calendar = iconMap.Calendar;
const PlayCircle = iconMap.Play;

export interface Section29FormProps {
  data?: Section29Data | Section29Payload;
  onChange?: (values: Section29Data | Section29Payload) => void;
  onSubmit?: (values: Section29Data | Section29Payload) => void;
}

const MutationSection29 = ({ data, onChange }: Section29FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section29Payload = { ...defaultDataSection29, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section29Data>(() => ({ ...initialPayload }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateField = (field: keyof Section29Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white text-stone-800 font-sans">
      <div className="w-full bg-white border border-[#eadfca] rounded-sm overflow-hidden shadow-sm">
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <LayoutTemplate className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Section 40
            </h2>
            <p className="text-slate-500 text-sm">Update the Call-to-Action banner.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600">Headline</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Subtitle</Label>
              <Textarea
                value={formData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500 min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start justify-start md:items-center md:justify-between flex-col md:flex-row gap-2 ">
              <div>
                <Label className="text-slate-800 font-semibold">Section spacing</Label>
                <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
              </div>
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                -300 to +300 px
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  ["paddingX", paddingX, setPaddingX, "Padding X"],
                  ["paddingY", paddingY, setPaddingY, "Padding Y"],
                ] as const
              ).map(([field, value, setter, label]) => (
                <div key={field} className="rounded-sm border border-white bg-white p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-600">{label}</Label>
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
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-800 text-lg font-semibold">Buttons</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 bg-indigo-50 rounded-sm border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase">Primary Button</span>
                </div>
                <Input
                  value={formData.buttonPrimaryText}
                  onChange={(e) => updateField("buttonPrimaryText", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2 p-4 bg-cyan-50 rounded-sm border border-cyan-100">
                <div className="flex items-center gap-2 text-cyan-600 mb-2">
                  <PlayCircle size={16} />
                  <span className="text-xs font-medium uppercase">Secondary Button</span>
                </div>
                <Input
                  value={formData.buttonSecondaryText}
                  onChange={(e) => updateField("buttonSecondaryText", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="space-y-4">
            <Label className="text-slate-800 text-lg font-semibold">Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-600">Label Text</Label>
                <Input
                  value={formData.contactLabel}
                  onChange={(e) => updateField("contactLabel", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Phone Number Display</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-indigo-500" />
                  <Input
                    value={formData.contactNumber}
                    onChange={(e) => updateField("contactNumber", e.target.value)}
                    className="bg-white border-slate-200 pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection29;
