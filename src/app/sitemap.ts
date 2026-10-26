/*
|-----------------------------------------
| setting up sitemap.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import "server-only";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import { pagesCollection } from "@/lib/models/pages";
import { seoSettingsCollection, type SeoSettingsRecord } from "@/lib/models/site-settings";
import { normalizePagePath } from "@/lib/pages/server";

const nonIndexablePathPrefixes = [
  "/api",
  "/dashboard",
  "/tools",
  "/login",
  "/login-demo",
  "/registration",
  "/forgot-password",
  "/search",
  "/_next",
];

function isIndexableCmsPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || /[?#\\\u0000-\u001f]/.test(value)) return false;
  const path = normalizePagePath(value);
  if (path !== value) return false;
  if (["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/favicon.ico", "/not-found"].includes(path))
    return false;
  return !nonIndexablePathPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function isIndexableCanonicalPath(value: string) {
  try {
    return isIndexableCmsPath(decodeURIComponent(value));
  } catch {
    return false;
  }
}

const getCachedCmsEntries = unstable_cache(
  async () => {
    const [pages, settings] = await Promise.all([
      pagesCollection()
        .find({ published: true }, { projection: { _id: 0, id: 1, path: 1, updatedAt: 1 } })
        .toArray(),
      seoSettingsCollection()
        .find({}, { projection: { _id: 0, targetKey: 1, canonicalUrl: 1, updatedAt: 1 } })
        .toArray(),
    ]);
    const settingsByTarget = new Map(
      settings.map((item) => [
        item.targetKey,
        item as Pick<SeoSettingsRecord, "targetKey" | "canonicalUrl" | "updatedAt">,
      ]),
    );
    const layoutCanonical = settingsByTarget.get("layout")?.canonicalUrl;
    const canonicalOrigin = getCanonicalAppUrl();
    const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

    for (const page of pages) {
      if (!isIndexableCmsPath(page.path)) continue;
      const pageSetting = settingsByTarget.get(`page:${page.id}`);
      const canonical = pageSetting?.canonicalUrl || layoutCanonical;
      let url = new URL(page.path, canonicalOrigin);
      if (canonical) {
        try {
          const configuredCanonical = new URL(canonical);
          if (
            configuredCanonical.origin !== canonicalOrigin.origin ||
            configuredCanonical.username ||
            configuredCanonical.password ||
            configuredCanonical.search ||
            configuredCanonical.hash ||
            !isIndexableCanonicalPath(configuredCanonical.pathname)
          )
            continue;
          url = configuredCanonical;
        } catch {
          continue;
        }
      }
      const pageModified = new Date(page.updatedAt);
      const settingModified = pageSetting?.updatedAt ?? new Date(0);
      const lastModified = pageModified > settingModified ? pageModified : settingModified;
      const current = byUrl.get(url.toString());
      byUrl.set(url.toString(), {
        url: url.toString(),
        lastModified:
          current?.lastModified && current.lastModified > lastModified ? current.lastModified : lastModified,
      });
    }

    return [...byUrl.values()];
  },
  ["indexable-sitemap-cms-pages"],
  { revalidate: false, tags: ["site-pages", "site-seo"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedCmsEntries();
}
