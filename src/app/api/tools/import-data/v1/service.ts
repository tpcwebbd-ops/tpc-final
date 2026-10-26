/*
|-----------------------------------------
| setting up import-data service for the App
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import { revalidatePath, revalidateTag } from "next/cache";

import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { isRetiredDashboardRoute } from "@/lib/dashboard/retired-routes";
import { pageDefaults, sidebarDefaults } from "@/lib/defaults/import-data";
import { pageCacheTag } from "@/lib/pages/server";

import {
  IMPORT_DATA_SOURCE,
  createImportPage,
  createImportSidebar,
  deleteImportPages,
  deleteImportSidebars,
  findImportPages,
  findImportPagePaths,
  findImportSidebars,
  migrateImportHomePage,
  migrateImportPageVariant,
  type ImportSitePage,
  updateImportSidebar,
  type ImportSidebar,
  type SavedImportSidebar,
} from "./model";

type ImportRequest = { pagePaths?: unknown; sidebarUrls?: unknown; target?: "all" | "sidebar" | "pages" } | null;

const defaultSidebarUrls = new Set(
  sidebarDefaults
    .flatMap((item) => [item.url, ...(item.children ?? []).map((child) => child.url)])
    .filter((url) => !isRetiredDashboardRoute(url)),
);
const defaultPagePaths = new Set(pageDefaults.map((page) => page.path));

type ResettableImportData = {
  pages: ImportSitePage[];
  sidebarIds: string[];
};

function findLegacySidebarIds(sidebars: SavedImportSidebar[]) {
  const legacyIds = new Set<string>();
  const matchingItems = (
    expected: { icon: string; name: string; position: number; url: string },
    parentId: string | null,
  ) =>
    sidebars.filter(
      (item) =>
        !item.importSource &&
        item.name === expected.name &&
        item.url === expected.url &&
        item.icon === expected.icon &&
        item.parentId === parentId &&
        item.position === expected.position,
    );

  for (let parentPosition = 0; parentPosition < sidebarDefaults.length; parentPosition += 1) {
    const parent = sidebarDefaults[parentPosition];
    const parents = matchingItems({ ...parent, position: parentPosition }, null);
    if (parents.length !== 1) continue;
    const [savedParent] = parents;
    legacyIds.add(savedParent.id);
    for (let childPosition = 0; childPosition < (parent.children?.length ?? 0); childPosition += 1) {
      const child = parent.children![childPosition];
      const children = matchingItems({ ...child, position: childPosition }, savedParent.id);
      if (children.length === 1) legacyIds.add(children[0].id);
    }
  }
  return legacyIds;
}

function isLegacyImportPage(page: ImportSitePage) {
  const expected = pageDefaults.find((item) => item.path === page.path);
  if (
    !expected ||
    page.importSource ||
    page.title !== expected.title ||
    page.description !== expected.description ||
    !page.published
  )
    return false;
  if (page.blocks.length !== 1) return false;
  const [block] = page.blocks;
  return (
    block.type === "all-page" &&
    block.variant === expected.variant &&
    Boolean(block.data) &&
    typeof block.data === "object" &&
    !Array.isArray(block.data) &&
    Object.keys(block.data).length === 0
  );
}

async function getResettableImportData(): Promise<ResettableImportData> {
  const [sidebars, pages] = await Promise.all([findImportSidebars(), findImportPages()]);
  const sidebarIds = new Set(
    sidebars.filter((item) => item.importSource === IMPORT_DATA_SOURCE).map((item) => item.id),
  );
  for (const id of findLegacySidebarIds(sidebars)) sidebarIds.add(id);
  return {
    pages: pages.filter((page) => page.importSource === IMPORT_DATA_SOURCE || isLegacyImportPage(page)),
    sidebarIds: [...sidebarIds],
  };
}

export async function getImportResetStatus() {
  const { pages, sidebarIds } = await getResettableImportData();
  return { resettablePageCount: pages.length, resettableSidebarCount: sidebarIds.length };
}

export async function resetImportDefaultData() {
  const { pages, sidebarIds } = await getResettableImportData();
  const [sidebarsResult, pagesResult] = await Promise.all([
    deleteImportSidebars(sidebarIds),
    deleteImportPages(pages.map((page) => page.id)),
  ]);

  if (sidebarsResult.deletedCount) await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  if (pagesResult.deletedCount) {
    for (const path of new Set(pages.map((page) => page.path))) {
      revalidatePath(path);
      revalidateTag(pageCacheTag(path), "max");
    }
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidateTag("site-pages", "max");
    revalidateTag("public-page-search", { expire: 0 });
  }
  return { pagesDeleted: pagesResult.deletedCount, sidebarsDeleted: sidebarsResult.deletedCount };
}

export async function importDefaultData(body: ImportRequest) {
  const legacyTarget = body?.target ?? "all";
  const selectedSidebarUrls = new Set(
    Array.isArray(body?.sidebarUrls)
      ? body.sidebarUrls.filter(
          (url): url is string =>
            typeof url === "string" && !isRetiredDashboardRoute(url) && defaultSidebarUrls.has(url),
        )
      : legacyTarget === "pages"
        ? []
        : defaultSidebarUrls,
  );
  const selectedPagePaths = new Set(
    Array.isArray(body?.pagePaths)
      ? body.pagePaths.filter((path): path is string => typeof path === "string" && defaultPagePaths.has(path))
      : legacyTarget === "sidebar"
        ? []
        : defaultPagePaths,
  );
  const importSidebars = selectedSidebarUrls.size > 0;
  const importPages = selectedPagePaths.size > 0;
  const existing: SavedImportSidebar[] = importSidebars ? await findImportSidebars() : [];
  const itemsByUrl = new Map(existing.map((item) => [item.url, item]));

  const legacyAdmin = itemsByUrl.get("/dashboard/Admin");
  if (selectedSidebarUrls.has("/dashboard/admin") && legacyAdmin && !itemsByUrl.has("/dashboard/admin")) {
    await updateImportSidebar(legacyAdmin.id, { url: "/dashboard/admin", updatedAt: new Date() });
    legacyAdmin.url = "/dashboard/admin";
    itemsByUrl.delete("/dashboard/Admin");
    itemsByUrl.set(legacyAdmin.url, legacyAdmin);
  }
  let inserted = 0;
  let updated = 0;
  if (importSidebars)
    for (let parentPosition = 0; parentPosition < sidebarDefaults.length; parentPosition += 1) {
      const parent = sidebarDefaults[parentPosition];
      if (!selectedSidebarUrls.has(parent.url)) continue;
      let savedParent = itemsByUrl.get(parent.url);
      if (!savedParent) {
        const item: ImportSidebar = {
          id: randomUUID(),
          name: parent.name,
          url: parent.url,
          icon: parent.icon,
          parentId: null,
          position: parentPosition,
          importSource: IMPORT_DATA_SOURCE,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createImportSidebar(item);
        savedParent = item;
        itemsByUrl.set(parent.url, savedParent);
        inserted += 1;
      } else {
        const changes = {
          name: parent.name,
          icon: parent.icon,
          parentId: null,
          position: parentPosition,
          updatedAt: new Date(),
        };
        if (
          savedParent.name !== changes.name ||
          savedParent.icon !== changes.icon ||
          savedParent.parentId !== changes.parentId ||
          savedParent.position !== changes.position
        ) {
          await updateImportSidebar(savedParent.id, changes);
          Object.assign(savedParent, changes);
          updated += 1;
        }
      }
      for (let childPosition = 0; childPosition < (parent.children?.length ?? 0); childPosition += 1) {
        const child = parent.children![childPosition];
        if (!selectedSidebarUrls.has(child.url)) continue;
        const savedChild = itemsByUrl.get(child.url);
        if (!savedChild) {
          const item: ImportSidebar = {
            id: randomUUID(),
            name: child.name,
            url: child.url,
            icon: child.icon,
            parentId: savedParent.id,
            position: childPosition,
            importSource: IMPORT_DATA_SOURCE,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await createImportSidebar(item);
          itemsByUrl.set(child.url, item);
          inserted += 1;
        } else {
          const changes = {
            name: child.name,
            icon: child.icon,
            parentId: savedParent.id,
            position: childPosition,
            updatedAt: new Date(),
          };
          if (
            savedChild.name !== changes.name ||
            savedChild.icon !== changes.icon ||
            savedChild.parentId !== changes.parentId ||
            savedChild.position !== changes.position
          ) {
            await updateImportSidebar(savedChild.id, changes);
            Object.assign(savedChild, changes);
            updated += 1;
          }
        }
      }
    }

  let pagesInserted = 0;
  let pagesUpdated = 0;
  if (importPages) {
    for (const [path, from, to] of [
      ["/frequently-ask-questions", "all-faq", "all-frequently-ask-questions"],
      ["/about-us", "all-about", "all-about-us"],
      ["/contact-us", "all-contact", "all-contact-us"],
    ] as const)
      if (selectedPagePaths.has(path)) pagesUpdated += (await migrateImportPageVariant(from, to)).modifiedCount;
    const existingPaths = await findImportPagePaths();
    if (selectedPagePaths.has("/") && !existingPaths.has("/") && existingPaths.has("/home")) {
      await migrateImportHomePage();
      existingPaths.delete("/home");
      existingPaths.add("/");
      pagesUpdated += 1;
      revalidatePath("/");
    }
    for (const page of pageDefaults) {
      if (!selectedPagePaths.has(page.path) || existingPaths.has(page.path)) continue;
      const now = new Date();
      await createImportPage({
        id: randomUUID(),
        title: page.title,
        path: page.path,
        description: page.description,
        published: true,
        importSource: IMPORT_DATA_SOURCE,
        blocks: [{ id: randomUUID(), type: "all-page", variant: page.variant, data: {} }],
        createdAt: now,
        updatedAt: now,
      });
      pagesInserted += 1;
      revalidatePath(page.path);
    }
    if (pagesInserted) {
      revalidatePath("/", "layout");
    }
    if (pagesInserted || pagesUpdated) {
      revalidatePath("/sitemap.xml");
      revalidateTag("site-pages", "max");
      revalidateTag("public-page-search", { expire: 0 });
    }
  }
  if (inserted || updated) await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return { inserted, updated, pagesInserted, pagesUpdated };
}
