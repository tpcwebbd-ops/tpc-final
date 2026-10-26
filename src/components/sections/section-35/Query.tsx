/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import Link from "next/link";

import { defaultDataSection35, Section35Data, Section35Payload, Section35Props } from "./data";

const QuerySection35 = ({ data }: Section35Props) => {
  let settings: Section35Data = { ...defaultDataSection35 };
  let paddingX = 0;
  let paddingY = 0;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section35Payload>;
      settings = { ...defaultDataSection35, ...parsed } as Section35Data;
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch {}
  } else if (data) {
    settings = { ...defaultDataSection35, ...data } as Section35Data;
    paddingX = Math.max(0, Number((data as Partial<Section35Payload>).paddingX) || 0);
    paddingY = Math.max(0, Number((data as Partial<Section35Payload>).paddingY) || 0);
  }

  return (
    <main
      className="mx-auto w-full max-w-7xl custom-parent-border bg-white"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      {settings.link.startsWith("/") ? (
        <Link
          href={settings.link}
          className="block cursor-pointer select-none px-4 py-5 text-center text-lg font-extrabold tracking-wide text-white transition-opacity hover:opacity-95 sm:text-xl"
          style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})` }}
        >
          {settings.text}
        </Link>
      ) : (
        <a
          href={settings.link}
          className="block cursor-pointer select-none px-4 py-5 text-center text-lg font-extrabold tracking-wide text-white transition-opacity hover:opacity-95 sm:text-xl"
          style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})` }}
        >
          {settings.text}
        </a>
      )}
    </main>
  );
};

export default QuerySection35;
