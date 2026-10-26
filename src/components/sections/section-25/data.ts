/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IFeatureCard {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
}

export interface Section25Data {
  id: string;
  cards: IFeatureCard[];
}

export interface Section25Props {
  data?: Section25Data | Section25Payload | string;
}

export const defaultDataSection25: Section25Data = {
  id: "section-uid-25",
  cards: [
    {
      title: "Authentic Practice Tests",
      description:
        "Experience real IELTS exam conditions with our carefully crafted mock tests that mirror the actual exam format and difficulty level.",
      iconName: "FileText",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Instant Score Analysis",
      description:
        "Get immediate feedback with detailed band score breakdown and performance analytics to track your progress effectively.",
      iconName: "Target",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Expert Explanations",
      description:
        "Learn from comprehensive explanations for every question, written by IELTS experts to help you understand concepts deeply.",
      iconName: "BookOpen",
      gradient: "from-purple-500 to-purple-600",
    },
  ],
};

export interface Section25Payload extends Section25Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };
