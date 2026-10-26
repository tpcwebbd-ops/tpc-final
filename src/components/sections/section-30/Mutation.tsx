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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { Section30Data, defaultDataSection30, IServiceFeature, Section30Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Search = iconMap.Search;
const X = iconMap.X;

export interface Section30FormProps {
  data?: Section30Data | Section30Payload;
  onChange?: (values: Section30Data | Section30Payload) => void;
  onSubmit?: (values: Section30Data | Section30Payload) => void;
}

const MutationSection30 = ({ data, onChange }: Section30FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section30Payload = { ...defaultDataSection30, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section30Data>(() => ({
    ...initialPayload,
    features: initialPayload.features ?? defaultDataSection30.features,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");
  const icons = useMemo(() => [...iconOptions].sort((a, b) => a.localeCompare(b)), []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section30Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleAddFeature = () => {
    const newFeature: IServiceFeature = {
      title: "New Feature",
      description: "Feature description goes here.",
      iconName: "Zap",
    };
    updateField("features", [...formData.features, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    updateField("features", newFeatures);
  };

  const updateFeature = (index: number, field: keyof IServiceFeature, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateField("features", newFeatures);
  };
  const selectedFeature = pickerIndex === null ? null : formData.features[pickerIndex];
  const selectedIcon = selectedFeature?.iconName ?? "Zap";
  const filteredIcons = icons.filter((name) => name.toLowerCase().includes(iconSearch.toLowerCase()));

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#e8d8bd] bg-[#fffaf0] text-stone-800 font-sans">
      <div className="w-full overflow-hidden rounded-sm border border-[#e8d8bd] bg-[#fffdf8] shadow-sm">
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <LayoutTemplate className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Section 30
            </h2>
            <p className="text-slate-500 text-sm">Update study abroad services content.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600">Top Badge Text</Label>
              <Input
                value={formData.badgeText}
                onChange={(e) => updateField("badgeText", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Heading Prefix</Label>
                <Input
                  value={formData.headingPrefix}
                  onChange={(e) => updateField("headingPrefix", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-indigo-600">Heading Highlight</Label>
                <Input
                  value={formData.headingHighlight}
                  onChange={(e) => updateField("headingHighlight", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Heading Suffix</Label>
                <Input
                  value={formData.headingSuffix}
                  onChange={(e) => updateField("headingSuffix", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">CTA Button Text</Label>
              <Input
                value={formData.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start md:items-center justify-start md:justify-between gap-2 flex-col md:flex-row">
              <div>
                <Label className="text-slate-800 font-semibold">Section spacing</Label>
                <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
              </div>
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                -300 to +300 px
              </span>
            </div>
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

          <div className="space-y-4">
            <Label className="text-slate-800 text-lg font-semibold">Illustration Card Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Card Badge</Label>
                <Input
                  value={formData.rightCardBadge}
                  onChange={(e) => updateField("rightCardBadge", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Location Label</Label>
                <Input
                  value={formData.locationLabel}
                  onChange={(e) => updateField("locationLabel", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Destination Label</Label>
                <Input
                  value={formData.destinationLabel}
                  onChange={(e) => updateField("destinationLabel", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 text-lg font-semibold">Service Features</Label>
              <Button
                onClick={handleAddFeature}
                size="sm"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="space-y-4">
              {formData.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col items-stretch gap-4 rounded-sm border border-[#eadcc7] bg-[#fff9ef] p-4 shadow-sm md:flex-row md:items-start"
                >
                  <Button
                    size="sm"
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </Button>

                  <div className="w-full space-y-2 md:w-32">
                    <Label className="text-xs text-slate-500">Icon</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setIconSearch("");
                        setPickerIndex(idx);
                      }}
                      className="flex h-9 w-full items-center gap-2 rounded-sm border border-[#e8d8bd] bg-[#fffdf8] px-2 text-left hover:border-[#c69cda] hover:bg-[#f7f0ff]"
                    >
                      {(() => {
                        const FeatureIcon = iconMap[feature.iconName] ?? iconMap.Zap;
                        return <FeatureIcon size={16} className="text-[#874f93]" />;
                      })()}
                      <span className="min-w-0 flex-1 truncate text-xs">{feature.iconName}</span>
                      <span className="text-[10px] font-bold text-[#874f93]">Edit</span>
                    </button>
                    <IconPicker
                      label="Feature icon"
                      onChange={(icon) => updateFeature(idx, "iconName", icon)}
                      value={feature.iconName}
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(idx, "title", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(idx, "description", e.target.value)}
                        className="min-h-36 resize-y border-slate-200 bg-white text-sm"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={pickerIndex !== null} onOpenChange={(open) => !open && setPickerIndex(null)}>
        <DialogContent className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#e3d0b4] bg-[#fffdf8] p-0 shadow-2xl">
          {selectedFeature && (
            <>
              <DialogHeader className="relative bg-gradient-to-br from-[#5b2d83] via-[#9b3d69] to-[#c76332] px-6 py-5 text-white">
                <DialogTitle className="text-xl font-bold">Choose an icon</DialogTitle>
                <p className="mt-1 text-sm text-[#f7dfcc]">Select an icon for {selectedFeature.title}.</p>
                <button
                  type="button"
                  onClick={() => setPickerIndex(null)}
                  className="absolute right-4 top-4 text-white/80 hover:text-white"
                  aria-label="Close icon picker"
                >
                  <X size={20} />
                </button>
              </DialogHeader>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a5b9c]" />
                  <Input
                    autoFocus
                    value={iconSearch}
                    onChange={(event) => setIconSearch(event.target.value)}
                    placeholder="Search hundreds of icons..."
                    className="h-11 border-[#e3d0b4] bg-[#fff7e9] pl-10"
                  />
                </div>
                <div className="max-h-[48vh] overflow-y-auto rounded-sm border border-[#e8d8bd] bg-[#fff8ed] p-3">
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {filteredIcons.map((name) => {
                      const Icon = iconMap[name];
                      const active = selectedIcon === name;
                      return (
                        <button
                          type="button"
                          key={name}
                          title={name}
                          onClick={() => {
                            if (pickerIndex !== null) updateFeature(pickerIndex, "iconName", name);
                            setPickerIndex(null);
                          }}
                          className={cn(
                            "flex aspect-square items-center justify-center rounded-sm border",
                            active
                              ? "border-[#8b4e9c] bg-gradient-to-br from-[#7b3f94] to-[#b44e58] text-white"
                              : "border-[#eadcc7] bg-[#fffdf8] text-[#765f50] hover:border-[#c69cda] hover:bg-[#f6edff]",
                          )}
                        >
                          <Icon size={20} />
                          <span className="sr-only">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MutationSection30;
