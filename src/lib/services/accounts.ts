/*
|-----------------------------------------
| setting up accounts service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { deleteAccount, deleteAccounts, findAccounts, type AccountDocument, updateAccount } from "@/lib/models/auth";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeAccount = (account: AccountDocument) => ({
  id: account.id || account._id?.toHexString() || "",
  accountId: account.accountId ?? "",
  providerId: account.providerId ?? "",
  userId: account.userId ?? "",
  createdAt: account.createdAt?.toISOString() ?? null,
  updatedAt: account.updatedAt?.toISOString() ?? null,
});

export async function listAccounts({ page, limit, q }: { page: number; limit: number; q: string }) {
  const filter = q
    ? {
        $or: [
          { providerId: { $regex: escapeRegex(q), $options: "i" } },
          { accountId: { $regex: escapeRegex(q), $options: "i" } },
          { userId: { $regex: escapeRegex(q), $options: "i" } },
        ],
      }
    : {};
  const [total, accounts] = await findAccounts(filter, page, limit);
  return { accounts: accounts.map(serializeAccount), total };
}

export async function updateAccountDetails(id: string, accountId: string, providerId: string) {
  return (await updateAccount(id, accountId, providerId)).matchedCount > 0;
}

export async function removeAccount(id: string) {
  return (await deleteAccount(id)).deletedCount > 0;
}

export async function removeAccounts(ids: string[]) {
  return (await deleteAccounts(ids)).deletedCount;
}
