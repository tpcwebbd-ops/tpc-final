import type { NextConfig } from "next";

const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Next.js embeds hydration/Flight scripts in static HTML. Report them first;
  // do not add a nonce that would force per-request rendering and hurt CDN caching.
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ibb.co https://images.unsplash.com https://i.pravatar.cc https://placehold.co https://upload.wikimedia.org https://flagcdn.com https://*.ufs.sh https://*.utfs.io https://uploadthing.com https://*.uploadthing.com https://*.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://uploadthing.com https://api.uploadthing.com https://*.uploadthing.com https://*.ufs.sh https://*.utfs.io",
  "media-src 'self' blob: https://i.ibb.co https://*.ufs.sh https://*.utfs.io https://uploadthing.com https://*.uploadthing.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://maps.google.com https://www.google.com",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/a/**" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "**.utfs.io" },
      { protocol: "https", hostname: "**.uploadthing.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicyReportOnly }]
            : []),
        ],
      },
      {
        source: "/service-worker.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
