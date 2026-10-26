/*
|-----------------------------------------
| setting up catalog model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import type { Category, Product } from "@/lib/dashboard/catalog";
import { database } from "@/lib/db";

export const categoriesCollection = () => database().collection<Category>("categories");
export const productsCollection = () => database().collection<Product>("products");

export const findProductById = (id: string) => productsCollection().findOne({ id });
export const findActiveProductBySlug = (slug: string) => productsCollection().findOne({ slug, status: "active" });
export const restoreProductStock = (id: string, quantity: number, updatedAt = new Date()) =>
  productsCollection().updateOne({ id }, { $inc: { stock: quantity }, $set: { updatedAt } });

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
export const categoryHasProducts = (id: string) =>
  productsCollection().countDocuments({ categories: id }, { limit: 1 });
export const deleteCategory = (id: string) => categoriesCollection().deleteOne({ id });
export const categoriesHaveProducts = (ids: string[]) =>
  productsCollection().findOne({ categories: { $in: ids } }, { projection: { id: 1 } });
export const deleteCategories = (ids: string[]) => categoriesCollection().deleteMany({ id: { $in: ids } });
export const updateCategoriesStatus = (ids: string[], status: Category["status"]) =>
  categoriesCollection().updateMany({ id: { $in: ids } }, { $set: { status, updatedAt: new Date() } });
export const updateProduct = (
  id: string,
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "stock"> & { stock?: number },
) =>
  productsCollection().findOneAndUpdate(
    { id },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
export const updateProductInventory = (id: string, data: Partial<Pick<Product, "status" | "stock">>) =>
  productsCollection().findOneAndUpdate(
    { id },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
export const deleteProduct = (id: string) => productsCollection().deleteOne({ id });
export const deleteProducts = (ids: string[]) => productsCollection().deleteMany({ id: { $in: ids } });
export const updateProductsStatus = (ids: string[], status: Product["status"]) =>
  productsCollection().updateMany({ id: { $in: ids } }, { $set: { status, updatedAt: new Date() } });
