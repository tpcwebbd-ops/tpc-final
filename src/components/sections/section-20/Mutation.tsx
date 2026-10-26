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
  Grid2X2 as GridIcon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  defaultDataSection20,
  defaultLayout,
  ILogoItem,
  Section20Data,
  Section20FormProps,
  Section20Payload,
} from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Clock = iconMap.Clock;
const Monitor = MonitorIcon;
const Smartphone = SmartphoneIcon;
const Tablet = TabletIcon;
const Grid = GridIcon;
const LinkIcon = iconMap.Link;
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
  label,
  ...props
}: { icon?: React.ElementType; label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    {label && <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</Label>}
    <div className="relative group">
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
  </div>
);

const DeviceControl = ({
  icon: Icon,
  label,
  value,
  onChange,
  min,
  max,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}) => (
  <div className="flex flex-col items-center gap-3 rounded-sm border border-slate-200 bg-white p-3 transition-colors hover:border-blue-300">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon size={14} />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-center gap-3 w-full">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
      >
        -
      </button>
      <div className="flex-1 text-center font-mono text-lg font-bold text-slate-800">{value}</div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-6 w-6 items-center justify-center rounded-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
      >
        +
      </button>
    </div>
    <span className="text-[9px] text-slate-400">Columns</span>
  </div>
);

