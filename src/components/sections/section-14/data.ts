/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export type ArticleBlock =
  | { type: "text"; content: string }
  | { type: "quote"; content: string; author: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "heading"; content: string };

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Section14Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  badge: string;
  showEyebrow: boolean;
  title: string;
  subTitle: string;
  allData: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: Author;
    heroImage: string;
    content: ArticleBlock[];
    tags: string[];
  }[];
}

const defaultDataSection14Items: Section14Data[] = [
  {
    id: "section-uid-14",
    sectionUid: "section-uid-14",
    paddingX: 0,
    paddingY: 0,
    badge: "Latest Articles",
    showEyebrow: true,
    title: "Quantum User Interfaces",
    subTitle: "Exploring the Future of Design",
    allData: [
      {
        id: "art-15-2024-01",
        title: "The Future of Quantum User Interfaces",
        subtitle:
          "Exploring the intersection of multidimensional design and quantum computing paradigms in modern web experiences.",
        category: "Design Engineering",
        readTime: "8 min read",
        publishedAt: "Nov 29, 2025",
        author: {
          name: "Elena Vance",
          role: "Principal Product Designer",
          avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        },
        heroImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        tags: ["UX Design", "Quantum Computing", "Web3", "Framer Motion"],
        content: [
          {
            type: "heading",
            content: "Beyond the Flat Screen",
          },
          {
            type: "text",
            content:
              "As we approach the event horizon of spatial computing, the traditional flat interfaces we have grown accustomed to are beginning to dissolve. The pixels are no longer static; they are probabilistic waves waiting to be observed.",
          },
          {
            type: "image",
            src: "https://i.ibb.co/KpGnqS3D/nature.jpg",
            alt: "Cyberpunk abstract interface",
            caption: "Figure 1.0: Visualizing data streams in a non-linear layout.",
          },
          {
            type: "quote",
            content:
              "The interface is no longer a window, but a membrane through which digital and physical realities osmose.",
            author: "Dr. Aris Thorne",
          },
          {
            type: "text",
            content:
              "Designers must now think in Z-index not just as a stacking context, but as a dimension of time and relevance. When a user interacts with a quantum UI, they are collapsing a wave function of potential layouts into a single, observable state.",
          },
          {
            type: "heading",
            content: "The Section 15 Protocol",
          },
          {
            type: "text",
            content:
              "Section 15 refers to the specific layout grid anomaly where content breaks the container to establish dominance over the viewport. It is a bold, aggressive stance against the tyranny of the 12-column grid.",
          },
        ],
      },
      {
        id: "art-15-2024-02",
        title: "Abstracting the Monolith: Micro-Frontend Patterns",
        subtitle:
          "Deconstructing legacy systems into composable, autonomous units for scalable enterprise applications.",
        category: "System Architecture",
        readTime: "12 min read",
        publishedAt: "Dec 03, 2025",
        author: {
          name: "Marcus Chen",
          role: "Senior Solutions Architect",
          avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        },
        heroImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        tags: ["Microservices", "React", "Federation", "Scalability"],
        content: [
          {
            type: "heading",
            content: "The Decomposition Fallacy",
          },
          {
            type: "text",
            content:
              "Breaking down a monolith is not merely about separating code repositories; it is about disentangling domain logic. Many teams fall into the trap of distributed monoliths, where services are technically separate but operationally coupled.",
          },
          {
            type: "quote",
            content:
              "True modularity is measured by how many services you can delete without bringing down the system.",
            author: "Sarah O’Connell",
          },
          {
            type: "image",
            src: "https://i.ibb.co/KpGnqS3D/nature.jpg",
            alt: "Architecture diagram sketch",
            caption: "Figure 2.1: Domain boundaries in a federated graph.",
          },
          {
            type: "text",
            content:
              "By leveraging module federation, we can share context at runtime rather than build time. This allows distinct teams to deploy features independently while maintaining a cohesive user experience across the platform.",
          },
        ],
      },
      {
        id: "art-15-2024-03",
        title: "Biomimicry in Algorithmic Design",
        subtitle:
          "How patterns found in nature are influencing the efficiency of sorting algorithms and neural network topology.",
        category: "Computer Science",
        readTime: "6 min read",
        publishedAt: "Dec 10, 2025",
        author: {
          name: "Dr. Alara Kovic",
          role: "Computational Biologist",
          avatar: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        },
        heroImage: "https://i.ibb.co/KpGnqS3D/nature.jpg",
        tags: ["Biomimicry", "Algorithms", "AI", "Nature"],
        content: [
          {
            type: "heading",
            content: "The Efficiency of the Hive",
          },
          {
            type: "text",
            content:
              "Nature has had millions of years to optimize for energy efficiency and resource allocation. We are now seeing swarm intelligence algorithms that mimic bee colonies solving the traveling salesman problem faster than traditional brute force methods.",
          },
          {
            type: "image",
            src: "https://i.ibb.co/KpGnqS3D/nature.jpg",
            alt: "Fractal patterns in leaves",
            caption: "Figure 3.0: Recursive growth patterns in organic structures.",
          },
          {
            type: "heading",
            content: "Neural Mycelium",
          },
          {
            type: "text",
            content:
              "Just as fungi transfer nutrients across vast distances through mycelial networks, modern decentralized networks are adopting similar routing protocols to prevent congestion and ensure data integrity during high-traffic events.",
          },
          {
            type: "quote",
            content:
              "We do not need to invent perfect systems; we only need to observe the ones that have already survived.",
            author: "Janus Vogh",
          },
        ],
      },
    ],
  },
];

export const defaultDataSection14 = defaultDataSection14Items[0];
