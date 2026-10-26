/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import type { FooterOneData } from "./data";

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

export default function Query({ data }: { data: FooterOneData }) {
  if (!data.isVisible) return null;
  return (
    <footer className="custom-parent-border" style={{ background: data.background, color: data.foreground }}>
      <div className="mx-auto grid max-w-7xl gap-9 px-4 md:px-6 py-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:py-12">
        <div>
          {data.showLogo && data.logoUrl && (
            <div className="relative h-16 w-48">
              <Image
                alt={data.logoAlt}
                className="object-contain object-left"
                fill
                loading="eager"
                sizes="192px"
                src={data.logoUrl}
              />
            </div>
          )}
          <p className="mt-7 text-xl font-bold" style={{ color: data.accent }}>
            {data.brand}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 opacity-75">{data.description}</p>
        </div>
        {data.columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold" style={{ color: data.accent }}>
              {column.title}
            </h2>
            <div className="mt-4 grid gap-2">
              {column.links
                .filter((link) => link.visible)
                .map((link) => (
                  <a
                    className="w-fit text-sm opacity-75 transition duration-700 hover:translate-x-1 hover:opacity-100"
                    href={link.url}
                    key={link.id}
                  >
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        ))}
        {data.showContact && (
          <div className="grid content-start gap-3 text-sm opacity-75">
            <h2 className="font-semibold" style={{ color: data.accent }}>
              Contact
            </h2>
            <a className="w-fit transition duration-700 hover:opacity-100" href={`mailto:${data.email}`}>
              {data.email}
            </a>
            <a
              className="w-fit transition duration-700 hover:opacity-100"
              href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}
            >
              {data.phone}
            </a>
          </div>
        )}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 md:px-6 lg:pb-12">
        <div className="flex flex-col items-start justify-between gap-5 rounded-sm border border-[#eadfce] bg-[#fffaf0] p-5 shadow-[0_18px_50px_-30px_rgba(87,83,78,.18)] sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-stone-200 bg-white text-stone-800 shadow-md shadow-stone-900/10">
              <Icon name="Download" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: data.accent }}>
                Take us with you
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 opacity-75">
                Install our app for faster browsing, easy reorders, and quick access wherever you shop.
              </p>
            </div>
          </div>
          <div className="w-full shrink-0 sm:w-48">
            <InstallButton />
          </div>
        </div>
      </div>
      {data.showLegalBar && (
        <div
          className="py-3 border-t border-slate-200 text-xs text-stone-800"
          style={{ background: data.legalBackground }}
        >
          <div className="mx-auto flex px-4 md:px-6 max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <span>{data.copyright}</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.legalLinks
                .filter((link) => link.visible)
                .map((link) => (
                  <a className="transition duration-700 hover:text-amber-700" href={link.url} key={link.id}>
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
