/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { MenuData } from "@/app/dashboard/admin/menu/data";
import MenuOneQuery from "@/components/menu/menu-1/Query";
import MenuTwoQuery from "@/components/menu/menu-2/Query";
import MenuThreeQuery from "@/components/menu/menu-3/Query";

export default function MenuPreviewPage() {
  const menuItem = useSearchParams().get("menuItem");
  const [menu, setMenu] = useState<MenuData | null>(null);
  useEffect(() => { fetch("/api/dashboard/menu/v1", { cache: "no-store" }).then((response) => response.json()).then((value: { menus?: { menuItem: string; data: MenuData }[] }) => setMenu(value.menus?.find((item) => item.menuItem === menuItem)?.data ?? null)).catch(() => setMenu(null)); }, [menuItem]);
  if (!menu) return <main className="grid min-h-screen place-items-center bg-[#fffaf0]">Loading preview…</main>;
  return <main className="min-h-screen bg-[#fffaf0]"><div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">Draft preview — this does not publish the menu. <Link className="underline" href={`/dashboard/admin/menu/edit?menuItem=${menuItem}`}>Edit</Link></div>{menu.variant === "menu-2" ? <MenuTwoQuery data={menu} pending={false} /> : menu.variant === "menu-3" ? <MenuThreeQuery data={menu} pending={false} /> : <MenuOneQuery data={menu} pending={false} />}<div className="mx-auto max-w-5xl p-10 text-stone-500">Your page content will appear below this menu.</div></main>;
}
