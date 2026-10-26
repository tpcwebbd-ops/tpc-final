/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { authorizeCategoryRequest } from "@/app/api/lib/catalog-authorization";
import { parseCategoryInput } from "@/lib/dashboard/catalog";
import { createCategoryForApi, listCategoriesForApi, serializeCategory } from "@/lib/services/categories";

const pageSizes = [10, 25, 50, 100];
export async function GET(request: Request) {
  const access = await authorizeCategoryRequest(request, "GET");
  if ("error" in access) return access.error;
  const query = new URL(request.url).searchParams;
  const hasPagination = ["page", "pageSize", "search", "status"].some((key) => query.has(key));
  const requestedPageSize = Number(query.get("pageSize"));
  const pageSize = pageSizes.includes(requestedPageSize) ? requestedPageSize : 10;
  const requestedPage = Number.parseInt(query.get("page") ?? "1", 10);
  return Response.json(
    await listCategoriesForApi({
      hasPagination,
      pageSize,
      requestedPage: Number.isFinite(requestedPage) ? requestedPage : 1,
      status: query.get("status"),
      search: query.get("search")?.trim(),
    }),
  );
}
export async function POST(request: Request) {
  const access = await authorizeCategoryRequest(request, "POST");
  if ("error" in access) return access.error;
  const data = parseCategoryInput(await request.json().catch(() => null));
  if (!data)
    return Response.json({ error: "Enter a category name, valid slug, description, and status." }, { status: 400 });
  const result = await createCategoryForApi(data);
  if (result.kind === "duplicate")
    return Response.json({ error: "That category slug already exists." }, { status: 409 });
  return Response.json({ item: serializeCategory(result.item) }, { status: 201 });
}
