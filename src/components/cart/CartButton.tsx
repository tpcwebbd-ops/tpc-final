/*
|-----------------------------------------
| setting up CartButton.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 September, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { CART_DRAWER_OPEN_EVENT, CART_STORAGE_KEY, CART_UPDATED_EVENT, readCart } from "@/lib/cart";

export function CartButton({ className = "" }: { className?: string }) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const sync = () => setQuantity(readCart().reduce((total, item) => total + item.quantity, 0));
    const onStorage = (event: StorageEvent) => event.key === CART_STORAGE_KEY && sync();
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <button
      aria-label={`Open cart, ${quantity} ${quantity === 1 ? "item" : "items"}`}
      className={`relative grid size-8 place-items-center rounded-sm border p-0 transition ${className}`}
      onClick={() => window.dispatchEvent(new CustomEvent(CART_DRAWER_OPEN_EVENT))}
      type="button"
    >
      <Icon name="ShoppingCart" />
      <span aria-live="polite" className="sr-only">
        {quantity} {quantity === 1 ? "item" : "items"} in cart
      </span>
      {quantity > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 grid min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-4 text-white"
        >
          {quantity > 99 ? "99+" : quantity}
        </span>
      ) : null}
    </button>
  );
}
