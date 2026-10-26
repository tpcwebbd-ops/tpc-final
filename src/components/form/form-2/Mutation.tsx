/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

"use client";

import { Switch } from "@/components/ui/switch";

import { defaultData } from "./data";

export default function Mutation({
  data = defaultData,
  onChange,
}: {
  data?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const generalFields = [
    ["heading", "Heading"],
    ["buttonLabel", "Button label"],
  ] as const;
  const fieldGroups = [
    { title: "Name field", labelKey: "nameLabel", placeholderKey: "namePlaceholder", visibilityKey: "showName" },
    { title: "Email field", labelKey: "emailLabel", placeholderKey: "emailPlaceholder", visibilityKey: "showEmail" },
    { title: "Phone field", labelKey: "phoneLabel", placeholderKey: "phonePlaceholder", visibilityKey: "showPhone" },
    {
      title: "Education field",
      labelKey: "educationLabel",
      placeholderKey: "educationPlaceholder",
      visibilityKey: "showEducation",
    },
    {
      title: "Address field",
      labelKey: "addressLabel",
      placeholderKey: "addressPlaceholder",
      visibilityKey: "showAddress",
    },
    {
      title: "Message field",
      labelKey: "messageLabel",
      placeholderKey: "messagePlaceholder",
      visibilityKey: "showMessage",
    },
  ] as const;

  function updateField(key: string, value: string) {
    onChange({ ...data, [key]: value });
  }

  function getValue(key: string) {
    return data[key] ?? defaultData[key as keyof typeof defaultData];
  }

  return (
    <div className="custom-parent-border px-4 grid gap-5">
      <section className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">General form settings</h3>
          <p className="mt-1 text-xs text-stone-500">Set the form title and the text shown on the submit button.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {generalFields.map(([key, label]) => (
            <label className="grid gap-1 text-sm font-medium text-stone-700" key={key}>
              {label}
              <input
                className="rounded-sm border border-stone-300 bg-white p-2 text-sm font-normal outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                value={getValue(key)}
                onChange={(event) => updateField(key, event.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Input fields</h3>
          <p className="mt-1 text-xs text-stone-500">
            Edit each field’s label and placeholder, or turn it off when it is not needed.
          </p>
        </div>
        <div className="grid gap-3">
          {fieldGroups.map(({ title, labelKey, placeholderKey, visibilityKey }) => (
            <article className="grid gap-4 rounded-md border border-amber-200 bg-amber-50/50 p-4" key={labelKey}>
              <div className="flex flex-col items-stretch justify-between gap-3 border-b border-amber-200 pb-3 sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-sm font-semibold text-stone-800">{title}</h4>
                  <p className="mt-1 text-xs text-stone-500">Customize this field’s display text.</p>
                </div>
                <label className="flex w-full shrink-0 items-center justify-between gap-2 rounded-sm border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 sm:w-56">
                  <span>Show field</span>
                  <Switch
                    checked={data[visibilityKey] !== "false"}
                    onCheckedChange={(checked) => updateField(visibilityKey, String(checked))}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-stone-700">
                  Field label
                  <input
                    className="rounded-sm border border-stone-300 bg-white p-2 text-sm font-normal outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                    value={getValue(labelKey)}
                    onChange={(event) => updateField(labelKey, event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-stone-700">
                  Placeholder text
                  <input
                    className="rounded-sm border border-stone-300 bg-white p-2 text-sm font-normal outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                    value={getValue(placeholderKey)}
                    onChange={(event) => updateField(placeholderKey, event.target.value)}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
