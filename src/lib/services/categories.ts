/*
|-----------------------------------------
| setting up categories service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import { MongoServerError } from "mongodb";

import { type Category, type CategoryInput } from "@/lib/dashboard/catalog";
import {
  countCategories,
  createCategory,
  deleteCategory,
  ensureCategoryIndexes,
  listCategories,
  updateCategory,
  deleteCategories,
  updateCategoriesStatus,
} from "@/lib/models/catalog";

export const serializeCategory = (item: Category) => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export { ensureCategoryIndexes };

export async function listCategoriesForApi(input: {
  hasPagination: boolean;
  pageSize: number;
  requestedPage: number;
  status: string | null;
  search?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (input.status === "active" || input.status === "inactive") filter.status = input.status;
  if (input.search)
    filter.$or = ["name", "slug", "description"].map((field) => ({
      [field]: { $regex: escapeRegex(input.search!), $options: "i" },
    }));
  if (!input.hasPagination) {
    const items = await listCategories({});
    return { items: items.map(serializeCategory), total: items.length, page: 1, pageSize: items.length };
  }
  const total = await countCategories(filter),
    totalPages = Math.max(1, Math.ceil(total / input.pageSize)),
    page = Math.min(totalPages, Math.max(1, input.requestedPage));
  const items = await listCategories(filter, page, input.pageSize);
  return { items: items.map(serializeCategory), total, page, pageSize: input.pageSize };
}
export async function createCategoryForApi(data: CategoryInput) {
  const now = new Date(),
    item: Category = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  try {
    await ensureCategoryIndexes();
    await createCategory(item);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return { kind: "duplicate" as const };
    throw error;
  }
  return { kind: "created" as const, item };
}
export async function updateCategoryForApi(id: string, data: CategoryInput) {
  let item: Category | null;
  try {
    await ensureCategoryIndexes();
    item = await updateCategory(id, data);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return { kind: "duplicate" as const };
    throw error;
  }
  return item ? { kind: "updated" as const, item } : { kind: "not-found" as const };
}
export async function removeCategoryForApi(id: string) {
  const deleted = (await deleteCategory(id)).deletedCount > 0;
  return deleted ? { kind: "deleted" as const } : { kind: "not-found" as const };
}
export async function removeCategoriesForApi(ids: string[]) {
  const deletedCount = (await deleteCategories(ids)).deletedCount;
  return { kind: "deleted" as const, deletedCount };
}
export async function updateCategoriesStatusForApi(ids: string[], status: Category["status"]) {
  return (await updateCategoriesStatus(ids, status)).modifiedCount;
}
