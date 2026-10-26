/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStatItem {
  number: string;
  label: string;
}

export interface ISection31Data {
  id: string;
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  stats: IStatItem[];
}

export type Section31Data = ISection31Data;

export interface Section31Payload extends Section31Data {
  paddingX: number;
  paddingY: number;
}

export interface Section31Props {
  data?: Section31Data | Section31Payload | string;
}

export const defaultDataSection31: Section31Data = {
  id: "section-uid-31",
  badgeText: "★ We Are Also Providing",
  headingPrefix: "Online",
  headingHighlight: "Study Abroad",
  headingSuffix: "Services",
  stats: [
    { number: "TPC", label: "TestPrep Center" },
    { number: "IELTS", label: "Preparation" },
    { number: "Study", label: "Abroad guidance" },
    { number: "Kids", label: "Spoken English" },
  ],
};

export const defaultData = defaultDataSection31;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
