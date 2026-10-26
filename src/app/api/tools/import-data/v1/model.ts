/*
|-----------------------------------------
| setting up import-data model for the App
|-----------------------------------------
*/

import "server-only";

import type { ImportPageVariant } from "@/lib/defaults/import-data";
import { database } from "@/lib/db";

export type ImportSidebar = {
  id: string;
  name: string;
  url: string;
  icon: string;
  parentId: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SavedImportSidebar = Pick<ImportSidebar, "id" | "name" | "url" | "icon" | "parentId" | "position">;

export type ImportSitePage = {
  id: string;
  title: string;
  path: string;
  description: string;
  published: boolean;
  blocks: {
    id: string;
    type: "all-page";
    variant: ImportPageVariant | "all-about" | "all-contact" | "all-faq";
    data: Record<string, string>;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

const importSidebars = () => database().collection<ImportSidebar>("sidebar");
const importPages = () => database().collection<ImportSitePage>("pages");

export const findImportSidebars = () =>
  importSidebars()
    .find({}, { projection: { id: 1, name: 1, url: 1, icon: 1, parentId: 1, position: 1 } })
    .toArray();

export const updateImportSidebar = (id: string, changes: Partial<ImportSidebar>) =>
  importSidebars().updateOne({ id }, { $set: changes });

export const createImportSidebar = (item: ImportSidebar) => importSidebars().insertOne(item);

export const migrateImportPageVariant = (from: "all-faq" | "all-about" | "all-contact", to: ImportPageVariant) =>
  importPages().updateMany(
    { "blocks.variant": from },
    { $set: { "blocks.$[block].variant": to, updatedAt: new Date() } },
    { arrayFilters: [{ "block.variant": from }] },
  );

export const findImportPagePaths = async () =>
  new Set(
    (
      await importPages()
        .find({}, { projection: { path: 1 } })
        .toArray()
    ).map((page) => page.path),
  );

export const migrateImportHomePage = () =>
  importPages().updateOne({ path: "/home" }, { $set: { path: "/", title: "Home", updatedAt: new Date() } });

export const createImportPage = (page: ImportSitePage) => importPages().insertOne(page);
