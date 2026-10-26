/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import {
  Building2 as Building2Icon,
  GraduationCap as GraduationCapIcon,
  MousePointerClick as MousePointerClickIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { Section6Data } from "./data";
import { defaultDataSection6 } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const X = iconComponent("X");
const Plus = iconComponent("Plus");
const Users = iconComponent("Users");
const Award = iconComponent("Award");
const MapPin = iconComponent("MapPin");
const Building2 = Building2Icon;
const DollarSign = iconComponent("DollarSign");
const CheckCircle2 = iconComponent("Check");
const GraduationCap = GraduationCapIcon;
const LayoutDashboard = iconComponent("Layout");
const MousePointerClick = MousePointerClickIcon;
const ImageIcon = iconComponent("Image");

export interface Section6FormProps {
  data?: Section6Data;
  onChange?: (values: Section6Data) => void;
}

const MutationSection6 = ({ data, onChange }: Section6FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section6Data>(() => ({
    ...defaultDataSection6,
    ...data,
    showEyebrow: data?.showEyebrow ?? defaultDataSection6.showEyebrow,
  }));
  const [programInput, setProgramInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [mediaTarget, setMediaTarget] = useState<"banner" | "logo" | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const updateField = (field: keyof Section6Data, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((prev) => ({ ...prev, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  const addArrayItem = (field: "programs" | "subjects" | "features", value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      updateField(field, [...formData[field], value.trim()]);
      setter("");
    }
  };

  const removeArrayItem = (field: "programs" | "subjects" | "features", index: number) => {
    updateField(
      field,
      formData[field].filter((_, i) => i !== index),
    );
  };

  return (
    <div className="custom-parent-border px-4 min-h-screen bg-[#fffaf0] font-sans text-stone-800">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white p-6 flex-col md:flex-row">
          <div className="rounded-sm bg-amber-50 p-2">
            <Building2 className="text-amber-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900">Edit University Details</h2>
            <p className="text-sm text-slate-600">Manage institutional profile and academic content.</p>
          </div>
          <div className="ml-auto flex items-center gap-3 rounded-sm bg-amber-50 px-3 py-2 w-full justify-end ">
            <div className="text-right flex gap-2">
              <Label className="text-xs font-semibold text-stone-800">Show eyebrow</Label>
              <p className="text-[10px] text-stone-500">Accreditation label</p>
            </div>
            <Switch
              checked={formData.showEyebrow !== false}
              onCheckedChange={(checked) => setFormData((current) => ({ ...current, showEyebrow: checked }))}
            />
          </div>
        </div>

        <div className="mx-6 mt-6 grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public university section.
            </p>
          </div>
          <div className="grid gap-4">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = formData[field];
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-700">
                      {value}px
                    </span>
                  </div>
                  <Input
                    aria-label={`${label} manual value`}
                    className="mb-3 bg-white"
                    max={300}
                    min={-300}
                    onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                    type="number"
                    value={value}
                  />
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

        <div className="grid grid-cols-1 gap-8 p-6 md:p-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                <LayoutDashboard size={16} /> General Information
              </h3>

              <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-700">University Name</Label>
                    <Input
                      value={formData.universityName}
                      onChange={(e) => updateField("universityName", e.target.value)}
                      className="bg-white border-[#eadfca] focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-700">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="bg-white border-[#eadfca] pl-9 focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700">Description</Label>
                  <Textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="min-h-36 bg-white border-[#eadfca] focus:border-amber-400 resize-none"
                    placeholder="Detailed overview..."
                  />
                </div>

                <div className="grid gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Established</Label>
                    <Input
                      value={formData.established}
                      onChange={(e) => updateField("established", e.target.value)}
                      className="bg-white border-[#eadfca] h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Students</Label>
                    <div className="relative">
                      <Users className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.totalStudents}
                        onChange={(e) => updateField("totalStudents", e.target.value)}
                        className="bg-white border-[#eadfca] pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Rating</Label>
                    <div className="relative">
                      <Award className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.rating}
                        onChange={(e) => updateField("rating", e.target.value)}
                        className="bg-white border-[#eadfca] pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Tuition</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.tuitionFee}
                        onChange={(e) => updateField("tuitionFee", e.target.value)}
                        className="bg-white border-[#eadfca] pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                <GraduationCap size={16} /> Academic Programs
              </h3>

              <div className="grid gap-6 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="space-y-3">
                  <Label className="text-stone-700">Degrees Offered</Label>
                  <div className="flex gap-2">
                    <Input
                      value={programInput}
                      onChange={(e) => setProgramInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addArrayItem("programs", programInput, setProgramInput))
                      }
                      className="bg-white border-[#eadfca]"
                      placeholder="e.g. MBA"
                    />
                    <Button
                      onClick={() => addArrayItem("programs", programInput, setProgramInput)}
                      className="bg-amber-100 text-amber-950 hover:bg-amber-200"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.programs.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                      >
                        {item}
                        <button
                          onClick={() => removeArrayItem("programs", idx)}
                          className="hover:text-red-400 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-stone-700">Major Subjects</Label>
                  <div className="flex gap-2">
                    <Input
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addArrayItem("subjects", subjectInput, setSubjectInput))
                      }
                      className="bg-white border-[#eadfca]"
                      placeholder="e.g. Science"
                    />
                    <Button
                      onClick={() => addArrayItem("subjects", subjectInput, setSubjectInput)}
                      className="bg-amber-100 text-amber-950 hover:bg-amber-200"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                      >
                        {item}
                        <button
                          onClick={() => removeArrayItem("subjects", idx)}
                          className="hover:text-red-400 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                <ImageIcon size={16} /> Media Assets
              </h3>
              <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-stone-700">Banner Image</Label>
                  <div className="relative aspect-video overflow-hidden rounded-sm border border-[#eadfca] bg-amber-50">
                    {formData.bannerImage ? (
                      <Image
                        alt="Banner preview"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        src={formData.bannerImage}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-stone-500">No banner selected</div>
                    )}
                    <Button
                      className="absolute bottom-3 right-3 bg-amber-100 text-amber-950 hover:bg-amber-200"
                      onClick={() => setMediaTarget("banner")}
                      type="button"
                    >
                      <ImageIcon size={14} /> Choose image
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-stone-700">University Logo</Label>
                  <div className="flex items-center gap-4 rounded-sm border border-[#eadfca] bg-white p-3">
                    <div className="relative size-20 overflow-hidden rounded-sm border border-[#eadfca] bg-amber-50">
                      {formData.logoUrl ? (
                        <Image
                          alt="University logo preview"
                          className="object-contain p-2"
                          fill
                          sizes="80px"
                          src={formData.logoUrl}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-center text-[10px] text-stone-500">
                          No logo
                        </div>
                      )}
                    </div>
                    <Button
                      className="bg-amber-100 text-amber-950 hover:bg-amber-200"
                      onClick={() => setMediaTarget("logo")}
                      type="button"
                    >
                      <ImageIcon size={14} /> Choose logo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                <MousePointerClick size={16} /> Actions & Links
              </h3>
              <div className="space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="space-y-2">
                  <Label className="text-xs text-stone-700">Accreditation</Label>
                  <Input
                    value={formData.accreditation}
                    onChange={(e) => updateField("accreditation", e.target.value)}
                    className="bg-white border-[#eadfca]"
                  />
                </div>

                <div className="grid gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-zinc-500 text-[10px] uppercase">Primary Button</Label>
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="Text"
                      value={formData.applyText}
                      onChange={(e) => updateField("applyText", e.target.value)}
                      className="bg-white border-[#eadfca] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="URL"
                      value={formData.buttonUrl}
                      onChange={(e) => updateField("buttonUrl", e.target.value)}
                      className="bg-white border-[#eadfca] text-sm"
                    />
                  </div>

                  <div className="col-span-2 space-y-1 mt-1">
                    <Label className="text-zinc-500 text-[10px] uppercase">Secondary Button</Label>
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="Text"
                      value={formData.buttonText || ""}
                      onChange={(e) => updateField("buttonText", e.target.value)}
                      className="bg-white border-[#eadfca] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="URL"
                      value={formData.websiteUrl}
                      onChange={(e) => updateField("websiteUrl", e.target.value)}
                      className="bg-white border-[#eadfca] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                <CheckCircle2 size={16} /> Key Features
              </h3>
              <div className="space-y-3 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4">
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addArrayItem("features", featureInput, setFeatureInput))
                    }
                    className="bg-white border-[#eadfca]"
                    placeholder="Add feature..."
                  />
                  <Button
                    onClick={() => addArrayItem("features", featureInput, setFeatureInput)}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.features.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </div>
                      <button
                        onClick={() => removeArrayItem("features", idx)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-xs text-zinc-500 italic p-1">No features added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {mediaTarget && (
          <ImagePickerModal
            close={() => setMediaTarget(null)}
            onSelect={(url) => {
              updateField(mediaTarget === "banner" ? "bannerImage" : "logoUrl", url);
              setMediaTarget(null);
            }}
            title={mediaTarget === "banner" ? "Choose banner image" : "Choose university logo"}
            uploadLabel={mediaTarget === "banner" ? "Upload banner image" : "Upload logo"}
          />
        )}
      </div>
    </div>
  );
};

export default MutationSection6;
