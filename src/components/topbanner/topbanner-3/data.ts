/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

export type TopBannerThreeData = {
  variant: "topbanner-3";
  isVisible: boolean;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
  /** Omitted legacy values remain visible. */
  buttonVisible?: boolean;
  background: string;
  foreground: string;
  position: "fixed" | "sticky" | "hide";
  excludedPaths: string[];
};

export const defaultData: TopBannerThreeData = {
  variant: "topbanner-3",
  isVisible: true,
  text: "Buy All - Lifetime Access - ৳9950 Only",
  ctaLabel: "Get Offer",
  ctaUrl: "/pricing",
  buttonVisible: true,
  background: "#2563eb",
  foreground: "#fde047",
  position: "sticky",
  excludedPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
};
