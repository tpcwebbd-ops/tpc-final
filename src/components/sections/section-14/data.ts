/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export type ArticleBlock =
  | { type: "text"; content: string }
  | { type: "quote"; content: string; author: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "heading"; content: string };
export interface Author {
  name: string;
  role: string;
  avatar: string;
}
export interface Section14Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  badge: string;
  showEyebrow: boolean;
  title: string;
  subTitle: string;
  allData: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: Author;
    heroImage: string;
    content: ArticleBlock[];
    tags: string[];
  }[];
}
const author: Author = {
  name: "TestPrep Center",
  role: "Online learning team",
  avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
};
const image = "https://i.ibb.co/KpGnqS3D/nature.jpg";
export const defaultDataSection14: Section14Data = {
  id: "section-uid-14",
  sectionUid: "section-uid-14",
  paddingX: 0,
  paddingY: 0,
  badge: "TPC Learning Guides",
  showEyebrow: true,
  title: "Learn with clarity",
  subTitle: "Practical guides for your English and education goals",
  allData: [
    {
      id: "ielts-guide",
      title: "Start your IELTS preparation with a clear plan",
      subtitle: "A practical way to organise the four IELTS skills before your test.",
      category: "IELTS",
      readTime: "4 min read",
      publishedAt: "TestPrep Center guide",
      author,
      heroImage: image,
      tags: ["IELTS", "English", "Online Learning"],
      content: [
        { type: "heading", content: "Know your target" },
        {
          type: "text",
          content:
            "Start with the score you need and identify the listening, reading, writing, and speaking skills that need the most attention.",
        },
        {
          type: "quote",
          content: "Steady, focused practice is more useful than trying to improve everything at once.",
          author: "TestPrep Center",
        },
      ],
    },
    {
      id: "abroad-guide",
      title: "Plan your study-abroad journey step by step",
      subtitle: "Clarify your destination, course, documents, and timeline before you apply.",
      category: "Study Abroad",
      readTime: "5 min read",
      publishedAt: "TestPrep Center guide",
      author,
      heroImage: image,
      tags: ["Study Abroad", "University", "Planning"],
      content: [
        { type: "heading", content: "Begin with your goal" },
        {
          type: "text",
          content:
            "Consider your academic background, preferred subject, budget, and destination interests. Then create a realistic preparation timeline.",
        },
        {
          type: "text",
          content:
            "TestPrep Center can help you understand the questions to answer before you move to the application stage.",
        },
      ],
    },
    {
      id: "kids-guide",
      title: "Everyday speaking practice for children",
      subtitle: "Create small, positive opportunities for young learners to use English with confidence.",
      category: "TPC Kids",
      readTime: "3 min read",
      publishedAt: "TestPrep Center guide",
      author,
      heroImage: image,
      tags: ["Kids", "Spoken English", "Confidence"],
      content: [
        { type: "heading", content: "Practice through conversation" },
        {
          type: "text",
          content:
            "Short, regular conversations around familiar topics can help children use new English words naturally and comfortably.",
        },
        {
          type: "quote",
          content: "Confidence grows when children feel safe to practise, make mistakes, and try again.",
          author: "TPC Kids",
        },
      ],
    },
  ],
};
