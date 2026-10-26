/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStoryItem {
  id: string;
  name: string;
  university: string;
  subject: string;
  image: string;
  description: string;
}

export interface ISection32Data {
  id: string;
  title: string;
  subtitle: string;
  stories: IStoryItem[];
}

export type Section32Data = ISection32Data;

export interface Section32Payload extends Section32Data {
  paddingX: number;
  paddingY: number;
}

export interface Section32Props {
  data?: Section32Data | Section32Payload | string;
}

export const defaultDataSection32: Section32Data = {
  id: "section-uid-32",
  title: "Journeys of Excellence",
  subtitle: "Following the path of success, one story at a time.",
  stories: [
    {
      id: "1",
      name: "Sarah Jenkins",
      university: "Stanford University",
      subject: "Computer Science",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      description:
        "Overcoming initial struggles with algorithms, Sarah dedicated her weekends to coding bootcamps. Her perseverance led to a breakthrough internship at Google.",
    },
    {
      id: "2",
      name: "Michael Chen",
      university: "MIT",
      subject: "Robotics Engineering",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      description:
        "Michael balanced a full-time job while pursuing his masters. His innovative thesis on autonomous drone navigation caught the attention of Tesla.",
    },
    {
      id: "3",
      name: "Priya Patel",
      university: "Cambridge University",
      subject: "Biotechnology",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
      description:
        "Starting with limited funding, Priya secured multiple grants. Her work on sustainable bio-plastics is now being adopted by major packaging firms.",
    },
    {
      id: "4",
      name: "David Okonjo",
      university: "Oxford University",
      subject: "Economics",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
      description:
        "David moved countries to pursue his education. He graduated top of his class and founded a fintech startup helping underbanked communities.",
    },
    {
      id: "5",
      name: "Emma Wilson",
      university: "Harvard Medical School",
      subject: "Neurology",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
      description:
        "Emma spent years volunteering in remote clinics. Her empathy-driven approach earned her a fellowship at Johns Hopkins.",
    },
  ],
};

export const defaultData = defaultDataSection32;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
