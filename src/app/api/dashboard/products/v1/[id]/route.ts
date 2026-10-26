/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { authorizeProductRequest } from "@/app/api/lib/catalog-authorization";
import { parseProductInput, parseProductInventoryInput } from "@/lib/dashboard/catalog";
import { findProductById } from "@/lib/models/catalog";
import {
  duplicateProductError,
  ensureProductIndexes,
  serializeProduct,
  validateProductCategories,
  removeProduct,
  updateProductForApi,
  updateProductInventoryForApi,
} from "@/lib/services/products";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeProductRequest(request, "PATCH");
  if ("error" in access) return access.error;
  const body = await request.json().catch(() => null);
  const { id } = await params;
  const isInventoryUpdate =
    Boolean(body && typeof body === "object" && !Array.isArray(body)) &&
    Object.keys(body as object).length > 0 &&
    Object.keys(body as object).every((key) => key === "stock" || key === "status");
  if (isInventoryUpdate) {
    const inventory = parseProductInventoryInput(body);
    if (!inventory)
      return Response.json(
        { error: "Stock must be a whole number of zero or more and status must be valid." },
        { status: 400 },
      );
    await ensureProductIndexes();
    const item = await updateProductInventoryForApi(id, inventory);
    if (!item) return Response.json({ error: "Product not found." }, { status: 404 });
    return Response.json({ item: serializeProduct(item) });
  }

  const existing = await findProductById(id);
  if (!existing) return Response.json({ error: "Product not found." }, { status: 404 });
  const updateStock = Boolean(body && typeof body === "object" && Object.hasOwn(body, "stock"));
  const data = parseProductInput(
    body && typeof body === "object" && !Array.isArray(body)
      ? { ...body, stock: updateStock ? (body as { stock?: unknown }).stock : (existing.stock ?? 0) }
      : body,
  );
  if (!data)
    return Response.json({ error: "Enter valid product details, images, prices, stock, and status." }, { status: 400 });
  if (!(await validateProductCategories(data.categories)))
    return Response.json({ error: "Select only existing categories." }, { status: 400 });
  try {
    await ensureProductIndexes();
    const item = await updateProductForApi(id, data, updateStock);
    if (!item) return Response.json({ error: "Product not found." }, { status: 404 });
    return Response.json({ item: serializeProduct(item) });
  } catch (error) {
    const message = duplicateProductError(error);
    if (message) return Response.json({ error: message }, { status: 409 });
    throw error;
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeProductRequest(request, "DELETE");
  if ("error" in access) return access.error;
  const { id } = await params;
  return (await removeProduct(id))
    ? Response.json({ ok: true })
    : Response.json({ error: "Product not found." }, { status: 404 });
}
