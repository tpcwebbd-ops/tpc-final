/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import { defaultDataSection17, Section17Data, Section17FormProps, Section17Payload, defaultLayout } from "./data";

const Layout = iconMap.Layout;
const Type = iconMap.FileText;
const Palette = iconMap.Palette;
const MousePointer2 = iconMap.Target;
const LinkIcon = iconMap.Link;
const ExternalLink = iconMap.ExternalLink;
const Check = iconMap.Check;
const RotateCcw = iconMap.RotateCcw;
const Search = iconMap.Search;

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth">{children}</div>

      <div className="pointer-events-none absolute top-0 left-0 z-10 h-4 w-full bg-gradient-to-b from-slate-100/80 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-4 w-full bg-gradient-to-t from-slate-100/80 to-transparent" />
    </div>
  );
};

const ModernInput = ({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  placeholder?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="group relative">
      <div
        className={cn(
          "flex items-center rounded-sm border border-slate-200 bg-white overflow-hidden transition-all duration-300",
          focused ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "hover:border-blue-300",
        )}
      >
        <div className="pl-3 text-slate-500">
          {Icon && <Icon size={16} className={focused ? "text-blue-400" : ""} />}
        </div>
        <Input
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          className="w-full border-none bg-transparent p-3 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 focus-visible:ring-0"
        />
      </div>
      <Label
        className={cn(
          "absolute left-10 pointer-events-none transition-all duration-200",
          focused || value
            ? "-top-2.5 bg-white px-1 text-[10px] font-bold text-blue-600"
            : "top-3 text-sm text-slate-500",
        )}
      >
        {label}
      </Label>
    </div>
  );
};

