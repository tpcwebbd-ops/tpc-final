/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection35Data {
  id: string;
  pageUid: string;
  pageName: string;
  text: string;
  link: string;
  gradientFrom: string;
  gradientTo: string;
}

export type Section35Data = ISection35Data;

export interface Section35Payload extends Section35Data {
  paddingX: number;
  paddingY: number;
}

export interface Section35Props {
  data?: Section35Data | Section35Payload | string;
}

export const defaultDataSection35: Section35Data = {
  id: "section-uid-35",
  pageUid: "section-uid-35",
  pageName: "Section 35",
  text: "🚀 We Recommend Hostinger",
  link: "#",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
};

export const defaultData = defaultDataSection35;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
