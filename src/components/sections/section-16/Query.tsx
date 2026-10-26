/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Link from "next/link";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { Section16Payload, Section16Props, defaultDataSection16 } from "./data";

const QuerySection16 = ({ data }: Section16Props) => {
  let buttonData = defaultDataSection16;
  let paddingX = 0;
  let paddingY = 0;

  if (data && typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section16Payload> & Partial<typeof defaultDataSection16>;
      buttonData = { ...defaultDataSection16, ...parsed };
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (e) {
      console.error("Error parsing button data:", e);
    }
  } else if (data && typeof data === "object") {
    if ("paddingX" in data) {
      buttonData = { ...defaultDataSection16, ...data };
      paddingX = Math.max(0, Number(data.paddingX) || 0);
      paddingY = Math.max(0, Number(data.paddingY) || 0);
    } else {
      buttonData = { ...defaultDataSection16, ...data };
    }
  }

  const IconComponent = buttonData.buttonIcon ? iconMap[buttonData.buttonIcon] : null;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto flex w-full max-w-7xl items-center justify-center rounded-sm bg-white custom-parent-border"
    >
      <Link
        href={buttonData.buttonPath || "#"}
        target={buttonData.isNewTab ? "_blank" : undefined}
        rel={buttonData.isNewTab ? "noopener noreferrer" : undefined}
        className="group relative inline-flex items-center gap-3 rounded-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {IconComponent && (
          <span className="flex items-center justify-center bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
            <IconComponent size={18} strokeWidth={2} />
          </span>
        )}

        <span>{buttonData.buttonName || "Click Here"}</span>

        {buttonData.isNewTab && (
          <svg
            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </Link>
    </div>
  );
};

export default QuerySection16;
