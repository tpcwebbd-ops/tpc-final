/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection13, Section13Data, Section13Props } from "./data";

// Keep section icons on the shared icon registry for consistent bundle and styling behavior.

const iconComponent = (icon: keyof typeof iconMap) => {
  const IconComponent = iconMap[icon];
  const Icon = (props: { className?: string; size?: number }) => <IconComponent {...props} />;
  Icon.displayName = `SectionIcon(${icon})`;
  return Icon;
};
const CalendarDays = iconComponent("Calendar");
const MapPin = iconComponent("MapPin");
const ArrowUpRight = iconComponent("ArrowUp");
const XCircle = iconComponent("X");

const ClientSection13: React.FC<Section13Props> = ({ data }) => {
  const [, setHoveredEvent] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const sectionData: Section13Data = useMemo(() => {
    if (!data) return defaultDataSection13;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section13Data>;
      return {
        ...defaultDataSection13,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
        showEyebrow: parsed.showEyebrow !== false,
        categories: parsed.categories || defaultDataSection13.categories,
        events: parsed.events || defaultDataSection13.events,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection13;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  const filterCategories = useMemo(() => {
    const predefined = sectionData.categories || [];
    return ["All", ...predefined];
  }, [sectionData.categories]);

  const filteredEvents = useMemo(() => {
    if (activeCategory === "All") return sectionData.events;
    return sectionData.events.filter((event) => event.category === activeCategory);
  }, [sectionData.events, activeCategory]);

  return (
    <section
      className="custom-parent-border relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-white text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-rose-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-6">
            {sectionData.showEyebrow && sectionData.badge && (
              <motion.p
                className="text-xs font-bold uppercase tracking-[0.24em] text-rose-700"
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
              className="text-4xl md:text-5xl lg:text-7xl font-black text-stone-900 tracking-tight"
            >
              {sectionData.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">
                {sectionData.subTitle}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-stone-600 leading-relaxed max-w-lg"
            >
              {sectionData.description}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-2"
        >
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                activeCategory === category
                  ? "text-white border-rose-500/50 shadow-lg shadow-rose-900/20"
                  : "text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900 bg-white"
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                layout
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col h-full bg-white border border-stone-200 rounded-sm overflow-hidden hover:border-rose-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-900/20"
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-300">
                      <CalendarDays size={48} />
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-800 shadow-sm backdrop-blur-md">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-6 md:p-8 pt-2 relative">
                  <div className="absolute -top-10 right-8 z-10 min-w-[70px] rounded-sm border border-stone-200 bg-white p-3 text-center shadow-xl transition-colors group-hover:border-rose-300">
                    <div className="mb-0.5 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-stone-500">
                      {event.date.includes(",") ? event.date.split(",")[0].split(" ")[0] : "DATE"}
                    </div>
                    <div className="text-xl font-black text-stone-900">
                      {event.date.match(/\d+/) ? event.date.match(/\d+/)?.[0] : "TBD"}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                      <MapPin size={12} className="text-rose-500" />
                      {event.location}
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 leading-tight group-hover:text-rose-500 transition-colors">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-8 flex-grow">{event.description}</p>

                  <div className="border-t border-stone-200 pt-6 transition-colors group-hover:border-rose-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900 group-hover:text-rose-500 transition-colors">
                        {event.actionText}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700 transition-all duration-300 group-hover:bg-rose-100">
                        <ArrowUpRight
                          size={18}
                          className="transform group-hover:rotate-45 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center rounded-sm border border-dashed border-stone-200 bg-stone-50 py-20 text-stone-500"
            >
              <XCircle size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No events found in this category.</p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-4 text-rose-400 hover:text-rose-300 text-sm font-bold underline underline-offset-4"
              >
                View all events
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection13;
