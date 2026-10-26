/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

export const defaultQuestions = [
  {
    question: "What does Site do?",
    answer: "Site helps businesses plan and deliver practical digital products, web solutions, and software services.",
  },
  {
    question: "How can I request a project or quotation?",
    answer:
      "Share your requirements through the contact channel. The team will review the scope, priorities, timeline, and next steps.",
  },
  {
    question: "How are project costs and payments handled?",
    answer:
      "Pricing, payment milestones, and any deposit are confirmed in the applicable proposal or invoice before work begins.",
  },
  {
    question: "Can you support an existing website or software product?",
    answer:
      "Yes. An initial review can identify whether maintenance, improvements, or a separate development engagement is the best fit.",
  },
  {
    question: "How do you protect project information?",
    answer:
      "Access is limited to people who need information for authorised work. Avoid sending sensitive credentials through unsecured channels.",
  },
  {
    question: "Where can I get help after delivery?",
    answer:
      "Your proposal or service agreement describes the included support period. Contact Site with the relevant project details for further help.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer:
      "Yes. Site works with businesses at different stages and recommends an approach based on goals, budget, and technical needs.",
  },
  {
    question: "Can Site build a mobile-friendly website?",
    answer:
      "Yes. Web solutions are planned to work across modern desktop, tablet, and mobile devices within the agreed project scope.",
  },
  {
    question: "Will I receive updates during the project?",
    answer:
      "Yes. Progress updates are shared at the milestones agreed for your project, with feedback requested where needed.",
  },
  {
    question: "Can I request changes after a project starts?",
    answer:
      "Yes. Each request is reviewed, and changes outside the approved scope may affect the price, timeline, or both.",
  },
  {
    question: "Do you provide domain and hosting services?",
    answer:
      "Site can help choose, set up, or manage suitable domain and hosting services when included in your agreement.",
  },
  {
    question: "Who owns the final project deliverables?",
    answer:
      "Ownership of final deliverables follows your agreement and normally transfers after applicable payments are received.",
  },
  {
    question: "Can you integrate third-party tools or payment gateways?",
    answer:
      "Yes, where technically suitable and included in scope. Third-party platforms remain subject to their own terms and approvals.",
  },
  {
    question: "What should I prepare before starting a project?",
    answer:
      "Prepare your goals, key requirements, brand assets, content, preferred timeline, and the main contact person for decisions.",
  },
  {
    question: "Can I cancel a project or request a refund?",
    answer:
      "Contact Site to discuss cancellation or a refund request. Eligibility depends on completed work, payments, and the applicable agreement.",
  },
  {
    question: "How can I contact Site?",
    answer:
      "Use the official contact channel and include your name, organisation, and a short description so the team can respond efficiently.",
  },
];

export const defaultData = {
  title: "Frequently Asked Questions",
  intro: "Find clear answers about our services, process, support, and what to prepare before getting started.",
  questionsJson: JSON.stringify(defaultQuestions),
};
