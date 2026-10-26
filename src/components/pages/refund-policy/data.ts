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
  pageName: "NexaMart Refund Policy",
  title: "Refund Policy",
  eyebrow: "Refund and cancellation guidance",
  showEyebrow: true,
  image: "/images/all-pages-placeholder.png",
  paddingX: 0,
  paddingY: 0,
  lastUpdatedLabel: "Last updated: 24 August 2026",
  highlightTitle: "Fair and clear review",
  highlightDescription:
    "Every eligible request is reviewed against the relevant proposal, invoice, and service agreement. We aim to communicate the outcome and next steps clearly.",
  sections: [
    {
      eyebrow: "Overview",
      showEyebrow: true,
      title: "Refund policy overview",
      description:
        "NexaMart provides products and related services. Refund eligibility depends on the order, item condition, and the applicable invoice or policy.",
    },
    {
      eyebrow: "Eligibility",
      showEyebrow: true,
      title: "Eligible refund requests",
      description:
        "You may request a review when a paid service has not started, a duplicate payment was made, or we cannot deliver an agreed service for reasons within our control.",
      items: [
        "Submit the request promptly with your invoice or payment reference",
        "Explain the issue and include relevant project or account details",
        "Refunds are reviewed against the scope and payment terms agreed for the service",
      ],
    },
    {
      eyebrow: "Exclusions",
      showEyebrow: true,
      title: "Services that may not be refundable",
      description:
        "Fees for completed work, approved milestones, consumed subscriptions, third-party charges, and customised digital deliverables are generally non-refundable unless the applicable agreement states otherwise.",
      items: [
        "Work already completed or handed over",
        "Third-party licences, domain, hosting, gateway, or platform costs",
        "Delays caused by missing client materials, approvals, or feedback",
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
    "Please contact NexaMart through the official support channel and include your invoice or payment reference so we can review your request.",
  supportEmail: "example@gmail.com",
};
