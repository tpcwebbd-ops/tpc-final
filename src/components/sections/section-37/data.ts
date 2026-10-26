/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| Study Abroad experience hero data for Section 37
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
  titleLineOne: "১৬ বছরের অভিজ্ঞতায়",
  titleEnglish: "STUDY ABROAD",
  titleEnglishSuffix: "START",
  titleHighlight: "YOUR STORY.",
  descriptionLead: "স্বপ্ন আপনার,",
  descriptionAccent: "16 YEARS OF TRUST",
  descriptionTail: "সঠিক পথ দেখানোর দায়িত্ব আমাদের।",
  primaryButtonText: "ফ্রি কাউন্সেলিং",
  primaryButtonLink: "/application",
  secondaryButtonText: "Apply Now",
  secondaryButtonLink: "/application",
  backgroundColor: "#fafaf9",
  gridColor: "#e5e7eb",
  headingColor: "#111827",
  accentColor: "#cf0a2c",
  descriptionColor: "#475569",
};

export const defaultData = defaultDataSection37;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
