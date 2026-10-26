/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import type { TopBannerThreeData } from "./data";

export default function Query({ data }: { data: TopBannerThreeData }) {
  if (data.position === "hide" || !data.isVisible) return null;
  const positionClass = data.position === "fixed" ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-40";

  return (
    <div className={`${positionClass} py-1`} style={{ backgroundColor: data.background }}>
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 md:px-6 text-center sm:gap-x-4">
        <span className="text-xs font-bold sm:text-sm" style={{ color: data.foreground }}>
          {data.text}
        </span>
        {data.buttonVisible !== false ? (
          <a
            className="rounded-md bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-blue-950 transition duration-700 hover:bg-yellow-300"
            href={data.ctaUrl}
          >
            {data.ctaLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
