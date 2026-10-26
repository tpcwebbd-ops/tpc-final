/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useState } from "react";

import FooterLinksEditor from "@/app/dashboard/admin/footer/assets/FooterLinksEditor";
import FooterSettings from "@/app/dashboard/admin/footer/assets/FooterSettings";
import { Button } from "@/components/ui/button";

import type { FooterOneData } from "./data";

export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: FooterOneData;
  onSave: (data: FooterOneData) => Promise<void>;
}) {
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"content" | "columns" | "legal" | "settings">("content");
  return (
    <form
      className="custom-parent-border grid min-w-0 gap-4 bg-white p-4"
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
      <Tabs tab={tab} setTab={setTab} />
      {tab === "settings" ? (
        <FooterSettings onChange={(settings) => setData({ ...data, ...settings })} value={data} />
      ) : tab === "columns" ? (
        <FooterLinksEditor columns={data.columns} onColumnsChange={(columns) => setData({ ...data, columns })} />
      ) : tab === "legal" ? (
        <FooterLinksEditor
          links={data.legalLinks}
          onLinksChange={(legalLinks) => setData({ ...data, legalLinks })}
          singleTitle="Legal links"
        />
      ) : (
        <div className="grid min-w-0 gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Brand" value={data.brand} onChange={(value) => setData({ ...data, brand: value })} />
            <Field label="Email" value={data.email} onChange={(value) => setData({ ...data, email: value })} />
            <Field label="Phone" value={data.phone} onChange={(value) => setData({ ...data, phone: value })} />
            <Field
              label="Copyright"
              value={data.copyright}
              onChange={(value) => setData({ ...data, copyright: value })}
            />
          </div>
          <label className="grid gap-1 text-sm">
            Description
            <textarea
              className="min-h-20 rounded-sm border border-stone-200 p-3"
              onChange={(event) => setData({ ...data, description: event.target.value })}
              value={data.description}
            />
          </label>
        </div>
      )}
      <Button
        className="w-fit cursor-pointer bg-emerald-100 text-emerald-900 transition duration-700 hover:bg-emerald-200"
        disabled={busy}
        size="sm"
        type="submit"
        variant="secondary"
      >
        {busy ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
function Tabs({ tab, setTab }: { tab: string; setTab: (tab: "content" | "columns" | "legal" | "settings") => void }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-stone-100 pb-3">
      {(["content", "columns", "legal", "settings"] as const).map((item) => (
        <Button
          key={item}
          onClick={() => setTab(item)}
          size="sm"
          type="button"
          variant={tab === item ? "secondary" : "ghost"}
        >
          {item === "columns" ? "Columns & links" : item[0].toUpperCase() + item.slice(1)}
        </Button>
      ))}
    </div>
  );
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid min-w-0 gap-1 text-sm">
      {label}
      <input
        className="h-9 min-w-0 rounded-sm border border-stone-200 px-3"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
