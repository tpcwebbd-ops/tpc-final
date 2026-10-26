/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { Palette as PaletteIcon, Type as TypeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataVisaApplicationSupport,
  defaultLayout,
  type BangladeshDocumentGroup,
  type BangladeshSupportLocation,
  type BangladeshVisaFaq,
  type BangladeshVisaFeature,
  type BangladeshVisaService,
  type BangladeshVisaStat,
  type BangladeshVisaStep,
  type IVisaApplicationSupportData,
  type VisaApplicationSupportPayload,
} from "./data";

const iconComponent =
  (icon: keyof typeof iconMap) =>
  // eslint-disable-next-line react/display-name
  ({ className }: { className?: string }) => <span className={className}>{iconMap[icon]}</span>;
const Database = iconComponent("Database");
const MapPinned = iconComponent("MapPin");
const Palette = PaletteIcon;
const ShieldCheck = iconComponent("ShieldCheck");
const Type = TypeIcon;

export interface VisaApplicationSupportFormProps {
  data?: IVisaApplicationSupportData | VisaApplicationSupportPayload;
  onChange?: (values: VisaApplicationSupportPayload) => void;
}

type CollectionKey =
  "stats" | "services" | "processSteps" | "documentGroups" | "supportLocations" | "features" | "faqs";
type CollectionValue =
  | BangladeshVisaStat[]
  | BangladeshVisaService[]
  | BangladeshVisaStep[]
  | BangladeshDocumentGroup[]
  | BangladeshSupportLocation[]
  | BangladeshVisaFeature[]
  | BangladeshVisaFaq[];

const cloneData = (data: IVisaApplicationSupportData): IVisaApplicationSupportData =>
  JSON.parse(JSON.stringify(data)) as IVisaApplicationSupportData;

const normalizeData = (
  data?: IVisaApplicationSupportData | VisaApplicationSupportPayload,
): VisaApplicationSupportPayload => {
  if (!data) return { ...cloneData(defaultDataVisaApplicationSupport), ...defaultLayout };
  return {
    ...defaultDataVisaApplicationSupport,
    ...defaultLayout,
    ...cloneData(data),
    pageUid: "visa-application-support-uid",
    stats: Array.isArray(data.stats) ? data.stats : defaultDataVisaApplicationSupport.stats,
    services: Array.isArray(data.services) ? data.services : defaultDataVisaApplicationSupport.services,
    processSteps: Array.isArray(data.processSteps) ? data.processSteps : defaultDataVisaApplicationSupport.processSteps,
    documentGroups: Array.isArray(data.documentGroups)
      ? data.documentGroups
      : defaultDataVisaApplicationSupport.documentGroups,
    supportLocations: Array.isArray(data.supportLocations)
      ? data.supportLocations
      : defaultDataVisaApplicationSupport.supportLocations,
    features: Array.isArray(data.features) ? data.features : defaultDataVisaApplicationSupport.features,
    faqs: Array.isArray(data.faqs) ? data.faqs : defaultDataVisaApplicationSupport.faqs,
  };
};

const collectionMeta: Array<{ key: CollectionKey; label: string; help: string }> = [
  { key: "stats", label: "Hero statistics", help: "Value and label pairs shown below the main hero." },
  { key: "services", label: "Visa services", help: "Service cards with title, description, and a short highlight." },
  { key: "processSteps", label: "Processing steps", help: "Ordered journey steps with an outcome for every stage." },
  {
    key: "documentGroups",
    label: "Document groups",
    help: "Interactive Bangladesh visa checklist groups and evidence items.",
  },
  { key: "supportLocations", label: "Support locations", help: "Cities, support mode, and access descriptions." },
  { key: "features", label: "Site advantages", help: "Reasons students and sponsors choose Site." },
  { key: "faqs", label: "FAQs", help: "Bangladesh-focused student visa questions and answers." },
];

const sectionGroups: Array<{
  label: string;
  eyebrow: keyof IVisaApplicationSupportData;
  showEyebrow: keyof IVisaApplicationSupportData;
  title: keyof IVisaApplicationSupportData;
  description: keyof IVisaApplicationSupportData;
}> = [
  {
    label: "Services",
    eyebrow: "servicesEyebrow",
    showEyebrow: "showServicesEyebrow",
    title: "servicesTitle",
    description: "servicesDescription",
  },
  {
    label: "Process",
    eyebrow: "processEyebrow",
    showEyebrow: "showProcessEyebrow",
    title: "processTitle",
    description: "processDescription",
  },
  {
    label: "Documents",
    eyebrow: "documentsEyebrow",
    showEyebrow: "showDocumentsEyebrow",
    title: "documentsTitle",
    description: "documentsDescription",
  },
  {
    label: "Locations",
    eyebrow: "locationsEyebrow",
    showEyebrow: "showLocationsEyebrow",
    title: "locationsTitle",
    description: "locationsDescription",
  },
  {
    label: "Advantages",
    eyebrow: "featuresEyebrow",
    showEyebrow: "showFeaturesEyebrow",
    title: "featuresTitle",
    description: "featuresDescription",
  },
  {
    label: "FAQ",
    eyebrow: "faqEyebrow",
    showEyebrow: "showFaqEyebrow",
    title: "faqTitle",
    description: "faqDescription",
  },
  {
    label: "Final CTA",
    eyebrow: "ctaEyebrow",
    showEyebrow: "showCtaEyebrow",
    title: "ctaTitle",
    description: "ctaDescription",
  },
];

