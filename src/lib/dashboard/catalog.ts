/*
|-----------------------------------------
| setting up catalog.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

export const categoryStatuses = ["active", "inactive"] as const;
export const productStatuses = ["draft", "active", "out_of_stock", "archived"] as const;

export type CategoryStatus = (typeof categoryStatuses)[number];
export type ProductStatus = (typeof productStatuses)[number];

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  realPrice: number;
  discountPrice: number;
  discount: number;
  /** Percentage tax applied to this product's discounted unit price at checkout. */
  taxRate?: number;
  /** Delivery charge in BDT applied once per purchased unit at checkout. */
  shippingCost?: number;
  star: number;
  primaryImage: string;
  images: string[];
  video: string;
  mainFeatures: string[];
  deliveryTime: string;
  warranty: string;
  stock: number;
  sku: string;
  categories: string[];
  brand: string;
  status: ProductStatus;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicContainerProduct = Pick<
  Product,
  "id" | "name" | "slug" | "realPrice" | "discountPrice" | "star" | "primaryImage" | "sku" | "status"
>;

export type CategoryInput = Pick<Category, "name" | "slug" | "description" | "status">;
export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const categoryDefaults: CategoryInput = { description: "", name: "", slug: "", status: "active" };

export type PresetCategory = CategoryInput & {
  type: "Gadget";
};

