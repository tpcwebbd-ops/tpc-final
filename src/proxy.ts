/*
|-----------------------------------------
| setting up proxy.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { NextResponse, type NextRequest } from "next/server";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import {
  authorizeDashboardRequest,
  isKnownDashboardApiResource,
  isPublicDashboardRead,
} from "@/app/api/lib/dashboard-authorization";
import { validateCookieApiWrite } from "@/app/api/lib/request-security";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboardApi = pathname.startsWith("/api/dashboard/");
  const isOrdersApi = pathname === "/api/orders/v1";
  const isDashboardRequest = pathname.startsWith("/dashboard/") || pathname === "/dashboard" || isDashboardApi;
  if (isDashboardApi && !isKnownDashboardApiResource(pathname))
    return Response.json({ error: "Unknown dashboard API resource." }, { status: 403 });
  if (isDashboardApi && isPublicDashboardRead(pathname, request.method)) return NextResponse.next();

  if (isDashboardRequest) {
    const limited = await rateLimitDistributed(request, "dashboard-authorization", 120, 60_000);
    if (limited) return limited;
  }

  // Apply the same origin and JSON checks before dashboard and customer-order
  // API handlers can perform cookie-authenticated writes. Auth callbacks and
  // provider webhooks remain outside this matcher.
  if (isDashboardApi || isOrdersApi) {
    const rejected = validateCookieApiWrite(request);
    if (rejected) return rejected;
  }

  // Every protected dashboard API handler performs its own session and
  // permission check. Keep the proxy's shared rate limit and CSRF gate here,
  // without repeating those database-backed checks for the same operation.
  if (isDashboardApi || isOrdersApi) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.redirect(new URL("/login", getCanonicalAppUrl()));
  }

  const authorization = await authorizeDashboardRequest(session, pathname, request.method);
  if (isDashboardApi) {
    if (!authorization.allowed)
      return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
    return NextResponse.next();
  }

  const headers = new Headers(request.headers);
  headers.delete("x-dashboard-authorization");
  headers.delete("x-dashboard-authorization-message");
  headers.set("x-dashboard-authorization", authorization.allowed ? "allowed" : "denied");
  headers.set("x-dashboard-authorization-message", encodeURIComponent(authorization.state.message ?? "Unauthorized."));
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/dashboard/:path*", "/api/dashboard/:path*", "/api/orders/v1"] };
