/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { randomUUID } from "crypto";

import { client } from "@/app/api/lib/auth";
import { authorizeProductRequest } from "@/app/api/lib/catalog-authorization";
import {
  type Product,
  type ProductInput,
  type ProductStatus,
  parseProductInput,
  productStatuses,
} from "@/lib/dashboard/catalog";
import { invalidatePublicProductCatalogCache } from "@/lib/products/server";
import {
  duplicateProductError,
  ensureProductIndexes,
  serializeProduct,
  validateProductCategories,
} from "@/lib/services/products";

const products = () => client.db().collection<Product>("products");

function integer(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}

function searchPattern(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const access = await authorizeProductRequest(request, "GET");
  if ("error" in access) return access.error;
  const query = new URL(request.url).searchParams;
  const limit = integer(query.get("limit"), 10, 1, 100);
  const status = query.get("status");
  const category = query.get("category")?.trim();
  const search = query.get("search")?.trim();
  const filter: Record<string, unknown> = {};
  if (productStatuses.includes(status as ProductStatus)) filter.status = status;
  if (category) filter.categories = category;
  if (search) {
    const expression = new RegExp(searchPattern(search), "i");
    filter.$or = [{ name: expression }, { slug: expression }, { sku: expression }];
  }
  const total = await products().countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const requestedPage = integer(query.get("page"), 1, 1, 10_000);
  const page = Math.min(requestedPage, totalPages);
  const [items, summaryRows] = await Promise.all([
    products()
      .find(filter)
      .sort({ updatedAt: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    products()
      .aggregate<{ averagePrice: number; inStock: number; totalStock: number }>([
        { $match: filter },
        {
          $group: {
            _id: null,
            averagePrice: {
              $avg: {
                $cond: [{ $gt: ["$discountPrice", 0] }, "$discountPrice", "$realPrice"],
              },
            },
            inStock: { $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] } },
            totalStock: { $sum: "$stock" },
          },
        },
      ])
      .toArray(),
  ]);
  const summary = summaryRows[0] ?? { averagePrice: 0, inStock: 0, totalStock: 0 };
  return Response.json({
    items: items.map(serializeProduct),
    page,
    limit,
    total,
    totalPages,
    summary: {
      averagePrice: Math.round(summary.averagePrice || 0),
      inStock: summary.inStock,
      totalStock: summary.totalStock,
    },
  });
}

export async function POST(request: Request) {
  const access = await authorizeProductRequest(request, "POST");
  if ("error" in access) return access.error;
  const data = parseProductInput(await request.json().catch(() => null));
  if (!data)
    return Response.json({ error: "Enter valid product details, images, prices, stock, and status." }, { status: 400 });
  if (!(await validateProductCategories(data.categories)))
    return Response.json({ error: "Select only existing categories." }, { status: 400 });
  const now = new Date();
  const item: Product = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  try {
    await ensureProductIndexes();
    await products().insertOne(item);
  } catch (error) {
    const message = duplicateProductError(error);
    if (message) return Response.json({ error: message }, { status: 409 });
    throw error;
  }
  invalidatePublicProductCatalogCache();
  return Response.json({ item: serializeProduct(item) }, { status: 201 });
}

export type { ProductInput };
