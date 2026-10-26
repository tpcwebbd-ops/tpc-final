/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface Section45Document {
  id: string;
  text: string;
}

export interface ISection45Data {
  id: string;
  title: string;
  introduction: string;
  documents: Section45Document[];
  imageUrl: string;
  imageAlt: string;
  backgroundColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
}

export type Section45Data = ISection45Data;

export interface Section45Payload extends Section45Data {
  paddingX: number;
  paddingY: number;
}

export interface Section45Props {
  data?: Section45Data | Section45Payload | string;
}

export const defaultDataSection45: Section45Data = {
  id: "section-uid-45",
  title: "Essential Documents for United Kingdom Student Visa",
  introduction:
    "To help avoid processing delays, make sure every supporting document is accurate, current, and complete. The typical checklist for Bangladeshi students includes:",
  documents: [
    { id: "document-passport", text: "Valid Passport (with at least 6 months validity from date of travel)" },
    { id: "document-acceptance", text: "Confirmation of Acceptance for Studies (CAS) from your UK institution" },
    {
      id: "document-finance",
      text: "Proof of Financial Support for living costs and any required tuition fees",
    },
    { id: "document-academic", text: "Educational Certificates & Transcripts (SSC, HSC, Bachelor marksheet)" },
    { id: "document-language", text: "English Proficiency Evidence required by your programme" },
    { id: "document-sop", text: "Statement of Purpose (SOP) detailing academic and career plans" },
    { id: "document-insurance", text: "Tuberculosis Test Certificate or other health evidence, where required" },
  ],
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Study destination placeholder image",
  backgroundColor: "#f8f9fb",
  headingColor: "#24349a",
  textColor: "#202641",
  accentColor: "#ef0b5b",
};

export const defaultData = defaultDataSection45;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
