/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { PageTemplateData } from "../shared/page-types";

export type ISiteTermsAndConditionsData = PageTemplateData;

export interface SiteTermsAndConditionsPayload extends ISiteTermsAndConditionsData {
  paddingX: number;
  paddingY: number;
}

export type SiteTermsAndConditionsProps = {
  data?: ISiteTermsAndConditionsData | SiteTermsAndConditionsPayload | string;
};

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataSiteTermsAndConditions: ISiteTermsAndConditionsData = {
  pageUid: "site-terms-and-conditions-uid",
  pageName: "TestPrep Center Terms & Conditions",
  eyebrow: "Terms & Conditions",
  title: "The rules and responsibilities for using TestPrep Center's website and services.",
  subtitle:
    "These Terms & Conditions explain how TestPrep Center provides services, outline customer responsibilities, and describe payments, intellectual property, and limitations of liability.",
  primaryAction: "Read Terms",
  secondaryAction: "Contact TestPrep Center",
  sections: [
    {
      eyebrow: "Acceptance",
      title: "Using the website",
      description:
        "By browsing this website, submitting forms, or requesting services from TestPrep Center, visitors agree to these terms.",
      items: [
        "Use the website lawfully",
        "Provide accurate information",
        "Stop using the website if terms are not accepted",
      ],
    },
    {
      eyebrow: "Services",
      title: "Programs and guidance",
      description:
        "TestPrep Center confirms the selected program or guidance scope, online access, schedule, and next steps through the applicable service communication.",
      items: [
        "Program and guidance details are shared before enrolment or service begins",
        "Schedule or service changes may affect availability or fees",
        "Learners should provide accurate, timely information where needed",
      ],
    },
    {
      eyebrow: "Payments",
      title: "Fees and billing",
      description:
        "Fees, payment schedules, and any deposit requirements are shared for the selected online program or guidance service.",
      items: ["Payment terms are shared before service begins", "Deposits may be required", "Late payments can delay access or service"],
    },
    {
      eyebrow: "Ownership",
      title: "Learning materials and content",
      description:
        "Learning materials, website content, and third-party resources remain subject to the permissions and terms shared with learners.",
      items: [
        "Do not copy or redistribute learning materials without permission",
        "Learners remain responsible for documents and information they provide",
        "Third-party tools and institutions follow their own terms",
      ],
    },
    {
      eyebrow: "Contact",
      title: "Terms questions and support",
      description:
        "Contact TestPrep Center if you have questions or need clarification about these Terms & Conditions.",
      items: ["Call or WhatsApp: 01786558855", "Facebook: facebook.com/TestPrepCenter.BD"],
    },
  ],
};
