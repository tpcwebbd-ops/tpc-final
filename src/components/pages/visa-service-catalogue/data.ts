/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface VisaServiceCatalogueItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  points: string[];
}

export interface IVisaServiceCatalogueData {
  pageUid: string;
  pageName: string;
  services: VisaServiceCatalogueItem[];
  backgroundColor: string;
  alternateColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
}

export interface VisaServiceCataloguePayload extends IVisaServiceCatalogueData {
  paddingX: number;
  paddingY: number;
}

export interface VisaServiceCatalogueProps {
  data?: IVisaServiceCatalogueData | VisaServiceCataloguePayload | string;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataVisaServiceCatalogue: IVisaServiceCatalogueData = {
  pageUid: "visa-service-catalogue-uid",
  pageName: "TestPrep Center Study Abroad Support",
  services: [
    {
      id: "study-abroad-planning",
      title: "Study Abroad Planning",
      description: "Clarify your study goal, destination options, timeline, and the next steps for your application.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing an online visa application",
      points: ["Goal review", "Destination research", "Application timeline"],
    },
    {
      id: "sop-review",
      title: "University Application Guidance",
      description:
        "Organise your course choices, application requirements, and supporting documents with clear guidance.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing an SOP draft",
      points: ["Course selection", "Document checklist", "Application plan"],
    },
    {
      id: "visa-application-guidance",
      title: "Student Visa Preparation",
      description: "Understand key visa requirements, documents, and milestones before you submit an application.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Advisor explaining a visa application plan",
      points: ["Profile review", "Document guidance", "Timeline plan"],
    },
    {
      id: "document-legalization",
      title: "SOP and Document Review",
      description:
        "Review your statement of purpose and supporting documents for clarity, consistency, and completeness.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Specialist checking academic documents",
      points: ["SOP feedback", "Document check", "Preparation guidance"],
    },
  ],
  backgroundColor: "#ffffff",
  alternateColor: "#eef4f7",
  headingColor: "#123047",
  textColor: "#526273",
  accentColor: "#0f766e",
};
