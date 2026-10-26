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
export const defaultPartner: Omit<IPartner, "id"> = { name: "New partner", logo: "" };
export const defaultCollabOption: Omit<ICollabOption, "id"> = {
  title: "New program",
  description: "Describe this TestPrep Center program.",
};
export const defaultDataSection12: Section12Data = {
  id: "section-uid-12",
  sectionUid: "section-uid-12",
  paddingX: 0,
  paddingY: 0,
  badge: "TestPrep Center Programs",
  showEyebrow: true,
  title: "Learn",
  subTitle: "Online",
  description:
    "TestPrep Center brings practical learning and guidance to learners across Bangladesh through accessible online services.",
  partners: [],
  collabOptions: [
    {
      id: "ielts",
      title: "IELTS Preparation",
      description: "Focused online support for learners preparing to improve their IELTS skills.",
    },
    {
      id: "study-abroad",
      title: "Study Abroad Guidance",
      description: "Clear guidance for exploring destinations, applications, and preparation steps.",
    },
    {
      id: "kids",
      title: "TPC Kids Spoken English",
      description: "Supportive online spoken-English practice for young learners.",
    },
  ],
};
