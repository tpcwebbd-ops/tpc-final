/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { authorizeProductRequest } from "@/app/api/lib/catalog-authorization";
import { productStatuses, type ProductStatus } from "@/lib/dashboard/catalog";
import { removeProducts, updateProductStatuses } from "@/lib/services/products";

function idsFrom(body: unknown) {
  const ids = (body as { ids?: unknown } | null)?.ids;
  return Array.isArray(ids)
    ? [
        ...new Set(
          ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0).map((id) => id.trim()),
        ),
      ]
    : [];
}

export async function DELETE(request: Request) {
  const access = await authorizeProductRequest(request, "DELETE");
  if ("error" in access) return access.error;
  const ids = idsFrom(await request.json().catch(() => null));
  if (!ids.length || ids.length > 100)
    return Response.json({ error: "Select between 1 and 100 products." }, { status: 400 });
  return Response.json({ deletedCount: await removeProducts(ids) });
}

export async function PATCH(request: Request) {
  const access = await authorizeProductRequest(request, "PATCH");
  if ("error" in access) return access.error;
  const body = (await request.json().catch(() => null)) as { ids?: unknown; status?: unknown } | null;
  const ids = idsFrom(body);
  if (!ids.length || ids.length > 100)
    return Response.json({ error: "Select between 1 and 100 products." }, { status: 400 });
  if (!productStatuses.includes(body?.status as ProductStatus))
    return Response.json({ error: "Choose a valid product status." }, { status: 400 });
  return Response.json({ updatedCount: await updateProductStatuses(ids, body?.status as ProductStatus) });
}
