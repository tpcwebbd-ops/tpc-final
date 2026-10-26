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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { Section31Data, defaultDataSection31, IStatItem, Section31Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;

export interface SectionFormProps {
  data?: Section31Data | Section31Payload;
  onChange?: (values: Section31Data | Section31Payload) => void;
  onSubmit?: (values: Section31Data | Section31Payload) => void;
}

const MutationSection31 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section31Payload = { ...defaultDataSection31, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section31Data>(() => ({
    ...initialPayload,
    stats: initialPayload.stats ?? defaultDataSection31.stats,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section31Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleAddStat = () => {
    const newStat: IStatItem = {
      number: "100+",
      label: "New Metric",
    };
    updateField("stats", [...formData.stats, newStat]);
  };

  const handleRemoveStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    updateField("stats", newStats);
  };

  const updateStat = (index: number, field: keyof IStatItem, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateField("stats", newStats);
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
              Edit Section 31
            </h2>
            <p className="text-slate-500 text-sm">Update hero text and statistics.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600">Badge Text</Label>
              <Input
                value={formData.badgeText}
                onChange={(e) => updateField("badgeText", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Heading Prefix</Label>
                <Input
                  value={formData.headingPrefix}
                  onChange={(e) => updateField("headingPrefix", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-indigo-600">Heading Highlight</Label>
                <Input
                  value={formData.headingHighlight}
                  onChange={(e) => updateField("headingHighlight", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Heading Suffix</Label>
                <Input
                  value={formData.headingSuffix}
                  onChange={(e) => updateField("headingSuffix", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start md:items-center justify-start md:justify-between flex-col md:flex-row gap-2">
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
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 text-lg font-semibold">Statistics Grid</Label>
              <Button
                onClick={handleAddStat}
                size="sm"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Stat
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-4 rounded-sm space-y-3 relative group shadow-sm"
                >
                  <Button
                    size="sm"
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Number Value</Label>
                    <Input
                      value={stat.number}
                      onChange={(e) => updateStat(idx, "number", e.target.value)}
                      className="bg-white border-slate-200 h-9 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, "label", e.target.value)}
                      className="bg-white border-slate-200 h-9"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection31;
