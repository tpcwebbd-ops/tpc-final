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

import { defaultDataSection26, Section26Data, Section26Payload, Section26Props } from "./data";

const sectionIconMap: { [key: string]: React.ElementType } = {
  Users: iconMap.Users,
  CheckCircle: iconMap.Check,
  Award: iconMap.Award,
  TrendingUp: iconMap.TrendingUp,
  Star: iconMap.Star,
  Globe: iconMap.Globe,
  Zap: iconMap.Zap,
};
const HelpCircle = iconMap.HelpCircle;

const QuerySection26 = ({ data }: Section26Props) => {
  let sectionData = defaultDataSection26;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section26Payload>;
        sectionData = { ...defaultDataSection26, ...parsed } as Section26Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection26, ...data };
      if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
      if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
    }
  }

  const stats = sectionData.stats?.length ? sectionData.stats : defaultDataSection26.stats;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto w-full max-w-7xl rounded-sm bg-white px-4 custom-parent-border md:px-6"
    >
      <div>
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-white/15 transition-all duration-700" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl group-hover:bg-white/15 transition-all duration-700" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 tracking-tight">
              {sectionData.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
              {stats.map((stat, idx) => {
                const Icon = sectionIconMap[stat.iconName] || HelpCircle;
                return (
                  <div key={idx} className="flex flex-col items-center group/item">
                    <div className="mb-4 text-red-100 bg-white/10 p-4 rounded-sm backdrop-blur-sm group-hover/item:scale-110 group-hover/item:bg-white group-hover/item:text-orange-500 transition-all duration-300 shadow-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                      {stat.value}
                    </div>
                    <div className="text-red-100/90 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <button className="bg-white hover:bg-slate-50 text-red-600 px-10 py-4 rounded-sm font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95">
                {sectionData.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection26;
