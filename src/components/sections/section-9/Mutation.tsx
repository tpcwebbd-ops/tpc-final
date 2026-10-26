/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { AlignLeft as AlignLeftIcon, Type as TypeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection9, Section9Data } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Type = TypeIcon;
const AlignLeft = AlignLeftIcon;
const MessageSquare = iconComponent("MessageSquare");
const LayoutTemplate = iconComponent("Layout");
const Sparkles = iconComponent("Sparkles");
const Quote = iconComponent("Quote");
const Globe = iconComponent("Globe");

export interface Section9FormProps {
  data?: Section9Data;
  onChange?: (values: Section9Data) => void;
}

const MutationSection9 = ({ data, onChange }: Section9FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section9Data>(() => ({ ...defaultDataSection9, ...data }));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const handleChange = (field: keyof Section9Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  return (
    <div className="custom-parent-border min-h-screen bg-white text-stone-800 font-sans">
      <div className="max-w-7xl overflow-hidden rounded-sm bg-white shadow-sm">
        <div className="relative flex items-center gap-3 overflow-hidden border-b border-slate-200 bg-white p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="z-10 rounded-sm border border-indigo-200 bg-indigo-50 p-2">
            <Quote className="text-indigo-600" size={24} />
          </div>
          <div className="z-10">
            <h2 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-xl font-bold text-transparent">
              Success Stories
            </h2>
            <p className="text-sm text-slate-600">Manage the section introduction content.</p>
          </div>
        </div>

        <div className="mx-6 mt-6 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4 lg:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public stories section.
            </p>
          </div>
          <div className="grid gap-4 lg:min-w-[30rem]">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = formData[field];
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
                    <Input
                      aria-label={`${label} manual value`}
                      className="h-8 w-24 border-indigo-200 bg-white text-right text-xs font-bold tabular-nums text-indigo-700"
                      type="number"
                      min={-300}
                      max={300}
                      step={1}
                      value={value}
                      onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                    />
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

        <div className="p-6 md:p-8 grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Content Settings
              </h3>

              <div className="space-y-5 rounded-sm border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between rounded-sm border border-amber-200 bg-amber-50 p-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-700">Eyebrow visibility</Label>
                    <p className="mt-1 text-xs text-slate-500">Show or hide the public eyebrow label.</p>
                  </div>
                  <Switch
                    aria-label="Show eyebrow"
                    checked={formData.showEyebrow}
                    onCheckedChange={(checked) => setFormData((current) => ({ ...current, showEyebrow: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Eyebrow text</Label>
                  <Input
                    value={formData.eyebrow}
                    onChange={(e) => handleChange("eyebrow", e.target.value)}
                    className="border-slate-200 bg-white"
                    placeholder="Discover"
                  />
                </div>

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <Type size={14} /> Primary Heading
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="bg-white border-slate-200 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Success"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <AlignLeft size={14} /> Sub Heading
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.subTitle}
                      onChange={(e) => handleChange("subTitle", e.target.value)}
                      className="bg-white border-slate-200 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Stories"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <MessageSquare size={14} /> Description
                  </Label>
                  <div className="relative group/input">
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="bg-white border-slate-200 min-h-[9rem] p-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 rounded-md resize-none placeholder:text-slate-500 text-sm leading-relaxed"
                      placeholder="Add a brief description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} /> Live Preview
            </h3>

            <div className="group/preview relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-sm border border-slate-200 bg-slate-50 p-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-xl">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <Globe size={12} />
                  <span>Preview Mode</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="flex-1 rounded-b-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),rgba(255,255,255,0))]" />
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
                />

                <div className="relative z-10 max-w-lg mx-auto text-center px-8">
                  <div className="space-y-2 mb-8">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter drop-shadow-lg">
                      {formData.title || "Title"}
                    </h2>
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 tracking-tighter drop-shadow-md">
                      {formData.subTitle || "Subtitle"}
                    </h2>
                  </div>

                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto rounded-full mb-8" />

                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    {formData.description || "Description text goes here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection9;
