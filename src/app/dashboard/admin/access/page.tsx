/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { downloadAccessZip } from "@/lib/access-export";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";
import {
  useCreateAccessMutation,
  useDeleteAccessMutation,
  useDeleteAccessesMutation,
  useGetAccessQuery,
  useUpdateAccessMutation,
} from "@/redux/features/dashboard/access/accessSlice";
import { type AccessItem } from "@/redux/features/dashboard/types";

type FormState = { email: string; roleId: string; blocked: boolean };
const emptyForm: FormState = { email: "", roleId: "", blocked: false };
const pageSizes = [10, 25, 50, 100];
const noItems: AccessItem[] = [];

export default function AccessPage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending } = authClient.useSession();
  const { can } = useDashboardPermissions("/dashboard/admin/access");
  const [reviewMissing, setReviewMissing] = useState(false);
  const [createAccess, createState] = useCreateAccessMutation();
  const [updateAccess, updateState] = useUpdateAccessMutation();
  const [deleteAccess] = useDeleteAccessMutation();
  const [deleteAccesses] = useDeleteAccessesMutation();
  const [open, setOpen] = useState(false),
    [editing, setEditing] = useState<AccessItem | null>(null),
    [viewing, setViewing] = useState<AccessItem | null>(null),
    [form, setForm] = useState<FormState>(emptyForm),
    [message, setMessage] = useState(""),
    [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null),
    [refreshSeconds, setRefreshSeconds] = useState(0),
    [search, setSearch] = useState(""),
    [selectedRole, setSelectedRole] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [selectedItems, setSelectedItems] = useState<Record<string, AccessItem>>({}),
    [filterOpen, setFilterOpen] = useState(false),
    [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(10);
  const { data, error, isLoading, refetch } = useGetAccessQuery(
    {
      page,
      pageSize,
      search: search.trim() || undefined,
      roleId: selectedRole || undefined,
      missingRole: reviewMissing,
      options: !can("read"),
    },
    { skip: !session || (!can("read") && !can("create") && !can("update")) },
  );
  const items = data?.items ?? noItems;
  const roles = data?.roles ?? [];
  const total = data?.total ?? 0;
  const roleCount = (roleId: string) => data?.roleCounts[roleId] ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = items;
  const busy = createState.isLoading || updateState.isLoading;
  const allCurrentSelected = current.length > 0 && current.every((item) => selected.includes(item.id));
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!refreshSeconds) return;
    const timer = window.setInterval(() => setRefreshSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [refreshSeconds]);
  function close() {
    setOpen(false);
    setEditing(null);
  }
  function launch(item?: AccessItem) {
    setEditing(item ?? null);
    setForm(
      item ? { email: item.email, roleId: item.roleMissing ? "" : item.roleId, blocked: item.blocked } : emptyForm,
    );
    setMessage("");
    setOpen(true);
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const isEdit = Boolean(editing);
      if (editing) await updateAccess({ id: editing.id, roleId: form.roleId, blocked: form.blocked }).unwrap();
      else await createAccess(form).unwrap();
      close();
      setToast({ text: isEdit ? "Access updated successfully." : "Access created successfully." });
    } catch {
      const text = "Could not save access. Changes were restored.";
      setMessage(text);
      setToast({ text, error: true });
    }
  }
  async function remove(id: string) {
    if (!(await confirmDelete("Delete this access record?"))) return;
    try {
      await deleteAccess(id).unwrap();
      setToast({ text: "Access deleted successfully." });
    } catch {
      const text = "Could not delete access. Changes were restored.";
      setMessage(text);
      setToast({ text, error: true });
    }
  }
  async function removeMany(ids: string[]) {
    if (
      !ids.length ||
      !(await confirmDelete(`Delete ${ids.length} access record${ids.length === 1 ? "" : "s"}? This cannot be undone.`))
    )
      return;
    try {
      if (ids.length === 1) await deleteAccess(ids[0]).unwrap();
      else await deleteAccesses(ids).unwrap();
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      setSelectedItems((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !ids.includes(id))));
      if (items.length === ids.length && page > 1) setPage((current) => current - 1);
      setToast({ text: `${ids.length} access record${ids.length === 1 ? "" : "s"} deleted successfully.` });
    } catch {
      setToast({ text: "Could not delete access records. Changes were restored.", error: true });
    }
  }
  if (isPending)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
      </main>
    );
  if (!session)
    return (
      <main className="flex flex-1 items-center justify-center bg-[#fffaf0]">
        <Link className="rounded-sm bg-stone-900 px-4 py-3 text-sm font-semibold text-white" href="/login">
          Sign in required
        </Link>
      </main>
    );
  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      {(busy || isLoading) && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#fffaf0]/70 backdrop-blur-sm" role="status">
          <div className="grid min-w-52 place-items-center rounded-sm border border-[#eadfca] bg-white px-7 py-6 shadow-xl">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
            <p className="mt-3 text-sm font-semibold text-stone-800">Updating access</p>
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[70] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.error ? "bg-red-700" : "bg-emerald-700"}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        {(data?.missingRoleCount ?? 0) > 0 && (
          <div className="mb-4 rounded-sm border border-amber-300 bg-amber-50 p-4 text-sm" role="status">
            <p>
              {data?.missingRoleCount} users have a missing role. Review each assignment and choose a valid role before
              enabling authorization.
            </p>
            <button
              type="button"
              className="mt-2 font-semibold text-amber-900 underline"
              onClick={() => {
                setReviewMissing(!reviewMissing);
                setPage(1);
                setSelected([]);
                setSelectedItems({});
              }}
            >
              {reviewMissing ? "Show all assignments" : "Review missing assignments"}
            </button>
          </div>
        )}
        <section className="relative overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-7">
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-200/50 blur-2xl" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">Access</h1>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
              <label className="relative w-full sm:w-auto">
                <span className="sr-only">Search access records</span>
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
                <input
                  className="h-8 w-full rounded-sm border border-[#eadfca] bg-white py-1.5 pl-8 pr-2.5 text-xs outline-none transition focus:border-amber-700 sm:w-60"
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search email or role"
                  type="search"
                  value={search}
                />
              </label>
              <div className="relative">
                <button
                  className="cursor-pointer rounded-sm border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-800 transition duration-700 hover:-translate-y-0.5 hover:bg-indigo-100"
                  onClick={() => setFilterOpen((value) => !value)}
                  type="button"
                >
                  Filter {selectedRole ? `(${roleCount(selectedRole)})` : `(${items.length})`}
                </button>
                {filterOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-xl">
                    <button
                      className="block w-full cursor-pointer px-3 py-2 text-left text-sm transition hover:bg-amber-50"
                      onClick={() => {
                        setSelectedRole("");
                        setPage(1);
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      All users ({items.length})
                    </button>
                    {roles.map((role) => (
                      <button
                        className="block w-full cursor-pointer px-3 py-2 text-left text-sm transition hover:bg-amber-50"
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id);
                          setPage(1);
                          setFilterOpen(false);
                        }}
                        type="button"
                      >
                        {role.name} ({roleCount(role.id)})
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-2.5 py-1.5 text-xs font-semibold transition hover:bg-amber-100"
                disabled={refreshSeconds > 0}
                onClick={() => {
                  void refetch();
                  setRefreshSeconds(60);
                  setToast({ text: "Access refreshed successfully." });
                }}
                type="button"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {refreshSeconds ? `Refresh (${refreshSeconds}s)` : "Refresh"}
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800"
                onClick={() => launch()}
                disabled={!can("create")}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Give access
              </button>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 rounded-sm bg-amber-100 p-2 text-xs">
              <span>{selected.length} selected</span>
              <div className="flex gap-2">
                <button
                  className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[#eadfca] bg-white px-2.5 py-1.5 font-semibold"
                  onClick={() => downloadAccessZip(Object.values(selectedItems), "bulk-export")}
                  type="button"
                >
                  <Download className="h-3.5 w-3.5" />
                  Bulk Export
                </button>
                <button
                  className="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-red-700 px-2.5 py-1.5 font-semibold text-white"
                  onClick={() => void removeMany(selected)}
                  disabled={!can("delete")}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          )}
          {(message || error) && (
            <p className="relative mt-4 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700">
              {message || "Could not load access."}
            </p>
          )}
          <div className="relative mt-6 overflow-hidden rounded-sm border border-stone-200">
            <div className="hidden grid-cols-[minmax(0,1fr)_10rem_7rem_9rem] gap-3 bg-[#f8f0df] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 md:grid">
              <span className="flex items-center gap-2">
                <input
                  aria-label="Select access records on this page"
                  checked={allCurrentSelected}
                  className="cursor-pointer"
                  onChange={() => {
                    const ids = current.map((item) => item.id);
                    setSelected((value) =>
                      allCurrentSelected ? value.filter((id) => !ids.includes(id)) : [...new Set([...value, ...ids])],
                    );
                    setSelectedItems((value) => {
                      if (allCurrentSelected)
                        return Object.fromEntries(Object.entries(value).filter(([id]) => !ids.includes(id)));
                      return { ...value, ...Object.fromEntries(current.map((item) => [item.id, item])) };
                    });
                  }}
                  type="checkbox"
                />
                Email
              </span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            {current.map((item) => (
              <article
                className="grid gap-3 border-t border-stone-100 px-4 py-3 transition duration-700 hover:bg-amber-50/60 md:grid-cols-[minmax(0,1fr)_10rem_7rem_9rem] md:items-center"
                key={item.id}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <input
                    aria-label={`Select ${item.email}`}
                    checked={selected.includes(item.id)}
                    className="cursor-pointer"
                    onChange={() => {
                      setSelected((value) =>
                        value.includes(item.id) ? value.filter((id) => id !== item.id) : [...value, item.id],
                      );
                      setSelectedItems((value) => {
                        if (value[item.id]) {
                          const remaining = { ...value };
                          delete remaining[item.id];
                          return remaining;
                        }
                        return { ...value, [item.id]: item };
                      });
                    }}
                    type="checkbox"
                  />
                  <p className="truncate text-sm font-medium" title={item.email}>
                    {item.email}
                  </p>
                </div>
                <div>
                  <p className="truncate text-sm text-stone-600">{item.roleMissing ? "--" : item.roleName}</p>
                </div>
                <span
                  className={`w-fit rounded-sm px-2 py-1 text-xs font-semibold ${item.blocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {item.blocked ? "Blocked" : "Active"}
                </span>
                <div className="flex justify-end gap-1">
                  <Action label="View" onClick={() => setViewing(item)}>
                    <Eye className="h-4 w-4" />
                  </Action>
                  <Action label="Edit" onClick={() => launch(item)} disabled={!can("update")}>
                    <Pencil className="h-4 w-4" />
                  </Action>
                  <Action danger label="Delete" onClick={() => void remove(item.id)} disabled={!can("delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Action>
                </div>
              </article>
            ))}
            {isLoading && <p className="p-8 text-center text-sm text-stone-500">Loading…</p>}
            {!isLoading && !items.length && (
              <p className="p-8 text-center text-sm text-stone-500">No access records found.</p>
            )}
          </div>
          {total > 10 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
              <label className="flex items-center gap-2">
                Items per page
                <select
                  className="rounded-sm border border-stone-200 bg-white px-2 py-1.5"
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  value={pageSize}
                >
                  {pageSizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-2">
                <span>
                  Page {page} of {pages}
                </span>
                <Action disabled={page === 1} label="Previous" onClick={() => setPage((value) => value - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Action>
                <Action disabled={page === pages} label="Next" onClick={() => setPage((value) => value + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Action>
              </div>
            </div>
          )}
        </section>
      </div>
      {open && (
        <AccessModal
          busy={busy}
          close={close}
          editing={editing}
          form={form}
          roles={roles}
          save={save}
          setForm={setForm}
        />
      )}
      {viewing && <ViewModal item={viewing} close={() => setViewing(null)} />}
    </main>
  );
}
function Action({
  children,
  danger,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`cursor-pointer rounded-sm border p-2 transition duration-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-red-100 text-red-700 hover:bg-red-50" : "border-stone-200 text-stone-600 hover:bg-amber-100"}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
function AccessModal({
  busy,
  close,
  editing,
  form,
  roles,
  save,
  setForm,
}: {
  busy: boolean;
  close: () => void;
  editing: AccessItem | null;
  form: FormState;
  roles: { id: string; name: string }[];
  save: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/25 p-4 backdrop-blur-sm">
      <form
        className="w-full max-w-md animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={(event) => void save(event)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{editing ? "Update access" : "Give access"}</h2>
          <button className="cursor-pointer transition duration-700 hover:rotate-90" onClick={close} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mt-5 block text-sm font-medium text-stone-700">
          Email
          <input
            className="input mt-1.5"
            disabled={Boolean(editing)}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={form.email}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-stone-700">
          Role
          <select
            className="input mt-1.5"
            onChange={(event) => setForm((current) => ({ ...current, roleId: event.target.value }))}
            required
            value={form.roleId}
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-700">
          <input
            checked={form.blocked}
            className="cursor-pointer"
            onChange={(event) => setForm((current) => ({ ...current, blocked: event.target.checked }))}
            type="checkbox"
          />
          <Ban className="h-4 w-4" />
          Block user
        </label>
        <button
          className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800 disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          <Check className="h-4 w-4" />
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
function ViewModal({ close, item }: { close: () => void; item: AccessItem }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/25 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-900">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold">Access details</h2>
          </div>
          <button className="cursor-pointer" onClick={close} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="mt-5 divide-y divide-stone-200 rounded-sm border border-stone-200 bg-white text-sm">
          <Row label="Email" value={item.email} />
          <Row label="Role" value={item.roleName} />
          <Row label="Status" value={item.blocked ? "Blocked" : "Active"} />
        </dl>
      </section>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 p-3">
      <dt className="font-medium text-stone-500">{label}</dt>
      <dd className="break-words text-stone-800">{value}</dd>
    </div>
  );
}
