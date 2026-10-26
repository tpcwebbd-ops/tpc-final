/*
|-----------------------------------------
| setting up tracking service for the App
|-----------------------------------------
*/

import "server-only";

import { randomUUID } from "crypto";

import {
  createTracking,
  deleteTracking,
  deleteTrackingRecords,
  findTrackingByProvider,
  findTrackingRecords,
  type TrackingProvider,
  type TrackingRecord,
  updateTracking as updateTrackingRecord,
} from "@/lib/models/site-settings";

export type TrackingItem = Omit<TrackingRecord, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };

const serializeTracking = (item: TrackingRecord): TrackingItem => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export async function listTracking() {
  return (await findTrackingRecords()).map(serializeTracking);
}

export async function addTracking(input: Pick<TrackingRecord, "provider" | "pixelId" | "enabled">) {
  if (await findTrackingByProvider(input.provider)) return { kind: "duplicate" as const };
  const now = new Date();
  const item: TrackingRecord = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  await createTracking(item);
  return { kind: "success" as const, item: serializeTracking(item) };
}

export async function editTracking(id: string, pixelId: string, enabled: boolean) {
  const item = await updateTrackingRecord(id, pixelId, enabled);
  return item ? { kind: "success" as const, item: serializeTracking(item) } : { kind: "not-found" as const };
}

export async function removeTracking(id: string) {
  const result = await deleteTracking(id);
  return result.deletedCount ? { kind: "success" as const } : { kind: "not-found" as const };
}

export const removeTrackingRecords = (ids: string[]) => deleteTrackingRecords(ids);

export type { TrackingProvider };
