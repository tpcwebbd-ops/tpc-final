/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import type { FooterTwoData } from "./data";

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
      className="mt-5 h-12 w-full cursor-pointer rounded-sm border border-stone-200 bg-white px-6 text-base font-bold text-stone-900 shadow-lg shadow-stone-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#fffaf0]"
      onClick={() => void install()}
      size="sm"
      type="button"
    >
      <Icon name="Download" />
      Install
    </Button>
  );
}

function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  const title = typeof children === "string" ? children : undefined;
  return isInternal ? (
    <Link className={className} href={href} title={title}>
      {children}
    </Link>
  ) : (
    <a className={className} href={href} title={title}>
      {children}
    </a>
  );
}

export default function Query({ data }: { data: FooterTwoData }) {
  if (!data.isVisible) return null;
  return (
    <footer
      className="custom-parent-border border-t border-stone-200 bg-white text-stone-700"
      style={{ background: data.background, color: data.foreground }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="max-w-2xl">
            <div className="flex min-w-0 items-center gap-3">
              {data.showLogo && data.logoUrl && (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
                  <Image
                    alt={data.logoAlt || `${data.brand} logo`}
                    className="object-contain p-1"
                    fill
                    sizes="48px"
                    src={data.logoUrl}
                  />
                </div>
              )}
              <p className="truncate text-3xl font-black tracking-tight text-stone-950 sm:text-4xl" title={data.brand}>
                {data.brand}
              </p>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">{data.tagline}</h2>
            <p className="mt-2 text-base leading-7 text-stone-600">{data.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium">
              <a
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-orange-800"
                href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}
              >
                <span className="text-orange-700">
                  <Icon name="Phone" />
                </span>
                {data.phone}
              </a>
            </div>
          </div>
          <aside className="w-full max-w-sm rounded-sm border border-[#eadfce] bg-[#fffaf0] p-5 shadow-[0_20px_60px_-35px_rgba(87,83,78,.18)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-sm border border-stone-200 bg-white text-stone-800 shadow-md shadow-stone-900/10">
                <Icon name="Download" />
              </div>
              <h2 className="text-xl font-bold text-stone-950">Shop NexaMart anywhere</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Install the app for faster browsing, simple reorders, and quick access to your cart.
            </p>
            <InstallButton />
          </aside>
        </div>

        <div className="mt-10 grid gap-8 border-t border-stone-200 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-orange-800">{column.title}</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {column.links
                  .filter((link) => link.visible)
                  .map((link) => (
                    <FooterLink
                      className="w-fit truncate text-stone-600 transition duration-200 hover:translate-x-1 hover:text-orange-800"
                      href={link.url}
                      key={link.id}
                    >
                      {link.label}
                    </FooterLink>
                  ))}
              </div>
            </div>
          ))}
          <div>
            <h2 className="text-sm font-bold text-orange-800">Legal</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {data.legalLinks
                .filter((link) => link.visible)
                .map((link) => (
                  <FooterLink
                    className="w-fit truncate text-stone-600 transition duration-200 hover:translate-x-1 hover:text-orange-800"
                    href={link.url}
                    key={link.id}
                  >
                    {link.label}
                  </FooterLink>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-orange-800">Need help?</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <a
                className="w-fit truncate text-stone-600 transition duration-200 hover:text-orange-800"
                href={`mailto:${data.email}`}
                title={data.email}
              >
                {data.email}
              </a>
              <a
                className="w-fit text-stone-600 transition duration-200 hover:text-orange-800"
                href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}
              >
                {data.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      {data.showLegalBar && (
        <div className="border-t border-slate-200 bg-[#fffaf0] py-4 text-xs text-stone-600">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 md:px-6 sm:flex-row sm:items-center">
            <span>{data.copyright}</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.links
                .filter((link) => link.visible)
                .map((link) => (
                  <FooterLink
                    className="truncate transition duration-200 hover:text-orange-800"
                    href={link.url}
                    key={link.id}
                  >
                    {link.label}
                  </FooterLink>
                ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
