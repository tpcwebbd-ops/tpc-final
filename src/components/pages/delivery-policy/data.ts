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
        "TestPrep Center provides its learning and guidance services online for learners across Bangladesh.",
    },
    {
      title: "2. Enrolment and service access",
      items: [
        "Contact TPC to discuss the program or guidance you need.",
        "Course schedules, learning access, and consultation steps are shared before you begin.",
        "Updates are shared through the agreed online contact channel.",
      ],
    },
    {
      title: "3. Delivery Format",
      description:
        "IELTS preparation, study-abroad guidance, and TPC Kids Spoken English are delivered online through the formats confirmed for your selected service.",
    },
    {
      title: "4. Learning and guidance updates",
      description:
        "TestPrep Center shares relevant learning, consultation, and next-step updates through the agreed contact channel.",
    },
  ],
  helpTitle: "Need Help?",
  helpDescription: "If you have questions about an online course, study-abroad guidance, or service access, contact TestPrep Center on WhatsApp.",
  supportEmail: "01786558855",
};

export const defaultDeliveryPolicySection: DeliveryPolicySection = {
  title: "New Policy Section",
  description: "Write the policy details for this section.",
  items: [],
};