const MutationSection20 = ({ data, onChange }: Section20FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section20Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection20, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section20Data>(() => ({
    ...initialPayload,
    logos: initialPayload.logos ?? defaultDataSection20.logos,
    responsive: initialPayload.responsive ?? defaultDataSection20.responsive,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeLogoIndex, setActiveLogoIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"assets" | "settings">("assets");
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

  const updateField = (field: keyof Section20Data, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateResponsive = (device: "mobile" | "tablet" | "desktop", value: number) => {
    setFormData((prev) => ({
      ...prev,
      responsive: { ...prev.responsive, [device]: value },
    }));
  };

  const addLogo = () => {
    const newLogo: ILogoItem = {
      id: Math.random().toString(36).substr(2, 9),
      image: "",
      alt: "Partner",
      link: "",
    };
    setFormData((prev) => ({ ...prev, logos: [...prev.logos, newLogo] }));
    setActiveLogoIndex(formData.logos.length);
  };

  const removeLogo = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newLogos = formData.logos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, logos: newLogos }));
    if (activeLogoIndex >= newLogos.length) setActiveLogoIndex(Math.max(0, newLogos.length - 1));
  };

  const updateLogo = (index: number, field: keyof ILogoItem, value: string) => {
    const newLogos = [...formData.logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    setFormData((prev) => ({ ...prev, logos: newLogos }));
  };

  const activeLogo = formData.logos[activeLogoIndex];

  const handleReset = () => {
    setFormData(defaultDataSection20);
  };

  return (
    <div className="custom-parent-border mx-auto flex min-h-[600px] w-full max-w-7xl flex-col overflow-hidden border-x border-[#eadfca] bg-white font-sans text-stone-800 shadow-sm">
      <div className="relative flex min-h-[600px] flex-col bg-slate-50">
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab("assets")}
            className={cn(
              "flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
              activeTab === "assets"
                ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            <Grid size={14} /> Logos
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
                  Adjust the horizontal and vertical breathing room for the logo strip.
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

            {activeTab === "assets" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Manage Client Logos</span>
                  <Button onClick={addLogo} size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus size={12} className="mr-1" /> Add Logo
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {formData.logos.map((logo, idx) => (
                    <button
                      key={logo.id}
                      onClick={() => setActiveLogoIndex(idx)}
                      className={cn(
                        "group relative h-24 w-full overflow-hidden rounded-sm border transition-all",
                        activeLogoIndex === idx
                          ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50"
                          : "border-slate-200 bg-white hover:border-blue-300",
                      )}
                    >
                      {logo.image ? (
                        <Image
                          src={logo.image}
                          alt="Logo"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <span className="text-[9px] font-bold">{idx + 1}</span>
                        </div>
                      )}
                      <div
                        onClick={(e) => removeLogo(idx, e)}
                        className="absolute right-0.5 top-0.5 rounded-sm bg-red-500 p-1 text-white opacity-0 transition-all hover:bg-red-600 group-hover:opacity-100"
                      >
                        <Trash2 size={10} />
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={addLogo}
                    className="flex h-16 items-center justify-center rounded-sm border border-dashed border-slate-300 text-slate-400 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="h-px w-full bg-slate-200" />

                {activeLogo ? (
                  <motion.div
                    key={activeLogo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5 rounded-sm border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-blue-600 text-[10px] font-bold text-white">
                        {activeLogoIndex + 1}
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-600">Editing Selection</span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Logo File</Label>
                      <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3">
                        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-sm bg-white">
                          {activeLogo.image ? (
                            <Image
                              alt={activeLogo.alt || "Logo preview"}
                              className="object-contain p-4"
                              fill
                              src={activeLogo.image}
                            />
                          ) : (
                            <Grid className="text-slate-400" size={28} />
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

                    <div className="grid grid-cols-1 gap-4">
                      <ModernInput
                        label="Alt Text"
                        value={activeLogo.alt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateLogo(activeLogoIndex, "alt", e.target.value)
                        }
                        placeholder="Company Name"
                      />
                      <ModernInput
                        label="External Link"
                        icon={LinkIcon}
                        value={activeLogo.link}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateLogo(activeLogoIndex, "link", e.target.value)
                        }
                        placeholder="https://"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-10 text-center text-sm text-slate-500">Select a logo above to edit details.</div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Monitor size={14} /> Responsive Columns
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <DeviceControl
                      icon={Smartphone}
                      label="Mobile"
                      value={formData.responsive.mobile}
                      min={1}
                      max={3}
                      onChange={(v: number) => updateResponsive("mobile", v)}
                    />
                    <DeviceControl
                      icon={Tablet}
                      label="Tablet"
                      value={formData.responsive.tablet}
                      min={2}
                      max={5}
                      onChange={(v: number) => updateResponsive("tablet", v)}
                    />
                    <DeviceControl
                      icon={Monitor}
                      label="Desktop"
                      value={formData.responsive.desktop}
                      min={3}
                      max={8}
                      onChange={(v: number) => updateResponsive("desktop", v)}
                    />
                  </div>
                </section>

                <div className="h-px w-full bg-slate-200" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600">
                    <Clock size={14} /> Behavior & Styles
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700">Autoplay Speed</p>
                        <p className="text-[10px] text-slate-500">Delay between slides</p>
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
                      <div
                        className={cn(
                          "flex items-center justify-between rounded-sm border p-3 cursor-pointer transition-all",
                          formData.grayscale ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white",
                        )}
                      >
                        <span className="text-xs text-slate-700">Grayscale</span>
                        <Switch checked={formData.grayscale} onCheckedChange={(c) => updateField("grayscale", c)} />
                      </div>

                      <div className="flex cursor-pointer items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                        <span className="text-xs text-slate-700">Pause Hover</span>
                        <Switch
                          checked={formData.pauseOnHover}
                          onCheckedChange={(c) => updateField("pauseOnHover", c)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <span className="text-xs text-slate-500">Navigation Controls</span>
                  <Select value={formData.navPosition} onValueChange={(val) => updateField("navPosition", val)}>
                    <SelectTrigger className="border-slate-200 bg-white text-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hidden">Hidden (Auto scroll only)</SelectItem>
                      <SelectItem value="middle-outside">Middle Arrows</SelectItem>
                      <SelectItem value="bottom-outside">Bottom Arrows</SelectItem>
                    </SelectContent>
                  </Select>
                </section>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {mediaPickerOpen && activeLogo && (
        <ImagePickerModal
          close={() => setMediaPickerOpen(false)}
          description="Select an existing logo or upload a new image."
          onSelect={(url) => {
            updateLogo(activeLogoIndex, "image", url);
            setMediaPickerOpen(false);
          }}
          title="Choose logo"
          uploadLabel="Upload logo"
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationSection20;
