/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { PageTemplateData, PageTemplateProps, PageTemplateSection } from "../shared/page-types";

export type PrivacySection = PageTemplateSection & { id?: string; showEyebrow: boolean };
export type ISection4Data = Omit<PageTemplateData, "sections"> & {
  showEyebrow: boolean;
  image: string;
  paddingX: number;
  paddingY: number;
  sections: PrivacySection[];
};
export type Section4Props = PageTemplateProps<ISection4Data>;

export const defaultDataPage4: ISection4Data = {
  pageUid: "page-uid-privacy-policy",
  pageName: "TestPrep Center Privacy Policy",
  eyebrow: "",
  showEyebrow: false,
  image: "/images/all-pages-placeholder.png",
  paddingX: 0,
  paddingY: 0,
  title: "Privacy Policy",
  subtitle:
    "This Privacy Policy explains how TestPrep Center may collect, use, store, and protect personal information when providing online learning and guidance services.",
  primaryAction: "",
  secondaryAction: "",
  highlightTitle: "Our privacy commitment",
  highlightDescription:
    "We collect only what we need to provide, protect, and improve TestPrep Center services. We do not sell personal information.",
  sections: [
    {
      eyebrow: "Collection",
      showEyebrow: true,
      title: "Information we collect",
      description:
        "We may collect information you provide directly and limited technical information generated when you use our website, online learning, or support channels.",
      items: [
        "Name, phone number, learning goal, and other details you submit",
        "Course enquiries, study-abroad details, messages, and support requests",
        "Basic device, browser, and website-usage information",
      ],
    },
    {
      eyebrow: "Use",
      showEyebrow: true,
      title: "How we use information",
      description:
        "We use information to respond to requests, provide online learning and guidance, manage accounts and payments, improve services, and protect TestPrep Center from misuse or security incidents.",
      items: [
        "Provide selected courses, guidance, and learner support",
        "Send essential service and account communications",
        "Improve reliability, security, and user experience",
      ],
    },
    {
      eyebrow: "Protection",
      showEyebrow: true,
      title: "How information is protected",
      description:
        "We use reasonable organisational and technical safeguards to protect information. Access is limited to people and service providers who need it to perform authorised work.",
      items: [
        "Role-based access where practical",
        "Reasonable security controls and monitoring",
        "Retention only for as long as needed for service, legal, or operational purposes",
      ],
    },
    {
      eyebrow: "Sharing and rights",
      showEyebrow: true,
      title: "Your choices and requests",
      description:
        "We do not sell personal information. We may share limited information with trusted service providers when needed to operate our services or comply with law. You may request access, correction, or deletion of information you have provided.",
      items: [
        "Third parties must handle information for authorised purposes",
        "Some records may need to be retained for legal or accounting reasons",
        "Contact TestPrep Center through the official support channel for privacy requests",
      ],
    },
  ],
};
