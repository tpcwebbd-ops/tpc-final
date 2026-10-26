/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";
import { downloadNavigationZip } from "@/lib/navigation-export";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from "@/redux/features/dashboard/roles/roleSlice";
import { type RoleItem, type SidebarItem } from "@/redux/features/dashboard/types";

type Permission = { read: boolean; create: boolean; update: boolean; delete: boolean };
type FormState = Omit<RoleItem, "id">;
const emptyPermission: Permission = { read: false, create: false, update: false, delete: false };
const emptyForm: FormState = { name: "", responsible: "", icon: "ShieldCheck", position: 0, permissions: {} };
const pageSizes = [10, 25, 50, 100];
const noRoles: RoleItem[] = [];
const noSidebars: SidebarItem[] = [];

function orderedSidebars(items: SidebarItem[]) {
  const children = new Map<string | null, SidebarItem[]>();
  items.forEach((item) => children.set(item.parentId, [...(children.get(item.parentId) ?? []), item]));
  children.forEach((group) => group.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)));
  const result: { sidebar: SidebarItem; depth: number }[] = [];
  const visit = (parentId: string | null, depth: number) =>
    (children.get(parentId) ?? []).forEach((sidebar) => {
      result.push({ sidebar, depth });
      visit(sidebar.id, depth + 1);
    });
  visit(null, 0);
  return result;
}

