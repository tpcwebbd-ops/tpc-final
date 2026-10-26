/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { importPageRoutes } from "@/lib/defaults/import-data";

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
  text: "Start learning online with IELTS preparation, study-abroad guidance, and TPC Kids Spoken English.",
  ctaLabel: "Book a Free Consultation",
  ctaUrl: importPageRoutes.contact.path,
  buttonVisible: true,
  background: "#2563eb",
  foreground: "#fde047",
  position: "sticky",
  excludedPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
};
