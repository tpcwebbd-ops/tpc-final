/*
|-----------------------------------------
| setting up seo-settings service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import "server-only";

import { MongoServerError } from "mongodb";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { pagesCollection } from "@/lib/models/pages";
import {
  createSeoSettings as insertSeoSettings,
  deletePageSeoSettings,
  deleteSeoSettings,
  findSeoSettings,
  seoSettingsCollection,
  updateSeoSettings as updateSeoSettingsRecord,
  type SeoSettingsRecord,
  type SeoSettingsTarget,
} from "@/lib/models/site-settings";

let indexPromise: Promise<string> | null = null;

export function seoSettingsTargetKey(target: SeoSettingsTarget): SeoSettingsRecord["targetKey"] {
  return target.type === "layout" ? "layout" : `page:${target.pageId}`;
}

export function seoSettingsCacheTag(target: SeoSettingsTarget) {
  return `site-seo:${seoSettingsTargetKey(target)}`;
}

export async function ensureSeoSettingsIndexes() {
  if (!indexPromise) {
    indexPromise = seoSettingsCollection()
      .createIndex({ targetKey: 1 }, { name: "seo_settings_target_unique", unique: true })
      .catch((error: unknown) => {
        indexPromise = null;
        throw error;
      });
  }
  return indexPromise;
}

export function isDuplicateSeoSettingsError(error: unknown) {
  return error instanceof MongoServerError && error.code === 11000;
}

export async function getSeoSettings(target: SeoSettingsTarget) {
  const targetKey = seoSettingsTargetKey(target);
  return unstable_cache(
    async () => {
      await ensureSeoSettingsIndexes();
      const record = await findSeoSettings(targetKey);
      if (!record) return null;
      const setting: SeoSettingsRecord = {
        targetKey: record.targetKey,
        target: record.target,
        title: record.title,
        description: record.description,
        socialImage: record.socialImage,
        canonicalUrl: record.canonicalUrl,
        focusKeyword: record.focusKeyword,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      };
      return setting;
    },
    ["seo-settings", targetKey],
    { revalidate: false, tags: ["site-seo", seoSettingsCacheTag(target)] },
  )();
}

export async function listSeoSettings() {
  await ensureSeoSettingsIndexes();
  const settings = await seoSettingsCollection().find({}).sort({ updatedAt: -1 }).toArray();
  const pageIds = settings.flatMap((item) => (item.target.type === "page" ? [item.target.pageId] : []));
  const pages = pageIds.length
    ? await pagesCollection()
        .find({ id: { $in: pageIds }, published: true }, { projection: { _id: 0, id: 1, title: 1, path: 1 } })
        .toArray()
    : [];
  const publishedPages = new Map(pages.map((page) => [page.id, page]));
  return settings.reduce<{ setting: SeoSettingsRecord; page: { id: string; title: string; path: string } | null }[]>(
    (items, setting) => {
      if (setting.target.type === "layout") {
        items.push({ setting, page: null });
        return items;
      }
      const page = publishedPages.get(setting.target.pageId);
      if (page) items.push({ setting, page });
      return items;
    },
    [],
  );
}

export async function listPublishedSeoPages() {
  return pagesCollection()
    .find({ published: true }, { projection: { _id: 0, id: 1, title: 1, path: 1 } })
    .sort({ path: 1 })
    .toArray();
}

export async function findPublishedSeoPage(pageId: string) {
  return pagesCollection().findOne({ id: pageId, published: true }, { projection: { _id: 0, id: 1, path: 1 } });
}

async function findSeoPagePath(pageId: string) {
  const page = await pagesCollection().findOne({ id: pageId }, { projection: { _id: 0, path: 1 } });
  return page?.path ?? null;
}

export function invalidateSeoSettings(target: SeoSettingsTarget, pagePath?: string | null) {
  revalidateTag("site-seo", "max");
  revalidateTag(seoSettingsCacheTag(target), "max");
  revalidatePath("/sitemap.xml");
  if (target.type === "layout") {
    revalidatePath("/", "layout");
  } else if (pagePath) {
    revalidatePath(pagePath);
  }
}

export async function createSeoSettingsRecord(item: SeoSettingsRecord) {
  await ensureSeoSettingsIndexes();
  const publishedPage = item.target.type === "page" ? await findPublishedSeoPage(item.target.pageId) : null;
  if (item.target.type === "page" && !publishedPage) return null;
  await insertSeoSettings(item);
  let pagePath: string | null = null;
  if (item.target.type === "page") {
    const currentPublishedPage = await findPublishedSeoPage(item.target.pageId);
    if (!currentPublishedPage) {
      if (!(await findSeoPagePath(item.target.pageId))) await deleteSeoSettings(item.targetKey);
      return null;
    }
    pagePath = currentPublishedPage.path;
  }
  invalidateSeoSettings(item.target, pagePath);
  return item;
}

export async function updateSeoSettingsRecordForApi(
  target: SeoSettingsTarget,
  changes: Partial<Pick<SeoSettingsRecord, "title" | "description" | "socialImage" | "canonicalUrl" | "focusKeyword">>,
) {
  await ensureSeoSettingsIndexes();
  const updatedAt = new Date();
  const result = await updateSeoSettingsRecord(seoSettingsTargetKey(target), changes, updatedAt);
  if (!result.matchedCount) return null;
  invalidateSeoSettings(target, target.type === "page" ? await findSeoPagePath(target.pageId) : null);
  return findSeoSettings(seoSettingsTargetKey(target));
}

export async function removeSeoSettings(target: SeoSettingsTarget) {
  const pagePath = target.type === "page" ? await findSeoPagePath(target.pageId) : null;
  const result = await deleteSeoSettings(seoSettingsTargetKey(target));
  if (result.deletedCount) invalidateSeoSettings(target, pagePath);
  return result.deletedCount > 0;
}

export async function removeSeoSettingsForDeletedPage(pageId: string, pagePath: string) {
  const result = await deletePageSeoSettings(pageId);
  if (result.deletedCount) invalidateSeoSettings({ type: "page", pageId }, pagePath);
}
