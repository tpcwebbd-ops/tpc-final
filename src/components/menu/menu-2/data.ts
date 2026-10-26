/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import type { MenuData } from "../menu-1/data";

export const defaultData: MenuData = {
  variant: "menu-2",
  isVisible: false,
  brand: "NexaMart",
  logoUrl: "/Logo.png",
  logoAlt: "NexaMart logo",
  showLogo: true,
  showBrand: true,
  brandColor: "#b45309",
  brandFontFamily: "Arial",
  brandFontSize: 16,
  logoPositionX: 0,
  logoPositionY: 0,
  logoDesktopPaddingX: 0,
  logoDesktopPaddingY: 0,
  logoDesktopMarginX: 0,
  logoDesktopMarginY: 0,
  logoMobilePaddingX: 0,
  logoMobilePaddingY: 0,
  logoMobileMarginX: 0,
  logoMobileMarginY: 0,
  logoAspect: "full",
  background: "#ffffff",
  foreground: "#44403c",
  accent: "#b45309",
  position: "sticky",
  transparency: 100,
  fontSize: 14,
  fontFamily: "Arial",
  links: [
    { id: "home", label: "Home", url: "/", visible: true, position: 0 },
    {
      id: "services",
      label: "Services",
      url: "/services",
      visible: true,
      position: 1,
      children: [
        {
          id: "web-development",
          label: "Web Development",
          url: "/services/web-development",
          visible: true,
          position: 0,
          children: [
            {
              id: "nextjs-development",
              label: "Next.js Development",
              url: "/services/web-development/nextjs",
              visible: true,
              position: 0,
            },
          ],
        },
      ],
    },
    { id: "dashboard", label: "Dashboard", url: "/dashboard", visible: true, position: 3 },
  ],
  button: {
    type: "dashboard",
    label: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
    background: "#fef3c7",
    foreground: "#92400e",
    transparency: 100,
    paddingX: 14,
    paddingY: 8,
    mobilePaddingX: 14,
    mobilePaddingY: 8,
    mobileMarginX: 0,
    mobileMarginY: 0,
    desktopPaddingX: 14,
    desktopPaddingY: 8,
    desktopMarginX: 0,
    desktopMarginY: 0,
    radius: "full",
  },
  mobile: { enabled: false, layout: "grid-2-2", links: [] },
};
