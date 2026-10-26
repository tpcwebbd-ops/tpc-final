/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { defaultDataSection2, type Section2Data } from "./data";

export default function Query({ data = defaultDataSection2 }: { data?: Section2Data }) {
  const paddingX = Math.max(0, Math.min(300, Number(data.paddingX) || 0));
  const paddingY = Math.max(0, Math.min(300, Number(data.paddingY) || 0));

  return (
    <section
      className="custom-parent-border mx-auto w-full max-w-7xl bg-white text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <h2 className="truncate text-xl font-bold text-stone-900" title={data.heading}>
        {data.heading}
      </h2>
      <p className="mt-2 text-stone-600" title={data.description}>
        {data.description}
      </p>
    </section>
  );
}
