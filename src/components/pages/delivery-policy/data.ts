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
  pageName: "Delivery Policy",
  title: "Delivery Policy",
  lastUpdatedLabel: "Last updated: Today",
  sections: [
    {
      title: "1. Shipping Destinations",
      description:
        "NexaMart currently delivers within the service areas shown at checkout. Please provide a complete, accurate address to help us avoid delivery delays.",
    },
    {
      title: "2. Processing & Delivery Time",
      items: [
        "Processing: Orders are typically processed within 1-2 business days.",
        "Standard Shipping: 5-7 business days.",
        "Express Shipping: 1-2 business days.",
      ],
    },
    {
      title: "3. Shipping Rates",
      description:
        "Delivery costs are calculated at checkout based on your location and order details. NexaMart may offer free delivery when an order reaches the minimum amount shown at checkout.",
    },
    {
      title: "4. Order Tracking",
      description:
        "Once an order ships, NexaMart will send a confirmation email with available tracking details so you can monitor its delivery status.",
    },
  ],
  helpTitle: "Need Help?",
  helpDescription:
    "If you have questions about delivery or an order has not arrived within the expected timeframe, contact NexaMart support.",
  supportEmail: "example@gmail.com",
};

export const defaultDeliveryPolicySection: DeliveryPolicySection = {
  title: "New Policy Section",
  description: "Write the policy details for this section.",
  items: [],
};
