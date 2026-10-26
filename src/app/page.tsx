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

export async function generateMetadata(_props: object, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await getPublishedPage("/");
  return page ? getPublishedPageSeoMetadata(page, parent) : {};
}

export default async function Home() {
  const page = await getPublishedPage("/");
  if (page) {
    return (
      <main className="flex-1">
        <PageBlocks blocks={page.blocks} pageId={page.id} />
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10 sm:p-10">
        <p className="text-sm font-semibold tracking-[0.2em] text-blue-600">TestPrep Center</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Your learning journey, ready to begin.
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Prepare for IELTS, plan your study-abroad journey, and support confident young English speakers with TestPrep Center.
        </p>
        <Link className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline" href="/login">
          Sign in or create an account
        </Link>
        <PwaControls />
      </section>
    </main>
  );
}
