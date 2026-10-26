/*
|-----------------------------------------
| setting up server.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 27 August, 2026
|-----------------------------------------
*/

import "server-only";

import { unstable_cache } from "next/cache";

import { pagesCollection } from "@/lib/models/pages";
import type { SitePage } from "@/redux/features/dashboard/pages/pagesSlice";

export function normalizePagePath(value: string) {
  const path = `/${value.trim().replace(/^\/+|\/+$/g, "")}`.replace(/\/+/g, "/");
  return path === "/" ? "/" : path.toLowerCase();
}

export function pageCacheTag(path: string) {
  return `site-page:${normalizePagePath(path)}`;
}

function getCachedPublishedPage(path: string) {
  const normalizedPath = normalizePagePath(path);

  return unstable_cache(
    async () =>
      pagesCollection().findOne({ path: normalizedPath, published: true }, { projection: { _id: 0 } }),
    ["published-page", normalizedPath],
    {
      revalidate: false,
      tags: ["site-pages", pageCacheTag(normalizedPath)],
    },
  )();
}

export function getPublishedPage(path: string) {
  return getCachedPublishedPage(path);
}
