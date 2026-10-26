/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IFeatureItem {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
}

export interface Section28Data {
  id: string;
  title: string;
  subtitle: string;
  features: IFeatureItem[];
}

export interface Section28Payload extends Section28Data {
  paddingX: number;
  paddingY: number;
}

export interface Section28Props {
  data?: Section28Data | Section28Payload | string;
}

export const defaultDataSection28: Section28Data = {
  id: "section-uid-28",
  title: "Why Choose Our Classes?",
  subtitle: "Experience the difference with our proven teaching methodology",
  features: [
    {
      title: "Small Batches",
      description: "Maximum 12 students per batch for personalized attention",
      iconName: "Users",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Expert Teachers",
      description: "IELTS certified instructors with 8+ band scores",
      iconName: "Award",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Free Materials",
      description: "All course materials and books included at no extra cost",
      iconName: "BookOpen",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Mock Tests",
      description: "Regular practice tests with detailed feedback",
      iconName: "Star",
      gradient: "from-red-500 to-red-600",
    },
  ],
};

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
