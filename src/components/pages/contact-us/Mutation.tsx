/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

"use client";
import { Switch } from "@/components/ui/switch";

import { defaultData } from "./data";

type OpeningDay = { day: string; openTime: string; closeTime: string };
const defaultDays = JSON.parse(defaultData.openingDays) as OpeningDay[];
function readDays(value: string | undefined) {
  try {
    const days = JSON.parse(value ?? "") as OpeningDay[];
    return Array.isArray(days) ? days : defaultDays;
  } catch {
    return defaultDays;
  }
}

export default function Mutation({
  data = defaultData,
  onChange,
}: {
  data?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const days = readDays(data.openingDays);
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });
  const updateDay = (index: number, key: keyof OpeningDay, value: string) =>
    update(
      "openingDays",
      JSON.stringify(days.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))),
    );
  const value = (key: keyof typeof defaultData) => data[key] ?? defaultData[key];
  const fields = [
    "title",
    "emailLabel",
    "email",
    "addressLabel",
    "address",
    "locationLabel",
    "location",
    "mapUrl",
  ] as const;
  return (
    <div className="custom-parent-border px-4 grid gap-5">
      <section className="grid gap-3 rounded-md border border-amber-200 bg-amber-50/50 p-4">
        <h3 className="text-sm font-semibold text-stone-800">Contact information</h3>
        <label className="flex items-center justify-between gap-3 rounded-sm border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-stone-700">
          <span>Show eyebrow</span>
          <Switch
            checked={value("showEyebrow") !== "false"}
            onCheckedChange={(checked) => update("showEyebrow", String(checked))}
          />
        </label>
        {fields.map((key) => (
          <label className="grid gap-1 text-sm font-medium text-stone-700" key={key}>
            {key.replace(/([A-Z])/g, " $1")}
            <input
              className="rounded-sm border border-stone-300 bg-white p-2 font-normal"
              value={value(key)}
              onChange={(event) => update(key, event.target.value)}
            />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          Introduction
          <textarea
            className="min-h-24 rounded-sm border border-stone-300 bg-white p-2 font-normal"
            value={value("intro")}
            onChange={(event) => update("intro", event.target.value)}
          />
        </label>
      </section>
      <section className="grid gap-4 rounded-md border border-emerald-200 bg-emerald-50/40 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Opening Days</h3>
            <p className="mt-1 text-xs text-stone-500">
              Set the day name, opening time, and closing time shown to visitors.
            </p>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-sm border border-emerald-200 bg-white px-3 py-2 text-xs font-medium text-stone-700">
            <span>Open 24/7</span>
            <Switch
              checked={value("open247") === "true"}
              onCheckedChange={(checked) => update("open247", String(checked))}
            />
          </label>
        </div>
        <div className="grid gap-3">
          {days.map((item, index) => (
            <div
              className="grid gap-3 rounded-sm border border-emerald-200 bg-white p-3 sm:grid-cols-[1.3fr_1fr_1fr]"
              key={`${item.day}-${index}`}
            >
              <label className="grid gap-1 text-xs font-medium text-stone-600">
                Day name
                <input
                  className="rounded-sm border border-stone-300 p-2 text-sm font-normal text-stone-800"
                  value={item.day}
                  onChange={(event) => updateDay(index, "day", event.target.value)}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-stone-600">
                Opening time
                <input
                  className="rounded-sm border border-stone-300 p-2 text-sm font-normal text-stone-800"
                  type="time"
                  value={item.openTime}
                  onChange={(event) => updateDay(index, "openTime", event.target.value)}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-stone-600">
                Closing time
                <input
                  className="rounded-sm border border-stone-300 p-2 text-sm font-normal text-stone-800"
                  type="time"
                  value={item.closeTime}
                  onChange={(event) => updateDay(index, "closeTime", event.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
