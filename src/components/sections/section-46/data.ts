/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface Section46Institution {
  id: string;
  name: string;
  level: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonUrl: string;
}

export interface ISection46Data {
  id: string;
  eyebrow: string;
  showEyebrow?: boolean;
  title: string;
  description: string;
  institutions: Section46Institution[];
  backgroundColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
  cardColor: string;
  badgeColor: string;
}

export type Section46Data = ISection46Data;

export interface Section46Payload extends Section46Data {
  paddingX: number;
  paddingY: number;
}

export interface Section46Props {
  data?: Section46Data | Section46Payload | string;
}

export const defaultDataSection46: Section46Data = {
  id: "section-uid-46",
  eyebrow: "INSTITUTIONS",
  showEyebrow: true,
  title: "Our Partner Universities in the United Kingdom",
  description:
    "Explore trusted, world-class UK institutions with NexaMart for personalised support with admission and scholarship opportunities.",
  institutions: [
    {
      id: "institution-oxford",
      name: "University of Oxford",
      level: "POSTGRADUATE",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United Kingdom university campus for the University of Oxford",
      buttonText: "Apply via NexaMart →",
      buttonUrl: "/applicaton",
    },
    {
      id: "institution-cambridge",
      name: "University of Cambridge",
      level: "UNDERGRADUATE",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United Kingdom university campus for the University of Cambridge",
      buttonText: "Apply via NexaMart →",
      buttonUrl: "/applicaton",
    },
    {
      id: "institution-imperial",
      name: "Imperial College London",
      level: "POSTGRADUATE",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United Kingdom university campus for Imperial College London",
      buttonText: "Apply via NexaMart →",
      buttonUrl: "/applicaton",
    },
    {
      id: "institution-manchester",
      name: "University of Manchester",
      level: "UNDERGRADUATE",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United Kingdom university campus for the University of Manchester",
      buttonText: "Apply via NexaMart →",
      buttonUrl: "/applicaton",
    },
    {
      id: "institution-edinburgh",
      name: "University of Edinburgh",
      level: "POSTGRADUATE",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United Kingdom university campus for the University of Edinburgh",
      buttonText: "Apply via NexaMart →",
      buttonUrl: "/applicaton",
    },
  ],
  backgroundColor: "#ffffff",
  headingColor: "#29399b",
  textColor: "#252b47",
  accentColor: "#ed075a",
  cardColor: "#ffffff",
  badgeColor: "#ffffff",
};

export const defaultData = defaultDataSection46;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
