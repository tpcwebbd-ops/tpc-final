/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ISection37Data {
  id: string;
  titleLineOne: string;
  titleEnglish: string;
  titleEnglishSuffix: string;
  titleHighlight: string;
  descriptionLead: string;
  descriptionAccent: string;
  descriptionTail: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundColor: string;
  gridColor: string;
  headingColor: string;
  accentColor: string;
  descriptionColor: string;
}
export type Section37Data = ISection37Data;
export interface Section37Payload extends Section37Data {
  paddingX: number;
  paddingY: number;
}
export interface Section37Props {
  data?: Section37Data | Section37Payload | string;
}
export const defaultDataSection37: Section37Data = {
  id: "section-uid-37",
  titleLineOne: "Plan with clarity.",
  titleEnglish: "STUDY ABROAD",
  titleEnglishSuffix: "WITH",
  titleHighlight: "TESTPREP CENTER.",
  descriptionLead: "Your goal,",
  descriptionAccent: "CLEAR ONLINE GUIDANCE",
  descriptionTail: "for a practical next step toward international education.",
  primaryButtonText: "Free Consultation",
  primaryButtonLink: "/contact-us",
  secondaryButtonText: "Chat on WhatsApp",
  secondaryButtonLink: "https://wa.me/8801786558855",
  backgroundColor: "#fafaf9",
  gridColor: "#e5e7eb",
  headingColor: "#111827",
  accentColor: "#cf0a2c",
  descriptionColor: "#475569",
};
export const defaultData = defaultDataSection37;
export const defaultLayout = { paddingX: 0, paddingY: 0 };
