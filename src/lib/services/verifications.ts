/*
|-----------------------------------------
| setting up verifications service for the App
|-----------------------------------------
*/

import "server-only";

import {
  deleteVerification,
  deleteVerifications,
  findVerifications,
  type VerificationDocument,
  updateVerificationExpiry,
} from "@/lib/models/auth";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeVerification(verification: VerificationDocument) {
  return {
    id: verification.id || verification._id?.toHexString() || "",
    identifier: verification.identifier ?? "",
    type: verification.identifier?.split(":")[0] || "verification",
    expiresAt: verification.expiresAt?.toISOString() ?? null,
    createdAt: verification.createdAt?.toISOString() ?? null,
    updatedAt: verification.updatedAt?.toISOString() ?? null,
  };
}

export async function listVerifications(page: number, limit: number, query: string) {
  const filter = query
    ? {
        $or: [
          { id: { $regex: escapeRegex(query), $options: "i" } },
          { identifier: { $regex: escapeRegex(query), $options: "i" } },
        ],
      }
    : {};
  const [total, verifications] = await findVerifications(filter, page, limit);
  return { verifications: verifications.map(serializeVerification), total, page, limit };
}

export const updateVerification = (id: string, expiresAt: Date) => updateVerificationExpiry(id, expiresAt);

export const removeVerification = (id: string) => deleteVerification(id);

export const removeVerifications = (ids: string[]) => deleteVerifications(ids);
