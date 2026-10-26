/*
|-----------------------------------------
| setting up product-data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, September, 2026
|-----------------------------------------
*/

import type { PublicContainerProduct } from "@/lib/dashboard/catalog";

import { type ContainerSortMode, type TemplateItem, templateImagePlaceholder } from "./container-1/data";

export function resolveContainerProducts(
  templates: TemplateItem[],
  products: PublicContainerProduct[],
  sortMode: ContainerSortMode,
): TemplateItem[] {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const productsBySku = new Map(products.filter((product) => product.sku).map((product) => [product.sku, product]));

  const resolved = templates.flatMap((template) => {
    const product =
      (template.sourceProductId ? productsById.get(template.sourceProductId) : undefined) ||
      (template.productUID
        ? productsById.get(template.productUID) || productsBySku.get(template.productUID)
        : undefined);
    if (!product || product.status !== "active") return [];

    const price = Number(product.discountPrice || product.realPrice || 0);
    return [
      {
        ...template,
        sourceProductId: product.id,
        productUID: product.sku || product.id,
        title: product.name || "Untitled Product",
        price: price ? `${price.toLocaleString()}৳` : "0৳",
        rating: Math.min(5, Math.max(0, Number(product.star) || 5)),
        image: product.primaryImage || templateImagePlaceholder,
        url: product.slug ? `/products/${product.slug}` : template.url || "",
      },
    ];
  });

  if (sortMode === "custom") return resolved;
  return resolved.sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
    return sortMode === "ascending" ? result : -result;
  });
}