export const defaultImportCategories: PresetCategory[] = [
  {
    name: "Smartphones & Tablets",
    slug: "smartphones-tablets",
    description: "Android phones, iPhones, tablets, e-readers, and their essential accessories.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Laptops & Computers",
    slug: "laptops-computers",
    description: "Laptops, desktop computers, monitors, and performance computing gear.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Audio & Headphones",
    slug: "audio-headphones",
    description: "Headphones, earbuds, Bluetooth speakers, microphones, and portable audio.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Wearables & Smartwatches",
    slug: "wearables-smartwatches",
    description: "Smartwatches, fitness trackers, smart rings, and connected health devices.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Cameras & Drones",
    slug: "cameras-drones",
    description: "Cameras, action cameras, drones, lenses, and creator equipment.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Gaming Gear",
    slug: "gaming-gear",
    description: "Gaming consoles, controllers, keyboards, mice, and immersive accessories.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    description: "Smart lighting, security cameras, speakers, plugs, and connected home devices.",
    status: "active",
    type: "Gadget",
  },
  {
    name: "Chargers & Accessories",
    slug: "chargers-accessories",
    description: "Power banks, chargers, cables, hubs, stands, and everyday device accessories.",
    status: "active",
    type: "Gadget",
  },
];
export const emptyRichText = JSON.stringify({
  root: {
    children: [{ children: [], direction: null, format: "", indent: 0, type: "paragraph", version: 1 }],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

/** Produces a fresh, valid product draft each time the Add Product modal opens. */
export function createProductDefaults({
  categoryId,
  imageUrl,
  now = Date.now(),
}: {
  categoryId: string;
  imageUrl: string;
  now?: number;
}): ProductInput {
  const suffix = now.toString(36).toUpperCase();
  return {
    brand: "NexaMart",
    categories: [categoryId],
    deliveryTime: "3–5 business days",
    description: emptyRichText,
    discount: 15,
    discountPrice: 850,
    taxRate: 0,
    shippingCost: 0,
    images: [imageUrl],
    isFeatured: false,
    mainFeatures: ["Quality checked", "Ready to ship"],
    name: `New Product ${suffix}`,
    primaryImage: imageUrl,
    realPrice: 1000,
    shortDescription: "A ready-to-customize product summary.",
    sku: `SKU-${suffix}`,
    slug: `new-product-${now.toString(36)}`,
    star: 4.5,
    status: "draft",
    stock: 10,
    video: "",
    warranty: "No warranty information provided.",
  };
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const skuPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const httpUrl = /^https?:\/\/\S+$/i;
const youtubeUrl =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}(?:[?&/#].*)?$/i;

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function stringValue(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim().length <= maximum ? value.trim() : null;
}

export function parseCategoryInput(body: unknown): CategoryInput | null {
  const data = body as Partial<CategoryInput> | null;
  const name = stringValue(data?.name, 120),
    description = stringValue(data?.description, 2_000),
    slug = typeof data?.slug === "string" ? normalizeSlug(data.slug) : "",
    status = data?.status as CategoryStatus;
  return name && description !== null && slugPattern.test(slug) && categoryStatuses.includes(status)
    ? { name, description, slug, status }
    : null;
}

export function parseProductInput(body: unknown): ProductInput | null {
  const data = body as Partial<ProductInput> | null;
  const name = stringValue(data?.name, 160),
    description = stringValue(data?.description, 100_000),
    shortDescription = stringValue(data?.shortDescription, 500),
    sku = stringValue(data?.sku, 80),
    brand = stringValue(data?.brand, 120),
    deliveryTime = stringValue(data?.deliveryTime, 120),
    warranty = stringValue(data?.warranty, 500),
    video = stringValue(data?.video, 2_000);
  const slug = typeof data?.slug === "string" ? normalizeSlug(data.slug) : "";
  const categories = Array.isArray(data?.categories)
    ? [
        ...new Set(
          data.categories
            .filter((id): id is string => typeof id === "string" && Boolean(id.trim()))
            .map((id) => id.trim()),
        ),
      ]
    : [];
  const images = Array.isArray(data?.images)
    ? [
        ...new Set(
          data.images
            .filter((url): url is string => typeof url === "string" && httpUrl.test(url.trim()))
            .map((url) => url.trim()),
        ),
      ]
    : [];
  const mainFeatures = Array.isArray(data?.mainFeatures)
    ? [
        ...new Set(
          data.mainFeatures
            .filter((feature): feature is string => typeof feature === "string" && Boolean(feature.trim()))
            .map((feature) => feature.trim()),
        ),
      ]
    : [];
  const primaryImage = stringValue(data?.primaryImage, 2_000) ?? "";
  const realPrice = data?.realPrice,
    discountPrice = data?.discountPrice,
    discount = data?.discount,
    taxRate = data?.taxRate === undefined ? 0 : data.taxRate,
    shippingCost = data?.shippingCost === undefined ? 0 : data.shippingCost;
  if (
    typeof realPrice !== "number" ||
    typeof discountPrice !== "number" ||
    typeof discount !== "number" ||
    typeof taxRate !== "number" ||
    typeof shippingCost !== "number"
  )
    return null;
  const expectedDiscount = realPrice > 0 ? ((realPrice - discountPrice) / realPrice) * 100 : 0;
  if (
    !name ||
    !description ||
    !shortDescription ||
    !sku ||
    !brand ||
    !deliveryTime ||
    !warranty ||
    video === null ||
    !slugPattern.test(slug) ||
    !skuPattern.test(sku) ||
    !categories.length ||
    categories.length > 30 ||
    !images.length ||
    images.length > 12 ||
    !httpUrl.test(primaryImage) ||
    !images.includes(primaryImage) ||
    !mainFeatures.length ||
    mainFeatures.length > 20 ||
    mainFeatures.some((feature) => feature.length > 240) ||
    !Number.isFinite(realPrice) ||
    realPrice < 0 ||
    !Number.isFinite(discountPrice) ||
    discountPrice < 0 ||
    discountPrice > realPrice ||
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount > 100 ||
    Math.abs(expectedDiscount - discount) > 0.01 ||
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate > 100 ||
    !Number.isFinite(shippingCost) ||
    shippingCost < 0 ||
    typeof data?.star !== "number" ||
    !Number.isFinite(data.star) ||
    data.star < 0 ||
    data.star > 5 ||
    (video !== "" && !youtubeUrl.test(video)) ||
    typeof data?.stock !== "number" ||
    !Number.isInteger(data.stock) ||
    data.stock < 0 ||
    !productStatuses.includes(data?.status as ProductStatus) ||
    typeof data?.isFeatured !== "boolean"
  )
    return null;
  return {
    name,
    slug,
    description,
    shortDescription,
    realPrice,
    discountPrice,
    discount,
    taxRate,
    shippingCost,
    star: data.star,
    primaryImage,
    images,
    video,
    mainFeatures,
    deliveryTime,
    warranty,
    stock: data.stock,
    sku,
    categories,
    brand,
    status: data.status as ProductStatus,
    isFeatured: data.isFeatured,
  };
}

export function parseProductInventoryInput(body: unknown): Partial<Pick<ProductInput, "status" | "stock">> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const data = body as { status?: unknown; stock?: unknown };
  const hasStatus = Object.hasOwn(body, "status");
  const hasStock = Object.hasOwn(body, "stock");
  if (!hasStatus && !hasStock) return null;
  if (hasStatus && !productStatuses.includes(data.status as ProductStatus)) return null;
  if (hasStock && (typeof data.stock !== "number" || !Number.isInteger(data.stock) || data.stock < 0)) return null;
  return {
    ...(hasStatus ? { status: data.status as ProductStatus } : {}),
    ...(hasStock ? { stock: data.stock as number } : {}),
  };
}
