/*
|-----------------------------------------
| setting up route.ts for the App
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth, client } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { leadRole } from "@/lib/dashboard/leads";
import { councilorPermission } from "@/lib/dashboard/permissions";
import { sanitizeRoleDescription } from "@/lib/security/role-description";

type Permission = { read: boolean; create: boolean; update: boolean; delete: boolean };
type Role = {
  id: string;
  name: string;
  responsible: string;
  icon: string;
  position: number;
  permissions: Record<string, Permission>;
};
type Sidebar = { id: string; url: string };

async function allowed(request: Request, method: "PATCH" | "DELETE") {
  const limited = await rateLimitDistributed(request, "role-api");
  if (limited) return { response: limited };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { response: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/roles/v1", method);
  return authorization.allowed
    ? {}
    : { response: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }) };
}

const clean = (input: Record<string, Partial<Permission>> | undefined, sidebars: Sidebar[], name: string) =>
  Object.fromEntries(
    sidebars.map((item) => {
      const grant = {
        read: input?.[item.id]?.read === true,
        create: input?.[item.id]?.create === true,
        update: input?.[item.id]?.update === true,
        delete: input?.[item.id]?.delete === true,
      };
      return [item.id, leadRole(name) === "councilor" ? councilorPermission(item.url, grant) : grant];
    }),
  ) as Record<string, Permission>;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await allowed(request, "PATCH");
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<Role> | null;
  const name = body?.name?.trim();
  if (!name) return Response.json({ error: "Role name is required." }, { status: 400 });

  const database = client.db();
  const sidebars = await database
    .collection<Sidebar>("sidebar")
    .find({}, { projection: { id: 1, url: 1 } })
    .toArray();
  const result = await database.collection<Role>("role").updateOne(
    { id },
    {
      $set: {
        name,
        responsible: sanitizeRoleDescription(body?.responsible),
        icon: body?.icon?.trim() || "ShieldCheck",
        position: typeof body?.position === "number" ? body.position : 0,
        permissions: clean(body?.permissions, sidebars, name),
        updatedAt: new Date(),
      },
    },
  );
  if (!result.matchedCount) return Response.json({ error: "Role not found." }, { status: 404 });
  await database.collection("access").updateMany({ roleId: id }, { $set: { roleName: name, updatedAt: new Date() } });
  await invalidateDashboardCache(redisKeys.roles, redisKeys.access);
  return Response.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await allowed(request, "DELETE");
  if (guard.response) return guard.response;

  const { id } = await params;
  if (await client.db().collection("access").findOne({ roleId: id }))
    return Response.json({ error: "Reassign users before deleting this role." }, { status: 409 });
  const result = await client.db().collection("role").deleteOne({ id });
  if (!result.deletedCount) return Response.json({ error: "Role not found." }, { status: 404 });
  await invalidateDashboardCache(redisKeys.roles, redisKeys.access);
  return Response.json({ success: true });
}
