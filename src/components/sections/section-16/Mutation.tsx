/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { MousePointer2 as MousePointer2Icon, Type as TypeIcon } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import type { Section16Data, Section16FormProps, Section16Payload } from "./data";
import { defaultDataSection16, defaultLayout } from "./data";

const LinkIcon = iconMap.Link;
const Type = TypeIcon;
const LayoutTemplate = iconMap.Layout;
const Search = iconMap.Search;
const MousePointer2 = MousePointer2Icon;

const MutationSection16 = ({
  data,
  onChange,
}: Omit<Section16FormProps, "onSubmit"> & {
  onChange?: (values: Section16Data | Section16Payload) => void;
}) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section16Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection16, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section16Data>({
    id: "section-uid-16",
    sectionUid: "section-uid-16",
    buttonName: initialPayload.buttonName,
    buttonIcon: initialPayload.buttonIcon,
    buttonPath: initialPayload.buttonPath,
    isNewTab: initialPayload.isNewTab,
  });
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [iconSearch, setIconSearch] = useState("");

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

  const updateField = (field: keyof Section16Data, value: Section16Data[keyof Section16Data]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions;
    return iconOptions.filter((name) => name.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  return (
    <div className="custom-parent-border min-h-[400px] w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white text-stone-800 font-sans overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-6">
        <div className="rounded-sm bg-indigo-50 p-2">
          <LayoutTemplate className="text-indigo-600" size={24} />
        </div>
        <div>
          <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
            Edit Button
          </h2>
          <p className="text-sm text-slate-500">Configure your button settings.</p>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">Tune the breathing room around the public button.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:min-w-[30rem]">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = field === "paddingX" ? paddingX : paddingY;
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    min={-300}
                    max={300}
                    step={1}
                    value={[value]}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue ?? 0)}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>-300px</span>
                    <span>0</span>
                    <span>+300px</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <Type size={14} /> Button Text
            </Label>
            <Input
              value={formData.buttonName}
              onChange={(e) => updateField("buttonName", e.target.value)}
              className="border-slate-200 bg-white text-slate-800 focus:border-indigo-500 transition-colors"
              placeholder="e.g. Get Started"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <LinkIcon size={14} /> Button Path
            </Label>
            <Input
              value={formData.buttonPath}
              onChange={(e) => updateField("buttonPath", e.target.value)}
              className="border-slate-200 bg-white text-slate-800 focus:border-indigo-500 transition-colors"
              placeholder="e.g. /about or https://google.com"
            />
          </div>

          <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <div className="space-y-0.5">
              <Label className="text-slate-700">Open in New Tab</Label>
              <p className="text-xs text-slate-500">Should the link open in a new window?</p>
            </div>
            <Switch checked={formData.isNewTab} onCheckedChange={(checked) => updateField("isNewTab", checked)} />
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-slate-600">
                <MousePointer2 size={14} /> Iconography
              </Label>
              <span className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-500">
                {formData.buttonIcon || "No Icon"}
              </span>
            </div>

            <IconPicker
              label="Button icon"
              onChange={(icon) => updateField("buttonIcon", icon)}
              value={formData.buttonIcon}
            />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                className="border-slate-200 bg-white pl-9 text-slate-800 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="h-64 overflow-y-auto rounded-sm border border-slate-200 bg-slate-50 p-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredIcons.map((iconName) => {
                    const IconComp = iconMap[iconName];
                    if (!IconComp) return null;
                    const isActive = formData.buttonIcon === iconName;

                    return (
                      <button
                        key={iconName}
                        onClick={() => updateField("buttonIcon", iconName)}
                        className={cn(
                          "group relative aspect-square flex flex-col items-center justify-center rounded-sm border transition-all duration-200",
                          isActive
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] scale-105 z-10"
                            : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
                        )}
                        title={iconName}
                      >
                        <IconComp size={18} strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                  <Search className="w-6 h-6 opacity-20" />
                  No icons found matching &quot;{iconSearch}&quot;
                </div>
              )}
            </div>
            <div className="flex justify-between px-1 text-[10px] text-slate-500">
              <span>Selected: {formData.buttonIcon || "None"}</span>
              <span>Total Available: {filteredIcons.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection16;
