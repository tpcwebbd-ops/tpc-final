/*
|-----------------------------------------
| setting up public MCQ examination links without account sign-in
|-----------------------------------------
*/

import type { Metadata } from "next";

import McqStudentExam from "@/components/mcq/McqStudentExam";

export const metadata: Metadata = {
  title: "MCQ Examination | TestPrep Center",
  robots: { index: false, follow: false },
};
export default async function PublicMcqPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <McqStudentExam slug={slug} />;
}
