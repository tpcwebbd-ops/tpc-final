/*
|-----------------------------------------
| setting up PublicMobileNavigationSpacing.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 20 August 2026
|-----------------------------------------
*/
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { NavigationData } from "@/app/api/dashboard/navigation/v1/route";

export function PublicMobileNavigationSpacing({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileNavigationVisible, setMobileNavigationVisible] = useState(false);
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetch("/api/dashboard/navigation/v1", { cache: "no-store" });
        if (result.ok) {
          const { navigation } = (await result.json()) as { navigation: NavigationData };
          setMobileNavigationVisible(navigation.user.enabled);
        }
      } catch {
        setMobileNavigationVisible(false);
      }
    };

    void load();
    window.addEventListener("speed-box-navigation-updated", load);
    return () => window.removeEventListener("speed-box-navigation-updated", load);
  }, []);

  return (
    <div className={mobileNavigationVisible && !isDashboardRoute ? "mb-25 print:mb-0 md:mb-0" : undefined}>
      {children}
    </div>
  );
}
