/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IFeatureItem {
  title: string;
  subtitle: string;
  iconName: string;
  iconColorClass: string;
  bgColorClass: string;
}

export interface IStatItem {
  value: string;
  label: string;
  colorClass: string;
}

export interface ISection24Data {
  sectionUid: string;
  features: IFeatureItem[];
  stats: IStatItem[];
  ctaText: string;
  ctaLink: string;
}

export interface Section24Props {
  data?: ISection24Data | Section24Payload | string;
}

export const defaultDataSection24: ISection24Data = {
  sectionUid: "section-uid-24",
  features: [
    {
      title: "Real Test Format",
      subtitle: "Authentic IELTS exam experience",
      iconName: "FileText",
      iconColorClass: "text-red-500",
      bgColorClass: "bg-red-100",
    },
    {
      title: "Instant Results",
      subtitle: "Get your scores immediately",
      iconName: "Clock",
      iconColorClass: "text-orange-500",
      bgColorClass: "bg-orange-100",
    },
    {
      title: "Detailed Explanation",
      subtitle: "Learn from every question",
      iconName: "Target",
      iconColorClass: "text-green-500",
      bgColorClass: "bg-green-100",
    },
  ],
  stats: [
    { value: "50K+", label: "Students Tested", colorClass: "text-red-500" },
    { value: "8.5", label: "Average Band Score", colorClass: "text-orange-500" },
    { value: "95%", label: "Success Rate", colorClass: "text-green-500" },
  ],
  ctaText: "TAKE A TEST",
  ctaLink: "/test",
};

export const defaultData = defaultDataSection24;

export interface Section24Payload extends ISection24Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };
