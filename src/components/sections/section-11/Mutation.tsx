/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase as BriefcaseIcon,
  ChevronUp as ChevronUpIcon,
  Layers as LayersIcon,
  Wand2 as Wand2Icon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection11, IExperienceItem, Section11Data } from "./data";
import { defaultExperience } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");
const Briefcase = BriefcaseIcon;
const Calendar = iconComponent("Calendar");
const Trophy = iconComponent("Award");
const Target = iconComponent("Target");
const Layers = LayersIcon;
const X = iconComponent("X");
const ChevronDown = iconComponent("ChevronDown");
const ChevronUp = ChevronUpIcon;
const Sparkles = iconComponent("Sparkles");
const Wand2 = Wand2Icon;

export interface Section11FormProps {
  data?: Section11Data;
  onChange?: (values: Section11Data) => void;
}

const MutationSection11 = ({ data, onChange }: Section11FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section11Data>(() => ({ ...defaultDataSection11, ...data }));
  const [expandedExp, setExpandedExp] = useState<string | null>(
    data?.experiences?.[0]?.id || defaultDataSection11.experiences[0]?.id || null,
  );
  const [featureInputs, setFeatureInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const handleChange = (field: keyof Section11Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExperience = (index: number, field: keyof IExperienceItem, value: any) => {
    const updated = [...formData.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const updateMilestone = (index: number, field: "label" | "value", value: string) => {
    const updated = [...formData.experiences];
    updated[index] = {
      ...updated[index],
      highlightMilestone: { ...updated[index].highlightMilestone, [field]: value },
    };
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const addExperience = () => {
    const newExp: IExperienceItem = { id: `exp-${Date.now()}`, ...defaultExperience };
    setFormData((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
    setExpandedExp(newExp.id);
  };

  const removeExperience = (index: number) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const handleFeatureInput = (id: string, value: string) => {
    setFeatureInputs((prev) => ({ ...prev, [id]: value }));
  };

  const addFeature = (index: number, id: string) => {
    const value = featureInputs[id]?.trim();
    if (value) {
      const updated = [...formData.experiences];
      updated[index] = {
        ...updated[index],
        features: [...updated[index].features, value],
      };
      setFormData((prev) => ({ ...prev, experiences: updated }));
      setFeatureInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const removeFeature = (expIndex: number, featureIndex: number) => {
    const updated = [...formData.experiences];
    updated[expIndex] = {
      ...updated[expIndex],
      features: updated[expIndex].features.filter((_, i) => i !== featureIndex),
    };
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const editFeature = (expIndex: number, featureIndex: number, id: string) => {
    const featureToEdit = formData.experiences[expIndex].features[featureIndex];
    const updated = [...formData.experiences];
    updated[expIndex] = {
      ...updated[expIndex],
      features: updated[expIndex].features.filter((_, i) => i !== featureIndex),
    };
    setFormData((prev) => ({ ...prev, experiences: updated }));
    setFeatureInputs((prev) => ({ ...prev, [id]: featureToEdit }));
  };

  const toggleExpand = (id: string) => {
    setExpandedExp(expandedExp === id ? null : id);
  };
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  return (
    <div className="custom-parent-border min-h-screen bg-white pb-32 font-sans text-slate-800 selection:bg-indigo-100">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-200/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span>Timeline Editor</span>
          </motion.div>
          <h1 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Professional Journey
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Craft your career timeline. Add roles, highlight achievements, and showcase the skills that define your
            path.
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public journey timeline.
            </p>
          </div>
          <div className="grid gap-4">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = formData[field];
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        aria-label={`${label} manual value`}
                        className="h-8 w-24 bg-white text-right tabular-nums"
                        max={300}
                        min={-300}
                        onChange={(event) => {
                          const nextValue = event.currentTarget.valueAsNumber;
                          if (Number.isFinite(nextValue)) updateSpacing(field, nextValue);
                        }}
                        step={1}
                        type="number"
                        value={value}
                      />
                      <span className="text-xs font-medium text-slate-500">px</span>
                    </div>
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

        <div className="space-y-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-indigo-700 uppercase text-xs font-bold tracking-widest">
                  <Briefcase size={14} />
                  <span>Section Details</span>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Eyebrow</Label>
                    <Input
                      value={formData.eyebrow}
                      onChange={(e) => handleChange("eyebrow", e.target.value)}
                      className="border-slate-200 bg-white transition-all focus:border-indigo-400 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-sm border border-indigo-100 bg-indigo-50 p-4">
                    <div>
                      <Label htmlFor="show-section-11-eyebrow" className="text-slate-700 font-medium">
                        Show eyebrow
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">Display the eyebrow above the section heading.</p>
                    </div>
                    <Switch
                      id="show-section-11-eyebrow"
                      checked={formData.showEyebrow}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, showEyebrow: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Main Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="border-slate-200 bg-white transition-all focus:border-indigo-400 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Subtitle</Label>
                    <Input
                      value={formData.subTitle}
                      onChange={(e) => handleChange("subTitle", e.target.value)}
                      className="border-slate-200 bg-white transition-all focus:border-indigo-400 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={6}
                      className="min-h-36 resize-y border-slate-200 bg-white transition-all focus:border-indigo-400 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={addExperience}
                className="group w-full rounded-sm border-none bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
                size="sm"
              >
                <div className="flex flex-col items-center gap-1">
                  <Plus className="h-6 w-6 mb-1 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add New Position</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {formData.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group bg-white border ${
                    expandedExp === exp.id
                      ? "border-indigo-300 ring-1 ring-indigo-100"
                      : "border-slate-200 hover:border-indigo-200"
                  } rounded-sm overflow-hidden shadow-sm transition-all duration-300`}
                >
                  <div className="p-6 cursor-pointer" onClick={() => toggleExpand(exp.id)}>
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-sm border transition-colors duration-300 ${
                            expandedExp === exp.id
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                              : "bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-indigo-50"
                          }`}
                        >
                          <Briefcase size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {exp.role || "Role Title"}
                          </h3>
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm text-slate-400 mt-1">
                            <span className="font-medium text-slate-700">{exp.companyName || "Company"}</span>
                            <span className="hidden md:block w-1 h-1 bg-slate-600 rounded-full" />
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {exp.year}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end gap-2">
                          {expandedExp === exp.id ? (
                            <ChevronUp className="text-indigo-400" />
                          ) : (
                            <ChevronDown className="text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedExp === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200"
                      >
                        <div className="space-y-8 bg-[#fffaf0] p-6 md:p-8">
                          <div className="grid gap-8">
                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="text-slate-600 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Briefcase size={12} /> Role Title
                                </Label>
                                <Input
                                  value={exp.role}
                                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                                  className="h-11 border-slate-200 bg-white focus:border-indigo-400"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Layers size={12} /> Company Name
                                </Label>
                                <Input
                                  value={exp.companyName}
                                  onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                                  className="h-11 border-slate-200 bg-white focus:border-indigo-400"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Calendar size={12} /> Duration
                                </Label>
                                <Input
                                  value={exp.year}
                                  onChange={(e) => updateExperience(index, "year", e.target.value)}
                                  className="h-11 border-slate-200 bg-white focus:border-indigo-400"
                                />
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div className="space-y-4 rounded-sm border border-indigo-100 bg-indigo-50 p-5">
                                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-widest">
                                  <Target size={14} /> Highlight Milestone
                                </div>
                                <div className="grid gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-indigo-700 text-xs">Label</Label>
                                    <Input
                                      value={exp.highlightMilestone.label}
                                      onChange={(e) => updateMilestone(index, "label", e.target.value)}
                                      className="h-9 border-indigo-200 bg-white text-sm focus:border-indigo-400"
                                      placeholder="Revenue"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-indigo-700 text-xs">Value</Label>
                                    <Input
                                      value={exp.highlightMilestone.value}
                                      onChange={(e) => updateMilestone(index, "value", e.target.value)}
                                      className="h-9 border-indigo-200 bg-white text-sm font-bold text-slate-900 focus:border-indigo-400"
                                      placeholder="+200%"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-slate-600 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Trophy size={12} /> Key Achievement
                                </Label>
                                <Input
                                  value={exp.lastAchievement}
                                  onChange={(e) => updateExperience(index, "lastAchievement", e.target.value)}
                                  className="h-11 border-slate-200 bg-white focus:border-indigo-400"
                                  placeholder="Led team to Series B"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 text-xs uppercase tracking-wider">Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(index, "description", e.target.value)}
                              rows={6}
                              className="min-h-36 resize-y border-slate-200 bg-white leading-relaxed text-slate-700 focus:border-indigo-400"
                            />
                          </div>

                          <div className="space-y-3 pt-4 border-t border-slate-200">
                            <Label className="text-slate-600 flex items-center gap-2 text-xs uppercase tracking-wider">
                              <Wand2 size={12} /> Skills & Tech Stack
                            </Label>

                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  value={featureInputs[exp.id] || ""}
                                  onChange={(e) => handleFeatureInput(exp.id, e.target.value)}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), addFeature(index, exp.id))
                                  }
                                  className="h-12 border-slate-200 bg-white pl-10 focus:border-indigo-400"
                                  placeholder="Type a skill and press Enter..."
                                />
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              </div>
                              <Button
                                onClick={() => addFeature(index, exp.id)}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-indigo-600 p-0 text-white hover:bg-indigo-500"
                              >
                                <Plus size={20} />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.features.map((feature, fIndex) => (
                                <motion.div
                                  layout
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  key={`${index}-${fIndex}`}
                                  className="group relative flex items-center"
                                >
                                  <div
                                    onClick={() => editFeature(index, fIndex, exp.id)}
                                    className="cursor-pointer rounded-sm border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 transition-all select-none hover:border-indigo-400 hover:bg-indigo-100"
                                  >
                                    {feature}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFeature(index, fIndex);
                                    }}
                                    className="absolute right-1 p-1 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 pointer-events-none whitespace-nowrap">
                                    Click to Edit
                                  </div>
                                </motion.div>
                              ))}
                              {exp.features.length === 0 && (
                                <span className="text-slate-600 text-sm italic py-2">No skills added yet.</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-200">
                            <Button
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExperience(index);
                              }}
                            >
                              <Trash2 size={16} />
                              Delete Position
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection11;
