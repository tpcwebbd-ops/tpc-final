/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section18Props {
  data?: Section18Data | Section18Payload | string;
}
export interface ISlideItem {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}
export type NavPosition = "middle-inside" | "middle-outside" | "bottom-overlay" | "bottom-outside";
export type ItemsPerSlide = 1 | 2 | 3 | 4;
export interface Section18Data {
  id: string;
  slides: ISlideItem[];
  sectionUid: string;
  autoplaySpeed: number;
  isAutoplay: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;
  itemsPerSlide: ItemsPerSlide;
  navPosition: NavPosition;
  showArrowsOnHover: boolean;
  height: "auto" | "fixed-sm" | "fixed-md" | "fixed-lg" | "screen";
  overlayOpacity: number;
}
export const defaultDataSection18: Section18Data = {
  id: "section-uid-18",
  sectionUid: "section-uid-18",
  slides: [
    {
      id: "ielts",
      image: "/images/all-pages-placeholder.png",
      title: "Prepare for IELTS online.",
      description: "Build your English test skills with focused support from TestPrep Center.",
      buttonText: "Explore IELTS Support",
      buttonLink: "/contact-us",
    },
    {
      id: "abroad",
      image: "/images/all-pages-placeholder.png",
      title: "Plan your study-abroad journey.",
      description: "Get clear online guidance on destinations, applications, and your next steps.",
      buttonText: "Talk to a Counselor",
      buttonLink: "/contact-us",
    },
    {
      id: "kids",
      image: "/images/all-pages-placeholder.png",
      title: "Help your child speak with confidence.",
      description: "Discover TPC Kids Spoken English for supportive online practice.",
      buttonText: "Contact TPC",
      buttonLink: "/contact-us",
    },
  ],
  autoplaySpeed: 5000,
  isAutoplay: true,
  infiniteLoop: true,
  pauseOnHover: true,
  itemsPerSlide: 1,
  navPosition: "middle-inside",
  showArrowsOnHover: true,
  height: "fixed-md",
  overlayOpacity: 52,
};
export interface Section18Payload extends Section18Data {
  paddingX: number;
  paddingY: number;
}
export const defaultLayout = { paddingX: 0, paddingY: 0 };
export interface Section18FormProps {
  data?: Section18Data | Section18Payload;
  onChange?: (values: Section18Data | Section18Payload) => void;
  onSubmit?: (values: Section18Data | Section18Payload) => void;
}
