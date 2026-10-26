/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge as BadgeIconComponent, Layers as LayersIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection13, IEvent, Section13Data } from "./data";
import { defaultEvent } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const X = iconComponent("X");
const Tag = iconComponent("Tag");
const Plus = iconComponent("Plus");
const Users = iconComponent("Users");
const Trash2 = iconComponent("Trash2");
const MapPin = iconComponent("MapPin");
const Ticket = iconComponent("Tag");
const Layers = LayersIcon;
const ImageIcon = iconComponent("Image");
const ChevronDown = iconComponent("ChevronDown");
const CalendarDays = iconComponent("Calendar");
const LayoutTemplate = iconComponent("Layout");
const BadgeIcon = BadgeIconComponent;

export interface Section13FormProps {
  data?: Section13Data;
  onChange?: (values: Section13Data) => void;
}

const MutationSection13 = ({ data, onChange }: Section13FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section13Data>(() => ({
    ...defaultDataSection13,
    ...data,
    categories: data?.categories ?? defaultDataSection13.categories,
    events: data?.events ?? defaultDataSection13.events,
  }));
  const [expandedEvent, setExpandedEvent] = useState<string | null>(
    data?.events?.[0]?.id || defaultDataSection13.events[0]?.id || null,
  );
  const [newCategory, setNewCategory] = useState("");
  const [mediaEventIndex, setMediaEventIndex] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  const handleChange = (field: keyof Section13Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEvent = (index: number, field: keyof IEvent, value: string) => {
    const updated = [...(formData.events || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, events: updated }));
  };

  const addEvent = () => {
    const categories = formData.categories || [];
    const newEvent: IEvent = {
      id: `evt-${Date.now()}`,
      ...defaultEvent,
      category: categories.length > 0 ? categories[0] : "General",
    };
    setFormData((prev) => ({
      ...prev,
      events: [newEvent, ...(prev.events || [])],
    }));
    setExpandedEvent(newEvent.id);
  };

  const removeEvent = (index: number) => {
    const updated = (formData.events || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, events: updated }));
  };

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const handleAddCategory = () => {
    const currentCategories = formData.categories || [];
    if (newCategory.trim() && !currentCategories.includes(newCategory.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: (prev.categories || []).filter((c) => c !== catToRemove),
    }));
  };

  return (
    <div className="custom-parent-border min-h-screen bg-white text-stone-800 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-rose-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-orange-100/60 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Users size={12} />
            <span>Community Manager</span>
          </motion.div>
          <h1 className="bg-gradient-to-r from-rose-700 to-orange-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Events & Gatherings
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-slate-600">
            Curate your community meetup schedule. Manage event details, categories, and locations.
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public events section.
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
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold tabular-nums text-rose-700">
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

        <div className="grid grid-cols-1 gap-8">
          <div className="h-fit space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600">
                <LayoutTemplate size={14} />
                <span>Section Header</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 rounded-sm border border-slate-200 bg-white p-3">
                    <div>
                      <Label className="flex items-center gap-2 text-slate-700">
                        <BadgeIcon size={14} className="text-rose-500" /> Eyebrow
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">Show or hide the eyebrow on the public section.</p>
                    </div>
                    <Switch
                      aria-label="Show eyebrow"
                      checked={formData.showEyebrow !== false}
                      onCheckedChange={(checked) => setFormData((current) => ({ ...current, showEyebrow: checked }))}
                    />
                  </div>
                  <Label className="text-slate-700">Eyebrow Text</Label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => handleChange("badge", e.target.value)}
                    className="h-11 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                    placeholder="e.g. Get Together"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="h-11 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Subtitle</Label>
                  <Input
                    value={formData.subTitle}
                    onChange={(e) => handleChange("subTitle", e.target.value)}
                    className="h-11 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-36 resize-y border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                    rows={6}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-rose-400 uppercase text-xs font-bold tracking-widest mb-6">
                <Layers size={14} />
                <span>Event Categories</span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    placeholder="Add category..."
                    className="h-10 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                  />
                  <Button
                    onClick={handleAddCategory}
                    size="sm"
                    className="h-10 w-10 border border-rose-200 bg-rose-50 p-0 text-rose-800 hover:bg-rose-100"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.categories || []).map((cat) => (
                    <motion.span
                      key={cat}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="group inline-flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-700"
                    >
                      {cat}
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                  {(!formData.categories || formData.categories.length === 0) && (
                    <span className="text-zinc-600 text-xs italic">No categories defined.</span>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={addEvent}
                className="w-full rounded-sm border border-rose-200 bg-rose-50 font-bold text-rose-900 shadow-sm transition-all hover:scale-[1.02] hover:bg-rose-100 active:scale-[0.98]"
                size="sm"
              >
                <div className="flex items-center gap-1">
                  <Plus className="h-5 w-5 mb-1" />
                  <span>Create New Event</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {(formData.events || []).map((evt, index) => (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative border bg-white ${
                    expandedEvent === evt.id
                      ? "border-rose-500/40 ring-1 ring-rose-500/20"
                      : "border-slate-200 hover:border-rose-200"
                  } overflow-hidden rounded-sm transition-all duration-300`}
                >
                  <div
                    className="p-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(evt.id)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                        {evt.image ? (
                          <Image
                            width={100}
                            height={100}
                            src={evt.image}
                            alt={evt.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CalendarDays size={24} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-rose-600">
                          {evt.title || "Untitled Event"}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          <span className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                            <CalendarDays size={10} /> {evt.date}
                          </span>
                          <span className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                            <Tag size={10} /> {evt.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEvent(index);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <div
                        className={`transition-transform duration-300 ${expandedEvent === evt.id ? "rotate-180 text-rose-400" : "text-zinc-500"}`}
                      >
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedEvent === evt.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200"
                      >
                        <div className="space-y-8 bg-slate-50 p-6 md:p-8">
                          <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                  Event Name
                                </Label>
                                <Input
                                  value={evt.title}
                                  onChange={(e) => updateEvent(index, "title", e.target.value)}
                                  className="h-10 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                                  placeholder="e.g. Annual Summit"
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                    <CalendarDays size={12} /> Date
                                  </Label>
                                  <Input
                                    value={evt.date}
                                    onChange={(e) => updateEvent(index, "date", e.target.value)}
                                    className="h-10 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                                    placeholder="Oct 20, 2024"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                    <MapPin size={12} /> Location
                                  </Label>
                                  <Input
                                    value={evt.location}
                                    onChange={(e) => updateEvent(index, "location", e.target.value)}
                                    className="h-10 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                                    placeholder="City / Online"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                    <Tag size={12} /> Category
                                  </Label>
                                  <div className="relative">
                                    <select
                                      value={evt.category}
                                      onChange={(e) => updateEvent(index, "category", e.target.value)}
                                      className="h-10 w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                                    >
                                      <option value="" disabled>
                                        Select Category
                                      </option>
                                      {(formData.categories || []).map((cat) => (
                                        <option key={cat} value={cat}>
                                          {cat}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                      size={14}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                    <Ticket size={12} /> Button Label
                                  </Label>
                                  <Input
                                    value={evt.actionText}
                                    onChange={(e) => updateEvent(index, "actionText", e.target.value)}
                                    className="h-10 border-slate-200 bg-white text-slate-900 focus:border-rose-500/50"
                                    placeholder="Register"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                                  <ImageIcon size={12} /> Cover Image
                                </Label>
                                <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-sm border border-slate-200 bg-white p-4">
                                  {evt.image ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-50">
                                      <Image
                                        alt={evt.title || "Event cover preview"}
                                        className="object-cover"
                                        fill
                                        src={evt.image}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-slate-50 text-slate-500">
                                      <ImageIcon size={28} />
                                    </div>
                                  )}
                                  <Button
                                    className="border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
                                    onClick={() => setMediaEventIndex(index)}
                                    type="button"
                                    variant="outline"
                                  >
                                    <ImageIcon className="" size={16} /> Media
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                  Description
                                </Label>
                                <Textarea
                                  value={evt.description}
                                  onChange={(e) => updateEvent(index, "description", e.target.value)}
                                  className="min-h-36 resize-y border-slate-200 bg-white leading-relaxed text-slate-700 focus:border-rose-500/50"
                                  placeholder="Describe the event..."
                                  rows={6}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!formData.events || formData.events.length === 0) && (
              <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                <p className="text-zinc-500 italic">No events listed. Start by adding one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {mediaEventIndex !== null && (
        <ImagePickerModal
          close={() => setMediaEventIndex(null)}
          description="Select an existing event image or upload a new one."
          onSelect={(url) => {
            updateEvent(mediaEventIndex, "image", url);
            setMediaEventIndex(null);
          }}
          title="Choose event image"
          uploadLabel="Upload event image"
        />
      )}
    </div>
  );
};

export default MutationSection13;
