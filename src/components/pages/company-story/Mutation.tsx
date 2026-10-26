/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import { Eye, EyeOff, LayoutPanelTop, MoveHorizontal, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

import {
  defaultDataCompanyStory,
  defaultLayout,
  type CompanyStoryPayload,
  type CompanyStorySection,
  type ICompanyStoryData,
} from "./data";

export interface CompanyStoryFormProps {
  data?: ICompanyStoryData | CompanyStoryPayload;
  onChange?: (values: CompanyStoryPayload) => void;
}

const normalizeData = (data?: ICompanyStoryData | CompanyStoryPayload): CompanyStoryPayload => ({
  ...defaultDataCompanyStory,
  ...defaultLayout,
  ...data,
  pageUid: "company-story-uid",
  pageName: "Company Story",
  showEyebrow: data?.showEyebrow !== false,
  sections: Array.isArray(data?.sections)
    ? data.sections.map((section) => ({ ...section, showEyebrow: section.showEyebrow !== false }))
    : defaultDataCompanyStory.sections,
});
const createSection = (): CompanyStorySection => ({
  eyebrow: "New section",
  showEyebrow: true,
  title: "Add a meaningful section title",
  description: "Describe the value, story, or outcome you want visitors to understand.",
  items: ["Add the first key point"],
});

const VisibilityControl = ({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex min-w-0 items-center justify-between gap-3 rounded-sm border border-stone-200 bg-white px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-stone-700">
      {checked ? (
        <Eye className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <EyeOff className="size-4 shrink-0 text-stone-400" />
      )}
      <span className="truncate">{label}</span>
    </div>
    <Switch aria-label={label} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const MutationCompanyStory = ({ data, onChange }: CompanyStoryFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<ICompanyStoryData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [toast, setToast] = useState("");
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
    onChangeRef.current?.({ ...formData, paddingX, paddingY, pageUid: "company-story-uid", pageName: "Company Story" });
  }, [formData, paddingX, paddingY]);
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const next = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(next);
    else setPaddingY(next);
  };
  const updateSection = <K extends keyof CompanyStorySection>(index: number, field: K, value: CompanyStorySection[K]) =>
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  const addSection = () => {
    setFormData((current) => ({ ...current, sections: [...current.sections, createSection()] }));
    setToast("New content section added.");
  };
  const removeSection = () => {
    if (deleteIndex === null) return;
    setFormData((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== deleteIndex) }));
    setDeleteIndex(null);
    setToast("Content section removed.");
  };

  return (
    <div className="custom-parent-border overflow-hidden bg-[#f8f7f4] text-stone-800">
      <Toast message={toast} onDismiss={() => setToast("")} />
      <div className="mx-auto max-w-7xl border-x border-[#e8e3d9] bg-white">
        <header className="border-b border-[#e8e3d9] bg-gradient-to-r from-stone-950 to-stone-800 px-4 py-5 text-white sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-amber-300 uppercase">
                <Sparkles className="size-4" /> Content studio
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Build your About page</h2>
              <p className="mt-1 text-sm text-stone-300">
                Update the introduction, story cards, and the space around this page.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-sm border border-white/15 bg-white/10 px-3 py-2 text-xs text-stone-200 sm:self-auto">
              <LayoutPanelTop className="size-4 text-amber-300" /> company-story-uid
            </div>
          </div>
        </header>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div className="mx-auto grid max-w-6xl gap-5 p-4 pb-8 sm:p-6 lg:grid-cols-12">
            <section className="grid gap-4 rounded-sm border border-[#e8e3d9] bg-[#fffdf9] p-4 shadow-sm lg:col-span-7">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-amber-700 uppercase">01 · Introduction</p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">Hero content</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="company-story-name">Page label</Label>
                  <Input
                    id="company-story-name"
                    value={formData.pageName}
                    onChange={(e) => setFormData((c) => ({ ...c, pageName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="company-story-eyebrow">Eyebrow text</Label>
                  <Input
                    id="company-story-eyebrow"
                    value={formData.eyebrow}
                    onChange={(e) => setFormData((c) => ({ ...c, eyebrow: e.target.value }))}
                  />
                </div>
              </div>
              <VisibilityControl
                checked={formData.showEyebrow !== false}
                label="Show hero eyebrow"
                onCheckedChange={(showEyebrow) => setFormData((c) => ({ ...c, showEyebrow }))}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="company-story-title">Main headline</Label>
                <Input
                  id="company-story-title"
                  value={formData.title}
                  onChange={(e) => setFormData((c) => ({ ...c, title: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="company-story-subtitle">Supporting copy</Label>
                <Textarea
                  className="min-h-28"
                  id="company-story-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((c) => ({ ...c, subtitle: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="company-story-primary">Primary button</Label>
                  <Input
                    id="company-story-primary"
                    value={formData.primaryAction}
                    onChange={(e) => setFormData((c) => ({ ...c, primaryAction: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="company-story-secondary">Secondary button</Label>
                  <Input
                    id="company-story-secondary"
                    value={formData.secondaryAction}
                    onChange={(e) => setFormData((c) => ({ ...c, secondaryAction: e.target.value }))}
                  />
                </div>
              </div>
            </section>
            <aside className="grid content-start gap-4 rounded-sm border border-amber-200 bg-amber-50 p-4 lg:col-span-5">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-amber-800 uppercase">02 · Layout</p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">Section spacing</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Fine-tune the empty space around the complete page section.
                </p>
              </div>
              {(
                [
                  ["paddingX", "Padding X", paddingX],
                  ["paddingY", "Padding Y", paddingY],
                ] as const
              ).map(([field, label, value]) => (
                <div className="grid gap-3 border-t border-amber-200 pt-4" key={field}>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="flex items-center gap-2">
                      <MoveHorizontal className="size-4 text-amber-700" /> {label}
                    </Label>
                    <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-semibold text-white">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    max={300}
                    min={-300}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
                    step={1}
                    value={[value]}
                  />
                  <div className="flex justify-between text-[11px] font-medium text-stone-500">
                    <span>-300</span>
                    <span>0</span>
                    <span>+300</span>
                  </div>
                </div>
              ))}
            </aside>
            <section className="grid gap-4 lg:col-span-12">
              <div className="flex flex-col gap-3 rounded-sm border border-[#e8e3d9] bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-amber-700 uppercase">03 · Story cards</p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-900">Content sections</h3>
                  <p className="text-sm text-stone-600">Each card appears in your About page grid.</p>
                </div>
                <Button
                  className="cursor-pointer bg-stone-900 text-white hover:bg-stone-700"
                  onClick={addSection}
                  type="button"
                >
                  <Plus className="size-4" /> Add section
                </Button>
              </div>
              {formData.sections.length === 0 && (
                <div className="border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-600">
                  No story cards yet. Add a section to start building this area.
                </div>
              )}
              <div className="grid gap-4 grid-cols-1">
                {formData.sections.map((section, index) => (
                  <article
                    className="grid gap-4 rounded-sm border border-[#e8e3d9] bg-white p-4 shadow-sm"
                    key={`${section.title}-${index}`}
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-amber-100 text-sm font-bold text-amber-900">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate font-semibold text-stone-900">
                            {section.title || "Untitled section"}
                          </h4>
                          <p className="text-xs text-stone-500">Story card</p>
                        </div>
                      </div>
                      <Button
                        aria-label={`Delete ${section.title || `section ${index + 1}`}`}
                        className="cursor-pointer text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => setDeleteIndex(index)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor={`company-story-section-eyebrow-${index}`}>Eyebrow text</Label>
                      <Input
                        id={`company-story-section-eyebrow-${index}`}
                        value={section.eyebrow}
                        onChange={(e) => updateSection(index, "eyebrow", e.target.value)}
                      />
                    </div>
                    <VisibilityControl
                      checked={section.showEyebrow !== false}
                      label="Show section eyebrow"
                      onCheckedChange={(showEyebrow) => updateSection(index, "showEyebrow", showEyebrow)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`company-story-section-title-${index}`}>Title</Label>
                      <Input
                        id={`company-story-section-title-${index}`}
                        value={section.title}
                        onChange={(e) => updateSection(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor={`company-story-section-description-${index}`}>Description</Label>
                      <Textarea
                        className="min-h-24"
                        id={`company-story-section-description-${index}`}
                        value={section.description}
                        onChange={(e) => updateSection(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor={`company-story-section-items-${index}`}>
                        Key points <span className="font-normal text-stone-500">(one per line)</span>
                      </Label>
                      <Textarea
                        className="min-h-24"
                        id={`company-story-section-items-${index}`}
                        value={section.items.join("\n")}
                        onChange={(e) =>
                          updateSection(
                            index,
                            "items",
                            e.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
      <AlertDialog
        busy={false}
        description="This removes the section from the current editor. You can add a new section any time."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={removeSection}
        open={deleteIndex !== null}
        title="Delete this content section?"
      />
    </div>
  );
};
export default MutationCompanyStory;
