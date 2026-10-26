/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import {
  AlignLeft as AlignLeftIcon,
  Megaphone as MegaphoneIcon,
  MousePointerClick as MousePointerClickIcon,
  Type as TypeIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection8, Section8Data } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Megaphone = MegaphoneIcon;
const Type = TypeIcon;
const MousePointerClick = MousePointerClickIcon;
const Sparkles = iconComponent("Sparkles");
const LayoutTemplate = iconComponent("Layout");
const LinkIcon = iconComponent("Link");
const AlignLeft = AlignLeftIcon;
const Globe = iconComponent("Globe");

export interface Section8FormProps {
  data?: Section8Data;
  onChange?: (values: Section8Data) => void;
}

const MutationSection8 = ({ data, onChange }: Section8FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section8Data>(() => ({ ...defaultDataSection8, ...data }));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const handleChange = (field: keyof Section8Data, value: string) => {
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
            <Megaphone className="text-indigo-600" size={24} />
          </div>
          <div className="z-10">
            <h2 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-xl font-bold text-transparent">
              Call to Action
            </h2>
            <p className="text-sm text-slate-600">Manage final section content and triggers.</p>
          </div>
        </div>

        <div className="mx-6 mt-6 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public call-to-action section.
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
                <LayoutTemplate size={16} /> Content Configuration
              </h3>

              <div className="space-y-5 rounded-sm border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <Type size={14} /> Heading Title
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="bg-white border-slate-200 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Be The Next Story"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <AlignLeft size={14} /> Subtitle Description
                  </Label>
                  <div className="relative group/input">
                    <Textarea
                      value={formData.subTitle}
                      onChange={(e) => handleChange("subTitle", e.target.value)}
                      className="min-h-[9rem] w-full bg-white border-slate-200 p-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 rounded-md resize-none placeholder:text-slate-500 text-sm"
                      placeholder="Enter a compelling description..."
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-200/50" />

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <MousePointerClick size={14} /> Button Label
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.buttonText}
                      onChange={(e) => handleChange("buttonText", e.target.value)}
                      className="bg-white border-slate-200 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Apply Now"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-slate-600 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <LinkIcon size={14} /> Button URL
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.buttonUrl}
                      onChange={(e) => handleChange("buttonUrl", e.target.value)}
                      className="bg-white border-slate-200 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 font-mono text-xs text-indigo-700"
                      placeholder="https://"
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
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/20 rounded-t-xl">
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.12),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.8))]" />

                <div
                  className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(79,70,229,0.12) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                />

                <div className="relative z-10 text-center space-y-8 max-w-xl mx-auto">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-2xl">
                      {formData.title || "Your Title Here"}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 font-light leading-relaxed">
                      {formData.subTitle || "Your engaging subtitle description goes here."}
                    </p>
                  </div>

                  <div className="flex justify-center flex-col items-center gap-4">
                    <button
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="relative group px-8 py-4 bg-white text-stone-900 font-bold text-lg rounded-sm overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {formData.buttonText || "Button Text"}
                        <Megaphone
                          size={18}
                          className={`transition-transform duration-300 ease-out ${isHovered ? "rotate-[-15deg] scale-110 translate-x-1" : ""}`}
                        />
                      </span>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-indigo-300 via-violet-200 to-indigo-300 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
                      />
                    </button>

                    {formData.buttonUrl && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono bg-white/50 px-3 py-1 rounded-full border border-slate-200">
                        <LinkIcon size={10} />
                        <span className="truncate max-w-[200px]">{formData.buttonUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection8;