export default function RolePage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { can } = useDashboardPermissions("/dashboard/admin/role");
  const { data, error, isFetching, isLoading, refetch } = useGetRolesQuery(
    can("read") ? undefined : { options: true },
    { skip: !session || (!can("read") && !can("create") && !can("update")) },
  );
  const [createRole, createState] = useCreateRoleMutation();
  const [updateRole, updateState] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [open, setOpen] = useState(false),
    [editingId, setEditingId] = useState<string | null>(null),
    [viewing, setViewing] = useState<RoleItem | null>(null),
    [form, setForm] = useState<FormState>(emptyForm),
    [message, setMessage] = useState(""),
    [toast, setToast] = useState<{ text: string; type: "error" | "success" } | null>(null),
    [refreshSeconds, setRefreshSeconds] = useState(0),
    [selected, setSelected] = useState<string[]>([]),
    [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(10);
  const roles = data?.roles ?? noRoles,
    sidebars = data?.sidebars ?? noSidebars;
  const busy = createState.isLoading || updateState.isLoading;
  const totalPages = Math.max(1, Math.ceil(roles.length / pageSize));
  const visibleRoles = useMemo(() => roles.slice((page - 1) * pageSize, page * pageSize), [roles, page, pageSize]);
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
  const permission = (id: string) => form.permissions[id] ?? emptyPermission;
  function launch(role?: RoleItem) {
    setEditingId(role?.id ?? null);
    setForm(
      role
        ? {
            name: role.name,
            responsible: role.responsible ?? "",
            icon: role.icon,
            position: role.position,
            permissions: role.permissions,
          }
        : { ...emptyForm, position: roles.length },
    );
    setMessage("");
    setOpen(true);
  }
  function close() {
    setOpen(false);
    setEditingId(null);
  }
  function toggleAll(id: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        [id]: { read: checked, create: checked, update: checked, delete: checked },
      },
    }));
  }
  function toggle(id: string, key: keyof Permission, checked: boolean) {
    setForm((current) => ({
      ...current,
      permissions: { ...current.permissions, [id]: { ...permission(id), [key]: checked } },
    }));
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const isEdit = Boolean(editingId);
      if (editingId) await updateRole({ id: editingId, ...form }).unwrap();
      else await createRole(form).unwrap();
      close();
      setToast({ text: isEdit ? "Role updated successfully." : "Role created successfully.", type: "success" });
    } catch {
      const text = "Could not save role. Changes were restored.";
      setMessage(text);
      setToast({ text, type: "error" });
    }
  }
  async function remove(id: string) {
    if (!(await confirmDelete("Delete this role?"))) return;
    try {
      await deleteRole(id).unwrap();
      setToast({ text: "Role deleted successfully.", type: "success" });
    } catch {
      const text = "Could not delete role. Changes were restored.";
      setMessage(text);
      setToast({ text, type: "error" });
    }
  }
  async function removeSelected() {
    if (
      !selected.length ||
      !(await confirmDelete(
        `Delete ${selected.length} role${selected.length === 1 ? "" : "s"}? This cannot be undone.`,
      ))
    )
      return;
    try {
      await Promise.all(selected.map((id) => deleteRole(id).unwrap()));
      setSelected([]);
      setToast({ text: "Selected roles deleted successfully.", type: "success" });
    } catch {
      setToast({ text: "Could not delete every selected role. Changes were restored.", type: "error" });
    }
  }
  const exportRoles = (items: RoleItem[], kind: "export" | "bulk-export") =>
    downloadNavigationZip(
      items.map((role) => ({
        id: role.id,
        name: role.name,
        url: role.responsible || "—",
        icon: role.icon,
        visible: true,
      })),
      kind,
    );
  if (sessionPending)
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
      {(isLoading || isFetching || busy) && (
        <RoleLoading
          label={busy ? "Saving role changes" : isFetching && !isLoading ? "Refreshing roles" : "Loading roles"}
        />
      )}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[70] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-700" : "bg-red-700"}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-7">
          <div className="absolute -right-16 -top-16 h-36 w-36 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-amber-200/50 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Roles</h1>
              <p className="mt-1 text-sm text-stone-500">
                {roles.length} role{roles.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="cursor-pointer rounded-sm border border-[#eadfca] bg-[#fffaf0] px-2.5 py-1.5 text-xs font-semibold transition duration-700 hover:-translate-y-0.5 hover:bg-amber-100"
                disabled={refreshSeconds > 0}
                onClick={() => {
                  void refetch();
                  setRefreshSeconds(60);
                  setToast({ text: "Roles refreshed successfully.", type: "success" });
                }}
                type="button"
              >
                <RefreshCw className="mr-1 inline h-3.5 w-3.5" />
                {refreshSeconds ? `Refresh (${refreshSeconds}s)` : "Refresh"}
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800"
                onClick={() => launch()}
                disabled={!can("create")}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add role
              </button>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 rounded-sm bg-amber-100 p-2 text-xs">
              <span>{selected.length} selected</span>
              <div className="flex gap-2">
                <button
                  className="inline-flex cursor-pointer items-center gap-1 rounded-sm border bg-white px-2.5 py-1.5 font-semibold"
                  onClick={() =>
                    exportRoles(
                      roles.filter((role) => selected.includes(role.id)),
                      "bulk-export",
                    )
                  }
                  type="button"
                >
                  <Download className="h-3.5 w-3.5" />
                  Bulk Export
                </button>
                <button
                  className="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-red-700 px-2.5 py-1.5 font-semibold text-white"
                  onClick={() => void removeSelected()}
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
              {message || "Could not load roles."}
            </p>
          )}
          <div className="relative mt-6 overflow-hidden rounded-sm border border-stone-200">
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_9rem] gap-3 bg-[#f8f0df] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 md:grid">
              <span>Role</span>
              <span>Responsible</span>
              <span className="text-right">Actions</span>
            </div>
            {visibleRoles.map((role) => (
              <article
                className="grid gap-3 border-t border-stone-100 px-4 py-3 transition duration-700 hover:bg-amber-50/60 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_9rem] md:items-center"
                key={role.id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <input
                    aria-label={`Select ${role.name}`}
                    checked={selected.includes(role.id)}
                    className="cursor-pointer"
                    onChange={() =>
                      setSelected((items) =>
                        items.includes(role.id) ? items.filter((id) => id !== role.id) : [...items, role.id],
                      )
                    }
                    type="checkbox"
                  />
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-amber-100 text-amber-900">
                    {iconMap[role.icon] ?? <ShieldCheck className="h-4 w-4" />}
                  </span>
                  <span className="truncate text-sm font-semibold">{role.name}</span>
                </div>
                <p
                  className="truncate text-sm text-stone-500"
                  dangerouslySetInnerHTML={{ __html: role.responsible || "—" }}
                />
                <div className="flex justify-end gap-1">
                  <IconButton label="View role" onClick={() => setViewing(role)}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Edit role" onClick={() => launch(role)} disabled={!can("update")}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton danger label="Delete role" onClick={() => void remove(role.id)} disabled={!can("delete")}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </article>
            ))}
            {isLoading && <p className="p-8 text-center text-sm text-stone-500">Loading…</p>}
            {!isLoading && !roles.length && <p className="p-8 text-center text-sm text-stone-500">No roles found.</p>}
          </div>
          {roles.length > 10 && (
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
                  Page {page} of {totalPages}
                </span>
                <IconButton
                  disabled={page === 1}
                  label="Previous page"
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </IconButton>
                <IconButton
                  disabled={page === totalPages}
                  label="Next page"
                  onClick={() => setPage((current) => current + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          )}
        </section>
      </div>
      {open && (
        <RoleModal
          busy={busy}
          close={close}
          form={form}
          permission={permission}
          save={save}
          setForm={setForm}
          sidebars={sidebars}
          toggle={toggle}
          toggleAll={toggleAll}
        />
      )}
      {viewing && <RoleView role={viewing} sidebars={sidebars} close={() => setViewing(null)} />}
    </main>
  );
}

function RoleLoading({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-[60] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm"
      role="status"
    >
      <div className="relative grid min-w-60 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white px-8 py-7 text-center shadow-[0_24px_65px_-36px_rgba(120,53,15,.52)]">
        <span className="absolute -left-10 -top-10 h-24 w-24 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-amber-200/70 blur-2xl" />
        <span className="absolute -bottom-12 -right-10 h-28 w-28 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-orange-100 blur-2xl [animation-delay:1.2s]" />
        <span className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-300/70" />
          <span className="absolute inset-1 animate-[soft-pulse_1.6s_ease-in-out_infinite] rounded-full bg-amber-100" />
          <ShieldCheck className="relative h-6 w-6 animate-[soft-pulse_1.4s_ease-in-out_infinite] text-amber-700" />
        </span>
        <p className="relative mt-4 text-sm font-semibold text-stone-800">{label}</p>
        <span className="relative mt-3 flex gap-1.5" aria-hidden="true">
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
        </span>
      </div>
    </div>
  );
}

function IconButton({
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
function RoleModal({
  busy,
  close,
  form,
  permission,
  save,
  setForm,
  sidebars,
  toggle,
  toggleAll,
}: {
  busy: boolean;
  close: () => void;
  form: FormState;
  permission: (id: string) => Permission;
  save: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  sidebars: SidebarItem[];
  toggle: (id: string, key: keyof Permission, checked: boolean) => void;
  toggleAll: (id: string, checked: boolean) => void;
}) {
  const [iconOpen, setIconOpen] = useState(false);
  const [search, setSearch] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const initialResponsible = useRef(form.responsible);
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialResponsible.current;
  }, []);
  const icons = iconOptions.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  const full =
    sidebars.length > 0 &&
    sidebars.every((sidebar) => {
      const item = permission(sidebar.id);
      return item.read && item.create && item.update && item.delete;
    });
  const format = (command: string) => {
    document.execCommand(command);
    editorRef.current?.focus();
    setForm((current) => ({ ...current, responsible: editorRef.current?.innerHTML ?? "" }));
  };
  const toggleFull = () => {
    const checked = !full;
    setForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        ...Object.fromEntries(
          sidebars.map((sidebar) => [sidebar.id, { read: checked, create: checked, update: checked, delete: checked }]),
        ),
      },
    }));
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/25 p-4 backdrop-blur-sm">
      <form
        className="flex max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-2rem)] w-full max-w-3xl animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
        onSubmit={(event) => void save(event)}
      >
        <div className="flex items-center justify-between border-b border-[#eadfca] p-5">
          <h2 className="text-xl font-semibold">Role</h2>
          <button className="cursor-pointer transition duration-700 hover:rotate-90" onClick={close} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role Name">
              <input
                className="input"
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                value={form.name}
              />
            </Field>
            <Field label="Icon">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-900">
                  {iconMap[form.icon]}
                </span>
                <button
                  className="cursor-pointer rounded-sm border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-900 transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200"
                  onClick={() => {
                    setSearch("");
                    setIconOpen(true);
                  }}
                  type="button"
                >
                  Choose Icon
                </button>
              </div>
            </Field>
          </div>
          <Field label="Responsible">
            <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
              <div className="flex gap-1 border-b border-stone-200 bg-[#f8f0df] p-2">
                <button
                  className="cursor-pointer rounded-sm px-2 py-1 font-bold transition duration-700 hover:bg-amber-200"
                  onClick={() => format("bold")}
                  type="button"
                >
                  B
                </button>
                <button
                  className="cursor-pointer rounded-sm px-2 py-1 italic transition duration-700 hover:bg-amber-200"
                  onClick={() => format("italic")}
                  type="button"
                >
                  I
                </button>
                <button
                  className="cursor-pointer rounded-sm px-2 py-1 transition duration-700 hover:bg-amber-200"
                  onClick={() => format("insertUnorderedList")}
                  type="button"
                >
                  List
                </button>
              </div>
              <div
                className="min-h-28 p-3 outline-none"
                contentEditable
                onInput={(event) => {
                  const responsible = event.currentTarget.innerHTML;
                  setForm((current) => ({ ...current, responsible }));
                }}
                ref={editorRef}
                suppressContentEditableWarning
              />
            </div>
          </Field>
          <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
            <div className="flex items-center justify-between gap-3 bg-[#f8f0df] px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Access</span>
              <button
                className={`cursor-pointer rounded-sm px-3 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 ${full ? "bg-red-700 hover:bg-red-800" : "bg-emerald-700 hover:bg-emerald-800"}`}
                onClick={toggleFull}
                type="button"
              >
                {full ? "Remove full permission" : "Full permission"}
              </button>
            </div>
            <p className="px-3 pb-2 text-xs text-stone-500">
              Councilor roles cannot manage account access or roles. Funnels and Councilors management requires a
              Developer or Admin role.
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,2rem)] gap-1 border-t border-stone-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase text-stone-500">
              <span>Sidebar</span>
              <span>All</span>
              <span>R</span>
              <span>C</span>
              <span>U</span>
              <span>D</span>
            </div>
            {orderedSidebars(sidebars).map(({ sidebar, depth }) => {
              const current = permission(sidebar.id);
              const all = current.read && current.create && current.update && current.delete;
              return (
                <div
                  className="relative grid grid-cols-[minmax(0,1fr)_repeat(5,2rem)] gap-1 border-t border-stone-100 px-3 py-2.5 text-sm"
                  key={sidebar.id}
                  style={{ paddingLeft: 12 + depth * 28 }}
                >
                  {depth > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-3 top-0 border-l-2 border-amber-200"
                      style={{ left: 12 + (depth - 1) * 28 }}
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{sidebar.name}</span>
                    <span className="block truncate text-[10px] font-normal text-stone-400">{sidebar.url}</span>
                  </span>
                  <input
                    checked={all}
                    className="cursor-pointer"
                    onChange={(event) => toggleAll(sidebar.id, event.target.checked)}
                    type="checkbox"
                  />
                  <input
                    checked={current.read}
                    className="cursor-pointer"
                    onChange={(event) => toggle(sidebar.id, "read", event.target.checked)}
                    type="checkbox"
                  />
                  <input
                    checked={current.create}
                    className="cursor-pointer"
                    onChange={(event) => toggle(sidebar.id, "create", event.target.checked)}
                    type="checkbox"
                  />
                  <input
                    checked={current.update}
                    className="cursor-pointer"
                    onChange={(event) => toggle(sidebar.id, "update", event.target.checked)}
                    type="checkbox"
                  />
                  <input
                    checked={current.delete}
                    className="cursor-pointer"
                    onChange={(event) => toggle(sidebar.id, "delete", event.target.checked)}
                    type="checkbox"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[#eadfca] bg-white p-4 sm:px-7">
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-emerald-700 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-700 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg disabled:opacity-50"
            disabled={busy}
            type="submit"
          >
            <Save className="h-4 w-4" />
            {busy ? "Saving…" : "Save role"}
          </button>
        </div>
      </form>
      {iconOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section className="w-full max-w-2xl animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Icon</h3>
              <button className="cursor-pointer" onClick={() => setIconOpen(false)} type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              autoFocus
              className="input mt-4"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search icon"
              value={search}
            />
            <div className="mt-4 grid max-h-[55vh] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 md:grid-cols-8">
              {icons.map((name) => (
                <button
                  className={`grid min-h-16 cursor-pointer place-items-center rounded-sm border p-2 transition duration-700 hover:-translate-y-0.5 ${form.icon === name ? "border-amber-800 bg-amber-100 text-amber-900" : "border-stone-200 bg-white text-stone-600 hover:border-amber-400"}`}
                  key={name}
                  onClick={() => {
                    setForm((current) => ({ ...current, icon: name }));
                    setIconOpen(false);
                  }}
                  type="button"
                >
                  {iconMap[name]}
                  <span className="mt-1 w-full truncate text-[9px]">{name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function RoleView({ close, role, sidebars }: { close: () => void; role: RoleItem; sidebars: SidebarItem[] }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/25 p-4 backdrop-blur-sm">
      <section className="flex max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-2rem)] w-full max-w-3xl animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eadfca] p-5">
          <h2 className="text-xl font-semibold">Role</h2>
          <button className="cursor-pointer" onClick={close} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role Name">
              <input aria-readonly className="input" readOnly value={role.name} />
            </Field>
            <Field label="Icon">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-900">
                  {iconMap[role.icon]}
                </span>
              </div>
            </Field>
          </div>
          <Field label="Responsible">
            <div
              aria-readonly="true"
              className="min-h-28 rounded-sm border border-stone-200 bg-white p-3 text-sm text-stone-700"
              dangerouslySetInnerHTML={{ __html: role.responsible || "—" }}
            />
          </Field>
          <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
            <div className="flex items-center justify-between gap-3 bg-[#f8f0df] px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Access</span>
              <span className="text-xs text-stone-500">View only</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,2rem)] gap-1 border-t border-stone-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase text-stone-500">
              <span>Sidebar</span>
              <span>All</span>
              <span>R</span>
              <span>C</span>
              <span>U</span>
              <span>D</span>
            </div>
            {orderedSidebars(sidebars).map(({ sidebar, depth }) => {
              const current = role.permissions[sidebar.id] ?? emptyPermission;
              const all = current.read && current.create && current.update && current.delete;
              return (
                <div
                  className="relative grid grid-cols-[minmax(0,1fr)_repeat(5,2rem)] gap-1 border-t border-stone-100 px-3 py-2.5 text-sm"
                  key={sidebar.id}
                  style={{ paddingLeft: 12 + depth * 28 }}
                >
                  {depth > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-3 top-0 border-l-2 border-amber-200"
                      style={{ left: 12 + (depth - 1) * 28 }}
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{sidebar.name}</span>
                    <span className="block truncate text-[10px] font-normal text-stone-400">{sidebar.url}</span>
                  </span>
                  <input aria-label={`${sidebar.name} all permissions`} checked={all} disabled type="checkbox" />
                  <input
                    aria-label={`${sidebar.name} read permission`}
                    checked={current.read}
                    disabled
                    type="checkbox"
                  />
                  <input
                    aria-label={`${sidebar.name} create permission`}
                    checked={current.create}
                    disabled
                    type="checkbox"
                  />
                  <input
                    aria-label={`${sidebar.name} update permission`}
                    checked={current.update}
                    disabled
                    type="checkbox"
                  />
                  <input
                    aria-label={`${sidebar.name} delete permission`}
                    checked={current.delete}
                    disabled
                    type="checkbox"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[#eadfca] bg-white p-4 sm:px-7">
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-950 shadow-sm transition duration-700 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-lg"
            onClick={close}
            type="button"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="mt-4 block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
