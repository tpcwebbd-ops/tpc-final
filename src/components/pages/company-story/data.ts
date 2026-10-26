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
  pageName: "Company Story",
  eyebrow: "About The Company",
  showEyebrow: true,
  title: "A practical team focused on clear strategy, clean design, and dependable delivery.",
  subtitle:
    "This About page explains who the business is, what it believes, how it works, and why customers can trust the team with important digital projects.",
  primaryAction: "Meet The Team",
  secondaryAction: "View Our Work",
  sections: [
    {
      eyebrow: "Story",
      showEyebrow: true,
      title: "Who we are",
      description:
        "Present the company background with a confident but human tone that helps visitors understand the team behind the work.",
      items: ["Focused digital delivery", "Business-first design decisions", "Long-term client relationships"],
    },
    {
      eyebrow: "Mission",
      showEyebrow: true,
      title: "What we are building toward",
      description:
        "Explain the company mission in a way that connects services to customer outcomes, not just internal ambition.",
      items: [
        "Make digital tools easier to use",
        "Turn ideas into working products",
        "Support growth with practical systems",
      ],
    },
    {
      eyebrow: "Values",
      showEyebrow: true,
      title: "How we make decisions",
      description: "Show the principles that guide project planning, communication, quality, and client experience.",
      items: ["Clarity before complexity", "Reliable timelines", "Design that supports real workflows"],
    },
    {
      eyebrow: "Experience",
      showEyebrow: true,
      title: "What clients can expect",
      description: "Describe the working relationship so prospects know what happens after they start a conversation.",
      items: ["Structured discovery", "Regular progress updates", "Testing before handover"],
    },
    {
      eyebrow: "Promise",
      showEyebrow: true,
      title: "A partner beyond launch",
      description:
        "Close the page by positioning the company as a long-term partner for improvements, support, and future growth.",
      items: ["Post-launch fixes", "Performance improvements", "Feature expansion support"],
    },
  ],
};
