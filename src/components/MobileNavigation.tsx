/*
|-----------------------------------------
| setting up MobileNavigation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August 2026
|-----------------------------------------
*/
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { NavigationData } from "@/app/api/dashboard/navigation/v1/route";
import { Icon } from "@/components/all-icons/all-icons";

function color(hex: string, transparency: number) {
  return `${hex}${Math.round(transparency * 2.55)
    .toString(16)
    .padStart(2, "0")}`;
}
export default function MobileNavigation({ dashboard = false }: { dashboard?: boolean }) {
  const pathname = usePathname();
  const [data, setData] = useState<NavigationData | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetch("/api/dashboard/navigation/v1", { cache: "no-store" });
        if (result.ok) setData(((await result.json()) as { navigation: NavigationData }).navigation);
      } catch {
        /* retain hidden state */
      }
    };
    void load();
    window.addEventListener("speed-box-navigation-updated", load);
    return () => window.removeEventListener("speed-box-navigation-updated", load);
  }, []);
  if (
    !data ||
    (dashboard
      ? !pathname.startsWith("/dashboard")
      : !data.user.enabled ||
        pathname.startsWith("/dashboard") ||
        data.user.hiddenPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)))
  )
    return null;
  const config = dashboard ? data.dashboard : data.user;
  const count = dashboard ? 4 : data.user.iconCount;
  const items = config.items.filter((item) => item.visible !== false).slice(0, dashboard ? 3 : count);
  const radius =
    config.radius === "none" ? "0" : config.radius === "sm" ? "4px" : config.radius === "xl" ? "16px" : "9999px";
  return (
    <nav
      aria-label={dashboard ? "Dashboard navigation" : "User navigation"}
      className="fixed inset-x-3 z-50 grid md:hidden"
      style={{
        bottom: config.marginBottom,
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        background: color(config.background, config.transparency),
        color: config.foreground,
        borderRadius: radius,
        padding: `${config.paddingY}px ${config.paddingX}px`,
        boxShadow: "0 -8px 24px rgba(120,80,30,.12)",
      }}
    >
      {items.map((item, index) => {
        const elevated = !dashboard && count === 5 && index === 2;
        return (
          <Link
            className={`grid place-items-center gap-1 text-[10px] font-medium transition duration-700 ${elevated ? "-translate-y-4" : ""}`}
            href={item.url}
            key={item.id}
          >
            <span
              className={
                elevated ? "grid h-11 w-11 place-items-center rounded-full bg-amber-100 ring-4 ring-[#fffaf0]" : ""
              }
            >
              <Icon name={item.icon ?? "Navigation"} />
            </span>
            <span>{item.name}</span>
          </Link>
        );
      })}
      {dashboard && (
        <button
          aria-label="Open dashboard sidebar"
          className="grid cursor-pointer place-items-center gap-1 text-[10px] font-medium"
          onClick={() => window.dispatchEvent(new Event("speed-box-dashboard-sidebar-toggle"))}
          type="button"
        >
          <span><Icon name="Settings" /></span>
          <span>Settings</span>
        </button>
      )}
    </nav>
  );
}
