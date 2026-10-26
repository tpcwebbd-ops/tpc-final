/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface VisaRequirementSection {
  id: string;
  title: string;
  items: string[];
}

export interface VisaCountry {
  id: string;
  slug: string;
  flag: string;
  name: string;
  successRate?: string;
  tuitionRange: string;
  tuitionBand: string;
  processingTime: string;
  processingBand: string;
  requiredFunds: string;
  financialBand: string;
  workHours: string;
  prOpportunity: string;
  studyLevels: string[];
  visaType: string;
  englishRequirement: string;
  overview: string;
  countrySpecificRequirements: string[];
  estimatedCosts: string[];
}

export interface VisaTimelineStep {
  id: string;
  title: string;
  description: string;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  items: string[];
}

export interface DownloadResource {
  id: string;
  title: string;
  description: string;
  format: string;
  url: string;
  content: string[];
}

export interface VisaFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IVisaRequirementsData {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  showEyebrow: boolean;
  heroTitle: string;
  heroDescription: string;
  exploreButtonText: string;
  exploreButtonUrl: string;
  checklistButtonText: string;
  checklistButtonUrl: string;
  searchPlaceholder: string;
  countriesTitle: string;
  countriesDescription: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  countries: VisaCountry[];
  requirementSections: VisaRequirementSection[];
  timelineEyebrow: string;
  showTimelineEyebrow: boolean;
  timelineTitle: string;
  timelineDescription: string;
  timeline: VisaTimelineStep[];
  checklistEyebrow: string;
  showChecklistEyebrow: boolean;
  checklistTitle: string;
  checklistDescription: string;
  checklistGroups: ChecklistGroup[];
  downloadsEyebrow: string;
  showDownloadsEyebrow: boolean;
  downloadsTitle: string;
  downloadsDescription: string;
  downloadCompanyName: string;
  downloadCompanyEmail: string;
  downloadCompanyContact: string;
  downloads: DownloadResource[];
  faqEyebrow: string;
  showFaqEyebrow: boolean;
  faqTitle: string;
  faqDescription: string;
  faqSearchPlaceholder: string;
  faqs: VisaFaq[];
  ctaTitle: string;
  ctaDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  backgroundColor: string;
  surfaceColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
  accentDarkColor: string;
}

export interface VisaRequirementsPayload extends IVisaRequirementsData {
  paddingX: number;
  paddingY: number;
}

