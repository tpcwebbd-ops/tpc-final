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
  defaultDataSection39,
  defaultLayout,
  type Section39Data,
  type Section39Payload,
  type Section39Props,
} from "./data";

const getSectionData = (data?: Section39Data | Section39Payload | string): Section39Payload => {
  if (!data) return { ...defaultDataSection39, ...defaultLayout };

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section39Payload>;
      return {
        ...defaultDataSection39,
        ...defaultLayout,
        ...parsed,
        paragraphs: parsed.paragraphs || defaultDataSection39.paragraphs,
      };
    } catch {
      return { ...defaultDataSection39, ...defaultLayout };
    }
  }

  return {
    ...defaultDataSection39,
    ...defaultLayout,
    ...data,
    paragraphs: data.paragraphs || defaultDataSection39.paragraphs,
  };
};

const QuerySection39 = ({ data }: Section39Props) => {
  const sectionData = getSectionData(data);
  const paddingX = Math.max(0, Number(sectionData.paddingX) || 0);
  const paddingY = Math.max(0, Number(sectionData.paddingY) || 0);
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate mx-auto w-full max-w-7xl overflow-hidden custom-parent-border px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      style={{
        backgroundColor: sectionData.backgroundColor,
        paddingInline: `${paddingX}px`,
        paddingBlock: `${paddingY}px`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { x: [0, 28, 0], y: [0, -22, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 px-2">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -46, scale: 0.96 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[430px] w-full max-w-[520px] sm:h-[560px] lg:mx-0"
        >
          <motion.div
            className="group absolute left-0 top-0 h-[82%] w-[71%] overflow-hidden rounded-sm bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={sectionData.primaryImage}
              alt="Study abroad guidance"
              fill
              unoptimized
              sizes="(max-width: 1024px) 68vw, 29vw"
              loading="eager"
              className="object-contain p-3 transition duration-700 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.88 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -7, scale: 1.02 }}
            className="group absolute right-0 top-[18%] h-[48%] w-[39%] overflow-hidden rounded-sm bg-indigo-50 shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
          >
            <Image
              src={sectionData.topImage}
              alt="Why choose us"
              fill
              unoptimized
              sizes="(max-width: 1024px) 38vw, 16vw"
              className="object-contain p-3 transition duration-700 group-hover:scale-110"
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.88 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -7, scale: 1.02 }}
            className="group absolute bottom-0 right-[1%] h-[34%] w-[47%] overflow-hidden rounded-sm bg-cyan-50 shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
          >
            <Image
              src={sectionData.bottomImage}
              alt="Reliable service"
              fill
              unoptimized
              sizes="(max-width: 1024px) 46vw, 19vw"
              className="object-contain p-3 transition duration-700 group-hover:scale-110"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 46 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-[clamp(2rem,4vw,3.15rem)] font-bold leading-[1.22] tracking-[-0.035em]"
            style={{ color: sectionData.headingColor }}
          >
            {sectionData.titlePrefix}{" "}
            <span style={{ color: sectionData.accentColor }}>{sectionData.highlightedTitle}</span>{" "}
            {sectionData.titleSuffix}
          </h2>

          <div
            className="mt-8 space-y-6 text-base leading-7 sm:text-lg sm:leading-8"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.58, delay: reduceMotion ? 0 : 0.24 + index * 0.12 }}
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

export default QuerySection39;
