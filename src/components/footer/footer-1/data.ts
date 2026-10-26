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
  email: string;
  phone: string;
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
  description: "TestPrep Center is a flexible website for sharing information, updates, and resources.",
  logoUrl: "/Logo.png",
  logoAlt: "TestPrep Center logo",
  showLogo: true,
  showContact: true,
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  email: "example@gmail.com",
  phone: "01711 221122",
  copyright: `All Rights Reserved © ${new Date().getFullYear()} - TestPrep Center `,
  showLegalBar: true,
  legalBackground: "#fffaf0",
  legalLinks: [
    { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", visible: true },
    { id: "terms", label: "Terms & Conditions", url: "/terms-and-condition", visible: true },
    { id: "refund", label: "Refund Policy", url: "/refund-policy", visible: true },
    { id: "faq", label: "Frequently Ask Questions", url: "/frequently-ask-questions", visible: true },
  ],
  columns: [
    {
      title: "Explore",
      links: [
        { id: "home", label: "Home", url: "/", visible: true },
        { id: "dashboard", label: "Dashboard", url: "/dashboard", visible: true },
      ],
    },
    {
      title: "Account",
      links: [
        { id: "login", label: "Login", url: "/login", visible: true },
        { id: "registration", label: "Registration", url: "/registration", visible: true },
      ],
    },
  ],
};
