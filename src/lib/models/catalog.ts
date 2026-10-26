/*
|-----------------------------------------
| setting up catalog model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

import "server-only";

import type { Category } from "@/lib/dashboard/catalog";
import { database } from "@/lib/db";

export const categoriesCollection = () => database().collection<Category>("categories");

export const ensureCategoryIndexes = () =>
  categoriesCollection().createIndex({ slug: 1 }, { name: "category_slug_unique", unique: true });
export const listCategories = (filter: Record<string, unknown>, page?: number, pageSize?: number) => {
  const query = categoriesCollection().find(filter).sort({ name: 1 });
  return page && pageSize
    ? query
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray()
    : query.toArray();
};
export const countCategories = (filter: Record<string, unknown>) => categoriesCollection().countDocuments(filter);
export const createCategory = (item: Category) => categoriesCollection().insertOne(item);
export const updateCategory = (id: string, data: Omit<Category, "id" | "createdAt" | "updatedAt">) =>
  categoriesCollection().findOneAndUpdate(
    { id },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
export const deleteCategory = (id: string) => categoriesCollection().deleteOne({ id });
export const deleteCategories = (ids: string[]) => categoriesCollection().deleteMany({ id: { $in: ids } });
export const updateCategoriesStatus = (ids: string[], status: Category["status"]) =>
  categoriesCollection().updateMany({ id: { $in: ids } }, { $set: { status, updatedAt: new Date() } });
