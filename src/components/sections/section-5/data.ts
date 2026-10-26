/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: Author;
  category: string;
  tags: string[];
  featured?: boolean;
}
export interface Section5Data {
  id: string;
  paddingX: number;
  paddingY: number;
  showEyebrow?: boolean;
  categories: string[];
  allData: BlogPost[];
}
export const defaultDataSection5: Section5Data = {
  id: "section-uid-5",
  paddingX: 0,
  paddingY: 0,
  showEyebrow: true,
  categories: ["All", "Quantum UI", "Engineering", "Design Systems", "Algorithms"],
  allData: [
    {
      id: "post-1",
      title: "The Event Horizon: Designing for Non-Linear Navigation",
      excerpt:
        "Traditional breadcrumbs fail in multidimensional interfaces. Here is how we implemented spatial state management using probabilistic graph theory.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 28, 2025",
      readTime: "12 min read",
      category: "Quantum UI",
      tags: ["UX", "Navigation", "Math"],
      author: {
        name: "Dr. Aris Thorne",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Lead Architect",
      },
      featured: true,
    },
    {
      id: "post-2",
      title: "CSS Grid Level 5: Subgrid Anomalies",
      excerpt:
        "Exploring the weird parts of the new CSS specification where parent grids inherit constraints from their quantum children.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 25, 2025",
      readTime: "6 min read",
      category: "Engineering",
      tags: ["CSS", "Frontend", "Spec"],
      author: {
        name: "Elena Vance",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Principal Designer",
      },
    },
    {
      id: "post-3",
      title: "Algorithmic Typography: Variable Fonts in Motion",
      excerpt: "Using the Web Audio API to drive font-weight and slant based on ambient user environment noise.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 22, 2025",
      readTime: "8 min read",
      category: "Design Systems",
      tags: ["Typography", "Audio", "Canvas"],
      author: {
        name: "Sarah Chen",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Creative Developer",
      },
    },
    {
      id: "post-4",
      title: "Server Components as Micro-Black Holes",
      excerpt: "Optimizing data density by collapsing the hydration waterfall into a single singularity point.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 18, 2025",
      readTime: "15 min read",
      category: "Engineering",
      tags: ["React", "Performance", "Server"],
      author: {
        name: "Marcus K.",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Systems Engineer",
      },
    },
    {
      id: "post-5",
      title: "Heuristics of the Void",
      excerpt: "Why empty states in complex dashboards should never be truly empty. The psychology of negative space.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 15, 2025",
      readTime: "5 min read",
      category: "Quantum UI",
      tags: ["Psychology", "UX"],
      author: {
        name: "Elena Vance",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Principal Designer",
      },
    },
    {
      id: "post-6",
      title: "Refactoring the Monolith",
      excerpt:
        "A case study on breaking down a 50GB legacy codebase using the Strangler Fig pattern and nuclear fusion.",
      coverImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      publishedAt: "Nov 10, 2025",
      readTime: "20 min read",
      category: "Algorithms",
      tags: ["Legacy", "Architecture"],
      author: {
        name: "Dr. Aris Thorne",
        avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        role: "Lead Architect",
      },
    },
  ],
};
