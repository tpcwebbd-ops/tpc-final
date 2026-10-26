/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

export type TopBannerIcon = {
  id: string;
  label: string;
  icon: string;
  url: string;
  message: string;
  visible: boolean;
};

export type TopBannerOneData = {
  variant: "topbanner-1";
  isVisible: boolean;
  background: string;
  foreground: string;
  icons: TopBannerIcon[];
  authLabel: string;
  /** Omitted legacy values remain visible. */
  buttonVisible?: boolean;
  position: "fixed" | "sticky" | "hide";
  excludedPaths: string[];
};

export const defaultData: TopBannerOneData = {
  variant: "topbanner-1",
  isVisible: true,
  background: "#fff7e6",
  foreground: "#713f12",
  authLabel: "Login / Dashboard",
  buttonVisible: true,
  position: "sticky",
  excludedPaths: ["/dashboard", "/login", "/forgot-password", "/registration"],
  icons: [
    {
      id: "facebook",
      label: "Facebook",
      icon: "CiFacebook",
      url: "https://www.facebook.com/TestPrepCenter.BD/",
      message: "Follow us on Facebook",
      visible: true,
    },
    {
      id: "facebook-group",
      label: "TPC Kids Facebook Group",
      icon: "CiFacebook",
      url: "https://www.facebook.com/groups/tpckids",
      message: "Join the TPC Kids Facebook Group",
      visible: true,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: "FaWhatsapp",
      url: "https://wa.me/8801786558855",
      message: "Chat on WhatsApp",
      visible: true,
    },
    {
      id: "call",
      label: "Call",
      icon: "Phone",
      url: "tel:+8801786558855",
      message: "Call TestPrep Center",
      visible: true,
    },
  ],
};
