/*
|-----------------------------------------
| setting up gtm-event-fire.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import type { IContainerData, TemplateItem } from "./data";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const parsePrice = (price: string) => Number(price.replace(/[^0-9.]/g, "")) || 0;

export const fireContainer1AddToCartGtmEvent = (item: TemplateItem, settings: IContainerData) => {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GTM_ID) return;

  const productId = String(item.sourceProductId || item.productUID || item.id);
  const value = parsePrice(item.price);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "add_to_cart",
    currency: "BDT",
    value,
    items: [
      {
        item_id: productId,
        item_name: item.title,
        item_category: settings.containerName,
        price: value,
        quantity: 1,
      },
    ],
  });
};
