/*
|-----------------------------------------
| setting up dashboard-authorization.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { randomUUID } from "crypto";

import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { leadRole, normalizeLeadEmail, type LeadActor } from "@/lib/dashboard/leads";
import {
  councilorRestrictedPath,
  councilorPermission,
  dashboardCan,
  dashboardCanEnter,
  emptyDashboardPermission,
  fullDashboardPermission,
  type DashboardOperation,
  type DashboardPermission,
} from "@/lib/dashboard/permissions";
import { isRetiredDashboardRoute, removeRetiredSidebarDescendants } from "@/lib/dashboard/retired-routes";
import { accessesCollection, rolesCollection, sidebarsCollection } from "@/lib/models/auth";

export type { DashboardOperation } from "@/lib/dashboard/permissions";

type Permission = Record<DashboardOperation, boolean>;
type Role = { id: string; name: string; permissions: Record<string, Permission> };
type Access = {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  blocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
type Sidebar = {
  id: string;
  name?: string;
  url: string;
  icon?: string;
  parentId: string | null;
  position?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
type SessionUser = { user: { id?: string | null; email?: string | null } };

const standardUserPaths = new Set(["/dashboard/profile", "/dashboard/media", "/dashboard/install"]);

export type DashboardAccessState = {
  bypassed: boolean;
  blocked: boolean;
  roleId: string | null;
  roleName: string | null;
  allowedSidebarIds: string[];
  sidebarPermissions?: { id: string; url: string; parentId?: string | null; permissions: Partial<Permission> }[];
  message?: string;
};

export const authorizationIsDisabled = () => process.env.AuthorizationEnable === "false";

const toolApiOwners = new Set(["toufiquer.0@gmail.com", "tec.verse.bd@gmail.com"]);

function cleanEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

// These accounts are explicitly trusted for maintenance-only tools. They must
// still have a valid Better Auth session; this is not an anonymous bypass.
export function canAccessMaintenanceTools(session: SessionUser) {
  return toolApiOwners.has(cleanEmail(session.user.email));
}

async function ensureDefaultAccess(email: string) {
  const existing = await accessesCollection<Access>().findOne({ email });
  if (existing) return existing;

  const existingRole = await rolesCollection<Role>().findOne({ name: /^user$/i });
  const role: Role =
    existingRole ??
    (() => {
      const now = new Date();
      return { id: randomUUID(), name: "user", permissions: {}, createdAt: now, updatedAt: now };
    })();
  if (!existingRole)
    await rolesCollection().insertOne({
      ...role,
      responsible: "Default blocked role",
      icon: "ShieldOff",
      position: -1,
    });

  const now = new Date();
  const item: Access = {
    id: randomUUID(),
    email,
    roleId: role.id,
    roleName: role.name,
    blocked: false,
    createdAt: now,
    updatedAt: now,
  };
  await accessesCollection<Access>().insertOne(item);
  await invalidateDashboardCache(redisKeys.roles, redisKeys.access);
  return item;
}

async function enforceStandardUserPermissions(role: Role, sidebars: Sidebar[]) {
  if (role.name.trim().toLowerCase() !== "user") return role;

  const permissions = Object.fromEntries(
    sidebars.map((sidebar) => [
      sidebar.id,
      standardUserPaths.has(sidebar.url)
        ? { read: true, create: true, update: true, delete: true }
        : { read: false, create: false, update: false, delete: false },
    ]),
  ) as Record<string, Permission>;
  const unchanged = JSON.stringify(role.permissions ?? {}) === JSON.stringify(permissions);
  if (!unchanged) {
    await rolesCollection<Role>().updateOne({ id: role.id }, { $set: { permissions, updatedAt: new Date() } });
    await invalidateDashboardCache(redisKeys.roles, redisKeys.access);
  }
  return { ...role, permissions };
}

export async function getDashboardAccessState(session: SessionUser): Promise<DashboardAccessState> {
  const bypassed = authorizationIsDisabled();
  const email = cleanEmail(session.user.email);
  if (!email)
    return {
      bypassed: false,
      blocked: true,
      roleId: null,
      roleName: null,
      allowedSidebarIds: [],
      message: "Your account has no email address.",
    };

  const access = bypassed ? await accessesCollection<Access>().findOne({ email }) : await ensureDefaultAccess(email);
  if (access?.blocked)
    return {
      bypassed,
      blocked: true,
      roleId: access.roleId,
      roleName: access.roleName,
      allowedSidebarIds: [],
      message: "Your account has been blocked.",
    };

  const [savedRole, savedSidebars] = await Promise.all([
    access ? rolesCollection<Role>().findOne({ id: access.roleId }) : Promise.resolve(null),
    sidebarsCollection<Sidebar>()
      .find({}, { projection: { id: 1, url: 1, parentId: 1 } })
      .toArray(),
  ]);
  if (!savedRole && !bypassed)
    return {
      bypassed: false,
      blocked: false,
      roleId: null,
      roleName: null,
      allowedSidebarIds: [],
      message: "Your assigned role no longer exists.",
    };

  const sidebars = removeRetiredSidebarDescendants(savedSidebars);
  const role = savedRole ? (bypassed ? savedRole : await enforceStandardUserPermissions(savedRole, sidebars)) : null;
  const leadsRole = leadRole(role?.name);
  const sidebarPermissions = sidebars.map((sidebar) => ({
    id: sidebar.id,
    url: sidebar.url,
    parentId: sidebar.parentId,
    permissions: bypassed
      ? fullDashboardPermission
      : (/^\/dashboard\/leads(?:\/|$)/.test(sidebar.url) && !leadsRole) ||
          (leadsRole === "councilor" && councilorRestrictedPath(sidebar.url))
        ? emptyDashboardPermission
        : leadsRole === "councilor"
          ? councilorPermission(sidebar.url, role?.permissions?.[sidebar.id] ?? {})
          : (role?.permissions?.[sidebar.id] ?? {}),
  }));
  // A role can reach a dashboard area when it has at least one operation on
  // that sidebar entry. The sidebar API uses these IDs to render only the
  // role's permitted navigation tree.
  const allowed = sidebarPermissions
    .filter((sidebar) => dashboardCanEnter({ bypassed, blocked: false, sidebarPermissions }, sidebar.url))
    .map((x) => x.id);
  return {
    bypassed,
    blocked: false,
    roleId: role?.id ?? null,
    roleName: role?.name ?? null,
    allowedSidebarIds: allowed,
    sidebarPermissions,
  };
}

export async function getLeadsActor(
  session: SessionUser,
  accessState?: DashboardAccessState,
): Promise<LeadActor | null> {
  const email = normalizeLeadEmail(session.user.email ?? "");
  if (!email) return null;
  const state = accessState ?? (await getDashboardAccessState(session));
  if (state.blocked) return null;
  const role = leadRole(state.roleName);
  if (!role && !state.bypassed) return null;
  const permissions = Object.fromEntries(
    ["overview", "funnels", "customers", "councilors", "my-leads"].map((area) => [
      area,
      Object.fromEntries(
        ["read", "create", "update", "delete"].map((operation) => [
          operation,
          role === "councilor" && !state.bypassed && ["funnels", "councilors"].includes(area) && operation !== "read"
            ? false
            : dashboardCan(state, `/dashboard/leads/${area}`, operation as DashboardOperation),
        ]),
      ) as DashboardPermission,
    ]),
  );
  return { email, role: role ?? "unrestricted", bypassed: state.bypassed, permissions };
}

function operationForMethod(method: string): DashboardOperation {
  if (method === "POST") return "create";
  if (method === "PATCH" || method === "PUT") return "update";
  if (method === "DELETE") return "delete";
  return "read";
}

function apiResourcePaths(pathname: string, method: string): string[] | null {
  const resource = pathname.split("/")[3] ?? "";
  if (resource === "sidebars" && method === "GET") return [];
  const resources: Record<string, string[]> = {
    access: ["/dashboard/admin/access"],
    roles: ["/dashboard/admin/role", "/dashboard/developer/role"],
    sidebars: ["/dashboard/developer/sidebar"],
    accounts: ["/dashboard/admin/account", "/dashboard/developer/account"],
    sessions: ["/dashboard/developer/session"],
    verifications: ["/dashboard/developer/verification"],
    users: ["/dashboard/admin/users", "/dashboard/developer/users"],
    media: ["/dashboard/media"],
    install: ["/dashboard/install"],
    profile: ["/dashboard/profile"],
    whatsapp: ["/dashboard/admin/whatsapp", "/dashboard/whatsapp"],
    topbanner: ["/dashboard/admin/topbanner", "/dashboard/admin/top-banner"],
    footer: ["/dashboard/admin/footer", "/dashboard/admin/footer-editor"],
    menu: ["/dashboard/admin/menu"],
    pages: ["/dashboard/admin/pages"],
    seo: ["/dashboard/admin/seo"],
    build: ["/dashboard/admin/build"],
    tracking: ["/dashboard/admin/tracking"],
    categories: ["/dashboard/category"],
    coupons: ["/dashboard/coupon"],
    navigation: ["/dashboard/developer/navigation"],
    leads: [
      "/dashboard/leads",
      "/dashboard/leads/overview",
      "/dashboard/leads/funnels",
      "/dashboard/leads/customers",
      "/dashboard/leads/councilors",
      "/dashboard/leads/my-leads",
    ],
  };
  return Object.prototype.hasOwnProperty.call(resources, resource) ? (resources[resource] ?? []) : null;
}

export function isKnownDashboardApiResource(pathname: string) {
  return pathname.startsWith("/api/dashboard/") && apiResourcePaths(pathname, "GET") !== null;
}

export function isPublicDashboardRead(pathname: string, method: string) {
  return (
    method === "GET" &&
    [
      "/api/dashboard/topbanner/v1",
      "/api/dashboard/footer/v1",
      "/api/dashboard/menu/v1",
      "/api/dashboard/navigation/v1",
    ].includes(pathname)
  );
}

async function authorizeDashboardRequestWithState(state: DashboardAccessState, pathname: string, method: string) {
  if (state.blocked) return { allowed: false, state };
  if (isRetiredDashboardRoute(pathname))
    return { allowed: false, state: { ...state, message: "This dashboard area is no longer available." } };
  if (state.bypassed) return { allowed: true, state };

  // The dashboard home is not an editable sidebar row. A role that can read at
  // least one sidebar area may enter it; a default "user" role still cannot.
  if (pathname === "/dashboard" && method === "GET") {
    const allowed = state.allowedSidebarIds.length > 0;
    return {
      allowed,
      state: allowed ? state : { ...state, message: "Your role has no dashboard permissions yet." },
    };
  }

  const apiPaths = pathname.startsWith("/api/dashboard/") ? apiResourcePaths(pathname, method) : undefined;
  if (apiPaths === null) return { allowed: false, state: { ...state, message: "Unknown dashboard API resource." } };
  const paths = apiPaths ?? [pathname];
  if (!paths.length) return { allowed: true, state };

  if (!state.roleId) return { allowed: false, state: { ...state, message: "Your role is unavailable." } };
  const operation = operationForMethod(method);
  const allowed = apiPaths
    ? paths.some((path) => dashboardCan(state, path, operation))
    : method === "GET"
      ? dashboardCanEnter(state, pathname)
      : dashboardCan(state, pathname, operation);
  return {
    allowed,
    state: allowed ? state : { ...state, message: `You do not have ${operation} permission for this area.` },
  };
}

export async function authorizeDashboardRequest(session: SessionUser, pathname: string, method: string) {
  const state = await getDashboardAccessState(session);
  if (/^\/(?:api\/)?dashboard\/leads(?:\/|$)/.test(pathname)) {
    const actor = await getLeadsActor(session, state);
    if (!actor)
      return { allowed: false, state: { ...state, message: "Leads requires a Developer, Admin, or Councilor role." } };
  }
  return authorizeDashboardRequestWithState(state, pathname, method);
}
