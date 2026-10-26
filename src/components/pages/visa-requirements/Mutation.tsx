/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { Palette as PaletteIcon, Plus, Trash2, Type as TypeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataVisaRequirements,
  defaultLayout,
  type DownloadResource,
  type IVisaRequirementsData,
  type VisaRequirementsPayload,
  type VisaCountry,
} from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string }) => {
  void _props;
  return <>{iconMap[icon]}</>;
};
const Link2 = iconComponent("Link");
const Palette = PaletteIcon;
const ShieldCheck = iconComponent("ShieldCheck");
const Type = TypeIcon;

export interface VisaRequirementsFormProps {
  data?: IVisaRequirementsData | VisaRequirementsPayload;
  onChange?: (values: VisaRequirementsPayload) => void;
}

const cloneData = (data: IVisaRequirementsData): IVisaRequirementsData =>
  JSON.parse(JSON.stringify(data)) as IVisaRequirementsData;

const normalizeDownloads = (downloads?: DownloadResource[]): DownloadResource[] => {
  if (!Array.isArray(downloads)) return cloneData(defaultDataVisaRequirements).downloads;

  return downloads.map((resource, index) => {
    const fallback =
      defaultDataVisaRequirements.downloads.find((item) => item.id === resource.id) ||
      defaultDataVisaRequirements.downloads[index];
    return {
      ...fallback,
      ...resource,
      content: Array.isArray(resource.content) ? resource.content : fallback?.content || [resource.description],
    };
  });
};

const normalizeData = (data?: IVisaRequirementsData | VisaRequirementsPayload): VisaRequirementsPayload => {
  if (!data) return { ...cloneData(defaultDataVisaRequirements), ...defaultLayout };
  return {
    ...defaultDataVisaRequirements,
    ...defaultLayout,
    ...cloneData(data),
    pageUid: "visa-requirements-uid",
    backgroundColor: data.backgroundColor === "#f6f7f2" ? "#ffffff" : data.backgroundColor || "#ffffff",
    headingColor: data.headingColor?.toLowerCase() === "#132a24" ? "#251214" : data.headingColor || "#251214",
    textColor: data.textColor?.toLowerCase() === "#52645e" ? "#625457" : data.textColor || "#625457",
    accentColor: data.accentColor?.toLowerCase() === "#e76f51" ? "#EB2229" : data.accentColor || "#EB2229",
    accentDarkColor: "#EC1F29",
    countries: Array.isArray(data.countries) ? data.countries : defaultDataVisaRequirements.countries,
    requirementSections: Array.isArray(data.requirementSections)
      ? data.requirementSections
      : defaultDataVisaRequirements.requirementSections,
    timeline: Array.isArray(data.timeline) ? data.timeline : defaultDataVisaRequirements.timeline,
    checklistGroups: Array.isArray(data.checklistGroups)
      ? data.checklistGroups
      : defaultDataVisaRequirements.checklistGroups,
    downloads: normalizeDownloads(data.downloads),
    faqs: Array.isArray(data.faqs) ? data.faqs : defaultDataVisaRequirements.faqs,
  };
};

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

const countryFields: Array<{ field: keyof VisaCountry; label: string }> = [
  { field: "name", label: "Country name" },
  { field: "slug", label: "URL slug" },
  { field: "flag", label: "Flag" },
  { field: "successRate", label: "Success rate" },
  { field: "tuitionRange", label: "Tuition range" },
  { field: "tuitionBand", label: "Tuition filter band" },
  { field: "processingTime", label: "Processing time" },
  { field: "processingBand", label: "Processing filter band" },
  { field: "requiredFunds", label: "Required funds" },
  { field: "financialBand", label: "Financial filter band" },
  { field: "workHours", label: "Work hours" },
  { field: "prOpportunity", label: "Post-study opportunity" },
  { field: "visaType", label: "Visa type" },
  { field: "englishRequirement", label: "English requirement" },
];

