/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection41Data {
  id: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  backgroundColor: string;
  headingColor: string;
  textColor: string;
}

export type Section41Data = ISection41Data;

export interface Section41Payload extends Section41Data {
  paddingX: number;
  paddingY: number;
}

export interface Section41Props {
  data?: Section41Data | Section41Payload | string;
}

export const defaultDataSection41: Section41Data = {
  id: "section-uid-41",
  title: "Study in United States from Bangladesh for Higher Education",
  paragraphs: [
    "Studying in United States is a transformative experience that opens doors to new opportunities, cultures, and global networking. For Bangladeshi students seeking premium educational credentials and excellent career development, United States stands out as a top-tier destination.",
    "The USA hosts the largest number of top-ranked universities globally. It is renowned for its flexible curriculum, cutting-edge research, and extensive OPT (Optional Practical Training) work rights for STEM graduates. Under the guidance of NexaMart, the entire path—from university shortlisting and scholarship search to visa approvals—becomes stress-free and highly efficient.",
  ],
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Study destination placeholder image",
  backgroundColor: "#f6f7f9",
  headingColor: "#252d8f",
  textColor: "#202641",
};

export const defaultData = defaultDataSection41;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
