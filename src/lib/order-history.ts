/*
|-----------------------------------------
| setting up order-history.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

import type { OrderStatus } from "@/lib/dashboard/orders";

export const ORDER_HISTORY_STORAGE_KEY = "speed-box:order-history";
export const ORDER_HISTORY_UPDATED_EVENT = "speed-box:order-history-updated";

export type LocalOrderHistoryItem = {
  id: string;
  status: OrderStatus;
  total: number;
  currency: "BDT";
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  trackingToken?: string;
};

function isOrderHistoryItem(value: unknown): value is LocalOrderHistoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.status === "string" &&
    typeof item.total === "number" &&
    typeof item.itemCount === "number" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" &&
    (item.trackingToken === undefined || typeof item.trackingToken === "string")
  );
}

export function readOrderHistory(): LocalOrderHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) ?? "[]") as unknown;
    return Array.isArray(stored) ? stored.filter(isOrderHistoryItem) : [];
  } catch {
    return [];
  }
}

export function saveOrderToHistory(order: LocalOrderHistoryItem) {
  const currentHistory = readOrderHistory();
  const previousOrder = currentHistory.find((item) => item.id === order.id);
  const savedOrder =
    order.trackingToken || !previousOrder?.trackingToken
      ? order
      : { ...order, trackingToken: previousOrder.trackingToken };
  const history = [savedOrder, ...currentHistory.filter((item) => item.id !== order.id)].slice(0, 50);
  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(history));
  window.dispatchEvent(new Event(ORDER_HISTORY_UPDATED_EVENT));
}

export function readOrderTrackingToken(orderId: string) {
  return readOrderHistory().find((item) => item.id === orderId)?.trackingToken ?? null;
}

export function removeOrderFromHistory(orderId: string) {
  if (typeof window === "undefined") return;
  const history = readOrderHistory().filter((item) => item.id !== orderId);
  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(history));
  window.dispatchEvent(new Event(ORDER_HISTORY_UPDATED_EVENT));
}

export function clearOrderHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY);
  window.dispatchEvent(new Event(ORDER_HISTORY_UPDATED_EVENT));
}
