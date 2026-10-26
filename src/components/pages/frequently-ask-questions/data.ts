/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

export const defaultQuestions = [
  {
    question: "What does TestPrep Center offer?",
    answer:
      "TestPrep Center offers online IELTS preparation, study-abroad guidance, and TPC Kids spoken English courses for learners in Bangladesh.",
  },
  {
    question: "Are TPC services available online?",
    answer:
      "Yes. TestPrep Center provides its learning and guidance services online, so you can connect from anywhere in Bangladesh.",
  },
  {
    question: "Who can join an IELTS preparation program?",
    answer:
      "Anyone preparing for IELTS can contact TPC to discuss their current level, target score, and the best next step.",
  },
  {
    question: "Can TPC help me plan to study abroad?",
    answer:
      "Yes. TPC can help you understand study destinations, applications, documents, and the preparation needed for your study-abroad goal.",
  },
  {
    question: "Does TPC guarantee admission or a visa?",
    answer:
      "No. Universities and immigration authorities make their own decisions. TPC provides preparation and guidance, not guaranteed outcomes.",
  },
  {
    question: "What is TPC Kids Spoken English?",
    answer:
      "TPC Kids Spoken English is an online course designed to help young learners practise everyday English communication with confidence.",
  },
  {
    question: "How can I speak with TestPrep Center?",
    answer: "Call or WhatsApp TestPrep Center at 01786558855, or connect through the official Facebook page.",
  },
  {
    question: "Where can I join the TPC Kids community?",
    answer: "You can join the TPC Kids Facebook Group at facebook.com/groups/tpckids for community updates.",
  },
];

export const defaultData = {
  title: "Frequently Asked Questions",
  intro:
    "Find clear answers about TPC's online IELTS preparation, study-abroad guidance, and kids' spoken English courses.",
  questionsJson: JSON.stringify(defaultQuestions),
};
