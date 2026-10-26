/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useCallback, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { iconMap } from "@/components/all-icons/all-icons";

type WhatsAppSettings = {
  number: string;
  paddingX: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
  paddingY: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
  marginX: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
  marginY: "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  defaultMessage: string;
  isVisible: boolean;
  desktopTextVisible: boolean;
};

const paddingOptions = [
  ["0", "0"],
  ["small", "Small"],
  ["medium", "Medium"],
  ["large", "Large"],
  ["extra-large", "Extra Large"],
  ["xxl", "XXL"],
  ["3xl", "3XL"],
  ["4xl", "4XL"],
  ["5xl", "5XL"],
] as const;
const positionOptions = [
  ["top-left", "Top + left"],
  ["top-right", "Top + right"],
  ["bottom-left", "Bottom + left"],
  ["bottom-right", "Bottom + right"],
] as const;

export default function WhatsAppPage() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/dashboard/whatsapp/v1", { cache: "no-store", credentials: "same-origin" });
      const body = (await response.json().catch(() => null)) as { settings?: WhatsAppSettings; error?: string } | null;
      if (!response.ok || !body?.settings) throw new Error(body?.error ?? "Could not load WhatsApp settings.");
      setSettings(body.settings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load WhatsApp settings.");
    }
  }, []);

  useEffect(() => {
    const task = window.setTimeout(() => void loadSettings(), 0);
    return () => window.clearTimeout(task);
  }, [loadSettings]);

  if (!settings)
    return <LoadingState error={error} onRetry={loadSettings} />;

  return <WhatsAppEditor initialSettings={settings} key={JSON.stringify(settings)} onRefresh={loadSettings} />;
}

