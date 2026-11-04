/*
|-----------------------------------------
| setting up footer sharing for the App
|-----------------------------------------
*/

export const sharePlatforms = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "facebook", label: "Facebook" },
] as const;

export type SharePlatform = (typeof sharePlatforms)[number]["id"];
export type FooterShareSettings = {
  showShareButtons: boolean;
  shareMessage: string;
  sharePlatforms: SharePlatform[];
};

export const defaultShareSettings: FooterShareSettings = {
  showShareButtons: true,
  shareMessage: "Take a look at TestPrep Center!",
  sharePlatforms: sharePlatforms.map(({ id }) => id),
};

export function websiteShareData(siteUrl: string, title: string, message: string) {
  // Share the website home, including from an admin preview, without private query parameters.
  return { url: new URL("/", siteUrl).href, title, text: message.trim() };
}

export function socialShareHref(platform: SharePlatform, data: ReturnType<typeof websiteShareData>) {
  const url = encodeURIComponent(data.url);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent([data.text, data.url].filter(Boolean).join("\n\n"))}`;
    case "telegram":
      return `https://t.me/share/url?url=${url}&text=${encodeURIComponent(data.text)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }
}
