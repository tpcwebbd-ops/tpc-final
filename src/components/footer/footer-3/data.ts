/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

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
    { id: "uk", label: "United Kingdom", url: "/contact-us", visible: true },
    { id: "usa", label: "United States", url: "/contact-us", visible: true },
    { id: "canada", label: "Canada", url: "/contact-us", visible: true },
    { id: "australia", label: "Australia", url: "/contact-us", visible: true },
  ],
  services: [
    { id: "ielts", label: "IELTS Preparation", url: "/contact-us", visible: true },
    { id: "study-abroad", label: "Study Abroad Guidance", url: "/contact-us", visible: true },
    { id: "kids-spoken", label: "Kids Spoken English", url: "/contact-us", visible: true },
    { id: "consultation", label: "Online Consultation", url: "/contact-us", visible: true },
  ],
  phone: "01786558855",
  whatsappNumber: "01786558855",
  facebookUrl: "https://www.facebook.com/TestPrepCenter.BD/",
  facebookGroupUrl: "https://www.facebook.com/groups/tpckids",
  copyright: `All Rights Reserved © ${new Date().getFullYear()} - TestPrep Center`,
  legalLinks: [
    { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", visible: true },
    { id: "terms", label: "Terms & Conditions", url: "/terms-and-condition", visible: true },
    { id: "refund", label: "Refund Policy", url: "/refund-policy", visible: true },
    { id: "faq", label: "Frequently Asked Questions", url: "/frequently-ask-questions", visible: true },
  ],
  showLegalBar: true,
  legalBackground: "#000000",
};
