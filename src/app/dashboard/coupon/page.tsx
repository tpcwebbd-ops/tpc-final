/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 09 September, 2026
|-----------------------------------------
*/

"use client";

import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/global-toast";
import { Switch } from "@/components/ui/switch";
import { type CouponInput } from "@/lib/dashboard/coupons";
import {
  type CouponItem,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from "@/redux/features/dashboard/coupons/couponsSlice";

const emptyCoupon: CouponInput = {
  code: "",
  discountType: "flat",
  discountValue: 0,
  maximumDiscount: null,
  active: true,
};
const errorMessage = (error: unknown, fallback: string) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;

export default function CouponPage() {
  const { data, error, isLoading, isFetching, refetch } = useGetCouponsQuery();
  const [create, createState] = useCreateCouponMutation();
  const [update, updateState] = useUpdateCouponMutation();
  const [remove, removeState] = useDeleteCouponMutation();
  const confirmDelete = useConfirmDelete();
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const [open, setOpen] = useState(false);
  const busy = createState.isLoading || updateState.isLoading || removeState.isLoading;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  async function save(input: CouponInput) {
    try {
      if (editing) await update({ ...input, id: editing.id }).unwrap();
      else await create(input).unwrap();
      toast.success(editing ? "Coupon updated successfully." : "Coupon created successfully.");
      setOpen(false);
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not save coupon."));
    }
  }

  async function destroy(item: CouponItem) {
    if (!(await confirmDelete(`Delete coupon “${item.code}”? This cannot be undone.`))) return;
    try {
      await remove(item.id).unwrap();
      toast.success("Coupon deleted successfully.");
    } catch (cause) {
      toast.error(errorMessage(cause, "Could not delete coupon."));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-stone-900">Coupons</h1>
            <p className="mt-1 text-sm text-stone-600">Create flat or percentage discounts for checkout.</p>
          </div>
          <div className="flex gap-2">
            <button className="secondary-button" disabled={isFetching} onClick={() => void refetch()} type="button">
              Refresh
            </button>
            <button className="primary-button" onClick={openCreate} type="button">
              <Plus className="h-4 w-4" /> Add coupon
            </button>
          </div>
        </div>
        {error ? (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error, "Could not load coupons.")}
          </p>
        ) : null}
        {isLoading ? (
          <div className="mt-5 space-y-3" role="status">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-16 animate-pulse rounded-sm bg-amber-50" key={index} />
            ))}
          </div>
        ) : !data?.items.length ? (
          <div className="mt-5 rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffdfa] p-10 text-center text-sm text-stone-600">
            No coupons yet. Create one to offer a checkout discount.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-sm border border-[#eadfca]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#fffaf0] text-stone-600">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Maximum</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr className="border-t border-[#eadfca]" key={item.id}>
                    <td className="p-3 font-semibold text-stone-900">{item.code}</td>
                    <td className="p-3">
                      {item.discountType === "percent"
                        ? `${item.discountValue}%`
                        : `৳${item.discountValue.toLocaleString("en-BD")}`}
                    </td>
                    <td className="p-3">
                      {item.discountType === "percent"
                        ? `৳${(item.maximumDiscount ?? 0).toLocaleString("en-BD")}`
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${item.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          aria-label={`Edit ${item.code}`}
                          onClick={() => {
                            setEditing(item);
                            setOpen(true);
                          }}
                          size="icon-xs"
                          type="button"
                          variant="ghost"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          aria-label={`Delete ${item.code}`}
                          className="text-red-700 hover:bg-red-50"
                          disabled={busy}
                          onClick={() => void destroy(item)}
                          size="icon-xs"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {open ? (
        <CouponModal
          coupon={editing}
          onClose={() => setOpen(false)}
          onSave={save}
          saving={createState.isLoading || updateState.isLoading}
        />
      ) : null}
    </main>
  );
}

function CouponModal({
  coupon,
  onClose,
  onSave,
  saving,
}: {
  coupon: CouponItem | null;
  onClose: () => void;
  onSave: (input: CouponInput) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<CouponInput>(
    coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maximumDiscount: coupon.maximumDiscount,
          active: coupon.active,
        }
      : emptyCoupon,
  );
  const percent = form.discountType === "percent";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      maximumDiscount: percent ? Number(form.maximumDiscount) : null,
    });
  }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/35 p-4" role="presentation">
      <form
        className="w-full max-w-lg rounded-sm border border-[#eadfca] bg-white p-5 shadow-xl"
        onSubmit={(event) => void submit(event)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{coupon ? "Edit coupon" : "Create coupon"}</h2>
            <p className="mt-1 text-sm text-stone-600">Percentage discounts require a maximum discount amount.</p>
          </div>
          <Button aria-label="Close coupon form" onClick={onClose} size="icon-xs" type="button" variant="ghost">
            <X />
          </Button>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Coupon code
            <input
              className="input mt-1 uppercase"
              maxLength={60}
              onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
              placeholder="SAVE10"
              required
              value={form.code}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Discount type
              <select
                className="input mt-1"
                onChange={(event) =>
                  setForm({
                    ...form,
                    discountType: event.target.value as CouponInput["discountType"],
                    maximumDiscount: event.target.value === "percent" ? (form.maximumDiscount ?? 0) : null,
                  })
                }
                value={form.discountType}
              >
                <option value="flat">Flat amount</option>
                <option value="percent">Percentage</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {percent ? "Discount percent" : "Discount amount"}
              <input
                className="input mt-1"
                min="0.01"
                max={percent ? 100 : undefined}
                onChange={(event) => setForm({ ...form, discountValue: Number(event.target.value) })}
                required
                step="0.01"
                type="number"
                value={form.discountValue || ""}
              />
            </label>
          </div>
          {percent ? (
            <label className="block text-sm font-medium text-stone-700">
              Maximum discount amount
              <input
                className="input mt-1"
                min="0.01"
                onChange={(event) => setForm({ ...form, maximumDiscount: Number(event.target.value) })}
                required
                step="0.01"
                type="number"
                value={form.maximumDiscount || ""}
              />
            </label>
          ) : null}
          <label className="flex items-center justify-between rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 text-sm font-medium text-stone-700">
            <span>Coupon active</span>
            <Switch checked={form.active} onCheckedChange={(active) => setForm({ ...form, active })} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={saving} type="submit">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
