/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

"use client";

import { Check, Download, Eye, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { Switch } from "@/components/ui/switch";
import { downloadTrackingZip } from "@/lib/tracking-export";
import {
  type TrackingItem,
  type TrackingProvider,
  useCreateTrackingMutation,
  useDeleteTrackingMutation,
  useDeleteTrackingsMutation,
  useGetTrackingQuery,
  useUpdateTrackingMutation,
} from "@/redux/features/dashboard/tracking/trackingSlice";

const providers: { id: TrackingProvider; name: string; hint: string }[] = [
  { id: "facebook", name: "Facebook Pixel", hint: "Pixel ID" },
  { id: "gtm", name: "Google Tag Manager", hint: "GTM-XXXX" },
  { id: "ga4", name: "Google Analytics 4", hint: "G-XXXX" },
  { id: "tiktok", name: "TikTok Pixel", hint: "Pixel ID" },
];
type Draft = { provider: TrackingProvider; pixelId: string; enabled: boolean };
type Notice = { text: string; error?: boolean };
const blank = (provider: TrackingProvider): Draft => ({ provider, pixelId: "", enabled: true });

export default function TrackingPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data, error, isFetching, isLoading, refetch } = useGetTrackingQuery(undefined, { skip: !session });
  const [create, createState] = useCreateTrackingMutation();
  const [update, updateState] = useUpdateTrackingMutation();
  const [remove, removeState] = useDeleteTrackingMutation();
  const [removeMany, removeManyState] = useDeleteTrackingsMutation();
  const [selected, setSelected] = useState<string[]>([]);
  const [viewing, setViewing] = useState<TrackingItem | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<string[] | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [exporting, setExporting] = useState(false);
  const items = useMemo(() => data?.items ?? [], [data]);
  const allSelected = items.length > 0 && items.every((item) => selected.includes(item.id));
  const saving = createState.isLoading || updateState.isLoading;
  const deletingBusy = removeState.isLoading || removeManyState.isLoading;
  const loading = isLoading || isFetching || saving || deletingBusy || exporting;
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const tell = (text: string, error = false) => setNotice({ text, error });
  const toggle = (id: string) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]));
  const selectAll = () => setSelected(allSelected ? [] : items.map((item) => item.id));
  async function save() {
    if (!editing) return;
    try {
      const existing = items.find((item) => item.provider === editing.provider);
      if (existing)
        await update({ id: existing.id, pixelId: editing.pixelId.trim(), enabled: editing.enabled }).unwrap();
      else await create(editing).unwrap();
      setEditing(null);
      tell(existing ? "Tracking ID updated successfully." : "Tracking ID saved successfully.");
    } catch (cause) {
      tell(apiError(cause, "Could not save tracking ID."), true);
    }
  }
  async function destroy() {
    const ids = deleting ?? [];
    if (!ids.length) return;
    try {
      if (ids.length === 1) await remove(ids[0]).unwrap();
      else await removeMany(ids).unwrap();
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      setDeleting(null);
      tell(`${ids.length} tracking record${ids.length === 1 ? "" : "s"} deleted successfully.`);
    } catch (cause) {
      tell(apiError(cause, "Could not delete tracking records."), true);
    }
  }
  function exportRows(rows: TrackingItem[], kind: "export" | "bulk-export") {
    if (!rows.length) return tell("Select at least one tracking record to export.", true);
    setExporting(true);
    try {
      downloadTrackingZip(rows, kind);
      tell(`${rows.length} tracking record${rows.length === 1 ? "" : "s"} exported successfully.`);
    } catch {
      tell("Could not create the export file.", true);
    } finally {
      setExporting(false);
    }
  }
  async function changeEnabled(item: TrackingItem, enabled: boolean) {
    try {
      await update({ id: item.id, pixelId: item.pixelId, enabled }).unwrap();
      tell("Tracking status updated successfully.");
    } catch (cause) {
      tell(apiError(cause, "Could not update tracking status."), true);
    }
  }
  if (sessionPending) return <PageLoader label="Preparing your workspace" />;
  if (!session)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0] p-4">
        <Link
          className="cursor-pointer rounded-sm bg-stone-900 px-4 py-3 text-sm font-semibold text-white"
          href="/login"
        >
          Sign in required
        </Link>
      </main>
    );
  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      {loading && (
        <PageLoader
          label={
            exporting
              ? "Preparing your export"
              : deletingBusy
                ? "Removing tracking records"
                : saving
                  ? "Saving your changes"
                  : "Updating tracking"
          }
          overlay
        />
      )}{" "}
      {notice && (
        <div
          className={`fixed right-4 top-4 z-[100] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-xl ${notice.error ? "bg-red-700" : "bg-emerald-700"}`}
          role="status"
        >
          {notice.text}
        </div>
      )}
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-stone-900">Tracking</h1>
            <p className="mt-1 text-sm text-stone-600">
              Manage provider IDs. No public tracking scripts are added here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Small icon={<Download />} onClick={() => exportRows(items, "export")}>
              Export
            </Small>
            <Small
              disabled={loading}
              icon={<RefreshCw className={isFetching ? "animate-spin" : ""} />}
              onClick={() =>
                void refetch()
                  .unwrap()
                  .then(() => tell("Tracking refreshed successfully."))
                  .catch((cause) => tell(apiError(cause, "Could not refresh tracking."), true))
              }
            >
              Refresh
            </Small>
          </div>
        </div>
        {selected.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-amber-100 p-3">
            <span className="text-sm font-medium text-amber-900">{selected.length} selected</span>
            <div className="flex gap-2">
              <Small
                icon={<Download />}
                onClick={() =>
                  exportRows(
                    items.filter((item) => selected.includes(item.id)),
                    "bulk-export",
                  )
                }
              >
                Bulk Export
              </Small>
              <Small danger icon={<Trash2 />} onClick={() => setDeleting(selected)}>
                Delete
              </Small>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
            {apiError(error, "Could not load tracking IDs.")}
          </p>
        )}
        <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] table-fixed text-left text-sm">
              <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                <tr>
                  <th className="w-12 p-3">
                    <input
                      aria-label="Select all tracking records"
                      checked={allSelected}
                      className="cursor-pointer"
                      onChange={selectAll}
                      type="checkbox"
                    />
                  </th>
                  <th className="w-[24%] p-3">Provider</th>
                  <th className="w-[27%] p-3">Tracking ID</th>
                  <th className="w-[16%] p-3">Status</th>
                  <th className="w-[18%] p-3">Updated</th>
                  <th className="w-36 p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => {
                  const item = items.find((value) => value.provider === provider.id);
                  return (
                    <tr className="border-t border-stone-100 hover:bg-amber-50/40" key={provider.id}>
                      {item ? (
                        <>
                          <td className="p-3">
                            <input
                              aria-label={`Select ${provider.name}`}
                              checked={selected.includes(item.id)}
                              className="cursor-pointer"
                              onChange={() => toggle(item.id)}
                              type="checkbox"
                            />
                          </td>
                          <Cell value={provider.name} />
                          <Cell value={item.pixelId} />
                          <td className="p-3">
                            <Switch
                              aria-label={`Enable ${provider.name}`}
                              checked={item.enabled}
                              className="cursor-pointer"
                              disabled={saving}
                              onCheckedChange={(enabled) => void changeEnabled(item, enabled)}
                            />
                          </td>
                          <Cell value={date(item.updatedAt)} />
                          <td className="p-3">
                            <div className="flex justify-end gap-1">
                              <Icon label={`View ${provider.name}`} onClick={() => setViewing(item)}>
                                <Eye />
                              </Icon>
                              <Icon
                                label={`Edit ${provider.name}`}
                                onClick={() =>
                                  setEditing({ provider: item.provider, pixelId: item.pixelId, enabled: item.enabled })
                                }
                              >
                                <Pencil />
                              </Icon>
                              <Icon danger label={`Delete ${provider.name}`} onClick={() => setDeleting([item.id])}>
                                <Trash2 />
                              </Icon>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3" />
                          <Cell value={provider.name} />
                          <Cell value="Not saved" />
                          <td className="p-3 text-stone-500">—</td>
                          <td className="p-3 text-stone-500">—</td>
                          <td className="p-3 text-right">
                            <Small icon={<Plus />} onClick={() => setEditing(blank(provider.id))}>
                              Add
                            </Small>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {providers.map((provider) => {
              const item = items.find((value) => value.provider === provider.id);
              return (
                <article className="min-w-0 rounded-sm border border-stone-200 bg-white p-3" key={provider.id}>
                  <div className="flex items-start justify-between gap-2">
                    <label className="min-w-0 truncate text-sm font-semibold" title={provider.name}>
                      {item && (
                        <input
                          aria-label={`Select ${provider.name}`}
                          checked={selected.includes(item.id)}
                          className="mr-2 cursor-pointer"
                          onChange={() => toggle(item.id)}
                          type="checkbox"
                        />
                      )}
                      {provider.name}
                    </label>
                    {item ? (
                      <div className="flex gap-1">
                        <Icon label={`View ${provider.name}`} onClick={() => setViewing(item)}>
                          <Eye />
                        </Icon>
                        <Icon
                          label={`Edit ${provider.name}`}
                          onClick={() =>
                            setEditing({ provider: item.provider, pixelId: item.pixelId, enabled: item.enabled })
                          }
                        >
                          <Pencil />
                        </Icon>
                        <Icon danger label={`Delete ${provider.name}`} onClick={() => setDeleting([item.id])}>
                          <Trash2 />
                        </Icon>
                      </div>
                    ) : (
                      <Small icon={<Plus />} onClick={() => setEditing(blank(provider.id))}>
                        Add
                      </Small>
                    )}
                  </div>
                  <p className="mt-3 truncate text-xs text-stone-500" title={item?.pixelId}>
                    {item?.pixelId || "Not saved"}
                  </p>
                  {item && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-stone-500">{date(item.updatedAt)}</span>
                      <Switch
                        aria-label={`Enable ${provider.name}`}
                        checked={item.enabled}
                        className="cursor-pointer"
                        disabled={saving}
                        onCheckedChange={(enabled) => void changeEnabled(item, enabled)}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {!items.length && (
            <p className="p-8 text-center text-sm text-stone-500">
              No tracking IDs saved yet. Add one for a provider to begin.
            </p>
          )}
        </div>
      </section>
      {viewing && <ViewModal item={viewing} close={() => setViewing(null)} />}
      {editing && (
        <EditModal
          draft={editing}
          saving={saving}
          close={() => setEditing(null)}
          save={() => void save()}
          setDraft={setEditing}
        />
      )}
      {deleting && (
        <DeleteModal
          count={deleting.length}
          busy={deletingBusy}
          close={() => setDeleting(null)}
          confirm={() => void destroy()}
        />
      )}
    </main>
  );
}
function Cell({ value }: { value: string }) {
  return (
    <td className="truncate p-3 text-stone-600" title={value}>
      {value}
    </td>
  );
}
function Icon({
  children,
  danger,
  label,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; danger?: boolean; label: string }) {
  return (
    <button
      aria-label={label}
      className={`inline-flex cursor-pointer items-center justify-center rounded-sm border p-1.5 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-red-100 text-red-700 hover:bg-red-50" : "border-stone-200 text-stone-600 hover:bg-amber-100"}`}
      type="button"
      {...props}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{children}</span>
    </button>
  );
}
function Small({
  children,
  danger,
  icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  danger?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-red-700 bg-red-700 text-white" : "border-[#eadfca] bg-[#fffaf0] text-stone-700 hover:bg-amber-100"}`}
      type="button"
      {...props}
    >
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {children}
    </button>
  );
}
function ViewModal({ item, close }: { item: TrackingItem; close: () => void }) {
  const values = [
    ["ID", item.id],
    ["Provider", providers.find((provider) => provider.id === item.provider)?.name ?? item.provider],
    ["Tracking ID", item.pixelId],
    ["Status", item.enabled ? "Enabled" : "Disabled"],
    ["Created at", date(item.createdAt)],
    ["Updated at", date(item.updatedAt)],
  ];
  return (
    <Modal title="Tracking details" close={close}>
      <dl className="divide-y rounded-sm border bg-white">
        {values.map(([label, value]) => (
          <div className="grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3" key={label}>
            <dt className="font-medium text-stone-600">{label}</dt>
            <dd className="break-words text-stone-900">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex justify-end">
        <Small icon={<X />} onClick={close}>
          Close
        </Small>
      </div>
    </Modal>
  );
}
function EditModal({
  draft,
  close,
  save,
  saving,
  setDraft,
}: {
  draft: Draft;
  close: () => void;
  save: () => void;
  saving: boolean;
  setDraft: (draft: Draft) => void;
}) {
  const provider = providers.find((item) => item.id === draft.provider);
  return (
    <Modal title={`${draft.pixelId ? "Edit" : "Add"} ${provider?.name ?? "tracking"}`} close={close}>
      <label className="block text-sm font-medium text-stone-700">
        Tracking ID
        <input
          autoFocus
          className="mt-1.5 w-full rounded-sm border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500"
          disabled={saving}
          maxLength={150}
          onChange={(event) => setDraft({ ...draft, pixelId: event.target.value })}
          placeholder={provider?.hint}
          value={draft.pixelId}
        />
      </label>
      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-sm border border-stone-200 bg-white p-3 text-sm font-medium">
        Enabled
        <Switch
          checked={draft.enabled}
          disabled={saving}
          onCheckedChange={(enabled) => setDraft({ ...draft, enabled })}
        />
      </label>
      <div className="mt-5 flex justify-end gap-2">
        <Small disabled={saving} icon={<X />} onClick={close}>
          Cancel
        </Small>
        <Small disabled={saving || !draft.pixelId.trim()} icon={<Check />} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </Small>
      </div>
    </Modal>
  );
}
function DeleteModal({
  count,
  busy,
  close,
  confirm,
}: {
  count: number;
  busy: boolean;
  close: () => void;
  confirm: () => void;
}) {
  return (
    <Modal title={`Delete ${count} tracking record${count === 1 ? "" : "s"}`} close={busy ? () => undefined : close}>
      <p className="text-sm text-stone-600">
        This will permanently remove the selected tracking record{count === 1 ? "" : "s"}. This action cannot be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Small disabled={busy} icon={<X />} onClick={close}>
          Cancel
        </Small>
        <Small danger disabled={busy} icon={<Trash2 />} onClick={confirm}>
          {busy ? "Deleting…" : "Delete"}
        </Small>
      </div>
    </Modal>
  );
}
function Modal({ children, close, title }: { children: React.ReactNode; close: () => void; title: string }) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 shadow-2xl sm:p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <Icon label="Close modal" onClick={close}>
            <X />
          </Icon>
        </header>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
function PageLoader({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <main
      className={
        overlay
          ? "fixed inset-0 z-[80] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm"
          : "flex flex-1 items-center justify-center bg-[#fffaf0] p-4"
      }
      role="status"
    >
      <div className="grid min-w-56 place-items-center rounded-sm border border-[#eadfca] bg-white px-8 py-7 shadow-xl">
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute h-14 w-14 animate-ping rounded-full border border-amber-300" />
          <span className="absolute h-10 w-10 animate-[spin_1.1s_linear_infinite] rounded-full border-2 border-amber-200 border-t-amber-700" />
          <RefreshCw className="h-5 w-5 text-amber-700" />
        </div>
        <p className="mt-4 text-sm font-semibold text-stone-800">{label}</p>
      </div>
    </main>
  );
}
function date(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
function apiError(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data &&
    "error" in error.data &&
    typeof error.data.error === "string"
    ? error.data.error
    : fallback;
}
