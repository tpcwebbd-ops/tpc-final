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
  author: {
    name: string;
    avatar: string;
    trustScore: number;
  };
  flagReason: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

export const defaultDataSection4 = {
  id: "section-uid-4",
  paddingX: 0,
  paddingY: 0,
  showEyebrow: true,
  badge: "Dashboard Metrics",
  title: "Quantum Network Overview",
  subTitle: "Real-Time Monitoring and Analysis",
  metrics: [
    { id: "m1", label: "Network Velocity", value: "84.2 TB/s", trend: 12.5, status: "stable" },
    { id: "m2", label: "Quantum Entanglement", value: "99.9%", trend: 0.4, status: "stable" },
    { id: "m3", label: "Grid Anomalies", value: "15 Detected", trend: -2.3, status: "warning" },
    { id: "m4", label: "Active Neural Nodes", value: "4,205", trend: 8.1, status: "stable" },
  ] as DashboardMetric[],

  moderationQueue: [
    {
      id: "mod-1",
      type: "comment",
      content: "The Section 15 protocol is a myth. The grid is a lie. Wake up.",
      author: {
        name: "Neo_X",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        trustScore: 45,
      },
      flagReason: "Subversive Content",
      timestamp: "2 mins ago",
      severity: "high",
    },
    {
      id: "mod-2",
      type: "article",
      content: "Draft: Implementing Hyper-Spatial Navigation in React",
      author: {
        name: "Sarah Chen",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        trustScore: 92,
      },
      flagReason: "Pending Approval",
      timestamp: "15 mins ago",
      severity: "low",
    },
    {
      id: "mod-3",
      type: "comment",
      content: "Spam link: http://buy-quantum-crypto.com",
      author: {
        name: "Bot_99",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        trustScore: 10,
      },
      flagReason: "Malicious Link",
      timestamp: "1 hour ago",
      severity: "high",
    },
  ] as ModerationItem[],
};

export type Section4Data = typeof defaultDataSection4;
