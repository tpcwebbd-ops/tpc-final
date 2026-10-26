/*
|-----------------------------------------
| setting up sessions service for the App
|-----------------------------------------
*/

import "server-only";

import {
  deleteSession,
  deleteSessions,
  findSessions,
  type SessionDocument,
  updateSessionExpiry,
} from "@/lib/models/auth";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeSession(session: SessionDocument) {
  return {
    id: session.id || session._id?.toHexString() || "",
    userId: session.userId ?? "",
    expiresAt: session.expiresAt?.toISOString() ?? null,
    createdAt: session.createdAt?.toISOString() ?? null,
    updatedAt: session.updatedAt?.toISOString() ?? null,
    ipAddress: session.ipAddress ?? "",
    userAgent: session.userAgent ?? "",
  };
}

export async function listSessions(page: number, limit: number, query: string) {
  const filter = query
    ? {
        $or: [
          { id: { $regex: escapeRegex(query), $options: "i" } },
          { userId: { $regex: escapeRegex(query), $options: "i" } },
          { ipAddress: { $regex: escapeRegex(query), $options: "i" } },
          { userAgent: { $regex: escapeRegex(query), $options: "i" } },
        ],
      }
    : {};
  const [total, sessions] = await findSessions(filter, page, limit);
  return { sessions: sessions.map(serializeSession), total, page, limit };
}

export const updateSession = (id: string, expiresAt: Date) => updateSessionExpiry(id, expiresAt);

export const removeSession = (id: string) => deleteSession(id);

export const removeSessions = (ids: string[]) => deleteSessions(ids);
