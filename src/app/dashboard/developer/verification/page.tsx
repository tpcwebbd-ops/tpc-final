/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

"use client";

import { Check, ChevronLeft, ChevronRight, Download, Eye, Pencil, RefreshCw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { downloadVerificationZip } from "@/lib/verification-export";
import {
  type VerificationItem,
  useDeleteVerificationMutation,
  useDeleteVerificationsMutation,
  useGetVerificationsQuery,
  useUpdateVerificationMutation,
} from "@/redux/features/dashboard/verifications/verificationsSlice";

const pageSizeOptions = [10, 25, 50, 100];

export default function DeveloperVerificationPage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data, error, isFetching, isLoading, refetch } = useGetVerificationsQuery(
    { page, limit: pageSize, ...(search ? { q: search } : {}) },
    { skip: !session },
  );
  const [updateVerification, updateState] = useUpdateVerificationMutation();
  const [deleteVerification] = useDeleteVerificationMutation();
  const [deleteVerifications] = useDeleteVerificationsMutation();
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<VerificationItem | null>(null);
  const [viewing, setViewing] = useState<VerificationItem | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const items = useMemo(() => data?.verifications ?? [], [data]);
  const total = data?.total ?? 0;
  const visible = items;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const allSelected = visible.length > 0 && visible.every((item) => selected.includes(item.id));
  const loading = isLoading || isFetching || actionLoading;
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(
      () => setToast({ text: apiError(error, "Could not load verifications."), error: true }),
      0,
    );
    return () => clearTimeout(timer);
  }, [error]);
  async function refresh() {
    try {
      await refetch().unwrap();
      setSelected([]);
      setPage(1);
      tell("Verifications refreshed successfully.");
    } catch (cause) {
      tell(apiError(cause, "Could not load verifications."), true);
    }
  }
  const select = (id: string) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]));
  const selectVisible = () => {
    const ids = visible.map((item) => item.id);
    setSelected((current) =>
      allSelected ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])],
    );
  };
  const tell = (text: string, error = false) => setToast({ text, error });
  async function remove(ids: string[]) {
    if (
      !ids.length ||
      !(await confirmDelete(`Delete ${ids.length} verification${ids.length === 1 ? "" : "s"}? This cannot be undone.`))
    )
      return;
    setActionLoading(true);
    try {
      if (ids.length === 1) await deleteVerification(ids[0]).unwrap();
      else await deleteVerifications(ids).unwrap();
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      tell(`${ids.length} verification${ids.length === 1 ? "" : "s"} deleted successfully.`);
    } catch (cause) {
      tell(apiError(cause, "Could not delete verifications."), true);
    } finally {
      setActionLoading(false);
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing?.expiresAt) return;
    try {
      await updateVerification(editing).unwrap();
      setEditing(null);
      tell("Verification updated successfully.");
    } catch (cause) {
      tell(apiError(cause, "Could not update verification."), true);
    }
  }
  function exportRows(rows: VerificationItem[], kind: "export" | "bulk-export") {
    if (!rows.length) return tell("Select at least one verification to export.", true);
    try {
      downloadVerificationZip(rows, kind);
      tell(`${rows.length} verification${rows.length === 1 ? "" : "s"} exported successfully.`);
    } catch {
      tell("Could not create the export file.", true);
    }
  }
  if (sessionPending)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <Loader label="Preparing your workspace" />
      </main>
    );
  if (!session)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <Link
          className="cursor-pointer rounded-sm bg-stone-900 px-4 py-3 text-sm font-semibold text-white"
          href="/login"
        >
          Sign in required
        </Link>
      </main>
    );
  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      {loading && <Loader label={actionLoading ? "Saving your changes" : "Updating verifications"} overlay />}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[60] rounded-sm px-4 py-3 text-sm text-white shadow-lg ${toast.error ? "bg-red-700" : "bg-emerald-700"}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
      <div className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.35)] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Verification</h1>
            <p className="mt-1 text-sm text-stone-500">
              {total} verification{total === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="flex gap-2">
            <Small icon={<Download />} onClick={() => exportRows(items, "export")}>
              Export
            </Small>
            <Small
              disabled={loading}
              icon={<RefreshCw className={isFetching ? "animate-spin" : ""} />}
              onClick={() => void refresh()}
            >
              Refresh
            </Small>
          </div>
        </div>
        <div className="relative mt-5">
          <label className="sr-only" htmlFor="verification-search">
            Search verifications
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            className="w-full rounded-sm border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-600"
            id="verification-search"
            onChange={(event) => {
              setSearchInput(event.target.value);
              setSelected([]);
              setPage(1);
            }}
            placeholder="Search by type, identifier, or ID"
            type="search"
            value={searchInput}
          />
        </div>
        {selected.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-amber-100 px-3 py-2">
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
              <Small danger icon={<Trash2 />} onClick={() => void remove(selected)}>
                Delete
              </Small>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
            {apiError(error, "Could not load verifications.")}
          </p>
        )}
        <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] table-fixed text-left text-sm">
              <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                <tr>
                  <th className="w-12 p-3">
                    <input
                      aria-label="Select verifications on this page"
                      checked={allSelected}
                      className="cursor-pointer"
                      onChange={selectVisible}
                      type="checkbox"
                    />
                  </th>
                  <th className="w-[18%] p-3">Type</th>
                  <th className="w-[26%] p-3">Identifier</th>
                  <th className="w-[18%] p-3">Created</th>
                  <th className="w-[18%] p-3">Expires</th>
                  <th className="w-32 p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr className="border-t border-stone-100 hover:bg-amber-50/40" key={item.id}>
                    <td className="p-3">
                      <input
                        aria-label={`Select ${item.id}`}
                        checked={selected.includes(item.id)}
                        className="cursor-pointer"
                        onChange={() => select(item.id)}
                        type="checkbox"
                      />
                    </td>
                    <Cell value={item.type} />
                    <Cell value={item.identifier || "—"} />
                    <Cell value={date(item.createdAt)} />
                    <Cell value={date(item.expiresAt)} />
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Icon label="View verification" onClick={() => setViewing(item)}>
                          <Eye />
                        </Icon>
                        <Icon label="Edit verification" onClick={() => setEditing({ ...item })}>
                          <Pencil />
                        </Icon>
                        <Icon danger label="Delete verification" onClick={() => void remove([item.id])}>
                          <Trash2 />
                        </Icon>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {visible.map((item) => (
              <article className="min-w-0 rounded-sm border border-stone-200 p-3" key={item.id}>
                <div className="flex justify-between gap-2">
                  <label className="min-w-0 truncate text-sm font-semibold" title={item.type}>
                    <input
                      checked={selected.includes(item.id)}
                      className="mr-2 cursor-pointer"
                      onChange={() => select(item.id)}
                      type="checkbox"
                    />
                    {item.type}
                  </label>
                  <div className="flex gap-1">
                    <Icon label="View verification" onClick={() => setViewing(item)}>
                      <Eye />
                    </Icon>
                    <Icon label="Edit verification" onClick={() => setEditing({ ...item })}>
                      <Pencil />
                    </Icon>
                    <Icon danger label="Delete verification" onClick={() => void remove([item.id])}>
                      <Trash2 />
                    </Icon>
                  </div>
                </div>
                <p className="mt-3 truncate text-xs text-stone-500" title={item.identifier}>
                  {item.identifier || "—"}
                </p>
                <p className="mt-1 truncate text-xs text-stone-500" title={date(item.expiresAt)}>
                  {date(item.expiresAt)}
                </p>
              </article>
            ))}
          </div>
          {!loading && !items.length && (
            <p className="p-8 text-center text-sm text-stone-500">
              {search ? "No matching verifications found." : "No verifications found."}
            </p>
          )}
        </div>
        {total > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
            <label className="flex items-center gap-2">
              Items per page
              <select
                className="cursor-pointer rounded-sm border border-stone-200 p-1.5"
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                value={pageSize}
              >
                {pageSizeOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              Page {page} of {pages}
              <Icon disabled={page === 1} label="Previous page" onClick={() => setPage((value) => value - 1)}>
                <ChevronLeft />
              </Icon>
              <Icon disabled={page === pages} label="Next page" onClick={() => setPage((value) => value + 1)}>
                <ChevronRight />
              </Icon>
            </div>
          </div>
        )}
      </div>
      {viewing && <View item={viewing} onClose={() => setViewing(null)} />}
      {editing && (
        <Edit
          item={editing}
          loading={updateState.isLoading}
          onClose={() => setEditing(null)}
          onSave={save}
          setItem={setEditing}
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
      className={`inline-flex cursor-pointer items-center justify-center rounded-sm border p-1.5 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-red-100 text-red-700" : "border-stone-200 text-stone-600 hover:bg-amber-100"}`}
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
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-red-700 bg-red-700 text-white" : "border-[#eadfca] bg-[#fffaf0] text-stone-700 hover:bg-amber-100"}`}
      type="button"
      {...props}
    >
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {children}
    </button>
  );
}
function View({ item, onClose }: { item: VerificationItem; onClose: () => void }) {
  const fields = [
    ["ID", item.id],
    ["Type", item.type],
    ["Identifier", item.identifier || "—"],
    ["Created at", date(item.createdAt)],
    ["Expires at", date(item.expiresAt)],
    ["Updated at", date(item.updatedAt)],
  ];
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Verification details</h2>
          <Icon label="Close" onClick={onClose}>
            <X />
          </Icon>
        </div>
        <dl className="mt-5 divide-y rounded-sm border bg-white">
          {fields.map(([label, value]) => (
            <div className="grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3" key={label}>
              <dt className="font-medium text-stone-600">{label}</dt>
              <dd className="break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex justify-end">
          <Small icon={<X />} onClick={onClose}>
            Close
          </Small>
        </div>
      </section>
    </div>
  );
}
function Edit({
  item,
  setItem,
  onClose,
  onSave,
  loading,
}: {
  item: VerificationItem;
  setItem: (item: VerificationItem) => void;
  onClose: () => void;
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm">
      <form
        aria-modal="true"
        className="w-full max-w-md rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={onSave}
        role="dialog"
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Edit verification</h2>
          <Icon label="Close" onClick={onClose}>
            <X />
          </Icon>
        </div>
        <label className="mt-5 block text-sm font-medium">
          Expires
          <input
            className="mt-1.5 w-full rounded-sm border bg-white px-3 py-2.5"
            disabled={loading}
            onChange={(event) =>
              setItem({ ...item, expiresAt: event.target.value ? new Date(event.target.value).toISOString() : null })
            }
            required
            type="datetime-local"
            value={inputDate(item.expiresAt)}
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Small disabled={loading} icon={<X />} onClick={onClose}>
            Cancel
          </Small>
          <Small disabled={loading} icon={<Check />}>
            {loading ? "Saving..." : "Save"}
          </Small>
        </div>
      </form>
    </div>
  );
}
function Loader({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <div
      className={overlay ? "fixed inset-0 z-[55] grid place-items-center bg-[#fffaf0]/75 backdrop-blur-sm" : "p-4"}
      role="status"
    >
      <div className="grid min-w-56 place-items-center rounded-sm border border-[#eadfca] bg-white px-8 py-7 shadow-xl">
        <div className="grid h-14 w-14 place-items-center">
          <span className="absolute h-14 w-14 animate-ping rounded-full border border-amber-300" />
          <RefreshCw className="h-6 w-6 animate-spin text-amber-700" />
        </div>
        <p className="mt-4 text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}
function date(value: string | null) {
  return value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";
}
function inputDate(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
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