export interface VisaRequirementsProps {
  data?: IVisaRequirementsData | VisaRequirementsPayload | string;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

const country = (
  id: string,
  slug: string,
  flag: string,
  name: string,
  tuitionRange: string,
  processingTime: string,
  requiredFunds: string,
  workHours: string,
  prOpportunity: string,
  visaType = "Long-stay student visa",
  englishRequirement = "IELTS 6.0+ or equivalent",
  tuitionBand = "€5k–€15k",
  processingBand = "4–8 weeks",
  financialBand = "€10k–€15k",
): VisaCountry => ({
  id,
  slug,
  flag,
  name,
  successRate: "High",
  tuitionRange,
  tuitionBand,
  processingTime,
  processingBand,
  requiredFunds,
  financialBand,
  workHours,
  prOpportunity,
  studyLevels: ["Bachelor", "Master", "PhD"],
  visaType,
  englishRequirement,
  overview: `Plan your studies in ${name} with a clear view of admission, funding, insurance, accommodation, and student visa evidence. Requirements vary by institution, nationality, and embassy.`,
  countrySpecificRequirements: [
    `Confirm the latest ${name} embassy or immigration checklist for your country of residence.`,
    "Use certified translations and legalisation or apostille where requested.",
    "Keep originals and a complete set of clearly labelled copies.",
  ],
  estimatedCosts: [
    `Tuition: ${tuitionRange}`,
    `Maintenance funds: ${requiredFunds}`,
    "Visa, biometrics, translation, insurance, and travel costs vary by applicant.",
  ],
});

export const defaultDataVisaRequirements: IVisaRequirementsData = {
  pageUid: "visa-requirements-uid",
  pageName: "Student Visa Requirements",
  eyebrow: "Study in Europe · 2026 planning hub",
  showEyebrow: true,
  heroTitle: "Student Visa Requirements",
  heroDescription:
    "Compare destinations, understand every document, and build a confident student visa application from one clear, expert-led workspace.",
  exploreButtonText: "Explore Countries",
  exploreButtonUrl: "#countries",
  checklistButtonText: "Download Checklist",
  checklistButtonUrl: "#download-centre",
  searchPlaceholder: "Search by country…",
  countriesTitle: "Find your best-fit destination",
  countriesDescription:
    "Use the filters to compare indicative study costs, timelines, funding evidence, work rights, and post-study potential.",
  emptyStateTitle: "No destinations match",
  emptyStateDescription: "Try clearing one or more filters to see more countries.",
  countries: [
    country(
      "country-albania",
      "albania",
      "🇦🇱",
      "Albania",
      "€2,000–€6,000/year",
      "4–8 weeks",
      "Approx. €6,000/year",
      "Up to 20 hrs/week",
      "Developing routes",
      "Type D study visa",
      "IELTS 5.5+ or equivalent",
      "Under €5k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-andorra",
      "andorra",
      "🇦🇩",
      "Andorra",
      "€3,000–€10,000/year",
      "4–8 weeks",
      "Approx. €12,000/year",
      "Permit dependent",
      "Limited routes",
      "Study residence authorisation",
    ),
    country(
      "country-austria",
      "austria",
      "🇦🇹",
      "Austria",
      "€1,500–€15,000/year",
      "8–12 weeks",
      "Approx. €13,000/year",
      "Up to 20 hrs/week",
      "Strong pathways",
      "Visa D / residence permit",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
    ),
    country(
      "country-belarus",
      "belarus",
      "🇧🇾",
      "Belarus",
      "€2,000–€5,000/year",
      "2–6 weeks",
      "Approx. €5,000/year",
      "Permit dependent",
      "Limited routes",
      "Student visa",
      "Institution-specific",
      "Under €5k",
      "Under 4 weeks",
      "Under €10k",
    ),
    country(
      "country-belgium",
      "belgium",
      "🇧🇪",
      "Belgium",
      "€1,000–€8,000/year",
      "6–12 weeks",
      "Approx. €12,000/year",
      "Up to 20 hrs/week",
      "Strong pathways",
      "Type D student visa",
    ),
    country(
      "country-bosnia",
      "bosnia-and-herzegovina",
      "🇧🇦",
      "Bosnia & Herzegovina",
      "€2,000–€6,000/year",
      "4–8 weeks",
      "Approx. €6,000/year",
      "Permit dependent",
      "Developing routes",
      "Long-stay study visa",
      "IELTS 5.5+ or equivalent",
      "Under €5k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-bulgaria",
      "bulgaria",
      "🇧🇬",
      "Bulgaria",
      "€3,000–€8,000/year",
      "4–8 weeks",
      "Approx. €7,000/year",
      "Up to 20 hrs/week",
      "Good pathways",
      "Type D student visa",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-croatia",
      "croatia",
      "🇭🇷",
      "Croatia",
      "€2,000–€10,000/year",
      "4–8 weeks",
      "Approx. €8,500/year",
      "Up to 20 hrs/week",
      "Good pathways",
      "Temporary stay for study",
    ),
    country(
      "country-cyprus",
      "cyprus",
      "🇨🇾",
      "Cyprus",
      "€4,000–€12,000/year",
      "4–8 weeks",
      "Approx. €7,000/year",
      "Up to 20 hrs/week",
      "Good pathways",
      "Student entry permit",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-czechia",
      "czechia",
      "🇨🇿",
      "Czechia",
      "€0–€15,000/year",
      "8–12 weeks",
      "Approx. €7,000/year",
      "Up to 20 hrs/week",
      "Strong pathways",
      "Long-term study visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
      "Under €10k",
    ),
    country(
      "country-denmark",
      "denmark",
      "🇩🇰",
      "Denmark",
      "€6,000–€16,000/year",
      "4–8 weeks",
      "Approx. €13,000/year",
      "20 hrs/week",
      "Strong pathways",
      "Study residence permit",
    ),
    country(
      "country-estonia",
      "estonia",
      "🇪🇪",
      "Estonia",
      "€3,000–€12,000/year",
      "4–8 weeks",
      "Approx. €9,000/year",
      "No fixed limit if studies progress",
      "Strong pathways",
      "Type D / study permit",
      "IELTS 6.0+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-finland",
      "finland",
      "🇫🇮",
      "Finland",
      "€6,000–€18,000/year",
      "4–12 weeks",
      "Approx. €9,600/year",
      "30 hrs/week average",
      "Strong pathways",
      "Residence permit for studies",
      "IELTS 6.0+ or equivalent",
      "Over €15k",
      "8–12 weeks",
      "Under €10k",
    ),
    country(
      "country-france",
      "france",
      "🇫🇷",
      "France",
      "€2,850–€20,000/year",
      "3–8 weeks",
      "Approx. €7,380/year",
      "964 hrs/year",
      "Strong pathways",
      "VLS-TS student visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-germany",
      "germany",
      "🇩🇪",
      "Germany",
      "€0–€20,000/year",
      "6–12 weeks",
      "Approx. €11,904/year",
      "140 full days/year",
      "Excellent pathways",
      "National student visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
    ),
    country(
      "country-greece",
      "greece",
      "🇬🇷",
      "Greece",
      "€1,500–€9,000/year",
      "4–8 weeks",
      "Approx. €6,000/year",
      "Up to 20 hrs/week",
      "Good pathways",
      "Type D student visa",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-hungary",
      "hungary",
      "🇭🇺",
      "Hungary",
      "€3,000–€16,000/year",
      "4–8 weeks",
      "Approx. €8,000/year",
      "30 hrs/week",
      "Good pathways",
      "Study residence permit",
    ),
    country(
      "country-iceland",
      "iceland",
      "🇮🇸",
      "Iceland",
      "€0–€18,000/year",
      "8–12 weeks",
      "Approx. €15,000/year",
      "Up to 22.5 hrs/week",
      "Good pathways",
      "Student residence permit",
      "IELTS 6.5+ or equivalent",
      "Over €15k",
      "8–12 weeks",
    ),
    country(
      "country-ireland",
      "ireland",
      "🇮🇪",
      "Ireland",
      "€10,000–€25,000/year",
      "4–8 weeks",
      "Approx. €10,000/year",
      "20 hrs/week",
      "Strong pathways",
      "Long Stay D study visa",
      "IELTS 6.0+ or equivalent",
      "Over €15k",
      "4–8 weeks",
    ),
    country(
      "country-italy",
      "italy",
      "🇮🇹",
      "Italy",
      "€900–€20,000/year",
      "4–12 weeks",
      "Approx. €6,100/year",
      "20 hrs/week",
      "Strong pathways",
      "Type D study visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
      "Under €10k",
    ),
    country(
      "country-kosovo",
      "kosovo",
      "🇽🇰",
      "Kosovo",
      "€1,000–€5,000/year",
      "3–8 weeks",
      "Approx. €5,000/year",
      "Permit dependent",
      "Developing routes",
      "Study residence permit",
      "Institution-specific",
      "Under €5k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-latvia",
      "latvia",
      "🇱🇻",
      "Latvia",
      "€3,000–€15,000/year",
      "4–8 weeks",
      "Approx. €8,400/year",
      "20 hrs/week",
      "Good pathways",
      "Long-stay visa / residence permit",
    ),
    country(
      "country-liechtenstein",
      "liechtenstein",
      "🇱🇮",
      "Liechtenstein",
      "€1,500–€10,000/year",
      "8–12 weeks",
      "Approx. CHF 18,000/year",
      "Permit dependent",
      "Limited routes",
      "Study residence permit",
      "IELTS 6.0+ or equivalent",
      "€5k–€15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-lithuania",
      "lithuania",
      "🇱🇹",
      "Lithuania",
      "€2,500–€12,000/year",
      "4–8 weeks",
      "Approx. €7,000/year",
      "20 hrs/week",
      "Good pathways",
      "National visa / residence permit",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-luxembourg",
      "luxembourg",
      "🇱🇺",
      "Luxembourg",
      "€400–€12,000/year",
      "8–12 weeks",
      "Approx. €15,000/year",
      "15 hrs/week",
      "Strong pathways",
      "Temporary authorisation to stay",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-malta",
      "malta",
      "🇲🇹",
      "Malta",
      "€6,000–€15,000/year",
      "4–8 weeks",
      "Approx. €9,600/year",
      "20 hrs/week",
      "Good pathways",
      "National long-stay study visa",
    ),
    country(
      "country-moldova",
      "moldova",
      "🇲🇩",
      "Moldova",
      "€2,000–€5,000/year",
      "3–8 weeks",
      "Approx. €5,000/year",
      "Permit dependent",
      "Developing routes",
      "Long-stay study visa",
      "Institution-specific",
      "Under €5k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-monaco",
      "monaco",
      "🇲🇨",
      "Monaco",
      "€8,000–€25,000/year",
      "6–12 weeks",
      "Approx. €18,000/year",
      "Permit dependent",
      "Limited routes",
      "Long-stay study visa",
      "IELTS 6.0+ or programme language",
      "Over €15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-montenegro",
      "montenegro",
      "🇲🇪",
      "Montenegro",
      "€2,000–€7,000/year",
      "4–8 weeks",
      "Approx. €6,000/year",
      "Permit dependent",
      "Developing routes",
      "Temporary residence for study",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-netherlands",
      "netherlands",
      "🇳🇱",
      "Netherlands",
      "€8,000–€22,000/year",
      "4–8 weeks",
      "Approx. €14,700/year",
      "16 hrs/week",
      "Strong pathways",
      "MVV / study residence permit",
      "IELTS 6.0+ or equivalent",
      "Over €15k",
      "4–8 weeks",
    ),
    country(
      "country-north-macedonia",
      "north-macedonia",
      "🇲🇰",
      "North Macedonia",
      "€2,000–€6,000/year",
      "4–8 weeks",
      "Approx. €5,000/year",
      "Permit dependent",
      "Developing routes",
      "Long-stay study visa",
      "IELTS 5.5+ or equivalent",
      "Under €5k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-norway",
      "norway",
      "🇳🇴",
      "Norway",
      "€0–€25,000/year",
      "6–12 weeks",
      "Approx. NOK 167,000/year",
      "20 hrs/week",
      "Strong pathways",
      "Study permit",
      "IELTS 6.0+ or equivalent",
      "Over €15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-poland",
      "poland",
      "🇵🇱",
      "Poland",
      "€2,000–€12,000/year",
      "3–8 weeks",
      "Approx. €6,500/year",
      "20 hrs/week",
      "Strong pathways",
      "Type D student visa",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-portugal",
      "portugal",
      "🇵🇹",
      "Portugal",
      "€3,000–€15,000/year",
      "4–12 weeks",
      "Approx. €9,840/year",
      "20 hrs/week",
      "Strong pathways",
      "D4 student visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "8–12 weeks",
      "Under €10k",
    ),
    country(
      "country-romania",
      "romania",
      "🇷🇴",
      "Romania",
      "€2,000–€10,000/year",
      "4–8 weeks",
      "Approx. €6,000/year",
      "6 hrs/day",
      "Good pathways",
      "Long-stay study visa",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-san-marino",
      "san-marino",
      "🇸🇲",
      "San Marino",
      "€3,000–€10,000/year",
      "4–8 weeks",
      "Approx. €10,000/year",
      "Permit dependent",
      "Limited routes",
      "Study residence permit",
    ),
    country(
      "country-serbia",
      "serbia",
      "🇷🇸",
      "Serbia",
      "€2,000–€8,000/year",
      "3–8 weeks",
      "Approx. €6,000/year",
      "Permit dependent",
      "Developing routes",
      "Type D study visa",
      "IELTS 5.5+ or equivalent",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-slovakia",
      "slovakia",
      "🇸🇰",
      "Slovakia",
      "€0–€12,000/year",
      "4–12 weeks",
      "Approx. €7,000/year",
      "20 hrs/week",
      "Good pathways",
      "Temporary residence for study",
    ),
    country(
      "country-slovenia",
      "slovenia",
      "🇸🇮",
      "Slovenia",
      "€2,000–€15,000/year",
      "4–8 weeks",
      "Approx. €8,000/year",
      "Student work referral",
      "Good pathways",
      "Temporary residence for study",
    ),
    country(
      "country-spain",
      "spain",
      "🇪🇸",
      "Spain",
      "€800–€20,000/year",
      "4–8 weeks",
      "Approx. €7,200/year",
      "30 hrs/week",
      "Strong pathways",
      "Long-stay student visa",
      "IELTS 6.0+ or programme language",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-sweden",
      "sweden",
      "🇸🇪",
      "Sweden",
      "€7,500–€25,000/year",
      "4–12 weeks",
      "Approx. SEK 123,000/year",
      "No fixed limit",
      "Strong pathways",
      "Residence permit for studies",
      "IELTS 6.5+ or equivalent",
      "Over €15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-switzerland",
      "switzerland",
      "🇨🇭",
      "Switzerland",
      "CHF 1,000–25,000/year",
      "8–12 weeks",
      "Approx. CHF 21,000/year",
      "15 hrs/week",
      "Competitive pathways",
      "National type D visa",
      "IELTS 6.0+ or programme language",
      "Over €15k",
      "8–12 weeks",
      "Over €15k",
    ),
    country(
      "country-turkiye",
      "turkiye",
      "🇹🇷",
      "Türkiye",
      "€1,000–€15,000/year",
      "3–8 weeks",
      "Approx. €6,000/year",
      "Permit dependent",
      "Good pathways",
      "Student visa",
      "IELTS 5.5+ or programme language",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-ukraine",
      "ukraine",
      "🇺🇦",
      "Ukraine",
      "€2,000–€7,000/year",
      "3–8 weeks",
      "Approx. €5,000/year",
      "Permit dependent",
      "Developing routes",
      "Long-term study visa",
      "Institution-specific",
      "€5k–€15k",
      "4–8 weeks",
      "Under €10k",
    ),
    country(
      "country-united-kingdom",
      "united-kingdom",
      "🇬🇧",
      "United Kingdom",
      "£11,000–£38,000/year",
      "3–8 weeks",
      "£10,224–£13,347+",
      "20 hrs/week",
      "Graduate Route available",
      "Student visa",
      "IELTS 6.0+ or approved equivalent",
      "Over €15k",
      "4–8 weeks",
      "Over €15k",
    ),
    country(
      "country-vatican-city",
      "vatican-city",
      "🇻🇦",
      "Vatican City",
      "Programme-specific",
      "Case dependent",
      "Case dependent",
      "Not generally applicable",
      "Not applicable",
      "Special study authorisation",
      "Institution-specific",
      "€5k–€15k",
      "8–12 weeks",
      "€10k–€15k",
    ),
  ],
  requirementSections: [
    {
      id: "req-overview",
      title: "Overview",
      items: [
        "Confirm course eligibility, visa category, intake dates, and embassy jurisdiction.",
        "Check that your passport remains valid for the required period.",
      ],
    },
    {
      id: "req-initial",
      title: "Initial Application Documents",
      items: [
        "Completed application form",
        "Passport and compliant photographs",
        "Appointment confirmation and fee receipt",
      ],
    },
    {
      id: "req-admission",
      title: "University Admission Documents",
      items: [
        "Unconditional or final offer letter",
        "Tuition payment evidence where required",
        "Programme details and enrolment confirmation",
      ],
    },
    {
      id: "req-financial",
      title: "Financial Documents",
      items: [
        "Bank statements for the required holding period",
        "Source-of-funds evidence",
        "Tuition and living-cost calculation",
      ],
    },
    {
      id: "req-sponsor",
      title: "Sponsor Documents",
      items: ["Sponsor declaration", "Relationship evidence", "Sponsor income, employment, business, and tax evidence"],
    },
    {
      id: "req-english",
      title: "English Language Requirements",
      items: [
        "Approved test result or accepted waiver",
        "Result verification details",
        "Programme-language evidence when not taught in English",
      ],
    },
    {
      id: "req-accommodation",
      title: "Accommodation Documents",
      items: [
        "Confirmed booking, tenancy, or university housing letter",
        "Host declaration and address evidence if applicable",
      ],
    },
    {
      id: "req-health",
      title: "Health & Insurance",
      items: ["Visa-compliant health or travel insurance", "Medical or tuberculosis certificate where required"],
    },
    {
      id: "req-visa",
      title: "Visa Documents",
      items: [
        "Cover letter and study plan",
        "Travel history and previous refusal disclosure",
        "Certified translations, legalisation, or apostille",
      ],
    },
    {
      id: "req-interview",
      title: "Embassy Interview",
      items: [
        "Explain course choice and career plan clearly",
        "Know your funding, accommodation, institution, and destination",
        "Carry originals in an indexed file",
      ],
    },
    {
      id: "req-arrival",
      title: "Documents After Arrival",
      items: [
        "Residence registration or permit application",
        "University enrolment confirmation",
        "Local insurance, tax, or identity registration if required",
      ],
    },
    {
      id: "req-country",
      title: "Country-Specific Requirements",
      items: [
        "Follow the selected country’s current official checklist.",
        "Check nationality-specific and consular requirements before submission.",
      ],
    },
    {
      id: "req-timeline",
      title: "Processing Timeline",
      items: [
        "Start 4–6 months before travel where possible.",
        "Allow time for admissions, funding history, appointment queues, biometrics, and decision delivery.",
      ],
    },
    {
      id: "req-costs",
      title: "Estimated Costs",
      items: [
        "Budget for visa and biometrics fees, translations, insurance, travel, deposits, tuition, and required maintenance funds.",
      ],
    },
    {
      id: "req-faq",
      title: "FAQ",
      items: [
        "Requirements change. Treat this planner as guidance and verify final evidence with the official authority.",
      ],
    },
  ],
  timelineEyebrow: " ",
  showTimelineEyebrow: true,
  timelineTitle: "From first plan to residence permit",
  timelineDescription: "A calm, step-by-step route through the complete student journey.",
  timeline: [
    {
      id: "step-profile",
      title: "Prepare Profile",
      description: "Review academics, language level, budget, goals, and destination fit.",
    },
    {
      id: "step-university",
      title: "Apply to University",
      description: "Shortlist programmes and submit complete applications before deadlines.",
    },
    {
      id: "step-offer",
      title: "Receive Offer Letter",
      description: "Meet conditions, accept your place, and pay any required deposit.",
    },
    {
      id: "step-finances",
      title: "Arrange Finances",
      description: "Build traceable funds and prepare sponsor or loan evidence.",
    },
    {
      id: "step-visa",
      title: "Apply for Visa",
      description: "Complete the correct form, book an appointment, and organise your file.",
    },
    {
      id: "step-biometrics",
      title: "Attend Biometrics",
      description: "Provide biometrics, documents, and any required credibility interview.",
    },
    {
      id: "step-decision",
      title: "Visa Decision",
      description: "Track your application and respond quickly to any document request.",
    },
    {
      id: "step-travel",
      title: "Travel",
      description: "Prepare border documents, accommodation, insurance, and arrival plans.",
    },
    {
      id: "step-residence",
      title: "Residence Permit",
      description: "Complete local registration and residence formalities after arrival.",
    },
  ],
  checklistEyebrow: " ",
  showChecklistEyebrow: true,
  checklistTitle: "Universal document checklist",
  checklistDescription: "Mark documents as complete. Progress is saved on this device.",
  checklistGroups: [
    {
      id: "check-personal",
      title: "Personal Documents",
      items: ["Valid passport", "Visa photographs", "Birth certificate", "National ID and civil-status records"],
    },
    {
      id: "check-academic",
      title: "Academic Documents",
      items: [
        "Certificates and transcripts",
        "Current enrolment or graduation evidence",
        "Certified translations and verification",
      ],
    },
    {
      id: "check-language",
      title: "Language Test",
      items: ["Approved English or programme-language result", "Test verification details"],
    },
    {
      id: "check-sop",
      title: "SOP & CV",
      items: ["Tailored statement of purpose", "Updated academic CV", "Study-gap explanation where relevant"],
    },
    {
      id: "check-recommendation",
      title: "Recommendation Letters",
      items: ["Academic references", "Professional reference where relevant"],
    },
    {
      id: "check-finance",
      title: "Financial Documents",
      items: ["Bank statements", "Source-of-funds evidence", "Loan or scholarship letter", "Tuition payment evidence"],
    },
    {
      id: "check-sponsor",
      title: "Sponsor Documents",
      items: ["Sponsor letter", "Relationship evidence", "Income, tax, business, or employment records"],
    },
    {
      id: "check-visa",
      title: "Visa Documents",
      items: ["Application form", "Appointment and fee receipt", "Cover letter", "Offer and enrolment evidence"],
    },
    {
      id: "check-travel",
      title: "Travel Documents",
      items: ["Insurance", "Accommodation", "Travel booking where requested", "Border-control document pack"],
    },
    {
      id: "check-arrival",
      title: "After Arrival",
      items: ["Residence registration", "University enrolment", "Local insurance and identity formalities"],
    },
  ],
  downloadsEyebrow: "",
  showDownloadsEyebrow: true,
  downloadsTitle: "Practical guides for every stage",
  downloadsDescription: "Keep a clear copy of the checklists and preparation guides you need.",
  downloadCompanyName: "NexaMart",
  downloadCompanyEmail: "example@gmail.com",
  downloadCompanyContact: "01711 221122",
  downloads: [
    {
      id: "download-profile",
      title: "Student Profile Checklist",
      description: "Review academics, language, goals, and destination readiness.",
      format: "PDF",
      url: "#",
      content: [
        "Confirm your preferred course, study level, intake, and destination.",
        "Review academic results, study gaps, and relevant subject background.",
        "Check the required English or programme-language test and target score.",
        "Prepare a realistic tuition, living-cost, and emergency-fund budget.",
        "List scholarship, sponsor, loan, and self-funding options.",
        "Record your long-term academic and career goals for counselling.",
      ],
    },
    {
      id: "download-visa",
      title: "Visa Checklist",
      description: "Build a complete, indexed application file.",
      format: "PDF",
      url: "#",
      content: [
        "Valid passport and compliant identity photographs.",
        "Completed visa application form and appointment confirmation.",
        "University offer, admission, enrolment, or tuition-payment evidence.",
        "Academic certificates, transcripts, and certified translations.",
        "English or programme-language test evidence.",
        "Financial statements, source-of-funds records, and sponsor documents.",
        "Statement of purpose, study plan, and updated CV.",
        "Accommodation, insurance, medical, and travel evidence where required.",
        "Visa fee receipt and a clearly indexed copy of the complete application.",
      ],
    },
    {
      id: "download-finance",
      title: "Financial Documents Checklist",
      description: "Organise funds, sponsors, loans, and source evidence.",
      format: "PDF",
      url: "#",
      content: [
        "Check the current minimum fund requirement and holding period.",
        "Collect recent bank statements in the required format.",
        "Explain all large or recent deposits with supporting evidence.",
        "Prepare sponsor letters and proof of relationship where applicable.",
        "Include sponsor income, tax, employment, or business documents.",
        "Add education-loan sanction letters and disbursement terms.",
        "Add scholarship or funding-award letters.",
        "Keep tuition-payment receipts and a clear source-of-funds summary.",
      ],
    },
    {
      id: "download-sop",
      title: "SOP Guide",
      description: "Write a focused and credible study plan.",
      format: "PDF",
      url: "#",
      content: [
        "Introduce your academic background and the purpose of your application.",
        "Explain why the selected course fits your prior study and experience.",
        "Explain why you chose the university and destination.",
        "Connect the curriculum to specific career goals.",
        "Address study gaps, course changes, or previous refusals honestly.",
        "Explain how the study and living costs will be funded.",
        "Use specific evidence, natural language, and a clear structure.",
        "Proofread for accuracy and ensure every claim matches your documents.",
      ],
    },
    {
      id: "download-interview",
      title: "Embassy Interview Guide",
      description: "Prepare concise answers with confidence.",
      format: "PDF",
      url: "#",
      content: [
        "Know your course title, modules, duration, intake, and tuition fee.",
        "Explain clearly why you chose the university and destination.",
        "Describe how the course supports your career plan.",
        "Know who is funding you and how the funds were earned.",
        "Be ready to explain study gaps, course changes, and travel history.",
        "Keep answers honest, direct, and consistent with the submitted file.",
        "Organise original documents so you can find evidence quickly.",
        "Review current embassy instructions before attending the interview.",
      ],
    },
  ],
  faqEyebrow: "",
  showFaqEyebrow: true,
  faqTitle: "Frequently asked questions",
  faqDescription: "Search common questions about European student visa planning.",
  faqSearchPlaceholder: "Search visa questions…",
  faqs: [
    {
      id: "faq-when",
      question: "When should I start my European student visa process?",
      answer:
        "Begin destination and university planning 8–12 months before intake. Start the visa file as soon as you understand the financial holding period and receive the required admission evidence.",
    },
    {
      id: "faq-funds",
      question: "How much money do I need to show?",
      answer:
        "The amount and evidence format differ by country. You may need tuition, a fixed living-cost amount, or both. Always verify the current official figure and accepted evidence.",
    },
    {
      id: "faq-sponsor",
      question: "Can a parent or relative sponsor my studies?",
      answer:
        "Many countries accept sponsors, but typically require relationship evidence, a signed sponsorship declaration, source-of-funds documents, and proof that the sponsor can support both you and their own household.",
    },
    {
      id: "faq-english",
      question: "Is IELTS mandatory for every country?",
      answer:
        "No. Universities and immigration authorities may accept different tests, programme-language evidence, or limited waivers. The admission rule and visa rule can be different.",
    },
    {
      id: "faq-work",
      question: "Can international students work while studying?",
      answer:
        "Most destinations allow limited work with conditions. Weekly or annual limits, holiday rules, employer permits, and course-progress requirements vary.",
    },
    {
      id: "faq-refusal",
      question: "What should I do after a visa refusal?",
      answer:
        "Read the refusal reasons carefully, preserve the decision letter, and seek qualified advice before reapplying or appealing. Address evidence gaps directly rather than submitting the same file again.",
    },
  ],
  ctaTitle: "Need Help Preparing Your Visa File?",
  ctaDescription:
    "Get a personalised document plan, funding review, and application roadmap from an experienced study-abroad advisor.",
  primaryButtonText: "Book Consultation",
  primaryButtonUrl: "/consultation",
  secondaryButtonText: "Contact Advisor",
  secondaryButtonUrl: "/contact",
  backgroundColor: "#ffffff",
  surfaceColor: "#f7fafc",
  headingColor: "#251214",
  textColor: "#475569",
  accentColor: "#EB2229",
  accentDarkColor: "#EC1F29",
};
