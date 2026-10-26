/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection39Data {
  id: string;
  titlePrefix: string;
  highlightedTitle: string;
  titleSuffix: string;
  paragraphs: string[];
  primaryImage: string;
  topImage: string;
  bottomImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export type Section39Data = ISection39Data;

export interface Section39Payload extends Section39Data {
  paddingX: number;
  paddingY: number;
}

export interface Section39Props {
  data?: Section39Data | Section39Payload | string;
}

export const defaultDataSection39: Section39Data = {
  id: "section-uid-39",
  titlePrefix: "Why choose NexaMart for your",
  highlightedTitle: "study-abroad",
  titleSuffix: "needs?",
  paragraphs: [
    "Choosing the right course, university, and destination can shape your future. NexaMart provides clear, personalized guidance so you can make informed decisions with confidence.",
    "Our experienced team supports you throughout the entire process, including university selection, applications, documentation, visa guidance, and pre-departure preparation.",
    "NexaMart is based in Bangladesh and works with students across the entire country. Wherever you live, you can access reliable, professional support for your international education journey.",
  ],
  primaryImage: "https://placehold.co/720x520/dbeafe/1d4ed8?text=Study+Abroad+Guidance",
  topImage: "https://placehold.co/480x320/e2e8f0/475569?text=Why+Choose+Us",
  bottomImage: "https://placehold.co/480x320/e2e8f0/475569?text=Reliable+Service",
  backgroundColor: "#ffffff",
  headingColor: "#050505",
  accentColor: "#2477f2",
  textColor: "#5f6780",
};

export const defaultData = defaultDataSection39;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
