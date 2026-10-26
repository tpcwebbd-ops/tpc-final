/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { buildResponse, getBuildItems, getBuildStatus, revalidateBuild, type BuildTarget } from "@/lib/services/build";

export type { BuildItem, BuildTarget } from "@/lib/services/build";

const access = async (request: Request) => {
  const limited = await rateLimitDistributed(request, "dashboard-build-api", 10, 60_000);
  return { limited, session: limited ? null : await auth.api.getSession({ headers: request.headers }) };
};
async function authorized(request: Request, method: "GET" | "POST") {
  const { limited, session } = await access(request);
  if (limited) return { error: limited };
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const permission = await authorizeDashboardRequest(session, "/dashboard/admin/build", method);
  return permission.allowed
    ? { session }
    : { error: Response.json({ error: permission.state.message ?? "Unauthorized." }, { status: 403 }) };
}
export async function GET(request: Request) {
  const result = await authorized(request, "GET");
  if ("error" in result) return result.error;
  const items = await getBuildItems();
  return Response.json(buildResponse(await getBuildStatus(items), 0, items));
}
export async function POST(request: Request) {
  const result = await authorized(request, "POST");
  if ("error" in result) return result.error;
  const body = (await request.json().catch(() => null)) as { target?: BuildTarget } | null;
  const target = body?.target ?? "all";
  const items = await getBuildItems();
  if (target !== "all" && !new Map(items.map((item) => [item.id, item])).has(target))
    return Response.json({ error: "Invalid revalidation target." }, { status: 400 });
  const revalidated = await revalidateBuild(target, items);
  if (revalidated.kind === "cooldown")
    return Response.json(
      { error: "This item is cooling down.", cooldowns: { [target]: revalidated.until.toISOString() } },
      { status: 429 },
    );
  return Response.json(buildResponse(revalidated.cooldowns, revalidated.count));
}
