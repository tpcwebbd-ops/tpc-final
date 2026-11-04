/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

export type HomeCard = {
  title: string;
  description: string;
};

export type HomeData = {
  forceUpdate: "true" | "false";
  paddingX: number;
  paddingY: number;
  eyebrow: string;
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  sectionsJson: string;
};

export const defaultCards: HomeCard[] = [
  {
    title: "IELTS Preparation",
    description: "Build the skills and confidence to prepare for your target IELTS band online.",
  },
  {
    title: "Study Abroad Guidance",
    description: "Plan your university, application, and student-visa journey with clear support.",
  },
  {
    title: "Kids Spoken English",
    description: "Help young learners practise everyday English speaking in a supportive online setting.",
  },
  { title: "Online from Anywhere", description: "Learn and receive guidance from anywhere in Bangladesh." },
  { title: "Practical Resources", description: "Use focused learning materials, practice, and step-by-step guidance." },
  { title: "Personal Support", description: "Ask questions and get help choosing the right next step for your goal." },
];

export const defaultHomeCard: HomeCard = {
  title: "New program",
  description: "Add a short description of a TestPrep Center program or service.",
};

export const defaultData: HomeData = {
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "TestPrep Center (TPC)",
  title: "Prepare for IELTS, study abroad, and confident English communication.",
  intro:
    "TestPrep Center is an online education platform in Bangladesh for IELTS preparation, study-abroad guidance, and kids' spoken English courses.",
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "TestPrep Center online learning",
  sectionsJson: JSON.stringify(defaultCards),
};
