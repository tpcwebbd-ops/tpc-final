/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface HeroStat {
  id: number;
  value: string;
  label: string;
}

export interface HeroFeature {
  id: number;
  icon: string;
  label: string;
}

export interface ISection33Data {
  id: string;
  pageUid: string;
  pageName: string;
  badgeText: string;
  showEyebrow: boolean;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  stats: HeroStat[];
  features: HeroFeature[];
}

export type Section33Data = ISection33Data;

export interface Section33Payload extends Section33Data {
  paddingX: number;
  paddingY: number;
}

export interface Section33Props {
  data?: Section33Data | Section33Payload | string;
}

export const defaultDataSection33: Section33Data = {
  id: "section-uid-33",
  pageUid: "section-uid-33",
  pageName: "Section 33",
  badgeText: "🇧🇩 Made for Bangladeshi Creators",
  showEyebrow: true,
  titleLine1: "Premium WordPress",
  titleLine2: "Templates & Plugins",
  subtitle: "One-click import. Elementor ready. Build stunning websites without writing a single line of code.",
  stats: [
    { id: 1, value: "500+", label: "Templates" },
    { id: 2, value: "50+", label: "Plugins" },
    { id: 3, value: "10K+", label: "Happy Customers" },
    { id: 4, value: "99.9%", label: "Uptime" },
  ],
  features: [
    { id: 1, icon: "ti-world", label: "Free Domain" },
    { id: 2, icon: "ti-shield-check", label: "Free SSL" },
    { id: 3, icon: "ti-bolt", label: "LiteSpeed" },
    { id: 4, icon: "ti-server", label: "99.9% Uptime" },
  ],
};

export const defaultData = defaultDataSection33;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
