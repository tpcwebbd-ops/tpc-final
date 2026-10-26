/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStoryItem {
  id: string;
  name: string;
  university: string;
  subject: string;
  image: string;
  description: string;
}

export interface ISection32Data {
  id: string;
  title: string;
  subtitle: string;
  stories: IStoryItem[];
}

export type Section32Data = ISection32Data;

export interface Section32Payload extends Section32Data {
  paddingX: number;
  paddingY: number;
}

export interface Section32Props {
  data?: Section32Data | Section32Payload | string;
}

export const defaultDataSection32: Section32Data = {
  id: "section-uid-32",
  title: "Your Learning Journey",
  subtitle: "Take clear online steps toward your IELTS, study-abroad, or spoken-English goal.",
  stories: [
    {
      id: "1",
      name: "Your IELTS Goal",
      university: "Online preparation",
      subject: "English language skills",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      description:
        "Build a focused plan for listening, reading, writing, and speaking with guidance from TestPrep Center.",
    },
    {
      id: "2",
      name: "Your Study-Abroad Plan",
      university: "Destination research",
      subject: "University applications",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      description:
        "Understand your possible destinations, admission preparation, required documents, and practical next steps online.",
    },
    {
      id: "3",
      name: "Your Document Checklist",
      university: "Application preparation",
      subject: "Study-abroad documents",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
      description:
        "Organise the information and documents needed for the next stage of your study-abroad journey.",
    },
    {
      id: "4",
      name: "TPC Kids",
      university: "Online learning",
      subject: "Spoken English",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
      description:
        "Give young learners a supportive space to practise everyday English communication with growing confidence.",
    },
    {
      id: "5",
      name: "Stay Connected",
      university: "TestPrep Center",
      subject: "Online support",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
      description:
        "Call or WhatsApp TestPrep Center to discuss the learning or guidance option that fits your goal.",
    },
  ],
};

export const defaultData = defaultDataSection32;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
