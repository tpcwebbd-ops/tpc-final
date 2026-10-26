/*
|-----------------------------------------
| setting up sidebars service for the App
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import { getCache, invalidateDashboardCache, redisKeys, setCache } from "@/app/api/lib/redis";
import {
  clearSidebarPermissions,
  createSidebar as createSidebarRecord,
  deleteSidebars,
  findLastSidebarForParent,
  findSidebarById,
  findSidebarDepth,
  findSidebarDescendantIds,
  findSidebarSiblings,
  findSidebarTreeIds,
  findSidebars,
  swapSidebarPositions,
  type SidebarItem,
  updateSidebar as updateSidebarRecord,
} from "@/lib/models/auth";

type SerializedSidebar = Omit<SidebarItem, "createdAt" | "updatedAt"> & {
  createdAt: string | null;
  updatedAt: string | null;
};

function serializeSidebar(item: SidebarItem): SerializedSidebar {
  return {
    ...item,
    createdAt: item.createdAt?.toISOString() ?? null,
    updatedAt: item.updatedAt?.toISOString() ?? null,
  };
}

export async function listSidebars(allowedSidebarIds: string[], bypassed: boolean) {
  const cached = await getCache<{ items: SerializedSidebar[] }>(redisKeys.sidebars);
  const items = cached?.items ?? (await findSidebars()).map(serializeSidebar);
  const allowedIds = new Set(allowedSidebarIds);
  const visibleIds = new Set(allowedIds);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (visibleIds.has(item.id) && item.parentId && !visibleIds.has(item.parentId)) {
        visibleIds.add(item.parentId);
        changed = true;
      }
    }
  }
  if (!cached) await setCache(redisKeys.sidebars, { items });
  const visibleItems = items.filter(
    (item) =>
      !/^\/dashboard\/(?:admin\/)?business-growth(?:\/|$)/.test(item.url) &&
      item.url !== "/dashboard/admin/customer" &&
      (bypassed || visibleIds.has(item.id)),
  );
  return { items: visibleItems };
}

export async function addSidebar(
  input: Omit<SidebarItem, "id" | "position" | "createdAt" | "updatedAt"> & { position?: number },
) {
  const depth = await findSidebarDepth(input.parentId);
  if (depth < 0 || depth > 1) return { kind: "invalid-depth" as const };
  const last = await findLastSidebarForParent(input.parentId);
  const item: SidebarItem = {
    ...input,
    id: randomUUID(),
    position: typeof input.position === "number" ? input.position : (last?.position ?? -1) + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await createSidebarRecord(item);
  await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return { kind: "success" as const, item: serializeSidebar(item) };
}

export async function editSidebar(
  id: string,
  input: Pick<SidebarItem, "name" | "url"> & Partial<Pick<SidebarItem, "icon" | "parentId" | "position">>,
) {
  const item = await findSidebarById(id);
  if (!item) return { kind: "not-found" as const };
  const parentId = input.parentId === undefined ? item.parentId : input.parentId || null;
  const descendants = await findSidebarDescendantIds(id);
  if (parentId === id || descendants.includes(parentId ?? "")) return { kind: "invalid-parent" as const };
  const depth = await findSidebarDepth(parentId);
  if (depth < 0 || depth > 1) return { kind: "invalid-depth" as const };
  await updateSidebarRecord(id, {
    name: input.name,
    url: input.url,
    icon: input.icon || "•",
    parentId,
    position: typeof input.position === "number" ? input.position : item.position,
  });
  await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return { kind: "success" as const };
}

export async function removeSidebar(id: string) {
  const ids = [id, ...(await findSidebarDescendantIds(id))];
  const result = await deleteSidebars(ids);
  if (!result.deletedCount) return { kind: "not-found" as const };
  if (ids.length) await clearSidebarPermissions(ids);
  await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return { kind: "success" as const, deletedCount: result.deletedCount };
}

export async function moveSidebar(id: string, direction: "up" | "down") {
  const item = await findSidebarById(id);
  if (!item) return { kind: "not-found" as const };
  const siblings = await findSidebarSiblings(item.parentId);
  const index = siblings.findIndex((sibling) => sibling.id === id);
  const swapWith = siblings[index + (direction === "up" ? -1 : 1)];
  if (!swapWith) return { kind: "boundary" as const };
  await swapSidebarPositions(item, swapWith);
  await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return { kind: "success" as const };
}

export async function removeSidebars(roots: string[]) {
  const ids = await findSidebarTreeIds(roots);
  const result = await deleteSidebars(ids);
  await invalidateDashboardCache(redisKeys.sidebars, redisKeys.roles);
  return result;
}
