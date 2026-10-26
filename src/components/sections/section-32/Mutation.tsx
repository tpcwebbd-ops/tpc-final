/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { Section32Data, defaultDataSection32, IStoryItem, Section32Payload, defaultLayout } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;

export interface SectionFormProps {
  data?: Section32Data | Section32Payload;
  onChange?: (values: Section32Data | Section32Payload) => void;
  onSubmit?: (values: Section32Data | Section32Payload) => void;
}

const MutationSection32 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section32Payload = { ...defaultDataSection32, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section32Data>(() => ({
    ...initialPayload,
    stories: initialPayload.stories ?? defaultDataSection32.stories,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section32Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleAddStory = () => {
    const newStory: IStoryItem = {
      id: Date.now().toString(),
      name: "New Student",
      university: "University Name",
      subject: "Major / Subject",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
      description: "Enter a brief description of the student journey here.",
    };
    updateField("stories", [...formData.stories, newStory]);
  };

  const handleRemoveStory = (index: number) => {
    const newStories = formData.stories.filter((_, i) => i !== index);
    updateField("stories", newStories);
  };

  const updateStory = (index: number, field: keyof IStoryItem, value: string) => {
    const newStories = [...formData.stories];
    newStories[index] = { ...newStories[index], [field]: value };
    updateField("stories", newStories);
  };

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#e8d8bd] bg-[#fffaf0] text-stone-800 font-sans">
      <div className="w-full overflow-hidden rounded-sm border border-[#e8d8bd] bg-[#fffdf8] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#eadcc7] bg-gradient-to-r from-[#fff2d9] via-[#fffaf0] to-[#f4efff] p-6">
          <div className="p-2 bg-indigo-100 rounded-full">
            <LayoutTemplate className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Section 32
            </h2>
            <p className="text-slate-500 text-sm">Manage student success stories and journey timeline.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600">Section Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500 text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Subtitle / Description</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="bg-white border-slate-200 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="h-px bg-indigo-100" />

          <div className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
            <div className="flex items-start md:items-center jsutify-start md:justify-between gap-2 flex-col md:flex-row">
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
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white/95 backdrop-blur py-4 border-b border-indigo-100">
              <Label className="text-slate-800 text-lg font-semibold flex items-center gap-2">
                Stories{" "}
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {formData.stories.length}
                </span>
              </Label>
              <Button onClick={handleAddStory} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Story
              </Button>
            </div>

            <div className="space-y-6">
              {formData.stories.map((story, idx) => (
                <div
                  key={story.id || idx}
                  className="bg-white border border-slate-200 p-6 rounded-sm relative group hover:border-indigo-200 transition-colors shadow-sm"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-xs text-indigo-700 font-mono bg-indigo-50 px-2 py-1 rounded-sm">
                      #{idx + 1}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleRemoveStory(idx)}
                      className="p-2 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="space-y-4 md:col-span-4">
                      <div className="aspect-square relative rounded-sm overflow-hidden bg-slate-100 border border-slate-200">
                        {story.image ? (
                          <Image
                            src={story.image}
                            alt="Preview"
                            className="object-cover opacity-70"
                            fill
                            sizes="256px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setImagePickerIndex(idx)}
                            className="w-full bg-white/90 text-stone-800 hover:bg-white"
                          >
                            Edit image
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-8">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500">Name</Label>
                          <Input
                            value={story.name}
                            onChange={(e) => updateStory(idx, "name", e.target.value)}
                            className="bg-white border-slate-200 focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500">University</Label>
                          <Input
                            value={story.university}
                            onChange={(e) => updateStory(idx, "university", e.target.value)}
                            className="bg-white border-slate-200 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Subject / Major</Label>
                        <Input
                          value={story.subject}
                          onChange={(e) => updateStory(idx, "subject", e.target.value)}
                          className="bg-white border-slate-200 focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Description</Label>
                        <Textarea
                          value={story.description}
                          onChange={(e) => updateStory(idx, "description", e.target.value)}
                          className="min-h-36 resize-y border-slate-200 bg-white focus:border-indigo-500"
                          rows={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {imagePickerIndex !== null && (
        <ImagePickerModal
          close={() => setImagePickerIndex(null)}
          onSelect={(url) => {
            updateStory(imagePickerIndex, "image", url);
            setImagePickerIndex(null);
          }}
          title="Choose student image"
          description="Select an image from the Media Library or upload a new one."
          uploadLabel="Upload student image"
        />
      )}
    </div>
  );
};

export default MutationSection32;
