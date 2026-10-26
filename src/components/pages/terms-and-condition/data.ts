/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { PageTemplateData, PageTemplateProps, PageTemplateSection } from "../shared/page-types";

export type TermsSection = PageTemplateSection & { id?: string; showEyebrow: boolean };
export type ISection5Data = Omit<PageTemplateData, "sections"> & {
  showEyebrow: boolean;
  image: string;
  paddingX: number;
  paddingY: number;
  sections: TermsSection[];
};
export type Section5Props = PageTemplateProps<ISection5Data>;
export const defaultTermsSection: TermsSection = {
  id: "",
  eyebrow: "New section",
  showEyebrow: true,
  title: "New terms section",
  description: "Add the terms for this section.",
  items: ["Add a key point"],
};

export const defaultDataPage5: ISection5Data = {
  pageUid: "page-uid-terms-and-conditions",
  pageName: "TestPrep Center Terms & Conditions",
  eyebrow: "",
  showEyebrow: false,
  image: "/images/all-pages-placeholder.png",
  paddingX: 0,
  paddingY: 0,
  title: "Terms and Conditions",
  subtitle:
    "These Terms and Conditions govern the use of TestPrep Center's online learning and guidance services. Please read them before using a course, consultation, or website feature.",
  primaryAction: "",
  secondaryAction: "",
  highlightTitle: "Our commitment",
  highlightDescription:
    "TestPrep Center aims to keep online learning and guidance clear, fair, secure, and practical for learners, parents, and visitors.",
  sections: [
    {
      eyebrow: "Acceptance",
      showEyebrow: true,
      title: "Using TestPrep Center services",
      description:
        "By accessing this website, creating an account, requesting information, or using a TestPrep Center course or guidance service, you agree to these Terms and Conditions.",
      items: [
        "Use our services lawfully and responsibly",
        "Provide complete and accurate information",
        "Keep account credentials private and secure",
      ],
    },
    {
      eyebrow: "Services",
      showEyebrow: true,
      title: "Programs, guidance, and access",
      description:
        "The selected course, guidance scope, online access, schedule, and support details are confirmed through the relevant TestPrep Center communication. Availability may vary by program.",
      items: [
        "Course and consultation details are shared before service begins",
        "Learners should provide timely information and responses",
        "Third-party institutions and platforms have their own terms",
      ],
    },
    {
      eyebrow: "Payments",
      showEyebrow: true,
      title: "Fees and billing",
      description:
        "Fees, deposits, and payment schedules are communicated in Bangladeshi Taka (BDT) unless otherwise stated. Access or support may be paused when a required payment remains overdue.",
      items: [
        "Payment terms are shared before service begins",
        "A deposit may be required",
        "Bank charges and approved third-party costs may apply where relevant",
      ],
    },
    {
      eyebrow: "Rights and responsibility",
      showEyebrow: true,
      title: "Learning materials and learner information",
      description:
        "You remain responsible for the information and documents you provide. TestPrep Center learning materials and website content may not be copied or redistributed without permission.",
      items: [
        "Use supplied materials for your own learning",
        "Ensure you have permission to share documents and content",
        "Third-party materials remain subject to their own licenses",
      ],
    },
    {
      eyebrow: "Legal",
      showEyebrow: true,
      title: "Changes and governing law",
      description:
        "TestPrep Center may update these terms when services or legal obligations change. These terms are governed by the applicable laws of Bangladesh.",
      items: [
        "Material updates apply from the revised date shown on this page",
        "Questions can be sent through our official support channel",
        "Call or WhatsApp TestPrep Center at 01786558855 for support",
      ],
    },
  ],
};
