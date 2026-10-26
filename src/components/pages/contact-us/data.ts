/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

export const defaultData = {
  showEyebrow: "true",
  title: "Let’s talk",
  intro:
    "Share your question, project idea, or support request and our team will get back to you with a practical next step.",
  emailLabel: "Email",
  email: "example@gmail.com",
  addressLabel: "Address",
  address: "21/B Bijoyshoroni, Tecgaon, Dhaka-1200.",
  locationLabel: "Location",
  location: "Dhaka, Bangladesh",
  mapUrl: "https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed",
  open247: "false",
  openingDays: JSON.stringify([
    { day: "Monday", openTime: "09:00", closeTime: "18:00" },
    { day: "Tuesday", openTime: "09:00", closeTime: "18:00" },
    { day: "Wednesday", openTime: "09:00", closeTime: "18:00" },
    { day: "Thursday", openTime: "09:00", closeTime: "18:00" },
    { day: "Friday", openTime: "09:00", closeTime: "18:00" },
    { day: "Saturday", openTime: "10:00", closeTime: "16:00" },
    { day: "Sunday", openTime: "", closeTime: "" },
  ]),
};
