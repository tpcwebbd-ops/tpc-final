/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

import type { HomeData } from "../home/data";

export const defaultIeltsPreparationData: HomeData = {
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "TestPrep Center IELTS Preparation",
  title: "Prepare for IELTS online with a clear, practical plan.",
  intro:
    "TestPrep Center helps learners in Bangladesh build confidence across IELTS Listening, Reading, Writing, and Speaking through online learning and focused practice.",
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Student preparing for IELTS online with TestPrep Center",
  sectionsJson: JSON.stringify([
    {
      title: "Understand your starting point",
      description: "Identify the skills to prioritise and set a realistic target for your study plan.",
    },
    {
      title: "Practise every IELTS skill",
      description: "Work on Listening, Reading, Writing, and Speaking with focused online exercises.",
    },
    {
      title: "Learn useful exam strategies",
      description: "Use practical approaches for timing, question types, task response, and clear communication.",
    },
    {
      title: "Build a consistent routine",
      description: "Follow manageable weekly goals that fit around school, work, or other commitments.",
    },
    {
      title: "Prepare with confidence",
      description: "Ask questions and use feedback to make your next step clearer before test day.",
    },
  ]),
};

export const defaultKidsSpokenEnglishData: HomeData = {
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "TPC Kids Spoken English",
  title: "Help your child speak English with confidence.",
  intro:
    "TPC Kids is an online spoken-English course for young learners in Bangladesh, built around friendly practice, everyday vocabulary, and confident communication.",
  imageUrl: "/images/all-pages-placeholder.png",
  imageAlt: "Child learning spoken English online with TestPrep Center",
  sectionsJson: JSON.stringify([
    {
      title: "Everyday speaking practice",
      description: "Children practise useful English for introductions, school, home, and daily conversations.",
    },
    {
      title: "Friendly online learning",
      description: "Lessons are designed to be supportive, engaging, and easy for young learners to follow online.",
    },
    {
      title: "Vocabulary they can use",
      description: "Build practical words and phrases that help children express ideas more clearly.",
    },
    {
      title: "Confidence step by step",
      description: "Small, regular speaking activities help learners become comfortable using English aloud.",
    },
    {
      title: "Support for parents",
      description: "Contact TestPrep Center to learn about course suitability, schedules, and enrolment.",
    },
  ]),
};
