/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
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
  members: TeamMember[];
}

export interface ILeadershipTeamData {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  title: string;
  description: string;
  founderLabel: string;
  ceo: TeamMember;
  rows: TeamRow[];
}

export interface LeadershipTeamPayload extends ILeadershipTeamData {
  paddingX: number;
  paddingY: number;
}

export interface LeadershipTeamProps {
  data?: ILeadershipTeamData | LeadershipTeamPayload | string;
}

export const defaultLeadershipTeamMember: Omit<TeamMember, "id"> = {
  name: "New Team Member",
  title: "Role / Position",
  bio: "Write a short introduction for this team member.",
  image: "",
};
export const defaultLeadershipTeamRow: Omit<TeamRow, "id" | "members"> = { label: "New Team Group" };

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const defaultDataLeadershipTeam: ILeadershipTeamData = {
  pageUid: "leadership-team-uid",
  pageName: "Team",
  eyebrow: "TestPrep Center",
  title: "Meet the TestPrep Center team",
  description:
    "A learner-focused team providing online IELTS preparation, study-abroad guidance, and TPC Kids Spoken English support across Bangladesh.",
  founderLabel: "TPC Team",
  ceo: {
    id: "ceo",
    name: "TestPrep Center",
    title: "Online Education Team",
    bio: "Helps learners access practical, reliable online education guidance from anywhere in Bangladesh.",
    image: "https://i.pravatar.cc/600?img=13",
  },
  rows: [
    {
      id: "leadership",
      label: "Learning Support",
      members: [
        {
          id: "creative-director",
          name: "TPC Academic Support",
          title: "IELTS Learning Support",
          bio: "Helps learners organise their IELTS preparation and build confidence across the four skills.",
          image: "https://i.pravatar.cc/500?img=47",
        },
        {
          id: "lead-developer",
          name: "TPC Study Abroad Support",
          title: "Study-Abroad Guidance",
          bio: "Helps learners understand destinations, applications, and their next preparation steps.",
          image: "https://i.pravatar.cc/500?img=68",
        },
      ],
    },
    {
      id: "growth",
      label: "Programs",
      members: [
        {
          id: "marketing-lead",
          name: "TPC Kids",
          title: "Kids Spoken English",
          bio: "Supports young learners as they practise everyday English communication online.",
          image: "https://i.pravatar.cc/500?img=32",
        },
        {
          id: "content-strategist",
          name: "TPC Learning Resources",
          title: "Learning Content Support",
          bio: "Creates useful, goal-focused learning resources and updates for TPC learners.",
          image: "https://i.pravatar.cc/500?img=51",
        },
      ],
    },
    {
      id: "product",
      label: "Learner Care",
      members: [
        {
          id: "ui-ux-designer",
          name: "TPC Online Support",
          title: "Online Learning Support",
          bio: "Helps learners access online services and find the information they need.",
          image: "https://i.pravatar.cc/500?img=25",
        },
        {
          id: "client-success",
          name: "TPC Student Care",
          title: "Learner Support",
          bio: "Answers questions and helps learners choose the next step that fits their goal.",
          image: "https://i.pravatar.cc/500?img=60",
        },
      ],
    },
  ],
};
