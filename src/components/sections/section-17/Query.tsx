/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Link from "next/link";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";

import { Section17Data, Section17Payload, Section17Props, defaultDataSection17 } from "./data";

const QuerySection17 = ({ data }: Section17Props) => {
  let buttonData = defaultDataSection17;
  let paddingX = 0;
  let paddingY = 0;

  if (data && typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section17Payload> & Partial<Section17Data>;
      buttonData = { ...defaultDataSection17, ...parsed } as Section17Data;
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-17 data:", error);
    }
  } else if (data && typeof data === "object") {
    buttonData = { ...defaultDataSection17, ...data };
    if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
    if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
  }

  const getWidthClass = (width: string | undefined) => {
    switch (width) {
      case "full":
        return "w-full";
      case "fixed-sm":
        return "w-[120px]";
      case "fixed-md":
        return "w-[200px]";
      case "fixed-lg":
        return "w-[300px]";
      case "fixed-xl":
        return "w-[400px]";
      case "auto":
      default:
        return "w-auto";
    }
  };

  const renderIcon = () => {
    if (!buttonData.buttonIcon) return null;
    if (buttonData.buttonIcon === "doc-icon") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    const MappedIcon = iconMap ? iconMap[buttonData.buttonIcon] : null;

    if (MappedIcon) {
      return (
        <span className="flex h-4 w-4 items-center justify-center">
          <MappedIcon size={16} />
        </span>
      );
    }

    return (
      <span className="rounded-sm border border-current px-1 font-mono text-[10px]">
        {buttonData.buttonIcon.substring(0, 2).toUpperCase()}
      </span>
    );
  };

  const supportedVariant = ["default", "destructive", "outline", "secondary", "ghost", "link"].includes(
    buttonData.buttonVariant,
  )
    ? (buttonData.buttonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link")
    : "default";
  const supportedSize = ["default", "sm", "lg", "xs"].includes(buttonData.buttonSize)
    ? (buttonData.buttonSize as "default" | "sm" | "lg" | "xs")
    : "default";

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto flex min-h-32 w-full max-w-7xl items-center justify-center rounded-sm bg-white px-4 text-stone-800 custom-parent-border sm:px-8"
    >
      <Button
        nativeButton={false}
        variant={supportedVariant}
        size={supportedSize}
        className={cn("gap-3", getWidthClass(buttonData.buttonWidth))}
        render={
          <Link
            href={buttonData.buttonPath || "#"}
            target={buttonData.isNewTab ? "_blank" : undefined}
            rel={buttonData.isNewTab ? "noopener noreferrer" : undefined}
          >
            {renderIcon()}

            <span className="truncate">{buttonData.buttonName || "Click Here"}</span>

            {buttonData.isNewTab && (
              <svg className="w-3 h-3 opacity-70 ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            )}
          </Link>
        }
      />
    </div>
  );
};

export default QuerySection17;
