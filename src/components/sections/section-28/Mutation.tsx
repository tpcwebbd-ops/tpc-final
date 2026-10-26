/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { useMemo, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { Section28Data, defaultDataSection28, IFeatureItem, Section28Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Save = iconMap.Save;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Search = iconMap.Search;
const X = iconMap.X;

export interface Section28FormProps {
  data?: Section28Data | Section28Payload;
  onChange?: (values: Section28Data | Section28Payload) => void;
  onSubmit?: (values: Section28Data | Section28Payload) => void;
}

const gradientOptions = [
  { label: "Blue", value: "from-blue-500 to-blue-600" },
  { label: "Green", value: "from-green-500 to-green-600" },
  { label: "Purple", value: "from-purple-500 to-purple-600" },
  { label: "Red", value: "from-red-500 to-red-600" },
  { label: "Orange", value: "from-orange-500 to-orange-600" },
  { label: "Pink", value: "from-pink-500 to-pink-600" },
  { label: "Indigo", value: "from-indigo-500 to-indigo-600" },
];

const MutationSection28 = ({ data, onChange, onSubmit }: Section28FormProps) => {
  const initialPayload: Section28Payload = { ...defaultDataSection28, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section28Data>(() => ({
    ...initialPayload,
    features: initialPayload.features ?? defaultDataSection28.features,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [iconPickerFeatureIndex, setIconPickerFeatureIndex] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");
  const normalizedIconOptions = useMemo(() => [...iconOptions].sort((a, b) => a.localeCompare(b)), []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section28Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = { ...formData, paddingX, paddingY };
    onChange?.(payload);
    onSubmit?.(payload);
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleAddFeature = () => {
    const newFeature: IFeatureItem = {
      title: "New Feature",
      description: "Feature description",
      iconName: "Zap",
      gradient: "from-indigo-500 to-indigo-600",
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
          <div className="rounded-full bg-gradient-to-br from-[#f6c86e] to-[#d9874a] p-2 shadow-sm">
            <LayoutTemplate className="text-[#593319]" size={24} />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-[#87451f] via-[#b34e45] to-[#66419a] bg-clip-text text-xl font-bold text-transparent">
              Edit Section 28
            </h2>
            <p className="text-sm text-[#765f50]">Update &quot;Why Choose Us&quot; features.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600">Section Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Subtitle</Label>
              <Textarea
                value={formData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="min-h-36 resize-y border-[#e8d8bd] bg-[#fffdf8] focus:border-[#9a5b9c]"
                rows={6}
              />
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-2 justify-start md:justify-between">
              <div>
                <Label className="text-slate-800 font-semibold">Section spacing</Label>
                <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
              </div>
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                -300 to +300 px
              </span>
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  ["paddingX", paddingX, setPaddingX, "Padding X"],
                  ["paddingY", paddingY, setPaddingY, "Padding Y"],
                ] as const
              ).map(([field, value, setter, label]) => (
                <div key={field} className="rounded-sm border border-white bg-white p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-600">{label}</Label>
                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">
                      {value}px
                    </span>
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
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 text-lg font-semibold">Features List</Label>
              <Button
                onClick={handleAddFeature}
                size="sm"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-4 rounded-sm space-y-4 relative group shadow-sm"
                >
                  <Button
                    size="sm"
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </Button>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(idx, "title", e.target.value)}
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Icon</Label>
                      <button
                        type="button"
                        onClick={() => openIconPicker(idx)}
                        className="group flex h-9 w-full items-center gap-2 rounded-sm border border-[#e8d8bd] bg-[#fffdf8] px-2 text-left transition-all hover:border-[#c69cda] hover:bg-[#f7f0ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9a5b9c]"
                      >
                        {(() => {
                          const FeatureIcon = iconMap[feature.iconName] ?? iconMap.Zap;
                          return <FeatureIcon size={17} className="shrink-0 text-[#874f93]" />;
                        })()}
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#765f50]">
                          {feature.iconName}
                        </span>
                        <span className="text-[10px] font-bold text-[#874f93]">Edit</span>
                      </button>
                      <IconPicker
                        label="Feature icon"
                        onChange={(icon) => updateFeature(idx, "iconName", icon)}
                        value={feature.iconName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(idx, "description", e.target.value)}
                      className="min-h-36 resize-y border-[#e8d8bd] bg-[#fffdf8] text-sm"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Gradient Color</Label>
                    <select
                      value={feature.gradient}
                      onChange={(e) => updateFeature(idx, "gradient", e.target.value)}
                      className="w-full h-9 bg-white border border-slate-200 rounded-sm px-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      {gradientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`h-1 w-full rounded-full bg-gradient-to-r ${feature.gradient}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-indigo-100 bg-white flex justify-end">
          <Button onClick={handleSave} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Dialog open={iconPickerFeatureIndex !== null} onOpenChange={(open) => !open && setIconPickerFeatureIndex(null)}>
        <DialogContent className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#e3d0b4] bg-[#fffdf8] p-0 shadow-2xl">
          {selectedFeature && (
            <>
              <DialogHeader className="relative overflow-hidden border-b border-[#e3d0b4] bg-gradient-to-br from-[#5b2d83] via-[#9b3d69] to-[#c76332] px-6 py-5 text-white">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-center gap-4 pr-10">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-sm bg-gradient-to-br ${selectedFeature.gradient} shadow-lg ring-4 ring-white/20`}
                  >
                    <SelectedIcon size={25} />
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
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-sm text-white/80 hover:bg-white/15 hover:text-white"
                  aria-label="Close icon picker"
                >
                  <X size={19} />
                </button>
              </DialogHeader>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a5b9c]" />
                  <Input
                    autoFocus
                    value={iconSearch}
                    onChange={(event) => setIconSearch(event.target.value)}
                    placeholder="Search hundreds of icons..."
                    className="h-11 border-[#e3d0b4] bg-[#fff7e9] pl-10 text-[#49352b] placeholder:text-[#a68e7d] focus:border-[#9a5b9c]"
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
                              "flex aspect-square items-center justify-center rounded-sm border transition-all",
                              isSelected
                                ? "border-[#8b4e9c] bg-gradient-to-br from-[#7b3f94] to-[#b44e58] text-white shadow-md"
                                : "border-[#eadcc7] bg-[#fffdf8] text-[#765f50] hover:border-[#c69cda] hover:bg-[#f6edff] hover:text-[#70458f]",
                            )}
                          >
                            <IconComponent size={20} />
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

export default MutationSection28;
