/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { PageBlocks } from "@/components/pages/PageBlocks";
import { PwaControls } from "@/components/pwa-controls";
import { getPublishedPageSeoMetadata } from "@/lib/pages/seo-metadata";
import { getPublishedPage } from "@/lib/pages/server";
import { getPublicProductsByReferences, type PublicProductReference } from "@/lib/products/server";
import type { PageBlock } from "@/redux/features/dashboard/pages/pagesSlice";

function containerProductReferences(blocks: PageBlock[]): PublicProductReference[] {
  const references: PublicProductReference[] = [];
  for (const block of blocks) {
    if (block.type !== "container") continue;
    let data: unknown = block.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        continue;
      }
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) continue;
    const templates = (data as { templates?: unknown }).templates;
    if (!Array.isArray(templates)) continue;
    for (const value of templates) {
      if (!value || typeof value !== "object") continue;
      const template = value as { sourceProductId?: unknown; productUID?: unknown; visible?: unknown };
      if (template.visible === false) continue;
      const id = typeof template.sourceProductId === "string" ? template.sourceProductId.trim() : "";
      const sku = typeof template.productUID === "string" ? template.productUID.trim() : "";
      if (id || sku) references.push({ ...(id ? { id } : {}), ...(sku ? { sku } : {}) });
    }
  }
  return references;
}

export async function generateMetadata(_props: object, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await getPublishedPage("/");
  return page ? getPublishedPageSeoMetadata(page, parent) : {};
}

export default async function Home() {
  const page = await getPublishedPage("/");
  if (page) {
    const products = await getPublicProductsByReferences(containerProductReferences(page.blocks));
    return (
      <main className="flex-1">
        <PageBlocks blocks={page.blocks} pageId={page.id} products={products} />
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10 sm:p-10">
        <p className="text-sm font-semibold tracking-[0.2em] text-blue-600">NexaMart</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Your app, ready to install.
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Install NexaMart for an app-like experience and opt in to receive push notifications.
        </p>
        <Link className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline" href="/login">
          Sign in or create an account
        </Link>
        <PwaControls />
      </section>
    </main>
  );
}
