/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { importPageRoutes } from "@/lib/defaults/import-data";

export type FooterThreeLink = { id: string; label: string; url: string; visible: boolean };
export type FooterThreeData = {
  variant: "footer-3";
  isVisible: boolean;
  forceUpdate: boolean;
  background: string;
  foreground: string;
  accent: string;
  logoUrl: string;
  logoAlt: string;
  showLogo: boolean;
  brand: string;
  description: string;
  disabledPaths: string[];
  destinations: FooterThreeLink[];
  services: FooterThreeLink[];
  phone: string;
  whatsappNumber: string;
  facebookUrl: string;
  facebookGroupUrl: string;
  copyright: string;
  legalLinks: FooterThreeLink[];
  showLegalBar: boolean;
  legalBackground: string;
};

export const defaultData: FooterThreeData = {
  variant: "footer-3",
  isVisible: true,
  forceUpdate: true,
  background: "#ffffff",
  foreground: "#1c1917",
  accent: "#dc2626",
  logoUrl: "/Logo.png",
  logoAlt: "TestPrep Center logo",
  showLogo: true,
  brand: "TestPrep Center",
  description:
    "Your online partner for IELTS preparation, study-abroad guidance, and kids' spoken English in Bangladesh.",
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  destinations: [
    { id: "uk", label: "United Kingdom", url: importPageRoutes.contact.path, visible: true },
    { id: "usa", label: "United States", url: importPageRoutes.contact.path, visible: true },
    { id: "canada", label: "Canada", url: importPageRoutes.contact.path, visible: true },
    { id: "australia", label: "Australia", url: importPageRoutes.contact.path, visible: true },
  ],
  services: [
    { id: "ielts", label: "IELTS Preparation", url: importPageRoutes.ielts.path, visible: true },
    { id: "kids-spoken", label: "Kids Spoken English", url: importPageRoutes.kidsSpokenEnglish.path, visible: true },
    { id: "consultation", label: "Online Consultation", url: importPageRoutes.contact.path, visible: true },
  ],
  phone: "01786558855",
  whatsappNumber: "01786558855",
  facebookUrl: "https://www.facebook.com/TestPrepCenter.BD/",
  facebookGroupUrl: "https://www.facebook.com/groups/tpckids",
  copyright: `All Rights Reserved © ${new Date().getFullYear()} - TestPrep Center`,
  legalLinks: [
    { id: "privacy", label: "Privacy Policy", url: importPageRoutes.privacy.path, visible: true },
    { id: "terms", label: "Terms & Conditions", url: importPageRoutes.terms.path, visible: true },
    { id: "refund", label: "Refund Policy", url: importPageRoutes.refund.path, visible: true },
    { id: "faq", label: "Frequently Asked Questions", url: importPageRoutes.faq.path, visible: true },
  ],
  showLegalBar: true,
  legalBackground: "#000000",
};
