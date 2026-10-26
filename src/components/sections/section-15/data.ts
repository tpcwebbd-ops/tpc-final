/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface LocationContact {
  email: string;
  phone: string;
  manager: string;
}

export interface OfficeLocation {
  id: string;
  sectionUid: string;
  name: string;
  type: "Headquarters" | "Research Lab" | "Data Center";
  address: string;
  city: string;
  country: string;
  coordinates: GeoPoint;
  contact: LocationContact;
  image: string;
  description: string;
  features: string[];
  schedule: string;
}

export interface Section15Payload {
  locations: OfficeLocation[];
  paddingX: number;
  paddingY: number;
}

export const defaultLayout = { paddingX: 0, paddingY: 0 };

export const defaultDataSection15: OfficeLocation[] = [
  {
    sectionUid: "section-uid-15-100",
    id: "section-uid-15",
    name: "NexaMart Head Office",
    type: "Headquarters",
    address: "21/B Bijoyshoroni, Tecgaon, Dhaka-1200.",
    city: "Dhaka",
    country: "Bangladesh",
    coordinates: { lat: 23.775, lng: 90.39 },
    contact: {
      email: "example@gmail.com",
      phone: "01711 221122",
      manager: "NexaMart Team",
    },
    image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    description:
      "NexaMart supports teams with practical planning, clear communication, and reliable project delivery.",
    features: ["Customer Support", "Project Planning", "Service Updates"],
    schedule: "Sat-Thu, 10:00 - 18:00 BST",
  },
];
