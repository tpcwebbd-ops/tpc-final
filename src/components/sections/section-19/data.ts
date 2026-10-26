/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section19Props {
  data?: Section19Data | Section19Payload | string;
}

export interface ITagItem {
  id: string;
  text: string;
  link?: string;
}

export type NavPosition = "middle-outside" | "bottom-outside" | "hidden";
export type TagStyle = "glassy" | "solid" | "outline" | "minimal";
export type ItemsPerSlide = 1 | 2 | 3 | 4 | 5 | 6;

export interface Section19Data {
  id: string;
  tags: ITagItem[];
  sectionUid: string;
  autoplaySpeed: number;
  isAutoplay: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;

  itemsPerSlide: ItemsPerSlide;
  navPosition: NavPosition;

  tagStyle: TagStyle;
  gap: "sm" | "md" | "lg";
}

export const defaultDataSection19: Section19Data = {
  id: "section-uid-19",
  sectionUid: "section-uid-19",
  tags: [
    { id: "1", text: "Technology", link: "#" },
    { id: "2", text: "Design", link: "#" },
    { id: "3", text: "Artificial Intelligence", link: "#" },
    { id: "4", text: "Development", link: "#" },
    { id: "5", text: "UI/UX", link: "#" },
    { id: "6", text: "Business", link: "#" },
    { id: "7", text: "Marketing", link: "#" },
  ],
  autoplaySpeed: 2500,
  isAutoplay: true,
  infiniteLoop: true,
  pauseOnHover: true,
  itemsPerSlide: 4,
  navPosition: "middle-outside",
  tagStyle: "glassy",
  gap: "md",
};

export interface Section19Payload extends Section19Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const STYLE_PRESETS: Record<TagStyle, string> = {
  glassy: "bg-amber-50 border border-[#eadfca] text-amber-950 hover:bg-amber-100",
  solid: "bg-amber-200 border border-amber-300 text-amber-950 hover:bg-amber-300",
  outline: "bg-white border border-[#eadfca] text-stone-700 hover:border-amber-400 hover:text-amber-900",
  minimal: "bg-stone-50 border border-transparent text-stone-600 hover:text-amber-900 hover:bg-amber-50",
};

export interface Section19FormProps {
  data?: Section19Data | Section19Payload;
  onChange?: (values: Section19Data | Section19Payload) => void;
  onSubmit?: (values: Section19Data | Section19Payload) => void;
}
