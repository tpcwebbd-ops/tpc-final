/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import { Download, Eye, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/global-toast";
import { categoryDefaults, defaultImportCategories, normalizeSlug, type PresetCategory } from "@/lib/dashboard/catalog";
import {
  type CategoryInput,
  type CategoryItem,
  type CategoryListParams,
  useBulkDeleteCategoriesMutation,
  useBulkUpdateCategoryStatusMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/dashboard/categories/categoriesSlice";

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;
const pageSizes = [10, 25, 50, 100] as const;

export default function CategoryPage() {
  const [query, setQuery] = useState<CategoryListParams>({ page: 1, pageSize: 10, search: "", status: "" });
  const { data, error, isFetching, isLoading, refetch } = useGetCategoriesQuery(query);
  const [create, createState] = useCreateCategoryMutation();
  const [update, updateState] = useUpdateCategoryMutation();
  const [remove, removeState] = useDeleteCategoryMutation();
  const [bulkRemove, bulkRemoveState] = useBulkDeleteCategoriesMutation();
  const [bulkUpdateStatus, bulkUpdateStatusState] = useBulkUpdateCategoryStatusMutation();
  const confirmDelete = useConfirmDelete();
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [viewing, setViewing] = useState<CategoryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<CategoryItem["status"]>("active");
  const busy =
    createState.isLoading ||
    updateState.isLoading ||
    removeState.isLoading ||
    bulkRemoveState.isLoading ||
    bulkUpdateStatusState.isLoading ||
    isImporting;
  const items = data?.items ?? [];
  const visibleItems = items;
  const page = data?.page ?? query.page ?? 1;
  const pageSize = data?.pageSize ?? query.pageSize ?? 10;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selectedIds.includes(item.id));

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  async function save(form: CategoryInput) {
    try {
      if (editing) await update({ ...form, id: editing.id }).unwrap();
      else await create(form).unwrap();
      setOpen(false);
      toast.success(editing ? "Category updated successfully." : "Category created successfully.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not save category."));
    }
  }

  async function destroy(item: CategoryItem) {
    if (!(await confirmDelete(`Delete “${item.name}”? Categories assigned to products cannot be deleted.`))) return;
    try {
      await remove(item.id).unwrap();
      toast.success("Category deleted successfully.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete category."));
    }
  }

  function toggleItem(id: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, id])] : current.filter((value) => value !== id)));
  }

  async function deleteSelected() {
    if (!selectedIds.length) return;
    if (
      !(await confirmDelete(
        `Delete ${selectedIds.length} selected categor${selectedIds.length === 1 ? "y" : "ies"}? This cannot be undone.`,
      ))
    )
      return;
    try {
      const result = await bulkRemove(selectedIds).unwrap();
      setSelectedIds([]);
      toast.success(`${result.deletedCount} categor${result.deletedCount === 1 ? "y" : "ies"} deleted successfully.`);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete the selected categories."));
    }
  }

  async function updateSelectedStatus() {
    if (!selectedIds.length) return;
    try {
      const result = await bulkUpdateStatus({ ids: selectedIds, status: bulkStatus }).unwrap();
      setSelectedIds([]);
      toast.success(
        `${result.updatedCount} categor${result.updatedCount === 1 ? "y" : "ies"} updated to ${bulkStatus}.`,
      );
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not update the selected categories."));
    }
  }

  async function handleImport(categoriesToImport: PresetCategory[]) {
    if (!categoriesToImport.length) return;
    setIsImporting(true);
    let created = 0;
    let failed = 0;

    for (const cat of categoriesToImport) {
      try {
        await create({
          description: cat.description,
          name: cat.name,
          slug: cat.slug,
          status: cat.status,
        }).unwrap();
        created++;
      } catch {
        failed++;
      }
    }

    setIsImporting(false);
    setImportOpen(false);

    if (created > 0) {
      toast.success(`Successfully imported ${created} ${created === 1 ? "category" : "categories"}.`);
    }
    if (failed > 0) {
      toast.error(`Failed to import ${failed} ${failed === 1 ? "category" : "categories"} (might already exist).`);
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-stone-900">Categories</h1>
            <p className="mt-1 text-sm text-stone-600">
              Create product categories and keep their descriptions organized.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button className="secondary-button" onClick={() => setImportOpen(true)} type="button">
              <Download className="h-4 w-4" /> Import
            </button>
            <button className="primary-button" onClick={openCreate} type="button">
              <Plus className="h-4 w-4" /> Add category
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error, "Could not load categories.")}
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              aria-label="Search categories"
              className="input pl-9"
              onChange={(event) => {
                setQuery({ ...query, page: 1, search: event.target.value });
                setSelectedIds([]);
              }}
              placeholder="Search name, slug, or description"
              value={query.search ?? ""}
            />
          </label>
          <select
            aria-label="Filter categories by status"
            className="input"
            onChange={(event) => {
              setQuery({ ...query, page: 1, status: event.target.value as CategoryListParams["status"] });
              setSelectedIds([]);
            }}
            value={query.status ?? ""}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {selectedIds.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 rounded-sm border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-amber-950">
              {selectedIds.length} categor{selectedIds.length === 1 ? "y" : "ies"} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Bulk category status"
                className="h-9 rounded-sm border border-amber-200 bg-white px-3 text-sm"
                disabled={busy}
                onChange={(event) => setBulkStatus(event.target.value as CategoryItem["status"])}
                value={bulkStatus}
              >
                <option value="active">Set active</option>
                <option value="inactive">Set inactive</option>
              </select>
              <button
                className="secondary-button"
                disabled={busy}
                onClick={() => void updateSelectedStatus()}
                type="button"
              >
                {bulkUpdateStatusState.isLoading ? "Updating…" : "Update status"}
              </button>
              <button
                className="secondary-button border-red-200 text-red-700 hover:bg-red-50"
                disabled={busy}
                onClick={() => void deleteSelected()}
                type="button"
              >
                {bulkRemoveState.isLoading ? "Deleting…" : "Delete selected"}
              </button>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="mt-5 grid gap-3" role="status">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-20 animate-pulse rounded-sm bg-amber-50" key={index} />
            ))}
          </div>
        ) : !items.length ? (
          <div className="mt-5 rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-stone-900">No categories yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">
              You haven&apos;t added any categories yet. Add your first category manually, or import preset categories
              from the Gadget catalog.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button className="primary-button" onClick={() => setImportOpen(true)} type="button">
                <Download className="h-4 w-4" /> Import
              </button>
              <button className="secondary-button" onClick={openCreate} type="button">
                <Plus className="h-4 w-4" /> Add category
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                    <tr>
                      <th className="p-3">
                        <Checkbox
                          aria-label="Select all visible categories"
                          checked={allVisibleSelected}
                          onCheckedChange={(checked) =>
                            setSelectedIds(checked ? visibleItems.map((item) => item.id) : [])
                          }
                        />
                      </th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Slug</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item) => (
                      <tr className="border-t border-stone-100" key={item.id}>
                        <td className="p-3">
                          <Checkbox
                            aria-label={`Select ${item.name}`}
                            checked={selectedIds.includes(item.id)}
                            onCheckedChange={(checked) => toggleItem(item.id, checked)}
                          />
                        </td>
                        <td className="p-3 font-medium text-stone-900">{item.name}</td>
                        <td className="p-3 text-stone-600">{item.slug}</td>
                        <td className="max-w-xs truncate p-3 text-stone-600" title={item.description}>
                          {item.description || "—"}
                        </td>
                        <td className="p-3">
                          <Status status={item.status} />
                        </td>
                        <td className="p-3">
                          <Actions
                            edit={() => {
                              setEditing(item);
                              setOpen(true);
                            }}
                            remove={() => void destroy(item)}
                            view={() => setViewing(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 p-3 md:hidden">
                {visibleItems.map((item) => (
                  <article className="rounded-sm border border-stone-200 p-3" key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <Checkbox
                        aria-label={`Select ${item.name}`}
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => toggleItem(item.id, checked)}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="mt-1 truncate text-xs text-stone-500">{item.slug}</p>
                      </div>
                      <Actions
                        edit={() => {
                          setEditing(item);
                          setOpen(true);
                        }}
                        remove={() => void destroy(item)}
                        view={() => setViewing(item)}
                      />
                    </div>
                    <p className="mt-3 text-sm text-stone-600">{item.description || "No description."}</p>
                    <div className="mt-3">
                      <Status status={item.status} />
                    </div>
                  </article>
                ))}
                {!visibleItems.length && (
                  <p className="p-4 text-center text-sm text-stone-500">No categories match your search or filter.</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} categories
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2">
                  <span>Per page</span>
                  <select
                    aria-label="Categories per page"
                    className="h-9 rounded-sm border border-[#eadfca] bg-white px-2"
                    onChange={(event) => {
                      setQuery({ ...query, page: 1, pageSize: Number(event.target.value) });
                      setSelectedIds([]);
                    }}
                    value={pageSize}
                  >
                    {pageSizes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  aria-label="Previous page"
                  className="secondary-button"
                  disabled={isFetching || page === 1}
                  onClick={() => setQuery({ ...query, page: page - 1 })}
                  type="button"
                >
                  Previous
                </button>
                <span className="min-w-20 text-center font-medium text-stone-800">
                  Page {page} of {totalPages}
                </span>
                <button
                  aria-label="Next page"
                  className="secondary-button"
                  disabled={isFetching || page >= totalPages}
                  onClick={() => setQuery({ ...query, page: page + 1 })}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {open && <CategoryForm busy={busy} close={() => setOpen(false)} initial={editing} save={save} />}
      {importOpen && (
        <ImportCategoryModal
          busy={isImporting}
          close={() => setImportOpen(false)}
          existingItems={items}
          onImport={handleImport}
        />
      )}
      {viewing && <CategoryViewModal close={() => setViewing(null)} item={viewing} />}
    </main>
  );
}

function ImportCategoryModal({
  busy,
  close,
  existingItems,
  onImport,
}: {
  busy: boolean;
  close: () => void;
  existingItems: CategoryItem[];
  onImport: (categories: PresetCategory[]) => Promise<void>;
}) {
  const existingSlugs = useMemo(() => new Set(existingItems.map((item) => item.slug)), [existingItems]);
  const filteredCategories = defaultImportCategories;

  // Initially select all categories that don't already exist
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    defaultImportCategories.filter((c) => !existingSlugs.has(c.slug)).map((c) => c.slug),
  );

  const availableFiltered = filteredCategories.filter((c) => !existingSlugs.has(c.slug));
  const allFilteredSelected =
    availableFiltered.length > 0 && availableFiltered.every((c) => selectedSlugs.includes(c.slug));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      const slugsToRemove = new Set(availableFiltered.map((c) => c.slug));
      setSelectedSlugs((prev) => prev.filter((s) => !slugsToRemove.has(s)));
    } else {
      const newSlugs = new Set([...selectedSlugs, ...availableFiltered.map((c) => c.slug)]);
      setSelectedSlugs(Array.from(newSlugs));
    }
  }

  function toggleSlug(slug: string) {
    if (existingSlugs.has(slug)) return;
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  const selectedCount = selectedSlugs.length;
  const categoriesToImport = defaultImportCategories.filter((c) => selectedSlugs.includes(c.slug));

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <div
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Import Preset Categories</h2>
            <p className="mt-1 text-sm text-stone-600">Select gadget categories to populate your catalog.</p>
          </div>
          <button aria-label="Close" className="icon-button" disabled={busy} onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter tabs and bulk action row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eadfca] py-3">
          <span className="rounded-sm bg-amber-700 px-2.5 py-1 text-xs font-medium text-white">
            Gadgets ({defaultImportCategories.length})
          </span>

          <div className="flex items-center gap-2">
            <button
              className="text-xs font-medium text-amber-800 underline-offset-4 hover:underline disabled:opacity-50"
              disabled={busy || availableFiltered.length === 0}
              onClick={toggleSelectAll}
              type="button"
            >
              {allFilteredSelected ? "Deselect Filtered" : "Select All Filtered"}
            </button>
            <span className="text-xs text-stone-400">|</span>
            <span className="text-xs font-semibold text-stone-700">{selectedCount} selected</span>
          </div>
        </div>

        {/* Categories scrollable list */}
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredCategories.map((cat) => {
            const isExisting = existingSlugs.has(cat.slug);
            const isSelected = selectedSlugs.includes(cat.slug);

            return (
              <div
                className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                  isExisting
                    ? "cursor-not-allowed border-stone-200 bg-stone-100/70 opacity-65"
                    : isSelected
                      ? "border-amber-400 bg-amber-50/50"
                      : "border-stone-200 bg-white hover:border-amber-300"
                }`}
                key={cat.slug}
                onClick={() => !isExisting && !busy && toggleSlug(cat.slug)}
              >
                <input
                  checked={isSelected && !isExisting}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500 disabled:cursor-not-allowed"
                  disabled={isExisting || busy}
                  onChange={() => toggleSlug(cat.slug)}
                  type="checkbox"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">{cat.name}</span>
                    <span className="inline-flex rounded-sm bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
                      {cat.type}
                    </span>
                    <span className="font-mono text-xs text-stone-500">/{cat.slug}</span>
                    {isExisting && (
                      <span className="inline-flex rounded-sm bg-stone-200 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                        Already exists
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-600">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal actions footer */}
        <div className="mt-4 flex items-center justify-between border-t border-[#eadfca] pt-4">
          <p className="text-xs text-stone-500">
            {selectedCount === 0
              ? "Select at least one category to import."
              : `${selectedCount} ${selectedCount === 1 ? "category" : "categories"} ready to import.`}
          </p>
          <div className="flex gap-2">
            <button className="secondary-button" disabled={busy} onClick={close} type="button">
              Cancel
            </button>
            <button
              className="primary-button"
              disabled={busy || selectedCount === 0}
              onClick={() => void onImport(categoriesToImport)}
              type="button"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Importing…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Import {selectedCount > 0 ? `(${selectedCount})` : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryForm({
  busy,
  close,
  initial,
  save,
}: {
  busy: boolean;
  close: () => void;
  initial: CategoryItem | null;
  save: (form: CategoryInput) => Promise<void>;
}) {
  const [form, setForm] = useState<CategoryInput>(
    initial
      ? { name: initial.name, slug: initial.slug, description: initial.description, status: initial.status }
      : categoryDefaults,
  );
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <form
        aria-modal="true"
        className="w-full max-w-lg rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          void save(form);
        }}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{initial ? "Edit category" : "Add category"}</h2>
            <p className="mt-1 text-sm text-stone-500">Use a unique slug for the category URL.</p>
          </div>
          <button aria-label="Close" className="icon-button" onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <Field label="Name">
            <input
              autoFocus
              className="input"
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                  slug: initial ? form.slug : normalizeSlug(event.target.value),
                })
              }
              required
              value={form.name}
            />
          </Field>
          <Field label="Slug">
            <input
              className="input"
              onChange={(event) => setForm({ ...form, slug: normalizeSlug(event.target.value) })}
              required
              value={form.slug}
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-36 resize-y"
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={6}
              value={form.description}
            />
          </Field>
          <Field label="Status">
            <select
              className="input"
              onChange={(event) => setForm({ ...form, status: event.target.value as CategoryInput["status"] })}
              value={form.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="secondary-button" onClick={close} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={busy} type="submit">
            {busy ? "Saving…" : "Save category"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Actions({ edit, remove, view }: { edit: () => void; remove: () => void; view: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <button aria-label="View category" className="icon-button" onClick={view} type="button">
        <Eye className="h-4 w-4" />
      </button>
      <button aria-label="Edit category" className="icon-button" onClick={edit} type="button">
        <Pencil className="h-4 w-4" />
      </button>
      <button
        aria-label="Delete category"
        className="icon-button border-red-100 text-red-700 hover:bg-red-50"
        onClick={remove}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function CategoryViewModal({ close, item }: { close: () => void; item: CategoryItem }) {
  const details = [
    ["Slug", item.slug],
    ["Status", item.status],
    ["Created", new Date(item.createdAt).toLocaleString()],
    ["Updated", new Date(item.updatedAt).toLocaleString()],
  ];
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="category-details-title"
        aria-modal="true"
        className="w-full max-w-xl rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl sm:p-6"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-stone-900" id="category-details-title">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-stone-500">Category details</p>
          </div>
          <button aria-label="Close category details" className="icon-button shrink-0" onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="mt-5 space-y-4">
          <section className="rounded-sm border border-[#eadfca] bg-white p-4">
            <h3 className="font-semibold text-stone-900">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">
              {item.description || "No description provided."}
            </p>
          </section>
          <dl className="overflow-hidden rounded-sm border border-[#eadfca] bg-white">
            {details.map(([label, value]) => (
              <div
                className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b border-stone-100 p-3 text-sm last:border-0"
                key={label}
              >
                <dt className="font-medium text-stone-500">{label}</dt>
                <dd className="break-words text-stone-900">
                  {label === "Status" ? <Status status={item.status} /> : value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
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

function Status({ status }: { status: "active" | "inactive" }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
    >
      {status}
    </span>
  );
}
