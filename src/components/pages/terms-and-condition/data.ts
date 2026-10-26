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
  pageName: "Site Terms & Conditions",
  eyebrow: "",
  showEyebrow: false,
  image: "/images/all-pages-placeholder.png",
  paddingX: 0,
  paddingY: 0,
  title: "Terms and Conditions",
  subtitle:
    "These demo Terms and Conditions govern your use of Site products, websites, platforms, and services. Customize them for your business, offerings, and local legal requirements before publishing.",
  primaryAction: "",
  secondaryAction: "",
  highlightTitle: "Our commitment",
  highlightDescription:
    "Site aims to keep every digital engagement clear, fair, secure, and practical for customers, partners, and visitors.",
  sections: [
    {
      eyebrow: "Acceptance",
      showEyebrow: true,
      title: "Using Site services",
      description:
        "By accessing this website, creating an account, requesting a quotation, or using a Site product or service, you agree to these Terms and Conditions. If you do not agree, please do not use the services.",
      items: [
        "Use our services lawfully and responsibly",
        "Provide complete and accurate information",
        "Keep account credentials private and secure",
      ],
    },
    {
      eyebrow: "Services",
      showEyebrow: true,
      title: "Scope, delivery, and support",
      description:
        "The scope, timeline, deliverables, revisions, and support period for a project are confirmed in the relevant proposal, order, or service agreement. Any request outside the agreed scope may require a revised timeline and fee.",
      items: [
        "We begin work after required approvals and materials are received",
        "Clients should review deliverables and provide timely feedback",
        "Third-party services may be subject to their own availability and terms",
      ],
    },
    {
      eyebrow: "Payments",
      showEyebrow: true,
      title: "Fees and billing",
      description:
        "All fees, deposits, and payment milestones are communicated in Bangladeshi Taka (BDT) unless otherwise stated. We may pause work, delivery, access, or support when an invoice remains overdue.",
      items: [
        "A deposit may be required before a project starts",
        "Payments are due according to the applicable invoice or agreement",
        "Taxes, bank charges, and approved third-party costs may apply where relevant",
      ],
    },
    {
      eyebrow: "Rights and responsibility",
      showEyebrow: true,
      title: "Content, data, and intellectual property",
      description:
        "You remain responsible for the content, data, and permissions you provide to Site. Ownership of final project deliverables transfers only as stated in the applicable agreement and after full payment is received.",
      items: [
        "You must have permission to use supplied content and brand assets",
        "Our pre-existing tools, code, methods, and templates remain our property",
        "Open-source and third-party software are governed by their respective licenses",
      ],
    },
    {
      eyebrow: "Legal",
      showEyebrow: true,
      title: "Liability, changes, and governing law",
      description:
        "To the extent permitted by law, Site is not liable for indirect losses, loss of profits, or interruptions caused by third-party systems, networks, or events beyond reasonable control. We may update these terms when services or legal obligations change.",
      items: [
        "Material updates apply from the revised date shown on this page",
        "These terms are governed by the applicable laws of Bangladesh",
        "Questions about these terms can be sent through our official support channel",
      ],
    },
  ],
};
