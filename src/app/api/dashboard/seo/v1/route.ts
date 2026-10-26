/*
|-----------------------------------------
| setting up SEO settings route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import type { SeoSettingsRecord, SeoSettingsTarget } from "@/lib/models/site-settings";
import {
  createSeoSettingsRecord,
  ensureSeoSettingsIndexes,
  findPublishedSeoPage,
  getSeoSettings,
  isDuplicateSeoSettingsError,
  listPublishedSeoPages,
  listSeoSettings,
  removeSeoSettings,
  updateSeoSettingsRecordForApi,
} from "@/lib/services/seo-settings";

type SeoFields = Pick<SeoSettingsRecord, "title" | "description" | "socialImage" | "canonicalUrl" | "focusKeyword">;
type SeoFieldChanges = Partial<SeoFields>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const allowedFields = new Set(["target", "title", "description", "socialImage", "canonicalUrl", "focusKeyword"]);

function parseTarget(value: unknown): SeoSettingsTarget | null {
  if (value === undefined) return { type: "layout" };
  if (!isRecord(value)) return null;
  if (value.type === "layout") return Object.keys(value).every((key) => key === "type") ? { type: "layout" } : null;
  if (value.type !== "page" || typeof value.pageId !== "string") return null;
  const pageId = value.pageId.trim();
  return pageId.length > 0 &&
    pageId.length <= 128 &&
    /^[\w-]+$/.test(pageId) &&
    Object.keys(value).every((key) => key === "type" || key === "pageId")
    ? { type: "page", pageId }
    : null;
}

function parseQueryTarget(url: URL): SeoSettingsTarget | null {
  const target = url.searchParams.get("target");
  if (target === null || target === "layout") return url.searchParams.has("pageId") ? null : { type: "layout" };
  if (target !== "page") return null;
  return parseTarget({ type: "page", pageId: url.searchParams.get("pageId") });
}

function parseOptionalText(value: unknown, field: string, maxLength: number): { value: string | null; error?: string } {
  if (value === undefined) return { value: null };
  if (value === null) return { value: null };
  if (typeof value !== "string") return { value: null, error: `${field} must be a string or null.` };
  const normalized = value.trim();
  if (normalized.length > maxLength)
    return { value: null, error: `${field} must be ${maxLength} characters or fewer.` };
  return { value: normalized || null };
}

function parseImage(value: unknown): { value: string | null; error?: string } {
  const parsed = parseOptionalText(value, "socialImage", 2048);
  if (parsed.error || !parsed.value) return parsed;
  const image = parsed.value;
  if (/[\u0000-\u001f\\]/.test(image)) return { value: null, error: "socialImage is invalid." };
  if (image.startsWith("/")) {
    if (image.startsWith("//") || image.includes("\\"))
      return { value: null, error: "socialImage must be a site-relative path or HTTPS URL." };
    return parsed;
  }
  try {
    const url = new URL(image);
    if (url.protocol !== "https:" || url.username || url.password)
      return { value: null, error: "socialImage must be a site-relative path or HTTPS URL." };
    return { value: url.toString() };
  } catch {
    return { value: null, error: "socialImage must be a site-relative path or HTTPS URL." };
  }
}

function parseCanonicalUrl(value: unknown): { value: string | null; error?: string } {
  const parsed = parseOptionalText(value, "canonicalUrl", 2048);
  if (parsed.error || !parsed.value) return parsed;
  try {
    const url = new URL(parsed.value);
    const canonicalOrigin = getCanonicalAppUrl();
    if (
      url.origin !== canonicalOrigin.origin ||
      url.protocol !== canonicalOrigin.protocol ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return {
        value: null,
        error: "canonicalUrl must be an absolute URL on the canonical application origin without a query or fragment.",
      };
    return { value: url.toString() };
  } catch {
    return { value: null, error: "canonicalUrl must be an absolute URL on the canonical application origin." };
  }
}

function parseFields(
  body: Record<string, unknown>,
  requireTitleAndDescription: boolean,
): { fields: SeoFieldChanges | null; error?: string } {
  if (Object.keys(body).some((key) => !allowedFields.has(key)))
    return { fields: null, error: "Unknown SEO settings field." };
  const title = parseOptionalText(body.title, "title", 200);
  const description = parseOptionalText(body.description, "description", 500);
  const socialImage = parseImage(body.socialImage);
  const canonicalUrl = parseCanonicalUrl(body.canonicalUrl);
  const focusKeyword = parseOptionalText(body.focusKeyword, "focusKeyword", 120);
  const error = title.error || description.error || socialImage.error || canonicalUrl.error || focusKeyword.error;
  if (error) return { fields: null, error };
  if (requireTitleAndDescription && (title.value === null || description.value === null))
    return { fields: null, error: "title and description are required." };
  const fields: SeoFieldChanges = {};
  if (body.title !== undefined) fields.title = title.value ?? "";
  if (body.description !== undefined) fields.description = description.value ?? "";
  if (body.socialImage !== undefined) fields.socialImage = socialImage.value;
  if (body.canonicalUrl !== undefined) fields.canonicalUrl = canonicalUrl.value;
  if (body.focusKeyword !== undefined) fields.focusKeyword = focusKeyword.value;
  if (!requireTitleAndDescription && Object.keys(fields).length === 0)
    return { fields: null, error: "At least one SEO settings field is required." };
  return { fields };
}

async function access(request: Request, method: string) {
  const limited = await rateLimitDistributed(request, "dashboard-seo-settings-api", 30, 60_000);
  if (limited) return { limited, session: null, authorization: null };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { limited: null, session: null, authorization: null };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/seo/v1", method);
  return { limited: null, session, authorization };
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

async function validatePublishedTarget(target: SeoSettingsTarget) {
  if (target.type === "layout") return null;
  return (await findPublishedSeoPage(target.pageId)) ? null : errorResponse("Published page not found.", 404);
}

export async function GET(request: Request) {
  const { limited, session, authorization } = await access(request, "GET");
  if (limited) return limited;
  if (!session) return errorResponse("Sign in required.", 401);
  if (!authorization?.allowed) return errorResponse(authorization?.state.message ?? "Unauthorized.", 403);
  const url = new URL(request.url);
  const list = url.searchParams.get("list");
  const pages = url.searchParams.get("pages");
  if (list !== null || pages !== null) {
    if (url.searchParams.size !== 1 || (list !== "true" && pages !== "true") || (list && pages))
      return errorResponse("Invalid SEO settings list query.", 400);
    if (list === "true")
      return Response.json({ items: await listSeoSettings() }, { headers: { "Cache-Control": "private, no-store" } });
    const canonicalOrigin = getCanonicalAppUrl();
    const items = (await listPublishedSeoPages()).map((page) => ({
      ...page,
      canonicalUrl: new URL(page.path, canonicalOrigin).toString(),
    }));
    return Response.json({ items }, { headers: { "Cache-Control": "private, no-store" } });
  }
  const target = parseQueryTarget(url);
  if (!target) return errorResponse("Invalid SEO settings target.", 400);
  const unavailable = await validatePublishedTarget(target);
  if (unavailable) return unavailable;
  await ensureSeoSettingsIndexes();
  const setting = await getSeoSettings(target);
  return Response.json({ target, setting }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const { limited, session, authorization } = await access(request, "POST");
  if (limited) return limited;
  if (!session) return errorResponse("Sign in required.", 401);
  if (!authorization?.allowed) return errorResponse(authorization?.state.message ?? "Unauthorized.", 403);
  const body = await request.json().catch(() => null);
  if (!isRecord(body)) return errorResponse("A JSON object is required.", 400);
  const target = parseTarget(body.target);
  if (!target) return errorResponse("Invalid SEO settings target.", 400);
  const parsed = parseFields(body, true);
  if (!parsed.fields) return errorResponse(parsed.error ?? "Invalid SEO settings.", 400);
  const unavailable = await validatePublishedTarget(target);
  if (unavailable) return unavailable;
  const now = new Date();
  const item: SeoSettingsRecord = {
    targetKey: target.type === "layout" ? "layout" : `page:${target.pageId}`,
    target,
    title: parsed.fields.title ?? "",
    description: parsed.fields.description ?? "",
    socialImage: parsed.fields.socialImage ?? null,
    canonicalUrl: parsed.fields.canonicalUrl ?? null,
    focusKeyword: parsed.fields.focusKeyword ?? null,
    createdAt: now,
    updatedAt: now,
  };
  await ensureSeoSettingsIndexes();
  try {
    const setting = await createSeoSettingsRecord(item);
    if (!setting) return errorResponse("Published page not found.", 404);
    return Response.json({ setting }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (isDuplicateSeoSettingsError(error)) return errorResponse("SEO settings already exist for this target.", 409);
    throw error;
  }
}

export async function PUT(request: Request) {
  const { limited, session, authorization } = await access(request, "PUT");
  if (limited) return limited;
  if (!session) return errorResponse("Sign in required.", 401);
  if (!authorization?.allowed) return errorResponse(authorization?.state.message ?? "Unauthorized.", 403);
  const body = await request.json().catch(() => null);
  if (!isRecord(body)) return errorResponse("A JSON object is required.", 400);
  const target = parseTarget(body.target);
  if (!target) return errorResponse("Invalid SEO settings target.", 400);
  const parsed = parseFields(body, false);
  if (!parsed.fields) return errorResponse(parsed.error ?? "Invalid SEO settings.", 400);
  const unavailable = await validatePublishedTarget(target);
  if (unavailable) return unavailable;
  const setting = await updateSeoSettingsRecordForApi(target, parsed.fields);
  if (!setting) return errorResponse("SEO settings not found.", 404);
  return Response.json({ setting }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function DELETE(request: Request) {
  const { limited, session, authorization } = await access(request, "DELETE");
  if (limited) return limited;
  if (!session) return errorResponse("Sign in required.", 401);
  if (!authorization?.allowed) return errorResponse(authorization?.state.message ?? "Unauthorized.", 403);
  const target = parseQueryTarget(new URL(request.url));
  if (!target) return errorResponse("Invalid SEO settings target.", 400);
  await removeSeoSettings(target);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}
