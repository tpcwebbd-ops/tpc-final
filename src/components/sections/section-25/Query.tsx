/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import React from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection25, Section25Data, Section25Payload, Section25Props } from "./data";

const sectionIconMap: { [key: string]: React.ElementType } = {
  FileText: iconMap.FileText,
  Target: iconMap.Target,
  BookOpen: iconMap.FileText,
  Star: iconMap.Star,
  Zap: iconMap.Zap,
  Shield: iconMap.ShieldCheck,
  Award: iconMap.Award,
};
const HelpCircle = iconMap.HelpCircle;

const QuerySection25 = ({ data }: Section25Props) => {
  let sectionData = defaultDataSection25;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section25Payload>;
        sectionData = { ...defaultDataSection25, ...parsed } as Section25Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection25, ...data };
      if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
      if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
    }
  }

  const cards = sectionData.cards?.length ? sectionData.cards : defaultDataSection25.cards;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto w-full max-w-7xl rounded-sm bg-white px-4 text-slate-900 custom-parent-border md:px-6"
    >
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, idx) => {
            const Icon = sectionIconMap[card.iconName] || HelpCircle;

            return (
              <div
                key={idx}
                className="bg-white rounded-sm p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/60 group relative overflow-hidden"
              >
                <div
                  className={`absolute right-0 top-0 h-32 w-32 rounded-sm bg-gradient-to-br ${card.gradient} opacity-[0.03] transition-opacity group-hover:opacity-[0.08]`}
                />

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-sm flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                  {card.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{card.description}</p>

                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${card.gradient} group-hover:w-full transition-all duration-500 ease-out`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuerySection25;
