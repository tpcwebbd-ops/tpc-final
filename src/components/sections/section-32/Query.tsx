/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection32, Section32Data, Section32Payload, Section32Props } from "./data";

const Quote = iconMap.Quote;

const ITEM_HEIGHT = 300;
const LOGICAL_WIDTH = 200;
const CENTER_X = 100;
const SWAY_AMPLITUDE = 40;

const QuerySection32 = ({ data }: Section32Props) => {
  let sectionData: Section32Data = defaultDataSection32;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section32Payload>;
        sectionData = { ...defaultDataSection32, ...parsed } as Section32Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection32, ...data } as Section32Data;
      paddingX = Math.max(0, Number((data as Partial<Section32Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section32Payload>).paddingY) || 0);
    }
  }

  const stories =
    sectionData.stories && sectionData.stories.length > 0 ? sectionData.stories : defaultDataSection32.stories;
  const totalHeight = stories.length * ITEM_HEIGHT + 200;

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  const generatePath = () => {
    let path = `M ${CENTER_X} 0 `;
    path += `L ${CENTER_X} 40 `;

    stories.forEach((_, index) => {
      const isEven = index % 2 === 0;
      const targetX = isEven ? CENTER_X - SWAY_AMPLITUDE : CENTER_X + SWAY_AMPLITUDE;
      const currentY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2 + 40;

      const prevY = index === 0 ? 40 : (index - 1) * ITEM_HEIGHT + ITEM_HEIGHT / 2 + 40;
      const prevX = index === 0 ? CENTER_X : isEven ? CENTER_X + SWAY_AMPLITUDE : CENTER_X - SWAY_AMPLITUDE;

      const cp1Y = prevY + (currentY - prevY) * 0.5;
      const cp2Y = currentY - (currentY - prevY) * 0.5;

      path += `C ${prevX} ${cp1Y}, ${targetX} ${cp2Y}, ${targetX} ${currentY} `;
    });

    const lastY = (stories.length - 1) * ITEM_HEIGHT + ITEM_HEIGHT / 2 + 40;
    const lastX = (stories.length - 1) % 2 === 0 ? CENTER_X - SWAY_AMPLITUDE : CENTER_X + SWAY_AMPLITUDE;

    path += `C ${lastX} ${lastY + 100}, ${CENTER_X} ${lastY + 100}, ${CENTER_X} ${totalHeight}`;

    return path;
  };

  const pathString = generatePath();

  return (
    <main
      className="relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden custom-parent-border bg-white text-slate-900"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-red-50/80 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">{sectionData.title}</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{sectionData.subtitle}</p>
        </motion.div>

        <div ref={containerRef} className="relative w-full">
          <div className="absolute left-0 top-0 w-full hidden md:block pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${LOGICAL_WIDTH} ${totalHeight}`}
              preserveAspectRatio="none"
              style={{ height: totalHeight }}
            >
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                  <stop offset="20%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="80%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={pathString}
                fill="none"
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <motion.path
                style={{ pathLength }}
                d={pathString}
                fill="none"
                stroke="url(#neonGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.5"
                filter="url(#glow)"
              />

              <motion.path
                style={{ pathLength }}
                d={pathString}
                fill="none"
                stroke="url(#neonGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-orange-200 via-red-300 to-orange-200 md:hidden" />

          <div className="relative pt-[40px]">
            {stories.map((story, index) => (
              <TimelineItem key={story.id || index} data={story} index={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const TimelineItem = ({ data, index }: { data: Section32Data["stories"][0]; index: number }) => {
  const isEven = index % 2 === 0;
  const dotPosition = isEven ? "30%" : "70%";

  return (
    <div className="relative w-full md:mb-0 mb-16 last:mb-0" style={{ height: "auto", minHeight: "300px" }}>
      <div className="hidden md:block absolute w-full top-0" style={{ height: ITEM_HEIGHT }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
          style={{ left: `calc(${dotPosition} - 6px)` }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            className="w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.45)] relative z-20"
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            whileInView={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-4 h-4 bg-red-400 rounded-full"
          />
        </div>

        {isEven ? (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 flex justify-end pr-12 w-[30%]" style={{ left: 0 }}>
              <ImageComponent src={data.image} alt={data.name} align="right" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 pl-12 ml-[120px] w-[70%]" style={{ left: "30%" }}>
              <TextComponent data={data} align="left" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 pr-12 w-[70%]" style={{ left: 0 }}>
              <TextComponent data={data} align="right" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 pl-12 w-[30%]" style={{ left: "70%" }}>
              <ImageComponent src={data.image} alt={data.name} align="left" />
            </div>
          </>
        )}
      </div>

      <div className="md:hidden flex flex-col pl-12 relative pb-12">
        <div className="absolute left-6 top-0 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-4 border-white shadow-[0_0_0_4px_rgba(239,68,68,0.15)]" />

        <div className="mb-4">
          <div className="relative w-full max-w-[200px] aspect-square rounded-sm overflow-hidden border border-slate-200 shadow-lg mb-4">
            <Image src={data.image} alt={data.name} fill loading="eager" className="object-cover" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{data.name}</h3>
          <span className="text-red-500 text-sm font-medium">{data.university}</span>
        </div>

        <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm leading-relaxed">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const ImageComponent = ({ src, alt, align }: { src: string; alt: string; align: "left" | "right" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: align === "left" ? 20 : -20, rotateY: align === "left" ? -15 : 15 }}
    whileInView={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    className="relative w-[200px] h-[200px] shrink-0 perspective-1000 group"
  >
    <div className="relative w-full h-full rounded-sm overflow-hidden shadow-xl border border-slate-200 bg-slate-100 group-hover:border-red-300 transition-all duration-500">
      <div className="absolute inset-0 bg-red-500/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
      <Image
        src={src}
        alt={alt}
        fill
        loading="eager"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
    <div className="absolute -inset-4 bg-red-500/15 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
);

const TextComponent = ({ data, align }: { data: Section32Data["stories"][0]; align: "left" | "right" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"} max-w-lg`}
  >
    <h3 className="text-4xl font-bold text-slate-900 mb-1 leading-tight">{data.name}</h3>

    <div className="flex items-center gap-2 mb-6">
      <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : "flex-row"}`}>
        <span className="text-xl text-red-500 font-serif italic">{data.subject}</span>
        <div className="h-px w-12 bg-slate-200" />
        <span className="inline-block py-1 px-3 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold tracking-widest uppercase mb-2">
          {data.university}
        </span>
      </div>
    </div>

    <div className="relative p-6 rounded-sm bg-slate-50 border border-slate-200 shadow-sm hover:bg-white hover:shadow-lg transition-all duration-300 group">
      <Quote
        className={`absolute top-4 ${align === "right" ? "right-4 rotate-0" : "left-4 rotate-180"} w-6 h-6 text-slate-200 group-hover:text-red-200 transition-colors`}
      />
      <p className="text-slate-600 text-lg leading-relaxed relative z-10">{data.description}</p>
    </div>
  </motion.div>
);

export default QuerySection32;
