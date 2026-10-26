/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface CookiePolicySection {
  title: string;
  description?: string;
  items?: string[];
}

export interface ICookiePolicyData {
  pageUid: string;
  pageName: string;
  title: string;
  lastUpdatedLabel: string;
  sections: CookiePolicySection[];
  contactTitle: string;
  contactDescription: string;
  supportEmail: string;
}

export interface CookiePolicyPayload extends ICookiePolicyData {
  paddingX: number;
  paddingY: number;
}

export interface CookiePolicyProps {
  data?: ICookiePolicyData | CookiePolicyPayload | string;
}

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataCookiePolicy: ICookiePolicyData = {
  pageUid: "cookie-policy-uid",
  pageName: "Cookie Policy",
  title: "Cookie Policy",
  lastUpdatedLabel: "Last updated: Today",
  sections: [
    {
      title: "1. What cookies are",
      description:
        "Cookies are small text files placed on your device when you visit a website. They help websites remember information about your visit.",
    },
    {
      title: "2. How NexaMart uses cookies",
      description: "NexaMart may use cookies to:",
      items: [
        "Keep essential website features working.",
        "Understand how visitors use the website.",
        "Remember relevant preferences where available.",
      ],
    },
    {
      title: "3. Managing your choices",
      description:
        "Most browsers let you control or delete cookies through their settings. Blocking some cookies may affect how parts of the website work.",
    },
    {
      title: "4. Updates to this policy",
      description:
        "NexaMart may update this Cookie Policy when its cookie practices change. Please revisit this page from time to time for the latest information.",
    },
  ],
  contactTitle: "Cookie questions",
  contactDescription: "For questions about NexaMart's use of cookies, email example@gmail.com or call 01711 221122.",
  supportEmail: "example@gmail.com",
};

export const defaultCookiePolicySection: CookiePolicySection = {
  title: "New Cookie Policy Section",
  description: "Write the cookie policy details for this section.",
  items: [],
};
