/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

export type FooterLink = { id: string; label: string; url: string; visible: boolean };
export type FooterOneData = {
  variant: "footer-1";
  isVisible: boolean;
  forceUpdate: boolean;
  background: string;
  foreground: string;
  accent: string;
  brand: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  showLogo: boolean;
  showContact: boolean;
  disabledPaths: string[];
  columns: { title: string; links: FooterLink[] }[];
  phone: string;
  whatsappNumber: string;
  facebookUrl: string;
  facebookGroupUrl: string;
  copyright: string;
  showLegalBar: boolean;
  legalBackground: string;
  legalLinks: FooterLink[];
};

export const defaultData: FooterOneData = {
  variant: "footer-1",
  isVisible: true,
  forceUpdate: true,
  background: "#ffffff",
  foreground: "#292524",
  accent: "#111827",
  brand: "TestPrep Center",
  description:
    "Bangladesh's online learning platform for IELTS preparation, study-abroad guidance, and kids' spoken English.",
  logoUrl: "/Logo.png",
  logoAlt: "TestPrep Center logo",
  showLogo: true,
  showContact: true,
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  phone: "01786558855",
  whatsappNumber: "01786558855",
  facebookUrl: "https://www.facebook.com/TestPrepCenter.BD/",
  facebookGroupUrl: "https://www.facebook.com/groups/tpckids",
  copyright: `All Rights Reserved © ${new Date().getFullYear()} - TestPrep Center`,
  showLegalBar: true,
  legalBackground: "#fffaf0",
  legalLinks: [
    { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", visible: true },
    { id: "terms", label: "Terms & Conditions", url: "/terms-and-condition", visible: true },
    { id: "refund", label: "Refund Policy", url: "/refund-policy", visible: true },
    { id: "faq", label: "Frequently Asked Questions", url: "/frequently-ask-questions", visible: true },
  ],
  columns: [
    {
      title: "Explore",
      links: [
        { id: "home", label: "Home", url: "/", visible: true },
        { id: "about", label: "About TPC", url: "/about-us", visible: true },
        { id: "contact", label: "Contact", url: "/contact-us", visible: true },
      ],
    },
    {
      title: "Programs",
      links: [
        { id: "ielts", label: "IELTS Preparation", url: "/contact-us", visible: true },
        { id: "study-abroad", label: "Study Abroad Guidance", url: "/contact-us", visible: true },
        { id: "kids-spoken", label: "Kids Spoken English", url: "/contact-us", visible: true },
      ],
    },
  ],
};
