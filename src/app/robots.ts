/*
|-----------------------------------------
| setting up robots.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

import type { MetadataRoute } from "next";

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";

export default function robots(): MetadataRoute.Robots {
  const canonicalAppUrl = getCanonicalAppUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/tools/",
        "/login",
        "/login-demo",
        "/registration",
        "/forgot-password",
        "/order-tracking",
        "/search",
        "/products/",
      ],
    },
    sitemap: new URL("/sitemap.xml", canonicalAppUrl).toString(),
    host: canonicalAppUrl.origin,
  };
}
