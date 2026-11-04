/*
|-----------------------------------------
| setting up FooterShare.tsx for the App
|-----------------------------------------
*/

"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

import { sharePlatforms, socialShareHref, websiteShareData, type FooterShareSettings } from "./share";

const platformIcons = { whatsapp: FaWhatsapp, telegram: FaTelegramPlane, facebook: FaFacebookF };
const iconButton =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export default function FooterShare({ settings }: { settings: FooterShareSettings & { brand: string } }) {
  const [feedback, setFeedback] = useState("");
  const [manualLink, setManualLink] = useState("");
  if (!settings.showShareButtons) return null;

  const getShareData = () => websiteShareData(window.location.origin, settings.brand, settings.shareMessage);

  async function copyLink() {
    const { url } = getShareData();
    setManualLink("");
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied. Paste it into a message.");
    } catch {
      setManualLink(url);
      setFeedback("Copy the link below and paste it into a message.");
    }
  }

  async function share() {
    setFeedback("");
    setManualLink("");
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share(getShareData());
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      await copyLink();
    }
  }

  return (
    <div className="mt-5" role="group" aria-label="Share this website">
      <p className="text-sm font-semibold">Share this website</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sharePlatforms
          .filter(({ id }) => settings.sharePlatforms.includes(id))
          .map(({ id, label }) => {
            const PlatformIcon = platformIcons[id];
            return (
              <button
                aria-label={`Share on ${label} (opens in a new tab)`}
                className={iconButton}
                key={id}
                onClick={() => window.open(socialShareHref(id, getShareData()), "_blank", "noopener,noreferrer")}
                title={`Share on ${label}`}
                type="button"
              >
                <PlatformIcon aria-hidden="true" size={18} />
              </button>
            );
          })}
        <button
          aria-label="Share using another app"
          className={iconButton}
          onClick={() => void share()}
          title="Share using another app"
          type="button"
        >
          <Share2 aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Copy website link"
          className={iconButton}
          onClick={() => void copyLink()}
          title="Copy website link"
          type="button"
        >
          <Copy aria-hidden="true" size={18} />
        </button>
      </div>
      <p className="mt-2 text-xs" role="status" aria-live="polite">
        {feedback}
      </p>
      {manualLink && (
        <input
          aria-label="Website link to copy"
          className="mt-2 h-9 w-full min-w-0 rounded-sm border border-stone-300 bg-white px-2 text-xs text-stone-800"
          onFocus={(event) => event.currentTarget.select()}
          readOnly
          value={manualLink}
        />
      )}
    </div>
  );
}
