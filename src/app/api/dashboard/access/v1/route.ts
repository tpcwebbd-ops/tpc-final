/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { rolesCollection } from "@/lib/models/auth";
import { createAccess, listAccess, type Access } from "@/lib/services/access";

const pageSizes = [10, 25, 50, 100];
const serialize = (item: Access) => ({
  ...item,
  createdAt: item.createdAt?.toISOString() ?? null,
  updatedAt: item.updatedAt?.toISOString() ?? null,
});

async function access(request: Request) {
  const limited = await rateLimitDistributed(request, "access-api");
  if (limited) return { limited };
  return { limited: null, session: await auth.api.getSession({ headers: request.headers }) };
}

export async function GET(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (new URL(request.url).searchParams.get("options") === "true") {
    const grants = await Promise.all(
      ["POST", "PATCH"].map((method) => authorizeDashboardRequest(session, "/api/dashboard/access/v1", method)),
    );
    if (!grants.some((grant) => grant.allowed))
      return Response.json({ error: "You cannot assign roles." }, { status: 403 });
    const roles = await rolesCollection<{ id: string; name: string }>()
      .find({}, { projection: { _id: 0, id: 1, name: 1 } })
      .sort({ name: 1 })
      .toArray();
    return Response.json(
      { roles, items: [], total: 0, page: 1, pageSize: 10, roleCounts: {}, missingRoleCount: 0 },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/access/v1", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestedPageSize = Number(searchParams.get("pageSize"));
  const pageSize = pageSizes.includes(requestedPageSize) ? requestedPageSize : 10;
  const { items, total, roles, roleCounts, missingRoleCount } = await listAccess({
    page,
    pageSize,
    search: searchParams.get("search")?.trim() ?? "",
    roleId: searchParams.get("roleId")?.trim() ?? "",
    missingRole: searchParams.get("missingRole") === "true",
  });
  return Response.json({
    items: items.map(serialize),
    roles,
    total,
    page,
    pageSize,
    roleCounts: Object.fromEntries(roleCounts.map(({ _id, count }) => [_id, count])),
    missingRoleCount,
  });
}

export async function POST(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/access/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Partial<Access> | null;
  const email = body?.email?.trim().toLowerCase();
  const roleId = body?.roleId?.trim();
  if (!email || !roleId) return Response.json({ error: "Email and role are required." }, { status: 400 });
  const result = await createAccess({ email, roleId, blocked: Boolean(body?.blocked) });
  if (result.kind === "user-not-found") return Response.json({ error: "User email was not found." }, { status: 404 });
  if (result.kind === "role-not-found") return Response.json({ error: "Role was not found." }, { status: 404 });
  if (result.kind === "duplicate")
    return Response.json({ error: "This user already has access. Edit the existing record instead." }, { status: 409 });
  return Response.json({ item: serialize(result.item) }, { status: 201 });
}
