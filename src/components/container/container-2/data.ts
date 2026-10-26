/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export type ContainerSortMode = "ascending" | "descending" | "custom";
export type ContainerGridLayout = "1x1" | "1x2" | "1x3";
export type ContainerMobileGridLayout = "1x1" | "1x2";
export const containerGridItemWidth: Record<ContainerGridLayout, string> = {
  "1x1": "100%",
  "1x2": "50%",
  "1x3": `${100 / 3}%`,
};

export const containerMobileGridItemWidth: Record<ContainerMobileGridLayout, string> = {
  "1x1": "100%",
  "1x2": "50%",
};

export interface SeeMoreConfig {
  name: string;
  url: string;
}

export interface TemplateItem {
  id: number;
  sourceProductId?: string;
  productUID?: string;
  title: string;
  price: string;
  views: string;
  rating: number;
  image: string;
  url?: string;
  visible?: boolean;
}

export interface IContainerData {
  containerUid: string;
  containerName: string;
  title: string;
  sectionTitle?: string;
  sortMode: ContainerSortMode;
  gridLayout: ContainerGridLayout;
  mobileGridLayout: ContainerMobileGridLayout;
  seeMore: SeeMoreConfig;
  showSeeMore: boolean;
  showBottomNavigation: boolean;
  viewMoreText?: string;
  buyButtonText: string;
  paddingX?: string;
  paddingY?: string;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontColor?: string;
  titleFontWeight?: string;
  templates: TemplateItem[];
}

export interface ContainerProps {
  data?: IContainerData | string;
}

export const templateImagePlaceholder = "https://i.ibb.co/j3Z3BK6/marketing.png";

export const defaultDataContainer2: IContainerData = {
  containerUid: "container-uid-2",
  containerName: "All Theme",
  title: "All Theme",
  sortMode: "custom",
  gridLayout: "1x3",
  mobileGridLayout: "1x1",
  seeMore: {
    name: "See More",
    url: "/all-container",
  },
  showSeeMore: true,
  showBottomNavigation: true,
  buyButtonText: "Buy Now",
  paddingX: "0",
  paddingY: "0",
  titleFontFamily: "inherit",
  titleFontSize: "24",
  titleFontColor: "#2563eb",
  titleFontWeight: "700",
  templates: [],
};

export default defaultDataContainer2;