const MutationVisaRequirements = ({ data, onChange }: VisaRequirementsFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IVisaRequirementsData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    setPaddingX((current) => (current === next.paddingX ? current : next.paddingX));
    setPaddingY((current) => (current === next.paddingY ? current : next.paddingY));
  }, [data]);

  const updateField = <K extends keyof IVisaRequirementsData>(field: K, value: IVisaRequirementsData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    onChangeRef.current?.({
      ...formData,
      paddingX,
      paddingY,
      pageUid: "visa-requirements-uid",
    });
  }, [formData, paddingX, paddingY]);

  const updateCollectionItem = (
    collection: "countries" | "requirementSections" | "timeline" | "checklistGroups" | "downloads" | "faqs",
    index: number,
    field: string,
    value: string | string[],
  ) => {
    setFormData((current) => {
      const items = [...(current[collection] as unknown[])] as Array<Record<string, unknown>>;
      items[index] = { ...items[index], [field]: value };
      return { ...current, [collection]: items } as IVisaRequirementsData;
    });
  };

  const removeCollectionItem = (
    collection: "countries" | "requirementSections" | "timeline" | "checklistGroups" | "downloads" | "faqs",
    index: number,
  ) => {
    setFormData(
      (current) =>
        ({
          ...current,
          [collection]: (current[collection] as unknown[]).filter((_, itemIndex) => itemIndex !== index),
        }) as IVisaRequirementsData,
    );
  };

  const addCollectionItem = (
    collection: "countries" | "requirementSections" | "timeline" | "checklistGroups" | "downloads" | "faqs",
    template: Record<string, unknown>,
  ) => {
    setFormData(
      (current) =>
        ({
          ...current,
          [collection]: [...(current[collection] as unknown[]), { ...template, id: `${collection}-${Date.now()}` }],
        }) as IVisaRequirementsData,
    );
  };

  const fieldClassName =
    "border-amber-100 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-teal-500";

  return (
    <div className="custom-parent-border px-4 min-h-screen bg-[#fffaf0] p-3 text-slate-700 sm:p-5 lg:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-amber-100 bg-white shadow-[0_18px_60px_rgba(120,83,35,0.08)]">
        <header className="flex flex-col gap-4 border-b border-amber-100 bg-[#fffdf8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-teal-100 bg-teal-50 p-2.5">
              <ShieldCheck className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Visa Requirements Page</h2>
              <p className="text-sm text-slate-500">Manage the full public experience with simple guided fields.</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            visa-requirements-uid
          </span>
        </header>

        <div className="space-y-8 p-5 sm:p-6 lg:p-8">
          <section className="space-y-5">
            <div className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Type className="h-4 w-4" /> Hero and discovery
              </h3>
              <div className="space-y-2">
                <Label>Page name</Label>
                <Input
                  value={formData.pageName}
                  onChange={(event) => updateField("pageName", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Eyebrow</Label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    Visible
                    <Switch
                      checked={formData.showEyebrow}
                      onCheckedChange={(checked) => updateField("showEyebrow", checked)}
                    />
                  </label>
                </div>
                <Input
                  value={formData.eyebrow}
                  onChange={(event) => updateField("eyebrow", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(event) => updateField("heroTitle", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero description</Label>
                <Textarea
                  value={formData.heroDescription}
                  onChange={(event) => updateField("heroDescription", event.target.value)}
                  className={`${fieldClassName} min-h-28 resize-y`}
                />
              </div>
              <div className="space-y-2">
                <Label>Country search placeholder</Label>
                <Input
                  value={formData.searchPlaceholder}
                  onChange={(event) => updateField("searchPlaceholder", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Country section title</Label>
                <Input
                  value={formData.countriesTitle}
                  onChange={(event) => updateField("countriesTitle", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Country section description</Label>
                <Textarea
                  value={formData.countriesDescription}
                  onChange={(event) => updateField("countriesDescription", event.target.value)}
                  className={`${fieldClassName} min-h-24 resize-y`}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-sm border border-amber-100 bg-[#fffdf8] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Link2 className="h-4 w-4" /> Actions and empty state
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Explore button</Label>
                  <Input
                    value={formData.exploreButtonText}
                    onChange={(event) => updateField("exploreButtonText", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Explore URL</Label>
                  <Input
                    value={formData.exploreButtonUrl}
                    onChange={(event) => updateField("exploreButtonUrl", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Checklist button</Label>
                  <Input
                    value={formData.checklistButtonText}
                    onChange={(event) => updateField("checklistButtonText", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Checklist URL</Label>
                  <Input
                    value={formData.checklistButtonUrl}
                    onChange={(event) => updateField("checklistButtonUrl", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Empty state title</Label>
                <Input
                  value={formData.emptyStateTitle}
                  onChange={(event) => updateField("emptyStateTitle", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Empty state description</Label>
                <Textarea
                  value={formData.emptyStateDescription}
                  onChange={(event) => updateField("emptyStateDescription", event.target.value)}
                  className={`${fieldClassName} min-h-20 resize-y`}
                />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            {[
              ["timelineEyebrow", "timelineTitle", "timelineDescription", "Timeline", "showTimelineEyebrow"],
              ["checklistEyebrow", "checklistTitle", "checklistDescription", "Checklist", "showChecklistEyebrow"],
              ["downloadsEyebrow", "downloadsTitle", "downloadsDescription", "Download centre", "showDownloadsEyebrow"],
              ["faqEyebrow", "faqTitle", "faqDescription", "FAQ", "showFaqEyebrow"],
            ].map(([eyebrow, title, description, label, showField]) => (
              <div key={title} className="space-y-4 rounded-sm border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{label}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Eyebrow</Label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      Visible
                      <Switch
                        checked={Boolean(formData[showField as keyof IVisaRequirementsData])}
                        onCheckedChange={(checked) =>
                          updateField(showField as keyof IVisaRequirementsData, checked as never)
                        }
                      />
                    </label>
                  </div>
                  <Input
                    value={formData[eyebrow as keyof IVisaRequirementsData] as string}
                    onChange={(event) =>
                      updateField(eyebrow as keyof IVisaRequirementsData, event.target.value as never)
                    }
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData[title as keyof IVisaRequirementsData] as string}
                    onChange={(event) => updateField(title as keyof IVisaRequirementsData, event.target.value as never)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData[description as keyof IVisaRequirementsData] as string}
                    onChange={(event) =>
                      updateField(description as keyof IVisaRequirementsData, event.target.value as never)
                    }
                    className={`${fieldClassName} min-h-24 resize-y`}
                  />
                </div>
                {label === "Download centre" && (
                  <div className="grid gap-4 border-t border-amber-100 pt-4">
                    <div className="space-y-2">
                      <Label>PDF site name</Label>
                      <Input
                        value={formData.downloadCompanyName}
                        onChange={(event) => updateField("downloadCompanyName", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PDF site email</Label>
                      <Input
                        type="email"
                        value={formData.downloadCompanyEmail}
                        onChange={(event) => updateField("downloadCompanyEmail", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PDF site contact</Label>
                      <Input
                        value={formData.downloadCompanyContact}
                        onChange={(event) => updateField("downloadCompanyContact", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                )}
                {label === "FAQ" && (
                  <div className="space-y-2">
                    <Label>FAQ search placeholder</Label>
                    <Input
                      value={formData.faqSearchPlaceholder}
                      onChange={(event) => updateField("faqSearchPlaceholder", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Type className="h-4 w-4" /> Countries and requirements
                </h3>
                <p className="mt-2 text-sm text-slate-500">Edit each destination in its own simple form.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("countries", {
                    ...defaultDataVisaRequirements.countries[0],
                    name: "New destination",
                    slug: "new-destination",
                  })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add country
              </button>
            </div>
            <div className="space-y-5">
              {formData.countries.map((country, index) => (
                <article className="space-y-5 rounded-sm border border-amber-100 bg-[#fffdf8] p-5" key={country.id}>
                  <div className="flex items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <h4 className="font-semibold text-slate-900">{country.name || `Country ${index + 1}`}</h4>
                    <button
                      aria-label={`Remove ${country.name || "country"}`}
                      className="rounded-sm p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeCollectionItem("countries", index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {countryFields.map(({ field, label }) => (
                      <div className="space-y-2" key={field}>
                        <Label>{label}</Label>
                        <Input
                          className={fieldClassName}
                          value={String(country[field] ?? "")}
                          onChange={(event) => updateCollectionItem("countries", index, field, event.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Overview</Label>
                    <Textarea
                      className={`${fieldClassName} min-h-24 resize-y`}
                      value={country.overview}
                      onChange={(event) => updateCollectionItem("countries", index, "overview", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 grid-cols-1">
                    <div className="space-y-2">
                      <Label>Study levels</Label>
                      <Textarea
                        className={`${fieldClassName} min-h-24 resize-y`}
                        value={country.studyLevels.join("\n")}
                        onChange={(event) =>
                          updateCollectionItem(
                            "countries",
                            index,
                            "studyLevels",
                            event.target.value.split("\n").filter(Boolean),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country-specific requirements</Label>
                      <Textarea
                        className={`${fieldClassName} min-h-24 resize-y`}
                        value={country.countrySpecificRequirements.join("\n")}
                        onChange={(event) =>
                          updateCollectionItem(
                            "countries",
                            index,
                            "countrySpecificRequirements",
                            event.target.value.split("\n").filter(Boolean),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated costs</Label>
                      <Textarea
                        className={`${fieldClassName} min-h-24 resize-y`}
                        value={country.estimatedCosts.join("\n")}
                        onChange={(event) =>
                          updateCollectionItem(
                            "countries",
                            index,
                            "estimatedCosts",
                            event.target.value.split("\n").filter(Boolean),
                          )
                        }
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Requirement sections</h3>
                <p className="mt-2 text-sm text-slate-500">Shared document guidance shown in the country details.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("requirementSections", {
                    ...defaultDataVisaRequirements.requirementSections[0],
                    title: "New requirement section",
                    items: ["Add requirement"],
                  })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add section
              </button>
            </div>
            <div className="space-y-4">
              {formData.requirementSections.map((item, index) => (
                <article className="space-y-3 rounded-sm border border-amber-100 bg-[#fffdf8] p-5" key={item.id}>
                  <div className="flex justify-between gap-3">
                    <Input
                      className={fieldClassName}
                      value={item.title}
                      onChange={(event) =>
                        updateCollectionItem("requirementSections", index, "title", event.target.value)
                      }
                    />
                    <button
                      className="p-2 text-slate-400 hover:text-red-600"
                      onClick={() => removeCollectionItem("requirementSections", index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Textarea
                    className={`${fieldClassName} min-h-24 resize-y`}
                    value={item.items.join("\n")}
                    onChange={(event) =>
                      updateCollectionItem(
                        "requirementSections",
                        index,
                        "items",
                        event.target.value.split("\n").filter(Boolean),
                      )
                    }
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Application timeline</h3>
                <p className="mt-2 text-sm text-slate-500">Keep the process steps in the order users should follow.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("timeline", { ...defaultDataVisaRequirements.timeline[0], title: "New step" })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add step
              </button>
            </div>
            <div className="space-y-4">
              {formData.timeline.map((item, index) => (
                <article
                  className="grid gap-3 rounded-sm border border-amber-100 bg-[#fffdf8] p-5 sm:grid-cols-[minmax(0,1fr)_2fr_auto]"
                  key={item.id}
                >
                  <Input
                    className={fieldClassName}
                    value={item.title}
                    onChange={(event) => updateCollectionItem("timeline", index, "title", event.target.value)}
                  />
                  <Textarea
                    className={`${fieldClassName} min-h-20 resize-y`}
                    value={item.description}
                    onChange={(event) => updateCollectionItem("timeline", index, "description", event.target.value)}
                  />
                  <button
                    className="p-2 text-slate-400 hover:text-red-600"
                    onClick={() => removeCollectionItem("timeline", index)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Checklist groups</h3>
                <p className="mt-2 text-sm text-slate-500">
                  One document group per card, with one checklist item per line.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("checklistGroups", {
                    ...defaultDataVisaRequirements.checklistGroups[0],
                    title: "New checklist group",
                    items: ["Add checklist item"],
                  })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add group
              </button>
            </div>
            <div className="space-y-4">
              {formData.checklistGroups.map((item, index) => (
                <article className="space-y-3 rounded-sm border border-amber-100 bg-[#fffdf8] p-5" key={item.id}>
                  <div className="flex justify-between gap-3">
                    <Input
                      className={fieldClassName}
                      value={item.title}
                      onChange={(event) => updateCollectionItem("checklistGroups", index, "title", event.target.value)}
                    />
                    <button
                      className="p-2 text-slate-400 hover:text-red-600"
                      onClick={() => removeCollectionItem("checklistGroups", index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Textarea
                    className={`${fieldClassName} min-h-24 resize-y`}
                    value={item.items.join("\n")}
                    onChange={(event) =>
                      updateCollectionItem(
                        "checklistGroups",
                        index,
                        "items",
                        event.target.value.split("\n").filter(Boolean),
                      )
                    }
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Download resources</h3>
                <p className="mt-2 text-sm text-slate-500">Edit the card details and PDF content line by line.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("downloads", { ...defaultDataVisaRequirements.downloads[0], title: "New resource" })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add resource
              </button>
            </div>
            <div className="space-y-4">
              {formData.downloads.map((item, index) => (
                <article className="space-y-3 rounded-sm border border-amber-100 bg-[#fffdf8] p-5" key={item.id}>
                  <div className="flex justify-between gap-3">
                    <Input
                      className={fieldClassName}
                      value={item.title}
                      onChange={(event) => updateCollectionItem("downloads", index, "title", event.target.value)}
                    />
                    <button
                      className="p-2 text-slate-400 hover:text-red-600"
                      onClick={() => removeCollectionItem("downloads", index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input
                      className={fieldClassName}
                      placeholder="Format"
                      value={item.format}
                      onChange={(event) => updateCollectionItem("downloads", index, "format", event.target.value)}
                    />
                    <Input
                      className={fieldClassName}
                      placeholder="URL"
                      value={item.url}
                      onChange={(event) => updateCollectionItem("downloads", index, "url", event.target.value)}
                    />
                    <Input
                      className={fieldClassName}
                      placeholder="Description"
                      value={item.description}
                      onChange={(event) => updateCollectionItem("downloads", index, "description", event.target.value)}
                    />
                  </div>
                  <Textarea
                    className={`${fieldClassName} min-h-24 resize-y`}
                    value={item.content.join("\n")}
                    onChange={(event) =>
                      updateCollectionItem(
                        "downloads",
                        index,
                        "content",
                        event.target.value.split("\n").filter(Boolean),
                      )
                    }
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Frequently asked questions
                </h3>
                <p className="mt-2 text-sm text-slate-500">Add clear answers for common visa questions.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-sm bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                onClick={() =>
                  addCollectionItem("faqs", {
                    ...defaultDataVisaRequirements.faqs[0],
                    question: "New question",
                    answer: "Add an answer.",
                  })
                }
                type="button"
              >
                <Plus className="h-4 w-4" /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {formData.faqs.map((item, index) => (
                <article className="space-y-3 rounded-sm border border-amber-100 bg-[#fffdf8] p-5" key={item.id}>
                  <div className="flex justify-between gap-3">
                    <Input
                      className={fieldClassName}
                      value={item.question}
                      onChange={(event) => updateCollectionItem("faqs", index, "question", event.target.value)}
                    />
                    <button
                      className="p-2 text-slate-400 hover:text-red-600"
                      onClick={() => removeCollectionItem("faqs", index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Textarea
                    className={`${fieldClassName} min-h-24 resize-y`}
                    value={item.answer}
                    onChange={(event) => updateCollectionItem("faqs", index, "answer", event.target.value)}
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="space-y-4 rounded-sm border border-amber-100 bg-[#fffdf8] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Link2 className="h-4 w-4" /> Final call to action
              </h3>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.ctaTitle}
                  onChange={(event) => updateField("ctaTitle", event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.ctaDescription}
                  onChange={(event) => updateField("ctaDescription", event.target.value)}
                  className={`${fieldClassName} min-h-24 resize-y`}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary button</Label>
                  <Input
                    value={formData.primaryButtonText}
                    onChange={(event) => updateField("primaryButtonText", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary URL</Label>
                  <Input
                    value={formData.primaryButtonUrl}
                    onChange={(event) => updateField("primaryButtonUrl", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary button</Label>
                  <Input
                    value={formData.secondaryButtonText}
                    onChange={(event) => updateField("secondaryButtonText", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary URL</Label>
                  <Input
                    value={formData.secondaryButtonUrl}
                    onChange={(event) => updateField("secondaryButtonUrl", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-sm border border-amber-100 bg-[#fffdf8] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <Palette className="h-4 w-4" /> Theme
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {colorFields.map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-sm border border-slate-200 bg-white p-1"
                        aria-label={`${label} color`}
                      />
                      <Input
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mx-5 mb-5 grid gap-4 rounded-sm border border-teal-100 bg-teal-50/70 p-5 sm:mx-6 sm:grid-cols-2">
          {(
            [
              ["paddingX", "Padding X", paddingX],
              ["paddingY", "Padding Y", paddingY],
            ] as const
          ).map(([field, label, value]) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
                <span className="rounded-full bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white">{value}px</span>
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

export default MutationVisaRequirements;
