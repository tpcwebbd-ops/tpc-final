/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { RichTextEditor } from "@/components/sections/section-1/RichTextEditor";
import { IconPicker } from "@/components/ui/icon-picker";
import { Slider } from "@/components/ui/slider";

import {
  defaultDataDetailsPage,
  defaultLayout,
  IDetailsPageData,
  DetailsPagePayload,
  ProductShowcaseSocial,
  toRichTextContent,
} from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  void _props;
  return <>{iconMap[icon]}</>;
};
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");

export interface DetailsPageFormProps {
  data?: IDetailsPageData | DetailsPagePayload | string;
  onChange?: (values: DetailsPagePayload) => void;
}

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500";
const nextId = (items: ProductShowcaseSocial[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

const parseDetailsPageData = (data?: DetailsPageFormProps["data"]): Partial<DetailsPagePayload> => {
  if (!data) return {};
  if (typeof data !== "string") return data;

  try {
    return JSON.parse(data) as Partial<IDetailsPageData>;
  } catch {
    return {};
  }
};

const normalizeData = (data?: DetailsPageFormProps["data"]): DetailsPagePayload => ({
  ...defaultDataDetailsPage,
  ...defaultLayout,
  ...parseDetailsPageData(data),
  pageUid: "details-page-uid",
  pageName: "Product Showcase",
});

const MutationDetailsPage = ({ data, onChange }: DetailsPageFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [settings, setSettings] = useState<IDetailsPageData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const nextData = normalizeData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX((current) => (current === nextData.paddingX ? current : nextData.paddingX));
    setPaddingY((current) => (current === nextData.paddingY ? current : nextData.paddingY));
  }, [data]);

  useEffect(() => {
    onChangeRef.current?.({
      ...settings,
      paddingX,
      paddingY,
      pageUid: "details-page-uid",
      pageName: "Product Showcase",
    });
  }, [settings, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateFeature = (index: number, value: string) => {
    setSettings((prev) => ({
      ...prev,
      features: prev.features.map((feature, featureIndex) => (featureIndex === index ? value : feature)),
    }));
  };

  const updateSocial = (id: number, field: keyof ProductShowcaseSocial, value: string) => {
    setSettings((prev) => ({
      ...prev,
      socials: prev.socials.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="custom-parent-border px-4 space-y-6 rounded-sm bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Edit Page 101 Product Showcase</h2>
          <p className="text-sm text-slate-500">Edit the product showcase and rich description.</p>
        </div>
      </div>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClass}>Image</label>
            <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
              <div className="grid aspect-video w-full max-w-xs place-items-center overflow-hidden rounded-sm bg-slate-100">
                {settings.imageUrl ? (
                  <Image
                    alt={settings.imageAlt || "Product showcase preview"}
                    className="h-full w-full object-cover"
                    src={settings.imageUrl}
                    height={320}
                    width={560}
                  />
                ) : (
                  <span className="text-xs text-slate-500">No image selected</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-sm bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
                  onClick={() => setImagePickerOpen(true)}
                  type="button"
                >
                  {settings.imageUrl ? "Edit image" : "Choose image"}
                </button>
                <span className="self-center text-xs text-slate-500">Select from the Media Library or upload.</span>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Image Alt</label>
            <input
              value={settings.imageAlt}
              onChange={(e) => setSettings((prev) => ({ ...prev, imageAlt: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Category Title</label>
            <input
              value={settings.categoryTitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, categoryTitle: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Product Title</label>
            <input
              value={settings.productTitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, productTitle: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Price Label</label>
            <input
              value={settings.priceLabel}
              onChange={(e) => setSettings((prev) => ({ ...prev, priceLabel: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              value={settings.price}
              onChange={(e) => setSettings((prev) => ({ ...prev, price: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Buy Button</label>
            <input
              value={settings.buyButtonText}
              onChange={(e) => setSettings((prev) => ({ ...prev, buyButtonText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Membership Button</label>
            <input
              value={settings.membershipButtonText}
              onChange={(e) => setSettings((prev) => ({ ...prev, membershipButtonText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Tutorial Button</label>
            <input
              value={settings.tutorialButtonText}
              onChange={(e) => setSettings((prev) => ({ ...prev, tutorialButtonText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Live Demo URL</label>
            <input
              value={settings.liveDemoUrl}
              onChange={(e) => setSettings((prev) => ({ ...prev, liveDemoUrl: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              value={settings.videoUrl}
              onChange={(e) => setSettings((prev) => ({ ...prev, videoUrl: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Download URL</label>
            <input
              value={settings.downloadUrl}
              onChange={(e) => setSettings((prev) => ({ ...prev, downloadUrl: e.target.value }))}
              className={`${inputClass} mt-1`}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>Download Link Text</label>
            <input
              value={settings.downloadLinkText}
              onChange={(e) => setSettings((prev) => ({ ...prev, downloadLinkText: e.target.value }))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className={labelClass}>Product Lookup Limit</label>
            <input
              type="number"
              min={1}
              value={settings.productLookupLimit}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  productLookupLimit: Math.max(1, Number(e.target.value) || defaultDataDetailsPage.productLookupLimit),
                }))
              }
              className={`${inputClass} mt-1`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`${labelClass} mb-2 block`}>Product Description</label>
            <RichTextEditor
              value={toRichTextContent(settings.productDescriptions)}
              onChange={(content) => setSettings((prev) => ({ ...prev, productDescriptions: content }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold text-slate-900">Countdown</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {(["hours", "minutes", "seconds"] as const).map((key) => (
            <div key={key}>
              <label className={labelClass}>{key}</label>
              <input
                type="number"
                min={0}
                value={settings.timer[key]}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, timer: { ...prev.timer, [key]: Number(e.target.value) } }))
                }
                className={`${inputClass} mt-1`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Features</h3>
          <button
            onClick={() => setSettings((prev) => ({ ...prev, features: [...prev.features, "New feature"] }))}
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.features.map((feature, index) => (
            <div key={`${feature}-${index}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
              <input value={feature} onChange={(e) => updateFeature(index, e.target.value)} className={inputClass} />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    features: prev.features.filter((_, featureIndex) => featureIndex !== index),
                  }))
                }
                className="rounded-sm p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Social Links</h3>
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                socials: [...prev.socials, { id: nextId(prev.socials), icon: "facebook", link: "#" }],
              }))
            }
            className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {settings.socials.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-sm border border-slate-100 bg-slate-50 p-3 md:grid-cols-[220px_1fr_auto]"
            >
              <IconPicker
                label="Social icon"
                onChange={(icon) => updateSocial(item.id, "icon", icon)}
                value={item.icon}
              />
              <input
                value={item.link}
                onChange={(e) => updateSocial(item.id, "link", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, socials: prev.socials.filter((social) => social.id !== item.id) }))
                }
                className="rounded-sm p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-sm border border-cyan-100 bg-cyan-50/60 p-5 sm:grid-cols-2">
        {(
          [
            ["paddingX", "Padding X", paddingX],
            ["paddingY", "Padding Y", paddingY],
          ] as const
        ).map(([field, label, value]) => (
          <div key={field} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className={labelClass}>{label}</label>
              <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">{value}px</span>
            </div>
            <Slider
              min={-300}
              max={300}
              step={1}
              value={[value]}
              onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
              aria-label={label}
            />
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>-300px</span>
              <span>0px</span>
              <span>+300px</span>
            </div>
          </div>
        ))}
      </section>
      {imagePickerOpen && (
        <ImagePickerModal
          close={() => setImagePickerOpen(false)}
          onSelect={(url) => {
            setSettings((prev) => ({ ...prev, imageUrl: url }));
            setImagePickerOpen(false);
          }}
          selectedUrl={settings.imageUrl}
          title="Choose product showcase image"
          uploadLabel="Upload product image"
        />
      )}
    </div>
  );
};

export default MutationDetailsPage;
