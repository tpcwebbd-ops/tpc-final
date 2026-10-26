/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStatItem {
  value: string;
  label: string;
  iconName: string;
}

export interface Section26Data {
  id: string;
  title: string;
  buttonText: string;
  stats: IStatItem[];
}

export interface Section26Props {
  data?: Section26Data | Section26Payload | string;
}

export const defaultDataSection26: Section26Data = {
  id: "section-uid-26",
  title: "Join Our Success Community",
  buttonText: "Start Your Journey Today",
  stats: [
    { value: "50K+", label: "Students Helped", iconName: "Users" },
    { value: "8.5", label: "Average Band Score", iconName: "TrendingUp" },
    { value: "95%", label: "Success Rate", iconName: "Award" },
    { value: "24/7", label: "Expert Support", iconName: "CheckCircle" },
  ],
};

export interface Section26Payload extends Section26Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };
