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

export interface Section23Data {
  id: string;
  sectionUid: string;
  cards: IFeatureCard[];
}

export interface Section23Props {
  data?: Section23Data | Section23Payload | string;
}

export const defaultDataSection23: Section23Data = {
  id: "section-uid-23",
  sectionUid: "section-uid-23",
  cards: [
    {
      title: "Reading Mastery",
      description: "Advanced reading techniques and strategies to achieve Band 8+ scores with expert guidance.",
      iconName: "BookOpen",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Listening Excellence",
      description: "Expert listening skills development with comprehensive practice materials and techniques.",
      iconName: "Play",
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Writing Perfection",
      description: "Task 1 & 2 writing strategies with high band score techniques and personalized feedback.",
      iconName: "Award",
      gradient: "from-blue-500 to-indigo-500",
    },
  ],
};

export interface Section23Payload extends Section23Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };
