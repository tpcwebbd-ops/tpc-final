/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

"use client";

import * as React from "react";

import SettingsFields, { type BannerPosition } from "@/app/dashboard/admin/topbanner/assets/SettingsFields";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import type { TopBannerThreeData } from "./data";

export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: TopBannerThreeData;
  onSave: (data: TopBannerThreeData) => Promise<void>;
}) {
  const [data, setData] = React.useState(initialData);
  const [busy, setBusy] = React.useState(false);
  const [tab, setTab] = React.useState<"content" | "settings">("content");
  const field = "h-9 w-full min-w-0 rounded-sm border border-stone-200 px-3";

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
      ) : (
        <div className="grid min-w-0 gap-4">
          <label className="grid min-w-0 gap-1 text-sm">
            Offer text
            <input
              className={field}
              onChange={(event) => setData({ ...data, text: event.target.value })}
              value={data.text}
            />
          </label>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-sm">
              Button label
              <input
                className={field}
                onChange={(event) => setData({ ...data, ctaLabel: event.target.value })}
                value={data.ctaLabel}
              />
            </label>
            <label className="grid min-w-0 gap-1 text-sm">
              Button URL
              <input
                className={field}
                onChange={(event) => setData({ ...data, ctaUrl: event.target.value })}
                value={data.ctaUrl}
              />
            </label>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3 text-sm">
            <span>
              <span className="block font-medium">Visible in top banner</span>
              <span className="block text-xs text-stone-500">Show the offer button.</span>
            </span>
            <Switch
              checked={data.buttonVisible !== false}
              onCheckedChange={(buttonVisible) => setData({ ...data, buttonVisible })}
            />
          </label>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-sm">
              Banner background
              <input
                className="h-9 w-full min-w-0 cursor-pointer rounded-sm border border-stone-200"
                onChange={(event) => setData({ ...data, background: event.target.value })}
                type="color"
                value={data.background}
              />
            </label>
            <label className="grid min-w-0 gap-1 text-sm">
              Offer text color
              <input
                className="h-9 w-full min-w-0 cursor-pointer rounded-sm border border-stone-200"
                onChange={(event) => setData({ ...data, foreground: event.target.value })}
                type="color"
                value={data.foreground}
              />
            </label>
          </div>
        </div>
      )}
      <Button className="w-fit" disabled={busy} size="sm" type="submit" variant="secondary">
        {busy ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
