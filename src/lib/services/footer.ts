/*
|-----------------------------------------
| setting up footer service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { revalidatePath } from "next/cache";

import { deleteFooter, findFooter, saveFooter, type FooterRecord } from "@/lib/models/site-settings";

const serialize = (item: FooterRecord | null) => (item ? { variant: item.variant, data: item.data } : null);
export async function getFooter() {
  return serialize(await findFooter());
}
export async function updateFooter(variant: string, data: Record<string, unknown>) {
  const item: FooterRecord = { key: "site", variant, data, updatedAt: new Date() };
  await saveFooter(item);
  revalidatePath("/", "layout");
  return serialize(item);
}
export async function removeFooter() {
  await deleteFooter();
  revalidatePath("/", "layout");
}
