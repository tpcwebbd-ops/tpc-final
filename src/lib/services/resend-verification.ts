/*
|-----------------------------------------
| setting up resend-verification service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { createEmailVerificationToken } from "better-auth/api";
import nodemailer from "nodemailer";

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import {
  claimVerificationEmail,
  clearVerificationClaim,
  findVerificationCooldown,
  findVerificationUser,
} from "@/lib/models/auth";

export const resendVerificationCooldownMs = 5 * 60 * 1000;
const verificationTokenLifetimeSeconds = 60 * 60;

export type ResendVerificationResult =
  | { kind: "sent" }
  | { kind: "not-found" }
  | { kind: "already-verified" }
  | { kind: "cooldown"; lastSentAt: Date }
  | { kind: "unconfigured" }
  | { kind: "claim-failed" }
  | { kind: "delivery-failed" };

function emailHtml(url: string) {
  const htmlUrl = url.replace(/&/g, "&amp;");
  return `<div style="margin:0;background:#f5f7fb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#172033;"><div style="margin:0 auto;max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.06);"><div style="background:#172033;padding:28px 32px;"><div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-.02em;">Email verification</div></div><div style="padding:32px;"><h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:#172033;">Confirm your email address</h1><p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#526071;">Thanks for creating an account. Please verify your email address to continue.</p><p style="margin:0 0 24px;text-align:center;"><a href="${htmlUrl}" style="display:inline-block;background:#2563eb;border-radius:8px;color:#ffffff;font-size:16px;font-weight:700;padding:13px 22px;text-decoration:none;">Verify email address</a></p><p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#526071;"><strong>This link expires in 1 hour.</strong> For your security, please do not share it with anyone.</p><p style="margin:0;font-size:14px;line-height:1.6;color:#7a8698;">If the button does not work, copy and paste this link into your browser:</p><p style="margin:8px 0 0;word-break:break-all;font-size:13px;line-height:1.5;"><a href="${htmlUrl}" style="color:#2563eb;">${htmlUrl}</a></p><p style="margin:28px 0 0;border-top:1px solid #eef0f3;padding-top:20px;font-size:13px;line-height:1.5;color:#7a8698;">If you did not create an account, you can safely ignore this email.</p></div></div></div>`;
}

export async function resendVerificationEmail(email: string): Promise<ResendVerificationResult> {
  const user = await findVerificationUser(email);
  if (!user) return { kind: "not-found" };
  if (user.emailVerified) return { kind: "already-verified" };
  if (
    user.emailVerificationLastSentAt &&
    Date.now() - user.emailVerificationLastSentAt.getTime() < resendVerificationCooldownMs
  )
    return { kind: "cooldown", lastSentAt: user.emailVerificationLastSentAt };
  const gmailUser = process.env.GMAIL_USER,
    gmailAppPassword = process.env.GMAIL_APP_PASSWORD,
    secret = process.env.BETTER_AUTH_SECRET;
  if (!gmailUser || !gmailAppPassword || !secret) return { kind: "unconfigured" };
  const sentAt = new Date();
  if (!(await claimVerificationEmail(email, sentAt, resendVerificationCooldownMs)).matchedCount) {
    const latest = await findVerificationCooldown(email);
    return latest?.emailVerificationLastSentAt
      ? { kind: "cooldown", lastSentAt: latest.emailVerificationLastSentAt }
      : { kind: "claim-failed" };
  }
  try {
    const token = await createEmailVerificationToken(secret, email, undefined, verificationTokenLifetimeSeconds);
    const verificationUrl = new URL("/api/auth/v1/verify-email", getCanonicalAppUrl());
    verificationUrl.searchParams.set("token", token);
    verificationUrl.searchParams.set("callbackURL", "/login");
    const url = verificationUrl.toString();
    await nodemailer.createTransport({ service: "gmail", auth: { user: gmailUser, pass: gmailAppPassword } }).sendMail({
      from: `<${gmailUser}>`,
      to: email,
      subject: "Verify your email address",
      text: `Verify your email address by opening this link within 1 hour:\n\n${url}\n\nIf you did not create an account, you can ignore this email.`,
      html: emailHtml(url),
    });
    return { kind: "sent" };
  } catch {
    await clearVerificationClaim(email, sentAt);
    return { kind: "delivery-failed" };
  }
}
