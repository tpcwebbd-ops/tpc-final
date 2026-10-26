/*
|-----------------------------------------
| setting up WhatsAppButtonVisibility.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/
"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppButtonVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
