/*
|-----------------------------------------
| setting up Leads bulk delete and status endpoints
| @author: Codex
|-----------------------------------------
*/

import { readLeadBody, withLeads } from "@/app/api/lib/leads-authorization";
import { bulkLeads, LeadError, leadKind, selectedIds } from "@/lib/services/leads";

export async function DELETE(request: Request) {
  return withLeads(request, async (actor) => {
    const body = await readLeadBody(request);
    return Response.json(await bulkLeads(actor, leadKind(body.kind), selectedIds(body.ids), body.mine === true));
  });
}
export async function PATCH(request: Request) {
  return withLeads(request, async (actor) => {
    const body = await readLeadBody(request);
    if ("assignedTo" in body) {
      if (Object.keys(body).some((key) => !["kind", "mine", "ids", "assignedTo"].includes(key)))
        throw new LeadError("Unsupported bulk assignment fields.");
      if (typeof body.assignedTo !== "string") throw new LeadError("Choose an active councilor.");
      return Response.json(
        await bulkLeads(
          actor,
          leadKind(body.kind),
          selectedIds(body.ids),
          body.mine === true,
          undefined,
          body.assignedTo,
        ),
      );
    }
    if (body.status !== "active" && body.status !== "inactive")
      throw new LeadError("Choose active or inactive status.");
    return Response.json(
      await bulkLeads(actor, leadKind(body.kind), selectedIds(body.ids), body.mine === true, body.status),
    );
  });
}
