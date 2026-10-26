/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

export type HomeCard = {
  title: string;
  description: string;
};

export type HomeData = {
  forceUpdate: "true" | "false";
  paddingX: number;
  paddingY: number;
  eyebrow: string;
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  sectionsJson: string;
};

export const defaultCards: HomeCard[] = [
  { title: "Trusted by teams", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Services that scale", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Built for clarity", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "A simple process", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Work that matters", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Useful insights", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Ready when you are", description: "Thoughtful detail, clear direction, and room to grow." },
  { title: "Start a conversation", description: "Thoughtful detail, clear direction, and room to grow." },
];

export const defaultHomeCard: HomeCard = { title: "New section", description: "Add a short description." };

export const defaultData: HomeData = {
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "Home",
  title: "Make every visit count",
  intro: "A clear, flexible website foundation for your next idea.",
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Home page illustration",
  sectionsJson: JSON.stringify(defaultCards),
};
