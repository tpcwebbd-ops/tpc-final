/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection38Data {
  id: string;
  missionEyebrow: string;
  showMissionEyebrow: boolean;
  missionTitle: string;
  missionHighlightedTitle: string;
  missionDescription: string;
  visionEyebrow: string;
  showVisionEyebrow: boolean;
  visionTitle: string;
  visionHighlightedTitle: string;
  visionDescription: string;
  missionPrimaryImage: string;
  missionTopImage: string;
  missionBottomImage: string;
  visionPrimaryImage: string;
  visionTopImage: string;
  visionBottomImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
}

export type Section38Data = ISection38Data;

export interface Section38Payload extends Section38Data {
  paddingX: number;
  paddingY: number;
}

export interface Section38Props {
  data?: Section38Data | Section38Payload | string;
}

export const defaultDataSection38: Section38Data = {
  id: "section-uid-38",
  missionEyebrow: "NexaMart",
  showMissionEyebrow: true,
  missionTitle: "Our",
  missionHighlightedTitle: "Mission",
  missionDescription:
    "Our mission is to empower students across Bangladesh with trusted, personalized guidance for studying abroad. NexaMart simplifies university selection, applications, documentation, visa guidance, and pre-departure preparation so every student can move forward with confidence.",
  visionEyebrow: "NexaMart",
  showVisionEyebrow: true,
  visionTitle: "Our",
  visionHighlightedTitle: "Vision",
  visionDescription:
    "Our vision is to become Bangladesh’s most trusted study-abroad consultancy by making quality international education guidance accessible to students in every part of the country. We aim to connect each student with the right opportunities and help them build a successful global future.",
  missionPrimaryImage: "https://placehold.co/720x520/dbeafe/1d4ed8?text=Our+Mission",
  missionTopImage: "https://placehold.co/480x320/e2e8f0/475569?text=Mission+Top",
  missionBottomImage: "https://placehold.co/480x320/e2e8f0/475569?text=Mission+Bottom",
  visionPrimaryImage: "https://placehold.co/720x520/dbeafe/1d4ed8?text=Our+Vision",
  visionTopImage: "https://placehold.co/480x320/e2e8f0/475569?text=Vision+Top",
  visionBottomImage: "https://placehold.co/480x320/e2e8f0/475569?text=Vision+Bottom",
  backgroundColor: "#ffffff",
  headingColor: "#050505",
  accentColor: "#2477f2",
  textColor: "#5f6780",
};

export const defaultData = defaultDataSection38;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
