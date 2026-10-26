/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface Section43Benefit {
  id: string;
  title: string;
  description: string;
}

export interface ISection43Data {
  id: string;
  title: string;
  introduction: string;
  benefits: Section43Benefit[];
  imageUrl: string;
  imageAlt: string;
  backgroundColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
}

export type Section43Data = ISection43Data;

export interface Section43Payload extends Section43Data {
  paddingX: number;
  paddingY: number;
}

export interface Section43Props {
  data?: Section43Data | Section43Payload | string;
}

export const defaultDataSection43: Section43Data = {
  id: "section-uid-43",
  title: "Why Choose the United Kingdom for Higher Education?",
  introduction:
    "The United Kingdom is a leading global study destination, combining high academic standards, forward-looking research, and an inclusive student experience.",
  benefits: [
    {
      id: "benefit-universities",
      title: "World-Class Universities:",
      description:
        "The UK is home to respected universities offering internationally recognised degrees with a strong focus on research, innovation, and practical skills.",
    },
    {
      id: "benefit-research",
      title: "Quality Education & Research:",
      description:
        "Interactive learning, modern labs, and close links with industry prepare graduates for an international job market.",
    },
    {
      id: "benefit-community",
      title: "Safe & Welcoming Environment:",
      description:
        "Safe student cities, a high quality of life, and welcoming support services help Bangladeshi students settle with confidence.",
    },
    {
      id: "benefit-work",
      title: "Part-time Work Opportunities:",
      description:
        "Eligible students can balance their studies with practical work experience, subject to their residence-permit conditions.",
    },
  ],
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Study destination placeholder image",
  backgroundColor: "#f8f9fb",
  headingColor: "#24349a",
  textColor: "#202641",
  accentColor: "#ef0b5b",
};

export const defaultData = defaultDataSection43;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
