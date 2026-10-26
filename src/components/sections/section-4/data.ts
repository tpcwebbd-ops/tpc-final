/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  status: "stable" | "warning" | "critical";
}
export interface ModerationItem {
  id: string;
  type: "comment" | "article";
  content: string;
  author: { name: string; avatar: string; trustScore: number };
  flagReason: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}
export const defaultDataSection4 = {
  id: "section-uid-4",
  paddingX: 0,
  paddingY: 0,
  showEyebrow: true,
  badge: "TestPrep Center",
  title: "Learning Support Overview",
  subTitle: "Online services for learners across Bangladesh",
  metrics: [
    { id: "m1", label: "IELTS", value: "Online Preparation", trend: 0, status: "stable" },
    { id: "m2", label: "Study Abroad", value: "Guidance", trend: 0, status: "stable" },
    { id: "m3", label: "TPC Kids", value: "Spoken English", trend: 0, status: "stable" },
    { id: "m4", label: "Access", value: "Online", trend: 0, status: "stable" },
  ] as DashboardMetric[],
  moderationQueue: [
    {
      id: "support-1",
      type: "comment",
      content: "I would like to prepare for IELTS online.",
      author: { name: "TPC learner", avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg", trustScore: 100 },
      flagReason: "Learner enquiry",
      timestamp: "New",
      severity: "low",
    },
    {
      id: "support-2",
      type: "article",
      content: "How can I start planning to study abroad?",
      author: { name: "TPC learner", avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg", trustScore: 100 },
      flagReason: "Guidance request",
      timestamp: "New",
      severity: "low",
    },
  ] as ModerationItem[],
};
export type Section4Data = typeof defaultDataSection4;
