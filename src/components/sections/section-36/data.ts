/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export type CategoryIconKey = "briefcase" | "wheat" | "sparkles" | "laptop" | "plug" | "heart";
export interface CategorySliderItem {
  id: number;
  name: string;
  icon: CategoryIconKey;
}
export interface ISection36Data {
  id: string;
  pageUid: string;
  pageName: string;
  categories: CategorySliderItem[];
  cardBackgroundColor: string;
  iconBackgroundColor: string;
  iconHoverBackgroundColor: string;
  showNavigationButtons: boolean;
  loop: boolean;
}
export type Section36Data = ISection36Data;
export interface Section36Payload extends Section36Data {
  paddingX: number;
  paddingY: number;
}
export interface Section36Props {
  data?: Section36Data | Section36Payload | string;
}
export const defaultDataSection36: Section36Data = {
  id: "section-uid-36",
  pageUid: "section-uid-36",
  pageName: "TPC Programs",
  cardBackgroundColor: "#ffffff",
  iconBackgroundColor: "#3b82f6",
  iconHoverBackgroundColor: "#2563eb",
  showNavigationButtons: true,
  loop: true,
  categories: [
    { id: 1, name: "IELTS Preparation", icon: "briefcase" },
    { id: 2, name: "Study Abroad", icon: "wheat" },
    { id: 3, name: "TPC Kids", icon: "sparkles" },
    { id: 4, name: "Online Learning", icon: "laptop" },
    { id: 5, name: "Visa Guidance", icon: "plug" },
    { id: 6, name: "Learning Resources", icon: "heart" },
    { id: 7, name: "Student Updates", icon: "briefcase" },
    { id: 8, name: "Contact TPC", icon: "wheat" },
  ],
};
export const defaultData = defaultDataSection36;
export const defaultLayout = { paddingX: 0, paddingY: 0 };
