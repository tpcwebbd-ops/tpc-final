/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IPartner {
  id: string;
  name: string;
  logo: string;
}

export interface ICollabOption {
  id: string;
  title: string;
  description: string;
}

export interface Section12Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  title: string;
  badge: string;
  showEyebrow: boolean;
  subTitle: string;
  description: string;
  partners: IPartner[];
  collabOptions: ICollabOption[];
}

export interface Section12Props {
  data?: Section12Data | string;
}

export const defaultPartner: Omit<IPartner, "id"> = { name: "New Partner", logo: "" };
export const defaultCollabOption: Omit<ICollabOption, "id"> = { title: "New Service", description: "Description of the collaboration model." };

export const defaultDataSection12: Section12Data = {
  id: "section-uid-12",
  sectionUid: "section-uid-12",
  paddingX: 0,
  paddingY: 0,
  badge: "Partnership Network",
  showEyebrow: true,
  title: "Building",
  subTitle: "Together",
  description:
    "We believe in the power of partnership. From startups to enterprises, we collaborate to create digital excellence.",
  partners: [
    {
      id: "partner-1",
      name: "Acme Corp",
      logo: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    },
    {
      id: "partner-2",
      name: "Global Tech",
      logo: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    },
    {
      id: "partner-3",
      name: "Nebula Inc",
      logo: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    },
    {
      id: "partner-4",
      name: "Starlight",
      logo: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    },
    {
      id: "partner-5",
      name: "Vercel",
      logo: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    },
  ],
  collabOptions: [
    {
      id: "opt-1",
      title: "Strategic Partnership",
      description:
        "Long-term collaboration focusing on scalable growth, technical roadmap planning, and dedicated resource allocation.",
    },
    {
      id: "opt-2",
      title: "Staff Augmentation",
      description:
        "Extend your existing team with our senior engineers. seamless integration into your agile workflow.",
    },
    {
      id: "opt-3",
      title: "Project Basis",
      description: "End-to-end product development. From initial concept and design to deployment and maintenance.",
    },
  ],
};
