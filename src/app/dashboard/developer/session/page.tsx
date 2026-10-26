/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { Check, ChevronLeft, ChevronRight, Download, Eye, Pencil, RefreshCw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import {
  type SessionItem,
  useDeleteSessionMutation,
  useDeleteSessionsMutation,
  useGetSessionsQuery,
  useUpdateSessionMutation,
} from "@/redux/features/dashboard/sessions/sessionsSlice";
const pageSizeOptions = [10, 25, 50, 100];
type Toast = { text: string; type: "success" | "error" };

export default function DeveloperSessionPage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<Record<string, SessionItem>>({});
  const [editing, setEditing] = useState<SessionItem | null>(null);
  const [viewing, setViewing] = useState<SessionItem | null>(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const {
    data: sessionsData,
    error: sessionsError,
    isFetching,
    isLoading,
    refetch,
  } = useGetSessionsQuery({ page, limit: pageSize, ...(search ? { q: search } : {}) }, { skip: !session });
  const [updateSession, { isLoading: saving }] = useUpdateSessionMutation();
  const [deleteSession, { isLoading: deletingOne }] = useDeleteSessionMutation();
  const [deleteSessions, { isLoading: deletingMany }] = useDeleteSessionsMutation();
  const sessions = useMemo(() => sessionsData?.sessions ?? [], [sessionsData]);
  const loading = isLoading || isFetching;
  const deleting = deletingOne || deletingMany;
  const pageBusy = loading || saving || deleting || exporting;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    if (!sessionsError) return;
    const timer = window.setTimeout(
      () => setToast({ text: getErrorMessage(sessionsError, "Could not load sessions."), type: "error" }),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [sessionsError]);

  function showError(error: string) {
    setMessage(error);
    setToast({ text: error, type: "error" });
  }
  async function loadSessions() {
    setMessage("");
    try {
      await refetch().unwrap();
      setSelected([]);
      setSelectedSessions({});
      setPage(1);
      setToast({ text: "Sessions refreshed successfully.", type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not load sessions."));
    }
  }

  const total = sessionsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleSessions = sessions;
  const showPagination = total > 0;
  const allVisibleSelected = visibleSessions.length > 0 && visibleSessions.every((item) => selected.includes(item.id));

  async function removeSessions(ids: string[]) {
    if (!ids.length || !(await confirmDelete(`Delete ${ids.length} session${ids.length === 1 ? "" : "s"}?`))) return;
    try {
      if (ids.length === 1) await deleteSession(ids[0]).unwrap();
      else await deleteSessions(ids).unwrap();
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      setSelectedSessions((current) => {
        const next = { ...current };
        ids.forEach((id) => delete next[id]);
        return next;
      });
      setMessage("");
      setToast({ text: `${ids.length} session${ids.length === 1 ? "" : "s"} deleted successfully.`, type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not delete sessions."));
    }
  }

  async function saveSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing?.expiresAt) return;
    try {
      await updateSession(editing).unwrap();
      setMessage("");
      setEditing(null);
      setSelectedSessions((current) => (current[editing.id] ? { ...current, [editing.id]: editing } : current));
      setToast({ text: "Session updated successfully.", type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not update session."));
    }
  }

  function toggleSelection(item: SessionItem) {
    setSelected((current) =>
      current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
    );
    setSelectedSessions((current) => {
      if (current[item.id]) {
        const next = { ...current };
        delete next[item.id];
        return next;
      }
      return { ...current, [item.id]: item };
    });
  }

  function toggleVisibleSelection() {
    const visibleIds = visibleSessions.map((item) => item.id);
    setSelected((current) =>
      allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])],
    );
    setSelectedSessions((current) => {
      const next = { ...current };
      if (allVisibleSelected) visibleIds.forEach((id) => delete next[id]);
      else visibleSessions.forEach((item) => (next[item.id] = item));
      return next;
    });
  }
  function exportSessions() {
    const items = Object.values(selectedSessions);
    if (!items.length) return;
    setExporting(true);
    try {
      const stamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, "")
        .slice(0, 14);
      const url = URL.createObjectURL(
        new Blob([zip([{ name: `sessions-${stamp}.xlsx`, content: xlsx(items) }])], { type: "application/zip" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `sessions-export-${stamp}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setToast({
        text: `${items.length} session${items.length === 1 ? "" : "s"} exported successfully.`,
        type: "success",
      });
    } catch (error) {
      showError(getErrorMessage(error, "Could not export sessions."));
    } finally {
      setExporting(false);
    }
  }

  if (sessionPending)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <SessionLoader />
      </main>
    );
  if (!session)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0] px-4">
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
      {pageBusy && <SessionLoader overlay />}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[60] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-700" : "bg-red-700"}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.35)] sm:p-7">
          <div className="absolute -right-16 -top-16 h-36 w-36 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-amber-200/50 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Sessions</h1>
              <p className="mt-1 text-sm text-stone-500">
                {total} session{total === 1 ? "" : "s"} found
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || exporting || !selected.length}
                onClick={exportSessions}
                type="button"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export"}
              </button>
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => void loadSessions()}
                type="button"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
          <div className="relative mt-5">
            <label className="sr-only" htmlFor="session-search">
              Search sessions
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="w-full rounded-sm border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-600"
              id="session-search"
              onChange={(event) => {
                setSearchInput(event.target.value);
                setSelected([]);
                setSelectedSessions({});
                setPage(1);
              }}
              placeholder="Search by session, user ID, IP, or user agent"
              type="search"
              value={searchInput}
            />
          </div>
          {selected.length > 0 && (
            <div className="relative mt-5 flex items-center justify-between gap-3 rounded-sm bg-amber-100 px-3 py-2">
              <span className="text-sm font-medium text-amber-900">{selected.length} selected</span>
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deleting}
                onClick={() => void removeSessions(selected)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
          {(message || sessionsError) && (
            <p className="relative mt-5 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700" role="status">
              {message || getErrorMessage(sessionsError, "Could not load sessions.")}
            </p>
          )}
          <div className="relative mt-5 overflow-hidden rounded-sm border border-stone-200">
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-[#f8f0df] text-xs uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        aria-label="Select sessions on this page"
                        checked={allVisibleSelected}
                        onChange={toggleVisibleSelection}
                        type="checkbox"
                      />
                    </th>
                    <th className="w-[28%] px-4 py-3">User ID</th>
                    <th className="w-[24%] px-4 py-3">Expires</th>
                    <th className="w-[24%] px-4 py-3">IP</th>
                    <th className="w-36 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSessions.map((item) => (
                    <tr className="border-t border-stone-100 transition hover:bg-amber-50/40" key={item.id}>
                      <td className="px-4 py-3">
                        <input
                          aria-label={`Select ${item.id}`}
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelection(item)}
                          type="checkbox"
                        />
                      </td>
                      <td className="truncate px-4 py-3 text-stone-700" title={item.userId}>
                        {item.userId}
                      </td>
                      <td className="truncate px-4 py-3 text-stone-600" title={formatDate(item.expiresAt)}>
                        {formatDate(item.expiresAt)}
                      </td>
                      <td className="truncate px-4 py-3 text-stone-500" title={item.ipAddress || "—"}>
                        {item.ipAddress || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            aria-label="View session"
                            className="cursor-pointer rounded-sm border border-stone-200 p-2 text-stone-600 hover:bg-amber-100"
                            onClick={() => setViewing(item)}
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Edit session"
                            className="cursor-pointer rounded-sm border border-stone-200 p-2 text-stone-600 hover:bg-amber-100"
                            onClick={() => setEditing({ ...item })}
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Delete session"
                            className="cursor-pointer rounded-sm border border-red-100 p-2 text-red-700 hover:bg-red-50"
                            onClick={() => void removeSessions([item.id])}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-3 md:hidden">
              {visibleSessions.map((item) => (
                <article className="min-w-0 rounded-sm border border-stone-200 p-3" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="min-w-0 truncate text-sm font-semibold text-stone-800">
                      <input
                        aria-label={`Select ${item.id}`}
                        checked={selected.includes(item.id)}
                        className="mr-2"
                        onChange={() => toggleSelection(item)}
                        type="checkbox"
                      />
                      Session
                    </label>
                    <div className="flex shrink-0 gap-1">
                      <button
                        aria-label="View session"
                        className="p-1.5 text-stone-600"
                        onClick={() => setViewing(item)}
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Edit session"
                        className="p-1.5 text-stone-600"
                        onClick={() => setEditing({ ...item })}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete session"
                        className="p-1.5 text-red-700"
                        onClick={() => void removeSessions([item.id])}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 truncate text-sm text-stone-600" title={item.userId}>
                    {item.userId}
                  </p>
                  <p className="mt-1 truncate text-xs text-stone-400" title={formatDate(item.expiresAt)}>
                    {formatDate(item.expiresAt)}
                  </p>
                </article>
              ))}
            </div>
            {!loading && sessions.length === 0 && (
              <p className="p-8 text-center text-sm text-stone-500">
                {search ? "No matching sessions found." : "No sessions found."}
              </p>
            )}
          </div>
          {showPagination && (
            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
              <label className="flex items-center gap-2">
                Items per page
                <select
                  aria-label="Items per page"
                  className="rounded-sm border border-stone-200 bg-white px-2 py-1.5"
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  value={pageSize}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-2">
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  aria-label="Previous page"
                  className="rounded-sm border border-stone-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next page"
                  className="rounded-sm border border-stone-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {viewing && <SessionModal session={viewing} onClose={() => setViewing(null)} />}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm">
          <form
            className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
            onSubmit={saveSession}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit session</h2>
              <button
                aria-label="Close"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-stone-500"
                disabled={saving}
                onClick={() => setEditing(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm font-medium text-stone-700">
              Expires
              <input
                className="mt-1.5 w-full rounded-sm border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-amber-600"
                onChange={(event) => {
                  const value = event.target.value;
                  setEditing({ ...editing, expiresAt: value ? new Date(value).toISOString() : null });
                }}
                required
                type="datetime-local"
                value={toDateTimeInput(editing.expiresAt)}
              />
            </label>
            <button
              className="mt-5 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              <Check className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function SessionModal({ session, onClose }: { session: SessionItem; onClose: () => void }) {
  const fields = [
    ["ID", session.id],
    ["User ID", session.userId],
    ["Expires at", formatDate(session.expiresAt)],
    ["Created at", formatDate(session.createdAt)],
    ["Updated at", formatDate(session.updatedAt)],
    ["IP address", session.ipAddress || "—"],
    ["User agent", session.userAgent || "—"],
  ];
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl pb-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Session details</h2>
          <button
            aria-label="Close"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-stone-500"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="mt-5 divide-y divide-stone-200 rounded-sm border border-stone-200 bg-white">
          {fields.map(([label, value]) => (
            <div className="grid gap-1.5 p-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3" key={label}>
              <dt className="font-medium text-stone-600">{label}</dt>
              <dd className="min-w-0 break-words text-stone-800">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "error" in error.data &&
    typeof error.data.error === "string"
  )
    return error.data.error;
  return fallback;
}
function SessionLoader({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={overlay ? "fixed inset-0 z-[55] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm" : "p-4"}
      role="status"
    >
      <div className="grid min-w-56 place-items-center rounded-sm border border-[#eadfca] bg-white px-8 py-7 shadow-[0_20px_60px_-35px_rgba(120,53,15,.48)]">
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-300" />
          <span className="absolute inset-1 animate-[soft-pulse_1.6s_ease-in-out_infinite] rounded-full bg-amber-100" />
          <RefreshCw className="relative h-6 w-6 animate-spin text-amber-700 [animation-duration:1.4s]" />
        </div>
        <p className="mt-4 text-sm font-semibold text-stone-800">Updating sessions</p>
        <div className="mt-3 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
        </div>
      </div>
    </div>
  );
}
function xml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] ?? c,
  );
}
function col(index: number) {
  let n = index + 1,
    out = "";
  while (n) {
    const r = (n - 1) % 26;
    out = String.fromCharCode(65 + r) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}
function xlsx(items: SessionItem[]) {
  const rows = [
    ["ID", "User ID", "Expires", "IP Address", "User Agent", "Created", "Updated"],
    ...items.map((s) => [
      s.id,
      s.userId,
      s.expiresAt ?? "",
      s.ipAddress,
      s.userAgent,
      s.createdAt ?? "",
      s.updatedAt ?? "",
    ]),
  ];
  const sheet = rows
    .map(
      (r, ri) =>
        `<row r="${ri + 1}">${r.map((v, ci) => `<c r="${col(ci)}${ri + 1}" t="inlineStr"><is><t xml:space="preserve">${xml(/^[=+\-@]/.test(v) ? `'${v}` : v)}</t></is></c>`).join("")}</row>`,
    )
    .join("");
  const e = (v: string) => new TextEncoder().encode(v);
  return zip([
    {
      name: "[Content_Types].xml",
      content: e(
        '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      ),
    },
    {
      name: "_rels/.rels",
      content: e(
        '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      ),
    },
    {
      name: "xl/workbook.xml",
      content: e(
        '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sessions" sheetId="1" r:id="rId1"/></sheets></workbook>',
      ),
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: e(
        '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
      ),
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: e(
        `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`,
      ),
    },
  ]);
}
function crc(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const b of bytes) {
    c ^= b;
    for (let i = 0; i < 8; i += 1) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}
function zip(files: { name: string; content: Uint8Array }[]) {
  const locals: Uint8Array[] = [],
    centrals: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const n = new TextEncoder().encode(f.name),
      c = crc(f.content),
      l = new Uint8Array(30 + n.length + f.content.length),
      v = new DataView(l.buffer);
    v.setUint32(0, 0x04034b50, true);
    v.setUint16(4, 20, true);
    v.setUint32(14, c, true);
    v.setUint32(18, f.content.length, true);
    v.setUint32(22, f.content.length, true);
    v.setUint16(26, n.length, true);
    l.set(n, 30);
    l.set(f.content, 30 + n.length);
    locals.push(l);
    const q = new Uint8Array(46 + n.length),
      w = new DataView(q.buffer);
    w.setUint32(0, 0x02014b50, true);
    w.setUint16(4, 20, true);
    w.setUint16(6, 20, true);
    w.setUint32(16, c, true);
    w.setUint32(20, f.content.length, true);
    w.setUint32(24, f.content.length, true);
    w.setUint16(28, n.length, true);
    w.setUint32(42, offset, true);
    q.set(n, 46);
    centrals.push(q);
    offset += l.length;
  }
  const e = new Uint8Array(22),
    z = new DataView(e.buffer),
    cs = centrals.reduce((s, q) => s + q.length, 0);
  z.setUint32(0, 0x06054b50, true);
  z.setUint16(8, files.length, true);
  z.setUint16(10, files.length, true);
  z.setUint32(12, cs, true);
  z.setUint32(16, offset, true);
  const all = [...locals, ...centrals, e],
    out = new Uint8Array(all.reduce((s, q) => s + q.length, 0));
  let at = 0;
  for (const q of all) {
    out.set(q, at);
    at += q.length;
  }
  return out;
}

function toDateTimeInput(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}
