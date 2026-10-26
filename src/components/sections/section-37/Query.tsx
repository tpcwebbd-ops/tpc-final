/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| Study Abroad experience hero renderer for Section 37
|-----------------------------------------
*/

"use client";

import { motion, useReducedMotion } from "framer-motion";
import localFont from "next/font/local";
import Link from "next/link";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import {
  defaultDataSection37,
  defaultLayout,
  type Section37Data,
  type Section37Payload,
  type Section37Props,
} from "./data";

const ArrowRight = iconMap.ArrowRight;
const Sparkles = iconMap.Sparkles;

const liAlinurBanglaborno = localFont({
  src: "./Li Alinur Banglaborno ANSI V2 Italic.ttf",
  display: "swap",
});

const renderBanglaText = (text: string) =>
  text.split(/([A-Za-z0-9]+(?:[+./&'-][A-Za-z0-9]+)*)/g).map((part, index) =>
    /[A-Za-z0-9]/.test(part) ? (
      <span key={`${part}-${index}`} className="font-sans">
        {part}
      </span>
    ) : (
      part
    ),
  );

const getSectionData = (data?: Section37Data | Section37Payload | string): Section37Payload => {
  if (!data) return { ...defaultDataSection37, ...defaultLayout };

  if (typeof data === "string") {
    try {
      return { ...defaultDataSection37, ...defaultLayout, ...(JSON.parse(data) as Partial<Section37Payload>) };
    } catch {
      return { ...defaultDataSection37, ...defaultLayout };
    }
  }

  return { ...defaultDataSection37, ...defaultLayout, ...data };
};

const getExperienceParts = (value: string) => {
  const [first = "", ...rest] = value.trim().split(/\s+/);
  const startsWithNumber = /^\d+\+?$/.test(first);

  return startsWithNumber ? { number: first, label: rest.join(" ") } : { number: "", label: value };
};

const QuerySection37 = ({ data }: Section37Props) => {
  const sectionData = getSectionData(data);
  const paddingX = Math.max(0, Number(sectionData.paddingX) || 0);
  const paddingY = Math.max(0, Number(sectionData.paddingY) || 0);
  const reduceMotion = useReducedMotion();
  const experience = getExperienceParts(sectionData.descriptionAccent);
  const gridBackground = {
    backgroundColor: sectionData.backgroundColor,
    backgroundImage: `linear-gradient(${sectionData.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${sectionData.gridColor} 1px, transparent 1px)`,
    backgroundSize: "48px 48px",
  };

  return (
    <section
      className="relative isolate mx-auto w-full max-w-7xl overflow-hidden custom-parent-border px-4 py-14 sm:px-6 sm:py-16 lg:py-20"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px`, ...gridBackground }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_50%,rgba(255,255,255,0.18),rgba(250,250,249,0.92)_48%,rgba(250,250,249,0.72))]" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: sectionData.accentColor }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.78, rotate: -8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex aspect-square w-full max-w-[330px] items-center justify-center"
        >
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed opacity-35"
            style={{ borderColor: sectionData.accentColor }}
          >
            <span
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: sectionData.accentColor }}
            />
            <span
              className="absolute bottom-[12%] right-[7%] h-2 w-2 rounded-full"
              style={{ backgroundColor: sectionData.headingColor }}
            />
          </motion.div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-[76%] w-[76%] flex-col items-center justify-center rounded-full border border-white/80 bg-white/80 p-6 text-center shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          >
            <Sparkles className="mb-1 h-5 w-5" style={{ color: sectionData.accentColor }} aria-hidden="true" />
            {experience.number ? (
              <span
                className="font-sans text-[clamp(5rem,12vw,7.5rem)] font-black leading-[0.8] tracking-[-0.09em]"
                style={{ color: sectionData.accentColor }}
              >
                {experience.number}
              </span>
            ) : null}
            <span
              className="mt-4 line-clamp-2 max-w-[150px] font-sans text-xs font-black uppercase tracking-[0.24em]"
              style={{ color: sectionData.headingColor }}
            >
              {experience.label}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 46 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className={`${liAlinurBanglaborno.className} text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-none`}
            style={{ color: sectionData.headingColor }}
          >
            {renderBanglaText(sectionData.titleLineOne)}
          </motion.p>

          <h1
            className="mt-4 font-sans font-black uppercase leading-[0.88] tracking-[-0.065em]"
            style={{ color: sectionData.headingColor }}
          >
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(7px)" }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="block text-[clamp(3rem,7vw,6.25rem)]"
            >
              {sectionData.titleEnglish}
            </motion.span>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.48 }}
              className="mt-2 block text-[clamp(2rem,4.6vw,4.1rem)] tracking-[-0.055em]"
            >
              {sectionData.titleEnglishSuffix}{" "}
              <span className="relative inline-block" style={{ color: sectionData.accentColor }}>
                {sectionData.titleHighlight}
                <motion.span
                  aria-hidden="true"
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full"
                  style={{ backgroundColor: sectionData.accentColor }}
                />
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className={`${liAlinurBanglaborno.className} mx-auto mt-8 line-clamp-2 max-w-xl text-[clamp(1rem,1.5vw,1.3rem)] font-semibold leading-relaxed lg:mx-0`}
            style={{ color: sectionData.descriptionColor }}
          >
            <strong style={{ color: sectionData.headingColor }}>{renderBanglaText(sectionData.descriptionLead)}</strong>{" "}
            {renderBanglaText(sectionData.descriptionTail)}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href={sectionData.primaryButtonLink || "#"}
                className="group relative inline-flex min-h-13 items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-sans text-sm font-black text-white shadow-[0_18px_35px_-16px_rgba(207,10,44,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                style={{ backgroundColor: sectionData.accentColor }}
              >
                <motion.span
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { x: ["-180%", "320%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-10 -skew-x-12 bg-white/25 blur-sm"
                />
                <span className="relative">{sectionData.primaryButtonText}</span>
                <ArrowRight
                  className="relative h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>

            <motion.div
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href={sectionData.secondaryButtonLink || "#"}
                className="inline-flex min-h-13 items-center justify-center rounded-full border px-7 py-3.5 font-sans text-sm font-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                style={{ borderColor: sectionData.gridColor, color: sectionData.headingColor }}
              >
                {sectionData.secondaryButtonText}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuerySection37;