const MutationSection17 = ({
  data,
  onChange,
}: Omit<Section17FormProps, "onSubmit"> & {
  onChange?: (values: Section17Data | Section17Payload) => void;
}) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section17Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection17, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section17Data>(() => ({
    id: "section-uid-17",
    sectionUid: "section-uid-17",
    buttonName: initialPayload.buttonName,
    buttonIcon: initialPayload.buttonIcon,
    buttonPath: initialPayload.buttonPath,
    isNewTab: initialPayload.isNewTab,
    buttonSize: initialPayload.buttonSize,
    buttonWidth: initialPayload.buttonWidth,
    buttonVariant: initialPayload.buttonVariant,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeTab, setActiveTab] = useState<"Standard" | "Solid" | "Outline" | "Neon">("Standard");

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

  const updateField = (field: keyof Section17Data, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const variantGroups = {
    Standard: ["default", "destructive", "outline", "ghost", "link", "secondary"],
    Solid: ["garden", "fire", "water"],
    Outline: ["outlineGarden", "outlineFire", "outlineWater"],
    Neon: ["neonBlue", "neonPink", "neonGreen", "neonPurple"],
  };

  const handleReset = () => {
    setFormData(defaultDataSection17);
    setIconSearch("");
  };

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions;
    return iconOptions.filter((name) => name.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  return (
    <div className="custom-parent-border min-h-[600px] w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white text-stone-800 font-sans flex flex-col lg:flex-row overflow-hidden shadow-sm">
      <div className="flex-1 bg-slate-50 relative h-[600px] lg:h-auto">
        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 pb-24 space-y-8 max-w-2xl mx-auto">
            <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-white p-4">
              <div className="border-l-2 border-amber-300 pl-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Layout spacing</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Adjust the public button section breathing room.
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

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
                <Type size={14} /> Content
              </h3>
              <div className="space-y-4">
                <ModernInput
                  label="Button Text"
                  value={formData.buttonName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("buttonName", e.target.value)}
                  icon={Type}
                  placeholder="e.g. Explore Now"
                />
                <ModernInput
                  label="Destination Path"
                  value={formData.buttonPath}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("buttonPath", e.target.value)}
                  icon={LinkIcon}
                  placeholder="/pages/..."
                />
                <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-sm bg-blue-50 p-2 text-blue-600">
                      <ExternalLink size={16} />
                    </div>
                    <span className="text-sm text-slate-700">Open in New Tab</span>
                  </div>
                  <Switch checked={formData.isNewTab} onCheckedChange={(c) => updateField("isNewTab", c)} />
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-slate-200" />

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
                <Layout size={14} /> Layout
              </h3>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-xs text-slate-500">Width Mode</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {["auto", "fixed-sm", "fixed-md", "fixed-lg", "full"].map((w) => (
                      <button
                        key={w}
                        onClick={() => updateField("buttonWidth", w)}
                        className={cn(
                          "rounded-sm border px-1 py-2 text-[10px] transition-all",
                          formData.buttonWidth === w
                            ? "bg-blue-500/10 border-blue-500 text-blue-400 font-semibold"
                            : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50",
                        )}
                      >
                        {w.replace("fixed-", "")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-xs text-slate-500">Size Scale</Label>
                  <div className="flex items-end gap-2 rounded-sm border border-slate-200 bg-white p-2">
                    {["xs", "sm", "default", "lg", "xl"].map((s, idx) => (
                      <button
                        key={s}
                        onClick={() => updateField("buttonSize", s)}
                        className={cn(
                          "flex-1 rounded-sm transition-all flex flex-col items-center justify-end pb-2 hover:bg-blue-50",
                          formData.buttonSize === s ? "bg-blue-50 text-blue-700 shadow-inner" : "text-slate-500",
                        )}
                        style={{ height: 30 + idx * 8 + "px" }}
                      >
                        <span className="text-[10px] font-medium uppercase">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-slate-200" />

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
                <Palette size={14} /> Aesthetics
              </h3>

              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {Object.keys(variantGroups).map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveTab(group as keyof typeof variantGroups)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                      activeTab === group
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-700",
                    )}
                  >
                    {group}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <AnimatePresence mode="sync">
                  {variantGroups[activeTab].map((variant) => (
                    <motion.div
                      key={variant}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => updateField("buttonVariant", variant)}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden rounded-sm border p-3 transition-all duration-300",
                        formData.buttonVariant === variant
                          ? "bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/50"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            formData.buttonVariant === variant ? "bg-blue-400 shadow-[0_0_8px_blue]" : "bg-slate-300",
                          )}
                        />
                        {formData.buttonVariant === variant && <Check size={12} className="text-blue-400" />}
                      </div>
                      <p
                        className={cn(
                          "text-xs font-medium capitalize",
                          formData.buttonVariant === variant ? "text-blue-700" : "text-slate-500",
                        )}
                      >
                        {variant.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            <div className="h-px w-full bg-slate-200" />

            <section>
              <h3 className="mb-4 flex items-center justify-between gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
                <div className="flex items-center gap-2">
                  <MousePointer2 size={14} /> Iconography
                </div>
                <div className="text-[10px] font-normal text-slate-500">
                  {formData.buttonIcon || "No icon selected"}
                </div>
              </h3>

              <IconPicker
                label="Button icon"
                onChange={(icon) => updateField("buttonIcon", icon)}
                value={formData.buttonIcon}
              />

              <div className="mb-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full rounded-sm border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="rounded-sm border border-slate-200 bg-white p-3">
                {filteredIcons.length > 0 ? (
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {filteredIcons.map((iconName) => {
                      const IconComp = iconMap[iconName];
                      if (!IconComp) return null;

                      const isActive = formData.buttonIcon === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => updateField("buttonIcon", iconName)}
                          className={cn(
                            "group/icon relative aspect-square flex flex-col items-center justify-center rounded-sm transition-all duration-200",
                            isActive
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105 z-10"
                              : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-700 hover:scale-105",
                          )}
                          title={iconName}
                        >
                          <IconComp size={18} strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No icons found for &quot;{iconSearch}&quot;
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-500">
                  <span>Showing {filteredIcons.length} icons</span>
                  {iconSearch === "" && <span>Search to see more</span>}
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        /* Thin scrollbar for icon area */
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default MutationSection17;
