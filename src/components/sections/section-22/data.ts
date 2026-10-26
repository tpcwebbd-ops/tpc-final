/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section22Data {
  id: string;
  sectionUid: string;
  height: string;
  width: string;
  background: string;
  display: string;
}

export interface Section22Props {
  data?: Section22Data | Section22Payload | string;
  onChange?: (values: Section22Data | Section22Payload) => void;
  onSubmit?: (values: Section22Data | Section22Payload) => void;
}

export const defaultDataSection22: Section22Data = {
  id: "section-uid-22",
  sectionUid: "section-uid-22",
  height: "h-4",
  width: "w-full",
  background: "transparent",
  display: "block",
};

export interface Section22Payload extends Section22Data {
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };
