/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ISection40Data {
  id: string;
  eyebrow: string;
  showEyebrow: boolean;
  title: string;
  highlightedTitle: string;
  paragraphs: string[];
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  onlineAppointmentImage: string;
  physicalAppointmentImage: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  textColor: string;
  buttonColor: string;
}

export type Section40Data = ISection40Data;

export interface Section40Payload extends Section40Data {
  paddingX: number;
  paddingY: number;
}

export interface Section40Props {
  data?: Section40Data | Section40Payload | string;
}

export const defaultDataSection40: Section40Data = {
  id: "section-uid-40",
  eyebrow: "NexaMart Consultation",
  showEyebrow: true,
  title: "Get Your",
  highlightedTitle: "Free Consultation",
  paragraphs: [
    "Book a free consultation with NexaMart to discuss your study-abroad goals. Our experienced counselors will help you understand suitable destinations, courses, universities, and the next steps for your application.",
    "NexaMart supports students across Bangladesh. Whether you live in Dhaka or anywhere else in the country, you can connect with our team through an online consultation and receive personalized guidance without unnecessary travel.",
    "Bring your academic information and questions to your consultation so our team can provide clear, relevant guidance for your international education journey.",
  ],
  primaryButtonText: "Book Consultation",
  primaryButtonUrl: "#",
  secondaryButtonText: "Ask Question",
  secondaryButtonUrl: "#",
  onlineAppointmentImage: "https://placehold.co/720x520/dbeafe/1d4ed8?text=Online+Appointment",
  physicalAppointmentImage: "https://placehold.co/720x520/e2e8f0/475569?text=In-Person+Consultation",
  backgroundColor: "#ffffff",
  headingColor: "#050505",
  accentColor: "#2477f2",
  textColor: "#5f6780",
  buttonColor: "#2477f2",
};

export const defaultData = defaultDataSection40;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
