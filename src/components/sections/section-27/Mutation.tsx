/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Section27Data, defaultDataSection27, ICourseCard, Section27Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Clock = iconMap.Clock;

export interface Section27FormProps {
  data?: Section27Data | Section27Payload;
  onChange?: (values: Section27Data | Section27Payload) => void;
  onSubmit?: (values: Section27Data | Section27Payload) => void;
}

const MutationSection27 = ({ data, onChange }: Section27FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section27Payload = {
    ...defaultDataSection27,
    ...defaultLayout,
    ...(data || {}),
  };
  const [formData, setFormData] = useState<Section27Data>(() => ({
    ...initialPayload,
    courses: initialPayload.courses ?? defaultDataSection27.courses,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section27Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleAddCourse = () => {
    const newCourse: ICourseCard = {
      title: "New Course",
      level: "General Level",
      levelColorClass: "bg-zinc-100 text-zinc-700",
      description: "Course description...",
      features: ["Feature 1", "Feature 2"],
      duration: "2 Months",
      classes: "20 Classes",
      price: "$100",
      popular: false,
    };
    updateField("courses", [...formData.courses, newCourse]);
  };

  const handleRemoveCourse = (index: number) => {
    const newCourses = formData.courses.filter((_, i) => i !== index);
    updateField("courses", newCourses);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCourse = (index: number, field: keyof ICourseCard, value: any) => {
    const newCourses = [...formData.courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    updateField("courses", newCourses);
  };

  const handleFeatureChange = (courseIndex: number, featureIndex: number, value: string) => {
    const newCourses = [...formData.courses];
    const newFeatures = [...newCourses[courseIndex].features];
    newFeatures[featureIndex] = value;
    newCourses[courseIndex].features = newFeatures;
    updateField("courses", newCourses);
  };

  const addFeature = (courseIndex: number) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex].features.push("New Feature");
    updateField("courses", newCourses);
  };

  const removeFeature = (courseIndex: number, featureIndex: number) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex].features = newCourses[courseIndex].features.filter((_, i) => i !== featureIndex);
    updateField("courses", newCourses);
  };

  const handleScheduleChange = (courseIndex: number, scheduleIndex: number, value: string) => {
    const newCourses = [...formData.courses];
    const newSchedule = [...(newCourses[courseIndex].schedule || [])];
    newSchedule[scheduleIndex] = value;
    newCourses[courseIndex].schedule = newSchedule;
    updateField("courses", newCourses);
  };

  const addScheduleItem = (courseIndex: number) => {
    const newCourses = [...formData.courses];
    if (!newCourses[courseIndex].schedule) newCourses[courseIndex].schedule = [];
    newCourses[courseIndex].schedule!.push("New Time Slot");
    updateField("courses", newCourses);
  };

  const removeScheduleItem = (courseIndex: number, scheduleIndex: number) => {
    const newCourses = [...formData.courses];
    if (newCourses[courseIndex].schedule) {
      newCourses[courseIndex].schedule = newCourses[courseIndex].schedule!.filter((_, i) => i !== scheduleIndex);
    }
    updateField("courses", newCourses);
  };

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white text-stone-800 font-sans">
      <div className="w-full bg-white border border-[#eadfca] rounded-sm overflow-hidden shadow-sm">
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <LayoutTemplate className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Section 27
            </h2>
            <p className="text-slate-500 text-sm">Manage pricing cards and course details.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-600">Badge Text</Label>
                <Input
                  value={formData.badgeText}
                  onChange={(e) => updateField("badgeText", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Subtitle</Label>
                <Input
                  value={formData.subTitle}
                  onChange={(e) => updateField("subTitle", e.target.value)}
                  className="bg-white border-slate-200 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Heading Prefix</Label>
                <Input
                  value={formData.headingPrefix}
                  onChange={(e) => updateField("headingPrefix", e.target.value)}
                  className="bg-white border-slate-200"
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
                  className="bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-600">Tab 1 Label</Label>
                <Input
                  value={formData.tab1Label}
                  onChange={(e) => updateField("tab1Label", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Tab 2 Label</Label>
                <Input
                  value={formData.tab2Label}
                  onChange={(e) => updateField("tab2Label", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start md:items-center flex-col md:flex-row justify-start md:justify-between gap-2">
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

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 text-lg font-semibold">Courses</Label>
              <Button
                onClick={handleAddCourse}
                size="sm"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formData.courses.map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 relative group shadow-sm"
                >
                  <button
                    onClick={() => handleRemoveCourse(idx)}
                    className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Title</Label>
                      <Input
                        value={course.title}
                        onChange={(e) => updateCourse(idx, "title", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Price</Label>
                      <Input
                        value={course.price}
                        onChange={(e) => updateCourse(idx, "price", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Description</Label>
                    <Textarea
                      value={course.description}
                      onChange={(e) => updateCourse(idx, "description", e.target.value)}
                      className="min-h-36 resize-y border-slate-200 bg-white text-sm"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Level Name</Label>
                      <Input
                        value={course.level}
                        onChange={(e) => updateCourse(idx, "level", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Level Class (Tailwind)</Label>
                      <Input
                        value={course.levelColorClass}
                        onChange={(e) => updateCourse(idx, "levelColorClass", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Duration</Label>
                      <Input
                        value={course.duration}
                        onChange={(e) => updateCourse(idx, "duration", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Classes</Label>
                      <Input
                        value={course.classes}
                        onChange={(e) => updateCourse(idx, "classes", e.target.value)}
                        className="bg-white border-slate-200 h-9"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={course.popular}
                      onCheckedChange={(checked) => updateCourse(idx, "popular", checked)}
                    />
                    <Label className="text-sm text-slate-600">Mark as Popular</Label>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-500">Features</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => addFeature(idx)}>
                        <Plus size={14} />
                      </Button>
                    </div>
                    {course.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex gap-2 mb-2">
                        <Input
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, fIdx, e.target.value)}
                          className="h-7 text-xs bg-white border-slate-200"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-slate-500 hover:text-rose-500"
                          onClick={() => removeFeature(idx, fIdx)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-500">Schedule (Optional)</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => addScheduleItem(idx)}>
                        <Clock size={14} />
                      </Button>
                    </div>
                    {course.schedule &&
                      course.schedule.map((sch, sIdx) => (
                        <div key={sIdx} className="flex gap-2 mb-2">
                          <Input
                            value={sch}
                            onChange={(e) => handleScheduleChange(idx, sIdx, e.target.value)}
                            className="h-7 text-xs bg-white border-slate-200"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-slate-500 hover:text-rose-500"
                            onClick={() => removeScheduleItem(idx, sIdx)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection27;
