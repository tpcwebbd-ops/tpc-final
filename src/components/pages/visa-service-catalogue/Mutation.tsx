/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { Palette as PaletteIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataVisaServiceCatalogue,
  defaultLayout,
  type IVisaServiceCatalogueData,
  type VisaServiceCatalogueItem,
  type VisaServiceCataloguePayload,
} from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string }) => {
  void _props;
  return <>{iconMap[icon]}</>;
};
const ImageIcon = iconComponent("Image");
const Palette = PaletteIcon;

const MediaImagePreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative mt-3 h-40 overflow-hidden rounded-sm border border-slate-200 bg-white">
    {src ? (
      <Image alt={alt} className="object-contain p-2" fill sizes="(max-width: 640px) 90vw, 320px" src={src} />
    ) : (
      <div className="grid h-full place-items-center text-xs text-slate-400">No image selected</div>
    )}
  </div>
);

export interface VisaServiceCatalogueFormProps {
  data?: IVisaServiceCatalogueData | VisaServiceCataloguePayload;
  onChange?: (values: VisaServiceCataloguePayload) => void;
}

const cloneData = (data: IVisaServiceCatalogueData): IVisaServiceCatalogueData =>
  JSON.parse(JSON.stringify(data)) as IVisaServiceCatalogueData;

const normalizeData = (data?: IVisaServiceCatalogueData | VisaServiceCataloguePayload): VisaServiceCataloguePayload => {
  const incoming = data ? cloneData(data) : cloneData(defaultDataVisaServiceCatalogue);
  return {
    ...defaultDataVisaServiceCatalogue,
    ...defaultLayout,
    ...incoming,
    pageUid: "visa-service-catalogue-uid",
    pageName: "Service Catalogue",
    services: defaultDataVisaServiceCatalogue.services.map((service, index) => ({
      ...service,
      ...(Array.isArray(incoming.services) ? incoming.services[index] : {}),
      id: service.id,
    })),
  };
};

const colorFields: Array<{
  field: "backgroundColor" | "alternateColor" | "headingColor" | "textColor" | "accentColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Light background" },
  { field: "alternateColor", label: "Alternate surface" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Text" },
  { field: "accentColor", label: "Accent" },
];

const MutationVisaServiceCatalogue = ({ data, onChange }: VisaServiceCatalogueFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IVisaServiceCatalogueData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [mediaServiceIndex, setMediaServiceIndex] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const nextData = normalizeData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX((current) => (current === nextData.paddingX ? current : nextData.paddingX));
    setPaddingY((current) => (current === nextData.paddingY ? current : nextData.paddingY));
  }, [data]);

  useEffect(() => {
    onChangeRef.current?.({
      ...formData,
      paddingX,
      paddingY,
      pageUid: "visa-service-catalogue-uid",
      pageName: "Service Catalogue",
    });
  }, [formData, paddingX, paddingY]);
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateService = <K extends keyof VisaServiceCatalogueItem>(
    index: number,
    field: K,
    value: VisaServiceCatalogueItem[K],
  ) => {
    setFormData((current) => ({
      ...current,
      services: current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service,
      ),
    }));
  };

  const updateColor = (field: (typeof colorFields)[number]["field"], value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const inputClass = "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-teal-500";

  return (
    <div className="custom-parent-border bg-white text-stone-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-[#eadfca] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-bold">Edit Service Catalogue</h2>
            <p className="mt-1 text-sm text-slate-500">Four sections only.</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
            visa-service-catalogue-uid
          </span>
        </header>

        <div className="grid gap-5 p-5 lg:grid-cols-2 sm:p-6 lg:p-8">
          {formData.services.map((service, index) => (
            <div key={service.id} className="space-y-4 rounded-sm border border-slate-200 bg-[#f5f8fc] p-5">
              <h3 className="flex items-center gap-2 font-bold">
                <ImageIcon className="h-4 w-4 text-teal-700" /> {service.title}
              </h3>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(event) => updateService(index, "title", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(event) => updateService(index, "description", event.target.value)}
                  className={`${inputClass} min-h-[9rem] resize-y`}
                />
              </div>

              <div className="space-y-2">
                <Label>Image alt text</Label>
                <Input
                  value={service.imageAlt}
                  onChange={(event) => updateService(index, "imageAlt", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label>Short points</Label>
                <Input
                  value={service.points.join(", ")}
                  onChange={(event) =>
                    updateService(
                      index,
                      "points",
                      event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .slice(0, 3),
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label>Picture</Label>
                <MediaImagePreview alt={service.imageAlt || `${service.title} image`} src={service.imageUrl} />
                <Button
                  className="w-full border-amber-200 bg-amber-100 text-amber-950 hover:bg-amber-200"
                  onClick={() => setMediaServiceIndex(index)}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Edit image
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-5 mb-5 space-y-4 rounded-sm border border-slate-200 bg-[#f5f8fc] p-5 sm:mx-6 sm:mb-6 lg:mx-8 lg:mb-8">
          <h3 className="flex items-center gap-2 font-bold">
            <Palette className="h-4 w-4 text-teal-700" /> Colors
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {colorFields.map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <Label>{label}</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData[field]}
                    onChange={(event) => updateColor(field, event.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-sm border border-slate-200 bg-white p-1"
                    aria-label={`${label} color`}
                  />
                  <Input
                    value={formData[field]}
                    onChange={(event) => updateColor(field, event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mx-5 mb-5 grid gap-4 rounded-sm border border-cyan-100 bg-cyan-50/60 p-5 sm:mx-6 sm:grid-cols-2">
          {(
            [
              ["paddingX", "Padding X", paddingX],
              ["paddingY", "Padding Y", paddingY],
            ] as const
          ).map(([field, label, value]) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
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
      </div>
      {mediaServiceIndex !== null ? (
        <ImagePickerModal
          close={() => setMediaServiceIndex(null)}
          description="Select an image from Media Library or upload a new service image."
          onSelect={(url) => {
            updateService(mediaServiceIndex, "imageUrl", url);
            setMediaServiceIndex(null);
          }}
          title="Choose service image"
          uploadLabel="Upload service image"
        />
      ) : null}
    </div>
  );
};

export default MutationVisaServiceCatalogue;
