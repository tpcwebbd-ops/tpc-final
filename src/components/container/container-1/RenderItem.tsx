/*
|-----------------------------------------
| setting up RenderItem.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import { CART_DRAWER_OPEN_EVENT } from "@/lib/cart";

import { addContainerItemToCart } from "./cart";
import { IContainerData, TemplateItem, templateImagePlaceholder } from "./data";
import { fireContainer1AddToCartGtmEvent } from "./gtm-event-fire";

interface RenderItemProps {
  item: TemplateItem;
  settings: IContainerData;
  priority?: boolean;
  loading?: "eager" | "lazy";
}

const RenderItem = ({ item, settings, priority = false, loading }: RenderItemProps) => {
  const detailUrl = item.url || (item.sourceProductId ? `/template?id=${item.sourceProductId}` : "#");

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.sourceProductId) {
      window.dispatchEvent(
        new CustomEvent("speed-box:toast", { detail: { message: "This item is not linked to an active product." } }),
      );
      return;
    }
    fireContainer1AddToCartGtmEvent(item, settings);
    addContainerItemToCart({
      productId: item.sourceProductId,
      source: "dashboard",
      title: item.title,
      price: item.price,
      image: item.image || templateImagePlaceholder,
    });
    window.dispatchEvent(new CustomEvent("speed-box:toast", { detail: { message: "Added to cart." } }));
    window.dispatchEvent(new CustomEvent(CART_DRAWER_OPEN_EVENT));
  };

  return (
    <article className="group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-sm border border-stone-200 bg-white transition-colors duration-300 hover:border-amber-300 hover:shadow-md motion-reduce:transition-none">
      {/* Image block - fixed aspect ratio container with object-contain to render fully without cropping */}
      <Link
        href={detailUrl}
        aria-label={`View ${item.title}`}
        className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#fffaf0] sm:aspect-[5/4]"
      >
        <Image
          src={item.image || templateImagePlaceholder}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          priority={priority}
          loading={priority ? "eager" : (loading ?? "lazy")}
        />

        {/* Hover overlay with preview icon */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-stone-900/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        >
          <span className="flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-md transition-transform duration-300 group-hover:scale-100">
            <Icon name="Eye" />
          </span>
        </div>
      </Link>

      {/* Content - flex-1 with uniform row heights and pinned buttons */}
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
        {/* Title - uniform fixed height for 1 or 2 lines */}
        <div className="min-h-11">
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-stone-800 transition-colors duration-200 group-hover:text-blue-700 sm:text-base motion-reduce:transition-none"
            title={item.title}
          >
            {item.title}
          </h3>
        </div>

        {/* Rating row - uniform height */}
        <div
          className="mt-2 flex min-h-5 items-center gap-1.5 text-xs text-amber-600"
          aria-label={`Rated ${item.rating} out of 5`}
        >
          <span aria-hidden="true" className="tracking-wide">
            {"★".repeat(Math.floor(item.rating))}
            {"☆".repeat(5 - Math.floor(item.rating))}
          </span>
          <span className="font-medium text-stone-500">{item.rating.toFixed(1)}</span>
        </div>

        {/* Price row - uniform fixed height and baseline */}
        <div className="mt-2 flex min-h-8 items-center justify-between gap-2">
          <span className="text-base font-bold leading-none text-stone-900 transition-colors duration-200 group-hover:text-blue-700 sm:text-lg motion-reduce:transition-none">
            {item.price}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-stone-500">
            <Icon name="Eye" /> {item.views}
          </span>
        </div>

        {/* Action Buttons - pinned to bottom with mt-auto and identical height */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button
            disabled={!item.sourceProductId}
            size="sm"
            type="button"
            onClick={handleBuyNow}
            className="h-11 min-w-0 flex-1 cursor-pointer rounded-sm bg-amber-500 px-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-500 sm:px-3 motion-reduce:transition-none"
          >
            <Icon name="ShoppingCart" />
            {settings?.buyButtonText || "Buy Now"}
          </Button>
          <Link
            href={detailUrl}
            aria-label={`View details of ${item.title}`}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-stone-200 text-stone-700 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none"
          >
            <Icon name="Eye" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RenderItem;
