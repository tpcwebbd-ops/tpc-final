/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";

export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "password-reset", 5, 15 * 60_000);
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: new URL("/forgot-password/reset", getCanonicalAppUrl()).toString() },
      headers: request.headers,
    });
    // Do not disclose whether an account exists. It prevents email enumeration.
    return Response.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch {
    return Response.json({ error: "We could not send the reset link. Please try again." }, { status: 500 });
  }
}
