/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  description: string;
  actionText: string;
}

export interface Section13Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  title: string;
  badge: string;
  showEyebrow: boolean;
  subTitle: string;
  description: string;
  categories: string[];
  events: IEvent[];
}

export interface Section13Props {
  data?: Section13Data | string;
}

export const defaultEvent: Omit<IEvent, "id" | "category"> = { title: "New Event", date: "TBD", location: "TBD", image: "", description: "Event details goes here...", actionText: "Register" };

export const defaultDataSection13: Section13Data = {
  sectionUid: "section-uid-13",
  id: "section-uid-13",
  paddingX: 0,
  paddingY: 0,
  title: "Community",
  badge: "Get Together",
  showEyebrow: true,
  subTitle: "Gatherings",
  description:
    "Join our vibrant community events. Connect, learn, and grow together in spaces designed for collaboration.",
  categories: ["Workshop", "Conference", "Hackathon"],
  events: [
    {
      id: "evt-1",
      title: "Annual Tech Summit",
      date: "Oct 15, 2024",
      location: "San Francisco, CA",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "Conference",
      description: "A full day of keynotes, workshops, and networking with industry leaders.",
      actionText: "Register Now",
    },
    {
      id: "evt-2",
      title: "Design Systems Workshop",
      date: "Nov 02, 2024",
      location: "Online / Zoom",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "Workshop",
      description: "Deep dive into building scalable UI libraries with Figma and React.",
      actionText: "Join Waitlist",
    },
    {
      id: "evt-3",
      title: "Winter Hackathon",
      date: "Dec 10, 2024",
      location: "London, UK",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      category: "Hackathon",
      description: "48 hours of coding, pizza, and innovation. Open to all skill levels.",
      actionText: "Apply to Hack",
    },
  ],
};
