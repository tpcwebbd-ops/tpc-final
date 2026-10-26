/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import {
  Briefcase as BriefcaseIcon,
  Palette as PaletteIcon,
  Sparkles as SparklesIcon,
  Type as TypeIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataVisaServices,
  defaultLayout,
  type CatalogueBenefit,
  type CatalogueFaq,
  type CatalogueService,
  type CatalogueStat,
  type CatalogueStep,
  type IVisaServicesData,
  type VisaServicesPayload,
} from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string }) => {
  void _props;
  return <>{iconMap[icon]}</>;
};
const BriefcaseBusiness = BriefcaseIcon;
const Database = iconComponent("Database");
const ImageIcon = iconComponent("Image");
const Palette = PaletteIcon;
const Sparkles = SparklesIcon;
const Type = TypeIcon;

export interface VisaServicesFormProps {
  data?: IVisaServicesData | VisaServicesPayload;
  onChange?: (values: VisaServicesPayload) => void;
}

type CollectionKey = "stats" | "services" | "processSteps" | "benefits" | "faqs";
type CollectionValue = CatalogueStat[] | CatalogueService[] | CatalogueStep[] | CatalogueBenefit[] | CatalogueFaq[];

const cloneData = (data: IVisaServicesData): IVisaServicesData => JSON.parse(JSON.stringify(data)) as IVisaServicesData;

const normalizeData = (data?: IVisaServicesData | VisaServicesPayload): VisaServicesPayload => {
  if (!data) return { ...cloneData(defaultDataVisaServices), ...defaultLayout };

  return {
    ...defaultDataVisaServices,
    ...defaultLayout,
    ...cloneData(data),
    pageUid: "visa-services-uid",
    pageName: "Service Catalogue",
    stats: Array.isArray(data.stats) ? data.stats : defaultDataVisaServices.stats,
    services: Array.isArray(data.services) ? data.services : defaultDataVisaServices.services,
    processSteps: Array.isArray(data.processSteps) ? data.processSteps : defaultDataVisaServices.processSteps,
    benefits: Array.isArray(data.benefits) ? data.benefits : defaultDataVisaServices.benefits,
    faqs: Array.isArray(data.faqs) ? data.faqs : defaultDataVisaServices.faqs,
  };
};

const collectionMeta: Array<{ key: CollectionKey; label: string; help: string }> = [
  { key: "stats", label: "Hero statistics", help: "Value and label pairs displayed beneath the introduction." },
  {
    key: "services",
    label: "Service catalogue",
    help: "Each object controls a complete picture-led service section. Keep imageUrl and imageAlt for every service.",
  },
  { key: "processSteps", label: "Working process", help: "The four steps shown in the process timeline." },
  { key: "benefits", label: "Service benefits", help: "The cards explaining the Site service experience." },
  {
    key: "faqs",
    label: "Frequently asked questions",
    help: "Question and answer objects used by the public accordion.",
  },
];

const sectionGroups: Array<{
  label: string;
  eyebrow?: keyof IVisaServicesData;
  showEyebrow?: keyof IVisaServicesData;
  title: keyof IVisaServicesData;
  description: keyof IVisaServicesData;
}> = [
  {
    label: "Catalogue introduction",
    eyebrow: "catalogueEyebrow",
    showEyebrow: "showCatalogueEyebrow",
    title: "catalogueTitle",
    description: "catalogueDescription",
  },
  {
    label: "How we work",
    eyebrow: "processEyebrow",
    showEyebrow: "showProcessEyebrow",
    title: "processTitle",
    description: "processDescription",
  },
  {
    label: "Benefits",
    eyebrow: "benefitsEyebrow",
    showEyebrow: "showBenefitsEyebrow",
    title: "benefitsTitle",
    description: "benefitsDescription",
  },
  {
    label: "FAQ",
    eyebrow: "faqEyebrow",
    showEyebrow: "showFaqEyebrow",
    title: "faqTitle",
    description: "faqDescription",
  },
  { label: "Final call to action", title: "ctaTitle", description: "ctaDescription" },
];

const colorFields: Array<{
  field: "backgroundColor" | "surfaceColor" | "headingColor" | "textColor" | "accentColor" | "accentDarkColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "surfaceColor", label: "Surface" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Body text" },
  { field: "accentColor", label: "Accent" },
  { field: "accentDarkColor", label: "Dark accent" },
];

