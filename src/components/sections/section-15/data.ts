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
    name: "TestPrep Center Online Support",
    type: "Headquarters",
    address: "Online services available from anywhere in Bangladesh.",
    city: "Online",
    country: "Bangladesh",
    coordinates: { lat: 23.775, lng: 90.39 },
    contact: {
      email: "WhatsApp: 01786558855",
      phone: "01786558855",
      manager: "TestPrep Center Team",
    },
    image: "https://i.ibb.co/KpGnqS3D/nature.jpg",
    description:
      "TestPrep Center provides online IELTS preparation, study-abroad guidance, and kids' spoken English support for learners across Bangladesh.",
    features: ["IELTS Preparation", "Study Abroad Guidance", "TPC Kids Spoken English"],
    schedule: "Contact us on WhatsApp for online service information.",
  },
];
