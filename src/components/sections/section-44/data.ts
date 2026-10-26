/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface Section44Requirement {
  id: string;
  title: string;
  description: string;
}

export interface ISection44Data {
  id: string;
  title: string;
  introduction: string;
  requirements: Section44Requirement[];
  imageUrl: string;
  imageAlt: string;
  backgroundColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
}

export type Section44Data = ISection44Data;

export interface Section44Payload extends Section44Data {
  paddingX: number;
  paddingY: number;
}

export interface Section44Props {
  data?: Section44Data | Section44Payload | string;
}

export const defaultDataSection44: Section44Data = {
  id: "section-uid-44",
  title: "United Kingdom Student Visa Requirements",
  introduction:
    "Bangladeshi students normally apply for a UK Student visa after receiving a Confirmation of Acceptance for Studies (CAS) from a licensed student sponsor. Prepare your application carefully and provide clear, complete evidence for the key requirements below:",
  requirements: [
    {
      id: "requirement-admission",
      title: "Official Admission:",
      description: "A valid offer and CAS from a licensed UK education provider.",
    },
    {
      id: "requirement-finance",
      title: "Proof of Financial Support:",
      description:
        "Evidence that you can support your living costs and pay any required tuition fees for your period of study.",
    },
    {
      id: "requirement-language",
      title: "Language Proficiency:",
      description:
        "Meet the English-language requirement for your chosen programme, using accepted test results where required.",
    },
    {
      id: "requirement-records",
      title: "Clear Records & Medicals:",
      description:
        "Provide a valid passport and a tuberculosis test certificate or other evidence where required for your application.",
    },
  ],
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Study destination placeholder image",
  backgroundColor: "#f8f9fb",
  headingColor: "#24349a",
  textColor: "#202641",
  accentColor: "#ef0b5b",
};

export const defaultData = defaultDataSection44;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
