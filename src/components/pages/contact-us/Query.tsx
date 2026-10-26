/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

import { defaultData } from "./data";

export default function Query({ data = defaultData }: { data?: Record<string, string> }) {
  const value = (key: keyof typeof defaultData) => data[key] || defaultData[key];
  const phone = value("phone");
  const normalizedWhatsApp = phone.replace(/\D/g, "").replace(/^0/, "880");

  return (
    <section className="custom-parent-border overflow-hidden bg-white">
      <div className="border-b border-amber-200 bg-amber-50 p-7 text-stone-900 sm:p-10">
        {value("showEyebrow") !== "false" && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Contact TestPrep Center</p>
        )}
        <h1 className="mt-2 text-3xl font-semibold">{value("title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-600">{value("intro")}</p>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="grid gap-4 p-6">
          <article>
            <b>{value("phoneLabel")}</b>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-600">
              <a
                className="underline decoration-amber-300 underline-offset-4 hover:text-amber-800"
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              >
                {phone}
              </a>
              <a
                className="underline decoration-amber-300 underline-offset-4 hover:text-amber-800"
                href={`https://wa.me/${normalizedWhatsApp}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            </div>
          </article>
          <article>
            <b>{value("facebookLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">
              <a
                className="break-all underline decoration-amber-300 underline-offset-4 hover:text-amber-800"
                href={value("facebookUrl")}
                rel="noopener noreferrer"
                target="_blank"
              >
                {value("facebookUrl")}
              </a>
            </p>
          </article>
          <article>
            <b>{value("facebookGroupLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">
              <a
                className="break-all underline decoration-amber-300 underline-offset-4 hover:text-amber-800"
                href={value("facebookGroupUrl")}
                rel="noopener noreferrer"
                target="_blank"
              >
                {value("facebookGroupUrl")}
              </a>
            </p>
          </article>
          <article>
            <b>{value("addressLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("address")}</p>
          </article>
          <article>
            <b>{value("locationLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("location")}</p>
          </article>
        </div>
        <div className="border-t border-[#eadfca] p-6 md:border-l md:border-t-0">
          <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Online support</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">Connect from anywhere in Bangladesh</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              TestPrep Center provides IELTS, study-abroad, and kids&apos; spoken English services online. Call or send
              a WhatsApp message to get started.
            </p>
            <a
              className="mt-5 inline-flex rounded-sm bg-lime-200 px-3 py-2 text-sm font-semibold text-lime-950 transition duration-700 hover:bg-lime-300"
              href={`https://wa.me/${normalizedWhatsApp}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
