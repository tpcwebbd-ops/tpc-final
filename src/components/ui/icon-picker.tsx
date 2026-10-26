/*
|-----------------------------------------
| setting up icon-picker.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 31 August, 2026
|-----------------------------------------
*/

"use client";

import { useMemo, useState } from "react";

import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";

import { Button } from "./button";
import { Input } from "./input";

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
};

export function IconPicker({ value = "", onChange, label = "Icon" }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...iconOptions]
      .filter((name) => !query || name.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b));
  }, [search]);

  const SelectedIcon = value ? iconMap[value] : undefined;

  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-[#fffdf8] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm text-stone-700">
          <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-amber-200 bg-amber-50 text-amber-800">
            {SelectedIcon ? <SelectedIcon aria-hidden="true" size={18} /> : <span aria-hidden="true">—</span>}
          </span>
          <span className="truncate">{value || `No ${label.toLowerCase()} selected`}</span>
        </div>
        <Button
          onClick={() => {
            setDraft(value);
            setSearch("");
            setOpen(true);
          }}
          size="sm"
          type="button"
          variant="secondary"
        >
          Pick Icon
        </Button>
      </div>

      {open ? (
        <div
          aria-label="Icon picker"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-stone-900/20 p-4 backdrop-blur-sm"
          role="dialog"
        >
          <section className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-xl">
            <header className="flex flex-col gap-3 border-b border-[#eadfca] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-stone-900">Choose an icon</h2>
                <p className="mt-1 text-xs text-stone-500">Search and select an icon for this field.</p>
              </div>
              <Input
                aria-label="Search icons"
                className="sm:max-w-xs"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search icons..."
                value={search}
              />
            </header>
            <div className="grid min-h-0 grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-5 md:grid-cols-7">
              {filteredIcons.map((name) => {
                const Icon = iconMap[name];
                const selected = draft === name;
                return (
                  <button
                    aria-label={`Select ${name}`}
                    className={`grid min-h-20 place-items-center gap-2 rounded-sm border p-2 text-xs transition-colors ${
                      selected ? "border-amber-400 bg-amber-50 text-amber-900" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-[#fffaf0]"
                    }`}
                    key={name}
                    onClick={() => setDraft(name)}
                    type="button"
                  >
                    <Icon aria-hidden="true" size={20} />
                    <span className="w-full truncate">{name}</span>
                  </button>
                );
              })}
            </div>
            <footer className="flex flex-col-reverse gap-2 border-t border-[#eadfca] bg-[#fffdf8] p-4 sm:flex-row sm:justify-end">
              <Button onClick={() => setOpen(false)} type="button" variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (draft) onChange(draft);
                  setOpen(false);
                }}
                type="button"
              >
                Confirm
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
