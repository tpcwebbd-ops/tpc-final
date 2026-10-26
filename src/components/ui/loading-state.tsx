/*
|-----------------------------------------
| setting up loading-state.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import Image from "next/image";

export function LoadingState({ label = "Loading", overlay = false }: { label?: string; overlay?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={
        overlay
          ? "fixed inset-0 z-[80] grid place-items-center bg-[#fffaf0]/70 p-4 backdrop-blur-sm"
          : "grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-6"
      }
      role="status"
    >
      <div className="grid min-w-64 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white px-8 py-7 text-center shadow-[0_24px_70px_-38px_rgba(120,53,15,.58)]">
        <div aria-hidden="true" className="relative grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 rounded-full border border-amber-200/80 animate-[loading-orbit_2.2s_linear_infinite]" />
          <span className="absolute inset-2 rounded-full border-2 border-transparent border-t-amber-500 border-r-amber-300 animate-[loading-orbit_1.35s_linear_infinite_reverse]" />
          <span className="absolute h-11 w-11 rounded-full bg-white shadow-[0_0_26px_rgba(245,158,11,.35)] animate-[loading-core_1.5s_ease-in-out_infinite]" />
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full">
            <Image alt="NexaMart" className="h-9 w-9 object-contain" height={36} priority src="/Logo.png" width={36} />
          </span>
        </div>
        <p className="mt-4 text-sm font-semibold text-stone-800">{label}</p>
        <div className="mt-3 h-1 w-36 overflow-hidden rounded-full bg-amber-100">
          <span className="block h-full w-1/2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-[loading-trail_1.2s_ease-in-out_infinite]" />
        </div>
        <span className="mt-2 text-xs text-stone-500">Preparing something good…</span>
      </div>
    </div>
  );
}
