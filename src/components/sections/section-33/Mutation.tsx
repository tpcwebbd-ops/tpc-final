/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import { defaultDataSection33, HeroFeature, HeroStat, Section33Data, Section33Payload, defaultLayout } from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;

export interface SectionFormProps {
  data?: Section33Data | Section33Payload;
  onChange?: (values: Section33Data | Section33Payload) => void;
  onSubmit?: (values: Section33Data | Section33Payload) => void;
}

const inputClass =
  "w-full rounded-sm border border-[#e8d8bd] bg-[#fffdf8] px-3 py-2.5 text-sm text-[#49352b] outline-none transition focus:border-[#9a5b9c] focus:ring-2 focus:ring-[#eadcf5]";
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-[#765f50]";

const nextId = <T extends { id: number }>(items: T[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

const MutationSection33 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section33Payload = { ...defaultDataSection33, ...defaultLayout, ...(data || {}) };
  const [settings, setSettings] = useState<Section33Data>(() => ({
    ...initialPayload,
    stats: initialPayload.stats ?? defaultDataSection33.stats,
    features: initialPayload.features ?? defaultDataSection33.features,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...settings, paddingX, paddingY });
  }, [settings, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateStat = (id: number, field: keyof HeroStat, value: string) => {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateFeature = (id: number, field: keyof HeroFeature, value: string) => {
    setSettings((prev) => ({
      ...prev,
      features: prev.features.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="custom-parent-border w-full max-w-7xl mx-auto space-y-6 border-x border-[#e8d8bd] bg-[#fffaf0] text-[#49352b] sm:p-6">
      <div className="flex items-center justify-between gap-3 rounded-sm border border-[#eadcc7] bg-gradient-to-r from-[#fff2d9] via-[#fffaf0] to-[#f4efff] p-5 shadow-sm">
        <div>
          <h2 className="bg-gradient-to-r from-[#87451f] via-[#b34e45] to-[#66419a] bg-clip-text text-xl font-black text-transparent">
            Edit Section 33 Hero
          </h2>
          <p className="mt-1 text-sm text-[#765f50]">Update your hero content, metrics, and feature chips.</p>
        </div>
      </div>

      <section className="rounded-sm border border-[#eadcc7] bg-[#fffdf8] p-5 shadow-[0_10px_25px_rgba(105,66,38,0.06)]">
        <div className="grid gap-4">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4 rounded-sm border border-[#eadcc7] bg-[#fff5e4] p-3">
              <div>
                <label className={labelClass}>Eyebrow</label>
                <p className="mt-1 text-xs text-slate-500">Show or hide the eyebrow on the public section.</p>
              </div>
              <Switch
                aria-label="Show eyebrow"
                checked={settings.showEyebrow !== false}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showEyebrow: checked }))}
              />
            </div>
            <label className={labelClass}>Eyebrow Text</label>
            <input
              value={settings.badgeText}
              onChange={(e) => setSettings((prev) => ({ ...prev, badgeText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              value={settings.subtitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, subtitle: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Title Line 1</label>
            <input
              value={settings.titleLine1}
              onChange={(e) => setSettings((prev) => ({ ...prev, titleLine1: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Title Line 2</label>
            <input
              value={settings.titleLine2}
              onChange={(e) => setSettings((prev) => ({ ...prev, titleLine2: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-[#e3d0b4] bg-gradient-to-br from-[#fff2d9] via-[#fffaf0] to-[#f3ebff] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Section spacing</h3>
            <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
          </div>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">-300 to +300 px</span>
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
                <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">{value}px</span>
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
              <input
                aria-label={`${label} manual value`}
                className={inputClass}
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

      <section className="rounded-sm border border-[#eadcc7] bg-[#fffdf8] p-5 shadow-[0_10px_25px_rgba(105,66,38,0.06)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Stats</h3>
          <Button
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                stats: [...prev.stats, { id: nextId(prev.stats), value: "", label: "" }],
              }))
            }
            className="inline-flex items-center gap-1 rounded-sm border border-[#d9c5ef] bg-[#f3ebff] px-3 py-1.5 text-xs font-bold text-[#70458f] hover:bg-[#eadcf8]"
          >
            <Plus size={14} /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {settings.stats.map((item) => (
            <div key={item.id} className="grid gap-2">
              <input
                value={item.value}
                onChange={(e) => updateStat(item.id, "value", e.target.value)}
                className={inputClass}
                placeholder="500+"
              />
              <input
                value={item.label}
                onChange={(e) => updateStat(item.id, "label", e.target.value)}
                className={inputClass}
                placeholder="Templates"
              />
              <Button
                size="sm"
                variant="destructive"
                aria-label={`Delete ${item.label || "stat"}`}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, stats: prev.stats.filter((stat) => stat.id !== item.id) }))
                }
                className="h-8 w-8 justify-self-end rounded-full p-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-[#eadcc7] bg-[#fffdf8] p-5 shadow-[0_10px_25px_rgba(105,66,38,0.06)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Feature Chips</h3>
          <Button
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                features: [...prev.features, { id: nextId(prev.features), icon: "ti-check", label: "" }],
              }))
            }
            className="inline-flex items-center gap-1 rounded-sm border border-[#d9c5ef] bg-[#f3ebff] px-3 py-1.5 text-xs font-bold text-[#70458f] hover:bg-[#eadcf8]"
          >
            <Plus size={14} /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {settings.features.map((item) => (
            <div key={item.id} className="grid gap-2">
              <IconPicker
                label="Feature icon"
                onChange={(icon) => updateFeature(item.id, "icon", icon)}
                value={item.icon}
              />
              <input
                value={item.label}
                onChange={(e) => updateFeature(item.id, "label", e.target.value)}
                className={inputClass}
                placeholder="Free Domain"
              />
              <Button
                size="sm"
                variant="destructive"
                aria-label={`Delete ${item.label || "feature"}`}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    features: prev.features.filter((feature) => feature.id !== item.id),
                  }))
                }
                className="h-8 w-8 justify-self-end rounded-full p-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationSection33;
