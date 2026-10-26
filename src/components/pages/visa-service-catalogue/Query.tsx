/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

import {
  defaultDataVisaServiceCatalogue,
  defaultLayout,
  type IVisaServiceCatalogueData,
  type VisaServiceCataloguePayload,
  type VisaServiceCatalogueProps,
} from "./data";

const cloneData = (data: IVisaServiceCatalogueData): IVisaServiceCatalogueData =>
  JSON.parse(JSON.stringify(data)) as IVisaServiceCatalogueData;

const parseData = (
  data?: IVisaServiceCatalogueData | VisaServiceCataloguePayload | string,
): VisaServiceCataloguePayload => {
  try {
    const incoming = data
      ? typeof data === "string"
        ? (JSON.parse(data) as VisaServiceCataloguePayload)
        : data
      : cloneData(defaultDataVisaServiceCatalogue);

    return {
      ...defaultDataVisaServiceCatalogue,
      ...defaultLayout,
      ...incoming,
      pageUid: "visa-service-catalogue-uid",
      pageName: "Service Catalogue",
      services: defaultDataVisaServiceCatalogue.services.map((service, index) => ({
        ...service,
        ...(Array.isArray(incoming.services) ? incoming.services[index] : {}),
        id: service.id,
      })),
    };
  } catch {
    return { ...cloneData(defaultDataVisaServiceCatalogue), ...defaultLayout };
  }
};

const QueryVisaServiceCatalogue = ({ data }: VisaServiceCatalogueProps) => {
  const pageData = parseData(data);
  const reduceMotion = useReducedMotion();
  const theme = {
    "--visa-service-catalogue-bg": pageData.backgroundColor,
    "--visa-service-catalogue-heading": pageData.headingColor,
    "--visa-service-catalogue-text": pageData.textColor,
    "--visa-service-catalogue-accent": pageData.accentColor,
  } as CSSProperties;

  return (
    <main
      style={{
        ...theme,
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
      className="overflow-hidden bg-[var(--visa-service-catalogue-bg)] text-[var(--visa-service-catalogue-text)] custom-parent-border"
    >
      {pageData.services.slice(0, 4).map((service, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <section
            key={service.id}
            aria-labelledby={`${service.id}-title`}
            className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24 last:border-b-0"
          >
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: imageFirst ? -32 : 32 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-200 shadow-2xl ${
                  imageFirst ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-700 hover:scale-105"
                  priority={index === 0}
                />
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08 }}
                className={imageFirst ? "lg:order-2" : "lg:order-1"}
              >
                <span className="text-sm font-black text-[var(--visa-service-catalogue-accent)]">0{index + 1}</span>
                <h2
                  id={`${service.id}-title`}
                  className={`mt-4 text-[clamp(2.5rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.055em] ${"text-[var(--visa-service-catalogue-heading)]"}`}
                >
                  {service.title}
                </h2>
                <p className="mt-5 text-lg leading-8">{service.description}</p>
                <ul className="mt-7 flex flex-wrap gap-3">
                  {service.points.slice(0, 3).map((point) => (
                    <li
                      key={point}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[var(--visa-service-catalogue-accent)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default QueryVisaServiceCatalogue;
