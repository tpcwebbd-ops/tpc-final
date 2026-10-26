/*
|-----------------------------------------
| setting up request-security.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 September 2026
|-----------------------------------------
*/

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const multipartEndpoints = new Set(["POST /api/dashboard/media/v1/imagebb"]);

function canonicalOrigin() {
  try {
    return getCanonicalAppUrl().origin;
  } catch {
    return null;
  }
}

function matchesOriginSignal(value: string, expectedOrigin: string, isOriginHeader: boolean) {
  try {
    const url = new URL(value);
    if (!new Set(["http:", "https:"]).has(url.protocol) || url.username || url.password) return false;
    if (isOriginHeader && (url.pathname !== "/" || url.search || url.hash)) return false;
    return url.origin === expectedOrigin;
  } catch {
    return false;
  }
}

function requestMediaType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
}

function hasJsonContentType(mediaType: string | undefined) {
  return mediaType === "application/json" || Boolean(mediaType && /^application\/[\w.-]+\+json$/.test(mediaType));
}

function deleteCarriesPayload(request: Request) {
  const contentLength = request.headers.get("content-length");
  return (
    request.headers.has("content-type") ||
    request.headers.has("transfer-encoding") ||
    (contentLength !== null && Number(contentLength) > 0)
  );
}

/**
 * Validate writes that may carry an authenticated browser cookie. The configured
 * app URL is authoritative behind reverse proxies; forwarded Host headers are
 * deliberately not used as an origin trust signal. Proxies must preserve the
 * browser's Origin/Referer and Sec-Fetch-Site headers.
 */
export function validateCookieApiWrite(request: Request) {
  if (!unsafeMethods.has(request.method.toUpperCase())) return null;

  const expectedOrigin = canonicalOrigin();
  if (!expectedOrigin)
    return Response.json({ error: "The canonical application origin is not configured." }, { status: 503 });

  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite && fetchSite !== "same-origin")
    return Response.json({ error: "Cross-site requests are not allowed." }, { status: 403 });

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const trustedSignal =
    origin !== null
      ? matchesOriginSignal(origin, expectedOrigin, true)
      : referer !== null && matchesOriginSignal(referer, expectedOrigin, false);
  if (!trustedSignal) return Response.json({ error: "A trusted request origin is required." }, { status: 403 });

  const bodyExpected =
    ["POST", "PUT", "PATCH"].includes(request.method.toUpperCase()) ||
    (request.method.toUpperCase() === "DELETE" && deleteCarriesPayload(request));
  const isMultipartEndpoint = multipartEndpoints.has(
    `${request.method.toUpperCase()} ${new URL(request.url).pathname}`,
  );
  const mediaType = requestMediaType(request);
  if (bodyExpected) {
    if (isMultipartEndpoint && mediaType !== "multipart/form-data")
      return Response.json({ error: "Content-Type must be multipart form data." }, { status: 415 });
    if (!isMultipartEndpoint && !hasJsonContentType(mediaType))
      return Response.json({ error: "Content-Type must be JSON." }, { status: 415 });
  }

  return null;
}
