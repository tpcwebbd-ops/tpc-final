/*
|-----------------------------------------
| setting up cart.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 September, 2026
|-----------------------------------------
*/

"use client";

export const CART_STORAGE_KEY = "speed-box:container-cart";
export const CART_UPDATED_EVENT = "speed-box:container-cart-updated";
export const CART_DRAWER_OPEN_EVENT = "speed-box:cart-drawer-open";

export type CartItem = {
  id: string;
  productId: string;
  source: "dashboard";
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, "id" | "quantity" | "price"> & {
  price: number | string;
  quantity?: number;
};

export type CartTotals = { subtotal: number; discount: number; total: number };

const asMoney = (value: number | string) => {
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
};

const itemKey = (item: Pick<CartItemInput, "productId">) => `product:${item.productId}`;

const dispatch = (items: CartItem[]) => {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(stored)) return [];
    return stored.flatMap((value): CartItem[] => {
      if (!value || typeof value !== "object") return [];
      const item = value as Partial<CartItem> & { price?: number | string; productId?: unknown };
      if (typeof item.productId !== "string" || !item.productId || item.source !== "dashboard" || !item.title)
        return [];
      return [
        {
          id: item.id ?? itemKey({ productId: item.productId }),
          productId: item.productId,
          source: "dashboard",
          title: item.title,
          price: asMoney(item.price ?? 0),
          image: item.image ?? "",
          quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatch(items);
}

export function addToCart(input: CartItemInput) {
  const items = readCart();
  const id = itemKey(input);
  const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
  const index = items.findIndex((item) => item.id === id);
  if (index >= 0)
    items[index] = {
      ...items[index],
      ...input,
      id,
      price: asMoney(input.price),
      quantity: items[index].quantity + quantity,
    };
  else items.push({ ...input, id, price: asMoney(input.price), quantity });
  saveCart(items);
  return items;
}

export function updateCartQuantity(id: string, quantity: number) {
  const normalized = Math.floor(quantity);
  const items =
    normalized < 1
      ? readCart().filter((item) => item.id !== id)
      : readCart().map((item) => (item.id === id ? { ...item, quantity: normalized } : item));
  saveCart(items);
  return items;
}

export function removeFromCart(id: string) {
  const items = readCart().filter((item) => item.id !== id);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}

export function cartTotals(items = readCart(), discountRate = 0): CartTotals {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = Math.min(subtotal, Math.max(0, Math.round(subtotal * discountRate)));
  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

export const formatBDT = (value: number) => `৳${Math.max(0, Math.round(value)).toLocaleString("en-BD")}`;
