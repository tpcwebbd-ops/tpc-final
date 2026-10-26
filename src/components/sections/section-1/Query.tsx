/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August, 2026
|-----------------------------------------
*/

"use client";

import { defaultDataSection1, type Section1Data } from "./data";
import { RichTextPreview } from "./RichTextEditor";

export default function Query({ data = defaultDataSection1 }: { data?: Section1Data }) {
  const paddingX = Math.max(0, Math.min(300, Number(data.paddingX) || 0));
  const paddingY = Math.max(0, Math.min(300, Number(data.paddingY) || 0));

  return (
    <section
      className="custom-parent-border mx-auto w-full max-w-7xl bg-white text-slate-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <RichTextPreview value={data.content ?? ""} />
    </section>
  );
}
