/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import { defaultDataSection33, Section33Data, Section33Payload, Section33Props } from "./data";

const QuerySection33 = ({ data }: Section33Props) => {
  let settings: Section33Data = { ...defaultDataSection33 };
  let paddingX = 0;
  let paddingY = 0;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section33Payload>;
      settings = { ...defaultDataSection33, ...parsed, showEyebrow: parsed.showEyebrow !== false } as Section33Data;
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-33 data:", error);
    }
  } else if (data) {
    settings = {
      ...defaultDataSection33,
      ...data,
      showEyebrow: (data as Partial<Section33Data>).showEyebrow !== false,
    } as Section33Data;
    paddingX = Math.max(0, Number((data as Partial<Section33Payload>).paddingX) || 0);
    paddingY = Math.max(0, Number((data as Partial<Section33Payload>).paddingY) || 0);
  }

  return (
    <main
      className="mx-auto w-full max-w-7xl custom-parent-border"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center sm:py-20">
          <div className="animate-fadeUp">
            {settings.showEyebrow && settings.badgeText && (
              <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
                {settings.badgeText}
              </span>
            )}
            <h1 className="mb-4 text-3xl font-black leading-tight sm:text-5xl">
              {settings.titleLine1}
              <br />
              {settings.titleLine2}
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-blue-100 sm:text-lg">{settings.subtitle}</p>
          </div>
          <div className="animate-fadeUp mb-8 flex flex-wrap justify-center gap-8">
            {settings.stats.map((item) => (
              <div key={item.id} className="text-center">
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-0.5 text-xs text-blue-200">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="animate-fadeUp flex flex-wrap justify-center gap-2.5">
            {settings.features.map((item) => (
              <span
                key={item.id}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white"
              >
                <i className={`ti ${item.icon} text-sm`} /> {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-gray-50">
          <svg
            viewBox="0 0 1440 56"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block h-8 w-full sm:h-14"
          >
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>
    </main>
  );
};

export default QuerySection33;
