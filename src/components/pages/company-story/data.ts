/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { PageTemplateData, PageTemplateSection } from "../shared/page-types";

export interface CompanyStorySection extends PageTemplateSection {
  showEyebrow?: boolean;
}

export interface ICompanyStoryData extends Omit<PageTemplateData, "sections"> {
  /** Missing flags remain visible so older saved pages stay backward compatible. */
  showEyebrow?: boolean;
  sections: CompanyStorySection[];
}

export interface CompanyStoryPayload extends ICompanyStoryData {
  paddingX: number;
  paddingY: number;
}

export type CompanyStoryProps = { data?: ICompanyStoryData | CompanyStoryPayload | string };

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataCompanyStory: ICompanyStoryData = {
  pageUid: "company-story-uid",
  pageName: "About TestPrep Center",
  eyebrow: "About TestPrep Center",
  showEyebrow: true,
  title: "A learning partner for IELTS, global education goals, and confident young speakers.",
  subtitle:
    "TestPrep Center (TPC) is an online education platform helping learners across Bangladesh prepare for IELTS, study abroad, and spoken English growth.",
  primaryAction: "Explore Our Programs",
  secondaryAction: "Talk to TPC",
  sections: [
    {
      eyebrow: "Story",
      showEyebrow: true,
      title: "Who we are",
      description:
        "TPC brings online education and guidance together so learners can take meaningful next steps from wherever they are in Bangladesh.",
      items: ["Online-first learning support", "Clear, practical communication", "A welcoming learning community"],
    },
    {
      eyebrow: "Mission",
      showEyebrow: true,
      title: "Make learning opportunities easier to reach",
      description: "We help learners build English skills and make informed decisions about their academic futures.",
      items: ["Support IELTS preparation", "Clarify study-abroad pathways", "Develop kids' spoken English confidence"],
    },
    {
      eyebrow: "Values",
      showEyebrow: true,
      title: "Guidance learners can trust",
      description:
        "We value clear information, thoughtful support, and realistic next steps for every learner and family.",
      items: ["Clarity before complexity", "Respect for every learner", "Practical, honest support"],
    },
    {
      eyebrow: "Experience",
      showEyebrow: true,
      title: "What learners can expect",
      description:
        "A focused online experience with approachable communication, useful resources, and guidance that fits each goal.",
      items: ["Convenient online access", "Goal-focused learning", "Friendly support"],
    },
  ],
};
