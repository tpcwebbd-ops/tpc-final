/*
|-----------------------------------------
| setting up catalog.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

export const categoryStatuses = ["active", "inactive"] as const;

export type CategoryStatus = (typeof categoryStatuses)[number];

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryInput = Pick<Category, "name" | "slug" | "description" | "status">;

export const categoryDefaults: CategoryInput = { description: "", name: "", slug: "", status: "active" };

export type PresetCategory = CategoryInput;

export const defaultImportCategories: PresetCategory[] = [
  {
    name: "General",
    slug: "general",
    description: "General information and updates.",
    status: "active",
  },
  {
    name: "Announcements",
    slug: "announcements",
    description: "News and announcements for your audience.",
    status: "active",
  },
  {
    name: "Guides",
    slug: "guides",
    description: "Helpful guides and reference material.",
    status: "active",
  },
  {
    name: "Services",
    slug: "services",
    description: "Information about available services.",
    status: "active",
  },
  {
    name: "Resources",
    slug: "resources",
    description: "Useful resources and supporting material.",
    status: "active",
  },
  {
    name: "Updates",
    slug: "updates",
    description: "Recent changes and updates.",
    status: "active",
  },
];

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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
