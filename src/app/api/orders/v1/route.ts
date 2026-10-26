/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { parseCheckoutInput, parseOrderConfirmationInput, serializeOrder } from "@/lib/dashboard/orders";
import { orders } from "@/lib/orders/management";
import {
  confirmIncompleteOrder,
  confirmGuestIncompleteOrder,
  createGuestOrder,
  createOrder,
  hashGuestOrderAccessToken,
  quoteGuestIncompleteOrder,
  quoteIncompleteOrder,
} from "@/lib/orders/server";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!/^[A-Z]{2}-\d{4}$/.test(id)) return Response.json({ error: "Invalid order ID." }, { status: 400 });
  const session = await auth.api.getSession({ headers: request.headers });
  const order = session ? await orders().findOne({ id, "customer.userId": session.user.id }) : null;
  const trackingToken = request.headers.get("x-order-access-token")?.trim() ?? "";
  const guestOrder =
    !order && /^[A-Za-z0-9_-]{40,60}$/.test(trackingToken)
      ? await orders().findOne({ id, guestAccessTokenHash: hashGuestOrderAccessToken(trackingToken) })
      : null;
  if (!order && !guestOrder) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json(
    { order: serializeOrder(order ?? guestOrder!) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "order-checkout", 12, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  const body = await request.json().catch(() => null);
  const parsed = parseCheckoutInput(body);
  if ("code" in parsed) return Response.json({ ok: false, ...parsed }, { status: 400 });
  const createIncomplete = Boolean(
    body && typeof body === "object" && (body as { intent?: unknown }).intent === "incomplete",
  );
  const result = session
    ? await createOrder(session.user, parsed, "incomplete")
    : await createGuestOrder(parsed, createIncomplete ? "incomplete" : "placed");
  return result.ok
    ? Response.json(
        {
          ok: true,
          order: serializeOrder(result.order),
          ...("trackingToken" in result ? { trackingToken: result.trackingToken } : {}),
        },
        { status: 201 },
      )
    : Response.json(
        { ok: false, code: result.code, error: result.error, cooldownExpiresAt: result.cooldownExpiresAt },
        { status: result.status },
      );
}

export async function PATCH(request: Request) {
  const limited = await rateLimitDistributed(request, "order-checkout", 12, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  const parsed = parseOrderConfirmationInput(await request.json().catch(() => null));
  if ("code" in parsed) return Response.json({ ok: false, ...parsed }, { status: 400 });
  const trackingToken = request.headers.get("x-order-access-token")?.trim() ?? "";
  const hasTrackingToken = /^[A-Za-z0-9_-]{40,60}$/.test(trackingToken);
  const result = hasTrackingToken
    ? await confirmGuestIncompleteOrder(parsed, trackingToken)
    : session
      ? await confirmIncompleteOrder(session.user, parsed)
      : { ok: false as const, status: 401, code: "AUTH_REQUIRED" as const, error: "Sign in required." };
  return result.ok
    ? Response.json({ ok: true, order: serializeOrder(result.order) })
    : Response.json(
        { ok: false, code: result.code, error: result.error, cooldownExpiresAt: result.cooldownExpiresAt },
        { status: result.status },
      );
}

export async function PUT(request: Request) {
  const limited = await rateLimitDistributed(request, "order-quote", 24, 60_000);
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  const body = (await request.json().catch(() => null)) as { id?: unknown; couponCode?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  const couponCode = typeof body?.couponCode === "string" ? body.couponCode.trim() : "";
  if (!/^[A-Z]{2}-\d{4}$/.test(id) || couponCode.length > 60)
    return Response.json({ ok: false, error: "Invalid order or coupon details." }, { status: 400 });
  const trackingToken = request.headers.get("x-order-access-token")?.trim() ?? "";
  const hasTrackingToken = /^[A-Za-z0-9_-]{40,60}$/.test(trackingToken);
  const result = hasTrackingToken
    ? await quoteGuestIncompleteOrder({ id, couponCode }, trackingToken)
    : session
      ? await quoteIncompleteOrder(session.user, { id, couponCode })
      : { ok: false as const, status: 401, code: "AUTH_REQUIRED" as const, error: "Sign in required." };
  return result.ok
    ? Response.json({ ok: true, quote: result.quote })
    : Response.json({ ok: false, code: result.code, error: result.error }, { status: result.status });
}
