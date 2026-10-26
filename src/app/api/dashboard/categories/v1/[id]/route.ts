/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { authorizeCategoryRequest } from "@/app/api/lib/dashboard-resource-authorization";
import { parseCategoryInput } from "@/lib/dashboard/catalog";
import { removeCategoryForApi, serializeCategory, updateCategoryForApi } from "@/lib/services/categories";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeCategoryRequest(request, "PATCH");
  if ("error" in access) return access.error;
  const data = parseCategoryInput(await request.json().catch(() => null));
  if (!data)
    return Response.json({ error: "Enter a category name, valid slug, description, and status." }, { status: 400 });
  const { id } = await params;
  const result = await updateCategoryForApi(id, data);
  if (result.kind === "duplicate")
    return Response.json({ error: "That category slug already exists." }, { status: 409 });
  if (result.kind === "not-found") return Response.json({ error: "Category not found." }, { status: 404 });
  return Response.json({ item: serializeCategory(result.item) });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeCategoryRequest(request, "DELETE");
  if ("error" in access) return access.error;
  const { id } = await params;
  const result = await removeCategoryForApi(id);
  return result.kind === "deleted"
    ? Response.json({ ok: true })
    : Response.json({ error: "Category not found." }, { status: 404 });
}
