/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

export type TopBannerTwoIcon = { id: string; title: string; icon: string; url: string; visible: boolean };
export type TopBannerTwoData = {
  variant: "topbanner-2";
  isVisible: boolean;
  text: string;
  direction: "left" | "right";
  speed: number;
  background: string;
  foreground: string;
  fontSize: "sm" | "base" | "lg";
  icons: TopBannerTwoIcon[];
  authLabel: string;
  /** Omitted legacy values remain visible. */
  buttonVisible?: boolean;
  position: "fixed" | "sticky" | "hide";
  excludedPaths: string[];
};

export const defaultData: TopBannerTwoData = {
  variant: "topbanner-2",
  isVisible: true,
  text: "Learn IELTS, plan your study abroad journey, and build kids' spoken English skills online with TestPrep Center (TPC).",
  direction: "left",
  speed: 18,
  background: "#78350f",
  foreground: "#fff7ed",
  fontSize: "base",
  icons: [
    {
      id: "facebook",
      title: "Facebook",
      icon: "CiFacebook",
      url: "https://www.facebook.com/TestPrepCenter.BD/",
      visible: true,
    },
    {
      id: "facebook-group",
      title: "TPC Kids Facebook Group",
      icon: "CiFacebook",
      url: "https://www.facebook.com/groups/tpckids",
      visible: true,
    },
    { id: "whatsapp", title: "WhatsApp", icon: "FaWhatsapp", url: "https://wa.me/8801786558855", visible: true },
    { id: "call", title: "Call", icon: "Phone", url: "tel:+8801786558855", visible: true },
  ],
  authLabel: "Login / Dashboard",
  buttonVisible: true,
  position: "sticky",
  excludedPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
};
