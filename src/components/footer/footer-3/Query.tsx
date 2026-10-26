/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import type { FooterThreeData, FooterThreeLink } from "./data";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function InstallButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);

  async function install() {
    if (!installEvent) {
      window.location.assign("/dashboard/install");
      return;
    }
    await installEvent.prompt();
    setInstallEvent(null);
  }

  return (
    <Button
      className="mt-4 h-12 w-full cursor-pointer rounded-sm border border-stone-200 bg-white px-6 text-base font-bold text-stone-900 shadow-lg shadow-stone-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#fffaf0]"
      onClick={() => void install()}
      size="sm"
      type="button"
    >
      <Icon name="Download" />
      Install
    </Button>
  );
}
const Links = ({ links }: { links: FooterThreeLink[] }) => (
  <div className="mt-4 grid gap-2 text-sm">
    {links
      .filter((link) => link.visible)
      .map((link) => (
        <a className="w-fit transition duration-700 hover:translate-x-1" href={link.url} key={link.id}>
          {link.label}
        </a>
      ))}
  </div>
);
export default function Query({ data }: { data: FooterThreeData }) {
  if (!data.isVisible) return null;
  return (
    <footer className="custom-parent-border" style={{ background: data.background, color: data.foreground }}>
      <div className="mx-auto grid max-w-7xl px-4 md:px-6 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr]">
        <div>
          {data.showLogo && data.logoUrl && (
            <div className="relative h-12 w-40 max-w-full overflow-hidden">
              <Image alt={data.logoAlt} className="object-contain object-left" fill sizes="160px" src={data.logoUrl} />
            </div>
          )}
          <h2 className="mt-6 text-xl font-bold">{data.brand}</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 opacity-80">{data.description}</p>
        </div>
        <div>
          <h2 className="font-bold">Destinations</h2>
          <Links links={data.destinations} />
        </div>
        <div>
          <h2 className="font-bold">Services</h2>
          <Links links={data.services} />
        </div>
        <div>
          <h2 className="font-bold">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <a href={`mailto:${data.email}`}>{data.email}</a>
            <a href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}>{data.phone}</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-sm border border-[#eadfce] bg-[#fffaf0] p-5 shadow-[0_18px_50px_-30px_rgba(87,83,78,.18)] sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-stone-200 bg-white text-stone-800 shadow-md shadow-stone-900/10">
              <Icon name="Download" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Take us with you</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-stone-600">
                Install our app for faster browsing, easy reorders, and quick access wherever you shop.
              </p>
            </div>
          </div>
          <div className="w-full shrink-0 sm:w-48">
            <InstallButton />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-[#fffaf0] py-3 text-xs text-stone-600">
        <div className="mx-auto flex px-4 md:px-6 max-w-7xl flex-wrap items-center justify-between gap-4">
          <span>{data.copyright}</span>
          <div className="flex flex-wrap gap-6">
            {data.legalLinks
              .filter((link) => link.visible)
              .map((link) => (
                <a className="hover:text-red-300" href={link.url} key={link.id}>
                  {link.label}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
