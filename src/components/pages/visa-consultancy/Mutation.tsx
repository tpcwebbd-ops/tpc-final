/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import { Palette as PaletteIcon, Type as TypeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataVisaConsultancy,
  defaultLayout,
  type IVisaConsultancyData,
  type VisaConsultancyPayload,
} from "./data";

export interface VisaConsultancyFormProps {
  data?: IVisaConsultancyData | VisaConsultancyPayload;
  onChange?: (values: VisaConsultancyPayload) => void;
}
type CollectionKey =
  "stats" | "services" | "journeySteps" | "destinations" | "readinessGroups" | "benefits" | "testimonials" | "faqs";
type Field = { key: string; label: string; multiline?: boolean; list?: boolean };
const collections: Array<{ key: CollectionKey; label: string; help: string; fields: Field[] }> = [
  {
    key: "stats",
    label: "Hero statistics",
    help: "Value and label pairs shown below the hero.",
    fields: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
    ],
  },
  {
    key: "services",
    label: "Consultancy services",
    help: "Service cards and expected outcomes.",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
      { key: "outcome", label: "Outcome" },
    ],
  },
  {
    key: "journeySteps",
    label: "Consultancy journey",
    help: "Ordered steps with a milestone for each stage.",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
      { key: "milestone", label: "Milestone" },
    ],
  },
  {
    key: "destinations",
    label: "Destination expertise",
    help: "Country cards with focus and description.",
    fields: [
      { key: "country", label: "Country" },
      { key: "flag", label: "Flag" },
      { key: "focus", label: "Focus" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  {
    key: "readinessGroups",
    label: "Readiness planner",
    help: "Checklist groups; use one item per line.",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
      { key: "items", label: "Checklist items", multiline: true, list: true },
    ],
  },
  {
    key: "benefits",
    label: "Consultancy benefits",
    help: "Reasons students and families choose WES.",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  {
    key: "testimonials",
    label: "Student stories",
    help: "Quote, name, and journey theme.",
    fields: [
      { key: "quote", label: "Quote", multiline: true },
      { key: "name", label: "Name" },
      { key: "journey", label: "Journey" },
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    help: "Questions and helpful answers.",
    fields: [
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer", multiline: true },
    ],
  },
];
const sectionGroups = [
  ["Services", "servicesEyebrow", "showServicesEyebrow", "servicesTitle", "servicesDescription"],
  ["Journey", "journeyEyebrow", "showJourneyEyebrow", "journeyTitle", "journeyDescription"],
  ["Destinations", "destinationsEyebrow", "showDestinationsEyebrow", "destinationsTitle", "destinationsDescription"],
  ["Readiness", "readinessEyebrow", "showReadinessEyebrow", "readinessTitle", "readinessDescription"],
  ["Benefits", "benefitsEyebrow", "showBenefitsEyebrow", "benefitsTitle", "benefitsDescription"],
  ["Stories", "storiesEyebrow", "showStoriesEyebrow", "storiesTitle", "storiesDescription"],
  ["FAQ", "faqEyebrow", "showFaqEyebrow", "faqTitle", "faqDescription"],
  ["Final CTA", "ctaEyebrow", "showCtaEyebrow", "ctaTitle", "ctaDescription"],
] as const;
const colorFields = [
  "backgroundColor",
  "surfaceColor",
  "headingColor",
  "textColor",
  "accentColor",
  "accentDarkColor",
] as const;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const normalize = (data?: IVisaConsultancyData | VisaConsultancyPayload): VisaConsultancyPayload => ({
  ...clone(defaultDataVisaConsultancy),
  ...defaultLayout,
  ...(data ? clone(data) : {}),
  pageUid: "visa-consultancy-uid",
});

const MutationVisaConsultancy = ({ data, onChange }: VisaConsultancyFormProps) => {
  const initial = normalize(data);
  const [formData, setFormData] = useState<IVisaConsultancyData>(initial);
  const [paddingX, setPaddingX] = useState(initial.paddingX);
  const [paddingY, setPaddingY] = useState(initial.paddingY);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const next = normalize(data);
    // Keep local state references stable when the parent sends the same payload back.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    setPaddingX((current) => (current === next.paddingX ? current : next.paddingX));
    setPaddingY((current) => (current === next.paddingY ? current : next.paddingY));
  }, [data]);
  const updateField = <K extends keyof IVisaConsultancyData>(field: K, value: IVisaConsultancyData[K]) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const updateCollection = (key: CollectionKey, index: number, field: string, value: string) =>
    setFormData((current) => {
      const items = clone(current[key] as unknown) as Array<Record<string, unknown>>;
      if (!items[index]) return current;
      items[index][field] =
        field === "items"
          ? value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : value;
      return { ...current, [key]: items } as IVisaConsultancyData;
    });
  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY, pageUid: "visa-consultancy-uid" });
  }, [formData, paddingX, paddingY]);
  const inputClass =
    "border-[#e7dccb] bg-[#fffdf8] text-slate-800 placeholder:text-slate-400 focus-visible:ring-emerald-300";
  const cardClass = "flex flex-1 flex-col gap-4 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-5 shadow-sm";
  const items = (key: CollectionKey) => formData[key] as unknown as Array<Record<string, unknown>>;
  return (
    <div className="custom-parent-border px-4 bg-[#f8f3ea] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8] shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eadfca] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-2.5">
              <TypeIcon className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Visa Consultancy Page</h2>
              <p className="text-sm text-slate-500">Manage every page section with guided fields.</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-[#eadfca] bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            visa-consultancy-uid
          </span>
        </header>
        <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
          <section className="flex flex-col gap-5 lg:flex-row">
            <div className={`${cardClass} flex-1`}>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Hero content</h3>
              <FieldInput
                label="Page name"
                value={formData.pageName}
                onChange={(v) => updateField("pageName", v)}
                className={inputClass}
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Hero eyebrow</Label>
                  <VisibilitySwitch
                    checked={formData.showHeroEyebrow}
                    onChange={(v) => updateField("showHeroEyebrow", v)}
                  />
                </div>
                <Input
                  value={formData.eyebrow}
                  onChange={(e) => updateField("eyebrow", e.target.value)}
                  className={inputClass}
                />
              </div>
              <FieldInput
                label="Hero title"
                value={formData.heroTitle}
                onChange={(v) => updateField("heroTitle", v)}
                className={inputClass}
              />
              <FieldArea
                label="Hero description"
                value={formData.heroDescription}
                onChange={(v) => updateField("heroDescription", v)}
                className={inputClass}
              />
              <FieldInput
                label="Hero note"
                value={formData.heroNote}
                onChange={(v) => updateField("heroNote", v)}
                className={inputClass}
              />
            </div>
            <div className={`${cardClass} flex-1`}>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Actions and contact</h3>
              {(
                [
                  ["primaryButtonText", "Primary button"],
                  ["primaryButtonUrl", "Primary URL"],
                  ["secondaryButtonText", "Secondary button"],
                  ["secondaryButtonUrl", "Secondary URL"],
                  ["ctaButtonText", "CTA button"],
                  ["ctaButtonUrl", "CTA URL"],
                  ["companyName", "Company name"],
                  ["companyEmail", "Company email"],
                  ["companyContact", "Company contact"],
                ] as const
              ).map(([field, label]) => (
                <FieldInput
                  key={field}
                  label={label}
                  value={formData[field]}
                  onChange={(v) => updateField(field, v)}
                  className={inputClass}
                />
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-5">
            {sectionGroups.map(([label, eyebrow, showEyebrow, title, description]) => (
              <div key={label} className={cardClass}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{label}</h3>
                  <VisibilitySwitch
                    checked={Boolean(formData[showEyebrow])}
                    onChange={(v) => updateField(showEyebrow, v)}
                  />
                </div>
                <FieldInput
                  label="Eyebrow"
                  value={String(formData[eyebrow])}
                  onChange={(v) => updateField(eyebrow, v)}
                  className={inputClass}
                />
                <FieldInput
                  label="Title"
                  value={String(formData[title])}
                  onChange={(v) => updateField(title, v)}
                  className={inputClass}
                />
                <FieldArea
                  label="Description"
                  value={String(formData[description])}
                  onChange={(v) => updateField(description, v)}
                  className={inputClass}
                />
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Dynamic collections</h3>
              <p className="mt-2 text-sm text-slate-500">
                Edit every item with dedicated fields. No raw data editor is needed.
              </p>
            </div>
            {collections.map(({ key, label, help, fields }) => (
              <div key={key} className={cardClass}>
                <div>
                  <h3 className="font-bold text-slate-800">{label}</h3>
                  <p className="text-xs text-slate-500">{help}</p>
                </div>
                {items(key).map((item, index) => (
                  <div
                    key={String(item.id ?? index)}
                    className="flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-white p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {label} {index + 1}
                    </p>
                    {fields.map((field) => {
                      const value = field.list
                        ? Array.isArray(item[field.key])
                          ? (item[field.key] as string[]).join("\n")
                          : ""
                        : String(item[field.key] ?? "");
                      return field.multiline ? (
                        <FieldArea
                          key={field.key}
                          label={field.label}
                          value={value}
                          onChange={(v) => updateCollection(key, index, field.key, v)}
                          className={inputClass}
                        />
                      ) : (
                        <FieldInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          onChange={(v) => updateCollection(key, index, field.key, v)}
                          className={inputClass}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </section>
          <section className={cardClass}>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <PaletteIcon className="h-4 w-4" /> Theme
            </h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {colorFields.map((field) => (
                <div key={field} className="flex min-w-56 flex-1 flex-col gap-2">
                  <Label>{field.replace(/Color$/, "")}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-sm border border-[#eadfca] bg-white p-1"
                      aria-label={`${field} color`}
                    />
                    <Input
                      value={formData[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-4 rounded-sm border border-emerald-100 bg-emerald-50/60 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Page spacing</h3>
            <div className="flex flex-col gap-5 sm:flex-row">
              {(
                [
                  ["paddingX", "Padding X", paddingX],
                  ["paddingY", "Padding Y", paddingY],
                ] as const
              ).map(([field, label, value]) => (
                <div key={field} className="flex flex-1 flex-col gap-3">
                  <div className="flex justify-between">
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
                    onValueChange={([next]) =>
                      field === "paddingX"
                        ? setPaddingX(Math.min(300, Math.max(-300, next)))
                        : setPaddingY(Math.min(300, Math.max(-300, next)))
                    }
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
const VisibilitySwitch = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => (
  <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
    Eyebrow visible
    <Switch checked={checked} onCheckedChange={onChange} />
  </label>
);
const FieldInput = ({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
}) => (
  <div className="flex flex-col gap-2">
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  </div>
);
const FieldArea = ({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
}) => (
  <div className="flex flex-col gap-2">
    <Label>{label}</Label>
    <Textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${className} min-h-24 resize-y`} />
  </div>
);
export default MutationVisaConsultancy;
