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
  email: string;
  phone: string;
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
  logoAlt: "NexaMart logo",
  showLogo: true,
  brand: "NexaMart",
  description:
    "NexaMart একটি আধুনিক অনলাইন শপিং প্ল্যাটফর্ম, যেখানে সহজে পণ্য খোঁজা, অর্ডার করা ও নিরাপদে কেনাকাটার সুবিধা রয়েছে।",
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  destinations: [
    { id: "uk", label: "UK", url: "/destinations/uk", visible: true },
    { id: "usa", label: "USA", url: "/destinations/usa", visible: true },
    { id: "canada", label: "Canada", url: "/destinations/canada", visible: true },
    { id: "australia", label: "Australia", url: "/destinations/australia", visible: true },
  ],
  services: [
    { id: "consultation", label: "Consultation", url: "/consultation", visible: true },
    { id: "admission", label: "Admission", url: "/admission", visible: true },
    { id: "scholarship", label: "Scholarship", url: "/scholarship", visible: true },
    { id: "visa", label: "Visa guidance", url: "/visa-guidance", visible: true },
  ],
  email: "example@gmail.com",
  phone: "01711 221122",
  copyright: `All Rights Reserved © ${new Date().getFullYear()} - NexaMart `,
  legalLinks: [
    { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", visible: true },
    { id: "terms", label: "Terms & Conditions", url: "/terms-and-condition", visible: true },
    { id: "refund", label: "Refund Policy", url: "/refund-policy", visible: true },
    { id: "faq", label: "Frequently Ask Questions", url: "/frequently-ask-questions", visible: true },
  ],
  showLegalBar: true,
  legalBackground: "#000000",
};
