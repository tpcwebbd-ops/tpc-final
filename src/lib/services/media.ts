/*
|-----------------------------------------
| setting up media service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/
import "server-only";

import { randomUUID } from "crypto";

import { UTApi } from "uploadthing/server";

import {
  createMedia,
  deleteMedia,
  deleteMediaBulk,
  findMedia,
  findMediaBulk,
  findMediaByFileKey,
  findUploadOwnership,
  listMedia,
  renameMedia,
  type Media,
} from "@/lib/models/media";
export { type Media };
export const serializeMedia = (item: Media) => {
  const safeItem = { ...item };
  delete safeItem.deleteUrl;
  return { ...safeItem, createdAt: new Date(item.createdAt).toISOString() };
};
export const mediaIsAdministrator = (roleName: string | null) =>
  /^(admin|super admin|developer)$/i.test(roleName?.trim() ?? "");
export async function listMediaForApi(ownerOnly: boolean, email: string) {
  return (await listMedia(ownerOnly ? email.trim().toLowerCase() : undefined)).map(serializeMedia);
}
export async function createMediaForApi(input: Omit<Media, "id" | "author" | "createdAt">, author: string) {
  const cleanAuthor = author.trim().toLowerCase();
  if (input.uploadPlane === "Uploadthings") {
    if (!input.fileKey || !(await findUploadOwnership(input.fileKey, input.url, cleanAuthor)))
      return { kind: "not-owner" as const };
    if (await findMediaByFileKey(input.fileKey)) return { kind: "duplicate" as const };
  }
  const item: Media = { ...input, id: randomUUID(), author: cleanAuthor, createdAt: new Date() };
  await createMedia(item);
  return { kind: "created" as const, item };
}
const ownedBy = (item: Media, administrator: boolean, email: string) =>
  administrator || item.author === email.trim().toLowerCase();
export async function renameMediaForApi(id: string, name: string, administrator: boolean, email: string) {
  const item = await findMedia(id);
  if (!item) return { kind: "not-found" as const };
  if (!ownedBy(item, administrator, email)) return { kind: "forbidden" as const };
  await renameMedia(id, name);
  return { kind: "updated" as const };
}
export async function removeMediaForApi(id: string, administrator: boolean, email: string) {
  const item = await findMedia(id);
  if (!item) return { kind: "not-found" as const };
  if (!ownedBy(item, administrator, email)) return { kind: "forbidden" as const };
  try {
    await deleteImageBB(item, false);
    if (item.uploadPlane === "Uploadthings" && !item.fileKey)
      throw new Error("This UploadThing media item has no file key, so it cannot be safely deleted.");
    if (
      item.uploadPlane === "Uploadthings" &&
      item.fileKey &&
      !(await new UTApi({ token: process.env.UPLOADTHING_TOKEN }).deleteFiles(item.fileKey)).success
    )
      throw new Error("UploadThing could not delete the remote file.");
  } catch (error) {
    return {
      kind: "remote-failed" as const,
      error: error instanceof Error ? error.message : "Could not delete the remote file.",
    };
  }
  await deleteMedia(id);
  return { kind: "deleted" as const };
}
function parseImageBBDeleteUrl(value: string) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "ibb.co" ||
      url.port !== "" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !/^\/[a-z\d-]+\/[a-f\d]{32}$/i.test(url.pathname)
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export const isValidImageBBDeleteUrl = (value: string) => parseImageBBDeleteUrl(value) !== null;

async function deleteImageBB(item: Media, bulk: boolean) {
  if (item.uploadPlane !== "imageBB" || !item.deleteUrl) return;
  const url = parseImageBBDeleteUrl(item.deleteUrl);
  if (!url) throw new Error("ImageBB returned an invalid deletion URL.");
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(5_000) });
  if (!response.ok)
    throw new Error(bulk ? "ImageBB could not delete a remote image." : "ImageBB could not delete the remote image.");
}
const downloadableHost = (hostname: string, provider: Media["uploadPlane"]) => {
  const host = hostname.toLowerCase();
  return provider === "imageBB"
    ? host === "i.ibb.co" || host.endsWith(".ibb.co")
    : provider === "Uploadthings" &&
        (host === "utfs.io" ||
          host.endsWith(".utfs.io") ||
          host.endsWith(".ufs.sh") ||
          host.endsWith(".uploadthing.com"));
};
export async function downloadMediaForApi(id: string, administrator: boolean, email: string) {
  const item = await findMedia(id);
  if (!item) return { kind: "not-found" as const };
  if (item.uploadPlane === "Youtube") return { kind: "youtube" as const };
  if (!ownedBy(item, administrator, email)) return { kind: "forbidden" as const };
  let source: URL;
  try {
    source = new URL(item.url);
  } catch {
    return { kind: "invalid-url" as const };
  }
  if (source.protocol !== "https:" || !downloadableHost(source.hostname, item.uploadPlane))
    return { kind: "invalid-source" as const };
  try {
    const upstream = await fetch(source);
    return !upstream.ok || !upstream.body
      ? { kind: "unavailable" as const }
      : { kind: "download" as const, item, upstream };
  } catch {
    return { kind: "failed" as const };
  }
}
async function deleteRemote(item: Media, bulk = false) {
  await deleteImageBB(item, bulk);
  if (item.uploadPlane === "Uploadthings" && !item.fileKey)
    throw new Error(
      bulk
        ? "An UploadThing media item has no file key, so it cannot be safely deleted."
        : "This UploadThing media item has no file key, so it cannot be safely deleted.",
    );
  if (
    item.uploadPlane === "Uploadthings" &&
    item.fileKey &&
    !(await new UTApi({ token: process.env.UPLOADTHING_TOKEN }).deleteFiles(item.fileKey)).success
  )
    throw new Error(
      bulk ? "UploadThing could not delete a remote file." : "UploadThing could not delete the remote file.",
    );
}
export async function removeMediaBulkForApi(ids: string[], administrator: boolean, email: string) {
  const items = await findMediaBulk(ids, administrator ? undefined : email.trim().toLowerCase());
  if (items.length !== ids.length) return { kind: "forbidden" as const };
  try {
    for (const item of items) await deleteRemote(item, true);
  } catch (error) {
    return {
      kind: "remote-failed" as const,
      error: error instanceof Error ? error.message : "Could not delete a remote file.",
    };
  }
  return { kind: "deleted" as const, deletedCount: (await deleteMediaBulk(ids)).deletedCount };
}
