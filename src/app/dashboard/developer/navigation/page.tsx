/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

"use client";

import { Download, Eye, RefreshCw, Settings, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { NavigationData } from "@/app/api/dashboard/navigation/v1/route";
import { authClient } from "@/app/api/lib/auth-client";
import { iconMap } from "@/components/all-icons/all-icons";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { downloadNavigationZip } from "@/lib/navigation-export";

const field = "h-8 w-full cursor-pointer rounded-sm border border-stone-200 bg-white px-2 text-sm";
const action = "cursor-pointer transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200";
const icons = Object.keys(iconMap);
type Item = NavigationData["user"]["items"][number];
type Notice = { text: string; error?: boolean } | null;

function messageFrom(response: Response, body: unknown, fallback: string) {
  return typeof body === "object" && body && "error" in body && typeof body.error === "string"
    ? body.error
    : `${fallback} (${response.status})`;
}

async function navigationRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, { cache: "no-store", ...init });
  const body = (await response.json().catch(() => null)) as { navigation?: NavigationData; error?: string } | null;
  if (!response.ok || !body?.navigation)
    throw new Error(messageFrom(response, body, "Could not synchronize navigation."));
  return body.navigation;
}

export default function NavigationPage() {
  const { data: session, isPending } = authClient.useSession();
  const [value, setValue] = useState<NavigationData | null>(null);
  const [tab, setTab] = useState<"user" | "dashboard">("user");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const styleTimer = useRef<number | null>(null);

  const load = useCallback(async (showRefreshNotice = false) => {
    setLoading(true);
    try {
      setValue(await navigationRequest("/api/dashboard/navigation/v1?dashboard=1"));
      if (showRefreshNotice) setNotice({ text: "Navigation refreshed." });
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : "Could not load navigation.", error: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session) return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [isPending, load, session]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(
    () => () => {
      if (styleTimer.current) window.clearTimeout(styleTimer.current);
    },
    [],
  );

  const persist = useCallback(
    async (next: NavigationData, successMessage: string) => {
      if (styleTimer.current) {
        window.clearTimeout(styleTimer.current);
        styleTimer.current = null;
      }
      setUpdating(true);
      try {
        const navigation = await navigationRequest("/api/dashboard/navigation/v1", {
          body: JSON.stringify(next),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        setValue(navigation);
        window.dispatchEvent(new Event("speed-box-navigation-updated"));
        setNotice({ text: successMessage });
        return true;
      } catch (error) {
        setNotice({ text: error instanceof Error ? error.message : "Could not save navigation.", error: true });
        await load();
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [load],
  );

  const updateStyle = (patch: Partial<NavigationData["user"]>) => {
    if (!value) return;
    const next = { ...value, [tab]: { ...value[tab], ...patch } } as NavigationData;
    setValue(next);
    if (styleTimer.current) window.clearTimeout(styleTimer.current);
    styleTimer.current = window.setTimeout(() => void persist(next, "Navigation style saved."), 700);
  };

  if (isPending || loading) return <LoadingPage />;
  if (!session || !value)
    return (
      <main className="grid flex-1 place-items-center bg-[#fffaf0] p-6 text-sm text-stone-600">Sign in required</main>
    );

  const config = value[tab];
  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6">
      {updating && <NavigationLoader />}
      <div className="mx-auto max-w-5xl">
        {notice && <Toast notice={notice} />}
        <section className="rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className={action}
                onClick={() => setTab("user")}
                size="sm"
                type="button"
                variant={tab === "user" ? "secondary" : "outline"}
              >
                User navigation
              </Button>
              <Button
                className={action}
                onClick={() => setTab("dashboard")}
                size="sm"
                type="button"
                variant={tab === "dashboard" ? "secondary" : "outline"}
              >
                Dashboard navigation
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tab === "user" && (
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-700">
                  <span>{value.user.enabled ? "Visible in mobile" : "Hidden in mobile"}</span>
                  <Switch
                    checked={value.user.enabled}
                    className="cursor-pointer"
                    disabled={updating}
                    onCheckedChange={(enabled) => updateStyle({ enabled })}
                  />
                </label>
              )}
              <Button
                aria-expanded={settingsOpen}
                className={`${action} md:hidden`}
                disabled={updating}
                onClick={() => setSettingsOpen((open) => !open)}
                size="sm"
                type="button"
                variant={settingsOpen ? "secondary" : "outline"}
              >
                <Settings /> Settings
              </Button>
              <Button
                className={action}
                disabled={updating}
                onClick={() => void load(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                <RefreshCw className={updating ? "animate-spin" : ""} /> Refresh
              </Button>
              <span className="self-center text-xs text-stone-500">{updating ? "Saving…" : "Saves automatically"}</span>
            </div>
          </header>
          <div className="mt-4 hidden md:block">
            <StyleEditor
              config={config}
              disabled={updating}
              notify={setNotice}
              update={updateStyle}
              user={tab === "user"}
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Items
              busy={updating}
              dashboard={tab === "dashboard"}
              items={config.items}
              notify={setNotice}
              save={async (items, successMessage) =>
                persist({ ...value, [tab]: { ...value[tab], items } } as NavigationData, successMessage)
              }
            />
            <NavigationPreview config={config} dashboard={tab === "dashboard"} />
          </div>
        </section>
      </div>
      <SettingsDrawer
        close={() => setSettingsOpen(false)}
        config={config}
        disabled={updating}
        notify={setNotice}
        open={settingsOpen}
        update={updateStyle}
        user={tab === "user"}
      />
    </main>
  );
}

function SettingsDrawer({
  close,
  config,
  disabled,
  notify,
  open,
  update,
  user,
}: {
  close: () => void;
  config: NavigationData["user"] | NavigationData["dashboard"];
  disabled: boolean;
  notify: (notice: Notice) => void;
  open: boolean;
  update: (patch: Partial<NavigationData["user"]>) => void;
  user: boolean;
}) {
  return (
    <div className={`fixed inset-0 z-[90] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button
        aria-label="Close navigation settings"
        className={`absolute inset-0 cursor-pointer bg-stone-950/30 backdrop-blur-[2px] transition-opacity duration-700 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        onClick={close}
        type="button"
      />
      <aside
        aria-hidden={!open}
        aria-label="Navigation settings"
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col border-r border-[#eadfca] bg-[#fffaf0] shadow-2xl transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <header className="flex items-center justify-between border-b border-[#eadfca] bg-white px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-800">
              {user ? "User" : "Dashboard"} navigation settings
            </p>
            <p className="text-xs text-stone-500">Changes save automatically</p>
          </div>
          <Button
            aria-label="Close settings"
            className={action}
            onClick={close}
            size="sm"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <StyleEditor config={config} disabled={disabled} notify={notify} update={update} user={user} />
        </div>
      </aside>
    </div>
  );
}

function StyleEditor({
  config,
  disabled,
  notify,
  update,
  user,
}: {
  config: NavigationData["user"] | NavigationData["dashboard"];
  disabled: boolean;
  notify: (notice: Notice) => void;
  update: (patch: Partial<NavigationData["user"]>) => void;
  user: boolean;
}) {
  const [path, setPath] = useState("");
  const userConfig = config as NavigationData["user"];
  const addPath = () => {
    const nextPath = path.trim();
    if (!nextPath.startsWith("/")) return notify({ text: "A hidden path must begin with /.", error: true });
    if (userConfig.hiddenPaths.includes(nextPath)) return notify({ text: "This path is already hidden.", error: true });
    update({ hiddenPaths: [...userConfig.hiddenPaths, nextPath] });
    setPath("");
  };
  const setIconCount = (iconCount: 4 | 5) => {
    const visibleCount = userConfig.items.filter((item) => item.visible !== false).length;
    const items =
      iconCount === 5 && visibleCount < 5
        ? [
            ...userConfig.items,
            { id: crypto.randomUUID(), name: "New item", url: "/", icon: "Navigation", visible: true },
          ]
        : userConfig.items;
    update({ iconCount, items });
  };
  return (
    <div className="grid gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 sm:grid-cols-2 lg:grid-cols-3">
      {user && (
        <Label name="Total icons">
          <select
            className={field}
            disabled={disabled}
            onChange={(event) => setIconCount(Number(event.target.value) as 4 | 5)}
            value={(config as NavigationData["user"]).iconCount}
          >
            <option value="4">4 icons</option>
            <option value="5">5 icons</option>
          </select>
        </Label>
      )}
      <Label name="Background">
        <input
          className={field}
          disabled={disabled}
          onChange={(event) => update({ background: event.target.value })}
          type="color"
          value={config.background}
        />
      </Label>
      <Label name="Text color">
        <input
          className={field}
          disabled={disabled}
          onChange={(event) => update({ foreground: event.target.value })}
          type="color"
          value={config.foreground}
        />
      </Label>
      <Label name={`Transparency ${config.transparency}%`}>
        <input
          className="w-full cursor-pointer accent-amber-500"
          disabled={disabled}
          max="100"
          min="0"
          onChange={(event) => update({ transparency: Number(event.target.value) })}
          type="range"
          value={config.transparency}
        />
      </Label>
      <Label name="Bottom margin">
        <select
          className={field}
          disabled={disabled}
          onChange={(event) => update({ marginBottom: Number(event.target.value) })}
          value={config.marginBottom}
        >
          {[0, 10, 25, 50, 75, 100].map((number) => (
            <option key={number} value={number}>
              {number}px
            </option>
          ))}
        </select>
      </Label>
      <Label name="Border radius">
        <select
          className={field}
          disabled={disabled}
          onChange={(event) => update({ radius: event.target.value as NavigationData["user"]["radius"] })}
          value={config.radius}
        >
          <option value="none">None</option>
          <option value="sm">SM</option>
          <option value="xl">XL</option>
          <option value="full">Full</option>
        </select>
      </Label>
      <Label name="Padding X">
        <input
          className={field}
          disabled={disabled}
          min="0"
          onChange={(event) => update({ paddingX: Number(event.target.value) })}
          type="number"
          value={config.paddingX}
        />
      </Label>
      <Label name="Padding Y">
        <input
          className={field}
          disabled={disabled}
          min="0"
          onChange={(event) => update({ paddingY: Number(event.target.value) })}
          type="number"
          value={config.paddingY}
        />
      </Label>
      {user && (
        <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
          <Label name="Hide by path">
            <div className="flex gap-2">
              <input
                className={field}
                disabled={disabled}
                onChange={(event) => setPath(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPath();
                  }
                }}
                placeholder="/path"
                value={path}
              />
              <Button
                className={action}
                disabled={disabled || !path.trim()}
                onClick={addPath}
                size="sm"
                type="button"
                variant="outline"
              >
                Add
              </Button>
            </div>
          </Label>
          <ul className="flex flex-wrap gap-2">
            {userConfig.hiddenPaths.map((hiddenPath) => (
              <li
                className="flex max-w-full items-center gap-1 rounded-sm border border-[#eadfca] bg-white py-1 pl-2 pr-1 text-xs"
                key={hiddenPath}
                title={hiddenPath}
              >
                <span className="min-w-0 flex-1 truncate">{hiddenPath}</span>
                <Button
                  aria-label={`Remove ${hiddenPath}`}
                  className={action}
                  disabled={disabled}
                  onClick={() => update({ hiddenPaths: userConfig.hiddenPaths.filter((item) => item !== hiddenPath) })}
                  size="xs"
                  title="Remove path"
                  type="button"
                  variant="ghost"
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Items({
  busy,
  dashboard,
  items,
  notify,
  save,
}: {
  busy: boolean;
  dashboard: boolean;
  items: Item[];
  notify: (notice: Notice) => void;
  save: (items: Item[], successMessage: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState<Item | null>(null);
  const [viewing, setViewing] = useState<Item | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [iconsOpen, setIconsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const confirm = useConfirmDelete();
  const working = busy || submitting;
  const select = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  const exportItems = (rows: Item[], kind: "export" | "bulk-export") => {
    if (!rows.length) return notify({ text: "Select at least one navigation item to export.", error: true });
    try {
      downloadNavigationZip(rows, kind);
      notify({ text: `${rows.length} navigation item${rows.length === 1 ? "" : "s"} exported.` });
    } catch {
      notify({ text: "Could not export navigation items.", error: true });
    }
  };
  const persist = async () => {
    if (!editing?.name.trim() || !editing.url.trim())
      return notify({ text: "Name and path are required.", error: true });
    const exists = items.some((item) => item.id === editing.id);
    setSubmitting(true);
    const saved = await save(
      exists
        ? items.map((item) =>
            item.id === editing.id ? { ...editing, name: editing.name.trim(), url: editing.url.trim() } : item,
          )
        : [...items, { ...editing, name: editing.name.trim(), url: editing.url.trim() }],
      `Navigation item ${exists ? "updated" : "created"}.`,
    );
    setSubmitting(false);
    if (saved) setEditing(null);
  };
  const remove = async (ids: string[]) => {
    if (
      !ids.length ||
      !(await confirm(`Delete ${ids.length} navigation item${ids.length === 1 ? "" : "s"}? This cannot be undone.`))
    )
      return;
    setSubmitting(true);
    const saved = await save(
      items.filter((item) => !ids.includes(item.id)),
      `${ids.length} navigation item${ids.length === 1 ? "" : "s"} deleted.`,
    );
    setSubmitting(false);
    if (saved) setSelected((current) => current.filter((id) => !ids.includes(id)));
  };
  return (
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{dashboard ? "Left 3 items" : "Navigation items"}</h2>
        <div className="flex gap-2">
          <Button
            className={action}
            disabled={working}
            onClick={() => exportItems(items, "export")}
            size="sm"
            type="button"
            variant="outline"
          >
            <Download /> Export
          </Button>
          <Button
            className={action}
            disabled={working || (dashboard && items.length >= 3)}
            onClick={() =>
              setEditing({ id: crypto.randomUUID(), name: "New item", url: "/", icon: "Navigation", visible: true })
            }
            size="sm"
            type="button"
            variant="outline"
          >
            {iconMap.Plus} Add item
          </Button>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-sm bg-amber-100 p-2 text-xs">
          <span>{selected.length} selected</span>
          <div className="flex gap-2">
            <Button
              className={action}
              disabled={working}
              onClick={() =>
                exportItems(
                  items.filter((item) => selected.includes(item.id)),
                  "bulk-export",
                )
              }
              size="sm"
              type="button"
              variant="outline"
            >
              <Download /> Bulk Export
            </Button>
            <Button
              className={action}
              disabled={working}
              onClick={() => void remove(selected)}
              size="sm"
              type="button"
              variant="destructive"
            >
              {iconMap.Trash2} Delete
            </Button>
          </div>
        </div>
      )}
      <div className="grid gap-2">
        {items.map((item) => (
          <article
            className="flex min-w-0 items-center gap-2 rounded-sm border border-stone-100 bg-[#fffaf0] p-2"
            key={item.id}
          >
            <input
              aria-label={`Select ${item.name}`}
              checked={selected.includes(item.id)}
              className="cursor-pointer"
              disabled={working}
              onChange={() => select(item.id)}
              type="checkbox"
            />
            <span className="shrink-0">{iconMap[item.icon] ?? iconMap.Navigation}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={item.name}>
                {item.name}
              </p>
              <p
                className="truncate text-xs text-stone-500"
                title={`${item.url} · ${item.visible === false ? "Hidden" : "Visible"}`}
              >
                {item.url} · {item.visible === false ? "Hidden" : "Visible"}
              </p>
            </div>
            <Button
              aria-label={`View ${item.name}`}
              className={action}
              disabled={working}
              onClick={() => setViewing(item)}
              size="sm"
              title="View"
              type="button"
              variant="outline"
            >
              <Eye />
            </Button>
            <Button
              aria-label={`Edit ${item.name}`}
              className={action}
              disabled={working}
              onClick={() => setEditing({ ...item })}
              size="sm"
              title="Edit"
              type="button"
              variant="outline"
            >
              {iconMap.Edit2}
            </Button>
            <Button
              aria-label={`Delete ${item.name}`}
              className={action}
              disabled={working}
              onClick={() => void remove([item.id])}
              size="sm"
              title="Delete"
              type="button"
              variant="destructive"
            >
              {iconMap.Trash2}
            </Button>
          </article>
        ))}
      </div>
      {viewing && <ItemDialog close={() => setViewing(null)} item={viewing} />}
      {editing && (
        <EditDialog
          busy={working}
          close={() => setEditing(null)}
          editing={editing}
          iconsOpen={iconsOpen}
          items={items}
          persist={persist}
          setEditing={setEditing}
          setIconsOpen={setIconsOpen}
        />
      )}
    </section>
  );
}

function NavigationPreview({
  config,
  dashboard,
}: {
  config: NavigationData["user"] | NavigationData["dashboard"];
  dashboard: boolean;
}) {
  const count = dashboard ? 4 : (config as NavigationData["user"]).iconCount;
  const items = config.items.filter((item) => item.visible !== false).slice(0, dashboard ? 3 : count);
  const radius =
    config.radius === "none" ? "0" : config.radius === "sm" ? "4px" : config.radius === "xl" ? "16px" : "9999px";
  const color = `${config.background}${Math.round(config.transparency * 2.55)
    .toString(16)
    .padStart(2, "0")}`;
  return (
    <aside className="min-w-0 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Live preview</h2>
        <span className="text-xs text-stone-500">{count} icons</span>
      </div>
      <div className="mx-auto flex min-h-64 max-w-sm items-end rounded-sm border border-[#eadfca] bg-white p-3 shadow-inner">
        <nav
          aria-label={`${dashboard ? "Dashboard" : "User"} navigation preview`}
          className="grid w-full text-center"
          style={{
            background: color,
            borderRadius: radius,
            color: config.foreground,
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
            marginBottom: config.marginBottom,
            padding: `${config.paddingY}px ${config.paddingX}px`,
          }}
        >
          {items.map((item, index) => {
            const elevated = !dashboard && count === 5 && index === 2;
            const Icon = iconMap[item.icon] ?? iconMap.Navigation;
            return (
              <div
                className={`grid min-w-0 place-items-center gap-1 text-[10px] font-medium ${elevated ? "-translate-y-4" : ""}`}
                key={item.id}
              >
                <span
                  className={
                    elevated ? "grid h-11 w-11 place-items-center rounded-full bg-amber-100 ring-4 ring-[#fffaf0]" : ""
                  }
                >
                  {Icon}
                </span>
                <span className="w-full truncate px-0.5" title={item.name}>
                  {item.name}
                </span>
              </div>
            );
          })}
          {dashboard && (
            <div className="grid min-w-0 place-items-center gap-1 text-[10px] font-medium">
              <span>{iconMap.Settings}</span>
              <span className="w-full truncate px-0.5">Settings</span>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}

function EditDialog({
  busy,
  close,
  editing,
  iconsOpen,
  items,
  persist,
  setEditing,
  setIconsOpen,
}: {
  busy: boolean;
  close: () => void;
  editing: Item;
  iconsOpen: boolean;
  items: Item[];
  persist: () => Promise<void>;
  setEditing: (item: Item) => void;
  setIconsOpen: (open: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-white p-4 shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-3">
          <b className="truncate">{items.some((item) => item.id === editing.id) ? "Edit" : "Add"} navigation item</b>
          <Button
            aria-label="Close"
            className={action}
            disabled={busy}
            onClick={close}
            size="sm"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        </header>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Label name="Name">
            <input
              className={field}
              disabled={busy}
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              value={editing.name}
            />
          </Label>
          <Label name="Path">
            <input
              className={field}
              disabled={busy}
              onChange={(event) => setEditing({ ...editing, url: event.target.value })}
              value={editing.url}
            />
          </Label>
          <Label name="Icon">
            <Button
              className={action}
              disabled={busy}
              onClick={() => setIconsOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              {iconMap[editing.icon] ?? iconMap.Navigation} Choose icon
            </Button>
          </Label>
          <label className="flex items-center justify-between text-sm font-medium">
            Visible
            <Switch
              checked={editing.visible !== false}
              className="cursor-pointer"
              disabled={busy}
              onCheckedChange={(visible) => setEditing({ ...editing, visible })}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button className={action} disabled={busy} onClick={close} size="sm" type="button" variant="outline">
            Cancel
          </Button>
          <Button className={action} disabled={busy} onClick={() => void persist()} size="sm" type="button">
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
        {iconsOpen && (
          <IconDialog
            close={() => setIconsOpen(false)}
            select={(icon) => {
              setEditing({ ...editing, icon });
              setIconsOpen(false);
            }}
          />
        )}
      </section>
    </div>
  );
}
function ItemDialog({ close, item }: { close: () => void; item: Item }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-white p-4 shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-3">
          <b className="truncate">Navigation details</b>
          <Button aria-label="Close" className={action} onClick={close} size="sm" type="button" variant="ghost">
            <X />
          </Button>
        </header>
        <dl className="mt-4 divide-y rounded-sm border text-sm">
          <Detail label="Name" value={item.name} />
          <Detail label="Path" value={item.url} />
          <Detail label="Icon" value={item.icon} />
          <Detail label="Visible" value={item.visible === false ? "Hidden" : "Visible"} />
        </dl>
        <div className="mt-4 flex justify-end">
          <Button className={action} onClick={close} size="sm" type="button" variant="outline">
            Close
          </Button>
        </div>
      </section>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <dt className="font-medium text-stone-600">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}
function Toast({ notice }: { notice: Exclude<Notice, null> }) {
  return (
    <div
      className={`fixed right-4 top-4 z-[100] max-w-[calc(100vw-2rem)] rounded-sm px-3 py-2 text-sm shadow-lg ${notice.error ? "bg-red-700 text-white" : "bg-emerald-100 text-emerald-900"}`}
      role="status"
    >
      {notice.text}
    </div>
  );
}
function LoadingPage() {
  return (
    <main className="grid flex-1 place-items-center bg-[#fffaf0] p-6">
      <div className="grid min-w-52 place-items-center rounded-sm border border-[#eadfca] bg-white px-7 py-6 shadow-xl">
        <RefreshCw className="h-7 w-7 animate-spin text-amber-700" />
        <p className="mt-3 text-sm font-semibold text-stone-800">Loading navigation</p>
      </div>
    </main>
  );
}
function NavigationLoader() {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#fffaf0]/70 p-4 backdrop-blur-sm" role="status">
      <div className="grid min-w-52 place-items-center rounded-sm border border-[#eadfca] bg-white px-7 py-6 shadow-xl">
        <RefreshCw className="h-7 w-7 animate-spin text-amber-700" />
        <p className="mt-3 text-sm font-semibold">Updating navigation</p>
      </div>
    </div>
  );
}
function Label({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-stone-600">
      <span>{name}</span>
      {children}
    </label>
  );
}
function IconDialog({ close, select }: { close: () => void; select: (icon: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b p-3">
          <b>Choose icon</b>
          <Button
            aria-label="Close icon selector"
            className={action}
            onClick={close}
            size="sm"
            type="button"
            variant="ghost"
          >
            ×
          </Button>
        </header>
        <div className="max-h-[65vh] overflow-y-auto p-3">
          <input
            className={field}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons"
            value={query}
          />
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
            {icons
              .filter((icon) => icon.toLowerCase().includes(query.toLowerCase()))
              .map((icon) => (
                <Button
                  aria-label={`Use ${icon}`}
                  className={action}
                  key={icon}
                  onClick={() => select(icon)}
                  size="sm"
                  title={icon}
                  type="button"
                  variant="outline"
                >
                  {iconMap[icon]}
                  <span className="sr-only">{icon}</span>
                </Button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
