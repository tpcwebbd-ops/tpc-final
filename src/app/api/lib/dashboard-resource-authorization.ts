/*
|-----------------------------------------
| setting up dashboard-resource-authorization.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";

type Method = "GET" | "POST" | "PATCH" | "DELETE";
async function authorizeDashboardResourceRequest(
  request: Request,
  method: Method,
  resource: "categories" | "coupons",
) {
  const limited = await rateLimitDistributed(request, `dashboard-${resource}-api`, 60, 60_000);
  if (limited) return { error: limited };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, `/api/dashboard/${resource}/v1`, method);
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}

export const authorizeCategoryRequest = (request: Request, method: Method) =>
  authorizeDashboardResourceRequest(request, method, "categories");
export const authorizeCouponRequest = (request: Request, method: Method) =>
  authorizeDashboardResourceRequest(request, method, "coupons");
