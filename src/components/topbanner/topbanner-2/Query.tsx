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

import type { TopBannerTwoData } from "./data";

export default function Query({ data }: { data: TopBannerTwoData }) {
  const { data: session } = authClient.useSession();
  if (data.position === "hide" || !data.isVisible) return null;
  const positionClass = data.position === "fixed" ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-40";
  return (
    <div
      className={`${positionClass} py-2`}
      style={{
        background: data.background,
        color: data.foreground,
        fontSize: data.fontSize === "sm" ? 12 : data.fontSize === "lg" ? 17 : 14,
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden px-4 md:px-6 ">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="w-max animate-[topbanner-marquee_var(--speed)_linear_infinite] whitespace-nowrap"
            style={
              {
                "--speed": `${data.speed}s`,
                animationDirection: data.direction === "right" ? "reverse" : "normal",
              } as React.CSSProperties
            }
          >
            {data.text} <span className="mx-8">•</span> {data.text}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {data.icons
            .filter((item) => item.visible)
            .map((item) => (
              <a
                aria-label={item.title}
                className="transition duration-700 hover:opacity-70"
                href={item.url}
                key={item.id}
                title={item.url}
              >
                <Icon name={item.icon ?? "Link"} />
              </a>
            ))}
          {data.buttonVisible !== false ? (
            <a
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-current/25 px-2.5 py-1 text-xs font-semibold transition duration-700 hover:bg-white/15"
              href={session ? "/dashboard" : "/login"}
            >
              <Icon name="LogIn" />
              {session ? "Dashboard" : "Login"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
