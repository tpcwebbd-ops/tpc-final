/*
|-----------------------------------------
| setting up management.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { type Order, type OrderStatus } from "@/lib/dashboard/orders";
import { restoreProductStock } from "@/lib/models/catalog";
import { ordersCollection } from "@/lib/models/orders";
import { invalidatePublicProductCatalogCache } from "@/lib/products/server";

export const allowedOrderTransitions: Record<OrderStatus, OrderStatus[]> = {
  incomplete: ["placed", "cancelled"],
  placed: ["confirmed", "processing", "completed", "cancelled"],
  confirmed: ["placed", "processing", "completed", "cancelled"],
  processing: ["placed", "confirmed", "completed", "cancelled"],
  completed: ["placed", "confirmed", "processing", "cancelled"],
  cancelled: [],
};

/** @deprecated Route handlers must use order services; retained for existing server callers. */
export const orders = ordersCollection;

export function orderIds(body: unknown) {
  const ids = (body as { ids?: unknown } | null)?.ids;
  return Array.isArray(ids)
    ? [
        ...new Set(
          ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0).map((id) => id.trim()),
        ),
      ]
    : [];
}

export async function restoreOrderStock(order: Order, now = new Date()) {
  if (order.status === "cancelled") return;
  await Promise.all(
    order.items.map((item) => {
      const quantity =
        typeof item.stockDeducted === "number" && Number.isInteger(item.stockDeducted)
          ? Math.min(item.quantity, Math.max(0, item.stockDeducted))
          : item.quantity;
      return restoreProductStock(item.productId, quantity, now);
    }),
  );
  if (order.items.length) invalidatePublicProductCatalogCache();
}
