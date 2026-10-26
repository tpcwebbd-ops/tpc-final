/*
|-----------------------------------------
| setting up auth model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { ObjectId, type Document } from "mongodb";

import { database } from "@/lib/db";

export type VerificationUser = { email?: string; emailVerified?: boolean; emailVerificationLastSentAt?: Date };

export const usersCollection = <T extends Document = Document>() => database().collection<T>("user");
export const accountsCollection = <T extends Document = Document>() => database().collection<T>("account");
export const sessionsCollection = <T extends Document = Document>() => database().collection<T>("session");
export const verificationsCollection = <T extends Document = Document>() => database().collection<T>("verification");
export const accessesCollection = <T extends Document = Document>() => database().collection<T>("access");
export const rolesCollection = <T extends Document = Document>() => database().collection<T>("role");
export const sidebarsCollection = <T extends Document = Document>() => database().collection<T>("sidebar");

export const findVerificationUser = (email: string) =>
  usersCollection<VerificationUser>().findOne(
    { email },
    { projection: { email: 1, emailVerified: 1, emailVerificationLastSentAt: 1 } },
  );

export const claimVerificationEmail = (email: string, sentAt: Date, cooldownMs: number) =>
  usersCollection<VerificationUser>().updateOne(
    {
      email,
      $or: [
        { emailVerificationLastSentAt: { $exists: false } },
        { emailVerificationLastSentAt: { $lte: new Date(sentAt.getTime() - cooldownMs) } },
      ],
    },
    { $set: { emailVerificationLastSentAt: sentAt } },
  );

export const findVerificationCooldown = (email: string) =>
  usersCollection<VerificationUser>().findOne({ email }, { projection: { emailVerificationLastSentAt: 1 } });

export const clearVerificationClaim = (email: string, sentAt: Date) =>
  usersCollection<VerificationUser>().updateOne(
    { email, emailVerificationLastSentAt: sentAt },
    { $unset: { emailVerificationLastSentAt: "" } },
  );

export type VerificationDocument = {
  _id?: ObjectId;
  id?: string;
  identifier?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export const findVerifications = (filter: Document, page: number, limit: number) =>
  Promise.all([
    verificationsCollection<VerificationDocument>().countDocuments(filter),
    verificationsCollection<VerificationDocument>()
      .find(filter, { projection: { id: 1, identifier: 1, expiresAt: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

const verificationFilter = (id: string) =>
  ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id };

export const updateVerificationExpiry = (id: string, expiresAt: Date) =>
  verificationsCollection().updateOne(verificationFilter(id), { $set: { expiresAt, updatedAt: new Date() } });

export const deleteVerification = (id: string) => verificationsCollection().deleteOne(verificationFilter(id));

export const deleteVerifications = (ids: string[]) => {
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  return verificationsCollection().deleteMany({
    $or: [{ id: { $in: ids } }, ...(objectIds.length ? [{ _id: { $in: objectIds } }] : [])],
  });
};

export type UserDocument = {
  _id?: ObjectId;
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
  mobileNumber?: string;
  address?: string;
  bio?: string;
  profilePicture?: string;
  gender?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const findUsers = (filter: Document, page: number, limit: number) =>
  Promise.all([
    usersCollection<UserDocument>().countDocuments(filter),
    usersCollection<UserDocument>()
      .find(filter, {
        projection: {
          id: 1,
          name: 1,
          email: 1,
          emailVerified: 1,
          image: 1,
          mobileNumber: 1,
          address: 1,
          bio: 1,
          profilePicture: 1,
          gender: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

const userFilter = (id: string) => (ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });

export const findUserWithEmailExceptId = (id: string, email: string) =>
  usersCollection().findOne({ email, $nor: [userFilter(id)] }, { projection: { id: 1 } });

export const updateUser = (
  id: string,
  fields: Pick<UserDocument, "name" | "email" | "mobileNumber" | "emailVerified">,
) => usersCollection().updateOne(userFilter(id), { $set: { ...fields, updatedAt: new Date() } });

export const deleteUser = (id: string) => usersCollection().deleteOne(userFilter(id));

export const deleteUserAccountsAndSessions = (id: string) =>
  Promise.all([accountsCollection().deleteMany({ userId: id }), sessionsCollection().deleteMany({ userId: id })]);

export const deleteUsers = (ids: string[]) => {
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  return usersCollection().deleteMany({
    $or: [{ id: { $in: ids } }, ...(objectIds.length ? [{ _id: { $in: objectIds } }] : [])],
  });
};

export const deleteUsersAccountsAndSessions = (ids: string[]) =>
  Promise.all([
    accountsCollection().deleteMany({ userId: { $in: ids } }),
    sessionsCollection().deleteMany({ userId: { $in: ids } }),
  ]);

export type AccountDocument = {
  _id?: ObjectId;
  id?: string;
  accountId?: string;
  providerId?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const findAccounts = (filter: Document, page: number, limit: number) =>
  Promise.all([
    accountsCollection<AccountDocument>().countDocuments(filter),
    accountsCollection<AccountDocument>()
      .find(filter, { projection: { id: 1, accountId: 1, providerId: 1, userId: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

const accountFilter = (id: string) => (ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });

export const updateAccount = (id: string, accountId: string, providerId: string) =>
  accountsCollection().updateOne(accountFilter(id), { $set: { accountId, providerId, updatedAt: new Date() } });

export const deleteAccount = (id: string) => accountsCollection().deleteOne(accountFilter(id));

export const deleteAccounts = (ids: string[]) => {
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  return accountsCollection().deleteMany({
    $or: [{ id: { $in: ids } }, ...(objectIds.length ? [{ _id: { $in: objectIds } }] : [])],
  });
};

export type SessionDocument = {
  _id?: ObjectId;
  id?: string;
  userId?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
};

export const findSessions = (filter: Document, page: number, limit: number) =>
  Promise.all([
    sessionsCollection<SessionDocument>().countDocuments(filter),
    sessionsCollection<SessionDocument>()
      .find(filter, {
        projection: { id: 1, userId: 1, expiresAt: 1, createdAt: 1, updatedAt: 1, ipAddress: 1, userAgent: 1 },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

const sessionFilter = (id: string) => (ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });

export const updateSessionExpiry = (id: string, expiresAt: Date) =>
  sessionsCollection().updateOne(sessionFilter(id), { $set: { expiresAt, updatedAt: new Date() } });

export const deleteSession = (id: string) => sessionsCollection().deleteOne(sessionFilter(id));

export const deleteSessions = (ids: string[]) => {
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  return sessionsCollection().deleteMany({
    $or: [{ id: { $in: ids } }, ...(objectIds.length ? [{ _id: { $in: objectIds } }] : [])],
  });
};

export type SidebarItem = {
  id: string;
  name: string;
  url: string;
  icon: string;
  parentId: string | null;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const findSidebars = () =>
  sidebarsCollection<SidebarItem>()
    .find({}, { projection: { id: 1, name: 1, url: 1, icon: 1, parentId: 1, position: 1, createdAt: 1, updatedAt: 1 } })
    .sort({ parentId: 1, position: 1, name: 1 })
    .toArray();

export async function findSidebarDepth(parentId: string | null) {
  let depth = 0;
  let current = parentId;
  while (current) {
    const parent = await sidebarsCollection<SidebarItem>().findOne({ id: current }, { projection: { parentId: 1 } });
    if (!parent) return -1;
    depth += 1;
    current = parent.parentId;
  }
  return Math.max(0, depth - 1);
}

export const findLastSidebarForParent = (parentId: string | null) =>
  sidebarsCollection<SidebarItem>().find({ parentId }).sort({ position: -1 }).limit(1).next();

export const createSidebar = (item: SidebarItem) => sidebarsCollection<SidebarItem>().insertOne(item);

export const findSidebarById = (id: string) => sidebarsCollection<SidebarItem>().findOne({ id });

export async function findSidebarDescendantIds(id: string) {
  const result: string[] = [];
  const queue = [id];
  while (queue.length) {
    const parentId = queue.shift()!;
    const children = await sidebarsCollection<SidebarItem>()
      .find({ parentId }, { projection: { id: 1 } })
      .toArray();
    children.forEach((child) => {
      result.push(child.id);
      queue.push(child.id);
    });
  }
  return result;
}

export async function findSidebarTreeIds(roots: string[]) {
  const ids = new Set(roots);
  const queue = [...roots];
  while (queue.length) {
    const parentId = queue.shift()!;
    const children = await sidebarsCollection<SidebarItem>()
      .find({ parentId }, { projection: { id: 1 } })
      .toArray();
    children.forEach((child) => {
      if (!ids.has(child.id)) {
        ids.add(child.id);
        queue.push(child.id);
      }
    });
  }
  return [...ids];
}

export const updateSidebar = (id: string, item: Partial<SidebarItem>) =>
  sidebarsCollection<SidebarItem>().updateOne({ id }, { $set: { ...item, updatedAt: new Date() } });

export const findSidebarSiblings = (parentId: string | null) =>
  sidebarsCollection<SidebarItem>().find({ parentId }).sort({ position: 1, id: 1 }).toArray();

export const swapSidebarPositions = (item: SidebarItem, sibling: SidebarItem) =>
  Promise.all([
    sidebarsCollection().updateOne({ id: item.id }, { $set: { position: sibling.position, updatedAt: new Date() } }),
    sidebarsCollection().updateOne({ id: sibling.id }, { $set: { position: item.position, updatedAt: new Date() } }),
  ]);

export const deleteSidebars = (ids: string[]) => sidebarsCollection().deleteMany({ id: { $in: ids } });

export const clearSidebarPermissions = (ids: string[]) => {
  const unsets: Record<string, string> = {};
  for (const id of ids) unsets[`permissions.${id}`] = "";
  return rolesCollection().updateMany({}, { $unset: unsets });
};

export type ProfileUser = {
  id?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  address?: string;
  bio?: string;
  profilePicture?: string;
  gender?: string;
};
export const findProfileUser = (id: string, email?: string | null) =>
  usersCollection<ProfileUser>().findOne(
    { $or: [{ id }, { email: email ?? "" }] },
    { projection: { id: 1, name: 1, email: 1, mobileNumber: 1, address: 1, bio: 1, profilePicture: 1, gender: 1 } },
  );
export const saveProfileUser = (id: string, email: string | null | undefined, profile: Record<string, unknown>) =>
  usersCollection().updateOne(
    { $or: [{ id }, { email: email ?? "" }] },
    { $set: { ...profile, updatedAt: new Date() }, $setOnInsert: { id, createdAt: new Date(), emailVerified: false } },
    { upsert: true },
  );
