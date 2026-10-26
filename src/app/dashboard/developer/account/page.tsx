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
  type AccountItem as Account,
  useDeleteAccountMutation,
  useDeleteAccountsMutation,
  useGetAccountsQuery,
  useUpdateAccountMutation,
} from "@/redux/features/dashboard/accounts/accountsSlice";
const pageSizeOptions = [10, 25, 50, 100];
type Toast = { text: string; type: "success" | "error" };

export default function DeveloperDashboardPage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, Account>>({});
  const [editing, setEditing] = useState<Account | null>(null);
  const [viewing, setViewing] = useState<Account | null>(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const {
    data: accountsData,
    error: accountsError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAccountsQuery({ page, limit: pageSize, ...(search ? { q: search } : {}) }, { skip: !session });
  const [updateAccount, { isLoading: saving }] = useUpdateAccountMutation();
  const [deleteAccount, { isLoading: deletingOne }] = useDeleteAccountMutation();
  const [deleteAccounts, { isLoading: deletingMany }] = useDeleteAccountsMutation();
  const accounts = useMemo(() => accountsData?.accounts ?? [], [accountsData]);
  const loading = isLoading || isFetching;
  const deleting = deletingOne || deletingMany;
  const pageBusy = loading || saving || deleting || exporting;
  const loadingLabel = exporting
    ? "Preparing your export"
    : deleting
      ? "Updating accounts"
      : saving
        ? "Saving account changes"
        : "Loading accounts";

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
    if (!accountsError) return;
    const timer = window.setTimeout(
      () => setToast({ text: getErrorMessage(accountsError, "Could not load accounts."), type: "error" }),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [accountsError]);

  function showError(error: string) {
    setMessage(error);
    setToast({ text: error, type: "error" });
  }
  async function loadAccounts() {
    setMessage("");
    try {
      await refetch().unwrap();
      setSelected([]);
      setSelectedAccounts({});
      setPage(1);
      setToast({ text: "Accounts refreshed successfully.", type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not load accounts."));
    }
  }

  const total = accountsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleAccounts = accounts;
  const showPagination = total > 0;
  const allVisibleSelected =
    visibleAccounts.length > 0 && visibleAccounts.every((account) => selected.includes(account.id));

  async function removeAccounts(ids: string[]) {
    if (!ids.length || !(await confirmDelete(`Delete ${ids.length} account${ids.length === 1 ? "" : "s"}?`))) return;
    try {
      if (ids.length === 1) await deleteAccount(ids[0]).unwrap();
      else await deleteAccounts(ids).unwrap();
      setMessage("");
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      setSelectedAccounts((current) => {
        const next = { ...current };
        ids.forEach((id) => delete next[id]);
        return next;
      });
      setToast({ text: `${ids.length} account${ids.length === 1 ? "" : "s"} deleted successfully.`, type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not delete accounts."));
    }
  }

  async function saveAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    try {
      await updateAccount(editing).unwrap();
      setMessage("");
      setEditing(null);
      setSelectedAccounts((current) => (current[editing.id] ? { ...current, [editing.id]: editing } : current));
      setToast({ text: "Account updated successfully.", type: "success" });
    } catch (error) {
      showError(getErrorMessage(error, "Could not update account."));
    }
  }

  function toggleSelection(account: Account) {
    setSelected((current) =>
      current.includes(account.id) ? current.filter((item) => item !== account.id) : [...current, account.id],
    );
    setSelectedAccounts((current) => {
      if (current[account.id]) {
        const next = { ...current };
        delete next[account.id];
        return next;
      }
      return { ...current, [account.id]: account };
    });
  }

  function toggleVisibleSelection() {
    const visibleIds = visibleAccounts.map((account) => account.id);
    setSelected((current) =>
      allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])],
    );
    setSelectedAccounts((current) => {
      const next = { ...current };
      if (allVisibleSelected) visibleIds.forEach((id) => delete next[id]);
      else visibleAccounts.forEach((account) => (next[account.id] = account));
      return next;
    });
  }

  function changePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  async function exportAccounts() {
    const exportItems = Object.values(selectedAccounts);
    if (!exportItems.length) return;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
    setExporting(true);
    try {
      const archive = createZip([{ name: `accounts-${timestamp}.xlsx`, content: createXlsx(exportItems) }]);
      const downloadUrl = URL.createObjectURL(new Blob([archive], { type: "application/zip" }));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `accounts-export-${timestamp}.zip`;
      link.className = "hidden";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setMessage("");
      setToast({
        text: `${exportItems.length} account${exportItems.length === 1 ? "" : "s"} exported successfully.`,
        type: "success",
      });
    } catch (error) {
      showError(getErrorMessage(error, "Could not export accounts."));
    } finally {
      setExporting(false);
    }
  }

  if (sessionPending)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <AccountPageLoader label="Preparing your workspace" />
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
      {pageBusy && <AccountPageLoader label={loadingLabel} overlay />}
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
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Accounts</h1>
              <p className="mt-1 text-sm text-stone-500">
                {total} account{total === 1 ? "" : "s"} found
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || exporting || selected.length === 0}
                onClick={() => void exportAccounts()}
                type="button"
              >
                <Download className={`h-4 w-4 ${exporting ? "animate-pulse" : ""}`} />
                {exporting ? "Exporting..." : "Export"}
              </button>
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => void loadAccounts()}
                type="button"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
          <div className="relative mt-5">
            <label className="sr-only" htmlFor="account-search">
              Search accounts
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="w-full rounded-sm border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-600"
              id="account-search"
              onChange={(event) => {
                setSearchInput(event.target.value);
                setSelected([]);
                setSelectedAccounts({});
                setPage(1);
              }}
              placeholder="Search by provider, account ID, or user ID"
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
                onClick={() => void removeAccounts(selected)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
          {(message || accountsError) && (
            <p className="relative mt-5 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700" role="status">
              {message || getErrorMessage(accountsError, "Could not load accounts.")}
            </p>
          )}
          <div className="relative mt-5 overflow-hidden rounded-sm border border-stone-200">
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-[#f8f0df] text-xs uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        aria-label="Select accounts on this page"
                        checked={allVisibleSelected}
                        className="cursor-pointer"
                        onChange={toggleVisibleSelection}
                        type="checkbox"
                      />
                    </th>
                    <th className="w-[19%] px-4 py-3">Provider</th>
                    <th className="w-[27%] px-4 py-3">Account ID</th>
                    <th className="w-[27%] px-4 py-3">User ID</th>
                    <th className="w-36 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAccounts.map((account) => (
                    <tr className="border-t border-stone-100 transition hover:bg-amber-50/40" key={account.id}>
                      <td className="px-4 py-3">
                        <input
                          aria-label={`Select ${account.accountId}`}
                          checked={selected.includes(account.id)}
                          className="cursor-pointer"
                          onChange={() => toggleSelection(account)}
                          type="checkbox"
                        />
                      </td>
                      <td className="truncate px-4 py-3 font-medium text-stone-800" title={account.providerId}>
                        {account.providerId}
                      </td>
                      <td className="truncate px-4 py-3 text-stone-600" title={account.accountId}>
                        {account.accountId}
                      </td>
                      <td className="truncate px-4 py-3 text-stone-500" title={account.userId}>
                        {account.userId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            aria-label="View account"
                            className="cursor-pointer rounded-sm border border-stone-200 p-2 text-stone-600 hover:bg-amber-100"
                            onClick={() => setViewing(account)}
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Edit account"
                            className="cursor-pointer rounded-sm border border-stone-200 p-2 text-stone-600 hover:bg-amber-100"
                            onClick={() => {
                              setMessage("");
                              setEditing({ ...account });
                            }}
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Delete account"
                            className="cursor-pointer rounded-sm border border-red-100 p-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={deleting}
                            onClick={() => void removeAccounts([account.id])}
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
              {visibleAccounts.map((account) => (
                <article className="min-w-0 rounded-sm border border-stone-200 p-3" key={account.id}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="min-w-0 truncate text-sm font-semibold text-stone-800">
                      <input
                        aria-label={`Select ${account.accountId}`}
                        checked={selected.includes(account.id)}
                        className="mr-2 cursor-pointer"
                        onChange={() => toggleSelection(account)}
                        type="checkbox"
                      />
                      {account.providerId}
                    </label>
                    <div className="flex shrink-0 gap-1">
                      <button
                        aria-label="View account"
                        className="cursor-pointer p-1.5 text-stone-600"
                        onClick={() => setViewing(account)}
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Edit account"
                        className="cursor-pointer p-1.5 text-stone-600"
                        onClick={() => {
                          setMessage("");
                          setEditing({ ...account });
                        }}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete account"
                        className="cursor-pointer p-1.5 text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={deleting}
                        onClick={() => void removeAccounts([account.id])}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 truncate text-sm text-stone-600" title={account.accountId}>
                    {account.accountId}
                  </p>
                  <p className="mt-1 truncate text-xs text-stone-400" title={account.userId}>
                    {account.userId}
                  </p>
                </article>
              ))}
            </div>
            {!loading && accounts.length === 0 && (
              <p className="p-8 text-center text-sm text-stone-500">
                {search ? "No matching accounts found." : "No accounts found."}
              </p>
            )}
          </div>
          {showPagination && (
            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
              <label className="flex items-center gap-2">
                Items per page
                <select
                  aria-label="Items per page"
                  className="cursor-pointer rounded-sm border border-stone-200 bg-white px-2 py-1.5"
                  onChange={(event) => changePageSize(Number(event.target.value))}
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
                  className="cursor-pointer rounded-sm border border-stone-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next page"
                  className="cursor-pointer rounded-sm border border-stone-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
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
      {viewing && <AccountModal account={viewing} onClose={() => setViewing(null)} />}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm">
          <form
            className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
            onSubmit={saveAccount}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit account</h2>
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
              Provider
              <input
                className="mt-1.5 w-full rounded-sm border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-amber-600"
                onChange={(event) => setEditing({ ...editing, providerId: event.target.value })}
                required
                value={editing.providerId}
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-stone-700">
              Account ID
              <input
                className="mt-1.5 w-full rounded-sm border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-amber-600"
                onChange={(event) => setEditing({ ...editing, accountId: event.target.value })}
                required
                value={editing.accountId}
              />
            </label>
            {message && <p className="mt-4 rounded-sm bg-red-50 px-3 py-2 text-xs text-red-700">{message}</p>}
            <button
              className="mt-5 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
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

function AccountModal({ account, onClose }: { account: Account; onClose: () => void }) {
  const fields = [
    ["ID", account.id],
    ["Provider", account.providerId],
    ["Account ID", account.accountId],
    ["User ID", account.userId],
    ["Created at", formatDate(account.createdAt)],
    ["Updated at", formatDate(account.updatedAt)],
  ];
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Account details</h2>
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
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") return data.error;
  }
  return fallback;
}

function AccountPageLoader({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={overlay ? "fixed inset-0 z-[55] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm" : "p-4"}
      role="status"
    >
      <div className="relative grid min-w-56 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white px-8 py-7 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.48)]">
        <div className="absolute -left-10 -top-10 h-24 w-24 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-amber-200/70 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 h-28 w-28 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-orange-100 blur-2xl [animation-delay:1.2s]" />
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-300/70" />
          <span className="absolute inset-1 animate-[soft-pulse_1.6s_ease-in-out_infinite] rounded-full bg-amber-100" />
          <RefreshCw className="relative h-6 w-6 animate-spin text-amber-700 [animation-duration:1.4s]" />
        </div>
        <p className="relative mt-4 text-sm font-semibold text-stone-800">{label}</p>
        <div className="relative mt-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
        </div>
      </div>
    </div>
  );
}

function createXlsx(accounts: Account[]) {
  const rows = [
    ["ID", "Provider", "Account ID", "User ID", "Created at", "Updated at"],
    ...accounts.map((account) => [
      account.id,
      account.providerId,
      account.accountId,
      account.userId,
      account.createdAt ?? "",
      account.updatedAt ?? "",
    ]),
  ];
  const sheet = rows
    .map(
      (row, rowIndex) =>
        `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => `<c r="${columnName(columnIndex)}${rowIndex + 1}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(safeCell(value))}</t></is></c>`).join("")}</row>`,
    )
    .join("");
  const encode = (value: string) => new TextEncoder().encode(value);
  return createZip([
    {
      name: "[Content_Types].xml",
      content: encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      ),
    },
    {
      name: "_rels/.rels",
      content: encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      ),
    },
    {
      name: "xl/workbook.xml",
      content: encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Accounts" sheetId="1" r:id="rId1"/></sheets></workbook>',
      ),
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
      ),
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`,
      ),
    },
  ]);
}

function createZip(files: { name: string; content: Uint8Array }[]) {
  const chunks: Uint8Array[] = [];
  const centralEntries: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = new TextEncoder().encode(file.name);
    const checksum = crc32(file.content);
    const local = new Uint8Array(30 + name.length + file.content.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint32(14, checksum, true);
    view.setUint32(18, file.content.length, true);
    view.setUint32(22, file.content.length, true);
    view.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(file.content, 30 + name.length);
    chunks.push(local);
    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, file.content.length, true);
    centralView.setUint32(24, file.content.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    central.set(name, 46);
    centralEntries.push(central);
    offset += local.length;
  }
  const centralSize = centralEntries.reduce((size, entry) => size + entry.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  return joinBytes([...chunks, ...centralEntries, end]);
}

function joinBytes(chunks: Uint8Array[]) {
  const output = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}
function crc32(contents: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of contents) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function columnName(index: number) {
  let value = index + 1;
  let name = "";
  while (value) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}
function safeCell(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}
function escapeXml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character,
  );
}
