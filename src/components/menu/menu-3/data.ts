/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import type { MenuData } from "../menu-1/data";

export const defaultData: MenuData = {
  variant: "menu-3",
  isVisible: false,
  brand: "NexaMart",
  logoUrl: "/Logo.png",
  logoAlt: "NexaMart logo",
  showLogo: true,
  showBrand: true,
  brandColor: "#b45309",
  brandFontFamily: "inherit",
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
    { id: "dashboard", label: "Dashboard", url: "/dashboard", visible: true, position: 2 },
    { id: "contact", label: "Contact", url: "/contact", visible: true, position: 3 },
  ],
  background: "#ffffff",
  foreground: "#334155",
  accent: "#fbbf24",
  position: "sticky",
  transparency: 100,
  fontSize: 14,
  fontFamily: "inherit",
  button: {
    type: "custom",
    label: "Get started",
    url: "/registration",
    icon: "ArrowRight",
    background: "#fbbf24",
    foreground: "#1c1917",
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
  // menu-3-specific values demonstrate the mixed JSON contract.
  layout: { container: "wide", linkStyle: "pill" },
};
