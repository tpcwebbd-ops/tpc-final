/*
|-----------------------------------------
| setting up cart.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { addToCart, type CartItemInput } from "@/lib/cart";

export type ContainerCartItem = Omit<CartItemInput, "quantity">;

/** Legacy producer entrypoint retained for persisted container renderers. */
export const addContainerItemToCart = (item: ContainerCartItem) => addToCart(item);
