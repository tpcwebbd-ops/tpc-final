/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { PageTemplateData } from "../shared/page-types";

export type IAboutTheCountryData = PageTemplateData;

export interface AboutTheCountryPayload extends IAboutTheCountryData {
  paddingX: number;
  paddingY: number;
}

export type AboutTheCountryProps = { data?: IAboutTheCountryData | AboutTheCountryPayload | string };

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataAboutTheCountry: IAboutTheCountryData = {
  pageUid: "about-the-country-uid",
  pageName: "Home",
  eyebrow: "TestPrep Center (TPC)",
  title: "Online education support for learners across Bangladesh.",
  subtitle:
    "Prepare for IELTS, plan your study-abroad journey, or help your child practise spoken English through accessible online learning and guidance.",
  primaryAction: "Talk to TPC",
  secondaryAction: "Explore Programs",
  sections: [
    {
      eyebrow: "IELTS",
      title: "Prepare with purpose",
      description: "Build each IELTS skill with structured online learning, practice, and practical guidance.",
      items: [
        "Listening, reading, writing, and speaking practice",
        "Focused feedback and learning resources",
        "A plan built around your target score",
      ],
    },
    {
      eyebrow: "Study abroad",
      title: "Make your next step clearer",
      description:
        "Understand destinations, applications, documents, and the preparation needed for your international education goal.",
      items: ["Destination and course planning", "Application and document guidance", "Clear online consultation"],
    },
    {
      eyebrow: "TPC Kids",
      title: "Grow everyday speaking confidence",
      description: "Give young learners a welcoming online space to practise English communication skills.",
      items: [
        "Age-appropriate spoken English practice",
        "Interactive online learning",
        "Supportive confidence building",
      ],
    },
    {
      eyebrow: "Online learning",
      title: "Learn from wherever you are",
      description:
        "TPC provides its services online, so learners and families can connect from anywhere in Bangladesh.",
      items: ["Accessible from home", "Convenient communication", "Guidance when you need it"],
    },
  ],
};
