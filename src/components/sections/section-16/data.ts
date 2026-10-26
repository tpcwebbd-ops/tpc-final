/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section16Props {
  data?: Section16Data | Section16Payload | string;
}

export interface Section16FormProps {
  data?: Section16Data | Section16Payload;
  onSubmit: (values: Section16Data | Section16Payload) => void;
}

export interface Section16Data {
  id: string;
  sectionUid: string;
  buttonName: string;
  buttonIcon: string;
  buttonPath: string;
  isNewTab: boolean;
}

export interface Section16Payload {
  buttonName: string;
  buttonIcon: string;
  buttonPath: string;
  isNewTab: boolean;
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataSection16: Section16Data = {
  id: "section-uid-16",
  sectionUid: "section-uid-16",
  buttonName: "View Guidelines",
  buttonIcon: "doc-icon",
  buttonPath: "/guidelines/student-guidenes",
  isNewTab: true,
};
