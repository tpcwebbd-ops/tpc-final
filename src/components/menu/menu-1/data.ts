/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

export type MenuLink = {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  position?: number;
  children?: MenuLink[];
  icon?: string;
  showIcon?: boolean;
  imageUrl?: string;
  showImage?: boolean;
  imageSize?: number;
  imageCrop?: "1:1" | "16:9" | "full";
  imageRadius?: "none" | "xs" | "sm" | "md" | "xl" | "2xl" | "full";
};

export type MenuButton = {
  /** Omitted legacy values remain visible. */
  visible?: boolean;
  type: "login" | "dashboard" | "continue" | "contact" | "custom";
  label: string;
  url: string;
  icon?: string;
  showIcon?: boolean;
  background: string;
  foreground: string;
  transparentBackground?: boolean;
  transparency: number;
  paddingX: number;
  paddingY: number;
  marginX?: number;
  marginY?: number;
  mobilePaddingX?: number;
  mobilePaddingY?: number;
  mobileMarginX?: number;
  mobileMarginY?: number;
  desktopPaddingX?: number;
  desktopPaddingY?: number;
  desktopMarginX?: number;
  desktopMarginY?: number;
  border?: "none" | "xs" | "sm" | "md" | "xl";
  radius: "none" | "xs" | "sm" | "md" | "xl" | "2xl" | "full";
};

export type MobileMenu = {
  enabled: boolean;
  layout: "grid-2-2" | "grid-2-3" | "grid-3-2" | "grid-3-3" | "flex";
  flexItems?: 2 | 3 | 4 | 5 | 6;
  flexTextAlign?: "left" | "center" | "right";
  links: MenuLink[];
};

export type MenuData = {
  variant: "menu-1" | "menu-2" | "menu-3";
  isVisible: boolean;
  brand: string;
  logoUrl: string;
  logoAlt: string;
  showLogo: boolean;
  showBrand: boolean;
  brandColor: string;
  brandFontFamily: string;
  brandFontSize: number;
  logoPositionX: number;
  logoPositionY: number;
  /** Desktop logo spacing. Legacy values are retained for saved menus. */
  logoDesktopPaddingX?: number;
  logoDesktopPaddingY?: number;
  logoDesktopMarginX?: number;
  logoDesktopMarginY?: number;
  /** Mobile logo spacing, applied below the md breakpoint. */
  logoMobilePaddingX?: number;
  logoMobilePaddingY?: number;
  logoMobileMarginX?: number;
  logoMobileMarginY?: number;
  logoPaddingX?: number;
  logoPaddingY?: number;
  logoMarginX?: number;
  logoMarginY?: number;
  logoZoom?: number;
  logoAspect?: "19:6" | "1:1" | "16:9" | "full" | "custom";
  logoCrop?: { left: number; right: number; top: number; bottom: number };
  links: MenuLink[];
  background: string;
  foreground: string;
  accent: string;
  position: "fixed" | "sticky" | "scroll";
  transparency: number;
  fontSize: number;
  fontFamily: string;
  button: MenuButton;
  mobile: MobileMenu;
  // Each design may persist its own style/data fields without a migration.
  [key: string]: unknown;
};

