/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import { ChevronDown, Quote, Sparkles } from "lucide-react";
import React, { useMemo } from "react";

import { defaultDataSection9, Section9Data, Section9Props } from "./data";

const sparkles = [
  { initialTop: "18%", initialLeft: "24%", top: ["18%", "72%"], left: ["24%", "68%"], duration: 14, size: 28 },
  { initialTop: "64%", initialLeft: "76%", top: ["64%", "22%"], left: ["76%", "34%"], duration: 18, size: 36 },
  { initialTop: "42%", initialLeft: "48%", top: ["42%", "84%"], left: ["48%", "12%"], duration: 16, size: 24 },
];

const ClientSection9: React.FC<Section9Props> = ({ data }) => {
  const sectionData: Section9Data = useMemo(() => {
    if (!data) return defaultDataSection9;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section9Data>;
      return {
        ...defaultDataSection9,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection9;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  return (
    <section
      className="custom-parent-border relative h-[80vh] w-full max-w-7xl snap-center flex flex-col items-center justify-center bg-white overflow-hidden z-20"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-sm border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-indigo-500/10 backdrop-blur-sm"
          >
            <Quote className="w-8 h-8 text-indigo-400" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            {sectionData.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              {sectionData.subTitle}
            </span>
          </h1>

          <motion.div className="h-1.5 bg-indigo-200 rounded-full mb-8" />

          <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto mb-16 font-light leading-relaxed">
            {sectionData.description}
          </p>

          {sectionData.showEyebrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col items-center gap-3 text-zinc-500"
            >
              <span className="text-xs font-bold uppercase -mt-14 tracking-[0.2em] text-zinc-600">
                {sectionData.eyebrow}
              </span>
              <div className="w-12 h-12 rounded-full border mt-4 border-zinc-200 flex items-center justify-center bg-zinc-50 backdrop-blur-sm animate-bounce">
                <ChevronDown className="w-5 h-5 text-indigo-400" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              top: sparkle.initialTop,
              left: sparkle.initialLeft,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              top: sparkle.top,
              left: sparkle.left,
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles size={sparkle.size} className="text-indigo-500/20" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ClientSection9;
