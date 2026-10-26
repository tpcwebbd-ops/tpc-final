/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section8Data {
  id: string;
  paddingX: number;
  paddingY: number;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
  sectionUid: string;
}

export interface Section8Props {
  data?: Section8Data | string;
}

export const defaultDataSection8: Section8Data = {
  sectionUid: "section-uid-8",
  id: "section-uid-8",
  paddingX: 0,
  paddingY: 0,
  title: "Be The Next Story",
  subTitle: "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
  buttonText: "Apply Now",
  buttonUrl: "#",
};