const colorFields: Array<{
  field: "backgroundColor" | "surfaceColor" | "headingColor" | "textColor" | "accentColor" | "accentDarkColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "surfaceColor", label: "Surface" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Body text" },
  { field: "accentColor", label: "Bangladesh red" },
  { field: "accentDarkColor", label: "Bangladesh green" },
];

const collectionFields: Record<
  CollectionKey,
  Array<{ key: string; label: string; multiline?: boolean; list?: boolean }>
> = {
  stats: [
    { key: "value", label: "Value" },
    { key: "label", label: "Label" },
  ],
  services: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
    { key: "highlight", label: "Highlight" },
  ],
  processSteps: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
    { key: "outcome", label: "Outcome" },
  ],
  documentGroups: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
    { key: "items", label: "Evidence items (one per line)", multiline: true, list: true },
  ],
  supportLocations: [
    { key: "city", label: "City" },
    { key: "mode", label: "Support mode" },
    { key: "description", label: "Description", multiline: true },
  ],
  features: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  faqs: [
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer", multiline: true },
  ],
};

const MutationVisaApplicationSupport = ({ data, onChange }: VisaApplicationSupportFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IVisaApplicationSupportData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
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

  const updateField = <K extends keyof IVisaApplicationSupportData>(
    field: K,
    value: IVisaApplicationSupportData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
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
      pageUid: "visa-application-support-uid",
      stats: parsedCollections.stats as BangladeshVisaStat[],
      services: parsedCollections.services as BangladeshVisaService[],
      processSteps: parsedCollections.processSteps as BangladeshVisaStep[],
      documentGroups: parsedCollections.documentGroups as BangladeshDocumentGroup[],
      supportLocations: parsedCollections.supportLocations as BangladeshSupportLocation[],
      features: parsedCollections.features as BangladeshVisaFeature[],
      faqs: parsedCollections.faqs as BangladeshVisaFaq[],
    });
  }, [collectionDrafts, formData, paddingX, paddingY]);

  const inputClass =
    "border-[#e7dccb] bg-[#fffdf8] text-slate-800 placeholder:text-slate-400 focus-visible:ring-emerald-300";
  const cardClass = "space-y-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5 shadow-sm";
  const parseCollection = <T,>(key: CollectionKey): T[] => {
    try {
      const parsed = JSON.parse(collectionDrafts[key]) as T[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const statItems = parseCollection<BangladeshVisaStat>("stats");
  const serviceItems = parseCollection<BangladeshVisaService>("services");
  const processItems = parseCollection<BangladeshVisaStep>("processSteps");
  const documentItems = parseCollection<BangladeshDocumentGroup>("documentGroups");
  const locationItems = parseCollection<BangladeshSupportLocation>("supportLocations");
  const featureItems = parseCollection<BangladeshVisaFeature>("features");
  const faqItems = parseCollection<BangladeshVisaFaq>("faqs");
  const collectionItems: Record<CollectionKey, Array<Record<string, unknown>>> = {
    stats: statItems as unknown as Array<Record<string, unknown>>,
    services: serviceItems as unknown as Array<Record<string, unknown>>,
    processSteps: processItems as unknown as Array<Record<string, unknown>>,
    documentGroups: documentItems as unknown as Array<Record<string, unknown>>,
    supportLocations: locationItems as unknown as Array<Record<string, unknown>>,
    features: featureItems as unknown as Array<Record<string, unknown>>,
    faqs: faqItems as unknown as Array<Record<string, unknown>>,
  };

  return (
    <div className="custom-parent-border px-4 bg-[#f8f3ea] text-slate-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8] shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eadfca] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-2.5">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Visa Processing in Bangladesh</h2>
              <p className="text-sm text-slate-500">
                Manage the live Bangladesh visa page and every structured collection.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-[#eadfca] bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            visa-application-support-uid
          </span>
        </header>

        <div className="space-y-8 p-5 sm:p-6 lg:p-8">
          <section className="grid gap-5 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Type className="h-4 w-4" /> Hero content
              </h3>
              <div className="space-y-2">
                <Label>Page name</Label>
                <Input
                  value={formData.pageName}
                  onChange={(event) => updateField("pageName", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Hero eyebrow</Label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    Visible
                    <Switch
                      checked={formData.showHeroEyebrow}
                      onCheckedChange={(checked) => updateField("showHeroEyebrow", checked)}
                    />
                  </label>
                </div>
                <Input
                  value={formData.heroEyebrow}
                  onChange={(event) => updateField("heroEyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(event) => updateField("heroTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero description</Label>
                <Textarea
                  value={formData.heroDescription}
                  onChange={(event) => updateField("heroDescription", event.target.value)}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero notice</Label>
                <Input
                  value={formData.heroNotice}
                  onChange={(event) => updateField("heroNotice", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <MapPinned className="h-4 w-4" /> Actions and WES contact
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary button</Label>
                  <Input
                    value={formData.primaryButtonText}
                    onChange={(event) => updateField("primaryButtonText", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary URL</Label>
                  <Input
                    value={formData.primaryButtonUrl}
                    onChange={(event) => updateField("primaryButtonUrl", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary button</Label>
                  <Input
                    value={formData.secondaryButtonText}
                    onChange={(event) => updateField("secondaryButtonText", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary URL</Label>
                  <Input
                    value={formData.secondaryButtonUrl}
                    onChange={(event) => updateField("secondaryButtonUrl", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA button</Label>
                  <Input
                    value={formData.ctaButtonText}
                    onChange={(event) => updateField("ctaButtonText", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA URL</Label>
                  <Input
                    value={formData.ctaButtonUrl}
                    onChange={(event) => updateField("ctaButtonUrl", event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid gap-4 border-t border-[#eadfca] pt-4">
                <div className="space-y-2">
                  <Label>Site name</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(event) => updateField("companyName", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company email</Label>
                  <Input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(event) => updateField("companyEmail", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company contact</Label>
                  <Input
                    value={formData.companyContact}
                    onChange={(event) => updateField("companyContact", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Office location</Label>
                  <Input
                    value={formData.officeAddress}
                    onChange={(event) => updateField("officeAddress", event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-2">
            {sectionGroups.map((group) => (
              <div key={group.label} className={cardClass}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{group.label}</h3>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    Eyebrow visible
                    <Switch
                      checked={Boolean(formData[group.showEyebrow])}
                      onCheckedChange={(checked) => updateField(group.showEyebrow, checked)}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Eyebrow</Label>
                  <Input
                    value={String(formData[group.eyebrow])}
                    onChange={(event) => updateField(group.eyebrow, event.target.value as never)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData[group.title] as string}
                    onChange={(event) => updateField(group.title, event.target.value as never)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData[group.description] as string}
                    onChange={(event) => updateField(group.description, event.target.value as never)}
                    className={`${inputClass} min-h-28 resize-y`}
                  />
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Database className="h-4 w-4" /> Dynamic collections
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Edit cards and lists with guided fields. No JSON editing is required.
              </p>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {collectionMeta.map(({ key, label, help }) => (
                <div
                  key={key}
                  className={`${cardClass} ${key === "services" || key === "documentGroups" ? "xl:col-span-2" : ""}`}
                >
                  <div>
                    <Label className="text-base">{label}</Label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{help}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-1">
                    {collectionItems[key].map((item, index) => (
                      <div
                        key={String(item.id)}
                        className="space-y-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4"
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {label} {index + 1}
                        </p>
                        {collectionFields[key].map((field) => {
                          const rawValue = item[field.key];
                          const value = field.list
                            ? Array.isArray(rawValue)
                              ? rawValue.map(String).join("\n")
                              : ""
                            : String(rawValue ?? "");
                          return (
                            <div key={field.key} className="space-y-1.5">
                              <Label>{field.label}</Label>
                              {field.multiline ? (
                                <Textarea
                                  value={value}
                                  onChange={(event) =>
                                    updateCollectionItem(key, index, {
                                      [field.key]: field.list
                                        ? event.target.value
                                            .split("\n")
                                            .map((entry) => entry.trim())
                                            .filter(Boolean)
                                        : event.target.value,
                                    })
                                  }
                                  className={inputClass}
                                  rows={field.list ? 4 : 3}
                                />
                              ) : (
                                <Input
                                  value={value}
                                  onChange={(event) =>
                                    updateCollectionItem(key, index, { [field.key]: event.target.value })
                                  }
                                  className={inputClass}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <Palette className="h-4 w-4" /> Theme
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {colorFields.map(({ field, label }) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-[#e7dccb] bg-white p-1"
                      aria-label={`${label} color`}
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
          </section>
        </div>

        <section className="mx-5 mb-5 grid gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 sm:mx-6 sm:grid-cols-2">
          {(
            [
              ["paddingX", "Padding X", paddingX],
              ["paddingY", "Padding Y", paddingY],
            ] as const
          ).map(([field, label, value]) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
                <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white">
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
      </div>
    </div>
  );
};

export default MutationVisaApplicationSupport;
