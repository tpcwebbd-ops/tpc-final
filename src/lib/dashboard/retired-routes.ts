/*
|-----------------------------------------
| setting up retired-routes.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

const retiredDashboardRoutePrefixes = ["/dashboard/products", "/dashboard/orders"] as const;

export function isRetiredDashboardRoute(value: string) {
  let pathname = value.trim().split(/[?#]/, 1)[0] ?? "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) break;
      pathname = decoded;
    } catch {
      break;
    }
  }
  pathname = pathname.replaceAll("\\", "/").replace(/\/+$/, "").replace(/\/+/g, "/").toLowerCase();
  return retiredDashboardRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function removeRetiredSidebarDescendants<T extends { id: string; url: string; parentId?: string | null }>(
  items: T[],
) {
  const removedIds = new Set(items.filter((item) => isRetiredDashboardRoute(item.url)).map((item) => item.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (item.parentId && removedIds.has(item.parentId) && !removedIds.has(item.id)) {
        removedIds.add(item.id);
        changed = true;
      }
    }
  }
  return items.filter((item) => !removedIds.has(item.id));
}
