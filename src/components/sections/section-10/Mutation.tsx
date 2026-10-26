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
  Building2 as Building2Icon,
  GraduationCap as GraduationCapIcon,
  LayoutGrid as LayoutGridIcon,
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

import { defaultDataSection10, IStory, Section10Data } from "./data";
import { defaultStory } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");
const User = iconComponent("User");
const Building2 = Building2Icon;
const BookOpen = BookOpenIcon;
const GraduationCap = GraduationCapIcon;
const ChevronDown = iconComponent("ChevronDown");
const ImageIcon = iconComponent("Image");
const Sparkles = iconComponent("Sparkles");
const LayoutGrid = LayoutGridIcon;

export interface Section10FormProps {
  data?: Section10Data;
  onChange?: (values: Section10Data) => void;
}

const MutationSection10 = ({ data, onChange }: Section10FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section10Data>(() => ({ ...defaultDataSection10, ...data }));
  const [expandedStory, setExpandedStory] = useState<string | null>(
    data?.stories?.[0]?.id || defaultDataSection10.stories[0]?.id || null,
  );
  const [mediaTarget, setMediaTarget] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const updateStory = (index: number, field: keyof IStory, value: string | boolean) => {
    const updatedStories = [...formData.stories];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    setFormData((prev) => ({ ...prev, stories: updatedStories }));
  };

  const addStory = () => {
    const newStory: IStory = { id: `story-${Date.now()}`, ...defaultStory };
    setFormData((prev) => ({ ...prev, stories: [newStory, ...prev.stories] }));
    setExpandedStory(newStory.id);
  };

  const removeStory = (index: number) => {
    const updatedStories = formData.stories.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, stories: updatedStories }));
  };

  const toggleExpand = (id: string) => {
    setExpandedStory(expandedStory === id ? null : id);
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  return (
    <div className="custom-parent-border min-h-screen bg-white text-stone-800 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-sm overflow-hidden shadow-sm">
        <div className="relative flex items-center gap-3 overflow-hidden border-b border-slate-200 bg-white p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="z-10 rounded-sm border border-indigo-200 bg-indigo-50 p-2">
            <Sparkles className="text-indigo-600" size={24} />
          </div>
          <div className="z-10">
            <h2 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-xl font-bold text-transparent">
              Success Stories Reel
            </h2>
            <p className="text-sm text-slate-600">Manage the vertical scroll timeline stories.</p>
          </div>
        </div>

        <div className="mx-6 mt-6 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4 lg:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public stories reel.
            </p>
          </div>
          <div className="grid gap-4 lg:min-w-[30rem]">
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
          <div className="space-y-6 h-fit">
            <div className="space-y-6 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto text-slate-500 ring-1 ring-slate-200 shadow-lg">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-700">Student Profiles</h3>
                  <p className="text-slate-500 text-xs mt-1">
                    You have <span className="text-indigo-400 font-bold">{formData.stories.length}</span> stories in the
                    reel.
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-200/50 w-full" />

              <div className="space-y-3">
                <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                  <LayoutGrid size={14} className="text-indigo-400" />
                  Display Configuration
                </Label>
                <div className="relative group">
                  <select
                    value={formData.storiesPerPage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, storiesPerPage: parseInt(e.target.value) }))}
                    className="h-11 w-full rounded-sm border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-700 transition-all focus:border-indigo-500/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Story per view</option>
                    <option value={2}>2 Stories per view</option>
                    <option value={3}>3 Stories per view</option>
                    <option value={4}>4 Stories per view</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Determines how many story cards are visible simultaneously on larger screens.
                </p>
              </div>

              <div className="h-px bg-slate-200/50 w-full" />

              <Button
                onClick={addStory}
                className="w-full rounded-sm border border-indigo-500/20 bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 hover:bg-indigo-500 active:scale-95"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Story
              </Button>
            </div>

            <div className="rounded-sm border border-indigo-100 bg-indigo-50 p-5 text-xs leading-relaxed text-indigo-700">
              <p className="flex gap-2">
                <span className="font-bold bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-200 h-fit shrink-0">
                  Tip
                </span>
                <span>
                  High-quality vertical or square images work best for the reel cards. The sequence here determines the
                  scroll order.
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.stories.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                  <User className="text-slate-600" size={24} />
                </div>
                <p className="text-slate-500 text-sm">No stories added yet.</p>
                <Button onClick={addStory} variant="link" className="text-indigo-400 hover:text-indigo-300">
                  Add your first success story
                </Button>
              </div>
            )}

            {formData.stories.map((story, index) => (
              <div
                key={story.id}
                className={`
                    group overflow-hidden rounded-sm border border-slate-200 bg-slate-50 transition-all duration-300
                    ${expandedStory === story.id ? "border-indigo-500/30 ring-1 ring-indigo-500/10 bg-white/40 shadow-xl" : "border-slate-200 hover:border-slate-300 hover:bg-white/20"}
                  `}
              >
                <div
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleExpand(story.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition-colors group-hover:border-indigo-300">
                      {story.image ? (
                        <Image
                          width={100}
                          height={100}
                          src={story.image}
                          alt={story.name}
                          loading={index === 0 ? "eager" : "lazy"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-base font-bold transition-colors ${expandedStory === story.id ? "text-indigo-200" : "text-slate-700"}`}
                      >
                        {story.name}
                      </h3>
                      <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Building2 size={10} /> {story.university || "No University"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStory(index);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div
                      className={`p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 transition-transform duration-300 ${expandedStory === story.id ? "rotate-180 text-indigo-400 border-indigo-500/30" : ""}`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {expandedStory === story.id && (
                  <div className="p-6 pt-0 border-t border-slate-200 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center justify-between rounded-sm border border-amber-200 bg-amber-50 p-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-700">Eyebrow visibility</Label>
                          <p className="mt-1 text-xs text-slate-500">
                            Show or hide this story&apos;s university label.
                          </p>
                        </div>
                        <Switch
                          aria-label={`Show eyebrow for ${story.name}`}
                          checked={story.showEyebrow ?? true}
                          onCheckedChange={(checked) => updateStory(index, "showEyebrow", checked)}
                        />
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                            <User size={12} /> Student Name
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.name}
                              onChange={(e) => updateStory(index, "name", e.target.value)}
                              className="bg-white border-slate-200 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. John Doe"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                            <Building2 size={12} /> University
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.university}
                              onChange={(e) => updateStory(index, "university", e.target.value)}
                              className="bg-white border-slate-200 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. Harvard University"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                            <GraduationCap size={12} /> Course / Subject
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.subject}
                              onChange={(e) => updateStory(index, "subject", e.target.value)}
                              className="bg-white border-slate-200 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. MSc Data Science"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                          <ImageIcon size={12} /> Profile Image
                        </Label>
                        <div className="rounded-sm border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-300">
                          {story.image ? (
                            <Image
                              src={story.image}
                              alt={`${story.name || "Student"} profile preview`}
                              width={320}
                              height={240}
                              loading="eager"
                              className="mb-3 h-48 w-full rounded-sm border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="mb-3 flex h-48 items-center justify-center rounded-sm border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
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
                            Media
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-5">
                      <Label className="text-slate-600 text-xs font-medium flex items-center gap-2">
                        <BookOpen size={12} /> Success Story Description
                      </Label>
                      <div className="relative group/input">
                        <Textarea
                          value={story.description}
                          onChange={(e) => updateStory(index, "description", e.target.value)}
                          className="bg-white border-slate-200 min-h-[9rem] focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
                          placeholder="Describe their achievements and journey..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {mediaTarget !== null && (
        <ImagePickerModal
          close={() => setMediaTarget(null)}
          onSelect={(url) => {
            updateStory(mediaTarget, "image", url);
            setMediaTarget(null);
          }}
          title="Choose student profile image"
          description="Select an existing media image or upload a new one."
          uploadLabel="Upload profile image"
        />
      )}
    </div>
  );
};

export default MutationSection10;
