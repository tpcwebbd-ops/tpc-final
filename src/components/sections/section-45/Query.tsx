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

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import {
  defaultDataSection45,
  defaultLayout,
  type Section45Data,
  type Section45Payload,
  type Section45Props,
} from "./data";

const Check = iconMap.Check;

const getSectionData = (data?: Section45Data | Section45Payload | string): Section45Payload => {
  if (!data) return { ...defaultDataSection45, ...defaultLayout };

  try {
    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section45Payload>;
    return {
      ...defaultDataSection45,
      ...defaultLayout,
      ...parsed,
      documents: Array.isArray(parsed.documents) ? parsed.documents : defaultDataSection45.documents,
    };
  } catch {
    return { ...defaultDataSection45, ...defaultLayout };
  }
};

const QuerySection45 = ({ data }: Section45Props) => {
  const sectionData = getSectionData(data);
  const paddingX = Math.min(300, Math.max(0, Number(sectionData.paddingX) || 0));
  const paddingY = Math.min(300, Math.max(0, Number(sectionData.paddingY) || 0));
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto w-full max-w-7xl overflow-hidden custom-parent-border px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-4"
      style={{
        backgroundColor: sectionData.backgroundColor,
        paddingInline: `${paddingX}px`,
        paddingBlock: `${paddingY}px`,
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-[clamp(2rem,2.5vw,2.15rem)] font-bold leading-[1.2] tracking-[-0.025em]"
          style={{ color: sectionData.headingColor }}
        >
          {sectionData.title}
        </motion.h2>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-11">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -38, scale: 0.98 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          >
            <Image
              src={sectionData.imageUrl}
              alt={sectionData.imageAlt}
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 51vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 38 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base leading-[1.7] sm:text-lg" style={{ color: sectionData.textColor }}>
              {sectionData.introduction}
            </p>
            <ul className="mt-6 space-y-4">
              {sectionData.documents.map((document, index) => (
                <motion.li
                  key={document.id || index}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.14 + index * 0.065 }}
                  className="grid grid-cols-[20px_1fr] gap-3"
                >
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.4}
                    className="mt-0.5 h-5 w-5"
                    style={{ color: sectionData.accentColor }}
                  />
                  <span className="text-base leading-[1.55] sm:text-lg" style={{ color: sectionData.textColor }}>
                    {document.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuerySection45;
