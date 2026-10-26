/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection48Data {
  id: string;
  banglaFirstLine: string;
  banglaSecondLine: string;
  stampValue: string;
  stampText: string;
}

export type Section48Data = ISection48Data;

export interface Section48Payload extends Section48Data {
  paddingX: number;
  paddingY: number;
}

export interface Section48Props {
  data?: Section48Data | Section48Payload | string;
}

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataSection48: Section48Data = {
  id: "section-uid-48",
  banglaFirstLine: "স্বপ্ন আপনার,",
  banglaSecondLine: "সঠিক পথ দেখানোর দায়িত্ব আমাদের।",
  stampValue: "16",
  stampText: "YEARS OF TRUST • YEARS OF TRUST •",
};

export const defaultData = defaultDataSection48;
