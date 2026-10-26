/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";

import {
  defaultDataWhatsAppFaq,
  defaultLayout,
  type IWhatsAppFaqData,
  type WhatsAppFaqPayload,
  type WhatsAppFaqProps,
} from "./data";

const parseData = (data?: IWhatsAppFaqData | WhatsAppFaqPayload | string): WhatsAppFaqPayload => {
  try {
    const incoming = typeof data === "string" ? (JSON.parse(data) as Partial<WhatsAppFaqPayload>) : data;
    return {
      ...defaultDataWhatsAppFaq,
      ...defaultLayout,
      ...incoming,
      pageUid: "whatsapp-faq-uid",
      pageName: "WhatsApp FAQ",
      faqs: Array.isArray(incoming?.faqs) ? incoming.faqs : defaultDataWhatsAppFaq.faqs,
    };
  } catch {
    return { ...defaultDataWhatsAppFaq, ...defaultLayout };
  }
};
const whatsappLink = (number: string, message: string) =>
  `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;

const QueryWhatsAppFaq = ({ data }: WhatsAppFaqProps) => {
  const pageData = parseData(data);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  return (
    <main
      className="bg-white text-stone-800"
      style={{
        paddingInline: `${Math.min(300, Math.max(0, Number(pageData.paddingX) || 0))}px`,
        paddingBlock: `${Math.min(300, Math.max(0, Number(pageData.paddingY) || 0))}px`,
      }}
    >
      <section className="custom-parent-border">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="grid content-start gap-4 rounded-sm border border-[#eadfca] bg-amber-50/50 p-4">
            <span className="text-lime-700">{iconMap.MessageCircle}</span>
            <p className="text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase">{pageData.pageName}</p>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">{pageData.heading}</h1>
            <a
              className="inline-flex w-fit items-center gap-1 rounded-sm bg-lime-200 px-2.5 py-1.5 text-[0.8rem] font-medium text-lime-950 transition duration-700 hover:bg-lime-300"
              href={whatsappLink(pageData.whatsappNumber, pageData.heading)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {iconMap.MessageCircle} {pageData.whatsappLabel}
            </a>
          </div>
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-amber-700">{iconMap.HelpCircle}</span>
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase">FAQ</p>
                <h2 className="text-xl font-semibold text-stone-900">Frequently Asked Questions</h2>
              </div>
            </div>
            <div className="grid gap-2">
              {pageData.faqs.map((faq, index) => (
                <article
                  className="overflow-hidden rounded-sm border border-[#eadfca] bg-white px-3"
                  key={`${faq.question}-${index}`}
                >
                  <button
                    aria-controls={`faq-answer-${index}`}
                    aria-expanded={openFaq === `faq-${index}`}
                    className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-stone-900"
                    onClick={() => setOpenFaq((current) => (current === `faq-${index}` ? null : `faq-${index}`))}
                    type="button"
                  >
                    <span className="truncate" title={faq.question}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-4 shrink-0 text-amber-700 transition-transform duration-300 motion-reduce:transition-none ${openFaq === `faq-${index}` ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${openFaq === `faq-${index}` ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    id={`faq-answer-${index}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="pb-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default QueryWhatsAppFaq;
