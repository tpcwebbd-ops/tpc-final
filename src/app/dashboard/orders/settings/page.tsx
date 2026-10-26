/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useState } from "react";

import OrderLimitModal from "@/components/dashboard-ui/OrderLimitModal";
import { toast } from "@/components/ui/global-toast";
import {
  useGetOrderSettingsQuery,
  useUpdateOrderSettingsMutation,
} from "@/redux/features/dashboard/orders/orderSettingsSlice";

const errorMessage = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : "Could not update the order-limit setting.";

export default function OrderSettingsPage() {
  const { data, error, isLoading } = useGetOrderSettingsQuery();
  const [update, updateState] = useUpdateOrderSettingsMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const enabled = data?.settings.orderLimitEnabled ?? false;
  const minutes = data?.settings.orderLimitMinutes ?? 5;
  const maxOrders = data?.settings.orderLimitMaxOrders ?? 1;

  async function toggle() {
    try {
      await update({
        orderLimitEnabled: !enabled,
        orderLimitMinutes: minutes,
        orderLimitMaxOrders: maxOrders,
      }).unwrap();
      toast.success(
        !enabled
          ? `Order limit enabled: ${maxOrders} order${maxOrders === 1 ? "" : "s"} every ${minutes} minute${minutes === 1 ? "" : "s"}.`
          : "Order limit disabled.",
      );
    } catch (cause) {
      toast.error(errorMessage(cause));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-2xl rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-7">
        <Link className="text-sm font-semibold text-amber-800 hover:underline" href="/dashboard/orders">
          Back to orders
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Order limit</h1>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              When enabled, customer checkout frequency is restricted according to your configured rate limit.
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            Configure limit
          </button>
        </div>

        {error ? (
          <p className="mt-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error)}
          </p>
        ) : null}

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
            <div>
              <p className="font-semibold text-stone-900">Current Rate Limit Rule</p>
              <p className="mt-1 text-sm text-stone-600">
                {enabled ? (
                  <>
                    <span className="font-medium text-emerald-700">Enabled:</span> Customers can place up to{" "}
                    <strong>
                      {maxOrders} order{maxOrders === 1 ? "" : "s"}
                    </strong>{" "}
                    every{" "}
                    <strong>
                      {minutes} minute{minutes === 1 ? "" : "s"}
                    </strong>
                    .
                  </>
                ) : (
                  <span className="text-stone-500">Disabled (no checkout limit applied)</span>
                )}
              </p>
            </div>
            <button
              aria-checked={enabled}
              aria-label="Toggle order limit"
              className={`relative h-8 w-14 rounded-full border p-1 transition ${
                enabled ? "border-emerald-500 bg-emerald-500" : "border-stone-300 bg-stone-300"
              }`}
              disabled={isLoading || updateState.isLoading}
              onClick={() => void toggle()}
              role="switch"
              type="button"
            >
              <span
                className={`block size-6 rounded-full bg-white shadow transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-sm border border-[#eadfca] bg-white p-4">
            <div>
              <p className="text-sm font-semibold text-stone-900">Update times & order counts</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Switch presets like [1 min / 10 orders], [5 min / 1 order], or set custom minutes and order limits.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setModalOpen(true)}
              type="button"
            >
              Open Settings Modal
            </button>
          </div>
        </div>
      </section>

      <OrderLimitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
