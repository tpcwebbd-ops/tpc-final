/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import SettingsFields, { type BannerPosition } from "@/app/dashboard/admin/topbanner/assets/SettingsFields";
import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { Switch } from "@/components/ui/switch";

import type { TopBannerOneData } from "./data";

export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: TopBannerOneData;
  onSave: (data: TopBannerOneData) => Promise<void>;
}) {
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"content" | "settings">("content");
  const [iconPickerIndex, setIconPickerIndex] = useState<number | null>(null);
  const update = (index: number, field: string, value: string | boolean) =>
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
      <div className="custom-parent-border px-4 flex gap-2 border-b border-stone-100 pb-3">
        <Button
          onClick={() => setTab("content")}
          size="sm"
          type="button"
          variant={tab === "content" ? "secondary" : "ghost"}
        >
          Content
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
      {tab === "settings" && (
        <SettingsFields
          excludedPaths={data.excludedPaths}
          onPathsChange={(excludedPaths) => setData({ ...data, excludedPaths })}
          onPositionChange={(position: BannerPosition) => setData({ ...data, position })}
          position={data.position}
        />
      )}
      {tab === "content" && (
        <>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-sm">
              Background
              <input
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200 px-1"
                onChange={(event) => setData({ ...data, background: event.target.value })}
                type="color"
                value={data.background}
              />
            </label>
            <label className="grid min-w-0 gap-1 text-sm">
              Text color
              <input
                className="h-9 w-full min-w-0 rounded-sm border border-stone-200 px-1"
                onChange={(event) => setData({ ...data, foreground: event.target.value })}
                type="color"
                value={data.foreground}
              />
            </label>
          </div>
          <label className="grid min-w-0 gap-1 text-sm">
            Auth button label
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
          <div className="grid min-w-0 gap-3">
            {data.icons.map((item, index) => (
              <fieldset
                className="grid min-w-0 gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3"
                key={item.id}
              >
                <legend className="max-w-full px-1 text-xs font-semibold text-stone-600">{item.label}</legend>
                <label className="flex min-w-0 items-center gap-2 text-sm">
                  <input
                    checked={item.visible}
                    onChange={(event) => update(index, "visible", event.target.checked)}
                    type="checkbox"
                  />
                  Visible
                </label>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-1 text-xs text-stone-600">
                    URL
                    <input
                      className="h-9 w-full min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
                      onChange={(event) => update(index, "url", event.target.value)}
                      placeholder="https://..."
                      value={item.url}
                    />
                  </label>
                  <label className="grid min-w-0 gap-1 text-xs text-stone-600">
                    Message
                    <input
                      className="h-9 w-full min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
                      onChange={(event) => update(index, "message", event.target.value)}
                      placeholder="Message"
                      value={item.message}
                    />
                  </label>
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="grid min-w-0 gap-1">
                    <span className="text-xs text-stone-600">Icon</span>
                    <Button
                      className="w-full justify-start sm:w-auto"
                      onClick={() => setIconPickerIndex(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      {iconMap[item.icon] ?? iconMap.Link}
                      <span>Choose Icon</span>
                    </Button>
                    <IconPicker
                      label="Banner icon"
                      onChange={(icon) => update(index, "icon", icon)}
                      value={item.icon}
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() =>
                      setData({ ...data, icons: data.icons.filter((_, itemIndex) => itemIndex !== index) })
                    }
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </fieldset>
            ))}
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <Button
              onClick={() =>
                setData({
                  ...data,
                  icons: [
                    ...data.icons,
                    {
                      id: `custom-${Date.now()}`,
                      label: "Custom",
                      icon: "Link",
                      url: "https://",
                      message: "Open link",
                      visible: true,
                    },
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
        </>
      )}
      <Button className="w-fit" disabled={busy} size="sm" type="submit" variant="secondary">
        {busy ? "Saving…" : "Save changes"}
      </Button>
      {iconPickerIndex !== null && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-3 backdrop-blur-sm sm:p-4">
          <section
            aria-modal="true"
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <h3 className="font-semibold text-stone-900">Choose Icon</h3>
              <Button aria-label="Close icon picker" onClick={() => setIconPickerIndex(null)} size="sm" variant="ghost">
                ×
              </Button>
            </header>
            <div className="grid max-h-[calc(85vh-60px)] grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-5 md:grid-cols-6">
              {Object.keys(iconMap).map((key) => (
                <button
                  aria-label={`Choose ${key}`}
                  className={`grid min-w-0 place-items-center gap-1 rounded-sm border p-2 text-stone-700 transition duration-700 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50 ${data.icons[iconPickerIndex]?.icon === key ? "border-amber-500 bg-amber-100" : "border-stone-200"}`}
                  key={key}
                  onClick={() => {
                    update(iconPickerIndex, "icon", key);
                    setIconPickerIndex(null);
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
