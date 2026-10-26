/*
|-----------------------------------------
| setting up access service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { accessesCollection, rolesCollection, sessionsCollection, usersCollection } from "@/lib/models/auth";

export type Access = {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  blocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
type Role = { id: string; name: string };
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listAccess({
  page,
  pageSize,
  search,
  roleId,
  missingRole = false,
}: {
  page: number;
  pageSize: number;
  search: string;
  roleId: string;
  missingRole?: boolean;
}) {
  const roles = await rolesCollection<Role>()
    .find({}, { projection: { id: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray();
  const roleIds = roles.map((role) => role.id);
  const query = {
    ...(missingRole ? { roleId: { $nin: roleIds } } : roleId ? { roleId } : {}),
    ...(search
      ? {
          $or: [
            { email: { $regex: escapeRegex(search), $options: "i" } },
            { roleName: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {}),
  };
  const [items, total, missingRoleCount, roleCounts] = await Promise.all([
    accessesCollection<Access>()
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    accessesCollection<Access>().countDocuments(query),
    accessesCollection().countDocuments({ roleId: { $nin: roleIds } }),
    accessesCollection<Access>()
      .aggregate<{ _id: string; count: number }>([{ $group: { _id: "$roleId", count: { $sum: 1 } } }])
      .toArray(),
  ]);
  return {
    items: items.map((item) => {
      const role = roles.find((role) => role.id === item.roleId);
      const candidates = roles.filter((role) => role.name.trim().toLowerCase() === item.roleName?.trim().toLowerCase());
      return {
        ...item,
        roleName: role?.name ?? item.roleName,
        roleMissing: !role,
        suggestedRoleName: !role && candidates.length === 1 ? candidates[0].name : null,
      };
    }),
    total,
    roles,
    roleCounts,
    missingRoleCount,
  };
}

export async function createAccess(input: { email: string; roleId: string; blocked: boolean }) {
  const [user, role, duplicate] = await Promise.all([
    usersCollection().findOne({ email: input.email }, { projection: { id: 1 } }),
    rolesCollection<Role>().findOne({ id: input.roleId }),
    accessesCollection<Access>().findOne({ email: input.email }, { projection: { id: 1 } }),
  ]);
  if (!user) return { kind: "user-not-found" as const };
  if (!role) return { kind: "role-not-found" as const };
  if (duplicate) return { kind: "duplicate" as const };
  const now = new Date();
  const item: Access = {
    id: randomUUID(),
    email: input.email,
    roleId: role.id,
    roleName: role.name,
    blocked: input.blocked,
    createdAt: now,
    updatedAt: now,
  };
  await accessesCollection<Access>().insertOne(item);
  await invalidateDashboardCache(redisKeys.access);
  return { kind: "created" as const, item };
}

async function revokeUserSessions(email: string) {
  const user = await usersCollection<{ id: string }>().findOne({ email }, { projection: { id: 1 } });
  if (user)
    await sessionsCollection().deleteMany({
      userId: { $in: [user.id, user._id, user._id.toString()].filter(Boolean) },
    });
}

export async function updateAccess(input: {
  id: string;
  roleId: string;
  blocked: boolean;
  actorEmail?: string | null;
}) {
  const role = await rolesCollection<Role>().findOne({ id: input.roleId });
  if (!role) return { kind: "role-not-found" as const };
  const existing = await accessesCollection<{ email: string }>().findOne(
    { id: input.id },
    { projection: { email: 1 } },
  );
  if (!existing) return { kind: "not-found" as const };
  if (input.blocked && existing.email.trim().toLowerCase() === input.actorEmail?.trim().toLowerCase())
    return { kind: "self-block" as const };
  await accessesCollection().updateOne(
    { id: input.id },
    { $set: { roleId: role.id, roleName: role.name, blocked: input.blocked, updatedAt: new Date() } },
  );
  if (input.blocked) await revokeUserSessions(existing.email);
  await invalidateDashboardCache(redisKeys.access);
  return { kind: "updated" as const };
}

export async function deleteAccess(input: { id: string; actorEmail?: string | null }) {
  const existing = await accessesCollection<{ email: string }>().findOne(
    { id: input.id },
    { projection: { email: 1 } },
  );
  if (!existing) return { kind: "not-found" as const };
  if (existing.email.trim().toLowerCase() === input.actorEmail?.trim().toLowerCase())
    return { kind: "self-delete" as const };
  await accessesCollection().deleteOne({ id: input.id });
  await revokeUserSessions(existing.email);
  await invalidateDashboardCache(redisKeys.access);
  return { kind: "deleted" as const };
}

export async function deleteAccesses(ids: string[]) {
  const records = await accessesCollection<Access>()
    .find({ id: { $in: ids } })
    .toArray();
  const result = await accessesCollection().deleteMany({ id: { $in: ids } });
  await Promise.all(records.map((record) => revokeUserSessions(record.email)));
  await invalidateDashboardCache(redisKeys.access);
  return result.deletedCount;
}
