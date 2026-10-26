/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import { Handshake, ArrowRight, Zap, BoxSelect, Sparkles, LayoutTemplate } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";

import { defaultDataSection12, Section12Data, Section12Props } from "./data";

const ClientSection12: React.FC<Section12Props> = ({ data }) => {
  const sectionData: Section12Data = useMemo(() => {
    if (!data) return defaultDataSection12;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section12Data>;
      return {
        ...defaultDataSection12,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
        showEyebrow: parsed.showEyebrow !== false,
        partners: parsed.partners || defaultDataSection12.partners,
        collabOptions: parsed.collabOptions || defaultDataSection12.collabOptions,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection12;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  const marqueePartners = useMemo(() => {
    const base = sectionData.partners || [];
    if (base.length === 0) return [];
    return [...base, ...base, ...base, ...base, ...base, ...base];
  }, [sectionData.partners]);

  const getIconForIndex = (index: number) => {
    const icons = [Sparkles, BoxSelect, Zap, LayoutTemplate, Handshake];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={24} />;
  };

  const getIconColorForIndex = (index: number) => {
    const colors = ["text-cyan-400", "text-blue-400", "text-indigo-400", "text-purple-400", "text-teal-400"];
    return colors[index % colors.length];
  };

  return (
    <section
      className="custom-parent-border relative mx-auto w-full max-w-7xl overflow-hidden bg-white text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          {sectionData.showEyebrow && sectionData.badge && (
            <motion.p
              className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-cyan-700"
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {sectionData.badge}
            </motion.p>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6"
          >
            {sectionData.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {sectionData.subTitle}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            {sectionData.description}
          </motion.p>
        </div>

        {marqueePartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-full overflow-hidden mb-24 group border-y border-slate-200 bg-slate-50/80 backdrop-blur-sm py-8"
          >
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-50 to-transparent z-10" />

            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-16 md:gap-32 items-center pr-16 md:pr-32"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 60,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{ width: "fit-content" }}
              >
                {marqueePartners.map((partner, idx) => (
                  <div
                    key={`${partner.id}-${idx}`}
                    className="relative h-10 w-28 md:h-14 md:w-40 shrink-0 opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer"
                  >
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border border-slate-200 rounded bg-white shadow-sm">
                        <span className="text-sm font-bold text-slate-500">{partner.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sectionData.collabOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative flex flex-col rounded-sm border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-cyan-300 hover:bg-cyan-50/30 hover:shadow-[0_18px_45px_rgba(6,182,212,0.14)]"
            >
              <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-cyan-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-300 ${getIconColorForIndex(index)}`}
                >
                  {getIconForIndex(index)}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors">
                  {option.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{option.description}</p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-cyan-700 transition-colors cursor-pointer mt-auto">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSection12;
