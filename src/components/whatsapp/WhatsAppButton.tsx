/*
|-----------------------------------------
| setting up WhatsAppButton.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/
import { FaWhatsapp } from "react-icons/fa";

import { client } from "@/app/api/lib/auth";

import WhatsAppButtonVisibility from "./WhatsAppButtonVisibility";

type Padding = "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type WhatsAppSettings = {
  key: "site";
  number?: string;
  padding?: Padding;
  paddingX?: Padding;
  paddingY?: Padding;
  marginX?: Padding;
  marginY?: Padding;
  position?: Position;
  defaultMessage?: string;
  isVisible?: boolean;
  desktopTextVisible?: boolean;
};
const spacing: Record<Padding, string> = {
  "0": "0",
  small: "0.25rem",
  medium: "0.5rem",
  large: "0.75rem",
  "extra-large": "1rem",
  xxl: "1.25rem",
  "3xl": "1.5rem",
  "4xl": "2rem",
  "5xl": "2.5rem",
};
const positions: Record<Position, string> = {
  "top-left": "left-4 top-4",
  "top-right": "right-4 top-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

export default async function WhatsAppButton() {
  const settings = await client.db().collection<WhatsAppSettings>("whatsappSettings").findOne({ key: "site" });
  const number = (settings?.number || "").replace(/\D/g, "");
  if (settings?.isVisible === false || !number) return null;
  const position = settings?.position ?? "bottom-right";
  const desktopTextVisible = settings?.desktopTextVisible ?? true;
  const message = settings?.defaultMessage?.trim();
  const href = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  const paddingX = settings?.paddingX ?? settings?.padding ?? "medium";
  const paddingY = settings?.paddingY ?? settings?.padding ?? "medium";
  return (
    <WhatsAppButtonVisibility>
      <a
        aria-label="Chat on WhatsApp"
        className={`fixed z-50 flex items-center gap-2 rounded-full bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-500/50 transition duration-700 hover:-translate-y-1 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${positions[position]} ${desktopTextVisible ? "" : "justify-center"}`}
        href={href}
        rel="noopener noreferrer"
        style={{
          paddingInline: spacing[paddingX],
          paddingBlock: spacing[paddingY],
          marginInline: spacing[settings?.marginX ?? "0"],
          marginBlock: spacing[settings?.marginY ?? "0"],
        }}
        target="_blank"
      >
        <FaWhatsapp size={24} />
        <span className={desktopTextVisible ? "hidden text-sm font-semibold md:inline" : "hidden"}>WhatsApp</span>
      </a>
    </WhatsAppButtonVisibility>
  );
}
