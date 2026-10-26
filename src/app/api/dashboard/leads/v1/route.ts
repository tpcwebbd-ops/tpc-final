/*
|-----------------------------------------
| setting up Leads list, overview, and create endpoints
| @author: Codex
|-----------------------------------------
*/

import { readLeadBody, withLeads } from "@/app/api/lib/leads-authorization";
import {
  createLead,
  leadKind,
  leadOptions,
  leadsCouncilorSummaries,
  leadsOverview,
  listLeads,
} from "@/lib/services/leads";

export async function GET(request: Request) {
  return withLeads(request, async (actor) => {
    const query = new URL(request.url).searchParams;
    return Response.json(
      query.has("lookup")
        ? await leadOptions(actor, query)
        : query.get("councilorSummaries") === "true"
          ? await leadsCouncilorSummaries(actor)
        : query.get("overview") === "true"
          ? await leadsOverview(actor)
          : await listLeads(actor, query),
    );
  });
}
export async function POST(request: Request) {
  return withLeads(request, async (actor) => {
    const query = new URL(request.url).searchParams;
    const body = await readLeadBody(request);
    return Response.json(await createLead(actor, leadKind(query.get("kind")), body, query.get("mine") === "true"), {
      status: 201,
    });
  });
}
