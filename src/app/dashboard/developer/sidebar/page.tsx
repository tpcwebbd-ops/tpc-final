/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { ChevronDown, ChevronsDown, ChevronsUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import {
  useCreateSidebarMutation,
  useDeleteSidebarMutation,
  useGetSidebarsQuery,
  useMoveSidebarMutation,
  useUpdateSidebarMutation,
} from "@/redux/features/dashboard/sidebars/sidebarSlice";
import { type SidebarItem } from "@/redux/features/dashboard/types";

type FormState = Pick<SidebarItem, "name" | "url" | "icon">;
type Node = { item: SidebarItem; children: Node[] };
const empty: FormState = { name: "", url: "", icon: "Home" };
const noItems: SidebarItem[] = [];

export default function SidebarPage() {
  const confirmDelete = useConfirmDelete();
  const { data: session, isPending } = authClient.useSession();
  const { data, error, isLoading, refetch } = useGetSidebarsQuery(undefined, { skip: !session });
  const [createSidebar, createState] = useCreateSidebarMutation();
  const [updateSidebar, updateState] = useUpdateSidebarMutation();
  const [deleteSidebar] = useDeleteSidebarMutation();
  const [moveSidebar] = useMoveSidebarMutation();
  const [open, setOpen] = useState(false),
    [editing, setEditing] = useState<SidebarItem | null>(null),
    [parentId, setParentId] = useState<string | null>(null),
    [modalTitle, setModalTitle] = useState("Add Sidebar"),
    [form, setForm] = useState<FormState>(empty),
    [message, setMessage] = useState(""),
    [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const items = data?.items ?? noItems;
  const tree = useMemo(() => makeTree(items), [items]);
  const busy = createState.isLoading || updateState.isLoading;
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  function launch() {
    setEditing(null);
    setParentId(null);
    setModalTitle("Add Sidebar");
    setForm(empty);
    setMessage("");
    setOpen(true);
  }
  function edit(item: SidebarItem) {
    setEditing(item);
    setParentId(null);
    setModalTitle("Edit Sidebar");
    setForm({ name: item.name, url: item.url, icon: item.icon });
    setMessage("");
    setOpen(true);
  }
  function addNested(item: SidebarItem, level: number) {
    if (level > 1) return;
    setEditing(null);
    setParentId(item.id);
    setModalTitle(level === 0 ? "Add Parent" : "Add Child");
    setForm(empty);
    setMessage("");
    setOpen(true);
  }
  function close() {
    setOpen(false);
    setEditing(null);
    setParentId(null);
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const isEdit = Boolean(editing);
      if (editing) await updateSidebar({ ...editing, ...form }).unwrap();
      else await createSidebar({ ...form, parentId }).unwrap();
      close();
      setToast({
        message: isEdit ? "Sidebar updated successfully." : "Sidebar created successfully.",
        type: "success",
      });
    } catch {
      const errorMessage = "Could not save sidebar. Changes were restored.";
      setMessage(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  }
  async function remove(id: string) {
    if (!(await confirmDelete("Delete this sidebar item?"))) return;
    try {
      await deleteSidebar(id).unwrap();
      setToast({ message: "Sidebar deleted successfully.", type: "success" });
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Could not delete sidebar. Changes were restored.");
      setMessage(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  }
  async function move(id: string, direction: "up" | "down") {
    try {
      await moveSidebar({ id, direction }).unwrap();
      setToast({ message: `Sidebar moved ${direction} successfully.`, type: "success" });
    } catch {
      const errorMessage = "Could not move sidebar. Changes were restored.";
      setMessage(errorMessage);
      setToast({ message: errorMessage, type: "error" });
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
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[60] rounded-sm px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-700" : "bg-red-700"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      <div className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-7">
          <div className="absolute -right-16 -top-16 h-36 w-36 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-amber-200/50 blur-2xl" />
          <div className="relative flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Sidebar</h1>
            <div className="flex gap-2">
              <button
                className="cursor-pointer rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => refetch()}
                type="button"
              >
                Refresh
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white"
                onClick={launch}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add Sidebar
              </button>
            </div>
          </div>
          {(message || error) && (
            <p className="relative mt-4 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700">
              {message || "Could not load sidebar."}
            </p>
          )}
          <div className="sidebar-editor-tree relative mt-6 overflow-hidden rounded-sm border border-stone-200">
            {tree.map((node) => (
              <TreeRow
                addNested={addNested}
                edit={edit}
                key={node.item.id}
                level={0}
                move={move}
                node={node}
                remove={remove}
              />
            ))}
            {isLoading && <p className="p-8 text-center text-sm text-stone-500">Loading…</p>}
            {!isLoading && !items.length && (
              <p className="p-8 text-center text-sm text-stone-500">No sidebar items found.</p>
            )}
          </div>
        </section>
      </div>
      {open && <SidebarModal busy={busy} close={close} form={form} save={save} setForm={setForm} title={modalTitle} />}
    </main>
  );
}

function SidebarModal({
  busy,
  close,
  form,
  save,
  setForm,
  title,
}: {
  busy: boolean;
  close: () => void;
  form: FormState;
  save: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setForm: (value: FormState) => void;
  title: string;
}) {
  const [iconOpen, setIconOpen] = useState(false);
  const [search, setSearch] = useState("");
  const icons = iconOptions.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/25 p-4 backdrop-blur-sm">
      <form
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={(event) => void save(event)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center"
            onClick={close}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <Field label="Name">
            <input
              className="input"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              value={form.name}
            />
          </Field>
          <Field label="URL">
            <input
              className="input"
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              required
              value={form.url}
            />
          </Field>
          <Field label="Icon">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-900">
                {iconMap[form.icon]}
              </span>
              <button
                className="cursor-pointer rounded-sm border border-[#eadfca] bg-white px-3 py-1.5 text-xs font-semibold"
                onClick={() => {
                  setSearch("");
                  setIconOpen(true);
                }}
                type="button"
              >
                Update Icon
              </button>
            </div>
          </Field>
        </div>
        <button
          className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          <Save className="h-4 w-4" />
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
      {iconOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Icon</h3>
              <button
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center"
                onClick={() => setIconOpen(false)}
                type="button"
              >
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
                  className={`grid min-h-16 cursor-pointer place-items-center rounded-sm border p-2 ${form.icon === name ? "border-amber-800 bg-amber-100 text-amber-900 ring-2 ring-amber-700/25" : "border-stone-200 bg-white text-stone-600"}`}
                  key={name}
                  onClick={() => {
                    setForm({ ...form, icon: name });
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
function TreeRow({
  addNested,
  edit,
  level,
  move,
  node,
  remove,
}: {
  addNested: (item: SidebarItem, level: number) => void;
  edit: (item: SidebarItem) => void;
  level: number;
  move: (id: string, direction: "up" | "down") => Promise<void>;
  node: Node;
  remove: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(true);
  const { item } = node;
  const hasChildren = node.children.length > 0;
  return (
    <div className="sidebar-editor-node">
      <article
        className="sidebar-editor-row group flex items-center gap-2 border-b border-stone-100 px-3 py-3"
        style={{ paddingLeft: 16 + level * 36 }}
      >
        {hasChildren ? (
          <button
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${item.name}`}
            className="grid h-7 w-7 place-items-center rounded-sm text-stone-600 transition hover:bg-amber-100"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "rotate-0" : "-rotate-90"}`}
            />
          </button>
        ) : (
          <span className="w-7" />
        )}
        <span className="grid h-7 w-7 place-items-center rounded-sm bg-amber-100 text-amber-900 transition-transform duration-300 group-hover:scale-110">
          {iconMap[item.icon]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="truncate text-xs text-stone-400">{item.url}</p>
        </div>
        <button
          aria-label="Move up"
          className="sidebar-editor-action"
          onClick={() => void move(item.id, "up")}
          type="button"
        >
          <ChevronsUp className="h-4 w-4" />
        </button>
        <button
          aria-label="Move down"
          className="sidebar-editor-action"
          onClick={() => void move(item.id, "down")}
          type="button"
        >
          <ChevronsDown className="h-4 w-4" />
        </button>
        <button aria-label="Edit" className="sidebar-editor-action" onClick={() => edit(item)} type="button">
          <Pencil className="h-4 w-4" />
        </button>
        {level < 2 && (
          <button
            aria-label="Add nested sidebar"
            className="sidebar-editor-action text-amber-800"
            onClick={() => addNested(item, level)}
            type="button"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
        <button
          aria-label="Delete"
          className="sidebar-editor-action text-red-700 hover:bg-red-50 hover:text-red-800"
          onClick={() => void remove(item.id)}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </article>
      {hasChildren && (
        <div className={`sidebar-editor-children ${open ? "sidebar-editor-children-open" : ""}`}>
          <div className="min-h-0 overflow-hidden">
            {node.children.map((child) => (
              <TreeRow
                addNested={addNested}
                edit={edit}
                key={child.item.id}
                level={level + 1}
                move={move}
                node={child}
                remove={remove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
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
function makeTree(items: SidebarItem[]) {
  const map = new Map(items.map((item) => [item.id, { item, children: [] as Node[] }]));
  const roots: Node[] = [];
  map.forEach((node) => {
    const parent = node.item.parentId ? map.get(node.item.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  const sort = (nodes: Node[]) => {
    nodes.sort((a, b) => a.item.position - b.item.position || a.item.name.localeCompare(b.item.name));
    nodes.forEach((node) => sort(node.children));
  };
  sort(roots);
  return roots;
}

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error &&
    "data" in error &&
    typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;
}