function WhatsAppEditor({ initialSettings: savedSettings, onRefresh }: { initialSettings: WhatsAppSettings; onRefresh: () => Promise<void> }) {
  const [settings, setSettings] = useState<WhatsAppSettings>(savedSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function save() {
    setIsSaving(true);
    try {
      const response = await fetch("/api/dashboard/whatsapp/v1", {
        method: "PATCH",
        cache: "no-store",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await response.json().catch(() => null)) as { settings?: WhatsAppSettings; error?: string } | null;
      if (!response.ok || !result?.settings) throw new Error(result?.error ?? "Could not update WhatsApp settings.");
      setSettings(result.settings);
      await onRefresh();
      setToast({ message: "WhatsApp settings updated." });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Could not update WhatsApp settings.", error: true });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[90] rounded-sm px-4 py-3 text-sm text-white shadow-xl transition duration-700 ${toast.error ? "bg-red-700" : "bg-stone-900"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      {isSaving && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-stone-950/15 p-4 backdrop-blur-[1px]" role="status">
          <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-white px-5 py-4 text-sm font-semibold text-stone-800 shadow-xl">
            <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600" />
            Updating WhatsApp settings…
          </div>
        </div>
      )}
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-7">
        <div className="absolute -right-16 -top-16 h-40 w-40 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-emerald-200/50 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-sm bg-emerald-600 text-white shadow-lg">
              <FaWhatsapp size={22} />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">WhatsApp</h1>
          </div>
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white transition duration-700 hover:-translate-y-1 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={() => void save()}
            type="button"
          >
            {iconMap.Save}
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
        <div className="relative mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="grid gap-5">
            <VisibilityToggle
              checked={settings.isVisible}
              label="Visible"
              onChange={(isVisible) => setSettings({ ...settings, isVisible })}
            />
            <VisibilityToggle
              checked={settings.desktopTextVisible}
              label="Desktop text"
              onChange={(desktopTextVisible) => setSettings({ ...settings, desktopTextVisible })}
            />
            <Field label="Whats number">
              <input
                className="input"
                inputMode="tel"
                maxLength={20}
                onChange={(event) => setSettings({ ...settings, number: event.target.value })}
                placeholder="+880 17..."
                value={settings.number}
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Padding X">
                <select
                  className="input cursor-pointer"
                  onChange={(event) =>
                    setSettings({ ...settings, paddingX: event.target.value as WhatsAppSettings["paddingX"] })
                  }
                  value={settings.paddingX}
                >
                  {paddingOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Padding Y">
                <select
                  className="input cursor-pointer"
                  onChange={(event) => setSettings({ ...settings, paddingY: event.target.value as WhatsAppSettings["paddingY"] })}
                  value={settings.paddingY}
                >
                  {paddingOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Margin X">
                <select
                  className="input cursor-pointer"
                  onChange={(event) => setSettings({ ...settings, marginX: event.target.value as WhatsAppSettings["marginX"] })}
                  value={settings.marginX}
                >
                  {paddingOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Margin Y">
                <select
                  className="input cursor-pointer"
                  onChange={(event) => setSettings({ ...settings, marginY: event.target.value as WhatsAppSettings["marginY"] })}
                  value={settings.marginY}
                >
                  {paddingOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Position">
              <select
                className="input cursor-pointer"
                onChange={(event) =>
                  setSettings({ ...settings, position: event.target.value as WhatsAppSettings["position"] })
                }
                value={settings.position}
              >
                {positionOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-1.5 block">Default message</span>
              <textarea
                className="input min-h-28 resize-y"
                maxLength={1000}
                onChange={(event) => setSettings({ ...settings, defaultMessage: event.target.value })}
                value={settings.defaultMessage}
              />
            </label>
          </div>
          <Preview settings={settings} />
        </div>
      </section>
    </main>
  );
}

function LoadingState({ error, onRetry }: { error: string | null; onRetry: () => Promise<void> }) {
  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-4">
      <section className="w-full max-w-sm rounded-sm border border-[#eadfca] bg-white p-8 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)]">
        {error ? (
          <>
            <p className="text-sm font-medium text-red-700 break-words">{error}</p>
            <button className="mt-5 cursor-pointer rounded-sm bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white transition duration-700 hover:bg-emerald-700" onClick={() => void onRetry()} type="button">Try again</button>
          </>
        ) : (
          <>
            <span aria-hidden="true" className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
            <p className="mt-4 text-sm font-semibold text-stone-800">Loading WhatsApp settings…</p>
          </>
        )}
      </section>
    </main>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
function VisibilityToggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <div className={`flex items-center justify-between rounded-sm border px-4 py-3 transition duration-700 ${checked ? "border-emerald-200 bg-emerald-50/60" : "border-[#eadfca] bg-[#fffaf0]"}`}><span className="text-sm font-medium text-stone-700">{label}</span><button aria-checked={checked} aria-label={`Toggle ${label}`} className={`group relative h-8 w-14 cursor-pointer rounded-full border p-1 shadow-inner transition duration-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${checked ? "border-emerald-500 bg-emerald-500 shadow-emerald-200" : "border-stone-300 bg-stone-300"}`} onClick={() => onChange(!checked)} role="switch" type="button"><span className={`grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold shadow-md transition duration-700 ${checked ? "translate-x-6 text-emerald-600" : "translate-x-0 text-stone-400"}`}>{checked ? "✓" : "×"}</span></button></div>;
}
function Preview({ settings }: { settings: WhatsAppSettings }) {
  const location = settings.position.replace("-", " ");
  const spacing = { "0": 0, small: 4, medium: 8, large: 12, "extra-large": 16, xxl: 20, "3xl": 24, "4xl": 32, "5xl": 40 };
  return (
    <aside className="overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-stone-500">Preview</p>
      <div className="relative mt-4 h-56 overflow-hidden rounded-sm border border-[#eadfca] bg-white">
        <div
          className={`absolute ${settings.position.includes("bottom") ? "bottom-4" : "top-4"} ${settings.position.includes("right") ? "right-4" : "left-4"} transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]`}
        >
          <span
            className={`flex items-center gap-2 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-700 ${settings.desktopTextVisible ? "w-auto" : "justify-center"} ${settings.isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            style={{ paddingInline: spacing[settings.paddingX], paddingBlock: spacing[settings.paddingY], marginInline: spacing[settings.marginX], marginBlock: spacing[settings.marginY] }}
          >
            <FaWhatsapp size={22} />
            {settings.desktopTextVisible && <span className="hidden text-sm font-semibold md:inline">WhatsApp</span>}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-stone-500">{location}</p>
    </aside>
  );
}
