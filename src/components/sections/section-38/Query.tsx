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
  defaultDataSection38,
  defaultLayout,
  type Section38Data,
  type Section38Payload,
  type Section38Props,
} from "./data";

const getSectionData = (data?: Section38Data | Section38Payload | string): Section38Payload => {
  if (!data) return { ...defaultDataSection38, ...defaultLayout };

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section38Payload>;
      return {
        ...defaultDataSection38,
        ...defaultLayout,
        ...parsed,
        showMissionEyebrow: parsed.showMissionEyebrow !== false,
        showVisionEyebrow: parsed.showVisionEyebrow !== false,
      };
    } catch {
      return { ...defaultDataSection38, ...defaultLayout };
    }
  }

  return {
    ...defaultDataSection38,
    ...defaultLayout,
    ...data,
    showMissionEyebrow: data.showMissionEyebrow !== false,
    showVisionEyebrow: data.showVisionEyebrow !== false,
  };
};

interface ImagePanelProps {
  src: string;
  className: string;
  delay: number;
  sizes: string;
  loading?: "eager" | "lazy";
  reduceMotion: boolean | null;
}

const ImagePanel = ({ src, className, delay, sizes, loading, reduceMotion }: ImagePanelProps) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 24 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
    className={`group relative isolate overflow-hidden bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.1)] ${className}`}
  >
    <Image
      src={src}
      alt="Study abroad collage"
      fill
      unoptimized
      sizes={sizes}
      loading={loading}
      className="object-cover transition duration-700 ease-out group-hover:scale-110"
    />
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </motion.div>
);

const QuerySection38 = ({ data }: Section38Props) => {
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
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl px-4"
        style={{ backgroundColor: sectionData.accentColor }}
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-11 px-4">
        <div className="flex flex-col">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -38 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {sectionData.showMissionEyebrow && sectionData.missionEyebrow && (
              <p className="text-base font-medium" style={{ color: sectionData.textColor }}>
                {sectionData.missionEyebrow}
              </p>
            )}
            <h2
              className="mt-4 text-[clamp(2.1rem,4vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.035em]"
              style={{ color: sectionData.headingColor }}
            >
              {sectionData.missionTitle}{" "}
              <span style={{ color: sectionData.accentColor }}>{sectionData.missionHighlightedTitle}</span>
            </h2>
            <p
              className="mt-7 max-w-2xl text-base leading-8 sm:text-lg sm:leading-9"
              style={{ color: sectionData.textColor }}
            >
              {sectionData.missionDescription}
            </p>
          </motion.div>

          <div className="mt-8 grid h-[420px] grid-cols-[0.96fr_1fr] grid-rows-2 gap-5 sm:h-[510px]">
            <ImagePanel
              src={sectionData.missionPrimaryImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.08}
              reduceMotion={reduceMotion}
              className="row-span-2 rounded-sm"
            />
            <ImagePanel
              src={sectionData.missionTopImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.16}
              reduceMotion={reduceMotion}
              className="rounded-sm"
            />
            <ImagePanel
              src={sectionData.missionBottomImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.24}
              reduceMotion={reduceMotion}
              className="rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid h-[420px] grid-cols-[0.96fr_1fr] grid-rows-2 gap-5 sm:h-[510px]">
            <ImagePanel
              src={sectionData.visionPrimaryImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              loading="eager"
              delay={0.12}
              reduceMotion={reduceMotion}
              className="row-span-2 rounded-sm"
            />
            <ImagePanel
              src={sectionData.visionTopImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.2}
              reduceMotion={reduceMotion}
              className="rounded-sm"
            />
            <ImagePanel
              src={sectionData.visionBottomImage}
              sizes="(max-width: 1024px) 48vw, 24vw"
              delay={0.28}
              reduceMotion={reduceMotion}
              className="rounded-sm"
            />
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 38 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {sectionData.showVisionEyebrow && sectionData.visionEyebrow && (
              <p className="text-base font-medium" style={{ color: sectionData.textColor }}>
                {sectionData.visionEyebrow}
              </p>
            )}
            <h2
              className="mt-4 text-[clamp(2.1rem,4vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.035em]"
              style={{ color: sectionData.headingColor }}
            >
              {sectionData.visionTitle}{" "}
              <span style={{ color: sectionData.accentColor }}>{sectionData.visionHighlightedTitle}</span>
            </h2>
            <p
              className="mt-7 max-w-2xl text-base leading-8 sm:text-lg sm:leading-9"
              style={{ color: sectionData.textColor }}
            >
              {sectionData.visionDescription}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuerySection38;
