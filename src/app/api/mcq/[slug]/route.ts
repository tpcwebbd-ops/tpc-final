/*
|-----------------------------------------
| setting up private guest sessions for public MCQ examinations
|-----------------------------------------
*/

import { createHash, randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { mcqError, mcqJson } from "@/app/api/lib/mcq-exam-access";
import { validateCookieApiWrite } from "@/app/api/lib/request-security";
import { answerMcqQuestion, publicMcqExam, startMcqExam } from "@/lib/services/mcq-exams";

type Context = { params: Promise<{ slug: string }> };
const cookieName = (slug: string) => `mcq_${slug}`;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const validSlug = (slug: string) => /^[a-f0-9]{32}$/.test(slug);
const validToken = (token?: string) => Boolean(token && /^[a-f0-9]{64}$/.test(token));

export async function GET(request: NextRequest, context: Context) {
  try {
    const { slug } = await context.params;
    if (!validSlug(slug)) return mcqJson({ error: "This examination link was not found." }, 404);
    const limited = await rateLimitDistributed(request, "public-mcq-read", 120, 60_000);
    if (limited) return limited;
    const existing = request.cookies.get(cookieName(slug))?.value;
    const token = validToken(existing) ? existing! : randomBytes(32).toString("hex");
    const data = await publicMcqExam(slug, hash(token));
    const response = NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
    response.cookies.set(cookieName(slug), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/api/mcq/${slug}`,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    return mcqError(error);
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const rejected = validateCookieApiWrite(request);
    if (rejected) return rejected;
    const { slug } = await context.params;
    if (!validSlug(slug)) return mcqJson({ error: "This examination link was not found." }, 404);
    const limited = await rateLimitDistributed(request, "public-mcq-write", 180, 60_000);
    if (limited) return limited;
    const token = request.cookies.get(cookieName(slug))?.value;
    if (!validToken(token)) return mcqJson({ error: "Your examination session has expired. Reload the page." }, 401);
    const body = await request.json().catch(() => null);
    if (body?.action === "start") return mcqJson(await startMcqExam(slug, hash(token!), body));
    if (body?.action === "answer") return mcqJson(await answerMcqQuestion(slug, hash(token!), body));
    return mcqJson({ error: "Invalid examination action." }, 400);
  } catch (error) {
    return mcqError(error);
  }
}
