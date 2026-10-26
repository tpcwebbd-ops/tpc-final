/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { defaultMenuOne, defaultMenuThree, defaultMenuTwo, type MenuData } from "@/app/dashboard/admin/menu/data";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import MenuOneQuery from "@/components/menu/menu-1/Query";
import MenuTwoQuery from "@/components/menu/menu-2/Query";
import MenuThreeQuery from "@/components/menu/menu-3/Query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";

type MenuItem = string;
type SavedMenu = { menuItem: MenuItem; position: number; data: MenuData };
const choices: { name: string; data: MenuData }[] = [
  { name: "Menu 1", data: defaultMenuOne },
  { name: "Menu 2", data: defaultMenuTwo },
  { name: "Menu 3", data: defaultMenuThree },
];
const api = async <T,>(url: string, init?: RequestInit) => {
  const response = await fetch(url, { cache: "no-store", ...init });
  const result = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(result.error || "Could not complete the request.");
  return result;
};

function MenuRender({ data }: { data: MenuData }) {
  if (data.variant === "menu-2") return <MenuTwoQuery data={data} pending={false} />;
  if (data.variant === "menu-3") return <MenuThreeQuery data={data} pending={false} />;
  return <MenuOneQuery data={data} pending={false} />;
}

export default function MenuPage() {
  const { data: session, isPending } = authClient.useSession();
  const confirmDelete = useConfirmDelete();
  const [menus, setMenus] = useState<SavedMenu[]>([]);
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState<MenuItem | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const refresh = useCallback(async () => {
    try {
      const result = await api<{ menus: SavedMenu[] }>("/api/dashboard/menu/v1");
      setMenus(result.menus ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load menus.");
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (session) void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh, session]);
  const save = async (menuItem: MenuItem, data: MenuData, successMessage?: string) => {
    setBusy(menuItem);
    setError("");
    try {
      await api("/api/dashboard/menu/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItem, data }),
      });
      await refresh();
      setPicker(false);
      window.dispatchEvent(new Event("webapps-menu-updated"));
      if (successMessage) setToast(successMessage);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save menu.");
    } finally {
      setBusy(null);
    }
  };
  const remove = async (menuItem: MenuItem) => {
    if (!(await confirmDelete("Delete this menu? This cannot be undone."))) return;
    setBusy(menuItem);
    try {
      await api(`/api/dashboard/menu/v1?menuItem=${menuItem}`, { method: "DELETE" });
      setMenus((items) => items.filter((item) => item.menuItem !== menuItem));
      window.dispatchEvent(new Event("webapps-menu-updated"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete menu.");
    } finally {
      setBusy(null);
    }
  };
  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= menus.length) return;
    const next = [...menus];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((item, position) => ({ ...item, position }));
    setMenus(ordered);
    try {
      await api("/api/dashboard/menu/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ordered.map((item) => ({ menuItem: item.menuItem, position: item.position })) }),
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update menu order.");
      void refresh();
    }
  };
  if (isPending) return <main className="grid flex-1 place-items-center bg-[#fffaf0]">Loading menus…</main>;
  if (!session) return <main className="grid flex-1 place-items-center bg-[#fffaf0]">Sign in required.</main>;
  return (
    <main className="flex-1 bg-[#fffaf0] p-4 sm:p-6 lg:p-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-stone-800">Menu</h1>
          <Button
            className="cursor-pointer rounded-sm transition duration-700 hover:bg-amber-200"
            onClick={() => setPicker(true)}
            variant="outline"
          >
            Select Menu
          </Button>
        </div>
        {error ? <p className="mb-4 rounded-sm bg-red-100 p-3 text-sm text-red-900">{error}</p> : null}
        <div className="grid gap-5">
          {menus.map(({ menuItem, data }, index) => (
            <article className="overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm" key={menuItem}>
              <div className="flex items-center justify-between border-b border-[#f1e7d5] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {data.variant.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </span>
                  <span className="text-xs text-stone-400">#{index + 1}</span>
                </div>
                <label aria-busy={busy === menuItem} className="flex items-center gap-2 text-xs font-medium text-stone-600">
                  <span>{data.isVisible ? "Publish" : "Draft"}</span>
                  <span className="relative flex h-5 w-9 items-center justify-center">
                    <Switch
                      checked={data.isVisible}
                      disabled={busy !== null}
                      onCheckedChange={(isVisible) =>
                        void save(menuItem, { ...data, isVisible }, `Menu ${isVisible ? "published" : "saved as draft"}.`)
                      }
                    />
                    {busy === menuItem ? (
                      <span
                        aria-label="Saving menu status"
                        className="absolute h-4 w-4 animate-spin rounded-full border-2 border-amber-200 border-t-amber-700"
                        role="status"
                      />
                    ) : null}
                  </span>
                </label>
              </div>
              <div className="overflow-hidden">
                <MenuRender data={data} />
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-[#f1e7d5] p-3">
                <Button
                  disabled={index === 0 || busy === menuItem}
                  onClick={() => void move(index, -1)}
                  size="sm"
                  variant="outline"
                >
                  ↑
                </Button>
                <Button
                  disabled={index === menus.length - 1 || busy === menuItem}
                  onClick={() => void move(index, 1)}
                  size="sm"
                  variant="outline"
                >
                  ↓
                </Button>
                <Link
                  className="inline-flex h-8 items-center rounded-sm border border-stone-200 bg-white px-3 text-xs font-medium hover:bg-stone-100"
                  href={`/dashboard/admin/menu/preview?menuItem=${menuItem}`}
                >
                  Preview
                </Link>
                <Link
                  className="inline-flex h-8 items-center rounded-sm border border-stone-200 bg-white px-3 text-xs font-medium hover:bg-stone-100"
                  href={`/dashboard/admin/menu/edit?menuItem=${menuItem}`}
                >
                  Edit
                </Link>
                <Button
                  className="rounded-sm"
                  disabled={busy === menuItem}
                  onClick={() => void remove(menuItem)}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
          {!menus.length ? (
            <div className="rounded-sm border border-dashed border-[#d9c9aa] p-12 text-center text-sm text-stone-500">
              Select a menu to add it here.
            </div>
          ) : null}
        </div>
      </section>
      {picker ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
          <section className="w-full max-w-[80vw] rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Select Menu</h2>
              </div>
              <button className="cursor-pointer text-stone-500" onClick={() => setPicker(false)} type="button">
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4 overflow-x-auto pb-2">
              {choices.map((choice) => (
                <article
                  aria-disabled={busy !== null}
                  className="min-w-[360px] flex-1 cursor-pointer overflow-hidden rounded-sm border border-[#eadfca] bg-white transition duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                  key={choice.name}
                  onClick={() => {
                    if (busy === null)
                      void save(`menu-${crypto.randomUUID()}`, {
                        ...choice.data,
                        links: choice.data.links.map((link) => ({ ...link })),
                      });
                  }}
                  onKeyDown={(event) => {
                    if (busy === null && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      void save(`menu-${crypto.randomUUID()}`, {
                        ...choice.data,
                        links: choice.data.links.map((link) => ({ ...link })),
                      });
                    }
                  }}
                  role="button"
                  tabIndex={busy === null ? 0 : -1}
                >
                  <div className="pointer-events-none overflow-hidden border-b border-[#f1e7d5]">
                    <MenuRender data={{ ...choice.data, isVisible: false, position: "scroll" }} />
                  </div>
                  <div className="p-3">
                    <span className="text-sm font-semibold">{choice.name}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
      <Toast message={toast} onDismiss={() => setToast("")} />
    </main>
  );
}
