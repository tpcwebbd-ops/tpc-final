/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Author {
  name: string;
  avatar: string;
  role: string;
}
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: Author;
  category: string;
  tags: string[];
  featured?: boolean;
}
export interface Section5Data {
  id: string;
  paddingX: number;
  paddingY: number;
  showEyebrow?: boolean;
  categories: string[];
  allData: BlogPost[];
}
const tpcTeam: Author = {
  name: "TestPrep Center",
  avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
  role: "Online learning team",
};
export const defaultDataSection5: Section5Data = {
  id: "section-uid-5",
  paddingX: 0,
  paddingY: 0,
  showEyebrow: true,
  categories: ["All", "IELTS", "Study Abroad", "TPC Kids"],
  allData: [
    {
      id: "ielts-plan",
      title: "Create a practical IELTS preparation plan",
      excerpt:
        "Start with your target score, identify the skills to improve, and create a realistic online study routine.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "TestPrep Center guide",
      readTime: "3 min read",
      category: "IELTS",
      tags: ["IELTS", "Preparation", "English"],
      author: tpcTeam,
      featured: true,
    },
    {
      id: "study-abroad-start",
      title: "First steps for planning to study abroad",
      excerpt:
        "Clarify your academic goal, destination interests, finances, and timeline before beginning applications.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "TestPrep Center guide",
      readTime: "4 min read",
      category: "Study Abroad",
      tags: ["University", "Applications", "Planning"],
      author: tpcTeam,
    },
    {
      id: "kids-speaking",
      title: "Help children practise spoken English with confidence",
      excerpt:
        "Regular, supportive conversation practice helps young learners use English naturally in everyday situations.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "TestPrep Center guide",
      readTime: "3 min read",
      category: "TPC Kids",
      tags: ["Kids", "Spoken English", "Online Learning"],
      author: tpcTeam,
    },
  ],
};
