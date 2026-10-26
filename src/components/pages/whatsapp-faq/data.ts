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
  heading: "আপনার সমস্যা বলতে WhatsApp করুন",
  whatsappLabel: "WhatsApp করুন",
  whatsappNumber: "+8801711221122",
  faqs: [
    {
      question: "ওয়েবসাইট তৈরি করতে কত সময় লাগে?",
      answer:
        "সাধারণ বিজনেস ওয়েবসাইট ৭ থেকে ১৪ দিনের মধ্যে তৈরি করা যায়। বড় ফিচার বা কাস্টম সিস্টেম থাকলে সময় বেশি লাগতে পারে।",
    },
    {
      question: "মোবাইল অ্যাপ আর ওয়েব অ্যাপের মধ্যে পার্থক্য কী?",
      answer:
        "ওয়েব অ্যাপ ব্রাউজারে চলে, আর মোবাইল অ্যাপ ফোনে ইনস্টল করতে হয়। বাজেট, ব্যবহারকারী, এবং ফিচারের উপর ভিত্তি করে সঠিক পদ্ধতি বেছে নেওয়া হয়।",
    },
    {
      question: "ডোমেইন ও হোস্টিং কেন দরকার?",
      answer:
        "ডোমেইন হলো ওয়েবসাইটের ঠিকানা, আর হোস্টিং হলো যেখানে ওয়েবসাইটের ফাইল ও ডাটা রাখা হয়। দুটোই লাইভ ওয়েবসাইট চালাতে দরকার।",
    },
    {
      question: "ওয়েবসাইটে পেমেন্ট গেটওয়ে যুক্ত করা যায়?",
      answer:
        "হ্যাঁ, বিকাশ, নগদ, কার্ড বা অন্য পেমেন্ট গেটওয়ে যুক্ত করা যায়। এর জন্য ব্যবসার তথ্য ও গেটওয়ে অ্যাকাউন্ট প্রয়োজন হয়।",
    },
    {
      question: "ওয়েবসাইটের নিরাপত্তা কীভাবে রাখা হয়?",
      answer:
        "SSL, শক্তিশালী লগইন, নিয়মিত আপডেট, ব্যাকআপ, এবং প্রয়োজনীয় সার্ভার কনফিগারেশনের মাধ্যমে নিরাপত্তা উন্নত রাখা হয়।",
    },
  ],
};

export const defaultWhatsAppFaqItem: WhatsAppFaqItem = { question: "নতুন প্রশ্ন", answer: "প্রশ্নের উত্তর লিখুন।" };
