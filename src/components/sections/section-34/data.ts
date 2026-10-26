/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export interface VideoReview {
  id: number;
  label: string;
  sub: string;
  backgroundColor: string;
  link: string;
}

export interface ISection34Data {
  id: string;
  pageUid: string;
  pageName: string;
  badgeText: string;
  title: string;
  subtitle: string;
  videos: VideoReview[];
}

export interface Section34Payload extends ISection34Data {
  paddingX: number;
  paddingY: number;
}

export type Section34Data = ISection34Data;

export interface Section34Props {
  data?: ISection34Data | Section34Payload | string;
}

export const defaultDataSection34: ISection34Data = {
  id: "section-uid-34",
  pageUid: "section-uid-34",
  pageName: "Section 34",
  badgeText: "Trusted Video Reviews",
  title: "What Creators Say",
  subtitle: "Creators দের Borbila নিয়ে published YouTube videos এক জায়গায় দেখুন।",
  videos: [
    {
      id: 1,
      label: "Borbila Template Review",
      sub: "Creator review and practical walkthrough.",
      backgroundColor: "#0f172a",
      link: "https://www.youtube.com/watch?v=_hWK7TVM2ro",
    },
    {
      id: 2,
      label: "Borbila Website Tutorial",
      sub: "Step-by-step setup and usage experience.",
      backgroundColor: "#172554",
      link: "https://www.youtube.com/watch?v=_hWK7TVM2ro",
    },
    {
      id: 3,
      label: "Borbila Setup Guide",
      sub: "Template import and customization guide.",
      backgroundColor: "#1c1917",
      link: "https://www.youtube.com/watch?v=_hWK7TVM2ro",
    },
  ],
};

export const defaultData = defaultDataSection34;

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

/** Accepts YouTube watch, short, embed and shorts URLs and returns a safe embed URL. */
export const getYouTubeEmbedUrl = (url: string) => {
  const value = url.trim();
  if (!value) return null;

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    let videoId = "";

    if (host === "youtu.be") videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname === "/watch") videoId = parsed.searchParams.get("v") || "";
      else if (/^\/(embed|shorts|live)\//.test(parsed.pathname)) videoId = parsed.pathname.split("/")[2] || "";
    }

    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : null;
  } catch {
    return null;
  }
};
