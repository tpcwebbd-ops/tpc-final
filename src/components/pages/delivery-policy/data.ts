/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface DeliveryPolicySection {
  title: string;
  description?: string;
  items?: string[];
}

export interface IDeliveryPolicyData {
  pageUid: string;
  pageName: string;
  title: string;
  lastUpdatedLabel: string;
  sections: DeliveryPolicySection[];
  helpTitle: string;
  helpDescription: string;
  supportEmail: string;
}

export interface DeliveryPolicyPayload extends IDeliveryPolicyData {
  paddingX: number;
  paddingY: number;
}

export interface DeliveryPolicyProps {
  data?: IDeliveryPolicyData | DeliveryPolicyPayload | string;
}

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataDeliveryPolicy: IDeliveryPolicyData = {
  pageUid: "delivery-policy-uid",
  pageName: "Service Delivery Policy",
  title: "Service Delivery Policy",
  lastUpdatedLabel: "Last updated: Today",
  sections: [
    {
      title: "1. Service Area",
      description:
        "NexaMart currently serves the regions listed on this site. Contact the team to confirm that support is available for your project or request.",
    },
    {
      title: "2. Planning & Delivery Time",
      items: [
        "Initial requests are usually reviewed within 1-2 business days.",
        "Project timelines are confirmed in the approved proposal.",
        "Updates are shared at the milestones agreed for the work.",
      ],
    },
    {
      title: "3. Delivery Format",
      description:
        "Project deliverables are provided in the format agreed with you. Any additional costs are documented in the applicable proposal or agreement.",
    },
    {
      title: "4. Project Updates",
      description:
        "NexaMart shares progress updates through the agreed contact channel so you can follow the work and next steps.",
    },
  ],
  helpTitle: "Need Help?",
  helpDescription:
    "If you have questions about a project or its agreed timeline, contact NexaMart support.",
  supportEmail: "example@gmail.com",
};

export const defaultDeliveryPolicySection: DeliveryPolicySection = {
  title: "New Policy Section",
  description: "Write the policy details for this section.",
  items: [],
};
