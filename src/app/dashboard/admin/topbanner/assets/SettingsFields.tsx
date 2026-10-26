/*
|-----------------------------------------
| setting up SettingsFields.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type BannerPosition = "fixed" | "sticky" | "hide";

export default function SettingsFields({
  position,
  excludedPaths,
  onPositionChange,
  onPathsChange,
}: {
  position: BannerPosition;
  excludedPaths: string[];
  onPositionChange: (position: BannerPosition) => void;
  onPathsChange: (paths: string[]) => void;
}) {
  const [path, setPath] = useState("");
  function addPath() {
    const value = path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`;
    if (value.length > 1 && !excludedPaths.includes(value)) onPathsChange([...excludedPaths, value]);
    setPath("");
  }
  return (
    <div className="grid min-w-0 gap-5">
      <div className="grid gap-2">
        <p className="text-sm font-medium text-stone-700">Position</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["fixed", "sticky", "hide"] as const).map((value) => (
            <button
              className={`min-h-9 rounded-sm border px-3 text-left text-sm capitalize transition duration-700 ${position === value ? "border-amber-400 bg-amber-100 text-amber-900" : "border-stone-200 bg-white text-stone-600 hover:bg-amber-50"}`}
              key={value}
              onClick={() => onPositionChange(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
        <p className="text-xs text-stone-500">
          Fixed stays at the viewport top. Sticky follows the page until its boundary. Hide disables rendering.
        </p>
      </div>
      <div className="grid min-w-0 gap-2">
        <p className="text-sm font-medium text-stone-700">Do not render on paths</p>
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
            placeholder="/example"
            value={path}
          />
          <Button className="w-full sm:w-auto" onClick={addPath} size="sm" type="button" variant="outline">
            Add path
          </Button>
        </div>
        <div className="grid min-w-0 gap-2">
          {excludedPaths.map((item) => (
            <div
              className="flex min-w-0 items-center justify-between gap-2 rounded-sm border border-stone-200 bg-[#fffaf0] px-3 py-2"
              key={item}
            >
              <code className="min-w-0 truncate text-xs text-stone-700">{item}</code>
              <Button
                className="shrink-0 text-red-700"
                onClick={() => onPathsChange(excludedPaths.filter((pathItem) => pathItem !== item))}
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
    </div>
  );
}
