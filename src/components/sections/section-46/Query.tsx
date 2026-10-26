/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  defaultDataSection46,
  defaultLayout,
  type Section46Data,
  type Section46Payload,
  type Section46Props,
} from "./data";

const getSectionData = (data?: Section46Data | Section46Payload | string): Section46Payload => {
  if (!data) return { ...defaultDataSection46, ...defaultLayout };

  try {
    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section46Payload>;
    return {
      ...defaultDataSection46,
      ...defaultLayout,
      ...parsed,
      showEyebrow: parsed.showEyebrow !== false,
      institutions: Array.isArray(parsed.institutions) ? parsed.institutions : defaultDataSection46.institutions,
    };
  } catch {
    return { ...defaultDataSection46, ...defaultLayout };
  }
};

const QuerySection46 = ({ data }: Section46Props) => {
  const sectionData = getSectionData(data);
  const paddingX = Math.min(300, Math.max(0, Number(sectionData.paddingX) || 0));
  const paddingY = Math.min(300, Math.max(0, Number(sectionData.paddingY) || 0));
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto w-full max-w-7xl overflow-hidden custom-parent-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-12"
      style={{
        backgroundColor: sectionData.backgroundColor,
        paddingInline: `${paddingX}px`,
        paddingBlock: `${paddingY}px`,
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {sectionData.showEyebrow !== false && (
            <p
              className="mb-3 text-sm font-bold uppercase tracking-[0.18em]"
              style={{ color: sectionData.accentColor }}
            >
              {sectionData.eyebrow}
            </p>
          )}
          <h2
            className="text-[clamp(2.2rem,3.2vw,2.7rem)] font-bold leading-[1.1] tracking-[-0.035em]"
            style={{ color: sectionData.headingColor }}
          >
            {sectionData.title}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg leading-[1.45] sm:text-xl"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.description}
          </p>
        </motion.div>

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {sectionData.institutions.map((institution, index) => (
            <motion.article
              key={institution.id || index}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.07 }}
              whileHover={reduceMotion ? undefined : { y: -7 }}
              className="group flex min-h-[326px] flex-col overflow-hidden rounded-sm border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
              style={{ backgroundColor: sectionData.cardColor }}
            >
              <div className="relative aspect-[1.68/1] w-full overflow-hidden bg-slate-200">
                <Image
                  src={institution.imageUrl}
                  alt={institution.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute right-3 top-3 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm"
                  style={{ backgroundColor: sectionData.badgeColor, color: sectionData.headingColor }}
                >
                  {institution.level}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-[1.25]" style={{ color: sectionData.headingColor }}>
                  {institution.name}
                </h3>
                <Link
                  href={institution.buttonUrl}
                  className="mt-auto pt-8 text-base font-bold outline-none transition-opacity hover:opacity-75 focus-visible:underline"
                  style={{ color: sectionData.accentColor }}
                >
                  {institution.buttonText}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection46;
