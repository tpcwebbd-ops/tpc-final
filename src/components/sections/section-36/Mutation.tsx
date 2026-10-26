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

import {
  CategorySliderItem,
  defaultDataSection36,
  Section36Data,
  Section36Payload,
  defaultLayout,
} from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;

export interface SectionFormProps {
  data?: Section36Data | Section36Payload;
  onChange?: (values: Section36Data | Section36Payload) => void;
  onSubmit?: (values: Section36Data | Section36Payload) => void;
}

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500";
const nextId = (items: CategorySliderItem[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

const MutationSection36 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section36Payload = { ...defaultDataSection36, ...defaultLayout, ...(data || {}) };
  const [settings, setSettings] = useState<Section36Data>(() => ({
    ...initialPayload,
    categories: initialPayload.categories ?? defaultDataSection36.categories,
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

  const updateCategory = (id: number, field: keyof CategorySliderItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="custom-parent-border px-4 space-y-6 rounded-sm bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 36 Category Slider</h2>
          <p className="text-sm text-slate-500">Copied from page-4</p>
        </div>
      </div>

      <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Card Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.cardBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, cardBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded-sm border border-slate-200"
              />
              <input
                value={settings.cardBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, cardBackgroundColor: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Icon Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.iconBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, iconBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded-sm border border-slate-200"
              />
              <input
                value={settings.iconBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, iconBackgroundColor: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Icon Hover Background</label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={settings.iconHoverBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, iconHoverBackgroundColor: e.target.value }))}
                className="h-10 w-12 rounded-sm border border-slate-200"
              />
              <input
                value={settings.iconHoverBackgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, iconHoverBackgroundColor: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Section spacing</h3>
            <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
          </div>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">-300 to +300 px</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900">Next / previous buttons</h3>
            <p className="text-xs text-slate-500">Show or hide the carousel navigation buttons.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-sm bg-slate-50 px-3 py-2">
              <span className="text-xs font-semibold text-slate-600">
                Buttons: {settings.showNavigationButtons ? "Visible" : "Hidden"}
              </span>
              <Switch
                checked={settings.showNavigationButtons}
                onCheckedChange={(showNavigationButtons) => setSettings((prev) => ({ ...prev, showNavigationButtons }))}
                aria-label="Show next and previous buttons"
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-sm bg-slate-50 px-3 py-2">
              <span className="text-xs font-semibold text-slate-600">Loop: {settings.loop ? "On" : "Off"}</span>
              <Switch
                checked={settings.loop}
                onCheckedChange={(loop) => setSettings((prev) => ({ ...prev, loop }))}
                aria-label="Loop carousel slides"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Categories</h3>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                categories: [
                  ...prev.categories,
                  { id: nextId(prev.categories), name: "New Category", icon: "shopping-basket" },
                ],
              }))
            }
            className="cursor-pointer bg-amber-100 text-amber-900 transition-all duration-700 hover:bg-amber-200"
          >
            <Plus size={14} /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {settings.categories.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 md:grid-cols-[1fr_220px_auto]"
            >
              <input
                value={item.name}
                onChange={(e) => updateCategory(item.id, "name", e.target.value)}
                className={inputClass}
                placeholder="Category name"
              />
              <IconPicker
                label="Category icon"
                onChange={(icon) => updateCategory(item.id, "icon", icon)}
                value={item.icon}
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    categories: prev.categories.filter((category) => category.id !== item.id),
                  }))
                }
                className="w-full cursor-pointer gap-2 bg-red-50 text-red-600 shadow-none transition-colors hover:bg-red-600 hover:text-white md:w-auto"
              >
                <Trash2 size={16} />
                <span className="md:hidden">Delete category</span>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationSection36;
