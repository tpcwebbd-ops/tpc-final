/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  defaultDataSection19,
  defaultLayout,
  ITagItem,
  Section19Data,
  STYLE_PRESETS,
  Section19FormProps,
  Section19Payload,
  TagStyle,
} from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Clock = iconMap.Clock;
const Layout = iconMap.Layout;
const Tag = iconMap.Tag;
const LinkIcon = iconMap.Link;
const Palette = iconMap.Palette;
const Settings2 = iconMap.Settings;
const RotateCcw = iconMap.RotateCcw;

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-10">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-4 w-full bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-4 w-full bg-gradient-to-t from-slate-100 to-transparent" />
    </div>
  );
};

const ModernInput = ({
  icon: Icon,
  ...props
}: { icon?: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative group flex-1">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
    )}
    <Input
      {...props}
      className={cn(
        "w-full border-slate-200 bg-white text-slate-800 focus:border-blue-500",
        Icon ? "pl-9 pr-3" : "px-3",
      )}
    />
  </div>
);

const MutationTagSlider19 = ({ data, onChange }: Section19FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section19Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection19, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section19Data>(() => ({
    ...initialPayload,
    tags: initialPayload.tags ?? defaultDataSection19.tags,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");

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

  const updateField = (field: keyof Section19Data, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const newTag: ITagItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: "New Topic",
      link: "",
    };
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const updateTag = (index: number, field: keyof ITagItem, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = { ...newTags[index], [field]: value };
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const handleReset = () => {
    setFormData(defaultDataSection19);
  };

  return (
    <div className="custom-parent-border mx-auto flex min-h-[600px] w-full max-w-7xl flex-col overflow-hidden border-x border-[#eadfca] bg-white font-sans text-stone-800 shadow-sm">
      <div className="relative flex min-h-[600px] flex-col bg-slate-50">
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab("content")}
            className={cn(
              "flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
              activeTab === "content"
                ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            <Tag size={14} /> Manage Tags
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
              activeTab === "settings"
                ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            <Settings2 size={14} /> Configuration
          </button>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-white p-4">
              <div className="border-l-2 border-amber-300 pl-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Layout spacing</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Adjust the horizontal and vertical breathing room for the tag slider.
                </p>
              </div>
              <div className="grid gap-4">
                {(["paddingX", "paddingY"] as const).map((field) => {
                  const value = field === "paddingX" ? paddingX : paddingY;
                  const label = field === "paddingX" ? "Padding X" : "Padding Y";
                  return (
                    <div className="rounded-sm border border-slate-200 bg-slate-50 p-3" key={field}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <Label className="text-sm font-medium text-slate-700">{label}</Label>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-700">
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
                      <Input
                        aria-label={`${label} manual value`}
                        className="mt-3 h-10 border-slate-200 bg-white text-slate-900"
                        max={300}
                        min={-300}
                        onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                        step={1}
                        type="number"
                        value={value}
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
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-blue-700"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {activeTab === "content" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Total: {formData.tags.length} tags</span>
                  <Button onClick={addTag} size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus size={12} className="mr-1" /> Add Tag
                  </Button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {formData.tags.map((tag, index) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group flex items-start gap-3 rounded-sm border border-slate-200 bg-white p-3 transition-all hover:border-blue-300"
                      >
                        <div className="grid flex-1 grid-cols-1 gap-3">
                          <ModernInput
                            icon={Tag}
                            value={tag.text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTag(index, "text", e.target.value)
                            }
                            placeholder="Label"
                          />
                          <ModernInput
                            icon={LinkIcon}
                            value={tag.link}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTag(index, "link", e.target.value)
                            }
                            placeholder="#"
                          />
                        </div>
                        <button
                          onClick={() => removeTag(index)}
                          className="self-center rounded-sm p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {formData.tags.length === 0 && (
                    <div className="rounded-sm border-2 border-dashed border-slate-200 py-8 text-center text-xs text-slate-500">
                      List is empty.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Palette size={14} /> Visual Style
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.keys(STYLE_PRESETS).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateField("tagStyle", style)}
                        className={cn(
                          "group relative h-14 overflow-hidden rounded-sm border transition-all",
                          formData.tagStyle === style
                            ? "border-blue-500 ring-1 ring-blue-500/50"
                            : "border-slate-200 hover:border-blue-300",
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <div
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              STYLE_PRESETS[style as TagStyle],
                            )}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="h-px w-full bg-slate-200" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Layout size={14} /> Layout
                  </Label>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Tags per View</span>
                      <Select
                        value={String(formData.itemsPerSlide)}
                        onValueChange={(val) => updateField("itemsPerSlide", parseInt(val))}
                      >
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Item{n > 1 && "s"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Navigation Position</span>
                      <Select value={formData.navPosition} onValueChange={(val) => updateField("navPosition", val)}>
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hidden">Hidden (Auto only)</SelectItem>
                          <SelectItem value="middle-outside">Middle Arrows</SelectItem>
                          <SelectItem value="bottom-outside">Bottom Arrows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Clock size={14} /> Behavior
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                      <div className="text-xs">
                        <p className="font-medium text-slate-700">Autoplay</p>
                        <p className="text-slate-500">Automatically scroll tags</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2 py-1">
                          <Input
                            type="number"
                            value={formData.autoplaySpeed}
                            onChange={(e) => updateField("autoplaySpeed", parseInt(e.target.value))}
                            className="h-6 w-12 border-none bg-transparent p-0 text-right text-xs text-slate-800 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-500">ms</span>
                        </div>
                        <Switch checked={formData.isAutoplay} onCheckedChange={(c) => updateField("isAutoplay", c)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                        <span className="text-xs text-slate-700">Infinite Loop</span>
                        <Switch
                          checked={formData.infiniteLoop}
                          onCheckedChange={(c) => updateField("infiniteLoop", c)}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                        <span className="text-xs text-slate-700">Pause on Hover</span>
                        <Switch
                          checked={formData.pauseOnHover}
                          onCheckedChange={(c) => updateField("pauseOnHover", c)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationTagSlider19;
