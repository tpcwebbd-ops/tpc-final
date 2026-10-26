/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { authClient } from "@/app/api/lib/auth-client";
import { Icon } from "@/components/all-icons/all-icons";

import type { TopBannerOneData } from "./data";

export default function Query({ data }: { data: TopBannerOneData }) {
  const { data: session } = authClient.useSession();
  if (data.position === "hide" || !data.isVisible) return null;
  const positionClass = data.position === "fixed" ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-40";
  return (
    <div className={`${positionClass} py-2 text-xs`} style={{ background: data.background, color: data.foreground }}>
      <div className="mx-auto flex w-full max-w-7xl px-4 md:px-6 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {data.icons
            .filter((item) => item.visible)
            .map((item) => (
              <a
                aria-label={item.label}
                className="inline-flex shrink-0 items-center gap-1.5 transition duration-700 hover:opacity-70"
                href={item.url}
                key={item.id}
                title={item.url}
              >
                <Icon name={item.icon ?? "Link"} />
              </a>
            ))}
        </div>
        {data.buttonVisible !== false ? (
          <a
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-current/20 px-2.5 py-1 font-semibold transition duration-700 hover:bg-white/50"
            href={session ? "/dashboard" : "/login"}
          >
            <Icon name="LogIn" />
            {session ? "Dashboard" : "Login"}
          </a>
        ) : null}
      </div>
    </div>
  );
}
