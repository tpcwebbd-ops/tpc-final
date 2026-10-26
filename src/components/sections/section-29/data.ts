/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section29Data {
  id: string;
  title: string;
  subtitle: string;
  buttonPrimaryText: string;
  buttonSecondaryText: string;
  contactLabel: string;
  contactNumber: string;
}

export interface Section29Payload extends Section29Data {
  paddingX: number;
  paddingY: number;
}

export interface Section29Props {
  data?: Section29Data | Section29Payload | string;
}

export const defaultDataSection29: Section29Data = {
  id: "section-uid-29",
  title: "Ready to Start Your IELTS Journey?",
  subtitle: "Join thousands of successful students who achieved their target band scores",
  buttonPrimaryText: "Book Free Consultation",
  buttonSecondaryText: "Watch Class Demo",
  contactLabel: "Call us now for immediate enrollment",
  contactNumber: "📞 +880 1XXX-XXXXXX",
};

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
