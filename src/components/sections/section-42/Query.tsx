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

import {
  defaultDataSection42,
  defaultLayout,
  type Section42Data,
  type Section42Payload,
  type Section42Props,
} from "./data";

const getSectionData = (data?: Section42Data | Section42Payload | string): Section42Payload => {
  if (!data) return { ...defaultDataSection42, ...defaultLayout };

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section42Payload>;
      return {
        ...defaultDataSection42,
        ...defaultLayout,
        ...parsed,
        paragraphs: parsed.paragraphs || defaultDataSection42.paragraphs,
      };
    } catch {
      return { ...defaultDataSection42, ...defaultLayout };
    }
  }

  return {
    ...defaultDataSection42,
    ...defaultLayout,
    ...data,
    paragraphs: data.paragraphs || defaultDataSection42.paragraphs,
  };
};

const QuerySection42 = ({ data }: Section42Props) => {
  const sectionData = getSectionData(data);
  const paddingX = Math.min(300, Math.max(0, Number(sectionData.paddingX) || 0));
  const paddingY = Math.min(300, Math.max(0, Number(sectionData.paddingY) || 0));
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto w-full max-w-7xl custom-parent-border px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-14"
      style={{
        backgroundColor: sectionData.backgroundColor,
        paddingInline: `${paddingX}px`,
        paddingBlock: `${paddingY}px`,
      }}
    >
      <div className="mx-auto px-4 grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -36 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
        >
          <Image
            src={sectionData.imageUrl}
            alt={sectionData.imageAlt}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 36 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-[clamp(1.8rem,3vw,2.15rem)] font-bold leading-[1.28] tracking-[-0.025em]"
            style={{ color: sectionData.headingColor }}
          >
            {sectionData.title}
          </h2>

          <div
            className="mt-6 space-y-6 text-base leading-8 sm:text-lg sm:leading-[1.7]"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.16 + index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection42;
