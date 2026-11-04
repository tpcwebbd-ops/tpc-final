/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

"use client";

import { ChevronDown, ImagePlus, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultData,
  defaultSections,
  homePadding,
  homeSections,
  sectionTitle,
  type ContentNode,
  type HomeData,
  type HomeSection,
} from "./data";

const labels: Record<ContentNode["tag"], string> = {
  h1: "Heading",
  h2: "Heading",
  p: "Paragraph",
  span: "Label",
  strong: "Emphasis",
  ul: "List",
  ol: "Steps",
  li: "List item",
  a: "Link text",
  nav: "Social links",
};

function EditContent({ node, onChange }: { node: ContentNode; onChange: (node: ContentNode) => void }) {
  return (
    <div className="grid gap-3">
      {node.children.map((child, index) => {
        const replace = (next: ContentNode | string) =>
          onChange({
            ...node,
            children: node.children.map((item, childIndex) => (childIndex === index ? next : item)),
          });
        return typeof child === "string" ? (
          <label className="grid gap-1.5 text-xs font-medium text-stone-600" key={index}>
            {labels[node.tag]}
            <Textarea
              className="min-h-20 bg-white text-sm leading-7"
              onChange={(event) => replace(event.target.value)}
              value={child}
            />
          </label>
        ) : (
          <EditContent key={index} node={child} onChange={replace} />
        );
      })}
    </div>
  );
}

export default function Mutation({ data, onChange }: { data?: Partial<HomeData>; onChange: (data: HomeData) => void }) {
  const [expanded, setExpanded] = useState("KidsHero");
  const [imageSection, setImageSection] = useState<string | null>(null);
  const sections = homeSections(data);
  const values: HomeData = {
    ...defaultData,
    forceUpdate: data?.forceUpdate === "true" ? "true" : "false",
    paddingX: homePadding(data?.paddingX),
    paddingY: homePadding(data?.paddingY),
    sectionsJson: JSON.stringify(sections),
  };
  const update = (next: Partial<HomeData>) => onChange({ ...values, ...next });
  const updateSection = (id: string, next: Partial<HomeSection>) =>
    update({
      sectionsJson: JSON.stringify(sections.map((section) => (section.id === id ? { ...section, ...next } : section))),
    });
  const selected = sections.find((section) => section.id === imageSection);

  return (
    <div className="rounded-xl border border-stone-200 bg-[#f8f8ef] p-4 text-stone-800 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-semibold">Home page content</h2>
          <p className="mt-1 text-sm text-stone-500">
            27 sections from design.txt. Edit each section’s text and image.
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm">
          Force update
          <Switch
            checked={values.forceUpdate === "true"}
            onCheckedChange={(checked) => update({ forceUpdate: checked ? "true" : "false" })}
          />
        </label>
      </header>

      <div className="my-5 grid gap-4 sm:grid-cols-2">
        {(["paddingX", "paddingY"] as const).map((key) => (
          <label className="grid gap-2 text-xs font-medium text-stone-600" key={key}>
            {key === "paddingX" ? "Horizontal padding" : "Vertical padding"}
            <Input
              className="bg-white"
              max={120}
              min={0}
              onChange={(event) => update({ [key]: homePadding(event.target.value) })}
              type="number"
              value={values[key]}
            />
          </label>
        ))}
      </div>

      <div className="grid gap-3">
        {sections.map((section, index) => {
          const open = expanded === section.id;
          return (
            <section className="overflow-hidden rounded-xl border border-stone-200 bg-white" key={section.id}>
              <button
                aria-controls={`edit-${section.id}`}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center gap-3 p-4 text-left hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-emerald-700"
                onClick={() => setExpanded(open ? "" : section.id)}
                type="button"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eaf0d7] text-xs font-semibold text-emerald-900">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{sectionTitle(section)}</span>
                  <span className="mt-0.5 block text-xs text-stone-400">{section.id}</span>
                </span>
                <ChevronDown aria-hidden="true" className={open ? "rotate-180" : ""} size={18} />
              </button>
              {open && (
                <div
                  className="grid gap-5 border-t border-stone-100 p-4 lg:grid-cols-[minmax(0,1fr)_15rem]"
                  id={`edit-${section.id}`}
                >
                  <div className="grid gap-4">
                    {section.content.map((node, nodeIndex) => (
                      <div className="rounded-lg border border-stone-100 bg-stone-50 p-3" key={nodeIndex}>
                        <EditContent
                          node={node}
                          onChange={(next) =>
                            updateSection(section.id, {
                              content: section.content.map((item, index) => (index === nodeIndex ? next : item)),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <aside className="flex flex-col gap-3 lg:sticky lg:top-4 lg:self-start">
                    <Image
                      alt={section.imageAlt}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                      height={300}
                      src={section.imageUrl}
                      unoptimized
                      width={400}
                    />
                    <Button
                      className="w-full"
                      onClick={() => setImageSection(section.id)}
                      type="button"
                      variant="outline"
                    >
                      <ImagePlus size={16} />
                      Edit image
                    </Button>
                    <label className="grid gap-1.5 text-xs font-medium text-stone-600">
                      Image URL
                      <Input
                        defaultValue={section.imageUrl}
                        key={section.imageUrl}
                        onBlur={(event) => updateSection(section.id, { imageUrl: event.target.value })}
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium text-stone-600">
                      Image description
                      <Input
                        onChange={(event) => updateSection(section.id, { imageAlt: event.target.value })}
                        value={section.imageAlt}
                      />
                    </label>
                    <Button
                      className="mt-2 text-xs"
                      onClick={() =>
                        updateSection(
                          section.id,
                          defaultSections.find((item) => item.id === section.id)!,
                        )
                      }
                      type="button"
                      variant="ghost"
                    >
                      <RotateCcw size={14} />
                      Restore design content
                    </Button>
                  </aside>
                </div>
              )}
            </section>
          );
        })}
      </div>
      {selected && (
        <ImagePickerModal
          close={() => setImageSection(null)}
          onSelect={(imageUrl) => {
            updateSection(selected.id, { imageUrl });
            setImageSection(null);
          }}
          selectedUrl={selected.imageUrl}
          title={`Choose image · ${selected.id}`}
        />
      )}
    </div>
  );
}
