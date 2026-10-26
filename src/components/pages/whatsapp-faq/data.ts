/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface WhatsAppFaqItem {
  question: string;
  answer: string;
}

export interface IWhatsAppFaqData {
  pageUid: string;
  pageName: string;
  heading: string;
  whatsappLabel: string;
  whatsappNumber: string;
  faqs: WhatsAppFaqItem[];
}

export interface WhatsAppFaqPayload extends IWhatsAppFaqData {
  paddingX: number;
  paddingY: number;
}

export interface WhatsAppFaqProps {
  data?: IWhatsAppFaqData | WhatsAppFaqPayload | string;
}

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataWhatsAppFaq: IWhatsAppFaqData = {
  pageUid: "whatsapp-faq-uid",
  pageName: "WhatsApp FAQ",
  heading: "Ask TestPrep Center on WhatsApp",
  whatsappLabel: "Chat with TPC",
  whatsappNumber: "01786558855",
  faqs: [
    {
      question: "Can I join IELTS preparation online?",
      answer:
        "Yes. Contact TPC on WhatsApp to discuss your current level, target band score, and available online learning support.",
    },
    {
      question: "Can you help me plan to study abroad?",
      answer:
        "Yes. TPC provides online guidance for learners who want to understand destinations, applications, and preparation for studying abroad.",
    },
    {
      question: "Is there an English-speaking course for children?",
      answer: "Yes. TPC Kids Spoken English helps young learners practise everyday English communication online.",
    },
    {
      question: "How do I get started?",
      answer:
        "Send TPC a WhatsApp message with your learning goal—IELTS, study abroad, or kids' spoken English—and the team will guide you to the next step.",
    },
  ],
};

export const defaultWhatsAppFaqItem: WhatsAppFaqItem = {
  question: "New question",
  answer: "Write a helpful answer for TestPrep Center learners.",
};
