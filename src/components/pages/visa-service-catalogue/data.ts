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
  pageName: "Service Catalogue",
  services: [
    {
      id: "e-visa-precessing",
      title: "E-Visa Processing",
      description: "Prepare an organised online visa file with accurate information and a clear submission plan.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing an online visa application",
      points: ["File check", "Form guidance", "Final review"],
    },
    {
      id: "sop-review",
      title: "SOP Review",
      description: "Turn your draft into a focused, credible statement with clear structure and practical feedback.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing an SOP draft",
      points: ["Clear structure", "Better language", "Proofreading"],
    },
    {
      id: "visa-application-guidance",
      title: "Visa-Application Guidance",
      description: "Understand the key requirements, documents, and milestones for a confident visa application.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Advisor explaining a visa application plan",
      points: ["Profile review", "Document guidance", "Timeline plan"],
    },
    {
      id: "document-legalization",
      title: "Document Legalization",
      description:
        "Prepare academic and personal documents for the attestation, translation, or legalization route required.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Specialist checking academic documents",
      points: ["Document check", "Attestation help", "Translation help"],
    },
  ],
  backgroundColor: "#ffffff",
  alternateColor: "#eef4f7",
  headingColor: "#123047",
  textColor: "#526273",
  accentColor: "#0f766e",
};
