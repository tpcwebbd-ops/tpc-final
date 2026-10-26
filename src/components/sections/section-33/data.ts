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
  pageName: "TestPrep Center Programs",
  badgeText: "Made for learners in Bangladesh",
  showEyebrow: true,
  titleLine1: "Learn Online with",
  titleLine2: "TestPrep Center",
  subtitle:
    "Prepare for IELTS, explore study-abroad opportunities, and help kids build spoken English confidence from anywhere.",
  stats: [
    { id: 1, value: "IELTS", label: "Preparation" },
    { id: 2, value: "Study", label: "Abroad guidance" },
    { id: 3, value: "TPC Kids", label: "Spoken English" },
    { id: 4, value: "Online", label: "Across Bangladesh" },
  ],
  features: [
    { id: 1, icon: "ti-world", label: "Learn from anywhere" },
    { id: 2, icon: "ti-shield-check", label: "Clear, practical guidance" },
    { id: 3, icon: "ti-bolt", label: "Focused learning support" },
    { id: 4, icon: "ti-server", label: "Convenient online access" },
  ],
};
export const defaultData = defaultDataSection33;
export const defaultLayout = { paddingX: 0, paddingY: 0 };