const MutationVisaServices = ({ data, onChange }: VisaServicesFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IVisaServicesData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [mediaServiceIndex, setMediaServiceIndex] = useState<number | null>(null);
  const [collectionDrafts, setCollectionDrafts] = useState<Record<CollectionKey, string>>(() => {
    const initial = normalizeData(data);
    return Object.fromEntries(collectionMeta.map(({ key }) => [key, JSON.stringify(initial[key], null, 2)])) as Record<
      CollectionKey,
      string
    >;
  });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  useEffect(() => {
    const next = normalizeData(data);
    const nextDrafts = Object.fromEntries(
      collectionMeta.map(({ key }) => [key, JSON.stringify(next[key], null, 2)]),
    ) as Record<CollectionKey, string>;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    setPaddingX((current) => (current === next.paddingX ? current : next.paddingX));
    setPaddingY((current) => (current === next.paddingY ? current : next.paddingY));
    setCollectionDrafts((current) => (JSON.stringify(current) === JSON.stringify(nextDrafts) ? current : nextDrafts));
  }, [data]);

  const updateField = <K extends keyof IVisaServicesData>(field: K, value: IVisaServicesData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateServiceEyebrowVisibility = (index: number, checked: boolean) => {
    updateCollectionItem("services", index, { showEyebrow: checked });
  };

  const updateCollectionItem = (key: CollectionKey, index: number, patch: Record<string, unknown>) => {
    setCollectionDrafts((current) => {
      try {
        const items = JSON.parse(current[key]) as Array<Record<string, unknown>>;
        if (!Array.isArray(items) || !items[index]) return current;
        items[index] = { ...items[index], ...patch };
        return { ...current, [key]: JSON.stringify(items, null, 2) };
      } catch {
        return current;
      }
    });
  };

  useEffect(() => {
    const parsedCollections = {} as Record<CollectionKey, CollectionValue>;

    collectionMeta.forEach(({ key }) => {
      try {
        const parsed = JSON.parse(collectionDrafts[key]) as unknown;
        if (!Array.isArray(parsed)) throw new Error("Enter a valid JSON array.");
        parsedCollections[key] = parsed as CollectionValue;
      } catch {
        parsedCollections[key] = [] as CollectionValue;
      }
    });

    onChangeRef.current?.({
      ...formData,
      paddingX,
      paddingY,
      pageUid: "visa-services-uid",
      pageName: "Service Catalogue",
      stats: parsedCollections.stats as CatalogueStat[],
      services: parsedCollections.services as CatalogueService[],
      processSteps: parsedCollections.processSteps as CatalogueStep[],
      benefits: parsedCollections.benefits as CatalogueBenefit[],
      faqs: parsedCollections.faqs as CatalogueFaq[],
    });
  }, [collectionDrafts, formData, paddingX, paddingY]);

  const inputClass =
    "border-[#e7dccb] bg-[#fffdf8] text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-300";
  const cardClass = "space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5 shadow-sm";
  const parseCollection = <T,>(key: CollectionKey): T[] => {
    try {
      const parsed = JSON.parse(collectionDrafts[key]) as T[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const statItems = parseCollection<CatalogueStat>("stats");
  const serviceDraftItems = parseCollection<CatalogueService>("services");
  const processItems = parseCollection<CatalogueStep>("processSteps");
  const benefitItems = parseCollection<CatalogueBenefit>("benefits");
  const faqItems = parseCollection<CatalogueFaq>("faqs");

  return (
    <div className="custom-parent-border px-4 bg-[#f8f3ea] text-slate-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8] shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eadfca] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-red-200 bg-red-50 p-2.5">
              <BriefcaseBusiness className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Service Catalogue</h2>
              <p className="text-sm text-slate-500">
                Manage the page content, service pictures, actions, company details, and theme.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-[#eadfca] bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            visa-services-uid
          </span>
        </header>

        <div className="space-y-8 p-5 sm:p-6 lg:p-8">
          <section className="grid gap-5 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-red-600" /> Hero content
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="visa-services-eyebrow">Eyebrow</Label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    Visible
                    <Switch
                      checked={formData.showEyebrow}
                      onCheckedChange={(checked) => updateField("showEyebrow", checked)}
                    />
                  </label>
                </div>
                <Input
                  id="visa-services-eyebrow"
                  value={formData.eyebrow}
                  onChange={(event) => updateField("eyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-services-hero-title">Hero title</Label>
                <Textarea
                  id="visa-services-hero-title"
                  value={formData.heroTitle}
                  onChange={(event) => updateField("heroTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-services-hero-description">Hero description</Label>
                <Textarea
                  id="visa-services-hero-description"
                  value={formData.heroDescription}
                  onChange={(event) => updateField("heroDescription", event.target.value)}
                  className={inputClass}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-services-trust-note">Trust note</Label>
                <Input
                  id="visa-services-trust-note"
                  value={formData.trustNote}
                  onChange={(event) => updateField("trustNote", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="flex items-center gap-2 font-bold">
                <Type className="h-4 w-4 text-red-600" /> Hero actions
              </h3>
              {(
                [
                  ["primaryButtonText", "Primary button text"],
                  ["primaryButtonUrl", "Primary button URL"],
                  ["secondaryButtonText", "Secondary button text"],
                  ["secondaryButtonUrl", "Secondary button URL"],
                ] as Array<[keyof IVisaServicesData, string]>
              ).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`visa-services-${field}`}>{label}</Label>
                  <Input
                    id={`visa-services-${field}`}
                    value={String(formData[field])}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Type className="h-5 w-5 text-red-600" /> Section copy
              </h3>
              <p className="mt-1 text-sm text-slate-500">Edit the heading hierarchy used across the public page.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {sectionGroups.map((section) => (
                <div key={section.label} className={cardClass}>
                  <h4 className="font-semibold">{section.label}</h4>
                  {section.eyebrow && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Eyebrow</Label>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          Visible
                          <Switch
                            checked={Boolean(section.showEyebrow && formData[section.showEyebrow])}
                            onCheckedChange={(checked) => {
                              if (section.showEyebrow) updateField(section.showEyebrow, checked);
                            }}
                          />
                        </label>
                      </div>
                      <Input
                        value={String(formData[section.eyebrow])}
                        onChange={(event) => updateField(section.eyebrow!, event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Textarea
                      value={String(formData[section.title])}
                      onChange={(event) => updateField(section.title, event.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={String(formData[section.description])}
                      onChange={(event) => updateField(section.description, event.target.value)}
                      className={inputClass}
                      rows={3}
                    />
                  </div>
                  {section.label === "Final call to action" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Button text</Label>
                        <Input
                          value={formData.ctaButtonText}
                          onChange={(event) => updateField("ctaButtonText", event.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button URL</Label>
                        <Input
                          value={formData.ctaButtonUrl}
                          onChange={(event) => updateField("ctaButtonUrl", event.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Database className="h-5 w-5 text-red-600" /> Structured collections
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage these lists with simple fields. Add one item per row and use one line per feature or process
                step.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className={cardClass}>
                <h4 className="font-semibold">Hero statistics</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {statItems.map((item, index) => (
                    <div key={item.id} className="space-y-2 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
                      <Label>Statistic {index + 1} value</Label>
                      <Input
                        value={item.value}
                        onChange={(e) => updateCollectionItem("stats", index, { value: e.target.value })}
                        className={inputClass}
                      />
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(e) => updateCollectionItem("stats", index, { label: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${cardClass} lg:col-span-2`}>
                <div>
                  <h4 className="flex items-center gap-2 font-semibold">
                    <ImageIcon className="h-4 w-4 text-red-600" /> Services
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Edit service content, links, images, and visibility without touching JSON.
                  </p>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {serviceDraftItems.map((service, index) => (
                    <div key={service.id} className="space-y-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h5 className="font-semibold">Service {index + 1}</h5>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          Eyebrow visible
                          <Switch
                            checked={service.showEyebrow !== false}
                            onCheckedChange={(checked) => updateServiceEyebrowVisibility(index, checked)}
                          />
                        </label>
                      </div>
                      {(
                        [
                          "eyebrow",
                          "title",
                          "description",
                          "imageUrl",
                          "imageAlt",
                          "outcome",
                          "duration",
                          "ctaText",
                          "ctaUrl",
                        ] as const
                      ).map((field) => (
                        <div key={field} className="space-y-1.5">
                          <Label>{field.replace(/([A-Z])/g, " $1")}</Label>
                          {field === "imageUrl" ? (
                            <div className="flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-white p-3 sm:flex-row sm:items-center">
                              <div className="grid aspect-video w-full max-w-xs place-items-center overflow-hidden rounded-sm bg-slate-100">
                                {service.imageUrl ? (
                                  <Image
                                    alt={service.imageAlt || `Service ${index + 1} preview`}
                                    className="h-full w-full object-cover"
                                    src={service.imageUrl}
                                    height={320}
                                    width={560}
                                  />
                                ) : (
                                  <span className="text-xs text-slate-500">No image selected</span>
                                )}
                              </div>
                              <button
                                className="w-fit rounded-sm bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                                onClick={() => setMediaServiceIndex(index)}
                                type="button"
                              >
                                {service.imageUrl ? "Edit image" : "Choose image"}
                              </button>
                            </div>
                          ) : field === "description" ? (
                            <Textarea
                              value={service[field]}
                              onChange={(e) => updateCollectionItem("services", index, { [field]: e.target.value })}
                              className={inputClass}
                              rows={3}
                            />
                          ) : (
                            <Input
                              value={service[field]}
                              onChange={(e) => updateCollectionItem("services", index, { [field]: e.target.value })}
                              className={inputClass}
                            />
                          )}
                        </div>
                      ))}
                      {(["features", "process"] as const).map((field) => (
                        <div key={field} className="space-y-1.5">
                          <Label>{field} (one item per line)</Label>
                          <Textarea
                            value={service[field].join("\n")}
                            onChange={(e) =>
                              updateCollectionItem("services", index, {
                                [field]: e.target.value
                                  .split("\n")
                                  .map((item) => item.trim())
                                  .filter(Boolean),
                              })
                            }
                            className={inputClass}
                            rows={4}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h4 className="font-semibold">Working process</h4>
                {processItems.map((item, index) => (
                  <div key={item.id} className="grid gap-2 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
                    <Label>Step {index + 1} title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateCollectionItem("processSteps", index, { title: e.target.value })}
                      className={inputClass}
                    />
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateCollectionItem("processSteps", index, { description: e.target.value })}
                      className={inputClass}
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className={cardClass}>
                <h4 className="font-semibold">Benefits</h4>
                {benefitItems.map((item, index) => (
                  <div key={item.id} className="grid gap-2 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
                    <Label>Benefit {index + 1} title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateCollectionItem("benefits", index, { title: e.target.value })}
                      className={inputClass}
                    />
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateCollectionItem("benefits", index, { description: e.target.value })}
                      className={inputClass}
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className={`${cardClass} lg:col-span-2`}>
                <h4 className="font-semibold">Frequently asked questions</h4>
                <div className="grid gap-4 lg:grid-cols-2">
                  {faqItems.map((item, index) => (
                    <div key={item.id} className="grid gap-2 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
                      <Label>Question {index + 1}</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => updateCollectionItem("faqs", index, { question: e.target.value })}
                        className={inputClass}
                      />
                      <Label>Answer</Label>
                      <Textarea
                        value={item.answer}
                        onChange={(e) => updateCollectionItem("faqs", index, { answer: e.target.value })}
                        className={inputClass}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="font-bold">Company information</h3>
              {(
                [
                  ["companyName", "Site name"],
                  ["companyEmail", "Email"],
                  ["companyContact", "Contact"],
                ] as Array<[keyof IVisaServicesData, string]>
              ).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    value={String(formData[field])}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className={cardClass}>
              <h3 className="flex items-center gap-2 font-bold">
                <Palette className="h-4 w-4 text-red-600" /> Page palette
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {colorFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={`visa-services-${field}`}>{label}</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`visa-services-${field}`}
                        type="color"
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className="h-10 w-12 border-[#e7dccb] bg-white p-1"
                      />
                      <Input
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 sm:grid-cols-2">
            {(
              [
                ["paddingX", "Padding X", paddingX],
                ["paddingY", "Padding Y", paddingY],
              ] as const
            ).map(([field, label, value]) => (
              <div key={field} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>{label}</Label>
                  <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                    {value}px
                  </span>
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
          {mediaServiceIndex !== null && (
            <ImagePickerModal
              close={() => setMediaServiceIndex(null)}
              onSelect={(url) => {
                updateCollectionItem("services", mediaServiceIndex, { imageUrl: url });
                setMediaServiceIndex(null);
              }}
              selectedUrl={serviceDraftItems[mediaServiceIndex]?.imageUrl}
              title="Choose service image"
              uploadLabel="Upload service image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MutationVisaServices;
