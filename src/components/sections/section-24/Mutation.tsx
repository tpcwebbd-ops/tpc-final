/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { defaultDataSection24, defaultLayout, IFeatureItem, ISection24Data, Section24Payload, IStatItem } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Search = iconMap.Search;
const X = iconMap.X;

export interface SectionFormProps {
  data?: ISection24Data | Section24Payload;
  onChange?: (values: ISection24Data | Section24Payload) => void;
  onSubmit?: (values: ISection24Data | Section24Payload) => void;
}

const MutationSection24 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section24Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection24, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<ISection24Data>(() => ({
    ...initialPayload,
    features: initialPayload.features ?? defaultDataSection24.features,
    stats: initialPayload.stats ?? defaultDataSection24.stats,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [iconPickerFeatureIndex, setIconPickerFeatureIndex] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");

  const normalizedIconOptions = useMemo(() => [...iconOptions].sort((a, b) => a.localeCompare(b)), []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIconPickerFeatureIndex(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection24Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    const newFeature: IFeatureItem = {
      title: "New Feature",
      subtitle: "Feature description",
      iconName: "Zap",
      iconColorClass: "text-blue-500",
      bgColorClass: "bg-blue-100",
    };
    updateField("features", [...formData.features, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    updateField("features", newFeatures);
  };

  const updateFeature = (index: number, field: keyof IFeatureItem, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateField("features", newFeatures);
  };

  const openIconPicker = (index: number) => {
    setIconSearch("");
    setIconPickerFeatureIndex(index);
  };

  const handleAddStat = () => {
    const newStat: IStatItem = { value: "100+", label: "New Stat", colorClass: "text-blue-500" };
    updateField("stats", [...formData.stats, newStat]);
  };

  const handleRemoveStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    updateField("stats", newStats);
  };

  const updateStat = (index: number, field: keyof IStatItem, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateField("stats", newStats);
  };

  const selectedFeature = iconPickerFeatureIndex === null ? null : formData.features[iconPickerFeatureIndex];
  const selectedIconName = selectedFeature?.iconName ?? "Zap";
  const SelectedIcon = iconMap[selectedIconName] ?? iconMap.Zap;
  const filteredIconOptions = normalizedIconOptions.filter((iconName) =>
    iconName.toLowerCase().includes(iconSearch.trim().toLowerCase()),
  );

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#e8d8bd] bg-[#fffaf0] text-[#49352b] font-sans">
      <div className="w-full overflow-hidden rounded-sm border border-[#e8d8bd] bg-[#fffdf8] shadow-[0_14px_35px_rgba(105,66,38,0.08)]">
        <div className="flex items-center gap-3 border-b border-[#eadcc7] bg-gradient-to-r from-[#fff2d9] via-[#fffaf0] to-[#f4efff] p-6">
          <div className="rounded-sm bg-gradient-to-br from-[#f6c86e] to-[#d9874a] p-2 shadow-sm">
            <LayoutTemplate className="text-[#593319]" size={24} />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-[#87451f] via-[#b34e45] to-[#66419a] bg-clip-text text-xl font-bold text-transparent">
              Edit Section 24
            </h2>
            <p className="text-sm text-[#765f50]">Update features, CTA, and statistics.</p>
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          <div className="grid gap-4 rounded-sm border border-[#eadcc7] bg-[#fff5e4] p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="border-l-2 border-[#d78b3d] pl-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8b481d]">Layout spacing</p>
              <p className="mt-1 text-xs leading-5 text-[#765f50]">
                Adjust the horizontal and vertical breathing room around this section.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:min-w-[30rem]">
              {(["paddingX", "paddingY"] as const).map((field) => {
                const value = field === "paddingX" ? paddingX : paddingY;
                const label = field === "paddingX" ? "Padding X" : "Padding Y";
                return (
                  <div className="rounded-sm border border-[#eadcc7] bg-[#fffdf8] p-3" key={field}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Label className="text-sm font-medium text-[#594135]">{label}</Label>
                      <span className="rounded-full bg-[#f2e8ff] px-2.5 py-1 text-xs font-bold tabular-nums text-[#70458f]">
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
                    <div className="mt-2 flex justify-between text-[10px] font-medium text-[#a68e7d]">
                      <span>-300px</span>
                      <span>0</span>
                      <span>+300px</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#594135]">CTA Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#765f50]">Button Text</Label>
                <Input
                  value={formData.ctaText}
                  onChange={(e) => updateField("ctaText", e.target.value)}
                  className="border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#765f50]">Button Link</Label>
                <Input
                  value={formData.ctaLink}
                  onChange={(e) => updateField("ctaLink", e.target.value)}
                  className="border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-[#eadcc7]" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-[#594135]">Left Column: Features</Label>
              <Button
                onClick={handleAddFeature}
                size="sm"
                variant="outline"
                className="border-[#d9c5ef] bg-[#fffdf8] text-[#70458f] hover:bg-[#f3ebff]"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {formData.features.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col gap-3 rounded-sm border border-[#eadcc7] bg-[#fff9ef] p-4 transition-colors hover:border-[#c69cda] md:flex-row"
                >
                  <button
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute right-2 top-2 rounded-sm p-1 text-[#a68e7d] opacity-0 transition-opacity hover:bg-[#fff0eb] hover:text-[#bd4f3e] group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-[#765f50]">Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateFeature(idx, "title", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-[#765f50]">Subtitle</Label>
                    <Input
                      value={item.subtitle}
                      onChange={(e) => updateFeature(idx, "subtitle", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                    />
                  </div>
                  <div className="w-36 space-y-2">
                    <Label className="text-xs text-[#765f50]">Icon</Label>
                    <button
                      type="button"
                      onClick={() => openIconPicker(idx)}
                      className="group flex h-8 w-full items-center gap-2 rounded-sm border border-[#e8d8bd] bg-[#fffdf8] px-2 text-left transition-all hover:border-[#c69cda] hover:bg-[#f7f0ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9a5b9c] focus-visible:ring-offset-2"
                    >
                      {(() => {
                        const FeatureIcon = iconMap[item.iconName] ?? iconMap.Zap;
                        return <FeatureIcon className={cn("h-4 w-4 shrink-0", item.iconColorClass)} strokeWidth={2} />;
                      })()}
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#765f50]">{item.iconName}</span>
                      <span className="text-[10px] font-bold text-[#874f93]">Edit</span>
                    </button>
                    <IconPicker label="Feature icon" onChange={(icon) => updateFeature(idx, "iconName", icon)} value={item.iconName} />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-xs text-[#765f50]">Color Class</Label>
                    <Input
                      value={item.iconColorClass}
                      onChange={(e) => updateFeature(idx, "iconColorClass", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                      placeholder="text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#eadcc7]" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-[#594135]">Right Column: Stats</Label>
              <Button
                onClick={handleAddStat}
                size="sm"
                variant="outline"
                className="border-[#d9c5ef] bg-[#fffdf8] text-[#70458f] hover:bg-[#f3ebff]"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Stat
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.stats.map((item, idx) => (
                <div key={idx} className="group relative space-y-3 rounded-sm border border-[#eadcc7] bg-[#fff9ef] p-4">
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute right-2 top-2 rounded-sm p-1 text-[#a68e7d] opacity-0 transition-opacity hover:bg-[#fff0eb] hover:text-[#bd4f3e] group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-1">
                    <Label className="text-xs text-[#765f50]">Value</Label>
                    <Input
                      value={item.value}
                      onChange={(e) => updateStat(idx, "value", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-[#765f50]">Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateStat(idx, "label", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-[#765f50]">Color Class</Label>
                    <Input
                      value={item.colorClass}
                      onChange={(e) => updateStat(idx, "colorClass", e.target.value)}
                      className="h-8 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                      placeholder="text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={iconPickerFeatureIndex !== null} onOpenChange={(open) => !open && setIconPickerFeatureIndex(null)}>
        <DialogContent className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#e3d0b4] bg-[#fffdf8] p-0 shadow-2xl">
          {selectedFeature && (
            <>
              <DialogHeader className="relative overflow-hidden border-b border-[#e3d0b4] bg-gradient-to-br from-[#5b2d83] via-[#9b3d69] to-[#c76332] px-6 py-5 text-white">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-center gap-4 pr-10">
                  <span className="grid h-14 w-14 place-items-center rounded-sm bg-white/15 shadow-lg ring-4 ring-white/20">
                    <SelectedIcon className={cn("h-6 w-6", selectedFeature.iconColorClass)} strokeWidth={2} />
                  </span>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight">Choose an icon</DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-[#f7dfcc]">
                      Pick an icon that best represents “{selectedFeature.title}”.
                    </DialogDescription>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIconPickerFeatureIndex(null)}
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-sm text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close icon picker"
                >
                  <X size={19} />
                </button>
              </DialogHeader>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
                  <Input
                    autoFocus
                    value={iconSearch}
                    onChange={(event) => setIconSearch(event.target.value)}
                    placeholder="Search hundreds of icons..."
                    className="h-11 border-[#e3d0b4] bg-[#fff7e9] pl-10 text-[#49352b] placeholder:text-[#a68e7d] focus:border-[#9a5b9c] focus:bg-[#fffdf8]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-[#765f50]">{filteredIconOptions.length} icons available</span>
                  <span className="truncate rounded-full bg-[#f2e8ff] px-2.5 py-1 font-mono text-[#70458f]">
                    Selected: {selectedIconName}
                  </span>
                </div>
                <div className="max-h-[48vh] overflow-y-auto rounded-sm border border-[#e8d8bd] bg-[#fff8ed] p-3">
                  {filteredIconOptions.length ? (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                      {filteredIconOptions.map((iconName) => {
                        const IconComponent = iconMap[iconName];
                        const isSelected = selectedIconName === iconName;
                        return (
                          <button
                            type="button"
                            key={iconName}
                            onClick={() => {
                              if (iconPickerFeatureIndex !== null)
                                updateFeature(iconPickerFeatureIndex, "iconName", iconName);
                              setIconPickerFeatureIndex(null);
                            }}
                            title={iconName}
                            aria-label={`Choose ${iconName} icon`}
                            aria-pressed={isSelected}
                            className={cn(
                              "flex aspect-square items-center justify-center rounded-sm border transition-all duration-200",
                              isSelected
                                ? "border-[#8b4e9c] bg-gradient-to-br from-[#7b3f94] to-[#b44e58] text-white shadow-md"
                                : "border-[#eadcc7] bg-[#fffdf8] text-[#765f50] hover:-translate-y-0.5 hover:border-[#c69cda] hover:bg-[#f6edff] hover:text-[#70458f] hover:shadow-sm",
                            )}
                          >
                            <IconComponent size={20} strokeWidth={1.8} />
                            <span className="sr-only">{iconName}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid min-h-48 place-items-center text-center">
                      <div>
                        <Search className="mx-auto h-7 w-7 text-[#c9b29b]" />
                        <p className="mt-3 text-sm font-semibold text-[#765f50]">No matching icons</p>
                        <p className="mt-1 text-xs text-[#a68e7d]">Try a different keyword.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MutationSection24;
