/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section7Data {
  sectionUid: string;
  id: string;
  paddingX: number;
  paddingY: number;
  eyebrow: string;
  showEyebrow: boolean;
  country: string;
  city: string[];
  universitys: {
    id: string;
    name: string;
    image: string;
    location: string;
    courses: {
      id: string;
      name: string;
      tutionFees: string;
      duration: string;
      description: string;
      degreeLevelInfo: {
        id: string;
        degreeLevel: string;
        tutionFees: string;
        duration: string;
      }[];
      applyBtnParms: string[];
      applyBtnParmsDegreeLevel: string[];
    }[];
    description: string;
  }[];
}

export interface Section7Props {
  data?: Section7Data | string;
}

export const defaultDataSection7: Section7Data = {
  sectionUid: "section-uid-7",
  id: "section-uid-7",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "Study Abroad Opportunities",
  showEyebrow: true,
  country: "Australia",
  city: ["Sydney", "Melbourne", "Brisbane"],
  universitys: [
    {
      id: "UNI-AU-SYD",
      name: "University of Sydney",
      image: "https://i.ibb.co/PGXYXwTq/img.jpg",
      location: "Sydney",
      description: "Australia's first university, consistently ranked in the top 50 worldwide.",
      courses: [
        {
          id: "CRS-SYD-01",
          name: "Master of Commerce",
          tutionFees: "AUD 54,000 / year",
          duration: "2 Years",
          description: "Advanced business skills and leadership training.",
          degreeLevelInfo: [
            {
              id: "DL-SYD-01-M",
              degreeLevel: "Master",
              tutionFees: "AUD 54,000 / year",
              duration: "2 Years",
            },
            {
              id: "DL-SYD-01-GD",
              degreeLevel: "Graduate Diploma",
              tutionFees: "AUD 40,000 / year",
              duration: "1 Year",
            },
          ],
          applyBtnParms: ["Australia", "Sydney", "University of Sydney", "Master of Commerce"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "Commerce"],
        },
        {
          id: "CRS-SYD-02",
          name: "Bachelor of Architecture",
          tutionFees: "AUD 48,000 / year",
          duration: "3 Years",
          description: "Design environments for the future.",
          degreeLevelInfo: [
            {
              id: "DL-SYD-02-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 48,000 / year",
              duration: "3 Years",
            },
          ],
          applyBtnParms: ["Australia", "Sydney", "University of Sydney", "Bachelor of Architecture"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "Architecture"],
        },
        {
          id: "CRS-SYD-03",
          name: "Veterinary Medicine",
          tutionFees: "AUD 62,000 / year",
          duration: "5 Years",
          description: "Comprehensive training in animal health.",
          degreeLevelInfo: [
            {
              id: "DL-SYD-03-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 62,000 / year",
              duration: "5 Years",
            },
            {
              id: "DL-SYD-03-D",
              degreeLevel: "Doctorate",
              tutionFees: "AUD 68,000 / year",
              duration: "4 Years",
            },
          ],
          applyBtnParms: ["Australia", "Sydney", "University of Sydney", "Veterinary Medicine"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "VetMed"],
        },
      ],
    },
    {
      id: "UNI-AU-MEL",
      name: "University of Melbourne",
      image: "https://i.ibb.co/PGXYXwTq/img.jpg",
      location: "Melbourne",
      description: "A public research university located in Melbourne, Australia.",
      courses: [
        {
          id: "CRS-MEL-01",
          name: "Biomedicine",
          tutionFees: "AUD 50,000 / year",
          duration: "3 Years",
          description: "Understand the human body and disease.",
          degreeLevelInfo: [
            {
              id: "DL-MEL-01-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 50,000 / year",
              duration: "3 Years",
            },
          ],
          applyBtnParms: ["Australia", "Melbourne", "University of Melbourne", "Biomedicine"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "Biomedicine"],
        },
        {
          id: "CRS-MEL-02",
          name: "Juris Doctor (Law)",
          tutionFees: "AUD 46,000 / year",
          duration: "3 Years",
          description: "Graduate law degree for aspiring lawyers.",
          degreeLevelInfo: [
            {
              id: "DL-MEL-02-JD",
              degreeLevel: "Juris Doctor",
              tutionFees: "AUD 46,000 / year",
              duration: "3 Years",
            },
          ],
          applyBtnParms: ["Australia", "Melbourne", "University of Melbourne", "Juris Doctor"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "Law"],
        },
        {
          id: "CRS-MEL-03",
          name: "Fine Arts",
          tutionFees: "AUD 38,000 / year",
          duration: "3 Years",
          description: "Visual art, acting, and music performance.",
          degreeLevelInfo: [
            {
              id: "DL-MEL-03-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 38,000 / year",
              duration: "3 Years",
            },
            {
              id: "DL-MEL-03-M",
              degreeLevel: "Master",
              tutionFees: "AUD 42,000 / year",
              duration: "2 Years",
            },
          ],
          applyBtnParms: ["Australia", "Melbourne", "University of Melbourne", "Fine Arts"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "Arts"],
        },
      ],
    },
    {
      id: "UNI-AU-QLD",
      name: "University of Queensland",
      image: "https://i.ibb.co/PGXYXwTq/img.jpg",
      location: "Brisbane",
      description: "One of Australia's leading research and teaching institutions.",
      courses: [
        {
          id: "CRS-QLD-01",
          name: "Marine Biology",
          tutionFees: "AUD 45,000 / year",
          duration: "3 Years",
          description: "Study of marine organisms and ecosystems nearby the Great Barrier Reef.",
          degreeLevelInfo: [
            {
              id: "DL-QLD-01-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 45,000 / year",
              duration: "3 Years",
            },
          ],
          applyBtnParms: ["Australia", "Brisbane", "University of Queensland", "Marine Biology"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "MarineBio"],
        },
        {
          id: "CRS-QLD-02",
          name: "Information Technology",
          tutionFees: "AUD 42,000 / year",
          duration: "3 Years",
          description: "Software engineering and systems design.",
          degreeLevelInfo: [
            {
              id: "DL-QLD-02-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 42,000 / year",
              duration: "3 Years",
            },
            {
              id: "DL-QLD-02-M",
              degreeLevel: "Master",
              tutionFees: "AUD 48,000 / year",
              duration: "2 Years",
            },
          ],
          applyBtnParms: ["Australia", "Brisbane", "University of Queensland", "Information Technology"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "IT"],
        },
        {
          id: "CRS-QLD-03",
          name: "Environmental Science",
          tutionFees: "AUD 44,000 / year",
          duration: "3 Years",
          description: "Solutions to environmental issues.",
          degreeLevelInfo: [
            {
              id: "DL-QLD-03-B",
              degreeLevel: "Bachelor",
              tutionFees: "AUD 44,000 / year",
              duration: "3 Years",
            },
          ],
          applyBtnParms: ["Australia", "Brisbane", "University of Queensland", "Environmental Science"],
          applyBtnParmsDegreeLevel: ["Degree", "Level", "EnvSci"],
        },
      ],
    },
  ],
};
