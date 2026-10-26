/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStory {
  id: string;
  name: string;
  image: string;
  university: string;
  showEyebrow: boolean;
  subject: string;
  description: string;
}

export interface Section10Data {
  id: string;
  sectionUid: string;
  paddingX: number;
  paddingY: number;
  stories: IStory[];
  storiesPerPage: number;
}

export interface Section10Props {
  data?: Section10Data | string;
}

export const defaultStory: Omit<IStory, "id"> = { name: "New Student", university: "University Name", subject: "Program / Course", image: "", showEyebrow: true, description: "Add a description about the student success story..." };

export const defaultDataSection10: Section10Data = {
  sectionUid: "section-uid-10",
  id: "section-uid-10",
  paddingX: 0,
  paddingY: 0,
  storiesPerPage: 1,
  stories: [
    {
      id: "story-001",
      name: "Jaswanth Vishnumolakala",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "University of Buckingham",
      showEyebrow: true,
      subject: "BSc Computing (AI & Robotics)",
      description:
        "Jaswanth achieved a First Class Bachelor's degree. His time at the university was transformative, fostering both personal and professional growth.",
    },
    {
      id: "story-002",
      name: "Sarah Jenkins",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "Stanford University",
      showEyebrow: true,
      subject: "MSc Computer Science",
      description:
        "Sarah led the Google Developer Student Club and published three research papers on Machine Learning. She is now working as a Lead AI Researcher at OpenAI.",
    },
    {
      id: "story-003",
      name: "Michael Chen",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "MIT",
      showEyebrow: true,
      subject: "BEng Electrical Engineering",
      description:
        "Michael developed a patent-pending solar technology during his junior year. His dedication to sustainable energy has earned him the Green Tech Innovator Award.",
    },
    {
      id: "story-004",
      name: "Aisha Rahman",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "University of Toronto",
      showEyebrow: true,
      subject: "MSc Data Science",
      description:
        "Aisha turned her passion for meaningful data into practical research, helping a community project improve access to essential services.",
    },
    {
      id: "story-005",
      name: "Daniel Okafor",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "University of Melbourne",
      showEyebrow: true,
      subject: "BSc Software Engineering",
      description:
        "Daniel built a dependable digital platform for local businesses and graduated with a portfolio that opened doors to an international engineering team.",
    },
    {
      id: "story-006",
      name: "Maya Thompson",
      image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
      university: "University of Amsterdam",
      showEyebrow: true,
      subject: "MA Digital Marketing",
      description:
        "Maya combined creative storytelling with measurable campaigns, helping purpose-led brands grow their audiences and reach new communities.",
    },
  ],
};
