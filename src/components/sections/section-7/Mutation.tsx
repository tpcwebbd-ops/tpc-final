/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import {
  BookOpen as BookOpenIcon,
  Briefcase as BriefcaseIcon,
  Building2 as Building2Icon,
  GraduationCap as GraduationCapIcon,
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

import type { Section7Data } from "./data";
import { defaultDataSection7 } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const X = iconComponent("X");
const Plus = iconComponent("Plus");
const Globe = iconComponent("Globe");
const Clock = iconComponent("Clock");
const Award = iconComponent("Award");
const MapPin = iconComponent("MapPin");
const Trash2 = iconComponent("Trash2");
const BookOpen = BookOpenIcon;
const Settings2 = iconComponent("Settings");
const Briefcase = BriefcaseIcon;
const Building2 = Building2Icon;
const DollarSign = iconComponent("DollarSign");
const ChevronDown = iconComponent("ChevronDown");
const GraduationCap = GraduationCapIcon;

export interface Section7FormProps {
  data?: Section7Data;
  onChange?: (values: Section7Data) => void;
}

const MutationSection7 = ({ data, onChange }: Section7FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section7Data>(() => ({
    ...defaultDataSection7,
    ...data,
    city: data?.city ?? defaultDataSection7.city,
    universitys: data?.universitys ?? defaultDataSection7.universitys,
  }));
  const [cityInput, setCityInput] = useState("");
  const [expandedUni, setExpandedUni] = useState<string | null>(defaultDataSection7.universitys[0]?.id || null);
  const [mediaTarget, setMediaTarget] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateRootField = (field: keyof Section7Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCity = () => {
    if (cityInput.trim()) {
      updateRootField("city", [...formData.city, cityInput.trim()]);
      setCityInput("");
    }
  };

  const removeCity = (index: number) => {
    updateRootField(
      "city",
      formData.city.filter((_, i) => i !== index),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUniversityChange = (index: number, field: keyof Section7Data["universitys"][0], value: any) => {
    const updatedUnis = [...formData.universitys];
    updatedUnis[index] = { ...updatedUnis[index], [field]: value };
    updateRootField("universitys", updatedUnis);
  };

  const addUniversity = () => {
    const newUni = {
      id: `UNI-${Date.now()}`,
      name: "New University",
      image: "",
      location: formData.city[0] || "",
      description: "",
      courses: [],
    };
    updateRootField("universitys", [newUni, ...formData.universitys]);
    setExpandedUni(newUni.id);
  };

  const removeUniversity = (index: number) => {
    const updatedUnis = formData.universitys.filter((_, i) => i !== index);
    updateRootField("universitys", updatedUnis);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (uniIndex: number, courseIndex: number, field: string, value: any) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: value };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const handleApplyParamChange = (uniIndex: number, courseIndex: number, paramIndex: number, value: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const newParams = [...updatedCourses[courseIndex].applyBtnParms];
    newParams[paramIndex] = value;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParms: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const handleApplyParamDegreeLevelChange = (
    uniIndex: number,
    courseIndex: number,
    paramIndex: number,
    value: string,
  ) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    const newParams = [...currentParams];

    while (newParams.length <= paramIndex) {
      newParams.push("");
    }

    newParams[paramIndex] = value;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParmsDegreeLevel: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const addApplyParamDegreeLevel = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: [...currentParams, "New Param"],
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField("universitys", updatedUnis);
  };

  const removeApplyParamDegreeLevel = (uniIndex: number, courseIndex: number, paramIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: currentParams.filter((_, i) => i !== paramIndex),
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField("universitys", updatedUnis);
  };

  const addCourse = (uniIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    const newCourse = {
      id: `CRS-${Date.now()}`,
      name: "New Course",
      tutionFees: "",
      duration: "",
      description: "",
      degreeLevelInfo: [],
      applyBtnParms: [formData.country, targetUni.location, targetUni.name, "New Course"],
      applyBtnParmsDegreeLevel: ["Degree", "Level", "Param"],
    };

    targetUni.courses = [...targetUni.courses, newCourse];
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const removeCourse = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    targetUni.courses = targetUni.courses.filter((_, i) => i !== courseIndex);
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const addDegreeLevelInfo = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    const newDegreeInfo = {
      id: `DL-${Date.now()}`,
      degreeLevel: "Bachelor",
      tutionFees: "",
      duration: "",
    };

    targetCourse.degreeLevelInfo = [...(targetCourse.degreeLevelInfo || []), newDegreeInfo];
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const removeDegreeLevelInfo = (uniIndex: number, courseIndex: number, degreeIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    targetCourse.degreeLevelInfo = (targetCourse.degreeLevelInfo || []).filter((_, i) => i !== degreeIndex);
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const updateDegreeLevelInfo = (
    uniIndex: number,
    courseIndex: number,
    degreeIndex: number,
    field: string,
    value: string,
  ) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };
    const updatedDegreeInfos = [...(targetCourse.degreeLevelInfo || [])];

    updatedDegreeInfos[degreeIndex] = { ...updatedDegreeInfos[degreeIndex], [field]: value };

    targetCourse.degreeLevelInfo = updatedDegreeInfos;
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField("universitys", updatedUnis);
  };

  const toggleExpand = (id: string) => {
    setExpandedUni(expandedUni === id ? null : id);
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
            <Globe className="text-indigo-600" size={24} />
          </div>
          <div className="z-10">
            <h2 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-xl font-bold text-transparent">
              Edit Study Destinations
            </h2>
            <p className="text-sm text-slate-600">Manage countries, cities, and associated universities.</p>
          </div>
        </div>

        <div className="mx-6 mt-6 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4 lg:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public destinations section.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 lg:min-w-[30rem]">
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
                <MapPin size={16} /> Regional Settings
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
                    onCheckedChange={(checked) => updateRootField("showEyebrow", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Eyebrow text</Label>
                  <Input
                    value={formData.eyebrow}
                    onChange={(e) => updateRootField("eyebrow", e.target.value)}
                    className="border-slate-200 bg-white"
                    placeholder="Study Abroad Opportunities"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs font-medium">Country Name</Label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    <Input
                      value={formData.country}
                      onChange={(e) => updateRootField("country", e.target.value)}
                      className="bg-white border-slate-200 pl-9 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Australia"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600 text-xs font-medium">Popular Cities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCity())}
                      className="bg-white border-slate-200 focus:border-indigo-500 transition-all"
                      placeholder="Add city..."
                    />
                    <Button
                      onClick={addCity}
                      className="bg-amber-200 text-amber-950 hover:bg-amber-300 shadow-sm transition-all duration-700"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.city.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/50 text-slate-700 rounded-md text-xs font-medium border border-slate-300 hover:border-indigo-500/30 hover:bg-slate-100 transition-colors"
                      >
                        {item}
                        <button
                          onClick={() => removeCity(idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {formData.city.length === 0 && (
                      <span className="text-slate-500 text-xs italic p-1">No cities added yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-6 space-y-4 rounded-sm border border-indigo-100 bg-indigo-50 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 ring-4 ring-indigo-500/5">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-700">Universities</h3>
                <p className="text-slate-500 text-xs mt-1">
                  You have <span className="text-indigo-400 font-bold">{formData.universitys.length}</span> universities
                  listed.
                </p>
              </div>
              <Button
                onClick={addUniversity}
                variant="outline"
                className="w-full bg-amber-200 border-amber-300 text-amber-950 hover:bg-amber-300 transition-all duration-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add University
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} /> University List
            </h3>

            {formData.universitys.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                  <Building2 className="text-slate-600" size={24} />
                </div>
                <p className="text-slate-500 text-sm">No universities added yet.</p>
                <Button onClick={addUniversity} variant="link" className="text-indigo-400 hover:text-indigo-300">
                  Add your first university
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {formData.universitys.map((uni, index) => (
                <div
                  key={uni.id}
                  className={`
                    group overflow-hidden rounded-sm border border-slate-200 bg-slate-50 transition-all duration-300
                    ${expandedUni === uni.id ? "border-indigo-500/30 ring-1 ring-indigo-500/10 bg-white/40 shadow-xl" : "border-slate-200/50 hover:border-slate-300 hover:bg-white/20"}
                  `}
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => toggleExpand(uni.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition-colors group-hover:border-indigo-300">
                        {uni.image ? (
                          <Image
                            width={100}
                            height={100}
                            src={uni.image}
                            alt="logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 size={20} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-base font-medium transition-colors ${expandedUni === uni.id ? "text-indigo-200" : "text-slate-700"}`}
                        >
                          {uni.name || "Untitled University"}
                        </h3>
                        {uni.location ? (
                          <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {uni.location}
                          </p>
                        ) : (
                          <p className="text-slate-500 text-xs italic mt-0.5">No location set</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUniversity(index);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <div
                        className={`p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 transition-transform duration-300 ${expandedUni === uni.id ? "rotate-180 text-indigo-400 border-indigo-500/30" : ""}`}
                      >
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {expandedUni === uni.id && (
                    <div className="p-5 pt-0 border-t border-slate-200/50 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 pt-5">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-slate-600 text-xs font-medium">Institution Name</Label>
                            <div className="relative group/input">
                              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-hover/input:text-indigo-400 transition-colors" />
                              <Input
                                value={uni.name}
                                onChange={(e) => handleUniversityChange(index, "name", e.target.value)}
                                className="bg-white border-slate-200 pl-9"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                              Location{" "}
                              <span className="text-slate-500 text-[10px] font-normal">(Select from cities)</span>
                            </Label>
                            <div className="relative group/select">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 z-10 group-hover/select:text-indigo-400 transition-colors" />
                              <select
                                value={uni.location}
                                onChange={(e) => handleUniversityChange(index, "location", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-md h-10 pl-9 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:bg-slate-50"
                              >
                                <option value="" disabled className="bg-white text-slate-500">
                                  Select a city...
                                </option>
                                {formData.city.map((city, idx) => (
                                  <option key={idx} value={city} className="bg-white text-slate-700 py-2">
                                    {city}
                                  </option>
                                ))}
                                {formData.city.length === 0 && (
                                  <option value="" disabled className="bg-white text-slate-500">
                                    No cities added in regional settings
                                  </option>
                                )}
                              </select>
                              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                            </div>
                            {formData.city.length === 0 && (
                              <p className="text-[10px] text-amber-500/80 mt-1 pl-1">
                                * Add cities in the regional settings sidebar first.
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 text-xs font-medium">Description</Label>
                            <Textarea
                              value={uni.description}
                              onChange={(e) => handleUniversityChange(index, "description", e.target.value)}
                              className="bg-white border-slate-200 min-h-[9rem] resize-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Brief description of the university..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-600 text-xs font-medium">Thumbnail Image</Label>
                          <div className="rounded-sm border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-300">
                            {uni.image ? (
                              <Image
                                src={uni.image}
                                alt={`${uni.name || "University"} preview`}
                                width={320}
                                height={180}
                                className="mb-3 h-36 w-full rounded-sm border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="mb-3 flex h-36 items-center justify-center rounded-sm border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
                                No image selected
                              </div>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="w-full border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-200"
                              onClick={() => setMediaTarget(index)}
                            >
                              Edit image
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2 text-slate-700 uppercase text-xs font-bold tracking-widest">
                            <GraduationCap size={16} className="text-indigo-400" />
                            <span>Available Courses ({uni.courses.length})</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addCourse(index)}
                            className="bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200 h-8 text-xs transition-all duration-700"
                          >
                            <Plus size={12} className="mr-1.5" /> Add Course
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          {uni.courses.map((course, cIndex) => (
                            <div
                              key={course.id}
                              className="group relative rounded-sm border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-indigo-300"
                            >
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCourse(index, cIndex)}
                                  className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Course Name
                                  </Label>
                                  <div className="relative">
                                    <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                    <Input
                                      value={course.name}
                                      onChange={(e) => handleCourseChange(index, cIndex, "name", e.target.value)}
                                      className="bg-white border-slate-200 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Duration (Avg)
                                  </Label>
                                  <div className="relative">
                                    <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                    <Input
                                      value={course.duration}
                                      onChange={(e) => handleCourseChange(index, cIndex, "duration", e.target.value)}
                                      className="bg-white border-slate-200 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Tuition Fees (Avg)
                                  </Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                    <Input
                                      value={course.tutionFees}
                                      onChange={(e) => handleCourseChange(index, cIndex, "tutionFees", e.target.value)}
                                      className="bg-white border-slate-200 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Description
                                  </Label>
                                  <div className="relative">
                                    <BookOpen className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                    <Input
                                      value={course.description}
                                      onChange={(e) => handleCourseChange(index, cIndex, "description", e.target.value)}
                                      className="bg-white border-slate-200 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-200/50 mt-3 space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
                                      <Award size={12} className="text-indigo-400" /> Degree Levels Info
                                    </Label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => addDegreeLevelInfo(index, cIndex)}
                                      className="h-6 text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2"
                                    >
                                      <Plus size={10} className="mr-1" /> Add Level
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    {(course.degreeLevelInfo || []).map((degreeInfo, dIdx) => (
                                      <div
                                        key={degreeInfo.id}
                                        className="relative grid grid-cols-1 gap-2 rounded-sm border border-slate-200 bg-white p-2 transition-colors hover:border-indigo-300 group/degree"
                                      >
                                        <div className="">
                                          <Input
                                            placeholder="Degree (e.g. Master)"
                                            value={degreeInfo.degreeLevel}
                                            onChange={(e) =>
                                              updateDegreeLevelInfo(index, cIndex, dIdx, "degreeLevel", e.target.value)
                                            }
                                            className="h-7 text-xs bg-white border-slate-200 px-2"
                                          />
                                        </div>
                                        <div className="">
                                          <Input
                                            placeholder="Fees"
                                            value={degreeInfo.tutionFees}
                                            onChange={(e) =>
                                              updateDegreeLevelInfo(index, cIndex, dIdx, "tutionFees", e.target.value)
                                            }
                                            className="h-7 text-xs bg-white border-slate-200 px-2"
                                          />
                                        </div>
                                        <div className="">
                                          <Input
                                            placeholder="Duration"
                                            value={degreeInfo.duration}
                                            onChange={(e) =>
                                              updateDegreeLevelInfo(index, cIndex, dIdx, "duration", e.target.value)
                                            }
                                            className="h-7 text-xs bg-white border-slate-200 px-2"
                                          />
                                        </div>
                                        <div className=" flex justify-center">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeDegreeLevelInfo(index, cIndex, dIdx)}
                                            className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                                          >
                                            <Trash2 size={12} />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    {(!course.degreeLevelInfo || course.degreeLevelInfo.length === 0) && (
                                      <div className="text-center py-2 border border-dashed border-slate-200 rounded bg-white/20">
                                        <p className="text-[10px] text-slate-500">No specific degree levels added.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pt-2 border-t border-slate-200/50">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 block flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" /> APPLY BTN PARAMS
                                    </Label>
                                    <div className="grid grid-cols-1 gap-2">
                                      {course.applyBtnParms.map((param, pIdx) => (
                                        <Input
                                          key={`std-${pIdx}`}
                                          value={param}
                                          onChange={(e) => handleApplyParamChange(index, cIndex, pIdx, e.target.value)}
                                          className="bg-white border-slate-200/50 h-7 text-xs text-slate-500 focus:text-slate-700"
                                          placeholder={`Param ${pIdx + 1}`}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[10px] font-bold text-slate-500 block flex items-center gap-2">
                                        <Settings2 size={10} /> DEGREE PARAMS
                                      </Label>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-5 w-5 p-0"
                                          onClick={() => addApplyParamDegreeLevel(index, cIndex)}
                                        >
                                          <Plus size={10} className="text-slate-500" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      {(course.applyBtnParmsDegreeLevel || []).map((param, pIdx) => (
                                        <div key={`deg-${pIdx}`} className="relative group/param">
                                          <Input
                                            value={param}
                                            onChange={(e) =>
                                              handleApplyParamDegreeLevelChange(index, cIndex, pIdx, e.target.value)
                                            }
                                            className="bg-white border-slate-200/50 h-7 text-xs text-slate-500 focus:text-slate-700 pr-5"
                                            placeholder={`Param ${pIdx + 1}`}
                                          />
                                          <button
                                            onClick={() => removeApplyParamDegreeLevel(index, cIndex, pIdx)}
                                            className="absolute right-1 top-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover/param:opacity-100 transition-opacity"
                                          >
                                            <X size={10} />
                                          </button>
                                        </div>
                                      ))}
                                      {(!course.applyBtnParmsDegreeLevel ||
                                        course.applyBtnParmsDegreeLevel.length === 0) && (
                                        <div className="col-span-2 text-[10px] text-slate-600 italic text-center py-1">
                                          No params
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {uni.courses.length === 0 && (
                            <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 py-6 text-center">
                              <p className="text-slate-500 text-xs">No courses listed yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {mediaTarget !== null && (
        <ImagePickerModal
          close={() => setMediaTarget(null)}
          onSelect={(url) => {
            handleUniversityChange(mediaTarget, "image", url);
            setMediaTarget(null);
          }}
          title="Choose university image"
          description="Select an existing media image or upload a new one."
          uploadLabel="Upload university image"
        />
      )}
    </div>
  );
};

export default MutationSection7;
