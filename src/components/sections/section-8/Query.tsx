/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import { defaultDataSection8, Section8Data, Section8Props } from "./data";

const ClientSection8: React.FC<Section8Props> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sectionData: Section8Data = useMemo(() => {
    if (!data) return defaultDataSection8;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section8Data>;
      return {
        ...defaultDataSection8,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return defaultDataSection8;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  return (
    <section
      className="custom-parent-border relative min-h-[520px] h-auto w-full max-w-7xl snap-center flex items-center justify-center bg-white overflow-hidden z-20"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 max-w-5xl"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-none mb-3 drop-shadow-2xl">
            {sectionData.title}
          </h2>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            {sectionData.subTitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            href={sectionData.buttonUrl || "#"}
            className="group mt-2 relative inline-block px-10 py-3.5 bg-amber-200 text-amber-950 rounded-full font-bold text-lg md:text-xl shadow-sm overflow-hidden transition-all duration-700 hover:bg-amber-300 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            <span className="relative flex items-center gap-3">
              {sectionData.buttonText}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection8;
