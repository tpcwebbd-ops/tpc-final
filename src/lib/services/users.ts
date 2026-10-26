/*
|-----------------------------------------
| setting up users service for the App
|-----------------------------------------
*/

import "server-only";

import {
  deleteUser,
  deleteUserAccountsAndSessions,
  deleteUsers,
  deleteUsersAccountsAndSessions,
  findUserWithEmailExceptId,
  findUsers,
  type UserDocument,
  updateUser as updateUserRecord,
} from "@/lib/models/auth";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeUser(user: UserDocument) {
  return {
    id: user.id || user._id?.toHexString() || "",
    name: user.name ?? "",
    email: user.email ?? "",
    emailVerified: Boolean(user.emailVerified),
    image: user.image ?? null,
    mobileNumber: user.mobileNumber ?? "",
    address: user.address ?? "",
    bio: user.bio ?? "",
    profilePicture: user.profilePicture ?? "",
    gender: user.gender ?? "",
    createdAt: user.createdAt?.toISOString() ?? null,
    updatedAt: user.updatedAt?.toISOString() ?? null,
  };
}

export async function listUsers(page: number, limit: number, query: string) {
  const filter = query
    ? {
        $or: [
          { name: { $regex: escapeRegex(query), $options: "i" } },
          { email: { $regex: escapeRegex(query), $options: "i" } },
          { mobileNumber: { $regex: escapeRegex(query), $options: "i" } },
        ],
      }
    : {};
  const [total, users] = await findUsers(filter, page, limit);
  return { users: users.map(serializeUser), total, page, limit };
}

export async function editUser(
  id: string,
  fields: Pick<UserDocument, "name" | "email" | "mobileNumber" | "emailVerified">,
) {
  if (await findUserWithEmailExceptId(id, fields.email!)) return { kind: "duplicate" as const };
  const result = await updateUserRecord(id, fields);
  return result.matchedCount ? { kind: "success" as const } : { kind: "not-found" as const };
}

export async function removeUser(id: string) {
  const result = await deleteUser(id);
  if (!result.deletedCount) return { kind: "not-found" as const };
  await deleteUserAccountsAndSessions(id);
  return { kind: "success" as const };
}

export async function removeUsers(ids: string[]) {
  const result = await deleteUsers(ids);
  await deleteUsersAccountsAndSessions(ids);
  return result;
}
