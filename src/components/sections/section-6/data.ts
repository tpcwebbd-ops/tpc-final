/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section6Data {
  sectionUid: string;
  id: string;
  paddingX: number;
  paddingY: number;
  showEyebrow?: boolean;
  universityName: string;
  location: string;
  established: string;
  description: string;
  bannerImage: string;
  logoUrl: string;
  programs: string[];
  subjects: string[];
  tuitionFee: string;
  rating: string;
  totalStudents: string;
  accreditation: string;
  websiteUrl: string;
  applyText: string;
  buttonText: string;
  buttonUrl: string;
  features: string[];
}

export const defaultDataSection6: Section6Data = {
  sectionUid: "section-uid-6",
  id: "section-uid-6",
  paddingX: 0,
  paddingY: 0,
  showEyebrow: true,
  universityName: "Cambridge Institute of Technology",
  location: "Cambridge, Massachusetts, USA",
  established: "1908",
  description:
    "A world-class institution dedicated to engineering excellence, fostering innovation, and shaping the future leaders of technology. Experience a campus life vibrant with culture and cutting-edge research facilities.",
  bannerImage: "https://i.ibb.co/PGXYXwTq/img.jpg",
  logoUrl: "https://i.ibb.co/PGXYXwTq/img.jpg",
  programs: ["B.Sc", "B.Tech", "M.Sc", "PhD", "MBA"],
  subjects: ["Computer Science", "Artificial Intelligence", "Data Science", "Robotics", "Civil Engineering"],
  tuitionFee: "$18,500 / Year",
  rating: "4.9/5.0",
  totalStudents: "12,000+",
  accreditation: "Global Tier-1 Accredited",
  websiteUrl: "#",
  buttonText: "#",
  buttonUrl: "#",
  applyText: "Apply for Admission",
  features: ["Top 1% Global Ranking", "98% Placement Rate", "State-of-the-art Labs"],
};
