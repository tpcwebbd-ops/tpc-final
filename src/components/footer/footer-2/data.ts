/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
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
  tagline: "আধুনিক অনলাইন শপিং, সহজ ও নিরাপদ",
  description:
    "NexaMart একটি আধুনিক অনলাইন শপিং প্ল্যাটফর্ম, যেখানে সহজে পণ্য খোঁজা, অর্ডার করা ও নিরাপদে কেনাকাটার সুবিধা রয়েছে।",
  logoUrl: "/Logo.png",
  logoAlt: "NexaMart logo",
  showLogo: true,
  email: "example@gmail.com",
  phone: "01711 221122",
  disabledPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  columns: [
    {
      title: "Shop categories",
      links: [
        {
          id: "smartphones-tablets",
          label: "Smartphones & Tablets",
          url: "/products?category=smartphones-tablets",
          visible: true,
        },
        {
          id: "laptops-computers",
          label: "Laptops & Computers",
          url: "/products?category=laptops-computers",
          visible: true,
        },
        {
          id: "audio-headphones",
          label: "Audio & Headphones",
          url: "/products?category=audio-headphones",
          visible: true,
        },
        { id: "gaming-gear", label: "Gaming Gear", url: "/products?category=gaming-gear", visible: true },
      ],
    },
    {
      title: "Customer care",
      links: [
        { id: "track-order", label: "Track your order", url: "/orders", visible: true },
        { id: "shipping", label: "Shipping & delivery", url: "/shipping-policy", visible: true },
        { id: "returns", label: "Returns & refunds", url: "/refund-policy", visible: true },
        { id: "warranty", label: "Warranty information", url: "/warranty", visible: true },
        { id: "contact", label: "Contact support", url: "/contact", visible: true },
      ],
    },
  ],
  links: [
    { id: "shop-all", label: "Shop all", url: "/products", visible: true },
    { id: "new-arrivals", label: "New arrivals", url: "/products?sort=newest", visible: true },
    { id: "deals", label: "Deals", url: "/products?collection=deals", visible: true },
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
