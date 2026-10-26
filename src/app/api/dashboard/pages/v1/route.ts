/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { randomUUID } from "crypto";

import { ObjectId } from "mongodb";
import { revalidatePath, revalidateTag } from "next/cache";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth, client } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { pageCacheTag } from "@/lib/pages/server";
import { removeSeoSettingsForDeletedPage } from "@/lib/services/seo-settings";

export type PageBlock = {
  id: string;
  type: "form" | "section" | "all-page" | "rich-text" | "container";
  variant:
    | "container-1"
    | "container-2"
    | "form-1"
    | "form-2"
    | "form-3"
    | "section-1"
    | "section-2"
    | "section-3"
    | "section-4"
    | "section-5"
    | "section-6"
    | "section-7"
    | "section-8"
    | "section-9"
    | "section-10"
    | "section-11"
    | "section-12"
    | "section-13"
    | "section-14"
    | "section-15"
    | "section-16"
    | "section-17"
    | "section-18"
    | "section-19"
    | "section-20"
    | "section-21"
    | "section-22"
    | "section-23"
    | "section-24"
    | "section-25"
    | "section-26"
    | "section-27"
    | "section-28"
    | "section-29"
    | "section-30"
    | "section-31"
    | "section-32"
    | "section-33"
    | "section-34"
    | "section-35"
    | "section-36"
    | "section-37"
    | "section-38"
    | "section-39"
    | "section-40"
    | "section-41"
    | "section-42"
    | "section-43"
    | "section-44"
    | "section-45"
    | "section-46"
    | "section-47"
    | "section-48"
    | "all-home"
    | "company-story"
    | "whatsapp-faq"
    | "security"
    | "site-terms-and-conditions"
    | "delivery-policy"
    | "cookie-policy"
    | "leadership-team"
    | "country-directory"
    | "about-the-country"
    | "details-page"
    | "visa-requirements"
    | "visa-services"
    | "visa-application-support"
    | "visa-consultancy"
    | "visa-service-catalogue"
    | "visa-insights"
    | "all-about-us"
    | "all-contact-us"
    | "all-frequently-ask-questions"
    | "all-privacy"
    | "all-refund"
    | "all-team-member"
    | "all-terms"
    | "rich-text";
  title?: string;
  data: Record<string, unknown>;
};
export type SitePage = {
  _id?: ObjectId;
  id: string;
  title: string;
  path: string;
  description: string;
  published: boolean;
  blocks: PageBlock[];
  createdAt: Date;
  updatedAt: Date;
};
const pages = () => client.db().collection<SitePage>("pages");
const reservedPublicPaths = new Set(["/search", "/search/result"]);
const normalizePath = (value: string) => {
  const path = `/${value.trim().replace(/^\/+|\/+$/g, "")}`.replace(/\/+/g, "/");
  return path === "/" ? "/" : path.toLowerCase();
};
const isReservedPublicPath = (path: string) => reservedPublicPaths.has(path);
async function permitted(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-pages-api", 60, 60_000);
  if (limited) return { limited, session: null };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { limited: null, session: null, authorization: null };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/pages/v1", request.method);
  return { limited: null, session, authorization };
}
function refresh(path: string) {
  revalidatePath(path);
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidateTag(pageCacheTag(path), "max");
  revalidateTag("site-pages", "max");
  revalidateTag("public-page-search", { expire: 0 });
}

const pageBlockTypes = new Set<PageBlock["type"]>(["form", "section", "all-page", "rich-text", "container"]);
const pageBlockVariants = new Set<PageBlock["variant"]>([
  "container-1",
  "container-2",
  "form-1",
  "form-2",
  "form-3",
  ...(Array.from({ length: 48 }, (_, index) => `section-${index + 1}`) as PageBlock["variant"][]),
  "all-home",
  "company-story",
  "whatsapp-faq",
  "security",
  "site-terms-and-conditions",
  "delivery-policy",
  "cookie-policy",
  "leadership-team",
  "country-directory",
  "about-the-country",
  "details-page",
  "visa-requirements",
  "visa-services",
  "visa-consultancy",
  "visa-service-catalogue",
  "visa-insights",
  "all-about-us",
  "all-contact-us",
  "all-frequently-ask-questions",
  "all-privacy",
  "all-refund",
  "all-team-member",
  "all-terms",
  "rich-text",
]);

