/*
|-----------------------------------------
| setting up Menu.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { client } from "@/app/api/lib/auth";
import { defaultMenuOne, defaultMenuThree, defaultMenuTwo, type MenuData } from "@/app/dashboard/admin/menu/data";

import MenuClient from "./MenuClient";

const defaults: Record<MenuData["variant"], MenuData> = {
  "menu-1": defaultMenuOne,
  "menu-2": defaultMenuTwo,
  "menu-3": defaultMenuThree,
};

export async function Menu() {
  const records = await client
    .db()
    .collection<{ key: string; variant: MenuData["variant"]; data: Record<string, unknown>; position?: number }>("menu")
    .find({ variant: { $in: ["menu-1", "menu-2", "menu-3"] }, "data.isVisible": true })
    .sort({ position: 1 })
    .toArray();
  const saved =
    records[0] ??
    (await client
      .db()
      .collection<{ key: "site"; variant: MenuData["variant"]; data: Record<string, unknown> }>("menu")
      .findOne({ key: "site" }));
  const variant = saved?.variant ?? "menu-1";
  const data = { ...defaults[variant], ...(saved?.data ?? {}), variant } as MenuData;
  if (!data.isVisible) return null;
  return <MenuClient data={data} />;
}
