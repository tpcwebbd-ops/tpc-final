/*
|-----------------------------------------
| setting up OrderLimitModal.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { toast } from "@/components/ui/global-toast";
import {
  useGetOrderSettingsQuery,
  useUpdateOrderSettingsMutation,
} from "@/redux/features/dashboard/orders/orderSettingsSlice";

const PRESETS = [
  { minutes: 1, maxOrders: 1, label: "1 min / 1 order" },
  { minutes: 1, maxOrders: 5, label: "1 min / 5 orders" },
  { minutes: 1, maxOrders: 10, label: "1 min / 10 orders" },
  { minutes: 5, maxOrders: 1, label: "5 min / 1 order" },
  { minutes: 5, maxOrders: 5, label: "5 min / 5 orders" },
  { minutes: 5, maxOrders: 10, label: "5 min / 10 orders" },
  { minutes: 10, maxOrders: 5, label: "10 min / 5 orders" },
  { minutes: 15, maxOrders: 10, label: "15 min / 10 orders" },
  { minutes: 30, maxOrders: 20, label: "30 min / 20 orders" },
  { minutes: 60, maxOrders: 50, label: "60 min / 50 orders" },
];

const errorMessage = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : "Could not update order limit settings.";

export type OrderLimitModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderLimitModal({ isOpen, onClose }: OrderLimitModalProps) {
  const { data, isLoading } = useGetOrderSettingsQuery();
  const [update, updateState] = useUpdateOrderSettingsMutation();

  const [enabled, setEnabled] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [maxOrders, setMaxOrders] = useState(1);

  const [prevSettings, setPrevSettings] = useState(data?.settings);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (data?.settings !== prevSettings || isOpen !== prevIsOpen) {
    setPrevSettings(data?.settings);
    setPrevIsOpen(isOpen);
    if (data?.settings) {
      setEnabled(Boolean(data.settings.orderLimitEnabled));
      setMinutes(data.settings.orderLimitMinutes >= 1 ? data.settings.orderLimitMinutes : 5);
      setMaxOrders(data.settings.orderLimitMaxOrders >= 1 ? data.settings.orderLimitMaxOrders : 1);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !updateState.isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, updateState.isLoading]);

  if (!isOpen) return null;

  const isPresetActive = (pMinutes: number, pOrders: number) => minutes === pMinutes && maxOrders === pOrders;

  const handleApplyPreset = (pMinutes: number, pOrders: number) => {
    setMinutes(pMinutes);
    setMaxOrders(pOrders);
  };

  const handleSave = async () => {
    const safeMinutes = Math.max(1, Math.min(10080, Math.round(minutes) || 1));
    const safeMaxOrders = Math.max(1, Math.min(1000, Math.round(maxOrders) || 1));

    try {
      await update({
        orderLimitEnabled: enabled,
        orderLimitMinutes: safeMinutes,
        orderLimitMaxOrders: safeMaxOrders,
      }).unwrap();

      toast.success(
        enabled
          ? `Order limit active: ${safeMaxOrders} order${safeMaxOrders === 1 ? "" : "s"} every ${safeMinutes} minute${safeMinutes === 1 ? "" : "s"}.`
          : "Order limit has been disabled.",
      );
      onClose();
    } catch (cause) {
      toast.error(errorMessage(cause));
    }
  };

  const modalContent = (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/40 p-2.5 backdrop-blur-xs transition-opacity duration-200 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !updateState.isLoading) onClose();
      }}
    >
      <section
        aria-labelledby="order-limit-modal-title"
        aria-modal="true"
        className="flex max-h-[calc(100dvh-1.25rem)] w-full max-w-xl flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 sm:max-h-[calc(100dvh-3rem)]"
        role="dialog"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#eadfca] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-stone-900 sm:text-xl" id="order-limit-modal-title">
                Order Limit Configuration
              </h2>
              <span
                className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
                  enabled
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border border-stone-200 bg-stone-100 text-stone-600"
                }`}
              >
                {enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Control checkout rate-limiting to prevent rapid automated or duplicate orders.
            </p>
          </div>
          <button
            aria-label="Close modal"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm text-stone-400 transition hover:bg-amber-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            disabled={updateState.isLoading}
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:space-y-6 sm:px-6 sm:py-5">
          {/* Main Toggle Switch */}
          <div className="flex items-center justify-between gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3.5 sm:p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-900">Enable Order Limiting</p>
              <p className="text-xs text-stone-600 mt-0.5">
                When enabled, customers can only place up to the configured number of orders within the time window.
              </p>
            </div>
            <button
              aria-checked={enabled}
              aria-label="Toggle order limiting"
              className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-sm border p-0.5 transition-colors duration-200 ease-in-out ${
                enabled ? "border-emerald-500 bg-emerald-500" : "border-stone-300 bg-stone-300"
              }`}
              disabled={isLoading || updateState.isLoading}
              onClick={() => setEnabled((prev) => !prev)}
              role="switch"
              type="button"
            >
              <span
                className={`block size-5.5 rounded-sm bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Quick Presets */}
          <div className={enabled ? "opacity-100 transition-opacity" : "opacity-60 transition-opacity"}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">Quick Presets</label>
              <span className="text-[11px] text-stone-500">Click to apply time & order limits</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESETS.map((preset) => {
                const active = isPresetActive(preset.minutes, preset.maxOrders);
                return (
                  <button
                    className={`rounded-sm border px-2.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-amber-600 bg-amber-50 text-amber-900 font-semibold shadow-xs ring-1 ring-amber-400"
                        : "border-[#eadfca] bg-white text-stone-700 hover:border-amber-400 hover:bg-stone-50"
                    }`}
                    disabled={!enabled || updateState.isLoading}
                    key={preset.label}
                    onClick={() => handleApplyPreset(preset.minutes, preset.maxOrders)}
                    type="button"
                  >
                    [{preset.label}]
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Configuration Inputs */}
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
              enabled ? "opacity-100" : "pointer-events-none opacity-50"
            }`}
          >
            {/* Minutes Window Input */}
            <div className="rounded-sm border border-[#eadfca] bg-white p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-800" htmlFor="time-window-minutes">
                  Time Window (Minutes)
                </label>
                <span className="text-[11px] text-stone-500">1 to 1440 min</span>
              </div>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-sm border border-[#eadfca] bg-white transition focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                <button
                  aria-label="Decrease minutes"
                  className="flex h-9 w-10 shrink-0 cursor-pointer items-center justify-center border-r border-[#eadfca] bg-[#fffaf0] text-stone-700 transition duration-200 hover:bg-amber-100 hover:text-amber-950 active:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!enabled || minutes <= 1 || updateState.isLoading}
                  onClick={() => setMinutes((prev) => Math.max(1, prev - 1))}
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="Time window in minutes"
                  className="h-9 w-full bg-white px-3 text-center text-sm font-semibold text-stone-900 outline-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  disabled={!enabled || updateState.isLoading}
                  id="time-window-minutes"
                  max={10080}
                  min={1}
                  onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  type="number"
                  value={minutes}
                />
                <button
                  aria-label="Increase minutes"
                  className="flex h-9 w-10 shrink-0 cursor-pointer items-center justify-center border-l border-[#eadfca] bg-[#fffaf0] text-stone-700 transition duration-200 hover:bg-amber-100 hover:text-amber-950 active:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!enabled || updateState.isLoading}
                  onClick={() => setMinutes((prev) => prev + 1)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {[1, 5, 10, 15, 30, 60].map((m) => (
                  <button
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-medium transition ${
                      minutes === m
                        ? "bg-amber-800 text-white"
                        : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                    disabled={!enabled || updateState.isLoading}
                    key={m}
                    onClick={() => setMinutes(m)}
                    type="button"
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Allowed Orders Input */}
            <div className="rounded-sm border border-[#eadfca] bg-white p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-800" htmlFor="max-orders-allowed">
                  Allowed Orders per Window
                </label>
                <span className="text-[11px] text-stone-500">1 to 500 orders</span>
              </div>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-sm border border-[#eadfca] bg-white transition focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                <button
                  aria-label="Decrease orders"
                  className="flex h-9 w-10 shrink-0 cursor-pointer items-center justify-center border-r border-[#eadfca] bg-[#fffaf0] text-stone-700 transition duration-200 hover:bg-amber-100 hover:text-amber-950 active:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!enabled || maxOrders <= 1 || updateState.isLoading}
                  onClick={() => setMaxOrders((prev) => Math.max(1, prev - 1))}
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="Maximum allowed orders"
                  className="h-9 w-full bg-white px-3 text-center text-sm font-semibold text-stone-900 outline-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  disabled={!enabled || updateState.isLoading}
                  id="max-orders-allowed"
                  max={1000}
                  min={1}
                  onChange={(e) => setMaxOrders(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  type="number"
                  value={maxOrders}
                />
                <button
                  aria-label="Increase orders"
                  className="flex h-9 w-10 shrink-0 cursor-pointer items-center justify-center border-l border-[#eadfca] bg-[#fffaf0] text-stone-700 transition duration-200 hover:bg-amber-100 hover:text-amber-950 active:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!enabled || updateState.isLoading}
                  onClick={() => setMaxOrders((prev) => prev + 1)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {[1, 3, 5, 10, 20, 50].map((count) => (
                  <button
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-medium transition ${
                      maxOrders === count
                        ? "bg-amber-800 text-white"
                        : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                    disabled={!enabled || updateState.isLoading}
                    key={count}
                    onClick={() => setMaxOrders(count)}
                    type="button"
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rule Preview Card */}
          <div className="rounded-sm border border-amber-200 bg-amber-50/70 p-3.5">
            <p className="text-xs font-semibold text-amber-900">Live Rule Preview:</p>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              {enabled ? (
                <>
                  Each authenticated customer is allowed a maximum of{" "}
                  <span className="font-bold underline decoration-amber-500">
                    {maxOrders} order{maxOrders === 1 ? "" : "s"}
                  </span>{" "}
                  every{" "}
                  <span className="font-bold underline decoration-amber-500">
                    {minutes} minute{minutes === 1 ? "" : "s"}
                  </span>
                  . Additional attempts within this rolling window will be halted with an active cooldown timer.
                </>
              ) : (
                <span className="italic text-stone-600">
                  Rate limiting is currently <strong>disabled</strong>. Customers can place orders without time-window
                  restrictions.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#eadfca] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <button className="secondary-button" disabled={updateState.isLoading} onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={isLoading || updateState.isLoading}
            onClick={() => void handleSave()}
            type="button"
          >
            {updateState.isLoading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </section>
    </div>
  );

  return createPortal(modalContent, document.body);
}
