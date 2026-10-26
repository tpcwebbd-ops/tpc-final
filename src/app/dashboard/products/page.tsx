/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  ImagePlus,
  Loader2,
  PackageOpen,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import ProductStockTab from "@/components/dashboard-ui/ProductStockTab";
import { RichTextEditor, RichTextPreview } from "@/components/sections/section-1/RichTextEditor";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/global-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createProductDefaults, defaultImportCategories, normalizeSlug } from "@/lib/dashboard/catalog";
import {
  buildDemoProductPayload,
  DEMO_PRODUCTS,
  getDemo16Products,
  getDemo8Products,
  type RawDemoProduct,
} from "@/lib/dashboard/demoProductsData";
import {
  type CategoryItem,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/features/dashboard/categories/categoriesSlice";
import { useGetMediaQuery } from "@/redux/features/dashboard/media/mediaSlice";
import {
  type ProductInput,
  type ProductItem,
  type ProductListParams,
  type ProductListResponse,
  type ProductUpdateInput,
  useBulkDeleteProductsMutation,
  useBulkUpdateProductStatusMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/dashboard/products/productsSlice";

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;
const initialQuery: ProductListParams = { limit: 10, page: 1, search: "", status: "" };
const pageSizes = [10, 25, 50, 100] as const;

export type DemoProgress = {
  active: boolean;
  current: number;
  total: number;
  percentage: number;
  currentName: string;
  currentPrice: number;
  currentImage?: string;
  currentCategory?: string;
  statusMessage: string;
  isWaitingRateLimit: boolean;
  waitCountdown: number;
};

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"products" | "stock">("products");
  const [query, setQuery] = useState<ProductListParams>(initialQuery);
  const { data, error, isFetching, isLoading, refetch } = useGetProductsQuery(query);
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesQuery();
  const { data: mediaData } = useGetMediaQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [create, createState] = useCreateProductMutation();
  const [update, updateState] = useUpdateProductMutation();
  const [remove, removeState] = useDeleteProductMutation();
  const [bulkRemove, bulkRemoveState] = useBulkDeleteProductsMutation();
  const [bulkUpdateStatus, bulkUpdateStatusState] = useBulkUpdateProductStatusMutation();
  const confirmDelete = useConfirmDelete();
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [viewing, setViewing] = useState<ProductItem | null>(null);
  const [open, setOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoProgress, setDemoProgress] = useState<DemoProgress | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ProductItem["status"]>("draft");
  const busy =
    createState.isLoading ||
    updateState.isLoading ||
    removeState.isLoading ||
    bulkRemoveState.isLoading ||
    bulkUpdateStatusState.isLoading ||
    Boolean(demoProgress?.active);
  const categoryNames = useMemo(
    () => new Map((categoriesData?.items ?? []).map((item) => [item.id, item.name])),
    [categoriesData],
  );
  const defaultCategoryId = (categoriesData?.items ?? []).find((item) => item.status === "active")?.id ?? "";
  const defaultImageUrl = (mediaData?.items ?? []).find((item) => item.type === "picture")?.url ?? "";

  async function handleAddDemoProducts(productsToAdd: RawDemoProduct[]) {
    let activeCategories = (categoriesData?.items ?? []).filter((item) => item.status === "active");

    if (!activeCategories.length) {
      toast.info("Setting up categories from Category presets first...");
      try {
        for (const cat of defaultImportCategories) {
          try {
            await createCategory({
              description: cat.description,
              name: cat.name,
              slug: cat.slug,
              status: cat.status,
            }).unwrap();
          } catch {
            // ignore duplicate
          }
        }
        const updated = await refetchCategories()
          .unwrap()
          .catch(() => null);
        activeCategories = (updated?.items ?? []).filter((item) => item.status === "active");
      } catch {
        // fallback
      }
    }

    const fallbackCategory = activeCategories[0] || (categoriesData?.items ?? [])[0];
    if (!fallbackCategory) {
      toast.error("Please create or import categories on the Categories page before adding demo products.");
      return;
    }

    const count = productsToAdd.length;

    setDemoProgress({
      active: true,
      current: 0,
      total: count,
      percentage: 0,
      currentCategory: productsToAdd[0]?.categoryName ?? "",
      currentImage: productsToAdd[0]?.image ?? "",
      currentName: productsToAdd[0]?.name ?? "",
      currentPrice: productsToAdd[0]?.discountPrice ?? 0,
      isWaitingRateLimit: false,
      statusMessage: `Starting creation of ${count} demo products with real images and categories...`,
      waitCountdown: 0,
    });

    let createdCount = 0;

    for (let i = 0; i < count; i++) {
      const demo = productsToAdd[i];

      // Direct category matching from Categories page data
      const matchedCategory = (categoriesData?.items ?? []).find(
        (item) =>
          item.slug.toLowerCase() === demo.categorySlug.toLowerCase() ||
          item.name.toLowerCase() === demo.categoryName.toLowerCase(),
      );
      const assignedCategory = matchedCategory ? matchedCategory.id : activeCategories[0]?.id || fallbackCategory.id;
      const assignedImage = demo.image;

      let payload = buildDemoProductPayload({
        categoryId: assignedCategory,
        demo,
        imageUrl: assignedImage,
        index: i,
      });

      setDemoProgress({
        active: true,
        current: i,
        currentCategory: demo.categoryName,
        currentImage: demo.image,
        currentName: demo.name,
        currentPrice: demo.discountPrice,
        isWaitingRateLimit: false,
        percentage: Math.round((i / count) * 100),
        statusMessage: `Creating product ${i + 1} of ${count}: "${demo.name}"`,
        total: count,
        waitCountdown: 0,
      });

      let success = false;
      let retries = 0;
      const maxRetries = 6;

      while (!success && retries < maxRetries) {
        try {
          const token =
            typeof window !== "undefined" ? window.localStorage.getItem("token")?.replaceAll('"', "") : null;
          const res = await fetch("/api/dashboard/products/v1", {
            body: JSON.stringify(payload),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
            method: "POST",
          });

          if (res.status === 429) {
            const retryHeader = res.headers.get("Retry-After");
            let waitSec = retryHeader ? parseInt(retryHeader, 10) : 3;
            if (isNaN(waitSec) || waitSec <= 0) waitSec = 3;

            for (let sec = waitSec; sec > 0; sec--) {
              setDemoProgress((prev) =>
                prev
                  ? {
                      ...prev,
                      isWaitingRateLimit: true,
                      statusMessage: `Rate limit reached. Waiting ${sec}s to retry product ${i + 1}...`,
                      waitCountdown: sec,
                    }
                  : null,
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            retries++;
            continue;
          }

          if (res.status === 409) {
            // Slug or SKU conflict, generate new unique seed and retry
            payload = buildDemoProductPayload({
              categoryId: assignedCategory,
              demo,
              imageUrl: assignedImage,
              index: i + Math.floor(Math.random() * 10000) + 1,
            });
            retries++;
            continue;
          }

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `HTTP ${res.status}`);
          }

          success = true;
          createdCount++;
        } catch (err: unknown) {
          retries++;
          if (retries >= maxRetries) {
            const msg = err instanceof Error ? err.message : "Network error";
            toast.error(`Failed to create "${demo.name}": ${msg}`);
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Small pacing delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    setDemoProgress({
      active: false,
      current: count,
      currentName: "",
      currentPrice: 0,
      isWaitingRateLimit: false,
      percentage: 100,
      statusMessage: `Successfully added ${createdCount} of ${count} demo products!`,
      total: count,
      waitCountdown: 0,
    });

    toast.success(`Successfully created ${createdCount} demo product${createdCount === 1 ? "" : "s"}!`);
    await refetch();
    setSelectedIds([]);
    setQuery((current) => ({ ...current, page: 1 }));

    setTimeout(() => {
      setDemoProgress(null);
      setDemoModalOpen(false);
    }, 1200);
  }

  async function handleImportCategories() {
    try {
      let created = 0;
      for (const cat of defaultImportCategories) {
        try {
          await createCategory({
            description: cat.description,
            name: cat.name,
            slug: cat.slug,
            status: cat.status,
          }).unwrap();
          created++;
        } catch {
          // ignore duplicate
        }
      }
      await refetchCategories();
      if (created > 0) {
        toast.success(`Imported ${created} categories from Category page presets!`);
      } else {
        toast.info("Categories are already up to date.");
      }
    } catch {
      toast.error("Could not import categories.");
    }
  }

  function openCreate() {
    if (!defaultCategoryId || !defaultImageUrl) {
      toast.error("Add at least one active category and one Media Library image before creating a product.");
      return;
    }
    setEditing(null);
    setOpen(true);
  }

  async function save(form: ProductInput) {
    try {
      if (editing) {
        const payload: ProductUpdateInput = { ...form, id: editing.id };
        if (form.stock === editing.stock) delete payload.stock;
        await update(payload).unwrap();
      } else await create(form).unwrap();
      setOpen(false);
      toast.success(editing ? "Product updated successfully." : "Product created successfully.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not save product."));
    }
  }

  async function saveInventory(item: ProductItem, change: Pick<ProductItem, "status" | "stock">) {
    try {
      await update({ ...change, id: item.id }).unwrap();
      toast.success(`Inventory updated for “${item.name}”.`);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not update product inventory."));
      throw cause;
    }
  }

  async function destroy(item: ProductItem) {
    if (!(await confirmDelete(`Delete “${item.name}”? This cannot be undone.`))) return;
    try {
      await remove(item.id).unwrap();
      setSelectedIds((current) => current.filter((id) => id !== item.id));
      toast.success("Product deleted successfully.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete product."));
    }
  }

  const items = data?.items ?? [];
  const selectedOnPage = items.filter((item) => selectedIds.includes(item.id));
  const allOnPageSelected = items.length > 0 && selectedOnPage.length === items.length;
  const updateQuery = (next: ProductListParams) => {
    setSelectedIds([]);
    setQuery(next);
  };
  const toggleItem = (id: string, checked: boolean) =>
    setSelectedIds((current) => (checked ? [...new Set([...current, id])] : current.filter((itemId) => itemId !== id)));
  const togglePage = (checked: boolean) => setSelectedIds(checked ? items.map((item) => item.id) : []);

  async function deleteSelected() {
    if (!selectedIds.length) return;
    if (
      !(await confirmDelete(
        `Delete ${selectedIds.length} selected product${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`,
      ))
    )
      return;
    try {
      const result = await bulkRemove(selectedIds).unwrap();
      setSelectedIds([]);
      toast.success(`${result.deletedCount} product${result.deletedCount === 1 ? "" : "s"} deleted successfully.`);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete the selected products."));
    }
  }

  async function updateSelectedStatus() {
    if (!selectedIds.length) return;
    try {
      const result = await bulkUpdateStatus({ ids: selectedIds, status: bulkStatus }).unwrap();
      setSelectedIds([]);
      toast.success(`${result.updatedCount} product${result.updatedCount === 1 ? "" : "s"} updated to ${bulkStatus}.`);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not update the selected products."));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <Tabs onValueChange={(value) => setActiveTab(value === "stock" ? "stock" : "products")} value={activeTab}>
          <TabsList
            aria-label="Product management sections"
            className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-1"
          >
            <TabsTrigger
              aria-controls="products-tab-panel"
              className="rounded-sm px-4 py-2 text-sm font-semibold text-stone-600 transition data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm"
              id="products-tab"
              value="products"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              aria-controls="stock-tab-panel"
              className="rounded-sm px-4 py-2 text-sm font-semibold text-stone-600 transition data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm"
              id="stock-tab"
              value="stock"
            >
              Stock
            </TabsTrigger>
          </TabsList>
          <TabsContent
            aria-labelledby="products-tab"
            className="mt-5 pb-24 sm:pb-0"
            id="products-tab-panel"
            tabIndex={0}
            value="products"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-stone-900">Products</h1>
                <p className="mt-1 text-sm text-stone-600">
                  Manage catalog details, inventory, categories, rich descriptions, and images.
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                {data && data.total <= 1 ? (
                  <button
                    className="secondary-button flex-1 sm:flex-none"
                    disabled={busy}
                    onClick={() => setDemoModalOpen(true)}
                    type="button"
                  >
                    <Sparkles className="h-4 w-4 text-amber-600" /> Demo products
                  </button>
                ) : null}
                <button className="primary-button flex-1 sm:flex-none" onClick={openCreate} type="button">
                  <Plus className="h-4 w-4" /> Add product
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-sm bg-[#fffaf0] p-2.5 md:mt-5 md:gap-3 md:p-3 md:grid-cols-[minmax(0,1fr)_11rem_12rem]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  aria-label="Search products"
                  className="input pl-9"
                  onChange={(event) => updateQuery({ ...query, page: 1, search: event.target.value })}
                  placeholder="Search name, slug, or SKU"
                  value={query.search}
                />
              </label>
              <select
                aria-label="Filter by status"
                className="input"
                onChange={(event) =>
                  updateQuery({ ...query, page: 1, status: event.target.value as ProductListParams["status"] })
                }
                value={query.status}
              >
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="archived">Archived</option>
              </select>
              <select
                aria-label="Filter by category"
                className="input"
                onChange={(event) => updateQuery({ ...query, category: event.target.value || undefined, page: 1 })}
                value={query.category ?? ""}
              >
                <option value="">All categories</option>
                {(categoriesData?.items ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedIds.length ? (
              <div className="mt-4 flex flex-col gap-3 rounded-sm border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-amber-950">
                  {selectedIds.length} product{selectedIds.length === 1 ? "" : "s"} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Bulk product status"
                    className="h-9 rounded-sm border border-amber-200 bg-white px-3 text-sm"
                    onChange={(event) => setBulkStatus(event.target.value as ProductItem["status"])}
                    value={bulkStatus}
                  >
                    <option value="draft">Set draft</option>
                    <option value="active">Set active</option>
                    <option value="out_of_stock">Set out of stock</option>
                    <option value="archived">Set archived</option>
                  </select>
                  <button
                    className="secondary-button"
                    disabled={busy}
                    onClick={() => void updateSelectedStatus()}
                    type="button"
                  >
                    Update status
                  </button>
                  <button
                    className="secondary-button border-red-200 text-red-700 hover:bg-red-50"
                    disabled={busy}
                    onClick={() => void deleteSelected()}
                    type="button"
                  >
                    Delete selected
                  </button>
                </div>
              </div>
            ) : null}
            {error && (
              <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
                {errorMessage(error, "Could not load products.")}
              </p>
            )}
            {demoProgress && (
              <div className="mt-5 overflow-hidden rounded-sm border border-amber-300 bg-amber-50/90 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {demoProgress.isWaitingRateLimit ? (
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900 animate-pulse">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      </div>
                    ) : demoProgress.percentage === 100 ? (
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-900">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        {demoProgress.isWaitingRateLimit
                          ? `Rate limit reached. Retrying in ${demoProgress.waitCountdown}s...`
                          : demoProgress.percentage === 100
                            ? "Demo products creation completed!"
                            : `Creating Demo Products (${demoProgress.current + 1} of ${demoProgress.total})`}
                      </h4>
                      <p className="text-xs text-stone-600">
                        {demoProgress.currentName ? (
                          <>
                            Adding: <span className="font-medium text-stone-800">{demoProgress.currentName}</span>
                            {demoProgress.currentPrice > 0 && ` (৳${demoProgress.currentPrice.toFixed(2)})`}
                          </>
                        ) : (
                          demoProgress.statusMessage
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm border border-amber-200 bg-white px-2.5 py-1 text-xs font-bold text-amber-900 shadow-xs">
                      {demoProgress.percentage}%
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200/70">
                  <div
                    className={`h-full transition-all duration-300 ease-out ${
                      demoProgress.isWaitingRateLimit ? "bg-amber-500 animate-pulse" : "bg-emerald-600"
                    }`}
                    style={{ width: `${demoProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="mt-5 grid gap-3" role="status">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="h-24 animate-pulse rounded-sm bg-amber-50" key={index} />
                ))}
              </div>
            ) : !items.length ? (
              <div className="my-8 flex min-h-[380px] flex-col items-center justify-center rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffaf0]/60 px-6 py-12 text-center shadow-inner">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-100/90 text-amber-800 shadow-xs">
                  <PackageOpen className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">No products found</h3>
                <p className="mt-1.5 max-w-md text-sm text-stone-600">
                  {query.search || query.status || query.category
                    ? "No products match your current search or filter criteria. You can clear filters or add demo products."
                    : "Your product catalog is empty. You can add demo products with unique names and prices to quickly populate your store, or add a product manually."}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-sm border border-amber-600 bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={Boolean(demoProgress?.active)}
                    onClick={() => setDemoModalOpen(true)}
                    type="button"
                  >
                    <Sparkles className="h-4 w-4" />
                    Add Demo Products
                  </button>
                  <button
                    className="primary-button min-h-9 px-4 py-2"
                    disabled={busy || Boolean(demoProgress?.active)}
                    onClick={openCreate}
                    type="button"
                  >
                    <Plus className="h-4 w-4" /> Add product
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-sm border border-stone-200">
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[920px] text-left text-sm">
                    <thead className="bg-[#f8f0df] text-xs uppercase text-stone-500">
                      <tr>
                        <th className="w-12 p-3">
                          <Checkbox
                            aria-label="Select all products on this page"
                            checked={allOnPageSelected}
                            onCheckedChange={togglePage}
                          />
                        </th>
                        <th className="p-3">Product</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Categories</th>
                        <th className="p-3">Price / Stock</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <ProductRow
                          categories={categoryNames}
                          edit={() => {
                            setEditing(item);
                            setOpen(true);
                          }}
                          item={item}
                          key={item.id}
                          remove={() => void destroy(item)}
                          selected={selectedIds.includes(item.id)}
                          toggle={(checked) => toggleItem(item.id, checked)}
                          view={() => setViewing(item)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid gap-3 p-2.5 sm:p-3 lg:hidden">
                  {items.map((item) => (
                    <ProductCard
                      categories={categoryNames}
                      edit={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                      item={item}
                      key={item.id}
                      remove={() => void destroy(item)}
                      selected={selectedIds.includes(item.id)}
                      toggle={(checked) => toggleItem(item.id, checked)}
                      view={() => setViewing(item)}
                    />
                  ))}
                </div>
              </div>
            )}
            <ProductsPagination data={data} isFetching={isFetching} query={query} updateQuery={updateQuery} />
          </TabsContent>
          <TabsContent aria-labelledby="stock-tab" className="mt-5" id="stock-tab-panel" tabIndex={0} value="stock">
            <ProductStockTab
              data={data}
              error={error}
              isLoading={isLoading}
              isSaving={updateState.isLoading}
              items={items}
              onSaveInventory={saveInventory}
              onViewProduct={setViewing}
              pagination={
                <ProductsPagination data={data} isFetching={isFetching} query={query} updateQuery={updateQuery} />
              }
            />
          </TabsContent>
        </Tabs>
      </section>
      {open && (
        <ProductForm
          busy={busy}
          categories={categoriesData?.items ?? []}
          defaultCategoryId={defaultCategoryId}
          defaultImageUrl={defaultImageUrl}
          close={() => setOpen(false)}
          initial={editing}
          save={save}
        />
      )}
      {viewing && <ProductViewModal categories={categoryNames} close={() => setViewing(null)} item={viewing} />}
      {demoModalOpen && (
        <DemoProductsModal
          busy={busy}
          categories={categoriesData?.items ?? []}
          close={() => {
            if (!demoProgress?.active) setDemoModalOpen(false);
          }}
          onAdd={handleAddDemoProducts}
          onImportCategories={handleImportCategories}
          progress={demoProgress}
        />
      )}
    </main>
  );
}

function ProductsPagination({
  data,
  isFetching,
  query,
  updateQuery,
}: {
  data?: ProductListResponse;
  isFetching: boolean;
  query: ProductListParams;
  updateQuery: (next: ProductListParams) => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        {data
          ? `Showing ${data.total ? ((data.page - 1) * data.limit + 1).toLocaleString() : 0}–${Math.min(data.page * data.limit, data.total).toLocaleString()} of ${data.total.toLocaleString()} products`
          : ""}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span>Per page</span>
          <select
            aria-label="Products per page"
            className="h-9 rounded-sm border border-[#eadfca] bg-white px-2"
            onChange={(event) => updateQuery({ ...query, limit: Number(event.target.value), page: 1 })}
            value={query.limit ?? 10}
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
          disabled={!data || data.page <= 1}
          onClick={() => updateQuery({ ...query, page: Math.max(1, (query.page ?? 1) - 1) })}
          type="button"
        >
          Previous
        </button>
        <span className="min-w-20 text-center font-medium text-stone-800">
          Page {data?.page ?? 1} of {data?.totalPages ?? 1}
        </span>
        <button
          aria-label="Next page"
          className="secondary-button"
          disabled={!data || data.page >= data.totalPages}
          onClick={() => updateQuery({ ...query, page: (query.page ?? 1) + 1 })}
          type="button"
        >
          Next
        </button>
        {isFetching && <span className="text-xs text-stone-400">Updating…</span>}
      </div>
    </div>
  );
}

function DemoProductsModal({
  busy,
  categories,
  close,
  onAdd,
  onImportCategories,
  progress,
}: {
  busy: boolean;
  categories: CategoryItem[];
  close: () => void;
  onAdd: (products: RawDemoProduct[]) => Promise<void>;
  onImportCategories: () => Promise<void>;
  progress: DemoProgress | null;
}) {
  const isRunning = Boolean(progress?.active);
  const activeCategories = categories.filter((c) => c.status === "active");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSettingUpCategories, setIsSettingUpCategories] = useState(false);

  const preset8 = useMemo(() => getDemo8Products(), []);
  const preset16 = useMemo(() => getDemo16Products(), []);
  const presetAll = DEMO_PRODUCTS;

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return DEMO_PRODUCTS;
    return DEMO_PRODUCTS.filter((p) => p.categorySlug === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-stone-950/40 p-4 backdrop-blur-xs">
      <div
        aria-modal="true"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-800">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Add Demo Products</h2>
              <p className="text-xs text-stone-600">
                Populate your store with curated products, real high-res images, and categories from your Categories
                page.
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            className="icon-button shrink-0"
            disabled={isRunning}
            onClick={close}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {/* Categories connection status banner */}
          {activeCategories.length === 0 ? (
            <div className="mt-3 rounded-sm border border-amber-300 bg-amber-50 p-3.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-950">
                    No active categories found on the Category page
                  </p>
                  <p className="mt-1 text-xs text-amber-900">
                    Demo products are organized by eight gadget categories. You can auto-import those categories now, or
                    manage them on the Categories page.
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-sm bg-amber-800 px-2.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-amber-900 disabled:opacity-50"
                      disabled={isSettingUpCategories || isRunning}
                      onClick={async () => {
                        setIsSettingUpCategories(true);
                        await onImportCategories();
                        setIsSettingUpCategories(false);
                      }}
                      type="button"
                    >
                      {isSettingUpCategories ? "Importing categories…" : "Auto-Import 8 Gadget Categories"}
                    </button>
                    <Link
                      className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
                      href="/dashboard/category"
                      onClick={close}
                    >
                      Visit Categories page <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                <span className="truncate font-medium text-emerald-950">
                  Connected to {activeCategories.length} categories from Category page (
                  {activeCategories
                    .map((c) => c.name)
                    .slice(0, 3)
                    .join(", ")}
                  {activeCategories.length > 3 ? "…" : ""})
                </span>
              </div>
              <Link
                className="inline-flex shrink-0 items-center gap-1 font-medium text-emerald-800 underline-offset-2 hover:underline"
                href="/dashboard/category"
                onClick={close}
              >
                View categories <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Real progress card when importing */}
          {progress && (
            <div className="mt-3 rounded-sm border border-amber-300 bg-amber-50/90 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {progress.isWaitingRateLimit ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-amber-700" />
                  ) : progress.percentage === 100 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-700" />
                  )}
                  <span className="text-xs font-semibold text-stone-900">
                    {progress.isWaitingRateLimit
                      ? `Rate limit reached. Retrying in ${progress.waitCountdown}s...`
                      : progress.percentage === 100
                        ? "Demo products added successfully!"
                        : `Creating product ${progress.current + 1} of ${progress.total}`}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-900">{progress.percentage}%</span>
              </div>

              {/* Real status bar */}
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-amber-200/70">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    progress.isWaitingRateLimit ? "bg-amber-500 animate-pulse" : "bg-emerald-600"
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              {progress.currentName && (
                <div className="mt-3 flex items-center gap-2.5 rounded-xs border border-amber-200/80 bg-white/80 p-2">
                  {progress.currentImage && (
                    <Image
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-xs border object-cover"
                      height={40}
                      src={progress.currentImage}
                      width={40}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-stone-900">{progress.currentName}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-stone-500">
                      {progress.currentCategory && (
                        <span className="rounded-xs bg-amber-100 px-1 py-0.2 font-medium text-amber-900">
                          {progress.currentCategory}
                        </span>
                      )}
                      {progress.currentPrice > 0 && (
                        <span className="font-semibold text-emerald-700">৳{progress.currentPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {progress.isWaitingRateLimit && (
                <div className="mt-2.5 flex items-center gap-1.5 rounded-xs bg-amber-100/90 px-2 py-1 text-[11px] text-amber-900">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-800" />
                  <span>API rate limit encountered (60 req/min). Waiting to safely resume without errors.</span>
                </div>
              )}
            </div>
          )}

          {/* Quick preset cards */}
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            <button
              className="group flex flex-col justify-between rounded-sm border border-stone-200 bg-white p-3 text-left transition hover:border-amber-400 hover:bg-amber-50/40 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy || isRunning}
              onClick={() => void onAdd(preset8)}
              type="button"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-stone-900">8 Products</span>
                  <span className="rounded-xs bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                    1 per Category
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  1 item each across all 8 gadget categories with real product photos (~4 sec).
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-amber-700 transition-transform group-hover:translate-x-0.5">
                Add 8 Products →
              </span>
            </button>

            <button
              className="group flex flex-col justify-between rounded-sm border border-amber-300 bg-amber-50/50 p-3 text-left transition hover:border-amber-500 hover:bg-amber-100/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy || isRunning}
              onClick={() => void onAdd(preset16)}
              type="button"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-stone-900">16 Products</span>
                  <span className="rounded-xs bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                    Recommended
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  2 products per gadget category with real product photos (~8 sec).
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-amber-800 transition-transform group-hover:translate-x-0.5">
                Add 16 Products →
              </span>
            </button>

            <button
              className="group flex flex-col justify-between rounded-sm border border-stone-200 bg-white p-3 text-left transition hover:border-amber-400 hover:bg-amber-50/40 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy || isRunning}
              onClick={() => void onAdd(presetAll)}
              type="button"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-stone-900">All 40 Products</span>
                  <span className="rounded-xs bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-800">
                    Full Catalog
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  All 40 curated gadget products with real imagery (~25 sec).
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-amber-700 transition-transform group-hover:translate-x-0.5">
                Add All 40 →
              </span>
            </button>
          </div>

          {/* Filter preview by Category & Real Image Showcase */}
          <div className="mt-4 border-t border-[#eadfca] pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">Preview by Category:</span>
                <select
                  className="h-8 rounded-sm border border-stone-300 bg-white px-2.5 text-xs text-stone-800"
                  disabled={isRunning}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                >
                  <option value="all">All Categories ({DEMO_PRODUCTS.length} products)</option>
                  {Array.from(new Set(DEMO_PRODUCTS.map((p) => p.categorySlug))).map((slug) => {
                    const item = DEMO_PRODUCTS.find((p) => p.categorySlug === slug);
                    const count = DEMO_PRODUCTS.filter((p) => p.categorySlug === slug).length;
                    return (
                      <option key={slug} value={slug}>
                        {item?.categoryName ?? slug} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
              {selectedCategory !== "all" && (
                <button
                  className="secondary-button h-8 text-xs font-semibold"
                  disabled={busy || isRunning}
                  onClick={() => void onAdd(filteredProducts)}
                  type="button"
                >
                  Add these {filteredProducts.length} products
                </button>
              )}
            </div>

            {/* Real product cards preview list */}
            <div className="mt-2.5 max-h-52 space-y-1.5 overflow-y-auto pr-1">
              {filteredProducts.map((p, idx) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-sm border border-stone-200 bg-white p-2 text-xs"
                  key={idx}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      alt={p.name}
                      className="h-10 w-10 shrink-0 rounded-xs border object-cover"
                      height={40}
                      src={p.image}
                      width={40}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-stone-900">{p.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="rounded-xs bg-amber-100 px-1 py-0.2 text-[10px] font-medium text-amber-900">
                          {p.categoryName}
                        </span>
                        <span className="text-[10px] text-stone-400">/{p.categorySlug}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-semibold text-emerald-800">৳{p.discountPrice.toFixed(0)}</span>
                    <span className="ml-1 text-[10px] text-stone-400 line-through">৳{p.realPrice.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-[#eadfca] pt-3">
          <p className="text-xs text-stone-500">
            {isRunning ? "Creating products in your catalog…" : "Products are assigned to matching categories."}
          </p>
          <button className="secondary-button" disabled={isRunning} onClick={close} type="button">
            {isRunning ? "Running in background…" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  categories,
  edit,
  item,
  remove,
  selected,
  toggle,
  view,
}: {
  categories: Map<string, string>;
  edit: () => void;
  item: ProductItem;
  remove: () => void;
  selected: boolean;
  toggle: (checked: boolean) => void;
  view: () => void;
}) {
  return (
    <tr className="border-t border-stone-100">
      <td className="p-3">
        <Checkbox aria-label={`Select ${item.name}`} checked={selected} onCheckedChange={toggle} />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <Image
            alt=""
            className="h-11 w-11 rounded-sm border object-cover"
            height={44}
            src={item.primaryImage}
            width={44}
          />
          <div className="min-w-0">
            <p className="max-w-48 truncate font-medium text-stone-900">{item.name}</p>
            <p className="max-w-48 truncate text-xs text-stone-500">{item.slug}</p>
          </div>
        </div>
      </td>
      <td className="p-3 text-stone-600">{item.sku}</td>
      <td className="max-w-48 p-3 text-stone-600">
        {item.categories.map((id) => categories.get(id) ?? "Unknown").join(", ")}
      </td>
      <td className="p-3 text-stone-600">
        ৳{item.discountPrice.toFixed(2)} <span className="text-xs line-through">৳{item.realPrice.toFixed(2)}</span>{" "}
        <span className="text-xs">/ {item.stock} in stock</span>
      </td>
      <td className="p-3">
        <Status status={item.status} />
      </td>
      <td className="p-3">
        <Actions edit={edit} remove={remove} view={view} />
      </td>
    </tr>
  );
}
function ProductCard({
  categories,
  edit,
  item,
  remove,
  selected,
  toggle,
  view,
}: {
  categories: Map<string, string>;
  edit: () => void;
  item: ProductItem;
  remove: () => void;
  selected: boolean;
  toggle: (checked: boolean) => void;
  view: () => void;
}) {
  return (
    <article className="rounded-sm border border-[#eadfca] bg-white p-3 shadow-[0_10px_24px_-22px_rgba(120,53,15,.45)]">
      <div className="flex min-w-0 gap-3">
        <Checkbox aria-label={`Select ${item.name}`} checked={selected} onCheckedChange={toggle} />
        <Image
          alt=""
          className="h-16 w-16 shrink-0 rounded-sm border border-[#eadfca] bg-[#fffaf0] object-cover"
          height={64}
          src={item.primaryImage}
          width={64}
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-stone-900">{item.name}</p>
          <p className="mt-0.5 truncate text-xs text-stone-500">{item.sku}</p>
          <p className="mt-2 truncate text-xs text-stone-600">
            {item.categories.map((id) => categories.get(id) ?? "Unknown").join(", ")}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-sm font-semibold text-stone-900">
              ৳{item.discountPrice.toFixed(2)} <span className="font-normal text-stone-500">· {item.stock} stock</span>
            </span>
            <Status status={item.status} />
          </div>
        </div>
      </div>
      <Actions edit={edit} mobile remove={remove} view={view} />
    </article>
  );
}

function ProductForm({
  busy,
  categories,
  defaultCategoryId,
  defaultImageUrl,
  close,
  initial,
  save,
}: {
  busy: boolean;
  categories: { id: string; name: string; status: "active" | "inactive" }[];
  defaultCategoryId: string;
  defaultImageUrl: string;
  close: () => void;
  initial: ProductItem | null;
  save: (form: ProductInput) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductInput>(
    initial
      ? { ...initial, taxRate: initial.taxRate ?? 0, shippingCost: initial.shippingCost ?? 0 }
      : createProductDefaults({ categoryId: defaultCategoryId, imageUrl: defaultImageUrl }),
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [picker, setPicker] = useState<"primary" | "gallery" | null>(null);
  const visibleCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.trim().toLowerCase()),
  );
  function selectImage(url: string) {
    if (picker === "primary") setForm({ ...form, primaryImage: url, images: [...new Set([...form.images, url])] });
    if (picker === "gallery")
      setForm({ ...form, images: [...new Set([...form.images, url])], primaryImage: form.primaryImage || url });
    setPicker(null);
  }
  function toggleCategory(id: string) {
    setForm({
      ...form,
      categories: form.categories.includes(id)
        ? form.categories.filter((value) => value !== id)
        : [...form.categories, id],
    });
  }
  function removeImage(url: string) {
    const images = form.images.filter((image) => image !== url);
    setForm({ ...form, images, primaryImage: form.primaryImage === url ? (images[0] ?? "") : form.primaryImage });
  }
  function updatePrices(realPrice: number, discountPrice: number) {
    const discount = realPrice > 0 ? Number((((realPrice - discountPrice) / realPrice) * 100).toFixed(2)) : 0;
    setForm({ ...form, realPrice, discountPrice, discount });
  }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <form
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          void save(form);
        }}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{initial ? "Edit product" : "Add product"}</h2>
            <p className="mt-1 text-sm text-stone-500">
              Use the Media Library for images and select one or more categories.
            </p>
          </div>
          <button aria-label="Close" className="icon-button" onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="grid content-start gap-4">
            <Field label="Product name">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug">
                <input
                  className="input"
                  onChange={(event) => setForm({ ...form, slug: normalizeSlug(event.target.value) })}
                  required
                  value={form.slug}
                />
              </Field>
              <Field label="SKU">
                <input
                  className="input"
                  onChange={(event) => setForm({ ...form, sku: event.target.value })}
                  required
                  value={form.sku}
                />
              </Field>
            </div>
            <Field label="Short description">
              <textarea
                className="input min-h-24 resize-y"
                maxLength={500}
                onChange={(event) => setForm({ ...form, shortDescription: event.target.value })}
                required
                rows={4}
                value={form.shortDescription}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Real price">
                <input
                  className="input"
                  min="0"
                  onChange={(event) =>
                    updatePrices(Number(event.target.value), Math.min(Number(event.target.value), form.discountPrice))
                  }
                  required
                  step="0.01"
                  type="number"
                  value={form.realPrice}
                />
              </Field>
              <Field label="Discount price">
                <input
                  className="input"
                  max={form.realPrice}
                  min="0"
                  onChange={(event) => updatePrices(form.realPrice, Number(event.target.value))}
                  required
                  step="0.01"
                  type="number"
                  value={form.discountPrice}
                />
              </Field>
              <Field label="Discount (%)">
                <input className="input cursor-not-allowed bg-stone-100" readOnly type="number" value={form.discount} />
              </Field>
              <Field label="Tax (%)">
                <input
                  className="input"
                  max="100"
                  min="0"
                  onChange={(event) => setForm({ ...form, taxRate: Number(event.target.value) })}
                  required
                  step="0.01"
                  type="number"
                  value={form.taxRate ?? 0}
                />
              </Field>
              <Field label="Shipping cost (৳ / unit)">
                <input
                  className="input"
                  min="0"
                  onChange={(event) => setForm({ ...form, shippingCost: Number(event.target.value) })}
                  required
                  step="0.01"
                  type="number"
                  value={form.shippingCost ?? 0}
                />
              </Field>
              <Field label="Stock">
                <input
                  className="input"
                  min="0"
                  onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
                  required
                  step="1"
                  type="number"
                  value={form.stock}
                />
              </Field>
              <Field label="Average rating">
                <input
                  className="input"
                  max="5"
                  min="0"
                  onChange={(event) => setForm({ ...form, star: Number(event.target.value) })}
                  required
                  step="0.1"
                  type="number"
                  value={form.star}
                />
              </Field>
              <Field label="Brand">
                <input
                  className="input"
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                  required
                  value={form.brand}
                />
              </Field>
            </div>
            <Field label="Status">
              <select
                className="input"
                onChange={(event) => setForm({ ...form, status: event.target.value as ProductInput["status"] })}
                value={form.status}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-[#eadfca] bg-white p-3 text-sm font-medium text-stone-700">
              <input
                checked={form.isFeatured}
                onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
                type="checkbox"
              />{" "}
              Featured product
            </label>
            <Field label="Description">
              <RichTextEditor
                onChange={(description) => setForm((current) => ({ ...current, description }))}
                value={form.description}
              />
            </Field>
          </section>
          <section className="grid content-start gap-4">
            <Field label="Categories">
              <div className="rounded-sm border border-[#eadfca] bg-white p-3">
                <input
                  className="input"
                  onChange={(event) => setCategorySearch(event.target.value)}
                  placeholder="Search categories"
                  value={categorySearch}
                />
                <div className="mt-3 max-h-44 space-y-1 overflow-y-auto">
                  {visibleCategories.map((category) => (
                    <label
                      className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-amber-50"
                      key={category.id}
                    >
                      <input
                        checked={form.categories.includes(category.id)}
                        disabled={category.status !== "active" && !form.categories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        type="checkbox"
                      />
                      <span>{category.name}</span>
                      {category.status === "inactive" && <span className="text-xs text-stone-400">Inactive</span>}
                    </label>
                  ))}
                  {!visibleCategories.length && <p className="p-2 text-sm text-stone-500">No categories found.</p>}
                </div>
                <p className="mt-2 text-xs text-stone-500">{form.categories.length} selected</p>
              </div>
            </Field>
            <Field label="Delivery time">
              <input
                className="input"
                onChange={(event) => setForm({ ...form, deliveryTime: event.target.value })}
                required
                value={form.deliveryTime}
              />
            </Field>
            <Field label="Warranty">
              <textarea
                className="input min-h-24 resize-y"
                onChange={(event) => setForm({ ...form, warranty: event.target.value })}
                required
                rows={4}
                value={form.warranty}
              />
            </Field>
            <Field label="Product video (optional YouTube URL)">
              <input
                className="input"
                onChange={(event) => setForm({ ...form, video: event.target.value })}
                placeholder="https://youtu.be/..."
                value={form.video}
              />
            </Field>
            <Field label="Main features (one per line)">
              <textarea
                className="input min-h-36 resize-y"
                onChange={(event) =>
                  setForm({
                    ...form,
                    mainFeatures: event.target.value
                      .split("\n")
                      .map((feature) => feature.trim())
                      .filter(Boolean),
                  })
                }
                required
                rows={6}
                value={form.mainFeatures.join("\n")}
              />
            </Field>
            <Field label="Primary image">
              <ImageSelect label="Choose primary image" onClick={() => setPicker("primary")} url={form.primaryImage} />
            </Field>
            <Field label="Product images">
              <div className="rounded-sm border border-[#eadfca] bg-white p-3">
                <button className="secondary-button" onClick={() => setPicker("gallery")} type="button">
                  <ImagePlus className="h-4 w-4" /> Add from Media Library
                </button>
                {form.images.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {form.images.map((url) => (
                      <div className="group relative aspect-square" key={url}>
                        <Image
                          alt="Product gallery image"
                          className={`h-full w-full rounded-sm border object-cover ${url === form.primaryImage ? "border-amber-500 ring-2 ring-amber-200" : "border-stone-200"}`}
                          fill
                          sizes="150px"
                          src={url}
                        />
                        <button
                          aria-label="Remove image"
                          className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-sm bg-red-700 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          onClick={() => removeImage(url)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-stone-500">Select one or more images from the Media Library.</p>
                )}
              </div>
            </Field>
          </section>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="secondary-button" onClick={close} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={busy} type="submit">
            {busy ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
      {picker && (
        <ImagePickerModal
          close={() => setPicker(null)}
          description={
            picker === "primary"
              ? "Choose the image shown first for this product."
              : "Choose an image to add to this product gallery."
          }
          onSelect={selectImage}
          selectedUrl={picker === "primary" ? form.primaryImage : ""}
          title={picker === "primary" ? "Choose primary image" : "Add product image"}
          uploadLabel="Upload product image"
        />
      )}
    </div>
  );
}

function ImageSelect({ label, onClick, url }: { label: string; onClick: () => void; url: string }) {
  return (
    <div className="rounded-sm border border-[#eadfca] bg-white p-3">
      {url ? (
        <div className="relative aspect-video overflow-hidden rounded-sm">
          <Image
            alt="Primary product image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            src={url}
          />
        </div>
      ) : (
        <div className="grid aspect-video place-items-center rounded-sm bg-amber-50 text-sm text-stone-500">
          No primary image selected
        </div>
      )}
      <button className="secondary-button mt-3" onClick={onClick} type="button">
        <ImagePlus className="h-4 w-4" /> {label}
      </button>
    </div>
  );
}
function Actions({
  edit,
  mobile = false,
  remove,
  view,
}: {
  edit: () => void;
  mobile?: boolean;
  remove: () => void;
  view: () => void;
}) {
  if (mobile) {
    return (
      <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-2.5">
        <button aria-label="Edit product" className="secondary-button h-9 px-3 text-xs" onClick={edit} type="button">
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <div className="ml-auto flex gap-1">
          <button aria-label="View product" className="icon-button h-9 w-9" onClick={view} type="button">
            <Eye className="h-4 w-4" />
          </button>
          <button
            aria-label="Delete product"
            className="icon-button h-9 w-9 border-red-100 text-red-700 hover:bg-red-50"
            onClick={remove}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <button aria-label="View product" className="icon-button" onClick={view} type="button">
        <Eye className="h-4 w-4" />
      </button>
      <button aria-label="Edit product" className="icon-button" onClick={edit} type="button">
        <Pencil className="h-4 w-4" />
      </button>
      <button
        aria-label="Delete product"
        className="icon-button border-red-100 text-red-700 hover:bg-red-50"
        onClick={remove}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function ProductViewModal({
  categories,
  close,
  item,
}: {
  categories: Map<string, string>;
  close: () => void;
  item: ProductItem;
}) {
  const videoUrl = youtubeEmbedUrl(item.video);
  const details = [
    ["SKU", item.sku],
    ["Brand", item.brand],
    ["Stock", `${item.stock} available`],
    ["Rating", `${item.star.toFixed(1)} / 5`],
    ["Tax", `${item.taxRate ?? 0}%`],
    ["Shipping", `৳${(item.shippingCost ?? 0).toFixed(2)} / unit`],
    ["Delivery", item.deliveryTime],
    ["Warranty", item.warranty],
    ["Featured", item.isFeatured ? "Yes" : "No"],
    ["Created", new Date(item.createdAt).toLocaleString()],
    ["Updated", new Date(item.updatedAt).toLocaleString()],
  ];
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl sm:p-6"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfca] pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              alt={item.name}
              className="h-14 w-14 shrink-0 rounded-sm border border-[#eadfca] object-cover"
              height={56}
              src={item.primaryImage}
              width={56}
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-stone-900" id="product-details-title">
                {item.name}
              </h2>
              <p className="mt-1 truncate text-sm text-stone-500">{item.slug}</p>
            </div>
          </div>
          <button aria-label="Close product details" className="icon-button shrink-0" onClick={close} type="button">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,.9fr)]">
          <div className="space-y-5">
            <div className="relative aspect-video overflow-hidden rounded-sm border border-[#eadfca] bg-white">
              <Image
                alt={item.name}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                src={item.primaryImage}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {item.images.map((url) => (
                <div className="relative aspect-square overflow-hidden rounded-sm border border-[#eadfca]" key={url}>
                  <Image alt={`${item.name} gallery image`} className="object-cover" fill sizes="120px" src={url} />
                </div>
              ))}
            </div>
            <section className="rounded-sm border border-[#eadfca] bg-white p-4">
              <h3 className="font-semibold text-stone-900">Description</h3>
              <p className="mt-2 text-sm text-stone-600">{item.shortDescription}</p>
              <div className="mt-4 border-t border-stone-100 pt-4">
                <RichTextPreview value={item.description} />
              </div>
            </section>
            {videoUrl && (
              <section className="overflow-hidden rounded-sm border border-[#eadfca] bg-white">
                <iframe allowFullScreen className="aspect-video w-full" src={videoUrl} title={`${item.name} video`} />
              </section>
            )}
          </div>
          <div className="space-y-4">
            <section className="rounded-sm border border-[#eadfca] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Status status={item.status} />
                <span className="rounded-sm bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                  {item.discount}% off
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-stone-900">৳{item.discountPrice.toFixed(2)}</p>
                <p className="mt-1 text-sm text-stone-500 line-through">৳{item.realPrice.toFixed(2)}</p>
              </div>
            </section>
            <section className="rounded-sm border border-[#eadfca] bg-white p-4">
              <h3 className="font-semibold text-stone-900">Categories</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.categories.map((id) => (
                  <span className="rounded-sm bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800" key={id}>
                    {categories.get(id) ?? "Unknown category"}
                  </span>
                ))}
              </div>
            </section>
            <section className="rounded-sm border border-[#eadfca] bg-white p-4">
              <h3 className="font-semibold text-stone-900">Main features</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                {item.mainFeatures.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <span className="text-emerald-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
            <dl className="overflow-hidden rounded-sm border border-[#eadfca] bg-white">
              {details.map(([label, value]) => (
                <div
                  className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border-b border-stone-100 p-3 text-sm last:border-0"
                  key={label}
                >
                  <dt className="font-medium text-stone-500">{label}</dt>
                  <dd className="break-words text-stone-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function youtubeEmbedUrl(value: string) {
  const id = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
}
function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
function Status({ status }: { status: ProductItem["status"] }) {
  const color =
    status === "active"
      ? "bg-emerald-100 text-emerald-800"
      : status === "draft"
        ? "bg-amber-100 text-amber-900"
        : "bg-stone-100 text-stone-600";
  return <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${color}`}>{status}</span>;
}
