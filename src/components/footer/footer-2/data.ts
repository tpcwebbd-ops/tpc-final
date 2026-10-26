/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October 2026
|-----------------------------------------
*/

export type FooterTwoData = {
  variant: "footer-2";
  isVisible: boolean;
  forceUpdate: boolean;
  background: string;
  foreground: string;
  accent: string;
  brand: string;
  tagline: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  showLogo: boolean;
  email: string;
  phone: string;
  disabledPaths: string[];
  columns: { title: string; links: { id: string; label: string; url: string; visible: boolean }[] }[];
  links: { id: string; label: string; url: string; visible: boolean }[];
  copyright: string;
  showLegalBar: boolean;
  legalBackground: string;
  legalLinks: { id: string; label: string; url: string; visible: boolean }[];
};

export const defaultData: FooterTwoData = {
  variant: "footer-2",
  isVisible: true,
  forceUpdate: true,
  background: "#ffffff",
  foreground: "#292524",
  accent: "#b45309",
  brand: "NexaMart",
  tagline: "A clear, welcoming place to learn about our work.",
  description: "NexaMart is a flexible website for sharing information, updates, and resources.",
  logoUrl: "/Logo.png",
  logoAlt: "NexaMart logo",
  showLogo: true,
  email: "example@gmail.com",
  phone: "01711 221122",
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  columns: [
    {
      title: "Explore",
      links: [
        { id: "home", label: "Home", url: "/", visible: true },
        { id: "about", label: "About us", url: "/about-us", visible: true },
        { id: "contact", label: "Contact", url: "/contact-us", visible: true },
      ],
    },
    {
      title: "Resources",
      links: [
        { id: "team", label: "Team", url: "/team-member", visible: true },
        { id: "faq", label: "Frequently asked questions", url: "/frequently-ask-questions", visible: true },
      ],
    },
  ],
  links: [
    { id: "contact", label: "Contact", url: "/contact-us", visible: true },
    { id: "privacy", label: "Privacy", url: "/privacy-policy", visible: true },
  ],
  copyright: `© ${new Date().getFullYear()} NexaMart. All rights reserved.`,
  showLegalBar: true,
  legalBackground: "#f8fafc",
  legalLinks: [
    { id: "refund", label: "Refund Policy", url: "/refund-policy", visible: true },
    { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", visible: true },
    { id: "terms", label: "Terms & Conditions", url: "/terms-and-condition", visible: true },
    { id: "security", label: "Security", url: "/", visible: true },
    { id: "cookies", label: "Cookie Policy", url: "/", visible: true },
  ],
};
