/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import { Layers as LayersIcon, MoveHorizontal as MoveHorizontalIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataSection18,
  defaultLayout,
  ISlideItem,
  Section18Data,
  Section18FormProps,
  Section18Payload,
} from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Clock = iconMap.Clock;
const Layout = iconMap.Layout;
const MoveHorizontal = MoveHorizontalIcon;
const ImageIcon = iconMap.Image;
const Play = iconMap.Play;
const Pause = iconMap.Pause;
const Settings2 = iconMap.Settings;
const Layers = LayersIcon;
const RotateCcw = iconMap.RotateCcw;

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-20">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-4 w-full bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-4 w-full bg-gradient-to-t from-slate-100 to-transparent" />
    </div>
  );
};

const ModernInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border-slate-200 bg-white text-slate-800 focus:border-blue-500"
    />
  </div>
);

const MutationSection18 = ({ data, onChange }: Section18FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section18Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection18, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section18Data>(() => ({
    ...initialPayload,
    slides: initialPayload.slides ?? defaultDataSection18.slides,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

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

  const updateField = (field: keyof Section18Data, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSlide = () => {
    const newSlide: ISlideItem = {
      id: Math.random().toString(36).substr(2, 9),
      image: "",
      title: `New collection ${formData.slides.length + 1}`,
      description: "Write a clear, customer-focused reason to explore this collection.",
    };
    setFormData((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setActiveSlideIndex(formData.slides.length);
  };

  const removeSlide = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSlides = formData.slides.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, slides: newSlides }));
    if (activeSlideIndex >= newSlides.length) {
      setActiveSlideIndex(Math.max(0, newSlides.length - 1));
    }
  };

  const updateSlide = (index: number, field: keyof ISlideItem, value: string) => {
    const newSlides = [...formData.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setFormData((prev) => ({ ...prev, slides: newSlides }));
  };

  const currentSlideData = formData.slides[activeSlideIndex];

  const handleReset = () => {
    setFormData(defaultDataSection18);
  };

  return (
    <div className="custom-parent-border mx-auto flex min-h-[700px] w-full max-w-7xl flex-col overflow-hidden border-x border-[#eadfca] bg-white font-sans text-stone-800 shadow-sm">
      <div className="relative flex min-h-[700px] flex-col bg-slate-50">
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
            <Layers size={14} /> Slide Content
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
            <Settings2 size={14} /> Global Settings
          </button>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-white p-4">
              <div className="border-l-2 border-amber-300 pl-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Layout spacing</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Adjust the horizontal and vertical breathing room for the slider.
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Select Slide to Edit</Label>
                    <button
                      onClick={addSlide}
                      className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {formData.slides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        onClick={() => {
                          setActiveSlideIndex(idx);
                        }}
                        className={cn(
                          "relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-all",
                          activeSlideIndex === idx
                            ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                            : "border-slate-200 hover:border-blue-300",
                        )}
                      >
                        {slide.image ? (
                          <Image
                            src={slide.image}
                            alt={`Slide ${idx + 1}`}
                            width={96}
                            height={64}
                            loading="eager"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 truncate bg-white/90 px-1 text-[9px] text-slate-700">
                          #{idx + 1}
                        </div>
                        {formData.slides.length > 1 && (
                          <button
                            onClick={(e) => removeSlide(idx, e)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 hover:opacity-100"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addSlide}
                      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm border border-dashed border-slate-300 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-200" />

                {currentSlideData ? (
                  <motion.div
                    key={currentSlideData.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Slide Image
                      </Label>
                      <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-3">
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-slate-50">
                          {currentSlideData.image ? (
                            <Image
                              alt={currentSlideData.title || "Slide image preview"}
                              className="object-cover"
                              fill
                              src={currentSlideData.image}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                              <ImageIcon size={28} />
                            </div>
                          )}
                        </div>
                        <button
                          className="rounded-sm border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100"
                          onClick={() => setMediaPickerOpen(true)}
                          type="button"
                        >
                          Edit image
                        </button>
                      </div>
                    </div>

                    <ModernInput
                      label="Heading"
                      value={currentSlideData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateSlide(activeSlideIndex, "title", e.target.value)
                      }
                    />

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Description
                      </Label>
                      <Textarea
                        value={currentSlideData.description}
                        onChange={(e) => updateSlide(activeSlideIndex, "description", e.target.value)}
                        className="min-h-36 w-full resize-y rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-all focus:border-blue-500 focus:outline-none"
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <ModernInput
                        label="Button Text"
                        value={currentSlideData.buttonText || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateSlide(activeSlideIndex, "buttonText", e.target.value)
                        }
                        placeholder="e.g. Shop the collection"
                      />
                      <ModernInput
                        label="Button Link"
                        value={currentSlideData.buttonLink || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateSlide(activeSlideIndex, "buttonLink", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-10 text-center text-slate-500">No slides. Click + to add one.</div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Layout size={14} /> Layout
                  </Label>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Items per View</span>
                      <Select
                        value={String(formData.itemsPerSlide)}
                        onValueChange={(val) => updateField("itemsPerSlide", parseInt(val))}
                      >
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Slide{n > 1 && "s"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Height</span>
                      <Select value={formData.height} onValueChange={(val) => updateField("height", val)}>
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (Aspect Video)</SelectItem>
                          <SelectItem value="fixed-sm">Small (300px)</SelectItem>
                          <SelectItem value="fixed-md">Medium (450px)</SelectItem>
                          <SelectItem value="fixed-lg">Large (600px)</SelectItem>
                          <SelectItem value="screen">Full Screen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-sm border border-slate-200 bg-white p-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Overlay Opacity</span>
                      <span className="text-xs font-mono text-blue-400">{formData.overlayOpacity}%</span>
                    </div>
                    <Slider
                      min={0}
                      max={90}
                      value={[formData.overlayOpacity]}
                      onValueChange={([val]) => updateField("overlayOpacity", val)}
                      className="py-2"
                    />
                  </div>
                </section>

                <div className="h-px w-full bg-slate-200" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Clock size={14} /> Playback
                  </Label>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-sm bg-green-50 p-2",
                            formData.isAutoplay ? "text-green-600" : "text-slate-500",
                          )}
                        >
                          <Play size={16} />
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-slate-700">Autoplay</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={formData.autoplaySpeed}
                              onChange={(e) => updateField("autoplaySpeed", parseInt(e.target.value))}
                              className="h-6 w-16 rounded-sm border border-slate-200 bg-white px-1 py-0.5 text-center text-[10px] text-slate-800"
                            />
                            <span className="text-[10px] text-slate-500">ms delay</span>
                          </div>
                        </div>
                      </div>
                      <Switch checked={formData.isAutoplay} onCheckedChange={(c) => updateField("isAutoplay", c)} />
                    </div>

                    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-sm bg-slate-100 p-2 text-slate-500">
                          <Pause size={16} />
                        </div>
                        <span className="text-xs font-medium text-slate-700">Pause on Hover</span>
                      </div>
                      <Switch checked={formData.pauseOnHover} onCheckedChange={(c) => updateField("pauseOnHover", c)} />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <MoveHorizontal size={14} /> Navigation
                  </Label>
                  <div className="space-y-3">
                    <Select value={formData.navPosition} onValueChange={(val) => updateField("navPosition", val)}>
                      <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="middle-inside">Arrows: Inside Middle</SelectItem>
                        <SelectItem value="middle-outside">Arrows: Outside Middle</SelectItem>
                        <SelectItem value="bottom-overlay">Arrows: Bottom Overlay</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                      <Switch
                        checked={formData.showArrowsOnHover}
                        onCheckedChange={(c) => updateField("showArrowsOnHover", c)}
                      />
                      <span>Only show arrows on hover</span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {mediaPickerOpen && currentSlideData && (
        <ImagePickerModal
          close={() => setMediaPickerOpen(false)}
          description="Select an existing slide image or upload a new one."
          onSelect={(url) => {
            updateSlide(activeSlideIndex, "image", url);
            setMediaPickerOpen(false);
          }}
          title="Choose slide image"
          uploadLabel="Upload slide image"
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationSection18;
