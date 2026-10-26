/*
|-----------------------------------------
| setting up OrderDetailModal.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import { Check, Copy, Mail, MapPin, Phone, Printer, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { toast } from "@/components/ui/global-toast";
import { orderStatuses, type OrderStatus } from "@/lib/dashboard/orders";
import { useUpdateOrderStatusMutation, type OrderItem } from "@/redux/features/dashboard/orders/ordersSlice";

const emptySubscribe = () => () => {};

const bdt = (value: number) => `৳${value.toLocaleString("en-BD")}`;

const displayDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  incomplete: {
    badge: "border-stone-300 bg-stone-50 text-stone-700",
    dot: "bg-stone-500",
  },
  placed: {
    badge: "border-amber-300 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
  },
  confirmed: {
    badge: "border-blue-300 bg-blue-50 text-blue-900",
    dot: "bg-blue-500",
  },
  processing: {
    badge: "border-purple-300 bg-purple-50 text-purple-900",
    dot: "bg-purple-500",
  },
  completed: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-900",
    dot: "bg-emerald-500",
  },
  cancelled: {
    badge: "border-rose-300 bg-rose-50 text-rose-900",
    dot: "bg-rose-500",
  },
};

export type OrderDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
};

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [update, updateState] = useUpdateOrderStatusMutation();
  const [copied, setCopied] = useState(false);
  const [statusOverride, setStatusOverride] = useState<{ id: string; status: OrderStatus } | null>(null);

  const currentStatus = (order && statusOverride?.id === order.id ? statusOverride.status : order?.status) || "placed";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !updateState.isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, updateState.isLoading]);

  if (!isMounted || !isOpen || !order) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      toast.success("Order ID copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy order ID.");
    }
  };

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    if (!order || nextStatus === currentStatus) return;
    setStatusOverride({ id: order.id, status: nextStatus });
    try {
      await update({ id: order.id, status: nextStatus }).unwrap();
      toast.success(`Order status updated to ${nextStatus}.`);
    } catch {
      setStatusOverride({ id: order.id, status: order.status });
      toast.error("Failed to update order status.");
    }
  };

  const currentStyle = statusStyles[currentStatus] || statusStyles.placed;

  const modalContent = (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          *,
          *::before,
          *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html,
          body {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          body > *:not(#order-print-portal) {
            display: none !important;
          }
          #order-print-portal {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          #order-print-modal {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            border: 1px solid #d9cbbe !important;
            border-radius: 4px !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .no-print {
            display: none !important;
          }
          .print-p-compact {
            padding: 16px 20px !important;
          }
          .print-space-compact {
            gap: 14px !important;
          }
          .print-header-compact {
            padding: 14px 20px !important;
          }
          .print-card-compact {
            padding: 14px 18px !important;
          }
          .print-table-cell {
            padding: 10px 16px !important;
          }
        }
      `}</style>

      <div
        aria-modal="true"
        className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/45 p-2 sm:p-5 backdrop-blur-xs transition-opacity duration-300"
        id="order-print-portal"
        onClick={(e) => {
          if (e.target === e.currentTarget && !updateState.isLoading) {
            onClose();
          }
        }}
        role="dialog"
      >
        <section
          className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 sm:max-h-[calc(100dvh-2.5rem)]"
          id="order-print-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="print-header-compact relative flex shrink-0 flex-col gap-3 border-b border-[#eadfca] bg-[#fffaf0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
            <div className="min-w-0 pr-10 sm:pr-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Order Details</h2>
                <button
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-white px-2.5 py-1 font-mono text-xs font-semibold text-amber-900 shadow-2xs transition hover:bg-amber-50 active:scale-95"
                  onClick={handleCopyId}
                  title="Click to copy order ID"
                  type="button"
                >
                  <span>{order.id}</span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-stone-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Placed on <span className="font-medium text-stone-700">{displayDate(order.createdAt)}</span>
              </p>
            </div>

            <div className="no-print flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end sm:pr-10">
              {/* Status Switcher in Header */}
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-xs font-semibold capitalize ${currentStyle.badge}`}
                >
                  <span className={`h-2 w-2 rounded-sm ${currentStyle.dot}`} />
                  {currentStatus}
                </span>

                <div>
                  <select
                    aria-label="Change order status"
                    className="h-8 cursor-pointer rounded-sm border border-[#eadfca] bg-white px-2.5 text-xs font-semibold capitalize text-stone-800 shadow-2xs outline-none transition hover:border-amber-400 focus:border-amber-500"
                    disabled={updateState.isLoading}
                    onChange={(e) => void handleStatusChange(e.target.value as OrderStatus)}
                    value={currentStatus}
                  >
                    {orderStatuses.map((st) => (
                      <option key={st} value={st}>
                        Set {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              aria-label="Close modal"
              className="no-print absolute right-3 top-3 grid size-9 cursor-pointer place-items-center rounded-sm text-stone-400 transition hover:bg-amber-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
              disabled={updateState.isLoading}
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Body with Generous Border Padding */}
          <div className="print-p-compact min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-6 sm:p-7">
            {/* Customer & Delivery Information Card */}
            <div className="print-card-compact rounded-sm border border-[#eadfca] bg-[#fffaf0]/40 p-4 shadow-2xs sm:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:divide-x md:divide-[#eadfca] md:gap-6">
                {/* Customer Column */}
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950">
                    <User className="h-4 w-4 text-amber-800" />
                    Customer Details
                  </h3>
                  <p className="text-base font-bold text-stone-900">{order.customer.name || "N/A"}</p>
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                    <a className="hover:text-amber-800 hover:underline" href={`mailto:${order.customer.email}`}>
                      {order.customer.email || "No email provided"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                    {order.customer.phone ? (
                      <a className="hover:text-amber-800 hover:underline" href={`tel:${order.customer.phone}`}>
                        {order.customer.phone}
                      </a>
                    ) : (
                      <span className="italic text-stone-400">No phone provided</span>
                    )}
                  </div>
                </div>

                {/* Shipping / Address Column */}
                <div className="space-y-2 md:pl-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950">
                    <MapPin className="h-4 w-4 text-amber-800" />
                    Delivery Address
                  </h3>
                  <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                    {order.customer.address || (
                      <span className="italic text-stone-400">No delivery address provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Products Table & Invoice Breakdown */}
            <div className="overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-[#eadfca] bg-[#fffaf0] px-4 py-3 sm:px-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Ordered Products ({order.items?.length || 0})
                </h3>
                <span className="text-xs font-medium text-stone-500">
                  Total Units: <strong className="text-stone-800">{order.itemCount}</strong>
                </span>
              </div>

              <div className="space-y-3 p-3 sm:hidden print:hidden">
                {order.items?.map((item, index) => {
                  const itemKey = `${item.productId || "item"}-${item.sku || ""}-${index}`;
                  return (
                    <article className="rounded-sm border border-[#eadfca] bg-white p-3" key={itemKey}>
                      <div className="flex items-start gap-3">
                        {item.primaryImage ? (
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0]">
                            <Image
                              alt={item.name}
                              className="object-contain p-1"
                              fill
                              sizes="44px"
                              src={item.primaryImage}
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-stone-900">{item.name}</p>
                          {item.sku ? (
                            <p className="mt-0.5 font-mono text-[11px] text-stone-400">SKU: {item.sku}</p>
                          ) : null}
                        </div>
                      </div>
                      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-stone-100 pt-3 text-xs">
                        <div>
                          <dt className="text-stone-500">Unit price</dt>
                          <dd className="mt-0.5 font-semibold text-stone-800">{bdt(item.unitPrice)}</dd>
                        </div>
                        <div className="text-center">
                          <dt className="text-stone-500">Quantity</dt>
                          <dd className="mt-0.5 font-semibold text-stone-800">×{item.quantity}</dd>
                        </div>
                        <div className="text-right">
                          <dt className="text-stone-500">Total</dt>
                          <dd className="mt-0.5 font-bold text-stone-900">{bdt(item.lineTotal)}</dd>
                        </div>
                      </dl>
                    </article>
                  );
                })}
                <dl className="border-t border-[#eadfca] bg-[#fffaf0] px-3 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3 text-stone-600">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-stone-800">{bdt(order.subtotal ?? order.total)}</dd>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-stone-600">
                    <dt>Tax</dt>
                    <dd className="font-semibold text-stone-800">{bdt(order.tax ?? 0)}</dd>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-stone-600">
                    <dt>Shipping</dt>
                    <dd className="font-semibold text-stone-800">{bdt(order.shipping ?? 0)}</dd>
                  </div>
                  <div className="mt-2 flex min-w-0 items-center justify-between gap-3 text-stone-600">
                    <dt>Coupon</dt>
                    <dd className="truncate font-mono text-xs font-semibold text-amber-800" title={order.couponCode}>
                      {order.couponCode ? `${order.couponCode} · −${bdt(order.discount ?? 0)}` : "—"}
                    </dd>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 border-t border-[#eadfca] pt-2 font-bold text-stone-900">
                    <dt>Grand Total ({order.currency || "BDT"})</dt>
                    <dd className="text-amber-950">{bdt(order.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="hidden overflow-x-auto sm:block print:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50/60 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    <tr>
                      <th className="print-table-cell px-5 py-3 sm:px-6">Product</th>
                      <th className="print-table-cell px-4 py-3 text-right">Unit Price</th>
                      <th className="print-table-cell px-4 py-3 text-center">Quantity</th>
                      <th className="print-table-cell px-5 py-3 sm:px-6 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {order.items?.map((item, index) => {
                      const itemKey = `${item.productId || "item"}-${item.sku || ""}-${index}`;
                      return (
                        <tr className="hover:bg-stone-50/50 transition-colors" key={itemKey}>
                          <td className="print-table-cell px-5 py-3.5 sm:px-6">
                            <div className="flex items-center gap-3">
                              {item.primaryImage ? (
                                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0]">
                                  <Image
                                    alt={item.name}
                                    className="object-contain p-1"
                                    fill
                                    sizes="44px"
                                    src={item.primaryImage}
                                  />
                                </div>
                              ) : null}
                              <div className="min-w-0">
                                <p className="font-semibold text-stone-900 leading-snug">{item.name}</p>
                                {item.sku ? (
                                  <p className="mt-0.5 font-mono text-[11px] text-stone-400">SKU: {item.sku}</p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="print-table-cell px-4 py-3.5 text-right text-xs font-medium text-stone-700 whitespace-nowrap">
                            {bdt(item.unitPrice)}
                          </td>
                          <td className="print-table-cell px-4 py-3.5 text-center text-xs font-semibold text-stone-900 whitespace-nowrap">
                            ×{item.quantity}
                          </td>
                          <td className="print-table-cell px-5 py-3.5 sm:px-6 text-right text-sm font-bold text-stone-900 whitespace-nowrap">
                            {bdt(item.lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Unified Totals in Table Footer */}
                  <tfoot className="border-t border-[#eadfca] bg-[#fffaf0]/60 text-xs">
                    <tr>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 font-medium text-stone-600" colSpan={3}>
                        Subtotal
                      </td>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 text-right font-semibold text-stone-800 whitespace-nowrap">
                        {bdt(order.subtotal ?? order.total)}
                      </td>
                    </tr>
                    <tr>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 font-medium text-stone-600" colSpan={3}>
                        Tax
                      </td>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 text-right font-semibold text-stone-800 whitespace-nowrap">
                        {bdt(order.tax ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 font-medium text-stone-600" colSpan={3}>
                        Shipping
                      </td>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 text-right font-semibold text-stone-800 whitespace-nowrap">
                        {bdt(order.shipping ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 font-medium text-stone-600" colSpan={3}>
                        Coupon
                      </td>
                      <td className="print-table-cell px-5 py-2.5 sm:px-6 text-right font-mono text-xs font-semibold text-amber-800 whitespace-nowrap">
                        {order.couponCode ? `${order.couponCode} · −${bdt(order.discount ?? 0)}` : "—"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#eadfca] bg-[#fffaf0]">
                      <td className="print-table-cell px-5 py-3 sm:px-6 text-sm font-bold text-stone-900" colSpan={3}>
                        Grand Total ({order.currency || "BDT"})
                      </td>
                      <td className="print-table-cell px-5 py-3 sm:px-6 text-right text-base font-black text-amber-950 whitespace-nowrap">
                        {bdt(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="no-print flex shrink-0 items-center justify-between gap-3 border-t border-[#eadfca] bg-[#fffaf0] px-4 py-3 sm:px-7 sm:py-4">
            <button
              className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition duration-200 hover:bg-amber-100 hover:text-amber-950 active:scale-95 sm:px-4"
              onClick={() => window.print()}
              type="button"
            >
              <Printer className="h-4 w-4 text-amber-800" />
              Print Receipt
            </button>
            <button
              className="cursor-pointer rounded-sm bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-950 transition duration-200 hover:bg-amber-200 active:scale-95 sm:px-5"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </footer>
        </section>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
