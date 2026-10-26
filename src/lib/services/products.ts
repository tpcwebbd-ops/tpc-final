/*
|-----------------------------------------
| setting up products service for the App
|-----------------------------------------
*/
import "server-only";

import { MongoServerError } from "mongodb";

import { client } from "@/app/api/lib/auth";
import type { Category, Product, ProductInput } from "@/lib/dashboard/catalog";
import {
  deleteProduct,
  deleteProducts,
  updateProduct,
  updateProductInventory,
  updateProductsStatus,
} from "@/lib/models/catalog";
import { invalidatePublicProductCatalogCache } from "@/lib/products/server";
const products = () => client.db().collection<Product>("products");
const categories = () => client.db().collection<Category>("categories");
export const serializeProduct = (item: Product) => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});
export async function ensureProductIndexes() {
  await Promise.all([
    products().createIndex({ slug: 1 }, { name: "product_slug_unique", unique: true }),
    products().createIndex({ sku: 1 }, { name: "product_sku_unique", unique: true }),
    products().createIndex({ categories: 1 }, { name: "product_categories_index" }),
  ]);
}
export async function validateProductCategories(categoryIds: string[]) {
  const found = await categories().countDocuments({ id: { $in: categoryIds } });
  return found === categoryIds.length;
}
export function duplicateProductError(error: unknown) {
  if (!(error instanceof MongoServerError) || error.code !== 11000) return null;
  return error.keyPattern?.sku ? "That SKU already exists." : "That product slug already exists.";
}
export async function updateProductForApi(id: string, data: ProductInput, updateStock = true) {
  const fields: Omit<ProductInput, "stock"> & { stock?: number } = { ...data };
  if (!updateStock) delete fields.stock;
  const item = await updateProduct(id, fields);
  if (item) invalidatePublicProductCatalogCache();
  return item;
}
export async function updateProductInventoryForApi(id: string, data: Partial<Pick<ProductInput, "status" | "stock">>) {
  const item = await updateProductInventory(id, data);
  if (item) invalidatePublicProductCatalogCache();
  return item;
}
export async function removeProduct(id: string) {
  const deleted = (await deleteProduct(id)).deletedCount > 0;
  if (deleted) invalidatePublicProductCatalogCache();
  return deleted;
}
export async function removeProducts(ids: string[]) {
  const deletedCount = (await deleteProducts(ids)).deletedCount;
  if (deletedCount) invalidatePublicProductCatalogCache();
  return deletedCount;
}
export async function updateProductStatuses(ids: string[], status: import("@/lib/dashboard/catalog").ProductStatus) {
  const updatedCount = (await updateProductsStatus(ids, status)).modifiedCount;
  if (updatedCount) invalidatePublicProductCatalogCache();
  return updatedCount;
}
