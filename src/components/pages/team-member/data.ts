/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface TeamRow {
  id: string;
  label: string;
  showEyebrow?: boolean;
  members: TeamMember[];
}

export interface IPage8Data {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  showEyebrow?: boolean;
  title: string;
  description: string;
  founderLabel: string;
  showFounderLabel?: boolean;
  ceo: TeamMember;
  rows: TeamRow[];
}

export interface Page8Payload extends IPage8Data {
  paddingX: number;
  paddingY: number;
}

export interface Page8Props {
  data?: IPage8Data | Page8Payload | string;
}

export const defaultTeamMember: Omit<TeamMember, "id"> = {
  name: "New Team Member",
  title: "Role / Position",
  bio: "Write a short introduction for this team member.",
  image: "",
};
export const defaultTeamRow: Omit<TeamRow, "id" | "members"> = { label: "New Team Group" };

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataPage8: IPage8Data = {
  pageUid: "page-uid-tema-member",
  pageName: "Team",
  eyebrow: "Site",
  showEyebrow: true,
  title: "Meet the people behind Site",
  description:
    "A dedicated team combining strategy, creativity, technology, and customer care to help clients reach meaningful goals.",
  founderLabel: "Founder",
  showFounderLabel: true,
  ceo: {
    id: "ceo",
    name: "Tanvir Ahmed",
    title: "Founder & CEO",
    bio: "Leads Site with a clear vision: making expert guidance personal, reliable, and accessible.",
    image: "https://i.pravatar.cc/600?img=13",
  },
  rows: [
    {
      id: "leadership",
      label: "Leadership",
      showEyebrow: true,
      members: [
        {
          id: "creative-director",
          name: "Nusrat Jahan",
          title: "Creative Director",
          bio: "Guides the team and helps every client receive thoughtful support throughout their project journey.",
          image: "https://i.pravatar.cc/500?img=47",
        },
        {
          id: "lead-developer",
          name: "Rakibul Hasan",
          title: "Lead Developer",
          bio: "Builds the fast, reliable web platforms our clients run their business on.",
          image: "https://i.pravatar.cc/500?img=68",
        },
      ],
    },
    {
      id: "growth",
      label: "Growth",
      showEyebrow: true,
      members: [
        {
          id: "marketing-lead",
          name: "Farhana Islam",
          title: "Marketing Lead",
          bio: "Turns ad budgets into measurable growth across Meta, Google, and TikTok.",
          image: "https://i.pravatar.cc/500?img=32",
        },
        {
          id: "content-strategist",
          name: "Shahriar Kabir",
          title: "Content Strategist",
          bio: "Writes and plans the content calendars that keep client audiences engaged weekly.",
          image: "https://i.pravatar.cc/500?img=51",
        },
      ],
    },
    {
      id: "product",
      label: "Product",
      showEyebrow: true,
      members: [
        {
          id: "ui-ux-designer",
          name: "Mim Akter",
          title: "UI/UX Designer",
          bio: "Designs interfaces that feel effortless, tested with real users before every launch.",
          image: "https://i.pravatar.cc/500?img=25",
        },
        {
          id: "client-success",
          name: "Imran Chowdhury",
          title: "Client Success Manager",
          bio: "The steady voice clients call first, from onboarding through every project milestone.",
          image: "https://i.pravatar.cc/500?img=60",
        },
      ],
    },
  ],
};
