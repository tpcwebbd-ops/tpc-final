/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import {
  defaultDataSection34,
  defaultLayout,
  getYouTubeEmbedUrl,
  Section34Data,
  Section34Payload,
  VideoReview,
} from "./data";

const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;

export interface SectionFormProps {
  data?: Section34Data | Section34Payload;
  onChange?: (values: Section34Data | Section34Payload) => void;
  onSubmit?: (values: Section34Data | Section34Payload) => void;
}

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500";
const nextId = (items: VideoReview[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

const MutationSection34 = ({ data, onChange }: SectionFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section34Payload = { ...defaultDataSection34, ...defaultLayout, ...(data || {}) };
  const [settings, setSettings] = useState<Section34Data>(() => ({
    ...initialPayload,
    videos: initialPayload.videos ?? defaultDataSection34.videos,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...settings, paddingX, paddingY });
  }, [settings, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateVideo = (id: number, field: keyof VideoReview, value: string) => {
    setSettings((prev) => ({
      ...prev,
      videos: prev.videos.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="custom-parent-border mx-auto w-full max-w-7xl space-y-6 rounded-sm border-x border-[#eadfca] bg-[#fffaf0] text-stone-800 sm:p-6">
      <div className="flex items-center justify-between gap-3 rounded-sm border border-[#eadcc7] bg-gradient-to-r from-[#fff2d9] via-[#fffaf0] to-[#f4efff] p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Section 34 Video Reviews</h2>
          <p className="mt-1 text-sm text-slate-500">Paste a YouTube link to show an instant playable preview.</p>
        </div>
      </div>

      <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Badge Text</label>
            <input
              value={settings.badgeText}
              onChange={(e) => setSettings((prev) => ({ ...prev, badgeText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              value={settings.title}
              onChange={(e) => setSettings((prev) => ({ ...prev, title: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              value={settings.subtitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, subtitle: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Section spacing</h3>
            <p className="text-xs text-slate-500">Adjust horizontal and vertical padding.</p>
          </div>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">-300 to +300 px</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(
            [
              ["paddingX", paddingX, setPaddingX, "Padding X"],
              ["paddingY", paddingY, setPaddingY, "Padding Y"],
            ] as const
          ).map(([field, value, setter, label]) => (
            <div key={field} className="rounded-sm border border-white bg-white p-3 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
                <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">{value}px</span>
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
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Video Cards</h3>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                videos: [
                  ...prev.videos,
                  { id: nextId(prev.videos), label: "", sub: "", backgroundColor: "#0f172a", link: "" },
                ],
              }))
            }
            className="cursor-pointer bg-amber-100 text-amber-900 transition-all duration-700 hover:bg-amber-200"
          >
            <Plus size={14} /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {settings.videos.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 lg:grid-cols-[minmax(0,1fr)_320px]"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.label}
                  onChange={(e) => updateVideo(item.id, "label", e.target.value)}
                  className={inputClass}
                  placeholder="Video title"
                />
                <input
                  value={item.sub}
                  onChange={(e) => updateVideo(item.id, "sub", e.target.value)}
                  className={inputClass}
                  placeholder="Short description"
                />
                <div className="md:col-span-2">
                  <label className={`${labelClass} mb-1 block`}>YouTube URL</label>
                  <input
                    value={item.link}
                    onChange={(e) => updateVideo(item.id, "link", e.target.value)}
                    className={inputClass}
                    placeholder="https://www.youtube.com/watch?v=_hWK7TVM2ro"
                  />
                  {!getYouTubeEmbedUrl(item.link) && item.link && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      Enter a valid YouTube watch, short, embed, or youtu.be URL.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 md:col-span-2">
                  <input
                    type="color"
                    value={item.backgroundColor}
                    onChange={(e) => updateVideo(item.id, "backgroundColor", e.target.value)}
                    className="h-10 w-12 rounded border border-slate-200"
                  />
                  <input
                    value={item.backgroundColor}
                    onChange={(e) => updateVideo(item.id, "backgroundColor", e.target.value)}
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, videos: prev.videos.filter((video) => video.id !== item.id) }))
                    }
                    className="cursor-pointer transition-all duration-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-sm border border-slate-200 bg-slate-950 shadow-sm">
                {getYouTubeEmbedUrl(item.link) ? (
                  <iframe
                    className="aspect-video w-full"
                    src={getYouTubeEmbedUrl(item.link)!}
                    title={item.label || "YouTube preview"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center p-5 text-center text-xs text-slate-300">
                    Paste a valid YouTube URL to see the video preview here.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MutationSection34;
