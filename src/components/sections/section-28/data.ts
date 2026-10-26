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
  title: "Why Learn with TestPrep Center?",
  subtitle: "Focused online learning and practical support for your IELTS goal",
  features: [
    {
      title: "Online Access",
      description: "Learn from anywhere in Bangladesh without needing to travel.",
      iconName: "Users",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Focused Guidance",
      description: "Build IELTS skills with clear explanations, practice, and helpful direction.",
      iconName: "Award",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Useful Learning Resources",
      description: "Use practical resources to support your study and improve each IELTS skill.",
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
