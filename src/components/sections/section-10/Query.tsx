/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, useInView, useScroll } from "framer-motion";
import Image from "next/image";
import React, { useRef, useEffect, useState, useMemo } from "react";

import { defaultDataSection10, IStory, Section10Data, Section10Props } from "./data";

const SnakeLine = ({ count, viewportHeight }: { count: number; viewportHeight: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const totalHeight = count * viewportHeight;

  const generateReelPath = () => {
    const width = 200;
    const center = width / 2;
    const amplitude = 96;

    let d = `M ${center} 0`;

    for (let i = 0; i < count; i++) {
      const boxTop = i * viewportHeight;
      const boxCenter = boxTop + viewportHeight / 2;

      if (i === 0) {
        d += ` L ${center} ${boxCenter}`;
      } else {
        const prevBoxCenter = (i - 1) * viewportHeight + viewportHeight / 2;
        const direction = i % 2 === 0 ? 1 : -1;
        const controlX = center + amplitude * direction;

        d += ` C ${controlX} ${prevBoxCenter + viewportHeight * 0.28},
                  ${controlX} ${boxCenter - viewportHeight * 0.28},
                  ${center} ${boxCenter}`;
      }
    }
    d += ` L ${center} ${totalHeight}`;
    return d;
  };

  const pathString = generateReelPath();

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-0 -translate-x-1/2 w-[200px] h-full hidden md:block z-0 pointer-events-none"
    >
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 200 ${totalHeight}`} preserveAspectRatio="none">
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

        <path d={pathString} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" strokeLinecap="round" />

        <motion.path
          style={{ pathLength: scrollYProgress }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.5"
          filter="url(#glow)"
        />

        <motion.path
          style={{ pathLength: scrollYProgress }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const ReelStory = ({ item, index }: { item: IStory; index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <section
      ref={ref}
      className="h-[78vh] min-h-[560px] w-full snap-center snap-always flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          animate={isInView ? { scale: [1, 1.5, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20 relative" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-indigo-400 animate-ping opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-indigo-500/20 blur-xl" />
        </motion.div>
      </div>

      <div
        className={`w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-between h-full py-20 md:py-0`}
      >
        <div
          className={`w-full md:w-[45%] h-[40vh] md:h-full flex items-center justify-center ${isEven ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16"}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: isEven ? -50 : 50, rotateY: isEven ? 20 : -20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative w-64 md:w-72 aspect-[3/4] group"
          >
            <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-indigo-500/35 to-fuchsia-500/25 blur-lg opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
            <div className="relative h-full w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-100 shadow-[0_20px_45px_rgba(71,85,105,0.22)]">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-600">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
                <p className="text-slate-900 font-bold text-lg">{item.name}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className={`w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left ${isEven ? "md:pl-16" : "md:pr-16 md:items-end md:text-right"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            {item.showEyebrow !== false && (
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                {item.university}
              </span>
            )}
            <h2 className="hidden md:block text-4xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight drop-shadow-sm">
              {item.name}
            </h2>
            <h3 className="text-xl text-fuchsia-700 font-serif italic mb-6">{item.subject}</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">{item.description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ClientSection10: React.FC<Section10Props> = ({ data }) => {
  const [vpHeight, setVpHeight] = useState(0);

  const sectionData: Section10Data = useMemo(() => {
    if (!data) return defaultDataSection10;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section10Data>;
      return {
        ...defaultDataSection10,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
        stories: parsed.stories || defaultDataSection10.stories,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection10;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // The viewport listener is the external browser subscription for this responsive reel.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVpHeight(window.innerHeight);
      const handleResize = () => setVpHeight(window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <section
      className="custom-parent-border relative overflow-hidden bg-white text-slate-800 selection:bg-fuchsia-500/30"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[120px]" />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          {vpHeight > 0 && <SnakeLine count={sectionData.stories.length} viewportHeight={vpHeight * 0.78} />}

          {sectionData.stories.map((story, index) => (
            <ReelStory key={story.id} item={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSection10;
