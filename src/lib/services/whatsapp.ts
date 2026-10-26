/*
|-----------------------------------------
| setting up whatsapp service for the App
|-----------------------------------------
*/

import "server-only";

import { revalidatePath } from "next/cache";

import { findWhatsAppSettings, saveWhatsAppSettings, type WhatsAppSettings } from "@/lib/models/site-settings";

const defaults = {
  number: "",
  paddingX: "medium",
  paddingY: "medium",
  marginX: "0",
  marginY: "0",
  position: "bottom-right",
  defaultMessage: "",
  isVisible: true,
  desktopTextVisible: true,
} as const;

function serializeWhatsAppSettings(settings: Partial<WhatsAppSettings>) {
  return {
    number: settings.number ?? defaults.number,
    paddingX: settings.paddingX ?? settings.padding ?? defaults.paddingX,
    paddingY: settings.paddingY ?? settings.padding ?? defaults.paddingY,
    marginX: settings.marginX ?? defaults.marginX,
    marginY: settings.marginY ?? defaults.marginY,
    position: settings.position ?? defaults.position,
    defaultMessage: settings.defaultMessage ?? defaults.defaultMessage,
    isVisible: settings.isVisible ?? defaults.isVisible,
    desktopTextVisible: settings.desktopTextVisible ?? defaults.desktopTextVisible,
  };
}

export async function getWhatsAppSettings() {
  return serializeWhatsAppSettings((await findWhatsAppSettings()) ?? {});
}

export async function updateWhatsAppSettings(settings: WhatsAppSettings) {
  await saveWhatsAppSettings(settings);
  revalidatePath("/", "layout");
  return serializeWhatsAppSettings(settings);
}
