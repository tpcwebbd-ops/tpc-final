/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface CatalogueStat {
  id: string;
  value: string;
  label: string;
}

export interface CatalogueService {
  id: string;
  slug: string;
  eyebrow: string;
  showEyebrow?: boolean;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  outcome: string;
  duration: string;
  features: string[];
  process: string[];
  ctaText: string;
  ctaUrl: string;
}

export interface CatalogueStep {
  id: string;
  title: string;
  description: string;
}

export interface CatalogueBenefit {
  id: string;
  title: string;
  description: string;
}

export interface CatalogueFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IVisaServicesData {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  showEyebrow: boolean;
  heroTitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  trustNote: string;
  stats: CatalogueStat[];
  catalogueEyebrow: string;
  showCatalogueEyebrow: boolean;
  catalogueTitle: string;
  catalogueDescription: string;
  services: CatalogueService[];
  processEyebrow: string;
  showProcessEyebrow: boolean;
  processTitle: string;
  processDescription: string;
  processSteps: CatalogueStep[];
  benefitsEyebrow: string;
  showBenefitsEyebrow: boolean;
  benefitsTitle: string;
  benefitsDescription: string;
  benefits: CatalogueBenefit[];
  faqEyebrow: string;
  showFaqEyebrow: boolean;
  faqTitle: string;
  faqDescription: string;
  faqs: CatalogueFaq[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  companyName: string;
  companyEmail: string;
  companyContact: string;
  backgroundColor: string;
  surfaceColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
  accentDarkColor: string;
}

export interface VisaServicesPayload extends IVisaServicesData {
  paddingX: number;
  paddingY: number;
}

export interface VisaServicesProps {
  data?: IVisaServicesData | VisaServicesPayload | string;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataVisaServices: IVisaServicesData = {
  pageUid: "visa-services-uid",
  pageName: "Service Catalogue",
  eyebrow: "Study abroad support, thoughtfully connected",
  showEyebrow: true,
  heroTitle: "One catalogue. Every critical application detail.",
  heroDescription:
    "Explore focused support for digital visas, statements of purpose, visa applications, and document legalization—delivered with clear milestones and careful human review.",
  primaryButtonText: "Explore Our Services",
  primaryButtonUrl: "#services",
  secondaryButtonText: "Book a Consultation",
  secondaryButtonUrl: "/consultation",
  trustNote: "Clear scope · Dedicated guidance · No unrealistic promises",
  stats: [
    { id: "stat-services", value: "04", label: "Specialist services" },
    { id: "stat-review", value: "1:1", label: "Advisor-led review" },
    { id: "stat-checks", value: "3×", label: "Quality checkpoints" },
    { id: "stat-support", value: "End-to-end", label: "Application support" },
  ],
  catalogueEyebrow: "Choose your support",
  showCatalogueEyebrow: true,
  catalogueTitle: "Practical services for a stronger study journey",
  catalogueDescription:
    "Select a complete support pathway or start with the service that solves your most urgent application challenge.",
  services: [
    {
      id: "service-evisa",
      slug: "e-visa-processing",
      eyebrow: "01 · Digital visa support",
      showEyebrow: true,
      title: "E-Visa Processing",
      description:
        "Move through online visa portals with an organised digital file, accurate information, and a submission plan tailored to your destination.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing an online visa application together",
      outcome: "A structured, submission-ready digital visa file",
      duration: "Timeline varies by destination",
      features: [
        "Profile and destination requirement review",
        "Digital document checklist and file organisation",
        "Online form and declaration guidance",
        "Pre-submission consistency and quality check",
      ],
      process: [
        "Assess your visa route and application readiness.",
        "Organise evidence for the official online portal.",
        "Review the final file before applicant-approved submission.",
      ],
      ctaText: "Discuss E-Visa Support",
      ctaUrl: "/consultation",
    },
    {
      id: "service-sop",
      slug: "sop-review",
      eyebrow: "02 · Story and structure",
      showEyebrow: true,
      title: "SOP Review",
      description:
        "Turn your draft into a focused, credible statement that connects your academic background, course choice, career direction, and study destination.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student and advisor reviewing a statement of purpose draft",
      outcome: "A polished SOP that still sounds authentically yours",
      duration: "Usually 2–4 working days",
      features: [
        "Structure, clarity, and narrative review",
        "Course and career alignment feedback",
        "Language, tone, and repetition refinement",
        "Final proofread with actionable comments",
      ],
      process: [
        "Share your draft and relevant academic context.",
        "Receive strategic and line-level feedback.",
        "Refine and complete a final quality review.",
      ],
      ctaText: "Review My SOP",
      ctaUrl: "/consultation",
    },
    {
      id: "service-guidance",
      slug: "visa-application-guidance",
      eyebrow: "03 · Application confidence",
      showEyebrow: true,
      title: "Visa Application Guidance",
      description:
        "Understand what to prepare, when to act, and how your documents should work together across each stage of the student visa process.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Visa advisor explaining an application roadmap to a student",
      outcome: "A personalised visa preparation roadmap",
      duration: "From preparation to decision",
      features: [
        "Personal profile and risk-area assessment",
        "Financial and supporting evidence guidance",
        "Application form and timeline planning",
        "Biometrics or interview preparation where relevant",
      ],
      process: [
        "Map your destination-specific application journey.",
        "Prepare and cross-check supporting evidence.",
        "Stay ready for submission and follow-up requests.",
      ],
      ctaText: "Plan My Visa File",
      ctaUrl: "/consultation",
    },
    {
      id: "service-legalization",
      slug: "document-legalization",
      eyebrow: "04 · Verified documents",
      showEyebrow: true,
      title: "Document Legalization",
      description:
        "Prepare academic and personal documents for the authentication, attestation, translation, or legalization route required by your institution or destination.",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Document specialist checking organised academic records with a student",
      outcome: "Correctly prepared documents with a traceable checklist",
      duration: "Depends on document and authority",
      features: [
        "Document-purpose and destination review",
        "Notary, attestation, and legalization pathway guidance",
        "Certified translation coordination guidance",
        "Submission sequence and status checklist",
      ],
      process: [
        "Identify the authority and exact document requirement.",
        "Prepare the required copies, translations, and supporting records.",
        "Follow the correct verification sequence and retain receipts.",
      ],
      ctaText: "Check My Documents",
      ctaUrl: "/consultation",
    },
  ],
  processEyebrow: "How we work",
  showProcessEyebrow: true,
  processTitle: "A clear path from question to completion",
  processDescription:
    "Every engagement begins with your goal and ends with a practical next step. You remain informed and in control throughout.",
  processSteps: [
    {
      id: "step-discover",
      title: "Discover",
      description: "We understand your destination, timeline, documents, and immediate priorities.",
    },
    {
      id: "step-plan",
      title: "Plan",
      description: "You receive a defined scope, requirement checklist, and realistic preparation timeline.",
    },
    {
      id: "step-prepare",
      title: "Prepare",
      description: "We guide the work, review the details, and flag gaps before they become delays.",
    },
    {
      id: "step-progress",
      title: "Progress",
      description: "You approve the final work and move forward with clear records and next actions.",
    },
  ],
  benefitsEyebrow: "The WES difference",
  showBenefitsEyebrow: true,
  benefitsTitle: "Premium support without the confusion",
  benefitsDescription:
    "A detail-conscious service model designed for students who value clarity, accuracy, and responsive communication.",
  benefits: [
    {
      id: "benefit-scope",
      title: "Defined service scope",
      description: "Know what is included, what you need to provide, and what happens next.",
    },
    {
      id: "benefit-human",
      title: "Human-led guidance",
      description: "Receive thoughtful support from an advisor—not generic automated instructions.",
    },
    {
      id: "benefit-detail",
      title: "Detail-focused review",
      description: "We look for missing information, weak explanations, and inconsistent evidence.",
    },
    {
      id: "benefit-flexible",
      title: "Flexible entry point",
      description: "Choose one specialist service or combine support around your application needs.",
    },
    {
      id: "benefit-accessible",
      title: "Accessible communication",
      description: "Get clear, jargon-free updates through a process you can understand.",
    },
    {
      id: "benefit-honest",
      title: "Responsible advice",
      description: "We explain practical risks and never promise an admission or visa outcome.",
    },
  ],
  faqEyebrow: "Service questions",
  showFaqEyebrow: true,
  faqTitle: "Before you choose a service",
  faqDescription: "Answers to common questions about scope, timelines, documents, and getting started.",
  faqs: [
    {
      id: "faq-combine",
      question: "Can I combine more than one service?",
      answer:
        "Yes. After a short assessment, we can recommend a connected support plan—for example, SOP Review followed by Visa Application Guidance.",
    },
    {
      id: "faq-destination",
      question: "Do you support every study destination?",
      answer:
        "Service availability depends on your destination, institution, and application route. Contact us with your profile so we can confirm the appropriate scope.",
    },
    {
      id: "faq-timeline",
      question: "How long will my service take?",
      answer:
        "Timelines depend on the selected service, document readiness, authority requirements, and applicant response time. We confirm an estimated schedule before work begins.",
    },
    {
      id: "faq-guarantee",
      question: "Does using a service guarantee approval?",
      answer:
        "No. Admission and visa decisions are made only by the relevant institution or authority. Our role is to help you prepare carefully and accurately.",
    },
    {
      id: "faq-start",
      question: "What should I send before the first consultation?",
      answer:
        "Share your target country, intended intake, course or admission status, and a short summary of the documents or application stage where you need help.",
    },
  ],
  ctaTitle: "Not sure which service fits?",
  ctaDescription: "Tell us how we can help. NexaMart will help you identify the most useful next step.",
  ctaButtonText: "Talk to an Advisor",
  ctaButtonUrl: "/consultation",
  companyName: "NexaMart",
  companyEmail: "example@gmail.com",
  companyContact: "01711 221122",
  backgroundColor: "#fffdf8",
  surfaceColor: "#f8f3ea",
  headingColor: "#142033",
  textColor: "#475569",
  accentColor: "#e5222a",
  accentDarkColor: "#991b1f",
};
