/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface RefundPolicySection {
  id?: string;
  eyebrow?: string;
  showEyebrow: boolean;
  title: string;
  description?: string;
  items?: string[];
}
export interface IPage7Data {
  pageUid: string;
  pageName: string;
  title: string;
  eyebrow: string;
  showEyebrow: boolean;
  image: string;
  paddingX: number;
  paddingY: number;
  lastUpdatedLabel: string;
  highlightTitle: string;
  highlightDescription: string;
  sections: RefundPolicySection[];
  contactTitle: string;
  contactDescription: string;
  supportEmail: string;
}
export interface Page7Props {
  data?: IPage7Data | string;
}

export const defaultRefundPolicySection: RefundPolicySection = {
  eyebrow: "New section",
  showEyebrow: true,
  title: "New Policy Section",
  description: "Write the policy details for this section.",
  items: [],
};

export const defaultDataPage7: IPage7Data = {
  pageUid: "page-uid-refund-policy",
  pageName: "TestPrep Center Refund and Cancellation Policy",
  title: "Refund Policy",
  eyebrow: "Refund and cancellation guidance",
  showEyebrow: true,
  image: "/images/all-pages-placeholder.png",
  paddingX: 0,
  paddingY: 0,
  lastUpdatedLabel: "Last updated: 24 August 2026",
  highlightTitle: "Fair and clear review",
  highlightDescription:
    "Every eligible request is reviewed against the selected program, invoice, and applicable service terms. We aim to communicate the outcome and next steps clearly.",
  sections: [
    {
      eyebrow: "Overview",
      showEyebrow: true,
      title: "Refund policy overview",
      description:
        "Refund eligibility depends on the selected course or guidance service, payment terms, and the applicable service conditions.",
    },
    {
      eyebrow: "Eligibility",
      showEyebrow: true,
      title: "Eligible refund requests",
      description:
        "You may request a review when a paid service has not started, a duplicate payment was made, or we cannot deliver an agreed service for reasons within our control.",
      items: [
        "Submit the request promptly with your invoice or payment reference",
        "Explain the issue and include relevant course, consultation, or account details",
        "Refunds are reviewed against the scope and payment terms agreed for the service",
      ],
    },
    {
      eyebrow: "Exclusions",
      showEyebrow: true,
      title: "Services that may not be refundable",
      description:
        "Fees for completed classes, delivered consultations, used learning access, third-party charges, and completed service stages may be non-refundable unless the applicable terms state otherwise.",
      items: [
        "Classes, consultations, or guidance already delivered",
        "Third-party application, testing, payment-gateway, or platform costs",
        "Delays caused by missing learner information, documents, or responses",
      ],
    },
    {
      eyebrow: "Review",
      showEyebrow: true,
      title: "Review and payment",
      description:
        "After receiving a complete request, we will review it and share the decision and next steps. Approved refunds are returned through the original payment method or another reasonable method permitted in Bangladesh.",
      items: [
        "Processing time may depend on the payment provider or bank",
        "Approved amounts may exclude non-refundable third-party costs",
        "A partial refund may apply where only part of a service remains undelivered",
      ],
    },
  ],
  contactTitle: "Need help with a refund request?",
  contactDescription:
    "Please contact TestPrep Center through the official support channel and include your invoice or payment reference so we can review your request.",
  supportEmail: "01786558855",
};
