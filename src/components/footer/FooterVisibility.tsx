/*
|-----------------------------------------
| setting up FooterVisibility.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { usePathname } from "next/navigation";

export default function FooterVisibility({
  disabledPaths,
  children,
}: {
  disabledPaths: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (disabledPaths.some((path) => path.trim() && pathname.startsWith(path.trim()))) return null;
  return children;
}
