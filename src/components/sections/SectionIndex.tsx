/*
|-----------------------------------------
| setting up SectionIndex.tsx for the App
|-----------------------------------------
*/

import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

import {
  getSectionDefaults,
  hydrateSectionData,
  sectionDefaults as sectionDefaultsByVariant,
  type SectionData,
  type SectionVariant,
} from "./section-defaults";
export type { SectionData, SectionVariant } from "./section-defaults";
export { SectionPreview } from "./SectionPreviewRegistry";

type MutationProps = { data?: SectionData; onChange: (data: SectionData) => void };
type LazyMutation = LazyExoticComponent<ComponentType<MutationProps>>;
type Definition = {
  defaultData: SectionData;
  title: string;
  description: string;
  Mutation: LazyMutation;
};

const mutationRegistry: Record<SectionVariant, LazyMutation> = {
  "section-1": lazy(() => import("./section-1/Mutation")) as unknown as LazyMutation,
  "section-2": lazy(() => import("./section-2/Mutation")) as unknown as LazyMutation,
  "section-3": lazy(() => import("./section-3/Mutation")) as unknown as LazyMutation,
  "section-4": lazy(() => import("./section-4/Mutation")) as unknown as LazyMutation,
  "section-5": lazy(() => import("./section-5/Mutation")) as unknown as LazyMutation,
  "section-6": lazy(() => import("./section-6/Mutation")) as unknown as LazyMutation,
  "section-7": lazy(() => import("./section-7/Mutation")) as unknown as LazyMutation,
  "section-8": lazy(() => import("./section-8/Mutation")) as unknown as LazyMutation,
  "section-9": lazy(() => import("./section-9/Mutation")) as unknown as LazyMutation,
  "section-10": lazy(() => import("./section-10/Mutation")) as unknown as LazyMutation,
  "section-11": lazy(() => import("./section-11/Mutation")) as unknown as LazyMutation,
  "section-12": lazy(() => import("./section-12/Mutation")) as unknown as LazyMutation,
  "section-13": lazy(() => import("./section-13/Mutation")) as unknown as LazyMutation,
  "section-14": lazy(() => import("./section-14/Mutation")) as unknown as LazyMutation,
  "section-15": lazy(() => import("./section-15/Mutation")) as unknown as LazyMutation,
  "section-16": lazy(() => import("./section-16/Mutation")) as unknown as LazyMutation,
  "section-17": lazy(() => import("./section-17/Mutation")) as unknown as LazyMutation,
  "section-18": lazy(() => import("./section-18/Mutation")) as unknown as LazyMutation,
  "section-19": lazy(() => import("./section-19/Mutation")) as unknown as LazyMutation,
  "section-20": lazy(() => import("./section-20/Mutation")) as unknown as LazyMutation,
  "section-21": lazy(() => import("./section-21/Mutation")) as unknown as LazyMutation,
  "section-22": lazy(() => import("./section-22/Mutation")) as unknown as LazyMutation,
  "section-23": lazy(() => import("./section-23/Mutation")) as unknown as LazyMutation,
  "section-24": lazy(() => import("./section-24/Mutation")) as unknown as LazyMutation,
  "section-25": lazy(() => import("./section-25/Mutation")) as unknown as LazyMutation,
  "section-26": lazy(() => import("./section-26/Mutation")) as unknown as LazyMutation,
  "section-27": lazy(() => import("./section-27/Mutation")) as unknown as LazyMutation,
  "section-28": lazy(() => import("./section-28/Mutation")) as unknown as LazyMutation,
  "section-29": lazy(() => import("./section-29/Mutation")) as unknown as LazyMutation,
  "section-30": lazy(() => import("./section-30/Mutation")) as unknown as LazyMutation,
  "section-31": lazy(() => import("./section-31/Mutation")) as unknown as LazyMutation,
  "section-32": lazy(() => import("./section-32/Mutation")) as unknown as LazyMutation,
  "section-33": lazy(() => import("./section-33/Mutation")) as unknown as LazyMutation,
  "section-34": lazy(() => import("./section-34/Mutation")) as unknown as LazyMutation,
  "section-35": lazy(() => import("./section-35/Mutation")) as unknown as LazyMutation,
  "section-36": lazy(() => import("./section-36/Mutation")) as unknown as LazyMutation,
  "section-37": lazy(() => import("./section-37/Mutation")) as unknown as LazyMutation,
  "section-38": lazy(() => import("./section-38/Mutation")) as unknown as LazyMutation,
  "section-39": lazy(() => import("./section-39/Mutation")) as unknown as LazyMutation,
  "section-40": lazy(() => import("./section-40/Mutation")) as unknown as LazyMutation,
  "section-41": lazy(() => import("./section-41/Mutation")) as unknown as LazyMutation,
  "section-42": lazy(() => import("./section-42/Mutation")) as unknown as LazyMutation,
  "section-43": lazy(() => import("./section-43/Mutation")) as unknown as LazyMutation,
  "section-44": lazy(() => import("./section-44/Mutation")) as unknown as LazyMutation,
  "section-45": lazy(() => import("./section-45/Mutation")) as unknown as LazyMutation,
  "section-46": lazy(() => import("./section-46/Mutation")) as unknown as LazyMutation,
  "section-47": lazy(() => import("./section-47/Mutation")) as unknown as LazyMutation,
  "section-48": lazy(() => import("./section-48/Mutation")) as unknown as LazyMutation,
};

