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
      id: "1",
      image: "/images/all-pages-placeholder.png",
      title: "A clear place to start.",
      description: "Explore the information, services, and resources available across our site.",
      buttonText: "About us",
      buttonLink: "/about-us",
    },
    {
      id: "2",
      image: "/images/all-pages-placeholder.png",
      title: "Useful updates and guidance.",
      description: "Find answers to common questions and learn how our services work.",
      buttonText: "Frequently asked questions",
      buttonLink: "/frequently-ask-questions",
    },
    {
      id: "3",
      image: "/images/all-pages-placeholder.png",
      title: "Let’s work together.",
      description: "Get in touch to discuss a question, project, or service request.",
      buttonText: "Contact us",
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
