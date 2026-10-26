/*
|-----------------------------------------
| setting up ProductCategoryNav.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type ProductCategoryNavProps = {
  activeCategoryId?: string;
  categories: ProductCategory[];
  hasCategoryFilter: boolean;
};

const categoryLinkClass = (isActive: boolean) =>
  `rounded-sm px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-amber-50 hover:text-stone-950"}`;

export function ProductCategoryNav({ activeCategoryId, categories, hasCategoryFilter }: ProductCategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryLinks = (
    <>
      <Link className={categoryLinkClass(!hasCategoryFilter)} href="/products" onClick={() => setIsOpen(false)}>
        All products
      </Link>
      {categories.map((item) => (
        <Link
          className={categoryLinkClass(activeCategoryId === item.id)}
          href={`/products?category=${item.slug}`}
          key={item.id}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <aside className="sticky top-0 z-30 -mx-5 bg-[#fffdf8]/95 px-5 pb-0 pt-3 backdrop-blur sm:-mx-8 sm:px-8 lg:sticky lg:top-6 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <div className="rounded-sm bg-white ring-1 ring-stone-200 lg:hidden">
        <button
          aria-expanded={isOpen}
          className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-stone-900 [&::-webkit-details-marker]:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
          All categories
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <nav aria-label="Product categories" className="border-t border-stone-100 p-3">
              <div className="grid gap-2">{categoryLinks}</div>
            </nav>
          </div>
        </div>
      </div>
      <nav
        aria-label="Product categories"
        className="hidden overflow-visible rounded-sm bg-white p-3 ring-1 ring-stone-200 lg:block"
      >
        <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Categories</p>
        <div className="flex gap-2 lg:flex-col">{categoryLinks}</div>
      </nav>
    </aside>
  );
}
