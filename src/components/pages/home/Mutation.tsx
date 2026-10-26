/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultCards, defaultData, defaultHomeCard, type HomeCard, type HomeData } from "./data";

function parseCards(value: string | undefined): HomeCard[] {
  try {
    const parsed: unknown = JSON.parse(value ?? defaultData.sectionsJson);
    return Array.isArray(parsed) && parsed.length
      ? parsed.map((item) => ({
          title: typeof item?.title === "string" ? item.title : "",
          description: typeof item?.description === "string" ? item.description : "",
        }))
      : defaultCards;
  } catch {
    return defaultCards;
  }
}

export default function Mutation({ data, onChange }: { data?: Partial<HomeData>; onChange: (data: HomeData) => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(0);
  const [mediaOpen, setMediaOpen] = useState(false);
  const values = { ...defaultData, ...data };
  const sections = parseCards(values.sectionsJson);
  const update = (next: Partial<HomeData>) => onChange({ ...values, ...next });
  const updateCard = (index: number, card: HomeCard) => {
    const next = sections.map((item, itemIndex) => (itemIndex === index ? card : item));
    update({ sectionsJson: JSON.stringify(next) });
  };
  const addCard = () => {
    update({ sectionsJson: JSON.stringify([...sections, { ...defaultHomeCard }]) });
    setExpandedCard(sections.length);
  };
  const deleteCard = () => {
    if (deleteIndex === null) return;
    update({ sectionsJson: JSON.stringify(sections.filter((_, index) => index !== deleteIndex)) });
    setExpandedCard(null);
    setDeleteIndex(null);
  };

  return (
    <div className="custom-parent-border bg-[#fffaf0] text-stone-800">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-700">Page editor</p>
            <h2 className="mt-1 text-xl font-semibold text-stone-950">Home page content</h2>
            <p className="mt-1 text-sm text-stone-500">Update the hero, image, and page sections in one place.</p>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800">Force update</p>
              <p className="text-xs text-stone-500">Saved Home content is used on the public page.</p>
            </div>
            <Switch
              aria-label="Toggle Force Update"
              checked={values.forceUpdate === "true"}
              onCheckedChange={(forceUpdate) => update({ forceUpdate: forceUpdate ? "true" : "false" })}
            />
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <section className="rounded-sm border border-[#eadfca] bg-white p-4 sm:p-5">
            <SectionTitle description="The first content visitors see on your home page." title="Hero content" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" onChange={(eyebrow) => update({ eyebrow })} value={values.eyebrow} />
              <Field label="Hero title" onChange={(title) => update({ title })} value={values.title} />
              <label className="grid gap-1.5 text-sm font-medium text-stone-700 sm:col-span-2">
                Introduction
                <Textarea
                  className="min-h-28 resize-y"
                  onChange={(event) => update({ intro: event.target.value })}
                  value={values.intro}
                />
              </label>
            </div>
            <div className="mt-5 grid gap-3 border-t border-[#eadfca] pt-4 sm:grid-cols-2">
              <PaddingControl
                label="Padding X"
                value={values.paddingX}
                onValueChange={(paddingX) => update({ paddingX })}
              />
              <PaddingControl
                label="Padding Y"
                value={values.paddingY}
                onValueChange={(paddingY) => update({ paddingY })}
              />
            </div>
          </section>

          <section className="rounded-sm border border-[#eadfca] bg-white p-4">
            <SectionTitle description="Choose an image from Media Library." title="Hero image" />
            <Image
              alt={values.imageAlt || defaultData.imageAlt}
              className="mt-4 aspect-[16/10] w-full rounded-sm border border-[#eadfca] bg-[#fffaf0] object-cover"
              height={380}
              src={values.imageUrl || defaultData.imageUrl}
              width={608}
            />
            <Button
              className="mt-3 w-full cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
              onClick={() => setMediaOpen(true)}
              size="sm"
              type="button"
              variant="secondary"
            >
              Edit image
            </Button>
            <label className="mt-3 grid gap-1.5 text-sm font-medium text-stone-700">
              Image alt text
              <Input onChange={(event) => update({ imageAlt: event.target.value })} value={values.imageAlt} />
            </label>
          </section>
        </div>

        <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 border-b border-[#eadfca] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle
              description={`${sections.length} section${sections.length === 1 ? "" : "s"} shown on the page.`}
              title="Page sections"
            />
            <Button
              className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
              onClick={addCard}
              size="sm"
              type="button"
              variant="secondary"
            >
              Add section
            </Button>
          </div>

          <div className="mt-4 grid gap-3">
            {sections.map((card, index) => {
              const isOpen = expandedCard === index;
              return (
                <article className="overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8]" key={index}>
                  <div className="flex gap-3 p-3 sm:items-center sm:p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-amber-100 text-xs font-semibold text-amber-900">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      className="min-w-0 flex-1 cursor-pointer text-left"
                      onClick={() => setExpandedCard(isOpen ? null : index)}
                      type="button"
                    >
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {card.title || "Untitled section"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-stone-500">
                        {card.description || "No description added"}
                      </p>
                    </button>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                        onClick={() => setExpandedCard(isOpen ? null : index)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        {isOpen ? "Close" : "Edit"}
                      </Button>
                      <Button
                        className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:bg-red-200"
                        onClick={() => setDeleteIndex(index)}
                        size="sm"
                        type="button"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="grid gap-4 border-t border-[#eadfca] bg-white p-3 sm:p-4">
                      <Field
                        label="Section title"
                        onChange={(title) => updateCard(index, { ...card, title })}
                        value={card.title}
                      />
                      <label className="grid gap-1.5 text-sm font-medium text-stone-700">
                        Section description
                        <Textarea
                          className="min-h-24 resize-y"
                          onChange={(event) => updateCard(index, { ...card, description: event.target.value })}
                          value={card.description}
                        />
                      </label>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {mediaOpen && (
        <ImagePickerModal
          close={() => setMediaOpen(false)}
          description="Select an image from Media Library or upload a new home image."
          onSelect={(imageUrl) => {
            update({ imageUrl });
            setMediaOpen(false);
          }}
          title="Choose home image"
          uploadLabel="Upload home image"
        />
      )}
      <AlertDialog
        confirmLabel="Delete section"
        description={deleteIndex === null ? "" : `Section ${deleteIndex + 1} will be removed from this home page.`}
        onCancel={() => setDeleteIndex(null)}
        onConfirm={deleteCard}
        open={deleteIndex !== null}
        title="Delete this section?"
      />
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-stone-700">
      {label}
      <Input onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function PaddingControl({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <span className="rounded-sm bg-white px-2 py-1 text-xs font-semibold tabular-nums text-amber-900">
          {value}px
        </span>
      </div>
      <Slider
        aria-label={label}
        className="mt-3 accent-amber-600"
        max={300}
        min={-300}
        onValueChange={([next]) => onValueChange(Math.min(300, Math.max(-300, next ?? 0)))}
        step={1}
        value={[value]}
      />
      <div className="mt-2 flex justify-between text-[11px] text-stone-500">
        <span>-300</span>
        <span>0</span>
        <span>300</span>
      </div>
    </div>
  );
}
