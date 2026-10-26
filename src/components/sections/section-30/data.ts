/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IServiceFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface Section30Data {
  id: string;
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  features: IServiceFeature[];
  ctaText: string;
  rightCardBadge: string;
  locationLabel: string;
  destinationLabel: string;
}

export interface Section30Payload extends Section30Data {
  paddingX: number;
  paddingY: number;
}

export interface Section30Props {
  data?: Section30Data | Section30Payload | string;
}

export const defaultDataSection30: Section30Data = {
  id: "section-uid-30",
  badgeText: "★ We Are Also Providing",
  headingPrefix: "The Best",
  headingHighlight: "Study Abroad",
  headingSuffix: "Services",
  features: [
    {
      title: "Expert Guidance",
      description:
        "Get personalized support from experienced counselors who understand your goals and help you achieve them.",
      iconName: "Users",
    },
    {
      title: "High Success Rate",
      description: "From applications to visas, our proven process ensures a smooth and successful journey.",
      iconName: "Award",
    },
    {
      title: "Tailored Solutions",
      description: "We provide customized advice based on your needs, budget, and career aspirations.",
      iconName: "BookOpen",
    },
  ],
  ctaText: "Book Free Consultation",
  rightCardBadge: "★ Where dreams come true",
  locationLabel: "Your Location",
  destinationLabel: "Dream Destination",
};

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};
