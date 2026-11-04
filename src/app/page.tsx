/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import type { Metadata, ResolvingMetadata } from "next";

import type { HomeData } from "@/components/pages/home/data";
import HomeQuery from "@/components/pages/home/Query";
import { getPublishedPageSeoMetadata } from "@/lib/pages/seo-metadata";
import { getPublishedPage } from "@/lib/pages/server";

export async function generateMetadata(_props: object, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await getPublishedPage("/");
  return page ? getPublishedPageSeoMetadata(page, parent) : {};
}

export default async function Home() {
  const page = await getPublishedPage("/");
  const homeBlock = page?.blocks.find((block) => block.type === "all-page" && block.variant === "all-home");
  return (
    <main className="flex-1">
      <HomeQuery data={homeBlock?.data as Partial<HomeData> | undefined} />
    </main>
  );
}
