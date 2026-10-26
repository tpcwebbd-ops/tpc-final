/*
|-----------------------------------------
| setting up PageTemplateMutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { PageTemplateData } from "./page-types";

export default function PageTemplateMutation<T extends PageTemplateData>({
  data,
  fallbackData,
  title,
  onChange,
  onSubmit,
}: {
  data?: T;
  fallbackData: T;
  title: string;
  onChange?: (values: T) => void;
  onSubmit?: (values: T) => void;
}) {
  const [formData, setFormData] = useState<T>(data ?? fallbackData);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const nextData = data ?? fallbackData;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
  }, [data, fallbackData]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  return (
    <div className="grid gap-4 rounded-sm border border-stone-200 bg-white p-4 text-stone-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input aria-label="Page name" onChange={(event) => setFormData({ ...formData, pageName: event.target.value })} value={formData.pageName} />
        <Input aria-label="Eyebrow" onChange={(event) => setFormData({ ...formData, eyebrow: event.target.value })} value={formData.eyebrow} />
      </div>
      <Input aria-label="Page title" onChange={(event) => setFormData({ ...formData, title: event.target.value })} value={formData.title} />
      <Textarea aria-label="Page subtitle" className="min-h-24" onChange={(event) => setFormData({ ...formData, subtitle: event.target.value })} value={formData.subtitle} />
      {"highlightTitle" in fallbackData && <Input aria-label="Highlight title" onChange={(event) => setFormData({ ...formData, highlightTitle: event.target.value })} value={formData.highlightTitle ?? ""} />}
      {"highlightDescription" in fallbackData && <Textarea aria-label="Highlight description" className="min-h-24" onChange={(event) => setFormData({ ...formData, highlightDescription: event.target.value })} value={formData.highlightDescription ?? ""} />}
      <Textarea aria-label="Policy sections" className="min-h-48 font-mono text-xs" onChange={(event) => { try { setFormData({ ...formData, sections: JSON.parse(event.target.value) }); } catch {} }} value={JSON.stringify(formData.sections, null, 2)} />
      {onSubmit && (
        <Button className="w-fit" onClick={() => onSubmit(formData)} size="sm" type="button">
          Save changes
        </Button>
      )}
    </div>
  );
}
