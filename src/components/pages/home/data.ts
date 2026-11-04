/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import designContent from "./content.json";

export type ContentTag = "span" | "strong" | "p" | "h1" | "h2" | "ul" | "ol" | "li" | "a" | "nav";
export type ContentNode = { tag: ContentTag; children: (ContentNode | string)[] };
export type HomeSection = {
  id: string;
  imageUrl: string;
  imageAlt: string;
  content: ContentNode[];
};
export type HomeData = {
  schemaVersion: "2";
  forceUpdate: "true" | "false";
  paddingX: number;
  paddingY: number;
  sectionsJson: string;
};

// Every word comes from design.txt. Preserve the original rich-text hierarchy.
export const defaultSections = designContent as HomeSection[];

export const sectionOrder = [
  "AnnouncementBar",
  "KidsHero",
  "PracticalVocabularySection",
  "SpokenPhrasesSection",
  "ConversationPracticeSection",
  "RealLifeTenseSection",
  "CollocationsSection",
  "ContractionsSection",
  "PresentationSkillsSection",
  "ReadingFluencySection",
  "SituationalSpeakingSection",
  "CameraSpeakingSection",
  "WhatsAppActivitiesSection",
  "CourseResultsSection",
  "SecondaryIeltsHero",
  "CourseAudienceSection",
  "CompleteIeltsSpeakingSection",
  "SmartAnswerTemplatesSection",
  "AnswerDevelopmentSection",
  "CreativeTemplatesSection",
  "HighImpactPhrasesSection",
  "ObjectTopicsSection",
  "PersonProfileSection",
  "PlaceTopicsSection",
  "FluencyConfidenceSection",
  "SpeakingFocusedPracticeSection",
  "DemoClassSection",
] as const;

export const defaultData: HomeData = {
  schemaVersion: "2",
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  sectionsJson: JSON.stringify(defaultSections),
};

const allowedTags = new Set<string>(["span", "strong", "p", "h1", "h2", "ul", "ol", "li", "a", "nav"]);

function isContent(value: unknown, depth = 0): value is ContentNode | string {
  if (typeof value === "string") return true;
  if (!value || typeof value !== "object" || depth > 8) return false;
  const node = value as Partial<ContentNode>;
  return (
    typeof node.tag === "string" &&
    allowedTags.has(node.tag) &&
    Array.isArray(node.children) &&
    node.children.every((child) => isContent(child, depth + 1))
  );
}

export function contentText(node: ContentNode | string): string {
  return typeof node === "string" ? node : node.children.map(contentText).join("");
}

export function sectionTitle(section: HomeSection): string {
  const heading = section.content.find((node) => node.tag === "h1" || node.tag === "h2");
  return heading ? contentText(heading) : "AnnouncementBar";
}

export function safeImageUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

export function homeSections(data?: Partial<HomeData>): HomeSection[] {
  let saved: unknown;
  try {
    saved = data?.schemaVersion === "2" ? JSON.parse(data.sectionsJson ?? "[]") : [];
  } catch {
    saved = [];
  }
  // Old Home cards cannot reintroduce the previous page's copy. A malformed edit
  // falls back per section, so the other sections remain available and editable.
  return sectionOrder.map((id) => {
    const fallback = defaultSections.find((section) => section.id === id)!;
    const section: unknown = Array.isArray(saved)
      ? saved.find((item: unknown) => item && typeof item === "object" && "id" in item && item.id === id)
      : undefined;
    if (!section || typeof section !== "object") return fallback;
    const candidate = section as Partial<HomeSection>;
    return {
      id,
      imageUrl: safeImageUrl(candidate.imageUrl, fallback.imageUrl),
      imageAlt: typeof candidate.imageAlt === "string" ? candidate.imageAlt : fallback.imageAlt,
      content:
        Array.isArray(candidate.content) &&
        candidate.content.length &&
        candidate.content.every((node) => typeof node !== "string" && isContent(node))
          ? candidate.content
          : fallback.content,
    };
  });
}

export function homePadding(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(120, Math.max(0, number)) : 0;
}
