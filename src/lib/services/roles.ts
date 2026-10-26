/*
|-----------------------------------------
| setting up roles service for the App
|-----------------------------------------
*/

import "server-only";

import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { rolesCollection } from "@/lib/models/auth";

type Role = { id: string; position: number };
export async function moveRole(id: string, direction: "up" | "down") {
  const roles = await rolesCollection<Role>().find({}).sort({ position: 1, id: 1 }).toArray();
  const index = roles.findIndex((role) => role.id === id);
  if (index < 0) return { kind: "not-found" as const };
  const other = roles[index + (direction === "up" ? -1 : 1)];
  // Preserve the existing boundary behavior: it returns success without a swap.
  if (!other) await invalidateDashboardCache(redisKeys.roles);
  return { kind: "success" as const };
}
