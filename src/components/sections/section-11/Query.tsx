/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { Briefcase, Trophy, Zap, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import React, { useMemo, useRef } from "react";

import { defaultDataSection11, IExperienceItem, Section11Data, Section11Props } from "./data";

const ExperienceCard = ({ item, index }: { item: IExperienceItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 md:hidden">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
      </div>

      <div
        className={`flex flex-col md:flex-row gap-8 md:gap-32 items-start group ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
      >
        <div
          className={`hidden md:flex flex-col justify-center w-full md:w-5/12 ${index % 2 === 0 ? "items-end text-right" : "items-start text-left"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-sm font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Calendar size={14} />
            {item.year}
          </div>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200 justify-center">
          <motion.div
            aria-hidden="true"
            className={`absolute left-1/2 top-10 -translate-x-1/2 ${timelineArt[index % timelineArt.length].className}`}
            animate={{
              x: timelineArt[index % timelineArt.length].x,
              y: timelineArt[index % timelineArt.length].y,
              rotate: timelineArt[index % timelineArt.length].rotate,
              scale: [1, 1.25, 0.85, 1],
            }}
            transition={{
              duration: timelineArt[index % timelineArt.length].duration,
              delay: index * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="sticky top-1/2 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          />
        </div>

        <div className="w-full md:w-5/12 relative">
          <div className="md:hidden mb-4">
            <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              {item.year}
            </span>
          </div>

          <div className="group/card relative rounded-sm border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-[0_18px_45px_rgba(16,185,129,0.14)] md:p-8">
            <div className="pointer-events-none absolute -inset-px rounded-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 blur-lg transition-opacity duration-500 group-hover/card:opacity-100" />

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors">
                    {item.role}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
                    <Briefcase size={14} />
                    {item.companyName}
                  </div>
                </div>
                <div className="shrink-0 rounded-sm border border-slate-200 bg-slate-50 p-3 transition-colors group-hover/card:border-emerald-300">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      {item.highlightMilestone.label}
                    </div>
                    <div className="text-lg font-black text-emerald-700 leading-none">
                      {item.highlightMilestone.value}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.description}</p>

              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-start gap-3 rounded-sm border border-emerald-100 bg-emerald-50 p-3 transition-colors group-hover/card:bg-emerald-100/70">
                  <div className="mt-0.5 p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Trophy size={12} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                      Key Achievement
                    </span>
                    <p className="text-slate-700 text-sm font-medium">{item.lastAchievement}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 group-hover/card:border-emerald-200 transition-colors"
                    >
                      <Zap size={10} className="text-emerald-500/70" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ArrowUpRight className="absolute top-6 right-6 text-slate-300 w-6 h-6 group-hover/card:text-emerald-500 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ambientDecorations = [
  {
    className: "left-[8%] top-[18%] h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl",
    x: [0, 35, -20, 0],
    y: [0, -28, 24, 0],
    duration: 8,
  },
  {
    className: "right-[7%] top-[12%] h-16 w-16 rounded-full border-2 border-teal-300/40",
    x: [0, -28, 18, 0],
    y: [0, 24, -18, 0],
    duration: 11,
  },
  {
    className: "left-[18%] top-[45%] h-8 w-8 rotate-45 rounded-sm bg-cyan-300/30 blur-sm",
    x: [0, 24, -12, 0],
    y: [0, -36, 20, 0],
    duration: 7,
  },
  {
    className: "right-[14%] top-[54%] h-28 w-28 rounded-full bg-lime-300/15 blur-3xl",
    x: [0, -34, 22, 0],
    y: [0, 18, -26, 0],
    duration: 13,
  },
  {
    className: "left-[5%] bottom-[10%] h-5 w-5 rounded-full bg-amber-300/50 shadow-[0_0_24px_rgba(251,191,36,0.45)]",
    x: [0, 18, -24, 0],
    y: [0, -20, 30, 0],
    duration: 9,
  },
  {
    className: "right-[5%] bottom-[18%] h-12 w-12 rounded-full border border-sky-300/50",
    x: [0, -20, 30, 0],
    y: [0, 30, -16, 0],
    duration: 10,
  },
];

const timelineArt = [
  {
    className: "h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]",
    x: [0, 14, -10, 0],
    y: [0, 8, -6, 0],
    rotate: [0, 0, 0, 0],
    duration: 4.8,
  },
  {
    className: "h-4 w-4 rotate-45 rounded-sm border-2 border-cyan-400 bg-cyan-100/70",
    x: [0, -12, 10, 0],
    y: [0, -8, 10, 0],
    rotate: [45, 135, 225, 405],
    duration: 6.2,
  },
  {
    className: "h-5 w-5 rounded-full border-2 border-amber-400",
    x: [0, 10, -14, 0],
    y: [0, 10, 4, 0],
    rotate: [0, 90, 180, 360],
    duration: 7.4,
  },
  {
    className: "h-2 w-8 rounded-full bg-fuchsia-400 shadow-[0_0_16px_rgba(232,121,249,0.6)]",
    x: [0, -16, 12, 0],
    y: [0, 6, -10, 0],
    rotate: [0, -20, 20, 0],
    duration: 5.6,
  },
  {
    className: "h-4 w-4 rounded-full bg-violet-400/80 blur-[1px]",
    x: [0, 12, -8, 0],
    y: [0, -12, 8, 0],
    rotate: [0, 180, 360, 540],
    duration: 8.1,
  },
  {
    className: "h-3 w-3 border border-rose-400 bg-rose-100",
    x: [0, -10, 16, 0],
    y: [0, 8, -8, 0],
    rotate: [0, 45, -45, 0],
    duration: 6.8,
  },
];

const ClientSection11: React.FC<Section11Props> = ({ data }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const sectionData: Section11Data = useMemo(() => {
    if (!data) return defaultDataSection11;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section11Data>;
      return {
        ...defaultDataSection11,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
        showEyebrow: parsed.showEyebrow !== false,
        experiences: parsed.experiences || defaultDataSection11.experiences,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection11;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  return (
    <section
      ref={containerRef}
      className="custom-parent-border relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-white text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-teal-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
        {ambientDecorations.map((decoration, index) => (
          <motion.div
            key={index}
            className={`absolute ${decoration.className}`}
            animate={{
              x: decoration.x,
              y: decoration.y,
              rotate: [0, index % 2 ? -18 : 18, 0],
              scale: [1, 1.12, 0.94, 1],
            }}
            transition={{ duration: decoration.duration, delay: index * 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32 space-y-6">
          {sectionData.showEyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest"
            >
              <Briefcase size={12} />
              <span>{sectionData.eyebrow}</span>
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight"
          >
            {sectionData.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              {sectionData.subTitle}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            {sectionData.description}
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block">
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-emerald-500 via-teal-500 to-slate-300"
            />
          </div>

          <div className="space-y-12 md:space-y-24">
            {sectionData.experiences.map((item, index) => (
              <ExperienceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Open for new opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection11;
