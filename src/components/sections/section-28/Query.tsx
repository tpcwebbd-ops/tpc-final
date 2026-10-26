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

import { defaultDataSection28, Section28Data, Section28Payload, Section28Props } from "./data";

const sectionIconMap: { [key: string]: React.ElementType } = {
  Users: iconMap.Users,
  BookOpen: iconMap.FileText,
  Award: iconMap.Award,
  Star: iconMap.Star,
  Zap: iconMap.Zap,
  CheckCircle: iconMap.Check,
  Shield: iconMap.ShieldCheck,
};
const HelpCircle = iconMap.HelpCircle;

const QuerySection28 = ({ data }: Section28Props) => {
  let sectionData: Section28Data = defaultDataSection28;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section28Payload>;
        sectionData = { ...defaultDataSection28, ...parsed } as Section28Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection28, ...data } as Section28Data;
      paddingX = Math.max(0, Number((data as Partial<Section28Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section28Payload>).paddingY) || 0);
    }
  }

  const features = sectionData.features?.length ? sectionData.features : defaultDataSection28.features;

  return (
    <div
      className="mx-auto h-full w-full max-w-7xl custom-parent-border bg-white px-4 sm:px-6"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div>
        <div className="bg-white p-8 md:p-16 shadow-2xl border border-white/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-100/30 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-100/30 to-transparent rounded-tr-full pointer-events-none" />

          <div className="text-center mb-16 relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{sectionData.title}</h2>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">{sectionData.subtitle}</p>
            <div className="mt-6 mx-auto w-24 h-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
            {features.map((feature, idx) => {
              const Icon = sectionIconMap[feature.iconName] || HelpCircle;
              return (
                <div
                  key={idx}
                  className="text-center group relative p-4 rounded-sm hover:bg-slate-50 transition-colors duration-300"
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-sm flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-lg shadow-gray-200`}
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection28;
