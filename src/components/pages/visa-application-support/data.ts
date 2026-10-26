/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface BangladeshVisaStat {
  id: string;
  value: string;
  label: string;
}

export interface BangladeshVisaService {
  id: string;
  title: string;
  description: string;
  highlight: string;
}

export interface BangladeshVisaStep {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

export interface BangladeshDocumentGroup {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface BangladeshSupportLocation {
  id: string;
  city: string;
  mode: string;
  description: string;
}

export interface BangladeshVisaFeature {
  id: string;
  title: string;
  description: string;
}

export interface BangladeshVisaFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IVisaApplicationSupportData {
  pageUid: string;
  pageName: string;
  heroEyebrow: string;
  showHeroEyebrow: boolean;
  heroTitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  heroNotice: string;
  stats: BangladeshVisaStat[];
  servicesTitle: string;
  servicesEyebrow: string;
  showServicesEyebrow: boolean;
  servicesDescription: string;
  services: BangladeshVisaService[];
  processTitle: string;
  processEyebrow: string;
  showProcessEyebrow: boolean;
  processDescription: string;
  processSteps: BangladeshVisaStep[];
  documentsTitle: string;
  documentsEyebrow: string;
  showDocumentsEyebrow: boolean;
  documentsDescription: string;
  documentGroups: BangladeshDocumentGroup[];
  locationsTitle: string;
  locationsEyebrow: string;
  showLocationsEyebrow: boolean;
  locationsDescription: string;
  supportLocations: BangladeshSupportLocation[];
  featuresTitle: string;
  featuresEyebrow: string;
  showFeaturesEyebrow: boolean;
  featuresDescription: string;
  features: BangladeshVisaFeature[];
  faqTitle: string;
  faqEyebrow: string;
  showFaqEyebrow: boolean;
  faqDescription: string;
  faqs: BangladeshVisaFaq[];
  ctaTitle: string;
  ctaEyebrow: string;
  showCtaEyebrow: boolean;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  companyName: string;
  companyEmail: string;
  companyContact: string;
  officeAddress: string;
  backgroundColor: string;
  surfaceColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
  accentDarkColor: string;
}

export interface VisaApplicationSupportPayload extends IVisaApplicationSupportData {
  paddingX: number;
  paddingY: number;
}

export interface VisaApplicationSupportProps {
  data?: IVisaApplicationSupportData | VisaApplicationSupportPayload | string;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataVisaApplicationSupport: IVisaApplicationSupportData = {
  pageUid: "visa-application-support-uid",
  pageName: "Visa Processing in Bangladesh",
  heroEyebrow: "Student visa guidance from Bangladesh",
  showHeroEyebrow: true,
  heroTitle: "Visa Processing in Bangladesh.",
  heroDescription:
    "NexaMart helps customers find products, place orders, and shop securely with a simple online experience.",
  primaryButtonText: "Book a Visa Assessment",
  primaryButtonUrl: "/consultation",
  secondaryButtonText: "View Processing Steps",
  secondaryButtonUrl: "#visa-process",
  heroNotice: "Local document insight · Destination-specific review · Honest application guidance",
  stats: [
    { id: "stat-review", value: "3-stage", label: "File review process" },
    { id: "stat-guidance", value: "1:1", label: "Advisor consultation" },
    { id: "stat-coverage", value: "Nationwide", label: "Online support" },
    { id: "stat-update", value: "Clear", label: "Progress updates" },
  ],
  servicesTitle: "Practical visa services for Bangladeshi students",
  servicesEyebrow: "Support built around your application",
  showServicesEyebrow: true,
  servicesDescription:
    "Choose the support you need, from early profile planning to submission readiness and post-submission requests.",
  services: [
    {
      id: "service-profile",
      title: "Visa profile assessment",
      description:
        "Review academic history, study gaps, destination choice, funding, travel history, and previous refusals.",
      highlight: "Start with a realistic case review",
    },
    {
      id: "service-checklist",
      title: "Personal document checklist",
      description:
        "Receive a structured checklist based on your destination, institution, sponsor, and personal circumstances.",
      highlight: "Know exactly what to prepare",
    },
    {
      id: "service-finance",
      title: "Financial evidence review",
      description:
        "Organise bank statements, sponsor records, income documents, loans, scholarships, and source-of-funds explanations.",
      highlight: "Build a traceable funding story",
    },
    {
      id: "service-sop",
      title: "SOP and study-plan guidance",
      description:
        "Present your academic progression, course choice, career plan, and genuine study purpose with consistent evidence.",
      highlight: "Connect your story to your documents",
    },
    {
      id: "service-form",
      title: "Application form preparation",
      description:
        "Review declarations, dates, addresses, travel history, family details, and supporting file organisation.",
      highlight: "Reduce avoidable inconsistencies",
    },
    {
      id: "service-interview",
      title: "Interview preparation",
      description:
        "Practise clear answers about your course, university, finances, destination, and long-term career goals.",
      highlight: "Prepare with calm and confidence",
    },
  ],
  processTitle: "A clear visa process from Bangladesh",
  processEyebrow: "How your application moves forward",
  showProcessEyebrow: true,
  processDescription:
    "The exact sequence depends on the destination, but every strong application benefits from early planning, consistent evidence, and a disciplined final review.",
  processSteps: [
    {
      id: "step-consult",
      title: "Initial consultation",
      description: "Discuss your intake, course, destination, admission status, budget, sponsor, and visa history.",
      outcome: "Profile action plan",
    },
    {
      id: "step-checklist",
      title: "Requirement mapping",
      description: "Translate current official requirements into a personalised preparation checklist and timeline.",
      outcome: "Document roadmap",
    },
    {
      id: "step-collect",
      title: "Document collection",
      description: "Collect academic, identity, financial, employment, business, and family evidence from Bangladesh.",
      outcome: "Structured evidence file",
    },
    {
      id: "step-quality",
      title: "Quality and consistency review",
      description:
        "Check names, dates, translations, fund movements, explanations, and form answers across the full file.",
      outcome: "Review findings",
    },
    {
      id: "step-submit",
      title: "Application readiness",
      description:
        "Prepare the final portal upload order, appointment evidence, fee records, and applicant declarations.",
      outcome: "Submission-ready pack",
    },
    {
      id: "step-followup",
      title: "Biometrics and follow-up",
      description:
        "Prepare for biometrics, medicals, credibility interviews, or additional-document requests when required.",
      outcome: "Decision-stage support",
    },
  ],
  documentsTitle: "Prepare a consistent, verifiable visa file",
  documentsEyebrow: "Your document checklist",
  showDocumentsEyebrow: true,
  documentsDescription:
    "Mark the common evidence you already have. Requirements change by destination and applicant, so always confirm your final list against official instructions.",
  documentGroups: [
    {
      id: "documents-identity",
      title: "Identity and civil records",
      description: "Personal records should use consistent English spellings and match the passport.",
      items: [
        "Valid passport",
        "National ID or birth certificate",
        "Passport-size photographs",
        "Marriage or family records if relevant",
      ],
    },
    {
      id: "documents-academic",
      title: "Admission and academics",
      description: "Build a clear timeline from previous study to the planned programme.",
      items: [
        "Offer or enrolment evidence",
        "Certificates and transcripts",
        "English-language result",
        "CV, SOP, and study-gap explanation",
      ],
    },
    {
      id: "documents-financial",
      title: "Funds and sponsor evidence",
      description: "Explain where the money came from, who controls it, and how study costs will be paid.",
      items: [
        "Bank statements and solvency evidence",
        "Sponsor letter and relationship proof",
        "Income, tax, salary, or business records",
        "Loan, scholarship, or tuition receipts",
      ],
    },
    {
      id: "documents-visa",
      title: "Visa and supporting records",
      description: "Complete the destination-specific evidence needed around the core file.",
      items: [
        "Application form and fee receipt",
        "Medical or police certificate if requested",
        "Insurance and accommodation evidence",
        "Certified translations and affidavits",
      ],
    },
  ],
  locationsTitle: "Local understanding, nationwide access",
  locationsEyebrow: "Support wherever you are in Bangladesh",
  showLocationsEyebrow: true,
  locationsDescription:
    "Students can prepare remotely while receiving guidance shaped by common documentation workflows in Bangladesh.",
  supportLocations: [
    {
      id: "location-dhaka",
      city: "Dhaka",
      mode: "Consultation support",
      description: "Guidance for document review, financial planning, application preparation, and follow-up.",
    },
    {
      id: "location-chattogram",
      city: "Chattogram",
      mode: "Online and scheduled support",
      description: "Structured remote preparation for students and sponsors in the greater Chattogram region.",
    },
    {
      id: "location-sylhet",
      city: "Sylhet",
      mode: "Family and sponsor guidance",
      description: "Clear support for sponsor relationships, remittance records, and source-of-funds evidence.",
    },
    {
      id: "location-rajshahi",
      city: "Rajshahi",
      mode: "Remote file review",
      description: "Digital review for academic, funding, translation, and application documents.",
    },
    {
      id: "location-khulna",
      city: "Khulna",
      mode: "Remote preparation",
      description: "Step-by-step visa file planning without repeated travel to Dhaka.",
    },
    {
      id: "location-nationwide",
      city: "All Bangladesh",
      mode: "Secure online support",
      description: "Nationwide consultations and document guidance for students wherever they live.",
    },
  ],
  featuresTitle: "Careful guidance without unrealistic promises",
  featuresEyebrow: "Why customers choose NexaMart",
  showFeaturesEyebrow: true,
  featuresDescription:
    "We focus on preparation quality, applicant understanding, and honest next steps. The immigration authority always makes the final decision.",
  features: [
    {
      id: "feature-local",
      title: "Bangladesh document insight",
      description: "Understand common local records, translations, sponsor evidence, and verification concerns.",
    },
    {
      id: "feature-destination",
      title: "Destination-specific planning",
      description: "Prepare against the current official process used by the chosen destination.",
    },
    {
      id: "feature-human",
      title: "Human file review",
      description: "A trained advisor looks for gaps, contradictions, and weak supporting explanations.",
    },
    {
      id: "feature-progress",
      title: "Visible next actions",
      description: "Know which items are ready, what needs revision, and what remains outstanding.",
    },
    {
      id: "feature-integrity",
      title: "Ethical application support",
      description: "No fake documents, false statements, or guaranteed-outcome claims.",
    },
    {
      id: "feature-family",
      title: "Sponsor-friendly guidance",
      description: "Help families understand the evidence, timing, and responsibilities involved.",
    },
  ],
  faqTitle: "Student visa processing FAQs",
  faqEyebrow: "Questions before you begin",
  showFaqEyebrow: true,
  faqDescription: "Straightforward answers about preparing and submitting a student visa application from Bangladesh.",
  faqs: [
    {
      id: "faq-start",
      question: "When should I begin visa preparation in Bangladesh?",
      answer:
        "Begin as early as possible after choosing a destination. Admission, financial holding periods, translations, medicals, police certificates, and appointment availability can all affect timing.",
    },
    {
      id: "faq-bank",
      question: "Can my parents sponsor my studies?",
      answer:
        "Often yes, but the acceptable sponsor relationship and required evidence vary. You may need relationship documents, sponsor declarations, bank records, income evidence, tax documents, and a clear source-of-funds explanation.",
    },
    {
      id: "faq-translation",
      question: "Do Bangla documents need translation?",
      answer:
        "Many authorities require documents not written in an accepted language to be translated by an approved or qualified translator. Follow the exact translation and certification rules for your destination.",
    },
    {
      id: "faq-interview",
      question: "Will I need a visa interview?",
      answer:
        "Some destinations or applications require an interview, credibility call, or additional verification. Be ready to explain your course, university, finances, study history, and career plan consistently.",
    },
    {
      id: "faq-guarantee",
      question: "Does NexaMart guarantee visa approval?",
      answer:
        "No. Only the relevant immigration authority can approve a visa. NexaMart helps customers find products, place orders, and shop securely.",
    },
    {
      id: "faq-refusal",
      question: "Can I apply again after a refusal?",
      answer:
        "Reapplication may be possible, but first review the refusal reasons carefully. Address the specific evidence or credibility issues and obtain qualified advice before submitting again.",
    },
  ],
  ctaTitle: "Start your visa preparation from Bangladesh",
  ctaEyebrow: "Ready for your next step?",
  showCtaEyebrow: true,
  ctaDescription: "Contact NexaMart for help finding products, placing orders, or receiving shopping support.",
  ctaButtonText: "Talk to a Visa Advisor",
  ctaButtonUrl: "/consultation",
  companyName: "NexaMart",
  companyEmail: "example@gmail.com",
  companyContact: "01711 221122",
  officeAddress: "Bangladesh",
  backgroundColor: "#fffdf8",
  surfaceColor: "#f8f3ea",
  headingColor: "#13251f",
  textColor: "#475569",
  accentColor: "#f42a41",
  accentDarkColor: "#006a4e",
};
