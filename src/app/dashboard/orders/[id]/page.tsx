/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "@/components/ui/global-toast";
import { orderStatuses, type OrderStatus } from "@/lib/dashboard/orders";
import { useGetOrderQuery, useUpdateOrderStatusMutation } from "@/redux/features/dashboard/orders/ordersSlice";

const bdt = (value: number) => `৳${value.toLocaleString("en-BD")}`;
const errorMessage = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "data" in error &&
  typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : "Could not update this order.";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetOrderQuery(params.id);
  const [update, updateState] = useUpdateOrderStatusMutation();
  const order = data?.item;

  async function updateStatus(status: OrderStatus) {
    if (!order || status === order.status) return;
    try {
      await update({ id: order.id, status }).unwrap();
      toast.success("Order status updated.");
    } catch (cause) {
      toast.error(errorMessage(cause));
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-4xl rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(120,53,15,.35)] sm:p-7">
        <Link className="text-sm font-semibold text-amber-800 hover:underline" href="/dashboard/orders">
          Back to orders
        </Link>
        {isLoading ? <div className="mt-5 h-64 animate-pulse rounded-sm bg-amber-50" role="status" /> : null}
        {error ? (
          <p className="mt-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage(error)}
          </p>
        ) : null}
        {order ? (
          <>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-stone-900">Order details</h1>
                <p className="mt-1 break-all font-mono text-xs text-stone-500">{order.id}</p>
              </div>
              <label className="text-sm font-medium text-stone-700">
                Status
                <select
                  className="ml-2 h-10 rounded-sm border border-[#eadfca] bg-white px-3 capitalize"
                  disabled={updateState.isLoading}
                  onChange={(event) => void updateStatus(event.target.value as OrderStatus)}
                  value={order.status}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
                <h2 className="font-semibold text-stone-900">Customer</h2>
                <p className="mt-3 text-sm text-stone-700">{order.customer.name}</p>
                <p className="text-sm text-stone-600">{order.customer.email}</p>
                <p className="mt-2 text-sm text-stone-600">{order.customer.phone || "No phone provided"}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-stone-600">
                  {order.customer.address || "No address provided"}
                </p>
              </section>
              <section className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
                <h2 className="font-semibold text-stone-900">Totals</h2>
                <dl className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3 text-stone-600">
                    <dt>Items</dt>
                    <dd>{order.itemCount}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-stone-600">
                    <dt>Subtotal</dt>
                    <dd>{bdt(order.subtotal ?? order.total)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-stone-600">
                    <dt>Tax</dt>
                    <dd>{bdt(order.tax ?? 0)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-stone-600">
                    <dt>Shipping</dt>
                    <dd>{bdt(order.shipping ?? 0)}</dd>
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3 text-stone-600">
                    <dt>Coupon</dt>
                    <dd className="truncate font-mono text-xs text-amber-800" title={order.couponCode}>
                      {order.couponCode ? `${order.couponCode} · −${bdt(order.discount ?? 0)}` : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-[#eadfca] pt-2 text-lg font-bold text-stone-950">
                    <dt>Grand total</dt>
                    <dd>{bdt(order.total)}</dd>
                  </div>
                </dl>
              </section>
            </div>
            <section className="mt-4 overflow-hidden rounded-sm border border-[#eadfca]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fffaf0] text-stone-600">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Server price</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr className="border-t border-stone-100" key={item.productId}>
                      <td className="p-3">
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.sku}</p>
                      </td>
                      <td className="p-3">{bdt(item.unitPrice)}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3 font-semibold">{bdt(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