export const defaultData: MenuData = {
  variant: "menu-1",
  isVisible: true,
  brand: "NexaMart",
  logoUrl: "/Logo.png",
  logoAlt: "NexaMart logo",
  showLogo: true,
  showBrand: true,
  brandColor: "#1c1917",
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
  logoZoom: 100,
  logoAspect: "full",
  links: [
    { id: "home", label: "Home", url: "/", visible: true, position: 0, icon: "Home", showIcon: true },
    {
      id: "shop",
      label: "Shop categories",
      url: "/products",
      visible: true,
      position: 1,
      children: [
        {
          id: "smartphones-tablets",
          label: "Smartphones & Tablets",
          url: "/products?category=smartphones-tablets",
          visible: true,
          position: 0,
        },
        {
          id: "laptops-computers",
          label: "Laptops & Computers",
          url: "/products?category=laptops-computers",
          visible: true,
          position: 1,
        },
        {
          id: "audio-headphones",
          label: "Audio & Headphones",
          url: "/products?category=audio-headphones",
          visible: true,
          position: 2,
        },
        {
          id: "wearables-smartwatches",
          label: "Wearables & Smartwatches",
          url: "/products?category=wearables-smartwatches",
          visible: true,
          position: 3,
        },
        {
          id: "cameras-drones",
          label: "Cameras & Drones",
          url: "/products?category=cameras-drones",
          visible: true,
          position: 4,
        },
        { id: "gaming-gear", label: "Gaming Gear", url: "/products?category=gaming-gear", visible: true, position: 5 },
        { id: "smart-home", label: "Smart Home", url: "/products?category=smart-home", visible: true, position: 6 },
        {
          id: "chargers-accessories",
          label: "Chargers & Accessories",
          url: "/products?category=chargers-accessories",
          visible: true,
          position: 7,
        },
      ],
    },
    { id: "new-arrivals", label: "New arrivals", url: "/products?sort=newest", visible: true, position: 2 },
    { id: "deals", label: "Deals", url: "/products?collection=deals", visible: true, position: 3 },
    { id: "track-order", label: "Track order", url: "/orders", visible: true, position: 4 },
  ],
  background: "#ffffff",
  foreground: "#292524",
  accent: "#b45309",
  position: "sticky",
  transparency: 95,
  fontSize: 15,
  fontFamily: "inherit",
  button: {
    visible: true,
    type: "dashboard",
    label: "Account",
    url: "/login",
    icon: "LogIn",
    showIcon: true,
    background: "#1c1917",
    foreground: "#ffffff",
    transparency: 100,
    transparentBackground: false,
    paddingX: 12,
    paddingY: 8,
    marginX: 0,
    marginY: 0,
    mobilePaddingX: 12,
    mobilePaddingY: 8,
    mobileMarginX: 0,
    mobileMarginY: 0,
    desktopPaddingX: 12,
    desktopPaddingY: 8,
    desktopMarginX: 0,
    desktopMarginY: 0,
    border: "xs",
    radius: "sm",
  },
  mobile: {
    enabled: true,
    layout: "grid-2-2",
    flexItems: 4,
    flexTextAlign: "center",
    links: [
      { id: "home", label: "Home", url: "/", visible: true, position: 0, icon: "Home", showIcon: true },
      {
        id: "shop",
        label: "Shop categories",
        url: "/products",
        visible: true,
        position: 1,
        children: [
          {
            id: "smartphones-tablets",
            label: "Smartphones & Tablets",
            url: "/products?category=smartphones-tablets",
            visible: true,
            position: 0,
          },
          {
            id: "laptops-computers",
            label: "Laptops & Computers",
            url: "/products?category=laptops-computers",
            visible: true,
            position: 1,
          },
          {
            id: "audio-headphones",
            label: "Audio & Headphones",
            url: "/products?category=audio-headphones",
            visible: true,
            position: 2,
          },
          {
            id: "wearables-smartwatches",
            label: "Wearables & Smartwatches",
            url: "/products?category=wearables-smartwatches",
            visible: true,
            position: 3,
          },
          {
            id: "cameras-drones",
            label: "Cameras & Drones",
            url: "/products?category=cameras-drones",
            visible: true,
            position: 4,
          },
          {
            id: "gaming-gear",
            label: "Gaming Gear",
            url: "/products?category=gaming-gear",
            visible: true,
            position: 5,
          },
          { id: "smart-home", label: "Smart Home", url: "/products?category=smart-home", visible: true, position: 6 },
          {
            id: "chargers-accessories",
            label: "Chargers & Accessories",
            url: "/products?category=chargers-accessories",
            visible: true,
            position: 7,
          },
        ],
      },
      { id: "new-arrivals", label: "New arrivals", url: "/products?sort=newest", visible: true, position: 2 },
      { id: "deals", label: "Deals", url: "/products?collection=deals", visible: true, position: 3 },
      { id: "track-order", label: "Track order", url: "/orders", visible: true, position: 4 },
    ],
  },
};
