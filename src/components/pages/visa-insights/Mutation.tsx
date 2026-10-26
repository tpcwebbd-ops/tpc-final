/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { Palette as PaletteIcon, Type as TypeIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultBlogDraft,
  defaultBlogTopic,
  defaultDataVisaInsights,
  defaultLayout,
  type BlogPost,
  type IVisaInsightsData,
  type VisaInsightsPayload,
} from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string }) => {
  void _props;
  return <>{iconMap[icon]}</>;
};
const Download = iconComponent("Download");
const FilePlus2 = iconComponent("FilePlus");
const Loader2 = iconComponent("RefreshCw");
const Palette = PaletteIcon;
const Trash2 = iconComponent("Trash2");
const Type = TypeIcon;

const toast = { error: console.error, success: console.info };

const BlogImagePreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative mt-3 h-40 overflow-hidden rounded-sm border border-slate-200 bg-white">
    {src ? (
      <Image alt={alt} className="object-contain p-2" fill sizes="(max-width: 640px) 90vw, 320px" src={src} />
    ) : (
      <div className="grid h-full place-items-center text-xs text-slate-400">No image selected</div>
    )}
  </div>
);

export interface VisaInsightsFormProps {
  data?: IVisaInsightsData | VisaInsightsPayload;
  onChange?: (values: VisaInsightsPayload) => void;
}

type ImportedBlog = Partial<BlogPost> & { url: string };

const blankBlog = (): BlogPost => ({
  id: `blog-${Date.now()}`,
  ...defaultBlogDraft,
  publishedAt: new Date().toISOString().slice(0, 10),
});

const cloneData = (data: IVisaInsightsData): IVisaInsightsData => JSON.parse(JSON.stringify(data)) as IVisaInsightsData;

const normalizeData = (data?: IVisaInsightsData | VisaInsightsPayload): VisaInsightsPayload => {
  if (!data) return { ...cloneData(defaultDataVisaInsights), ...defaultLayout };
  return {
    ...defaultDataVisaInsights,
    ...defaultLayout,
    ...cloneData(data),
    pageUid: "visa-insights-uid",
    pageName: "Blog Page",
    topics: Array.isArray(data.topics) ? data.topics : defaultDataVisaInsights.topics,
    blogs: Array.isArray(data.blogs) ? data.blogs : defaultDataVisaInsights.blogs,
  };
};

const colorFields: Array<{
  field: "backgroundColor" | "surfaceColor" | "headingColor" | "textColor" | "accentColor" | "accentDarkColor";
  label: string;
}> = [
  { field: "backgroundColor", label: "Background" },
  { field: "surfaceColor", label: "Surface" },
  { field: "headingColor", label: "Heading" },
  { field: "textColor", label: "Text" },
  { field: "accentColor", label: "Accent" },
  { field: "accentDarkColor", label: "Dark accent" },
];

const copyFields: Array<{ field: keyof IVisaInsightsData; label: string; multiline?: boolean }> = [
  { field: "heroTitle", label: "Hero title" },
  { field: "heroDescription", label: "Hero description", multiline: true },
  { field: "popularTitle", label: "Popular title" },
  { field: "newsletterTitle", label: "Newsletter title" },
  { field: "newsletterDescription", label: "Newsletter description", multiline: true },
  { field: "newsletterButtonText", label: "Newsletter button" },
  { field: "ctaTitle", label: "CTA title" },
  { field: "ctaDescription", label: "CTA description", multiline: true },
  { field: "ctaButtonText", label: "CTA button" },
  { field: "ctaButtonUrl", label: "CTA URL" },
];

const eyebrowFields = [
  { field: "heroEyebrow" as const, visibleField: "heroEyebrowVisible" as const, label: "Hero eyebrow" },
  {
    field: "newsletterEyebrow" as const,
    visibleField: "newsletterEyebrowVisible" as const,
    label: "Newsletter eyebrow",
  },
];

