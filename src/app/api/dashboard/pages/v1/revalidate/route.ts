/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { revalidatePath, revalidateTag } from "next/cache";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth, client } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { normalizePagePath, pageCacheTag } from "@/lib/pages/server";
import { invalidatePublicProductCatalogCache, invalidatePublicProductCategoryCache } from "@/lib/products/server";

function refreshPublicCatalog() {
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  invalidatePublicProductCatalogCache();
  invalidatePublicProductCategoryCache();
}
export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-pages-revalidate", 10, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/pages/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const requestedPath = body?.path?.trim();
  if (requestedPath) {
    const path = normalizePagePath(requestedPath);
    const exists = await client
      .db()
      .collection<{ path: string }>("pages")
      .findOne({ path }, { projection: { _id: 1 } });
    if (!exists) return Response.json({ error: "Page not found." }, { status: 404 });
    revalidatePath(path);
    revalidateTag(pageCacheTag(path), "max");
    revalidateTag("site-pages", "max");
    revalidateTag("public-page-search", { expire: 0 });
    refreshPublicCatalog();
    return Response.json({ count: 1, path });
  }
  const items = await client
    .db()
    .collection<{ path: string }>("pages")
    .find({}, { projection: { path: 1 } })
    .toArray();
  items.forEach((item) => {
    revalidatePath(item.path);
    revalidateTag(pageCacheTag(item.path), "max");
  });
  revalidatePath("/", "page");
  revalidateTag("site-pages", "max");
  revalidateTag("public-page-search", { expire: 0 });
  refreshPublicCatalog();
  return Response.json({ count: items.length });
}
