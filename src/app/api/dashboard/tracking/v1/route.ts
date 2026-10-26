/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { addTracking, listTracking, type TrackingItem, type TrackingProvider } from "@/lib/services/tracking";

const trackingProviders = ["facebook", "gtm", "ga4", "tiktok"] as const;
export type { TrackingItem, TrackingProvider };
async function access(request: Request, method: "GET" | "POST") {
  const limited = await rateLimitDistributed(request, "dashboard-tracking-api", 30, 60_000);
  if (limited) return { error: limited };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const allowed = await authorizeDashboardRequest(session, "/dashboard/admin/tracking", method);
  return allowed.allowed
    ? {}
    : { error: Response.json({ error: allowed.state.message ?? "Unauthorized." }, { status: 403 }) };
}
function payload(body: unknown) {
  const data = body as Partial<TrackingItem> | null;
  const provider = data?.provider;
  const pixelId = data?.pixelId?.trim() ?? "";
  if (
    !trackingProviders.includes(provider as TrackingProvider) ||
    !pixelId ||
    pixelId.length > 150 ||
    !/^[A-Za-z0-9_\-GTM]+$/.test(pixelId)
  )
    return null;
  return { provider: provider as TrackingProvider, pixelId, enabled: Boolean(data?.enabled) };
}
export async function GET(request: Request) {
  const result = await access(request, "GET");
  if ("error" in result) return result.error;
  return Response.json({ items: await listTracking() });
}
export async function POST(request: Request) {
  const result = await access(request, "POST");
  if ("error" in result) return result.error;
  const data = payload(await request.json().catch(() => null));
  if (!data) return Response.json({ error: "Enter a valid tracking ID." }, { status: 400 });
  const created = await addTracking(data);
  if (created.kind === "duplicate")
    return Response.json({ error: "This provider already has a tracking ID." }, { status: 409 });
  return Response.json({ item: created.item }, { status: 201 });
}
