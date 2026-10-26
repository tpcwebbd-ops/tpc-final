/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

export type AboutSection = {
  id: string;
  eyebrow: string;
  showEyebrow: boolean;
  title: string;
  description: string;
};

export const defaultSections: AboutSection[] = [
  {
    id: "believe",
    eyebrow: "What we believe",
    showEyebrow: true,
    title: "Useful work starts with clear thinking.",
    description: "Clear thinking, useful design, and honest communication should make every experience better.",
  },
  {
    id: "work",
    eyebrow: "How we work",
    showEyebrow: true,
    title: "We make complex work feel simple.",
    description: "We listen first, define the real goal, and turn complex requirements into practical next steps.",
  },
  {
    id: "people",
    eyebrow: "The people behind it",
    showEyebrow: true,
    title: "A collaborative team brings ideas to life.",
    description: "Strategy, craft, and care come together in every detail from the first conversation onward.",
  },
  {
    id: "next",
    eyebrow: "What comes next",
    showEyebrow: true,
    title: "Strong work keeps improving after launch.",
    description: "Feedback, support, and thoughtful iteration help every project stay useful as it grows.",
  },
];

export const defaultAboutSection: Omit<AboutSection, "id"> = {
  eyebrow: "New eyebrow",
  showEyebrow: true,
  title: "New section",
  description: "Add your section description.",
};

// Structured content remains serialized for compatibility with the existing page API.
export const defaultData = {
  eyebrow: "About us",
  showEyebrow: "true",
  title: "People, purpose, progress",
  intro: "We turn thoughtful planning into digital experiences that are easy to use.",
  image: "/images/all-pages-placeholder.png",
  sectionsJson: JSON.stringify(defaultSections),
  paddingX: "0",
  paddingY: "0",
};
