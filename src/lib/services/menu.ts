/*
|-----------------------------------------
| setting up menu service for the App
|-----------------------------------------
*/
import "server-only";

import { revalidatePath } from "next/cache";

import { defaultMenuOne, defaultMenuThree, defaultMenuTwo, type MenuData } from "@/app/dashboard/admin/menu/data";
import { menuCollection } from "@/lib/models/site-settings";
type MenuId = MenuData["variant"];
export type MenuRecord = {
  key: string;
  variant: MenuId;
  data: Record<string, unknown>;
  position?: number;
  updatedAt?: Date;
};
const ids: MenuId[] = ["menu-1", "menu-2", "menu-3"];
const defaults: Record<MenuId, MenuData> = {
  "menu-1": defaultMenuOne,
  "menu-2": defaultMenuTwo,
  "menu-3": defaultMenuThree,
};
export const isMenuId = (value: unknown): value is MenuId => typeof value === "string" && ids.includes(value as MenuId);
export const serializeMenu = (item: MenuRecord) => ({
  menuItem: item.key,
  variant: item.variant,
  position: item.position ?? 0,
  data: { ...defaults[item.variant], ...item.data, variant: item.variant },
});
export async function savedMenus() {
  const records = await menuCollection<MenuRecord>()
    .find({ key: { $ne: "site" }, variant: { $in: ids } })
    .sort({ position: 1, updatedAt: -1 })
    .toArray();
  if (records.length) return records;
  const legacy = await menuCollection<MenuRecord>().findOne({ key: "site" });
  return legacy ? [{ ...legacy, key: legacy.variant }] : [];
}
export async function reorderMenus(order: { menuItem: string; position: number }[]) {
  await Promise.all(
    order.map((item) =>
      menuCollection<MenuRecord>().updateOne(
        { key: item.menuItem, variant: { $in: ids } },
        { $set: { position: item.position } },
      ),
    ),
  );
  revalidatePath("/dashboard/admin/menu");
  return savedMenus();
}
export async function saveMenu(key: string, variant: MenuId, data: Record<string, unknown>) {
  if (data.isVisible === true)
    await menuCollection<MenuRecord>().updateMany(
      { key: { $ne: key }, variant: { $in: ids } },
      { $set: { "data.isVisible": false } },
    );
  const previous = await menuCollection<MenuRecord>().findOne({ key });
  const item: MenuRecord = {
    key,
    variant,
    data,
    position: previous?.position ?? (await menuCollection<MenuRecord>().countDocuments({ variant: { $in: ids } })),
    updatedAt: new Date(),
  };
  await menuCollection<MenuRecord>().updateOne({ key }, { $set: item }, { upsert: true });
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/admin/menu");
  return item;
}
export async function removeMenu(key: string) {
  await menuCollection<MenuRecord>().deleteOne({ key });
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/admin/menu");
}
export { ids, defaults };
