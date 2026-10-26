/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import {
  Columns3 as ColumnsIcon,
  Film as FilmIcon,
  Grid2X2 as GridIcon,
  Images as ImagesIcon,
  Move as MoveIcon,
} from "lucide-react";
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

import {
  defaultDataSection21,
  defaultLayout,
  Section21FormProps,
  Section21Payload,
  Section21Data,
  IGalleryItem,
} from "./data";

const Film = FilmIcon;
const Plus = iconMap.Plus;
const Move = MoveIcon;
const Images = ImagesIcon;
const Trash2 = iconMap.Trash2;
const Columns = ColumnsIcon;
const Sparkles = iconMap.Sparkles;
const RotateCcw = iconMap.RotateCcw;
const Settings2 = iconMap.Settings;
const Maximize2 = iconMap.Maximize;
const LayoutGrid = GridIcon;
const LayoutTemplate = iconMap.Layout;
const ImageIcon = iconMap.Image;

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-20">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-4 w-full bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-4 w-full bg-gradient-to-t from-slate-100 to-transparent" />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutCard = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex flex-col items-center justify-center gap-3 rounded-sm border p-4 transition-all duration-200",
      active
        ? "bg-blue-600/10 border-blue-500 text-blue-400 ring-1 ring-blue-500/50"
        : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
    )}
  >
    <Icon size={24} className="transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const MutationSection21 = ({ data, onChange }: Section21FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section21Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection21, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section21Data>(() => ({
    ...initialPayload,
    images: initialPayload.images ?? defaultDataSection21.images,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
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

  const updateField = (field: keyof Section21Data, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    const newImg: IGalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: "",
      caption: "New Capture",
    };
    setFormData((prev) => ({ ...prev, images: [...prev.images, newImg] }));
    setActiveImageIndex(formData.images.length);
  };

  const removeImage = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    if (activeImageIndex >= newImages.length) setActiveImageIndex(Math.max(0, newImages.length - 1));
  };

  const updateImage = (index: number, field: keyof IGalleryItem, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const activeImage = formData.images[activeImageIndex];

  const handleReset = () => {
    setFormData(defaultDataSection21);
  };

  return (
    <div className="custom-parent-border min-h-[700px] w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white text-stone-800 font-sans flex flex-col lg:flex-row overflow-hidden shadow-sm">
      <div className="w-full bg-slate-50 relative flex flex-col h-[600px] lg:h-auto">
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
            <Images size={14} /> Content
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
            <Settings2 size={14} /> Settings
          </button>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-white p-4">
              <div className="border-l-2 border-amber-300 pl-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Layout spacing</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Adjust the horizontal and vertical breathing room for the gallery.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Select Image</Label>
                    <button
                      onClick={addImage}
                      className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap pb-2 scrollbar-hide">
                    {formData.images.map((img, idx) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-all",
                          activeImageIndex === idx
                            ? "border-blue-500 ring-2 ring-blue-500/20"
                            : "border-slate-200 hover:border-blue-300",
                        )}
                      >
                        {img.url ? (
                          <Image
                            alt={img.caption || "Hero Image"}
                            width={200}
                            height={200}
                            src={img.url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] px-1 truncate text-center py-0.5">
                          {idx + 1}
                        </div>
                        {formData.images.length > 1 && (
                          <button
                            onClick={(e) => removeImage(idx, e)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addImage}
                      className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-sm border border-dashed border-slate-300 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-200" />

                {activeImage ? (
                  <motion.div
                    key={activeImage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Source File
                      </Label>
                      <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
                        <div className="grid aspect-video w-full max-w-xs place-items-center overflow-hidden rounded-sm bg-slate-100">
                          {activeImage.url ? (
                            <Image
                              alt={activeImage.caption || "Gallery image preview"}
                              className="h-full w-full object-cover"
                              src={activeImage.url}
                              height={320}
                              width={560}
                            />
                          ) : (
                            <span className="text-xs text-slate-500">No image selected</span>
                          )}
                        </div>
                        <button
                          className="w-fit rounded-sm bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                          onClick={() => setImagePickerOpen(true)}
                          type="button"
                        >
                          {activeImage.url ? "Edit image" : "Choose image"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Caption</Label>
                      <Input
                        value={activeImage.caption}
                        onChange={(e) => updateImage(activeImageIndex, "caption", e.target.value)}
                        className="w-full border-slate-200 bg-white text-slate-800 focus:border-blue-500"
                        placeholder="Describe this image..."
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-10 text-center text-slate-500">No images selected.</div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <LayoutTemplate size={14} /> Layout Structure
                  </Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <LayoutCard
                      active={formData.layout === "grid"}
                      onClick={() => updateField("layout", "grid")}
                      icon={LayoutGrid}
                      label="Grid"
                    />
                    <LayoutCard
                      active={formData.layout === "masonry"}
                      onClick={() => updateField("layout", "masonry")}
                      icon={LayoutGrid}
                      label="Masonry"
                    />
                    <LayoutCard
                      active={formData.layout === "bento"}
                      onClick={() => updateField("layout", "bento")}
                      icon={LayoutTemplate}
                      label="Bento"
                    />
                    <LayoutCard
                      active={formData.layout === "filmstrip"}
                      onClick={() => updateField("layout", "filmstrip")}
                      icon={Film}
                      label="Strip"
                    />
                  </div>
                </section>

                <div className="h-px w-full bg-slate-200" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Move size={14} /> Sizing & Spacing
                  </Label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Columns size={10} /> Grid Columns
                      </span>
                      <Select
                        value={String(formData.columns)}
                        onValueChange={(val) => updateField("columns", parseInt(val))}
                      >
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Cols
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Maximize2 size={10} /> Aspect Ratio
                      </span>
                      <Select value={formData.aspectRatio} onValueChange={(val) => updateField("aspectRatio", val)}>
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Original</SelectItem>
                          <SelectItem value="square">Square (1:1)</SelectItem>
                          <SelectItem value="video">Video (16:9)</SelectItem>
                          <SelectItem value="portrait">Portrait (3:4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Gap Size</span>
                      <div className="grid grid-cols-4 gap-1 rounded-sm border border-slate-200 bg-white p-1">
                        {["none", "sm", "md", "lg"].map((g) => (
                          <button
                            key={g}
                            onClick={() => updateField("gap", g)}
                            className={cn(
                              "rounded-sm py-1 text-[10px] uppercase transition-all",
                              formData.gap === g
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Rounded Corners</span>
                      <div className="grid grid-cols-5 gap-1 rounded-sm border border-slate-200 bg-white p-1">
                        {["none", "sm", "md", "lg", "xl"].map((r) => (
                          <button
                            key={r}
                            onClick={() => updateField("rounded", r)}
                            className={cn(
                              "rounded-sm py-1 text-[10px] uppercase transition-all",
                              formData.rounded === r
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
                            )}
                          >
                            {r === "none" ? "0" : r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Sparkles size={14} /> Effects
                  </Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Hover Effect</span>
                      <Select value={formData.hoverEffect} onValueChange={(val) => updateField("hoverEffect", val)}>
                        <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="zoom">Zoom In</SelectItem>
                          <SelectItem value="overlay">Dark Overlay</SelectItem>
                          <SelectItem value="grayscale">Grayscale Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-6 flex items-center justify-between rounded-sm border border-slate-200 bg-white p-2">
                      <span className="pl-2 text-xs text-slate-700">Show Captions</span>
                      <Switch checked={formData.showCaption} onCheckedChange={(c) => updateField("showCaption", c)} />
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
      {imagePickerOpen && activeImage && (
        <ImagePickerModal
          close={() => setImagePickerOpen(false)}
          onSelect={(url) => {
            updateImage(activeImageIndex, "url", url);
            setImagePickerOpen(false);
          }}
          selectedUrl={activeImage.url}
          title="Choose gallery image"
          uploadLabel="Upload gallery image"
        />
      )}
    </div>
  );
};

export default MutationSection21;
