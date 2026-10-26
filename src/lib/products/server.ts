/*
|-----------------------------------------
| setting up server.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";

import type { Product, PublicContainerProduct } from "@/lib/dashboard/catalog";
import { categoriesCollection, productsCollection } from "@/lib/models/catalog";

export const productCatalogCacheTag = "public-product-catalog";
export const productCategoryCacheTag = "public-product-categories";
export const invalidatePublicProductCatalogCache = () => revalidateTag(productCatalogCacheTag, { expire: 0 });
export const invalidatePublicProductCategoryCache = () => revalidateTag(productCategoryCacheTag, { expire: 0 });

const products = productsCollection;
const categories = categoriesCollection;

const activeCategories = () =>
  unstable_cache(
    () =>
      categories()
        .find({ status: "active" }, { projection: { _id: 0 } })
        .sort({ name: 1 })
        .toArray(),
    ["public-product-categories"],
    { revalidate: false, tags: [productCategoryCacheTag] },
  )();

export const getPublicCategories = activeCategories;

export type PublicProductView = "all" | "newest" | "deals";

const publicProductPageSize = 24;

export async function getPublicProducts(categorySlug?: string, view: PublicProductView = "all", requestedPage = 1) {
  const category = categorySlug
    ? (await activeCategories()).find((item) => item.slug === categorySlug.toLowerCase())
    : undefined;
  if (categorySlug && !category)
    return {
      category: null,
      items: [] as Product[],
      total: 0,
      page: 1,
      pageSize: publicProductPageSize,
      totalPages: 1,
    };
  const categoryId = category?.id ?? "all";
  const filter = {
    status: "active" as const,
    ...(category ? { categories: category.id } : {}),
    ...(view === "deals" ? { discount: { $gt: 0 } } : {}),
  };
  const safeRequestedPage = Number.isInteger(requestedPage) ? Math.max(1, requestedPage) : 1;
  const total = await unstable_cache(
    () => products().countDocuments(filter),
    ["public-product-count", categoryId, view],
    { revalidate: false, tags: [productCatalogCacheTag, productCategoryCacheTag] },
  )();
  const totalPages = Math.max(1, Math.ceil(total / publicProductPageSize));
  const page = Math.min(safeRequestedPage, totalPages);
  return unstable_cache(
    async () => {
      const items = await products()
        .find(filter, { projection: { _id: 0 } })
        .sort(view === "newest" ? { createdAt: -1, name: 1 } : { isFeatured: -1, updatedAt: -1, name: 1 })
        .skip((page - 1) * publicProductPageSize)
        .limit(publicProductPageSize)
        .toArray();
      return { category: category ?? null, items, total, page, pageSize: publicProductPageSize, totalPages };
    },
    ["public-products", categoryId, view, String(page)],
    { revalidate: false, tags: [productCatalogCacheTag, productCategoryCacheTag] },
  )();
}

export type PublicProductReference = { id?: string; sku?: string };

export async function getPublicProductsByReferences(references: readonly PublicProductReference[]) {
  const ids = [
    ...new Set(references.map((item) => item.id?.trim()).filter((item): item is string => Boolean(item))),
  ].sort();
  const skus = [
    ...new Set(references.map((item) => item.sku?.trim()).filter((item): item is string => Boolean(item))),
  ].sort();
  if (!ids.length && !skus.length) return [];

  const matches = [...(ids.length ? [{ id: { $in: ids } }] : []), ...(skus.length ? [{ sku: { $in: skus } }] : [])];
  const filter = { status: "active" as const, $or: matches };
  return unstable_cache(
    () =>
      products()
        .find<PublicContainerProduct>(filter, {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            slug: 1,
            realPrice: 1,
            discountPrice: 1,
            star: 1,
            primaryImage: 1,
            sku: 1,
            status: 1,
          },
        })
        .toArray(),
    ["public-container-products", JSON.stringify(ids), JSON.stringify(skus)],
    { revalidate: false, tags: [productCatalogCacheTag] },
  )();
}

export function getPublicProduct(slug: string) {
  return unstable_cache(
    () => products().findOne({ slug: slug.toLowerCase(), status: "active" }, { projection: { _id: 0 } }),
    ["public-product", slug.toLowerCase()],
    { revalidate: false, tags: [productCatalogCacheTag] },
  )();
}

export function plainProductDescription(value: string) {
  try {
    const texts: string[] = [];
    const collect = (node: unknown) => {
      if (!node || typeof node !== "object") return;
      const entry = node as { text?: unknown; children?: unknown };
      if (typeof entry.text === "string") texts.push(entry.text);
      if (Array.isArray(entry.children)) entry.children.forEach(collect);
    };
    collect(JSON.parse(value));
    return texts.join("\n").trim() || value;
  } catch {
    return value.replace(/<[^>]*>/g, "");
  }
}
