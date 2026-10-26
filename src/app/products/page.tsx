/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

import { ArrowRight, PackageOpen, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductCategoryNav } from "@/components/products/ProductCategoryNav";
import { getPublicCategories, getPublicProducts } from "@/lib/products/server";

export const metadata: Metadata = { title: "Products", description: "Explore our curated technology collection." };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string; sort?: string; page?: string }>;
}) {
  const { category: requestedCategory, collection, sort, page: requestedPage } = await searchParams;
  const categorySlug = requestedCategory?.trim().toLowerCase();
  const view =
    collection?.trim().toLowerCase() === "deals" ? "deals" : sort?.trim().toLowerCase() === "newest" ? "newest" : "all";
  const pageNumber = Number.parseInt(requestedPage ?? "1", 10);
  const [{ items, category, total, page, totalPages }, categories] = await Promise.all([
    getPublicProducts(categorySlug, view, Number.isFinite(pageNumber) ? pageNumber : 1),
    getPublicCategories(),
  ]);
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (view === "deals") params.set("collection", "deals");
    if (view === "newest") params.set("sort", "newest");
    params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };
  const header =
    view === "deals"
      ? {
          eyebrow: "Limited-time savings",
          title: "Deals worth grabbing",
          description: "Shop active offers and save on technology picked for you.",
          tone: "border-rose-100 bg-[radial-gradient(circle_at_12%_0%,#ffe0df,transparent_34%),radial-gradient(circle_at_92%_30%,#fff0bf,transparent_30%)]",
        }
      : view === "newest"
        ? {
            eyebrow: "Just arrived",
            title: "New arrivals",
            description: "The latest products added to our collection, first.",
            tone: "border-sky-100 bg-[radial-gradient(circle_at_12%_0%,#dcefff,transparent_34%),radial-gradient(circle_at_92%_30%,#e5f8df,transparent_30%)]",
          }
        : {
            eyebrow: "Curated technology",
            title: category ? category.name : "Discover what moves you",
            description: "Explore our curated technology collection.",
            tone: "border-amber-100 bg-[radial-gradient(circle_at_12%_0%,#fde8bc,transparent_34%),radial-gradient(circle_at_92%_30%,#fee2d1,transparent_30%)]",
          };
  return (
    <main className="min-h-screen bg-[#fffdf8] text-stone-900">
      <section className={`overflow-hidden border-b ${header.tone}`}>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <p className="text-xs font-bold tracking-[0.18em] text-amber-800 uppercase">{header.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">{header.title}</h1>
          <div className="mt-4">
            <p className="max-w-2xl text-sm text-stone-600">{header.description}</p>
            <p className="text-sm font-bold text-stone-500">
              {total} {total === 1 ? "product" : "products"} Found
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8 lg:items-start">
          <ProductCategoryNav
            activeCategoryId={category?.id}
            categories={categories}
            hasCategoryFilter={Boolean(categorySlug)}
          />
          <div className="min-w-0">
            <div className="mb-7 hidden items-end justify-between gap-4 lg:flex"></div>
            {items.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product, index) => (
                  <Link
                    className="group overflow-hidden rounded-sm bg-white ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/10"
                    href={`/products/${product.slug}`}
                    key={product.id}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-50 to-amber-50">
                      {product.primaryImage && (
                        <Image
                          alt={product.name}
                          className="object-contain p-7 transition duration-500 group-hover:scale-105"
                          fill
                          loading={index === 0 ? "eager" : "lazy"}
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          src={product.primaryImage}
                        />
                      )}
                      {product.discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
                          -{Math.round(product.discount)}%
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="truncate text-xs font-bold uppercase tracking-wider text-amber-700">
                        {product.brand}
                      </p>
                      <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-bold leading-6">{product.name}</h3>
                      <div className="mt-3 flex items-center gap-1 text-sm text-amber-600">
                        <Star className="fill-current" size={15} /> {product.star.toFixed(1)}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span>
                          <span className="text-lg font-black">৳{product.discountPrice.toLocaleString("en-BD")}</span>
                          {view === "deals" && product.discount > 0 ? (
                            <span className="ml-2 text-xs font-medium text-stone-400 line-through">
                              ৳{product.realPrice.toLocaleString("en-BD")}
                            </span>
                          ) : null}
                        </span>
                        <ArrowRight className="transition group-hover:translate-x-1" size={18} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid min-h-72 place-items-center rounded-sm border border-dashed border-stone-300 bg-white p-8 text-center">
                <div>
                  <PackageOpen className="mx-auto text-amber-600" size={36} />
                  <h2 className="mt-4 text-xl font-bold">No active products here yet</h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Choose another category or check back after the catalog is published.
                  </p>
                </div>
              </div>
            )}
            {totalPages > 1 && (
              <nav aria-label="Product pages" className="mt-8 flex items-center justify-between gap-4">
                {page > 1 ? (
                  <Link
                    className="rounded-sm border border-stone-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-amber-50"
                    href={pageHref(page - 1)}
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-sm border border-stone-100 px-4 py-2 text-sm text-stone-400">Previous</span>
                )}
                <span className="text-sm font-semibold text-stone-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    className="rounded-sm border border-stone-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-amber-50"
                    href={pageHref(page + 1)}
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-sm border border-stone-100 px-4 py-2 text-sm text-stone-400">Next</span>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
