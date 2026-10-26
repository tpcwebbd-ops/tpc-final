/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IMilestone {
  label: string;
  value: string;
}
export interface IExperienceItem {
  id: string;
  year: string;
  companyName: string;
  role: string;
  description: string;
  lastAchievement: string;
  highlightMilestone: IMilestone;
  features: string[];
}
export interface Section11Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  eyebrow: string;
  showEyebrow: boolean;
  title: string;
  subTitle: string;
  description: string;
  experiences: IExperienceItem[];
}
export interface Section11Props {
  data?: Section11Data | string;
}
export const defaultExperience: Omit<IExperienceItem, "id"> = {
  year: "Learning path",
  companyName: "TestPrep Center",
  role: "Program",
  description: "Describe this learning path.",
  lastAchievement: "Useful next step",
  highlightMilestone: { label: "Format", value: "Online" },
  features: ["Learning support"],
};
export const defaultDataSection11: Section11Data = {
  sectionUid: "section-uid-11",
  id: "section-uid-11",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "TestPrep Center",
  showEyebrow: true,
  title: "Your Learning",
  subTitle: "Path",
  description: "Choose the online TestPrep Center program that fits the goal you want to work toward.",
  experiences: [
    {
      id: "ielts",
      year: "Step 1",
      companyName: "TestPrep Center",
      role: "IELTS Preparation",
      description: "Build a practical plan for improving your English test skills and preparing for IELTS.",
      lastAchievement: "Focused online preparation",
      highlightMilestone: { label: "Format", value: "Online" },
      features: ["Listening", "Reading", "Writing", "Speaking"],
    },
    {
      id: "abroad",
      year: "Step 2",
      companyName: "TestPrep Center",
      role: "Study Abroad Guidance",
      description:
        "Clarify destinations, applications, documents, and the preparation needed for your international education goal.",
      lastAchievement: "Clear next steps",
      highlightMilestone: { label: "Support", value: "Guidance" },
      features: ["Destinations", "Applications", "Documents", "Visa preparation"],
    },
    {
      id: "kids",
      year: "Step 3",
      companyName: "TestPrep Center",
      role: "TPC Kids Spoken English",
      description: "Help young learners practise everyday English communication in a supportive online setting.",
      lastAchievement: "Growing confidence",
      highlightMilestone: { label: "Learners", value: "Kids" },
      features: ["Speaking", "Vocabulary", "Conversation", "Online learning"],
    },
  ],
};
