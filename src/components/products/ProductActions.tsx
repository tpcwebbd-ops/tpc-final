/*
|-----------------------------------------
| setting up ProductActions.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { CART_DRAWER_OPEN_EVENT, addToCart, formatBDT } from "@/lib/cart";

type Props = { product: { id: string; name: string; discountPrice: number; primaryImage: string; stock: number } };

export function ProductActions({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const available = product.stock > 0;
  const add = () => {
    addToCart({
      productId: product.id,
      source: "dashboard",
      title: product.name,
      price: product.discountPrice,
      image: product.primaryImage,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 items-center rounded-sm border border-stone-200 bg-white shadow-sm">
          <button
            aria-label="Decrease quantity"
            className="grid size-11 place-items-center text-stone-500 transition hover:bg-stone-100 disabled:opacity-35"
            disabled={quantity === 1}
            onClick={() => setQuantity((value) => value - 1)}
            type="button"
          >
            <Minus size={16} />
          </button>
          <span className="w-9 text-center text-sm font-bold tabular-nums">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="grid size-11 place-items-center text-stone-700 transition hover:bg-stone-100 disabled:opacity-35"
            disabled={quantity >= product.stock}
            onClick={() => setQuantity((value) => value + 1)}
            type="button"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-amber-600 px-5 text-sm font-bold text-white shadow-lg shadow-amber-600/25 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          disabled={!available}
          onClick={add}
          type="button"
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? "Added to cart" : available ? `Add ${formatBDT(product.discountPrice)}` : "Out of stock"}
        </button>
      </div>
      {added && (
        <button
          className="text-sm font-semibold text-amber-700 underline underline-offset-4"
          onClick={() => window.dispatchEvent(new CustomEvent(CART_DRAWER_OPEN_EVENT))}
          type="button"
        >
          View your cart
        </button>
      )}
    </div>
  );
}
