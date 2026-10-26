/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  sourceName: string;
  featured: boolean;
  popular: boolean;
}

export interface BlogTopic {
  id: string;
  label: string;
}

export interface IVisaInsightsData {
  pageUid: string;
  pageName: string;
  heroEyebrow: string;
  heroEyebrowVisible: boolean;
  heroTitle: string;
  heroDescription: string;
  popularTitle: string;
  newsletterEyebrow: string;
  newsletterEyebrowVisible: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  topics: BlogTopic[];
  blogs: BlogPost[];
  backgroundColor: string;
  surfaceColor: string;
  headingColor: string;
  textColor: string;
  accentColor: string;
  accentDarkColor: string;
}

export interface VisaInsightsPayload extends IVisaInsightsData {
  paddingX: number;
  paddingY: number;
}

export interface VisaInsightsProps {
  data?: IVisaInsightsData | VisaInsightsPayload | string;
}

export const defaultBlogDraft: Omit<BlogPost, "id" | "publishedAt"> = {
  title: "",
  excerpt: "",
  url: "",
  imageUrl: "",
  imageAlt: "",
  category: "Applications",
  author: "Site Editorial",
  readTime: "5 min",
  sourceName: "Site",
  featured: false,
  popular: false,
};
export const defaultBlogTopic: Omit<BlogTopic, "id"> = { label: "New topic" };

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataVisaInsights: IVisaInsightsData = {
  pageUid: "visa-insights-uid",
  pageName: "Blog Page",
  heroEyebrow: "Site Journal",
  heroEyebrowVisible: true,
  heroTitle: "Study abroad, explained clearly.",
  heroDescription: "Practical guides for applications, visas, documents, and student life.",
  popularTitle: "Popular guides",
  newsletterEyebrow: "Stay informed",
  newsletterEyebrowVisible: true,
  newsletterTitle: "Useful guidance in your inbox.",
  newsletterDescription: "Get new study and visa articles from Site.",
  newsletterButtonText: "Subscribe",
  ctaTitle: "Need personal guidance?",
  ctaDescription: "Talk to a Site advisor.",
  ctaButtonText: "Book a Consultation",
  ctaButtonUrl: "/consultation",
  topics: [
    { id: "topic-all", label: "All" },
    { id: "topic-visas", label: "Visas" },
    { id: "topic-applications", label: "Applications" },
    { id: "topic-destinations", label: "Destinations" },
    { id: "topic-student-life", label: "Student Life" },
  ],
  blogs: [
    {
      id: "blog-evisa",
      title: "How to prepare a clean e-visa file",
      excerpt: "A simple checklist for organising digital evidence before submission.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Student reviewing an online visa file with an advisor",
      category: "Visas",
      author: "Site Editorial",
      publishedAt: "2026-07-20",
      readTime: "5 min",
      sourceName: "Site",
      featured: true,
      popular: true,
    },
    {
      id: "blog-sop",
      title: "Five ways to strengthen your SOP",
      excerpt: "Keep your statement focused, credible, and connected to your goals.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Advisor reviewing a statement of purpose",
      category: "Applications",
      author: "Site Editorial",
      publishedAt: "2026-07-16",
      readTime: "4 min",
      sourceName: "Site",
      featured: false,
      popular: true,
    },
    {
      id: "blog-guidance",
      title: "Build your student visa timeline",
      excerpt: "Plan documents, appointments, and final checks without last-minute pressure.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Advisor explaining a student visa timeline",
      category: "Visas",
      author: "Site Editorial",
      publishedAt: "2026-07-11",
      readTime: "6 min",
      sourceName: "Site",
      featured: false,
      popular: false,
    },
    {
      id: "blog-legalization",
      title: "Document legalization basics",
      excerpt: "Understand common attestation, translation, and verification steps.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "Academic documents being checked by a specialist",
      category: "Applications",
      author: "Site Editorial",
      publishedAt: "2026-07-05",
      readTime: "5 min",
      sourceName: "Site",
      featured: false,
      popular: true,
    },
    {
      id: "blog-usa",
      title: "Planning your studies in the USA",
      excerpt: "Review course fit, costs, campus choices, and visa preparation.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "United States study destination",
      category: "Destinations",
      author: "Site Editorial",
      publishedAt: "2026-06-28",
      readTime: "7 min",
      sourceName: "Site",
      featured: false,
      popular: false,
    },
    {
      id: "blog-campus",
      title: "Questions to ask before choosing a campus",
      excerpt: "Compare learning, location, support, and daily student experience.",
      url: "/consultation",
      imageUrl: "/images/all-pages-placeholder.png",
      imageAlt: "University campus for international students",
      category: "Student Life",
      author: "Site Editorial",
      publishedAt: "2026-06-21",
      readTime: "4 min",
      sourceName: "Site",
      featured: false,
      popular: false,
    },
  ],
  backgroundColor: "#ffffff",
  surfaceColor: "#f5f8fc",
  headingColor: "#123047",
  textColor: "#526273",
  accentColor: "#0f766e",
  accentDarkColor: "#123047",
};
