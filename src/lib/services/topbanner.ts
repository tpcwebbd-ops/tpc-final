/*
|-----------------------------------------
| setting up topbanner service for the App
|-----------------------------------------
*/

import "server-only";

import { revalidatePath } from "next/cache";

import { deleteTopBanner, findTopBanner, saveTopBanner, type TopBannerRecord } from "@/lib/models/site-settings";

const serialize = (item: TopBannerRecord | null) => (item ? { variant: item.variant, data: item.data } : null);

export async function getTopBanner() {
  return serialize(await findTopBanner());
}

export async function updateTopBanner(variant: string, data: Record<string, unknown>) {
  const item: TopBannerRecord = { key: "site", variant, data, updatedAt: new Date() };
  await saveTopBanner(item);
  revalidatePath("/", "layout");
  return serialize(item);
}

export async function removeTopBanner() {
  await deleteTopBanner();
  revalidatePath("/", "layout");
}