export const sectionIndex: Record<SectionVariant, Definition> = {
  "section-1": {
    defaultData: sectionDefaultsByVariant["section-1"],
    title: "Rich text section",
    description: "Write formatted content and insert media-library images",
    Mutation: mutationRegistry["section-1"],
  },
  "section-2": {
    defaultData: sectionDefaultsByVariant["section-2"],
    title: "Dark content section",
    description: "A contrasting content section",
    Mutation: mutationRegistry["section-2"],
  },
  "section-3": {
    defaultData: sectionDefaultsByVariant["section-3"],
    title: "Amber content section",
    description: "A clear, focused content section",
    Mutation: mutationRegistry["section-3"],
  },
  "section-4": {
    defaultData: sectionDefaultsByVariant["section-4"],
    title: "Network dashboard section",
    description: "Metrics and moderation queue",
    Mutation: mutationRegistry["section-4"],
  },
  "section-5": {
    defaultData: sectionDefaultsByVariant["section-5"],
    title: "Editorial blog section",
    description: "Featured posts with categories and authors",
    Mutation: mutationRegistry["section-5"],
  },
  "section-6": {
    defaultData: sectionDefaultsByVariant["section-6"],
    title: "University profile section",
    description: "Institution details, programs, stats, and admission CTA",
    Mutation: mutationRegistry["section-6"],
  },
  "section-7": {
    defaultData: sectionDefaultsByVariant["section-7"],
    title: "Study destinations section",
    description: "Filterable universities, courses, and application links by city",
    Mutation: mutationRegistry["section-7"],
  },
  "section-8": {
    defaultData: sectionDefaultsByVariant["section-8"],
    title: "Call-to-action section",
    description: "A focused closing message and action button",
    Mutation: mutationRegistry["section-8"],
  },
  "section-9": {
    defaultData: sectionDefaultsByVariant["section-9"],
    title: "Success stories intro",
    description: "A focused introduction for testimonials and success stories",
    Mutation: mutationRegistry["section-9"],
  },
  "section-10": {
    defaultData: sectionDefaultsByVariant["section-10"],
    title: "Student success stories",
    description: "A vertical reel of university success stories",
    Mutation: mutationRegistry["section-10"],
  },
  "section-11": {
    defaultData: sectionDefaultsByVariant["section-11"],
    title: "Professional journey section",
    description: "An animated timeline of experience and achievements",
    Mutation: mutationRegistry["section-11"],
  },
  "section-12": {
    defaultData: sectionDefaultsByVariant["section-12"],
    title: "Partnership network section",
    description: "Partners and collaboration options",
    Mutation: mutationRegistry["section-12"],
  },
  "section-13": {
    defaultData: sectionDefaultsByVariant["section-13"],
    title: "Community events section",
    description: "Upcoming events with categories and registration actions",
    Mutation: mutationRegistry["section-13"],
  },
  "section-14": {
    defaultData: sectionDefaultsByVariant["section-14"],
    title: "Latest articles section",
    description: "Editable articles with rich content blocks and authors",
    Mutation: mutationRegistry["section-14"],
  },
  "section-15": {
    defaultData: sectionDefaultsByVariant["section-15"],
    title: "Office locations section",
    description: "Interactive locations, contact details, and map view",
    Mutation: mutationRegistry["section-15"],
  },
  "section-16": {
    defaultData: sectionDefaultsByVariant["section-16"],
    title: "Action button section",
    description: "A configurable button with icon, path, and tab behavior",
    Mutation: mutationRegistry["section-16"],
  },
  "section-17": {
    defaultData: sectionDefaultsByVariant["section-17"],
    title: "Styled action button section",
    description: "Configurable button with layout, size, icon, and appearance controls",
    Mutation: mutationRegistry["section-17"],
  },
  "section-18": {
    defaultData: sectionDefaultsByVariant["section-18"],
    title: "Responsive image slider section",
    description: "Configurable slides with autoplay, navigation, and responsive layout settings",
    Mutation: mutationRegistry["section-18"],
  },
  "section-19": {
    defaultData: sectionDefaultsByVariant["section-19"],
    title: "Topic tag slider section",
    description: "Configurable topic tags with autoplay, navigation, and visual style controls",
    Mutation: mutationRegistry["section-19"],
  },
  "section-20": {
    defaultData: sectionDefaultsByVariant["section-20"],
    title: "Image gallery section",
    description: "Responsive gallery layouts with captions, effects, and image management",
    Mutation: mutationRegistry["section-20"],
  },
  "section-21": {
    defaultData: sectionDefaultsByVariant["section-21"],
    title: "Spacer block section",
    description: "Configurable spacing, width, background, and display layout",
    Mutation: mutationRegistry["section-21"],
  },
  "section-22": {
    defaultData: sectionDefaultsByVariant["section-22"],
    title: "Spacer block section",
    description: "Configurable spacing, width, background, and display layout",
    Mutation: mutationRegistry["section-22"],
  },
  "section-23": {
    defaultData: sectionDefaultsByVariant["section-23"],
    title: "Feature cards section",
    description: "Responsive feature cards with configurable icons, descriptions, and gradient themes",
    Mutation: mutationRegistry["section-23"],
  },
  "section-24": {
    defaultData: sectionDefaultsByVariant["section-24"],
    title: "Test benefits section",
    description: "Feature highlights, call-to-action, and performance statistics",
    Mutation: mutationRegistry["section-24"],
  },
  "section-25": {
    defaultData: sectionDefaultsByVariant["section-25"],
    title: "Practice features section",
    description: "Feature cards highlighting practice benefits and learning tools",
    Mutation: mutationRegistry["section-25"],
  },
  "section-26": {
    defaultData: sectionDefaultsByVariant["section-26"],
    title: "Success statistics banner",
    description: "Community headline, metrics, and call-to-action banner",
    Mutation: mutationRegistry["section-26"],
  },
  "section-27": {
    defaultData: sectionDefaultsByVariant["section-27"],
    title: "IELTS course plans section",
    description: "Course pricing cards with levels, features, schedules, and enrollment actions",
    Mutation: mutationRegistry["section-27"],
  },
  "section-28": {
    defaultData: sectionDefaultsByVariant["section-28"],
    title: "Class benefits section",
    description: "Why choose our classes feature grid with configurable highlights",
    Mutation: mutationRegistry["section-28"],
  },
  "section-29": {
    defaultData: sectionDefaultsByVariant["section-29"],
    title: "IELTS consultation CTA section",
    description: "Call-to-action banner with consultation, demo, and contact details",
    Mutation: mutationRegistry["section-29"],
  },
  "section-30": {
    defaultData: sectionDefaultsByVariant["section-30"],
    title: "Study abroad services section",
    description: "Service highlights with guidance CTA and destination illustration",
    Mutation: mutationRegistry["section-30"],
  },
  "section-31": {
    defaultData: sectionDefaultsByVariant["section-31"],
    title: "Study abroad impact section",
    description: "Headline, highlighted message, and placement statistics",
    Mutation: mutationRegistry["section-31"],
  },
  "section-32": {
    defaultData: sectionDefaultsByVariant["section-32"],
    title: "Success story timeline section",
    description: "Animated student journeys with responsive timeline storytelling",
    Mutation: mutationRegistry["section-32"],
  },
  "section-33": {
    defaultData: sectionDefaultsByVariant["section-33"],
    title: "Premium templates hero section",
    description: "Blue hero banner with stats and feature chips",
    Mutation: mutationRegistry["section-33"],
  },
  "section-34": {
    defaultData: sectionDefaultsByVariant["section-34"],
    title: "Creator video reviews section",
    description: "Responsive video review cards with configurable labels, links, and colors",
    Mutation: mutationRegistry["section-34"],
  },
  "section-35": {
    defaultData: sectionDefaultsByVariant["section-35"],
    title: "Hostinger recommendation banner",
    description: "Configurable gradient recommendation banner with link and editable colors",
    Mutation: mutationRegistry["section-35"],
  },
  "section-36": {
    defaultData: sectionDefaultsByVariant["section-36"],
    title: "Category slider section",
    description: "Responsive category cards with editable icons, colors, and horizontal scrolling",
    Mutation: mutationRegistry["section-36"],
  },
  "section-37": {
    defaultData: sectionDefaultsByVariant["section-37"],
    title: "Study abroad experience hero",
    description: "Animated bilingual hero with experience badge, calls to action, and theme colors",
    Mutation: mutationRegistry["section-37"],
  },
  "section-38": {
    defaultData: sectionDefaultsByVariant["section-38"],
    title: "Mission and vision section",
    description: "Animated mission and vision collage with editable content, media, and colors",
    Mutation: mutationRegistry["section-38"],
  },
  "section-39": {
    defaultData: sectionDefaultsByVariant["section-39"],
    title: "Study abroad guidance section",
    description: "Image collage and guidance copy with editable content, media, and theme colors",
    Mutation: mutationRegistry["section-39"],
  },
  "section-40": {
    defaultData: sectionDefaultsByVariant["section-40"],
    title: "Free consultation section",
    description: "Appointment-focused study abroad content with editable actions, media, and colors",
    Mutation: mutationRegistry["section-40"],
  },
  "section-41": {
    defaultData: sectionDefaultsByVariant["section-41"],
    title: "Study destination information section",
    description: "Educational destination copy with editable paragraphs, image, and colors",
    Mutation: mutationRegistry["section-41"],
  },
  "section-42": {
    defaultData: sectionDefaultsByVariant["section-42"],
    title: "United Kingdom study destination section",
    description: "Study destination copy with editable paragraphs, image, and colors",
    Mutation: mutationRegistry["section-42"],
  },
  "section-43": {
    defaultData: sectionDefaultsByVariant["section-43"],
    title: "United Kingdom benefits section",
    description: "Study destination benefits with editable content, image, and theme colors",
    Mutation: mutationRegistry["section-43"],
  },
  "section-44": {
    defaultData: sectionDefaultsByVariant["section-44"],
    title: "United Kingdom student visa section",
    description: "Visa requirements content with editable checklist items, image, and colors",
    Mutation: mutationRegistry["section-44"],
  },
  "section-45": {
    defaultData: sectionDefaultsByVariant["section-45"],
    title: "United Kingdom visa documents section",
    description: "Visa document checklist with editable content, image, and colors",
    Mutation: mutationRegistry["section-45"],
  },
  "section-46": {
    defaultData: sectionDefaultsByVariant["section-46"],
    title: "Partner universities section",
    description: "University cards with editable institutions, media, application links, and colors",
    Mutation: mutationRegistry["section-46"],
  },
  "section-47": {
    defaultData: sectionDefaultsByVariant["section-47"],
    title: "United States study destination section",
    description: "Study destination copy with editable paragraphs, image, and colors",
    Mutation: mutationRegistry["section-47"],
  },
  "section-48": {
    defaultData: sectionDefaultsByVariant["section-48"],
    title: "Global consultation hero",
    description: "Animated globe hero with Bengali messaging, trust stamp, and consultation form",
    Mutation: mutationRegistry["section-48"],
  },
};

export const sectionAssets = Object.entries(sectionIndex).map(([variant, section]) => ({
  variant: variant as SectionVariant,
  ...section,
}));
export const getSectionDefinition = (variant: string) => sectionIndex[variant as SectionVariant];
export { hydrateSectionData };
export const sectionChoices = sectionAssets.map(({ variant, title, description }) => ({
  variant,
  label: `${title} · ${description}`,
}));
export const sectionDefaults = (kind: SectionVariant) => getSectionDefaults(kind);

export function SectionMutation({
  kind,
  data,
  onChange,
}: {
  kind: SectionVariant;
  data: SectionData;
  onChange: (data: SectionData) => void;
}) {
  const Mutation = getSectionDefinition(kind)?.Mutation;
  return Mutation ? (
    <Suspense fallback={null}>
      <Mutation data={hydrateSectionData(kind, data) ?? data} onChange={onChange} />
    </Suspense>
  ) : null;
}
