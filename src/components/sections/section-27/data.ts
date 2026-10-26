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
  badgeText: "Available in Dhaka & Chittagong",
  headingPrefix: "Join Our",
  headingHighlight: "Offline IELTS",
  headingSuffix: "Classes",
  subTitle: "For Personalized Learning Experience",
  tab1Label: "Offline Classes",
  tab2Label: "Online Classes",
  courses: [
    {
      title: "IELTS Comprehensive",
      level: "Beginner Level",
      levelColorClass: "bg-blue-100 text-blue-700",
      description:
        "Perfect for beginners who want to build strong English fundamentals before taking IELTS. Comprehensive coverage of all four skills.",
      features: [
        "Language Club & Student Lounge",
        "3 Mock Tests with Teacher Feedback",
        "No Extra Charge for Course Materials",
        "Small Batch Size (Max 12 Students)",
        "Weekend Practice Sessions",
      ],
      duration: "4.5 Months",
      classes: "50+ Classes",
      price: "৳15,000",
      popular: false,
    },
    {
      title: "IELTS Focus",
      level: "Intermediate Level",
      levelColorClass: "bg-green-100 text-green-700",
      description:
        "Designed for students with basic English knowledge. Focus on developing IELTS-specific skills and achieving band 6.0-7.0.",
      features: [
        "Language Club & Student Lounge",
        "3 Mock Tests with Teacher Feedback",
        "No Extra Charge for Course Materials",
        "Speaking Practice Sessions",
        "Writing Task Correction",
      ],
      duration: "3 Months",
      classes: "30+ Classes",
      price: "৳12,000",
      popular: true,
    },
    {
      title: "IELTS Crash",
      level: "Intensive",
      levelColorClass: "bg-red-100 text-red-700",
      description:
        "Fast-track intensive course for students who need to prepare quickly. Focused exam strategies and daily practice sessions.",
      features: [
        "3 Mock Tests with Personalized Teacher",
        "No Extra Charge for Course Materials",
        "Daily Practice Sessions",
        "One-on-One Speaking Practice",
        "Express Score Improvement",
      ],
      duration: "1.5 Months",
      classes: "30+ Classes",
      price: "৳18,000",
      popular: false,
      schedule: ["Morning Batch: 10:00 AM - 1:30 PM", "Evening Batch: 5:00 PM - 8:30 PM"],
    },
  ],
};

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
