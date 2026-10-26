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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { FooterTwoData } from "./data";

export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: FooterTwoData;
  onSave: (data: FooterTwoData) => Promise<void>;
}) {
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"content" | "columns" | "links" | "legal" | "settings">("content");
  return (
    <form
      className="custom-parent-border grid min-w-0 gap-4 bg-white p-4 sm:p-5"
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
      <div className="flex flex-wrap gap-2 border-b border-[#eadfca] pb-3">
        {(["content", "columns", "links", "legal", "settings"] as const).map((item) => (
          <Button
            key={item}
            onClick={() => setTab(item)}
            size="sm"
            type="button"
            className={`cursor-pointer rounded-sm transition duration-700 ${tab === item ? "bg-amber-100 text-amber-950 hover:bg-amber-200" : "hover:bg-amber-50"}`}
            variant={tab === item ? "secondary" : "ghost"}
          >
            {item === "columns" ? "Columns" : item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>
      {tab === "settings" ? (
        <FooterSettings onChange={(settings) => setData({ ...data, ...settings })} value={data} />
      ) : tab === "columns" ? (
        <FooterLinksEditor columns={data.columns} onColumnsChange={(columns) => setData({ ...data, columns })} />
      ) : tab === "links" ? (
        <FooterLinksEditor
          links={data.links}
          onLinksChange={(links) => setData({ ...data, links })}
          singleTitle="Quick links"
        />
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
            <Field label="Tagline" value={data.tagline} onChange={(value) => setData({ ...data, tagline: value })} />
            <Field label="Email" value={data.email} onChange={(value) => setData({ ...data, email: value })} />
            <Field label="Phone" value={data.phone} onChange={(value) => setData({ ...data, phone: value })} />
          </div>
          <Label className="grid gap-1">
            <span>Description</span>
            <Textarea
              className="min-h-24"
              onChange={(event) => setData({ ...data, description: event.target.value })}
              value={data.description}
            />
          </Label>
        </div>
      )}
      <Button
        className="w-fit cursor-pointer rounded-sm bg-emerald-100 text-emerald-900 transition duration-700 hover:-translate-y-0.5 hover:bg-emerald-200"
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
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Label className="grid min-w-0 gap-1">
      {label}
      <Input onChange={(event) => onChange(event.target.value)} value={value} />
    </Label>
  );
}
