/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

"use client";
import { defaultData } from "./data";

export default function Mutation({
  data = defaultData,
  onChange,
}: {
  data?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const fields = [
    ["title", "Title"],
    ["intro", "Introduction"],
    ["emailLabel", "Email info label"],
    ["email", "Email"],
    ["addressLabel", "Address info label"],
    ["address", "Address"],
    ["locationLabel", "Location info label"],
    ["location", "Location"],
    ["mapUrl", "Map embed URL"],
    ["nameLabel", "Name field label"],
    ["namePlaceholder", "Name placeholder"],
    ["emailFieldLabel", "Email field label"],
    ["emailPlaceholder", "Email placeholder"],
    ["messageLabel", "Message field label"],
    ["messagePlaceholder", "Message placeholder"],
    ["buttonLabel", "Button label"],
  ] as const;
  return (
    <div className="custom-parent-border px-4 grid gap-4">
      <p className="text-xs text-stone-500">
        Customize the contact information, map, and message fields shown in this contact-style form.
      </p>
      {fields.map(([key, label]) => (
        <label className="grid gap-1 text-sm font-medium text-stone-700" key={key}>
          {label}
          {key === "intro" ? (
            <textarea
              className="min-h-24 rounded-sm border border-stone-300 bg-white p-2 font-normal"
              value={data[key] ?? defaultData[key]}
              onChange={(event) => onChange({ ...data, [key]: event.target.value })}
            />
          ) : (
            <input
              className="rounded-sm border border-stone-300 bg-white p-2 font-normal"
              value={data[key] ?? defaultData[key]}
              onChange={(event) => onChange({ ...data, [key]: event.target.value })}
            />
          )}
        </label>
      ))}
    </div>
  );
}
