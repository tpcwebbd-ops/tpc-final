/*
|-----------------------------------------
| setting up seo-metadata.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import "server-only";

import type { Metadata, ResolvingMetadata } from "next";

import { getSeoSettings } from "@/lib/services/seo-settings";

export async function getPublishedPageSeoMetadata(
  page: { id: string; title: string; description: string },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [setting, layoutSetting, inherited] = await Promise.all([
    getSeoSettings({ type: "page", pageId: page.id }),
    getSeoSettings({ type: "layout" }),
    parent,
  ]);
  const layoutTitle = typeof layoutSetting?.title === "string" ? layoutSetting.title : "";
  const layoutDescription = typeof layoutSetting?.description === "string" ? layoutSetting.description : "";
  const title = setting?.title || layoutTitle || page.title;
  const description = setting?.description || layoutDescription || page.description;
  const image = setting?.socialImage;
  const openGraph = {
    ...(inherited.openGraph ?? {}),
    title,
    description,
    ...(setting?.canonicalUrl ? { url: setting.canonicalUrl } : {}),
    ...(image ? { images: [image] } : {}),
  };
  const twitter = {
    ...(inherited.twitter ?? {}),
    title,
    description,
    ...(image ? { images: [image] } : {}),
  };
  const canonical = setting?.canonicalUrl;

  return {
    title,
    description,
    openGraph,
    twitter,
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}
