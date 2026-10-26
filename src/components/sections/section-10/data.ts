/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStory {
  id: string;
  name: string;
  image: string;
  university: string;
  showEyebrow: boolean;
  subject: string;
  description: string;
}
export interface Section10Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  stories: IStory[];
  storiesPerPage: number;
}
export interface Section10Props {
  data?: Section10Data | string;
}
export const defaultStory: Omit<IStory, "id"> = {
  name: "New learner story",
  university: "Learning goal",
  subject: "Program",
  image: "",
  showEyebrow: true,
  description: "Add a TestPrep Center learner story or program highlight.",
};
const image = "https://i.ibb.co/KpGnqS3D/nature.jpg";
export const defaultDataSection10: Section10Data = {
  sectionUid: "section-uid-10",
  id: "section-uid-10",
  paddingX: 0,
  paddingY: 0,
  storiesPerPage: 1,
  stories: [
    {
      id: "ielts",
      name: "IELTS Preparation",
      image,
      university: "Online with TestPrep Center",
      showEyebrow: true,
      subject: "English test skills",
      description:
        "Set a realistic target, build each IELTS skill, and use focused online practice to prepare with confidence.",
    },
    {
      id: "abroad",
      name: "Study Abroad Guidance",
      image,
      university: "Online with TestPrep Center",
      showEyebrow: true,
      subject: "International education planning",
      description:
        "Understand destinations, applications, documents, and the practical steps needed for your study-abroad plan.",
    },
    {
      id: "kids",
      name: "TPC Kids",
      image,
      university: "Online with TestPrep Center",
      showEyebrow: true,
      subject: "Spoken English",
      description:
        "Give young learners a friendly place to practise everyday English communication and grow their confidence.",
    },
  ],
};
