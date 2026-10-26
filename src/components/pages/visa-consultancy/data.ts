/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface ConsultancyStat {
  id: string;
  value: string;
  label: string;
}

export interface ConsultancyService {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

export interface ConsultancyStep {
  id: string;
  title: string;
  description: string;
  milestone: string;
}

export interface ConsultancyDestination {
  id: string;
  country: string;
  flag: string;
  focus: string;
  description: string;
}

export interface ReadinessGroup {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface ConsultancyBenefit {
  id: string;
  title: string;
  description: string;
}

export interface ConsultancyTestimonial {
  id: string;
  quote: string;
  name: string;
  journey: string;
}

export interface ConsultancyFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IVisaConsultancyData {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  showHeroEyebrow: boolean;
  heroTitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  heroNote: string;
  stats: ConsultancyStat[];
  servicesEyebrow: string;
  showServicesEyebrow: boolean;
  servicesTitle: string;
  servicesDescription: string;
  services: ConsultancyService[];
  journeyEyebrow: string;
  showJourneyEyebrow: boolean;
  journeyTitle: string;
  journeyDescription: string;
  journeySteps: ConsultancyStep[];
  destinationsEyebrow: string;
  showDestinationsEyebrow: boolean;
  destinationsTitle: string;
  destinationsDescription: string;
  destinations: ConsultancyDestination[];
  readinessEyebrow: string;
  showReadinessEyebrow: boolean;
  readinessTitle: string;
  readinessDescription: string;
  readinessGroups: ReadinessGroup[];
  benefitsEyebrow: string;
  showBenefitsEyebrow: boolean;
  benefitsTitle: string;
  benefitsDescription: string;
  benefits: ConsultancyBenefit[];
  storiesEyebrow: string;
  showStoriesEyebrow: boolean;
  storiesTitle: string;
  storiesDescription: string;
  testimonials: ConsultancyTestimonial[];
  faqEyebrow: string;
  showFaqEyebrow: boolean;
  faqTitle: string;
  faqDescription: string;
  faqs: ConsultancyFaq[];
  ctaTitle: string;
  ctaEyebrow: string;
  showCtaEyebrow: boolean;
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

export interface VisaConsultancyPayload extends IVisaConsultancyData {
  paddingX: number;
  paddingY: number;
}

export interface VisaConsultancyProps {
  data?: IVisaConsultancyData | VisaConsultancyPayload | string;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataVisaConsultancy: IVisaConsultancyData = {
  pageUid: "visa-consultancy-uid",
  pageName: "Visa Consultancy",
  eyebrow: "Personal study visa consultancy",
  showHeroEyebrow: true,
  heroTitle: "Expert guidance for the decisions behind your visa.",
  heroDescription:
    "A strong student visa journey starts before the application form. NexaMart helps you connect destination choice, admission, funding, documents, and personal goals into one credible plan.",
  primaryButtonText: "Book a Consultation",
  primaryButtonUrl: "/consultation",
  secondaryButtonText: "Explore Our Support",
  secondaryButtonUrl: "#consultancy-services",
  heroNote: "Personal roadmap · Ethical guidance · Destination-specific preparation",
  stats: [
    { id: "stat-plan", value: "360°", label: "Profile review" },
    { id: "stat-advisor", value: "1:1", label: "Advisor sessions" },
    { id: "stat-check", value: "3-stage", label: "Quality review" },
    { id: "stat-support", value: "End-to-end", label: "Journey support" },
  ],
  servicesEyebrow: "Consultancy that moves you forward",
  showServicesEyebrow: true,
  servicesTitle: "Focused support for every important visa decision",
  servicesDescription:
    "Choose complete support or targeted guidance for the part of your study-abroad journey that needs the most attention.",
  services: [
    {
      id: "service-profile",
      title: "Profile and eligibility review",
      description: "Assess academics, gaps, language results, budget, visa history, and destination suitability.",
      outcome: "Realistic options and priorities",
    },
    {
      id: "service-destination",
      title: "Destination strategy",
      description: "Compare study routes, visa expectations, costs, timelines, and long-term opportunities.",
      outcome: "Evidence-based destination shortlist",
    },
    {
      id: "service-admission",
      title: "Admission alignment",
      description: "Connect course selection, institution choice, academic progression, and visa credibility.",
      outcome: "A coherent study pathway",
    },
    {
      id: "service-finance",
      title: "Financial planning",
      description: "Map tuition, living costs, sponsor capacity, loans, scholarships, and source-of-funds evidence.",
      outcome: "Clear and traceable funding plan",
    },
    {
      id: "service-documents",
      title: "Document and SOP review",
      description: "Identify evidence gaps and improve consistency across forms, statements, and supporting records.",
      outcome: "Decision-ready application file",
    },
    {
      id: "service-interview",
      title: "Interview coaching",
      description: "Practise credible answers about your studies, finances, destination, and career goals.",
      outcome: "Calm, consistent communication",
    },
  ],
  journeyEyebrow: "A consultancy journey with structure",
  showJourneyEyebrow: true,
  journeyTitle: "From first conversation to confident submission",
  journeyDescription:
    "Our process turns complex requirements into clear decisions, manageable tasks, and visible progress.",
  journeySteps: [
    {
      id: "journey-discover",
      title: "Discover your goals",
      description: "Share your academic history, career ambitions, preferred intake, budget, and concerns.",
      milestone: "Consultation brief",
    },
    {
      id: "journey-diagnose",
      title: "Diagnose the profile",
      description: "Review strengths, gaps, risks, destination fit, funding capacity, and previous visa history.",
      milestone: "Profile assessment",
    },
    {
      id: "journey-design",
      title: "Design the roadmap",
      description: "Create a destination, admission, funding, and visa preparation plan with practical deadlines.",
      milestone: "Personal action plan",
    },
    {
      id: "journey-prepare",
      title: "Prepare the evidence",
      description: "Organise academic, financial, identity, sponsor, and supporting documents for review.",
      milestone: "Structured visa file",
    },
    {
      id: "journey-refine",
      title: "Refine the application",
      description: "Check forms, SOP, dates, translations, explanations, and supporting evidence for consistency.",
      milestone: "Quality-reviewed pack",
    },
    {
      id: "journey-support",
      title: "Support the final steps",
      description: "Prepare for submission, biometrics, interviews, and additional-document requests.",
      milestone: "Decision-stage readiness",
    },
  ],
  destinationsEyebrow: "Global study expertise",
  showDestinationsEyebrow: true,
  destinationsTitle: "Consultancy shaped around your destination",
  destinationsDescription:
    "Every destination evaluates applicants differently. Our guidance adapts to its study, financial, and visa process.",
  destinations: [
    {
      id: "destination-uk",
      country: "United Kingdom",
      flag: "🇬🇧",
      focus: "Student route",
      description: "CAS, finance, credibility, academic progression, and digital application planning.",
    },
    {
      id: "destination-australia",
      country: "Australia",
      flag: "🇦🇺",
      focus: "Student visa",
      description: "Genuine Student narrative, financial capacity, course logic, and ImmiAccount preparation.",
    },
    {
      id: "destination-canada",
      country: "Canada",
      flag: "🇨🇦",
      focus: "Study permit",
      description: "Purpose of study, financial evidence, ties, portal preparation, and supporting explanations.",
    },
    {
      id: "destination-usa",
      country: "United States",
      flag: "🇺🇸",
      focus: "F-1 visa",
      description: "Institution fit, funding, DS-160 consistency, and student visa interview preparation.",
    },
    {
      id: "destination-europe",
      country: "Europe",
      flag: "🇪🇺",
      focus: "National student visas",
      description: "Country-specific admission, blocked funds, insurance, accommodation, and embassy readiness.",
    },
    {
      id: "destination-new-zealand",
      country: "New Zealand",
      flag: "🇳🇿",
      focus: "Student visa",
      description: "Bona fide study intent, funding, tuition, health, and online application preparation.",
    },
  ],
  readinessEyebrow: "Consultation readiness planner",
  showReadinessEyebrow: true,
  readinessTitle: "See what your advisor needs to understand",
  readinessDescription:
    "Mark the information you can bring to your first consultation. You do not need everything completed before asking for guidance.",
  readinessGroups: [
    {
      id: "readiness-study",
      title: "Study direction",
      description: "Your current ideas about what, where, and when to study.",
      items: [
        "Preferred course or subject",
        "Study level and intake",
        "Destination preferences",
        "Long-term career goal",
      ],
    },
    {
      id: "readiness-academic",
      title: "Academic profile",
      description: "The records that help an advisor understand your progression.",
      items: ["Certificates and transcripts", "English-language result", "Study gaps or course changes", "Academic CV"],
    },
    {
      id: "readiness-finance",
      title: "Budget and funding",
      description: "A realistic view of available funds and sponsor capacity.",
      items: [
        "Estimated family budget",
        "Possible sponsor details",
        "Bank or income overview",
        "Loan or scholarship plans",
      ],
    },
    {
      id: "readiness-history",
      title: "Visa and travel history",
      description: "Previous applications and travel can affect future strategy.",
      items: [
        "Previous visas",
        "Visa refusals if any",
        "International travel history",
        "Immigration or compliance concerns",
      ],
    },
  ],
  benefitsEyebrow: "The WES consultancy difference",
  showBenefitsEyebrow: true,
  benefitsTitle: "Advice built on evidence, not pressure",
  benefitsDescription:
    "We help students and families understand options, risks, responsibilities, and next actions before making major commitments.",
  benefits: [
    {
      id: "benefit-honest",
      title: "Honest profile feedback",
      description: "Understand strengths and risks without guaranteed-outcome promises.",
    },
    {
      id: "benefit-personal",
      title: "Personal recommendations",
      description: "Guidance reflects your academics, finances, goals, and history.",
    },
    {
      id: "benefit-family",
      title: "Family-friendly planning",
      description: "Sponsors understand expected costs, evidence, and responsibilities.",
    },
    {
      id: "benefit-connected",
      title: "One connected roadmap",
      description: "Admission, finance, documents, and visa preparation move together.",
    },
    {
      id: "benefit-explain",
      title: "Clear explanations",
      description: "Complex requirements become understandable decisions and tasks.",
    },
    {
      id: "benefit-ethical",
      title: "Ethical application support",
      description: "No false evidence, hidden shortcuts, or misleading claims.",
    },
  ],
  storiesEyebrow: "Student perspectives",
  showStoriesEyebrow: true,
  storiesTitle: "What thoughtful consultancy should feel like",
  storiesDescription:
    "Illustrative feedback themes that reflect the clarity, structure, and confidence we aim to provide every student.",
  testimonials: [
    {
      id: "story-clarity",
      quote:
        "The consultation helped me stop comparing random countries and focus on the route that matched my academics and family budget.",
      name: "Prospective postgraduate student",
      journey: "Destination planning",
    },
    {
      id: "story-finance",
      quote:
        "My family finally understood which financial documents mattered and why the source of each fund needed to be clear.",
      name: "Student and sponsor",
      journey: "Financial preparation",
    },
    {
      id: "story-confidence",
      quote:
        "The mock interview showed where my answers were inconsistent. I became more confident because I understood my own application.",
      name: "Undergraduate applicant",
      journey: "Interview readiness",
    },
  ],
  faqEyebrow: "Consultancy questions",
  showFaqEyebrow: true,
  faqTitle: "Before you book a visa consultation",
  faqDescription:
    "Straightforward answers about what consultancy includes, when to start, and what outcomes to expect.",
  faqs: [
    {
      id: "faq-consultancy",
      question: "What does a visa consultant do?",
      answer:
        "A responsible consultant helps you understand requirements, evaluate options, organise evidence, identify inconsistencies, and prepare for application steps. The consultant does not make the visa decision.",
    },
    {
      id: "faq-start",
      question: "Should I consult before receiving an offer letter?",
      answer:
        "Yes. Early advice can help align course and institution choices with your profile, budget, long-term plan, and future visa explanation.",
    },
    {
      id: "faq-documents",
      question: "What should I bring to the first consultation?",
      answer:
        "Bring whatever you currently have: academic records, language results, CV, budget information, destination ideas, admission documents, and details of previous visas or refusals.",
    },
    {
      id: "faq-guarantee",
      question: "Can consultancy guarantee a visa?",
      answer:
        "No. Only the immigration authority can approve a visa. Good consultancy improves preparation quality and applicant understanding but cannot guarantee an outcome.",
    },
    {
      id: "faq-family",
      question: "Can my parents or sponsor join the consultation?",
      answer:
        "Yes. Sponsor participation is often useful when discussing budgets, bank evidence, income documents, source of funds, and financial responsibilities.",
    },
    {
      id: "faq-online",
      question: "Is online visa consultancy available?",
      answer:
        "Yes. NexaMart can provide consultations and structured document guidance online, subject to the service arrangement and your preparation needs.",
    },
  ],
  ctaTitle: "Make your next visa decision with clarity",
  ctaEyebrow: "Start with a clear plan",
  showCtaEyebrow: true,
  ctaDescription:
    "Book a personal consultation with NexaMart and leave with a practical roadmap shaped around your study goals, finances, and application profile.",
  ctaButtonText: "Schedule Your Consultation",
  ctaButtonUrl: "/consultation",
  companyName: "NexaMart",
  companyEmail: "info@wesassociates.com",
  companyContact: "+880 1618-118670",
  backgroundColor: "#ffffff",
  surfaceColor: "#f5f8fc",
  headingColor: "#123047",
  textColor: "#526273",
  accentColor: "#0f766e",
  accentDarkColor: "#123047",
};
