/*
|-----------------------------------------
| setting up TopBannerVisibility.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { usePathname } from "next/navigation";

export default function TopBannerVisibility({
  excludedPaths,
  children,
}: {
  excludedPaths?: unknown;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const paths = Array.isArray(excludedPaths)
    ? excludedPaths.filter((path): path is string => typeof path === "string")
    : [];
  if (paths.some((excludedPath) => excludedPath.trim() && pathname.startsWith(excludedPath.trim()))) return null;
  return children;
}
