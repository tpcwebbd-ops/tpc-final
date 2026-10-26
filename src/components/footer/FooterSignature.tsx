/*
|-----------------------------------------
| setting up FooterSignature for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

"use client";

import { usePathname } from "next/navigation";

const FooterSignature = () => {
  const pathname = usePathname();
  const shouldHide =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/login" ||
    pathname === "/registration" ||
    pathname === "/forgot-password";

  if (shouldHide) return null;

  return (
    <div className="w-full border-t border-slate-200 bg-white py-3 text-xs text-slate-600 sm:px-6">
      <div className="flex mx-auto max-w-7xl px-4 md:px-6">
        Design and Develop by
        <a
          className="px-2 font-bold underline transition duration-700 hover:text-amber-700"
          target="_blank"
          href="https://tecbuzz.bd/"
        >
          TecBuzz
        </a>
      </div>
    </div>
  );
};
export default FooterSignature;