const MutationVisaInsights = ({ data, onChange }: VisaInsightsFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IVisaInsightsData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [draft, setDraft] = useState<BlogPost>(() => blankBlog());
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [mediaField, setMediaField] = useState<{ type: "draft" } | { type: "blog"; index: number } | null>(null);

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
    onChangeRef.current?.({ ...formData, paddingX, paddingY, pageUid: "visa-insights-uid", pageName: "Blog Page" });
  }, [formData, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateField = <K extends keyof IVisaInsightsData>(field: K, value: IVisaInsightsData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateDraft = <K extends keyof BlogPost>(field: K, value: BlogPost[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateBlog = <K extends keyof BlogPost>(index: number, field: K, value: BlogPost[K]) => {
    setFormData((current) => ({
      ...current,
      blogs: current.blogs.map((blog, blogIndex) => (blogIndex === index ? { ...blog, [field]: value } : blog)),
    }));
  };

  const updateTopic = (index: number, value: string) => {
    setFormData((current) => ({
      ...current,
      topics: current.topics.map((topic, topicIndex) => (topicIndex === index ? { ...topic, label: value } : topic)),
    }));
  };

  const addTopic = () => {
    setFormData((current) => ({
      ...current,
      topics: [...current.topics, { id: `topic-${Date.now()}`, ...defaultBlogTopic }],
    }));
  };

  const removeTopic = (index: number) => {
    setFormData((current) => ({ ...current, topics: current.topics.filter((_, topicIndex) => topicIndex !== index) }));
  };

  const importBlog = async () => {
    if (!importUrl.trim()) {
      toast.error("Enter a Facebook or website URL");
      return;
    }

    setIsImporting(true);
    try {
      const response = await fetch("/api/blog-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const result = (await response.json()) as { data?: ImportedBlog; message?: string };
      if (!response.ok || !result.data) throw new Error(result.message || "Unable to import this URL");

      const imported = result.data;
      setDraft((current) => ({
        ...current,
        id: `blog-${Date.now()}`,
        title: imported.title || "",
        excerpt: imported.excerpt || "",
        url: imported.url || importUrl.trim(),
        imageUrl: imported.imageUrl || "",
        imageAlt: imported.imageAlt || imported.title || "Imported blog image",
        author: imported.author || current.author,
        publishedAt: imported.publishedAt?.slice(0, 10) || current.publishedAt,
        sourceName: imported.sourceName || new URL(imported.url || importUrl).hostname,
      }));
      toast.success("Blog details imported. Review and add the draft.");
    } catch (error) {
      toast.error((error as Error).message || "Unable to import this URL");
    } finally {
      setIsImporting(false);
    }
  };

  const addBlog = () => {
    if (!draft.title.trim()) {
      toast.error("Blog title is required");
      return;
    }
    setFormData((current) => ({ ...current, blogs: [{ ...draft, title: draft.title.trim() }, ...current.blogs] }));
    setDraft(blankBlog());
    setImportUrl("");
    toast.success("Blog added to this page");
  };

  const inputClass = "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-teal-500";
  const cardClass = "space-y-4 rounded-sm border border-slate-200 bg-[#f5f8fc] p-5";

  return (
    <div className="custom-parent-border bg-white text-stone-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-[#eadfca] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-bold">Edit Blog Page</h2>
            <p className="mt-1 text-sm text-slate-500">Import a public URL or add a blog manually.</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
            visa-insights-uid
          </span>
        </header>

        <div className="space-y-8 p-5 sm:p-6 lg:p-8">
          <section className={cardClass}>
            <h3 className="flex items-center gap-2 font-bold">
              <Download className="h-4 w-4 text-red-400" /> Import from Facebook or any public website
            </h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="url"
                value={importUrl}
                onChange={(event) => setImportUrl(event.target.value)}
                placeholder="https://facebook.com/... or https://example.com/article"
                className={inputClass}
              />
              <Button
                type="button"
                onClick={() => void importBlog()}
                disabled={isImporting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isImporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Import
              </Button>
            </div>
            <p className="text-xs text-zinc-500">Only public metadata can be imported. Review it before adding.</p>
          </section>

          <section className={cardClass}>
            <h3 className="flex items-center gap-2 font-bold">
              <FilePlus2 className="h-4 w-4 text-red-400" /> Blog draft
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>Article URL</Label>
                <Input
                  value={draft.url}
                  onChange={(event) => updateDraft("url", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={draft.excerpt}
                  onChange={(event) => updateDraft("excerpt", event.target.value)}
                  className={`${inputClass} min-h-[9rem] resize-y`}
                />
              </div>
              {(
                [
                  ["category", "Category"],
                  ["author", "Author"],
                  ["publishedAt", "Published date"],
                  ["readTime", "Read time"],
                  ["sourceName", "Source"],
                  ["imageAlt", "Image alt text"],
                ] as Array<[keyof BlogPost, string]>
              ).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    type={field === "publishedAt" ? "date" : "text"}
                    value={String(draft[field])}
                    onChange={(event) => updateDraft(field, event.target.value as never)}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="space-y-2 lg:col-span-2">
                <Label>Image</Label>
                <BlogImagePreview alt={draft.imageAlt || "Draft blog image"} src={draft.imageUrl} />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full border-amber-200 bg-amber-100 text-amber-950 hover:bg-amber-200"
                  onClick={() => setMediaField({ type: "draft" })}
                >
                  Edit image
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 lg:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) => updateDraft("featured", event.target.checked)}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.popular}
                    onChange={(event) => updateDraft("popular", event.target.checked)}
                  />
                  Popular
                </label>
              </div>
            </div>
            <Button type="button" onClick={addBlog} className="bg-emerald-600 text-white hover:bg-emerald-500">
              <FilePlus2 className="mr-2 h-4 w-4" /> Add Blog
            </Button>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-bold">Existing blogs</h3>
              <p className="text-sm text-zinc-500">{formData.blogs.length} articles</p>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {formData.blogs.map((blog, index) => (
                <div key={blog.id} className={cardClass}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold">{blog.title || "Untitled blog"}</h4>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          blogs: current.blogs.filter((_, blogIndex) => blogIndex !== index),
                        }))
                      }
                      className="text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["title", "Title"],
                        ["url", "URL"],
                        ["category", "Category"],
                        ["author", "Author"],
                        ["publishedAt", "Published date"],
                        ["readTime", "Read time"],
                        ["sourceName", "Source"],
                        ["imageAlt", "Image alt"],
                      ] as Array<[keyof BlogPost, string]>
                    ).map(([field, label]) => (
                      <div key={field} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          type={field === "publishedAt" ? "date" : "text"}
                          value={String(blog[field])}
                          onChange={(event) => updateBlog(index, field, event.target.value as never)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Excerpt</Label>
                      <Textarea
                        value={blog.excerpt}
                        onChange={(event) => updateBlog(index, "excerpt", event.target.value)}
                        className={`${inputClass} min-h-[9rem] resize-y`}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Image</Label>
                      <BlogImagePreview alt={blog.imageAlt || `${blog.title} image`} src={blog.imageUrl} />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="w-full border-amber-200 bg-amber-100 text-amber-950 hover:bg-amber-200"
                        onClick={() => setMediaField({ type: "blog", index })}
                      >
                        Edit image
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={blog.featured}
                        onChange={(event) => updateBlog(index, "featured", event.target.checked)}
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={blog.popular}
                        onChange={(event) => updateBlog(index, "popular", event.target.checked)}
                      />
                      Popular
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="flex items-center gap-2 font-bold">
                <Type className="h-4 w-4 text-red-400" /> Page text
              </h3>
              <div className="grid gap-3 rounded-sm border border-red-100 bg-red-50/50 p-3">
                <p className="text-sm font-semibold text-slate-700">Eyebrow visibility</p>
                {eyebrowFields.map(({ field, visibleField, label }) => (
                  <div className="flex items-center justify-between gap-3" key={field}>
                    <div className="min-w-0 flex-1">
                      <Label>{label}</Label>
                      <Input
                        value={formData[field]}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pt-6 text-xs text-slate-500">
                      <span>{formData[visibleField] ? "Visible" : "Hidden"}</span>
                      <Switch
                        aria-label={`Toggle ${label}`}
                        checked={formData[visibleField]}
                        onCheckedChange={(checked) => updateField(visibleField, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {copyFields.map(({ field, label, multiline }) => (
                <div key={field} className="space-y-2">
                  <Label>{label}</Label>
                  {multiline ? (
                    <Textarea
                      value={String(formData[field])}
                      onChange={(event) => updateField(field, event.target.value as never)}
                      className={`${inputClass} min-h-[9rem] resize-y`}
                    />
                  ) : (
                    <Input
                      value={String(formData[field])}
                      onChange={(event) => updateField(field, event.target.value as never)}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <div className={cardClass}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold">Topics</h3>
                    <p className="mt-1 text-xs text-slate-500">Edit each topic individually.</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addTopic}>
                    Add topic
                  </Button>
                </div>
                <div className="grid gap-3">
                  {formData.topics.map((topic, index) => (
                    <div className="flex items-end gap-2" key={topic.id}>
                      <div className="min-w-0 flex-1 space-y-2">
                        <Label>Topic {index + 1}</Label>
                        <Input
                          value={topic.label}
                          onChange={(event) => updateTopic(index, event.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTopic(index)}
                        disabled={formData.topics.length === 1}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="flex items-center gap-2 font-bold">
                  <Palette className="h-4 w-4 text-red-400" /> Colors
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
                          className="h-10 w-12 shrink-0 rounded-sm border border-slate-200 bg-white p-1"
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
              </div>
            </div>
          </section>
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
      {mediaField ? (
        <ImagePickerModal
          close={() => setMediaField(null)}
          description="Select an image from Media Library or upload a new blog image."
          onSelect={(url) => {
            if (mediaField.type === "draft") updateDraft("imageUrl", url);
            else updateBlog(mediaField.index, "imageUrl", url);
            setMediaField(null);
          }}
          title="Choose blog image"
          uploadLabel="Upload blog image"
        />
      ) : null}
    </div>
  );
};

export default MutationVisaInsights;
