/*
|-----------------------------------------
| setting up permissions.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 10 October, 2026
|-----------------------------------------
*/

export type DashboardOperation = "read" | "create" | "update" | "delete";
export type DashboardPermission = Record<DashboardOperation, boolean>;
export type DashboardPermissions = {
  bypassed: boolean;
  blocked: boolean;
  sidebarPermissions?: {
    id: string;
    url: string;
    parentId?: string | null;
    permissions: Partial<DashboardPermission>;
  }[];
};
export const fullDashboardPermission: DashboardPermission = { read: true, create: true, update: true, delete: true };
export const emptyDashboardPermission: DashboardPermission = {
  read: false,
  create: false,
  update: false,
  delete: false,
};

export function dashboardPaths(path: string) {
  const aliases: Record<string, string[]> = {
    "/dashboard/admin/role": ["/dashboard/developer/role"],
    "/dashboard/developer/role": ["/dashboard/admin/role"],
    "/dashboard/admin/whatsapp": ["/dashboard/whatsapp"],
    "/dashboard/admin/topbanner": ["/dashboard/admin/top-banner"],
    "/dashboard/admin/footer": ["/dashboard/admin/footer-editor"],
  };
  const parents = ["/dashboard/admin/menu", "/dashboard/admin/pages", "/dashboard/orders", "/dashboard/leads"].filter(
    (parent) => path.startsWith(`${parent}/`),
  );
  return [path, ...(aliases[path] ?? []), ...parents];
}

export function dashboardCan(state: DashboardPermissions | undefined, path: string, operation: DashboardOperation) {
  if (!state || state.blocked) return false;
  if (state.bypassed) return true;
  const paths = dashboardPaths(path);
  const rows = state.sidebarPermissions ?? [];
  const exactLeadArea = path.startsWith("/dashboard/leads/") && rows.some((item) => item.url === path);
  return rows.some(
    (item) => (exactLeadArea ? item.url === path : paths.includes(item.url)) && item.permissions[operation] === true,
  );
}

export function dashboardCanEnter(state: DashboardPermissions | undefined, path: string) {
  if (!state || state.blocked) return false;
  if (state.bypassed) return true;
  if (
    ["read", "create", "update", "delete"].some((operation) =>
      dashboardCan(state, path, operation as DashboardOperation),
    )
  )
    return true;
  // Container pages are reachable through a permitted descendant. Their cards
  // still use the same permissions, so this never grants access to sibling data.
  const rows = state.sidebarPermissions ?? [];
  const parentIds = new Set(rows.filter((item) => item.url === path).map((item) => item.id));
  for (let remaining = rows.length; remaining > 0; remaining--) {
    let changed = false;
    for (const row of rows) {
      if (row.parentId && parentIds.has(row.parentId) && !parentIds.has(row.id)) {
        if (Object.values(row.permissions).some((value) => value === true)) return true;
        parentIds.add(row.id);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return false;
}

// A Councilor manages assigned Leads, never the accounts that grant privileges.
export function councilorRestrictedPath(path: string) {
  return /^\/dashboard\/(?:admin|developer)\/(?:access|role|users|account|session|verification|sidebar)(?:\/|$)/.test(
    path,
  );
}

export function councilorPermission(path: string, grant: Partial<DashboardPermission>) {
  if (councilorRestrictedPath(path)) return emptyDashboardPermission;
  if (/^\/dashboard\/leads\/(?:funnels|councilors)$/.test(path))
    return { ...emptyDashboardPermission, read: grant.read === true };
  return grant;
}
