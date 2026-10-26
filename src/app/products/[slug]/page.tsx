/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

import { CheckCircle2, ChevronRight, ShieldCheck, Star, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/products/ProductActions";
import { ProductGallery } from "@/components/products/ProductGallery";
import { RichTextPreview } from "@/components/sections/section-1/RichTextEditor";
import { getPublicProduct } from "@/lib/products/server";

async function find(params: Promise<{ slug: string }>) {
  return getPublicProduct((await params).slug);
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await find(params);
  return product ? { title: product.name, description: product.shortDescription } : { title: "Product not found" };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await find(params);
  if (!product) notFound();
  return (
    <main className="min-h-screen bg-[#fffdf8] text-stone-900">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <nav className="flex items-center gap-1 text-sm text-stone-500">
          <Link className="hover:text-amber-700" href="/products">
            Products
          </Link>
          <ChevronRight size={15} />
          <span className="truncate text-stone-700">{product.name}</span>
        </nav>
        <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_.95fr] lg:py-14">
          <ProductGallery
            images={[product.primaryImage, ...product.images.filter((image) => image !== product.primaryImage)]}
            name={product.name}
          />
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">{product.brand}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">
                <Star className="fill-current" size={16} /> {product.star.toFixed(1)}
              </span>
              <span className="text-sm text-stone-500">SKU {product.sku}</span>
            </div>
            <p className="mt-7 text-base leading-7 text-stone-600">{product.shortDescription}</p>
            <div className="my-8 flex items-end gap-3">
              <span className="text-4xl font-black">৳{product.discountPrice.toLocaleString("en-BD")}</span>
              {product.discountPrice < product.realPrice && (
                <span className="pb-1 text-lg text-stone-400 line-through">
                  ৳{product.realPrice.toLocaleString("en-BD")}
                </span>
              )}
            </div>
            <ProductActions product={product} />
            <div className="mt-8 grid gap-3 border-t border-stone-200 pt-7 sm:grid-cols-2">
              <p className="flex gap-3 text-sm text-stone-600">
                <Truck className="shrink-0 text-amber-600" size={20} />
                <span>
                  <strong className="block text-stone-900">Delivery</strong>
                  {product.deliveryTime}
                </span>
              </p>
              <p className="flex gap-3 text-sm text-stone-600">
                <ShieldCheck className="shrink-0 text-amber-600" size={20} />
                <span>
                  <strong className="block text-stone-900">Warranty</strong>
                  {product.warranty}
                </span>
              </p>
            </div>
          </div>
        </section>
        <section className="grid gap-10 border-t border-stone-200 py-12 lg:grid-cols-[1fr_.7fr]">
          <div>
            <h2 className="text-2xl font-black">Product details</h2>
            <div className="mt-4 rounded-sm border border-stone-200 bg-white p-5 shadow-sm">
              <RichTextPreview value={product.description} />
            </div>
          </div>
          <aside className="rounded-sm border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900">Highlights</h2>
            <ul className="mt-5 space-y-3">
              {product.mainFeatures.map((feature) => (
                <li className="flex gap-3 text-sm text-stone-700" key={feature}>
                  <CheckCircle2 className="shrink-0 text-amber-600" size={18} />
                  {feature}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
