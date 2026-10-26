/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/
"use client";
import { useState } from "react";

import FooterLinksEditor from "@/app/dashboard/admin/footer/assets/FooterLinksEditor";
import FooterSettings from "@/app/dashboard/admin/footer/assets/FooterSettings";
import { Button } from "@/components/ui/button";

import type { FooterThreeData } from "./data";
export default function Mutation({
  initialData,
  onSave,
}: {
  initialData: FooterThreeData;
  onSave: (data: FooterThreeData) => Promise<void>;
}) {
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"content" | "destinations" | "services" | "legal" | "settings">("content");
  const input = "h-9 w-full rounded-sm border border-stone-200 px-3";
  return (
    <form
      className="custom-parent-border grid gap-4 bg-white p-4"
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
      <div className="flex flex-wrap gap-2 border-b border-stone-100 pb-3">
        {(["content", "destinations", "services", "legal", "settings"] as const).map((item) => (
          <Button
            key={item}
            onClick={() => setTab(item)}
            size="sm"
            type="button"
            variant={tab === item ? "secondary" : "ghost"}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>
      {tab === "settings" ? (
        <FooterSettings onChange={(settings) => setData({ ...data, ...settings })} value={data} />
      ) : tab === "destinations" ? (
        <FooterLinksEditor
          links={data.destinations}
          onLinksChange={(destinations) => setData({ ...data, destinations })}
          singleTitle="Destinations"
        />
      ) : tab === "services" ? (
        <FooterLinksEditor
          links={data.services}
          onLinksChange={(services) => setData({ ...data, services })}
          singleTitle="Services"
        />
      ) : tab === "legal" ? (
        <FooterLinksEditor
          links={data.legalLinks}
          onLinksChange={(legalLinks) => setData({ ...data, legalLinks })}
          singleTitle="Legal links"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Brand
            <input
              className={input}
              onChange={(event) => setData({ ...data, brand: event.target.value })}
              value={data.brand}
            />
          </label>
          <label>
            Email
            <input
              className={input}
              onChange={(event) => setData({ ...data, email: event.target.value })}
              value={data.email}
            />
          </label>
          <label>
            Phone
            <input
              className={input}
              onChange={(event) => setData({ ...data, phone: event.target.value })}
              value={data.phone}
            />
          </label>
          <label>
            Copyright
            <input
              className={input}
              onChange={(event) => setData({ ...data, copyright: event.target.value })}
              value={data.copyright}
            />
          </label>
          <label className="sm:col-span-2">
            Description
            <textarea
              className="min-h-24 w-full rounded-sm border border-stone-200 p-3"
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
