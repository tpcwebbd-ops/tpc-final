/*
|-----------------------------------------
| setting up ProductStockTab.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 September, 2026
|-----------------------------------------
*/

"use client";

import { Eye, Loader2, PackageOpen, Save } from "lucide-react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useState } from "react";

import { toast } from "@/components/ui/global-toast";
import { Switch } from "@/components/ui/switch";
import {
  useGetOrderSettingsQuery,
  useUpdateOrderSettingsMutation,
} from "@/redux/features/dashboard/orders/orderSettingsSlice";
import { type ProductItem, type ProductListResponse } from "@/redux/features/dashboard/products/productsSlice";

const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

type InventoryChange = Pick<ProductItem, "status" | "stock">;

type ProductStockTabProps = {
  data?: ProductListResponse;
  error: unknown;
  isLoading: boolean;
  isSaving: boolean;
  items: ProductItem[];
  onSaveInventory: (item: ProductItem, change: InventoryChange) => Promise<void>;
  onViewProduct: (item: ProductItem) => void;
  pagination: ReactNode;
};

export default function ProductStockTab({
  data,
  error,
  isLoading,
  isSaving,
  items,
  onSaveInventory,
  onViewProduct,
  pagination,
}: ProductStockTabProps) {
  const { data: settingsData, error: settingsError, isLoading: settingsLoading } = useGetOrderSettingsQuery();
  const [updateSettings, updateSettingsState] = useUpdateOrderSettingsMutation();
  const settings = settingsData?.settings;

  async function updateStockCheck(allowOrdersWithoutStockCheck: boolean) {
    if (!settings) return;
    try {
      await updateSettings({
        allowOrdersWithoutStockCheck,
        orderLimitEnabled: settings.orderLimitEnabled,
        orderLimitMaxOrders: settings.orderLimitMaxOrders,
        orderLimitMinutes: settings.orderLimitMinutes,
      }).unwrap();
      toast.success(
        allowOrdersWithoutStockCheck
          ? "Orders can now be placed when stock is insufficient."
          : "Orders will now require sufficient stock.",
      );
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not update the stock-check setting."));
    }
  }

  return (
    <div className="space-y-5">
      <section aria-labelledby="stock-check-heading" className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-xl font-semibold text-stone-900" id="stock-check-heading">
              Stock
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Update inventory and availability. Product availability uses the existing product status.
            </p>
          </div>
          {settingsLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-sm bg-amber-100" role="status">
              <span className="sr-only">Loading stock-check setting</span>
            </div>
          ) : settingsError ? (
            <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {errorMessage(settingsError, "Could not load the stock-check setting.")}
            </p>
          ) : settings ? (
            <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-white p-3">
              <div className="min-w-0 text-right">
                <p className="text-sm font-semibold text-stone-900">Allow orders without stock check</p>
                <p className="text-xs text-stone-600" id="stock-check-description">
                  {settings.allowOrdersWithoutStockCheck
                    ? "Enabled: active products can be ordered when stock is insufficient."
                    : "Disabled: checkout requires sufficient stock for every active product."}
                </p>
              </div>
              <Switch
                aria-describedby="stock-check-description"
                aria-label="Allow orders without stock check"
                checked={settings.allowOrdersWithoutStockCheck}
                disabled={updateSettingsState.isLoading}
                onCheckedChange={(checked) => void updateStockCheck(checked)}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="inventory-heading" className="rounded-sm border border-[#eadfca] bg-white p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900" id="inventory-heading">
              Inventory
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {data
                ? `${data.summary.totalStock.toLocaleString()} total units across ${data.summary.inStock.toLocaleString()} products with stock.`
                : "Manage the current product page."}
            </p>
          </div>
        </div>

        {error ? (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
            {errorMessage(error, "Could not load products.")}
          </p>
        ) : isLoading ? (
          <div className="mt-5 grid gap-3" role="status">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="h-28 animate-pulse rounded-sm bg-amber-50" key={index} />
            ))}
          </div>
        ) : !items.length ? (
          <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffaf0]/60 px-6 py-12 text-center">
            <PackageOpen className="h-8 w-8 text-amber-800" />
            <h3 className="mt-3 font-semibold text-stone-900">No products found</h3>
            <p className="mt-1 text-sm text-stone-600">
              Add products from the Products tab to manage their inventory here.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <StockItemForm
                item={item}
                isSaving={isSaving}
                key={`${item.id}-${item.stock}-${item.status}`}
                onSave={onSaveInventory}
                onView={onViewProduct}
              />
            ))}
          </div>
        )}

        {pagination}
      </section>
    </div>
  );
}

function StockItemForm({
  item,
  isSaving,
  onSave,
  onView,
}: {
  item: ProductItem;
  isSaving: boolean;
  onSave: (item: ProductItem, change: InventoryChange) => Promise<void>;
  onView: (item: ProductItem) => void;
}) {
  const [stock, setStock] = useState(String(item.stock));
  const [status, setStatus] = useState<ProductItem["status"]>(item.status);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextStock = Number(stock);
    if (!Number.isInteger(nextStock) || nextStock < 0) {
      toast.error("Stock quantity must be a whole number of zero or more.");
      return;
    }

    setSaving(true);
    try {
      await onSave(item, { status, stock: nextStock });
    } catch {
      // The shared product mutation already displays its normalized error message.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="rounded-sm border border-stone-200 bg-[#fffaf0]/60 p-3" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-3 sm:grid-cols-[minmax(13rem,1fr)_10rem_13rem_auto] sm:items-end">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            alt={item.name}
            className="h-11 w-11 shrink-0 rounded-sm border border-[#eadfca] object-cover"
            height={44}
            src={item.primaryImage}
            width={44}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-900" title={item.name}>
              {item.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-stone-500">SKU: {item.sku}</p>
          </div>
        </div>
        <label className="block text-sm font-medium text-stone-700">
          <span className="mb-1 block">Stock quantity</span>
          <input
            aria-label={`Stock quantity for ${item.name}`}
            className="input"
            inputMode="numeric"
            min="0"
            onChange={(event) => setStock(event.target.value)}
            required
            step="1"
            type="number"
            value={stock}
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          <span className="mb-1 block">Availability</span>
          <select
            aria-label={`Availability for ${item.name}`}
            className="input"
            onChange={(event) => setStatus(event.target.value as ProductItem["status"])}
            value={status}
          >
            <option value="active">Available</option>
            <option value="out_of_stock">Unavailable</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button
            aria-label={`View ${item.name} details`}
            className="icon-button"
            onClick={() => onView(item)}
            title="View product details"
            type="button"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="primary-button" disabled={saving || isSaving} type="submit">
            {saving || isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving || isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
