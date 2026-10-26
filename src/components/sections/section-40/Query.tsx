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
  defaultDataSection40,
  defaultLayout,
  type Section40Data,
  type Section40Payload,
  type Section40Props,
} from "./data";

const MessageCircle = iconMap.MessageCircle;

const getSectionData = (data?: Section40Data | Section40Payload | string): Section40Payload => {
  if (!data) return { ...defaultDataSection40, ...defaultLayout };

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section40Payload>;
      return {
        ...defaultDataSection40,
        ...defaultLayout,
        ...parsed,
        paragraphs: parsed.paragraphs || defaultDataSection40.paragraphs,
        showEyebrow: parsed.showEyebrow !== false,
      };
    } catch {
      return { ...defaultDataSection40, ...defaultLayout };
    }
  }

  return {
    ...defaultDataSection40,
    ...defaultLayout,
    ...data,
    paragraphs: data.paragraphs || defaultDataSection40.paragraphs,
    showEyebrow: data.showEyebrow !== false,
  };
};

const QuerySection40 = ({ data }: Section40Props) => {
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
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-96 w-96 rounded-full opacity-[0.08] blur-3xl px-4"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { x: [0, -30, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl text-center px-4"
      >
        {sectionData.showEyebrow && sectionData.eyebrow && (
          <p className="text-base font-medium" style={{ color: sectionData.textColor }}>
            {sectionData.eyebrow}
          </p>
        )}
        <h2
          className="mt-4 text-[clamp(2rem,4.3vw,3.2rem)] font-bold leading-tight tracking-[-0.035em]"
          style={{ color: sectionData.headingColor }}
        >
          {sectionData.title} <span style={{ color: sectionData.accentColor }}>{sectionData.highlightedTitle}</span>
        </h2>
      </motion.header>

      <div className="mx-auto mt-16 grid w-full max-w-7xl items-center gap-14 lg:mt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 px-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -44 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="space-y-7 text-base leading-7 sm:text-lg sm:leading-8"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.16 + index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <motion.a
              href={sectionData.primaryButtonUrl}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex min-h-14 items-center justify-center rounded-sm px-8 text-base font-medium text-white shadow-[0_14px_34px_rgba(48,51,116,0.22)] transition-shadow hover:shadow-[0_18px_42px_rgba(48,51,116,0.3)]"
              style={{ backgroundColor: sectionData.buttonColor }}
            >
              {sectionData.primaryButtonText}
            </motion.a>
            <motion.a
              href={sectionData.secondaryButtonUrl}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-sm border bg-white px-8 text-base font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: sectionData.buttonColor, color: sectionData.buttonColor }}
            >
              <MessageCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
              {sectionData.secondaryButtonText}
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 44, scale: 0.95 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[390px] w-full max-w-[560px] sm:h-[470px] lg:mx-0"
        >
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: [0, 1.5, 0], y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[3%] top-[7%] h-[37%] w-[42%] rounded-sm border-2"
            style={{ borderColor: sectionData.accentColor }}
          />

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            className="group absolute left-[8%] top-[13%] z-10 h-[54%] w-[58%] overflow-hidden rounded-sm bg-amber-100 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
          >
            <Image
              src={sectionData.onlineAppointmentImage}
              alt="Online appointment"
              fill
              unoptimized
              sizes="(max-width: 1024px) 58vw, 27vw"
              className="object-contain p-4 transition duration-700 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 30, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.72, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
            className="group absolute bottom-[2%] right-0 h-[67%] w-[67%] overflow-hidden rounded-sm bg-blue-100 shadow-[0_28px_75px_rgba(15,23,42,0.14)]"
          >
            <Image
              src={sectionData.physicalAppointmentImage}
              alt="Physical appointment"
              fill
              unoptimized
              sizes="(max-width: 1024px) 67vw, 31vw"
              className="object-contain p-4 transition duration-700 group-hover:scale-105"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection40;
