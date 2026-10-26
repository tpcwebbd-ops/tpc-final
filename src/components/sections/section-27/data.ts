/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ICourseCard {
  title: string;
  level: string;
  levelColorClass: string;
  description: string;
  features: string[];
  duration: string;
  classes: string;
  price?: string;
  popular?: boolean;
  schedule?: string[];
}
export interface Section27Data {
  id: string;
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  subTitle: string;
  tab1Label: string;
  tab2Label: string;
  courses: ICourseCard[];
}
export interface Section27Payload extends Section27Data {
  paddingX: number;
  paddingY: number;
}
export interface Section27Props {
  data?: Section27Data | Section27Payload | string;
}

export const defaultDataSection27: Section27Data = {
  id: "section-uid-27",
  badgeText: "Available Online Across Bangladesh",
  headingPrefix: "Join Our",
  headingHighlight: "Online IELTS",
  headingSuffix: "Programs",
  subTitle: "Focused learning support for your IELTS goal, wherever you are.",
  tab1Label: "IELTS Programs",
  tab2Label: "Online Learning",
  courses: [
    {
      title: "IELTS Foundation",
      level: "Beginner Level",
      levelColorClass: "bg-blue-100 text-blue-700",
      description:
        "Build strong English foundations and understand the four IELTS skills before moving into focused test preparation.",
      features: [
        "Listening, reading, writing, and speaking practice",
        "Clear learning resources",
        "Guidance for planning your preparation",
        "Online access from anywhere",
      ],
      duration: "Contact TPC for details",
      classes: "Online learning support",
      price: "Contact TPC",
      popular: false,
    },
    {
      title: "IELTS Skills Focus",
      level: "Intermediate Level",
      levelColorClass: "bg-green-100 text-green-700",
      description:
        "Develop IELTS-specific skills with practice and focused guidance for learners who already have a basic English foundation.",
      features: [
        "Targeted skill practice",
        "Speaking and writing guidance",
        "Useful preparation resources",
        "Online support",
      ],
      duration: "Contact TPC for details",
      classes: "Online learning support",
      price: "Contact TPC",
      popular: true,
    },
    {
      title: "IELTS Intensive Preparation",
      level: "Focused Preparation",
      levelColorClass: "bg-red-100 text-red-700",
      description:
        "A focused option for learners who want to organise their IELTS preparation and strengthen their approach before the test.",
      features: [
        "Practical test strategies",
        "Focused practice sessions",
        "Speaking preparation",
        "Clear next-step guidance",
      ],
      duration: "Contact TPC for details",
      classes: "Online learning support",
      price: "Contact TPC",
      popular: false,
      schedule: ["Online — schedule shared by TestPrep Center"],
    },
  ],
};
export const defaultLayout = { paddingX: 0, paddingY: 0 };
