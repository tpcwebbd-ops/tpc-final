/*
|-----------------------------------------
| setting up Shared authentication and request guards for Leads
| @author: Codex
|-----------------------------------------
*/

import { rateLimitDistributed, rateLimitDistributedIdentity } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { getLeadsActor } from "@/app/api/lib/dashboard-authorization";
import { validateCookieApiWrite } from "@/app/api/lib/request-security";
import type { LeadActor } from "@/lib/dashboard/leads";
import { LeadError, leadErrorResponse, requireActiveCouncilor } from "@/lib/services/leads";

export async function withLeads(request: Request, run: (actor: LeadActor) => Promise<Response>) {
  try {
    const limited = await rateLimitDistributed(request, "leads-api", 90, 60_000);
    if (limited) return limited;
    const rejected = validateCookieApiWrite(request);
    if (rejected) return rejected;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
    const actor = await getLeadsActor(session);
    if (!actor)
      return Response.json({ error: "Leads requires a Developer, Admin, or Councilor role." }, { status: 403 });
    const userLimited = await rateLimitDistributedIdentity("leads-user", actor.email, 90, 60_000);
    if (userLimited) return userLimited;
    await requireActiveCouncilor(actor);
    const response = await run(actor);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    return leadErrorResponse(error);
  }
}

export async function readLeadBody(request: Request): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length")) > 512_000)
    throw new LeadError("The import or request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new LeadError("Enter valid JSON details.");
  const decoder = new TextDecoder();
  let text = "",
    length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 512_000) {
      await reader.cancel();
      throw new LeadError("The import or request is too large.", 413);
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  try {
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new LeadError("Enter valid JSON details.");
  }
}