function areValidPageBlocks(value: unknown): value is PageBlock[] {
  return (
    Array.isArray(value) &&
    value.every((block) => {
      if (!block || typeof block !== "object") return false;
      const entry = block as Partial<PageBlock>;
      return (
        typeof entry.id === "string" &&
        pageBlockTypes.has(entry.type as PageBlock["type"]) &&
        pageBlockVariants.has(entry.variant as PageBlock["variant"]) &&
        (entry.title === undefined || typeof entry.title === "string") &&
        Boolean(entry.data) &&
        typeof entry.data === "object" &&
        !Array.isArray(entry.data)
      );
    })
  );
}

export async function GET(request: Request) {
  const { limited, session, authorization } = await permitted(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!authorization?.allowed)
    return Response.json({ error: authorization?.state.message ?? "Unauthorized." }, { status: 403 });
  const items = await pages().find({}).sort({ path: 1 }).toArray();
  return Response.json({ items });
}
export async function POST(request: Request) {
  const { limited, session, authorization } = await permitted(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!authorization?.allowed)
    return Response.json({ error: authorization?.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Partial<SitePage> | null;
  const title = body?.title?.trim();
  const path = body?.path ? normalizePath(body.path) : "";
  if (!title || !path) return Response.json({ error: "Page title and path are required." }, { status: 400 });
  if (isReservedPublicPath(path))
    return Response.json({ error: "That path is reserved by site search." }, { status: 409 });
  if (await pages().findOne({ path })) return Response.json({ error: "That path already exists." }, { status: 409 });
  const now = new Date();
  const item: SitePage = {
    id: randomUUID(),
    title,
    path,
    description: body?.description?.trim() ?? "",
    published: false,
    blocks: [],
    createdAt: now,
    updatedAt: now,
  };
  await pages().insertOne(item);
  refresh(path);
  return Response.json({ item }, { status: 201 });
}
export async function PUT(request: Request) {
  const { limited, session, authorization } = await permitted(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!authorization?.allowed)
    return Response.json({ error: authorization?.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Partial<SitePage> | null;
  if (!body?.id) return Response.json({ error: "Page id is required." }, { status: 400 });
  if (body.blocks !== undefined && !areValidPageBlocks(body.blocks))
    return Response.json(
      { error: "Page blocks must use a supported type, variant, and data object." },
      { status: 400 },
    );
  const old = await pages().findOne({ id: body.id });
  if (!old) return Response.json({ error: "Page not found." }, { status: 404 });
  const path = body.path ? normalizePath(body.path) : old.path;
  if (isReservedPublicPath(path))
    return Response.json({ error: "That path is reserved by site search." }, { status: 409 });
  const duplicate = await pages().findOne({ path, id: { $ne: body.id } });
  if (duplicate) return Response.json({ error: "That path already exists." }, { status: 409 });
  const item = {
    ...old,
    title: body.title?.trim() || old.title,
    path,
    description: body.description?.trim() ?? old.description,
    published: typeof body.published === "boolean" ? body.published : old.published,
    blocks: Array.isArray(body.blocks) ? body.blocks : old.blocks,
    updatedAt: new Date(),
  };
  await pages().updateOne({ id: body.id }, { $set: item });
  refresh(old.path);
  refresh(path);
  return Response.json({ item });
}
export async function DELETE(request: Request) {
  const { limited, session, authorization } = await permitted(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!authorization?.allowed)
    return Response.json({ error: authorization?.state.message ?? "Unauthorized." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Page id is required." }, { status: 400 });
  const old = await pages().findOneAndDelete({ id });
  if (!old) return Response.json({ error: "Page not found." }, { status: 404 });
  await removeSeoSettingsForDeletedPage(old.id, old.path);
  refresh(old.path);
  return Response.json({ ok: true });
}
