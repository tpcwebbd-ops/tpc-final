/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

"use client";

import { Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { formatBDT } from "@/lib/cart";
import type { OrderStatus } from "@/lib/dashboard/orders";
import { readOrderTrackingToken, saveOrderToHistory } from "@/lib/order-history";

type TrackingOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  currency: "BDT";
  itemCount: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  customer: { name: string; phone: string; address: string };
  items: {
    productId: string;
    sku?: string;
    name: string;
    primaryImage: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

const steps = ["Order", "Received Order", "Packing", "Shipment", "Delivery", "Cancel", "Delivered"];
const statusStep: Record<TrackingOrder["status"], number> = {
  incomplete: 0,
  placed: 1,
  confirmed: 2,
  processing: 3,
  completed: 6,
  cancelled: 5,
};

export default function OrderTrackingPage() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const pageError = !id ? "An order ID is required." : error;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const trackingToken = readOrderTrackingToken(id);
    fetch(`/api/orders/v1?id=${encodeURIComponent(id)}`, {
      headers: trackingToken ? { "x-order-access-token": trackingToken } : undefined,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as { order?: TrackingOrder; error?: string } | null;
        if (!response.ok || !payload?.order) throw new Error(payload?.error ?? "Could not load this order.");
        return payload.order;
      })
      .then((nextOrder) => {
        if (cancelled) return;
        setOrder(nextOrder);
        saveOrderToHistory({ ...nextOrder, ...(trackingToken ? { trackingToken } : {}) });
      })
      .catch(
        (reason: unknown) =>
          !cancelled && setError(reason instanceof Error ? reason.message : "Could not load this order."),
      );
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (pageError) return <TrackingState title="Order unavailable" detail={pageError} />;
  if (!order) return <TrackingState title="Loading order" detail="Getting the latest delivery information…" />;

  const isCancelled = order.status === "cancelled";
  const timelineSteps = isCancelled ? steps : steps.filter((step) => step !== "Cancel");
  const currentStep = isCancelled ? statusStep.cancelled : order.status === "completed" ? 5 : statusStep[order.status];
  const estimatedDate = estimatedDeliveryDate(order);
  const subtotal = order.subtotal ?? order.total;
  const tax = order.tax ?? 0;
  const shipping = order.shipping ?? 0;
  const discount = order.discount ?? 0;
  return (
    <main className="min-h-screen bg-[#fffaf0] px-4 py-10 print:bg-white print:p-0 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950 print:hidden"
          href="/"
        >
          <Icon name="ArrowLeft" /> Continue shopping
        </Link>
        <section className="mt-5 rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm print:hidden sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-amber-700 uppercase">Order tracking</p>
              <h1 className="mt-2 text-2xl font-bold text-stone-950">Order {order.id}</h1>
              <p className="mt-1 text-sm text-stone-500">
                {order.status === "incomplete" ? "Started" : "Placed"} {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize ${isCancelled ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-950"}`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-8 overflow-x-auto pb-2">
            <div className="flex min-w-[680px] items-start">
              {timelineSteps.map((step, index) => {
                const active = isCancelled ? index === 0 || index === currentStep : index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div className="flex flex-1 items-start" key={step}>
                    <div className="flex w-full flex-col items-center text-center">
                      <span
                        className={`grid size-7 place-items-center rounded-full text-xs font-bold ${active ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-500"}`}
                      >
                        {active ? <Icon name="Check" /> : index + 1}
                      </span>
                      <span className={`mt-2 text-xs font-semibold ${isCurrent ? "text-amber-900" : "text-stone-500"}`}>
                        {step}
                      </span>
                    </div>
                    {index < timelineSteps.length - 1 ? (
                      <span
                        className={`mt-3 h-0.5 flex-1 ${!isCancelled && index < currentStep ? "bg-amber-700" : "bg-stone-200"}`}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 rounded-sm bg-[#fffaf0] p-4 text-sm text-stone-700">
            <span className="font-bold text-stone-950">Estimated date: </span>
            {estimatedDate
              ? estimatedDate.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
              : order.status === "incomplete"
                ? "Pending placement"
                : "Cancelled order"}
          </div>
        </section>

        <div className="mt-5 grid gap-5 print:hidden lg:grid-cols-3">
          <section className="rounded-sm border border-[#eadfca] bg-white p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-stone-950">Order summary</h2>
              <span className="rounded-sm bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <article
                  className="flex gap-3 border-b border-[#f1e8d9] pb-3 last:border-0 last:pb-0"
                  key={item.productId}
                >
                  <Image
                    alt={item.name}
                    className="size-16 rounded-sm object-cover"
                    height={64}
                    src={item.primaryImage}
                    width={64}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {item.quantity} × {formatBDT(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-stone-900">{formatBDT(item.lineTotal)}</span>
                </article>
              ))}
            </div>
          </section>
          <aside className="rounded-sm border border-[#eadfca] bg-white p-5 text-sm">
            <h2 className="font-bold text-stone-950">Delivery details</h2>
            <p className="mt-3 font-semibold text-stone-900">{order.customer.name}</p>
            <p className="mt-1 text-stone-600">{order.customer.phone || "Phone not provided"}</p>
            <p className="mt-1 text-stone-600">{order.customer.address || "Address not provided"}</p>
            <div className="mt-5 border-t border-[#eadfca] pt-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{order.itemCount}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Tax</span>
                <span>{formatBDT(tax)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Shipping</span>
                <span>{formatBDT(shipping)}</span>
              </div>
              <div className="mt-2 flex min-w-0 justify-between gap-3">
                <span>Coupon</span>
                <span className="truncate text-right" title={order.couponCode}>
                  {order.couponCode ? `${order.couponCode} · −${formatBDT(discount)}` : "—"}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-base font-bold text-stone-950">
                <span>Total</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>
          </aside>
        </div>

        <section className="tracking-invoice mt-5 overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm print:mt-0 print:border-0 print:shadow-none">
          <header className="tracking-invoice-header flex flex-wrap items-start justify-between gap-4 border-b border-[#eadfca] bg-[#fffaf0] px-5 py-4 sm:px-6">
            <div>
              <p className="tracking-invoice-brand text-sm font-black tracking-[0.14em] text-stone-950">NexaMart</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Payment invoice</p>
              <h2 className="mt-1 text-xl font-bold text-stone-950">Invoice for order {order.id}</h2>
              <p className="mt-1 text-xs text-stone-500">Issued {invoiceDate(order.createdAt)}</p>
            </div>
            <button
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-[#eadfca] bg-white px-3 text-xs font-semibold text-stone-700 transition hover:bg-amber-100 hover:text-amber-950 print:hidden"
              onClick={() => window.print()}
              type="button"
            >
              <Printer className="size-3.5 text-amber-800" /> Print invoice
            </button>
          </header>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div>
              <div className="grid gap-4 border-b border-[#eadfca] pb-5 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Bill to</p>
                  <p className="mt-2 font-semibold text-stone-900">{order.customer.name}</p>
                  <p className="mt-1 text-stone-600">{order.customer.phone || "Phone not provided"}</p>
                  <p className="mt-1 whitespace-pre-wrap text-stone-600">
                    {order.customer.address || "Address not provided"}
                  </p>
                </div>
                <dl className="grid content-start gap-2 text-sm sm:justify-self-end sm:text-right">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Invoice number</dt>
                    <dd className="mt-1 font-mono font-semibold text-stone-900">{order.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Order status</dt>
                    <dd className="mt-1 font-semibold capitalize text-stone-900">{order.status}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="tracking-invoice-table min-w-[560px] w-full text-left text-sm">
                  <thead className="border-y border-[#eadfca] bg-[#fffaf0] text-xs font-semibold uppercase tracking-wide text-stone-600">
                    <tr>
                      <th className="px-3 py-3">Product</th>
                      <th className="px-3 py-3 text-right">Unit price</th>
                      <th className="px-3 py-3 text-center">Qty</th>
                      <th className="px-3 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr className="border-b border-stone-100" key={item.productId}>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-stone-900">{item.name}</p>
                          {item.sku ? (
                            <p className="mt-0.5 font-mono text-[11px] text-stone-500">SKU: {item.sku}</p>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right text-stone-700">
                          {formatBDT(item.unitPrice)}
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-stone-800">×{item.quantity}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-stone-900">
                          {formatBDT(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="tracking-invoice-summary h-fit rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 text-sm">
              <h3 className="font-bold text-stone-950">Payment summary</h3>
              <dl className="mt-4 space-y-3 text-stone-600">
                <div className="flex items-center justify-between gap-3">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-stone-800">{formatBDT(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Tax</dt>
                  <dd className="font-semibold text-stone-800">{formatBDT(tax)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Shipping</dt>
                  <dd className="font-semibold text-stone-800">{formatBDT(shipping)}</dd>
                </div>
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <dt>Coupon</dt>
                  <dd
                    className="truncate text-right font-mono text-xs font-semibold text-amber-800"
                    title={order.couponCode}
                  >
                    {order.couponCode ? `−${formatBDT(discount)}` : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#eadfca] pt-3 text-base font-bold text-stone-950">
                  <dt>Total payable</dt>
                  <dd>{formatBDT(order.total)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            html,
            body {
              background: #ffffff !important;
            }

            .tracking-invoice {
              color: #1c1917;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .tracking-invoice-header {
              border-top: 4px solid #b45309;
              background: #fff7e6 !important;
            }

            .tracking-invoice-brand {
              color: #92400e !important;
            }

            .tracking-invoice-table {
              border-collapse: collapse;
            }

            .tracking-invoice-table thead {
              display: table-header-group;
            }

            .tracking-invoice-table tr,
            .tracking-invoice-summary {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .tracking-invoice-table th {
              background: #fff7e6 !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}

function estimatedDeliveryDate(order: TrackingOrder) {
  if (order.status === "cancelled" || order.status === "incomplete") return null;
  if (order.status === "completed") return new Date(order.updatedAt);
  const days = order.status === "processing" ? 2 : order.status === "confirmed" ? 4 : 5;
  const date = new Date(order.createdAt);
  date.setDate(date.getDate() + days);
  return date;
}

function invoiceDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function TrackingState({ title, detail }: { title: string; detail: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf0] px-4">
      <div className="max-w-sm rounded-sm border border-[#eadfca] bg-white p-6 text-center shadow-sm">
        <h1 className="font-bold text-stone-950">{title}</h1>
        <p className="mt-2 text-sm text-stone-600">{detail}</p>
      </div>
    </main>
  );
}
