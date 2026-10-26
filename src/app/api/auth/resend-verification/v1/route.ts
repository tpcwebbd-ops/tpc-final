/*
|-----------------------------------------
| setting up route.ts for the App
|-----------------------------------------
*/

import { after } from "next/server";

import { rateLimitDistributed, rateLimitDistributedIdentity } from "@/app/api/lib/api-rate-limit";
import { resendVerificationCooldownMs, resendVerificationEmail } from "@/lib/services/resend-verification";

function genericResponse() {
  return Response.json(
    {
      success: true,
      message: "If this address can receive verification, an email will arrive shortly.",
      retryAfter: Math.ceil(resendVerificationCooldownMs / 1000),
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "resend-verification", 5, 60_000);
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });

  const emailLimited = await rateLimitDistributedIdentity(
    "resend-verification-email",
    email,
    5,
    resendVerificationCooldownMs,
  );
  if (emailLimited) return genericResponse();

  after(async () => {
    try {
      await resendVerificationEmail(email);
    } catch {
      console.error("Verification email request could not be processed.");
    }
  });

  return genericResponse();
}
