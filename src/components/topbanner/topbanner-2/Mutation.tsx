/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import * as React from "react";

import SettingsFields, { type BannerPosition } from "@/app/dashboard/admin/topbanner/assets/SettingsFields";
import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { Switch } from "@/components/ui/switch";

import type { TopBannerTwoData } from "./data";

export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: TopBannerTwoData;
  onSave: (data: TopBannerTwoData) => Promise<void>;
}) {
  const [data, setData] = React.useState(initialData);
  const [busy, setBusy] = React.useState(false);
  const [tab, setTab] = React.useState<"content" | "icons" | "settings">("content");
  const [iconIndex, setIconIndex] = React.useState<number | null>(null);
  const updateIcon = (index: number, field: string, value: string | boolean) =>
    setData((current) => ({
      ...current,
      icons: current.icons.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  return (
    <form
      className="grid min-w-0 gap-4 overflow-x-hidden"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
          await onSave(data);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="custom-parent-border px-4 flex flex-wrap gap-2 border-b border-stone-100 pb-3">
        <Button
          onClick={() => setTab("content")}
          size="sm"
          type="button"
          variant={tab === "content" ? "secondary" : "ghost"}
        >
          Content
        </Button>
        <Button
          onClick={() => setTab("icons")}
          size="sm"
          type="button"
          variant={tab === "icons" ? "secondary" : "ghost"}
        >
          Icons
        </Button>
        <Button
          onClick={() => setTab("settings")}
          size="sm"
          type="button"
          variant={tab === "settings" ? "secondary" : "ghost"}
        >
          Settings
        </Button>
      </div>
      {tab === "settings" ? (
        <SettingsFields
          excludedPaths={data.excludedPaths}
          onPathsChange={(excludedPaths) => setData({ ...data, excludedPaths })}
          onPositionChange={(position: BannerPosition) => setData({ ...data, position })}
          position={data.position}
        />
      ) : tab === "icons" ? (
        <div className="grid min-w-0 gap-3">
          {data.icons.map((item, index) => (
            <fieldset className="grid min-w-0 gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3" key={item.id}>
              <legend className="px-1 text-xs font-semibold text-stone-600">{item.title}</legend>
              <label className="flex items-center gap-2 text-sm">
                <input
                  checked={item.visible}
                  onChange={(event) => updateIcon(index, "visible", event.target.checked)}
                  type="checkbox"
                />
                Visible
              </label>
              <label className="grid min-w-0 gap-1 text-xs text-stone-600">
                Title
                <input
                  className="h-9 w-full min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) => updateIcon(index, "title", event.target.value)}
                  value={item.title}
                />
              </label>
              <label className="grid min-w-0 gap-1 text-xs text-stone-600">
                URL
                <input
                  className="h-9 w-full min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) => updateIcon(index, "url", event.target.value)}
                  value={item.url}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIconIndex(index)} size="sm" type="button" variant="outline">
                  {iconMap[item.icon] ?? iconMap.Link}
                  <span>Choose Icon</span>
                </Button>
                <IconPicker
                  label="Banner icon"
                  onChange={(icon) => updateIcon(index, "icon", icon)}
                  value={item.icon}
                />
                <Button
                  onClick={() => setData({ ...data, icons: data.icons.filter((_, itemIndex) => itemIndex !== index) })}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </fieldset>
          ))}
          <Button
            className="w-fit"
            onClick={() =>
              setData({
                ...data,
                icons: [
                  ...data.icons,
                  { id: `custom-${Date.now()}`, title: "Custom icon", icon: "Link", url: "https://", visible: true },
                ],
              })
            }
            size="sm"
            type="button"
            variant="outline"
          >
            Add icon
          </Button>
        </div>
      ) : (
        <>
          <label className="grid min-w-0 gap-1 text-sm">
            Flow text
            <textarea
              className="min-h-24 w-full min-w-0 rounded-sm border border-stone-200 p-3"
              onChange={(event) => setData({ ...data, text: event.target.value })}
              value={data.text}
            />
          </label>
          <label className="grid min-w-0 gap-1 text-sm">
            Login button label
            <input
              className="h-9 w-full min-w-0 rounded-sm border border-stone-200 px-3"
              onChange={(event) => setData({ ...data, authLabel: event.target.value })}
              value={data.authLabel}
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3 text-sm">
            <span>
              <span className="block font-medium">Visible in top banner</span>
              <span className="block text-xs text-stone-500">Show the login or dashboard button.</span>
            </span>
            <Switch
              checked={data.buttonVisible !== false}
              onCheckedChange={(buttonVisible) => setData({ ...data, buttonVisible })}
            />
          </label>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-sm">
              Direction
              <select
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200 px-2"
                onChange={(event) =>
                  setData({ ...data, direction: event.target.value as TopBannerTwoData["direction"] })
                }
                value={data.direction}
              >
                <option value="left">Left to right</option>
                <option value="right">Right to left</option>
              </select>
            </label>
            <label className="grid min-w-0 gap-1 text-sm">
              Speed (seconds)
              <input
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200 px-2"
                max="60"
                min="5"
                onChange={(event) => setData({ ...data, speed: Number(event.target.value) })}
                type="number"
                value={data.speed}
              />
            </label>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-sm">
              Background
              <input
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200"
                onChange={(event) => setData({ ...data, background: event.target.value })}
                type="color"
                value={data.background}
              />
            </label>
            <label className="grid min-w-0 gap-1 text-sm">
              Text color
              <input
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200"
                onChange={(event) => setData({ ...data, foreground: event.target.value })}
                type="color"
                value={data.foreground}
              />
            </label>
          </div>
        </>
      )}
      <Button className="w-fit" disabled={busy} size="sm" type="submit" variant="secondary">
        {busy ? "Saving…" : "Save changes"}
      </Button>
      {iconIndex !== null && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-3 backdrop-blur-sm">
          <section className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <h3 className="font-semibold">Choose Icon</h3>
              <Button onClick={() => setIconIndex(null)} size="sm" type="button" variant="ghost">
                ×
              </Button>
            </header>
            <div className="grid max-h-[calc(85vh-60px)] grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-5 md:grid-cols-6">
              {Object.keys(iconMap).map((key) => (
                <button
                  className={`grid place-items-center gap-1 rounded-sm border p-2 text-stone-700 transition duration-700 hover:bg-amber-50 ${data.icons[iconIndex]?.icon === key ? "border-amber-500 bg-amber-100" : "border-stone-200"}`}
                  key={key}
                  onClick={() => {
                    updateIcon(iconIndex, "icon", key);
                    setIconIndex(null);
                  }}
                  title={key}
                  type="button"
                >
                  {iconMap[key]}
                  <span className="max-w-full truncate text-[10px]">{key}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </form>
  );
}
