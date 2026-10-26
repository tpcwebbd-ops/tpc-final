/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  description: string;
  actionText: string;
}
export interface Section13Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  title: string;
  badge: string;
  showEyebrow: boolean;
  subTitle: string;
  description: string;
  categories: string[];
  events: IEvent[];
}
export interface Section13Props {
  data?: Section13Data | string;
}
export const defaultEvent: Omit<IEvent, "id" | "category"> = {
  title: "New session",
  date: "Check with TPC",
  location: "Online",
  image: "",
  description: "Session details go here.",
  actionText: "Contact TPC",
};
export const defaultDataSection13: Section13Data = {
  sectionUid: "section-uid-13",
  id: "section-uid-13",
  paddingX: 0,
  paddingY: 0,
  title: "Online",
  badge: "Learn with TPC",
  showEyebrow: true,
  subTitle: "Sessions",
  description: "Connect with TestPrep Center for useful online learning and guidance opportunities.",
  categories: ["IELTS", "Study Abroad", "TPC Kids"],
  events: [
    {
      id: "ielts-session",
      title: "IELTS Preparation Session",
      date: "Contact TPC for schedule",
      location: "Online",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "IELTS",
      description: "Discuss the online IELTS support that fits your target score and preparation stage.",
      actionText: "Ask TPC",
    },
    {
      id: "abroad-session",
      title: "Study Abroad Guidance Session",
      date: "Contact TPC for schedule",
      location: "Online",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "Study Abroad",
      description: "Understand practical next steps for destinations, applications, and document preparation.",
      actionText: "Ask TPC",
    },
    {
      id: "kids-session",
      title: "TPC Kids Spoken English",
      date: "Contact TPC for schedule",
      location: "Online",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "TPC Kids",
      description: "Discover supportive online English-speaking practice for young learners.",
      actionText: "Ask TPC",
    },
  ],
};
