/*
|-----------------------------------------
| setting up FooterSettings.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import LogoMediaPicker from "./LogoMediaPicker";

export type FooterSettingsValue = {
  isVisible: boolean;
  logoUrl: string;
  logoAlt: string;
  showLogo: boolean;
  showContact?: boolean;
  showLegalBar: boolean;
  background: string;
  foreground: string;
  accent: string;
  legalBackground: string;
  copyright: string;
  disabledPaths: string[];
};
export default function FooterSettings({
  value,
  onChange,
}: {
  value: FooterSettingsValue;
  onChange: (value: FooterSettingsValue) => void;
}) {
  const [path, setPath] = useState("");
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const update = (field: keyof FooterSettingsValue, next: string | boolean) => onChange({ ...value, [field]: next });
  function addPath() {
    const next = path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`;
    if (next.length > 1 && !value.disabledPaths.includes(next))
      onChange({ ...value, disabledPaths: [...value.disabledPaths, next] });
    setPath("");
  }
  return (
    <div className="grid min-w-0 gap-4">
      <div
        className={`relative overflow-hidden rounded-sm border px-4 py-3 shadow-sm transition duration-700 ${value.isVisible ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-amber-50" : "border-stone-200 bg-stone-50"}`}
      >
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-stone-800">Footer visibility</p>
            <p className={`mt-0.5 text-xs font-medium ${value.isVisible ? "text-emerald-700" : "text-stone-500"}`}>
              {value.isVisible ? "Live on the site" : "Hidden from visitors"}
            </p>
          </div>
          <button
            aria-checked={value.isVisible}
            aria-label="Toggle footer visibility"
            className={`group relative h-8 w-14 cursor-pointer rounded-full border p-1 shadow-inner transition duration-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${value.isVisible ? "border-emerald-500 bg-emerald-500 shadow-emerald-200" : "border-stone-300 bg-stone-300"}`}
            onClick={() => update("isVisible", !value.isVisible)}
            role="switch"
            type="button"
          >
            <span
              className={`grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold shadow-md transition duration-700 ${value.isVisible ? "translate-x-6 text-emerald-600" : "translate-x-0 text-stone-400"}`}
            >
              {value.isVisible ? "✓" : "×"}
            </span>
          </button>
        </div>
      </div>
      <div className="grid gap-2">
        <span className="text-sm font-medium">Logo</span>
        <div className="flex min-w-0 flex-col gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3 sm:flex-row sm:items-center">
          <div className="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-sm border border-stone-200 bg-white">
            {value.logoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  alt={value.logoAlt || "Footer logo"}
                  className="object-contain p-2"
                  fill
                  sizes="112px"
                  src={value.logoUrl}
                />
              </div>
            ) : (
              <span className="px-2 text-center text-xs text-stone-500">No logo selected</span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => setLogoPickerOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              Choose image
            </Button>
            <Button
              className="cursor-pointer"
              disabled={!value.logoUrl}
              onClick={() => update("logoUrl", "")}
              size="sm"
              type="button"
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
      <label className="grid min-w-0 gap-1 text-sm">
        Logo alt text
        <input
          className="h-9 min-w-0 rounded-sm border border-stone-200 px-3"
          onChange={(event) => update("logoAlt", event.target.value)}
          value={value.logoAlt}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={value.showLogo}
            onChange={(event) => update("showLogo", event.target.checked)}
            type="checkbox"
          />
          Show logo
        </label>
        {value.showContact !== undefined && (
          <label className="flex items-center gap-2 text-sm">
            <input
              checked={value.showContact}
              onChange={(event) => update("showContact", event.target.checked)}
              type="checkbox"
            />
            Show contact
          </label>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={value.showLegalBar}
            onChange={(event) => update("showLegalBar", event.target.checked)}
            type="checkbox"
          />
          Show legal bar
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="grid gap-1 text-xs">
          Main
          <input
            className="h-9 w-full rounded-sm border border-stone-200"
            onChange={(event) => update("background", event.target.value)}
            type="color"
            value={value.background}
          />
        </label>
        <label className="grid gap-1 text-xs">
          Text
          <input
            className="h-9 w-full rounded-sm border border-stone-200"
            onChange={(event) => update("foreground", event.target.value)}
            type="color"
            value={value.foreground}
          />
        </label>
        <label className="grid gap-1 text-xs">
          Accent
          <input
            className="h-9 w-full rounded-sm border border-stone-200"
            onChange={(event) => update("accent", event.target.value)}
            type="color"
            value={value.accent}
          />
        </label>
        <label className="grid gap-1 text-xs">
          Legal bar
          <input
            className="h-9 w-full rounded-sm border border-stone-200"
            onChange={(event) => update("legalBackground", event.target.value)}
            type="color"
            value={value.legalBackground}
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        Copyright
        <input
          className="h-9 min-w-0 rounded-sm border border-stone-200 px-3"
          onChange={(event) => update("copyright", event.target.value)}
          value={value.copyright}
        />
      </label>
      <div className="grid min-w-0 gap-2">
        <p className="text-sm font-medium">Disabled paths</p>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <input
            className="h-9 min-w-0 flex-1 rounded-sm border border-stone-200 px-3 text-sm"
            onChange={(event) => setPath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addPath();
              }
            }}
            placeholder="/dashboard"
            value={path}
          />
          <Button
            className="w-full cursor-pointer sm:w-auto"
            onClick={addPath}
            size="sm"
            type="button"
            variant="outline"
          >
            Add path
          </Button>
        </div>
        <div className="grid gap-2">
          {value.disabledPaths.map((item) => (
            <div
              className="flex min-w-0 items-center justify-between gap-2 rounded-sm border border-stone-200 bg-[#fffaf0] px-3 py-2"
              key={item}
            >
              <code className="min-w-0 truncate text-xs">{item}</code>
              <Button
                className="shrink-0 cursor-pointer text-red-700"
                onClick={() =>
                  onChange({ ...value, disabledPaths: value.disabledPaths.filter((pathItem) => pathItem !== item) })
                }
                size="sm"
                type="button"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
      {logoPickerOpen && (
        <LogoMediaPicker
          close={() => setLogoPickerOpen(false)}
          onSelect={(logoUrl) => {
            update("logoUrl", logoUrl);
            setLogoPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
