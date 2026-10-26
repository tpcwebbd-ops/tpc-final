/*
|-----------------------------------------
| setting up MenuClient.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";
import { useEffect, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import type { MenuData } from "@/app/dashboard/admin/menu/data";
import { CartDrawer } from "@/components/cart/CartDrawer";
import MenuOneQuery from "@/components/menu/menu-1/Query";
import MenuTwoQuery from "@/components/menu/menu-2/Query";
import MenuThreeQuery from "@/components/menu/menu-3/Query";

export default function MenuClient({ data }: { data: MenuData }) {
  const { isPending } = authClient.useSession();
  const [menu, setMenu] = useState<MenuData | null>(data);
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    const refreshMenu = async () => {
      try {
        const response = await fetch("/api/dashboard/menu/v1", { cache: "no-store" });
        if (!response.ok) return;
        const result = (await response.json()) as {
          menu?: { data: MenuData } | null;
          menus?: { data: MenuData }[];
        };
        // Authenticated requests receive the full editor list, while public
        // requests receive only the published menu. The client can make either
        // request depending on whether its visitor is signed in.
        setMenu(result.menu?.data ?? result.menus?.find((item) => item.data.isVisible)?.data ?? null);
      } catch {
        /* Keep the last known menu when the background refresh fails. */
      }
    };
    const onMenuUpdated = () => void refreshMenu();
    window.addEventListener("webapps-menu-updated", onMenuUpdated);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "webapps-menu-updated") onMenuUpdated();
    };
    window.addEventListener("storage", onStorage);
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("webapps-menu");
      channel.addEventListener("message", onMenuUpdated);
    }
    return () => {
      window.removeEventListener("webapps-menu-updated", onMenuUpdated);
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);
  if (!menu) return null;
  const renderedMenu =
    menu.variant === "menu-2" ? (
      <MenuTwoQuery data={menu} pending={isPending} />
    ) : menu.variant === "menu-3" ? (
      <MenuThreeQuery data={menu} pending={isPending} />
    ) : (
      <MenuOneQuery data={menu} pending={isPending} />
    );
  return (
    <>
      {renderedMenu}
      <CartDrawer />
    </>
  );
}
