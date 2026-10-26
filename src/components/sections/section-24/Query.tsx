/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import React from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection24, ISection24Data, Section24Payload, Section24Props } from "./data";

const sectionIconMap: { [key: string]: React.ElementType } = {
  FileText: iconMap.FileText,
  Clock: iconMap.Clock,
  Target: iconMap.Target,
  CheckCircle: iconMap.Check,
  Zap: iconMap.Zap,
};
const PlayCircle = iconMap.Play;
const ArrowRight = iconMap.ArrowRight;

const QuerySection24 = ({ data }: Section24Props) => {
  let sectionData = defaultDataSection24;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section24Payload>;
        sectionData = { ...defaultDataSection24, ...parsed } as ISection24Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection24, ...data };
      if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
      if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
    }
  }

  const features = sectionData.features?.length ? sectionData.features : defaultDataSection24.features;
  const stats = sectionData.stats?.length ? sectionData.stats : defaultDataSection24.stats;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto w-full max-w-7xl rounded-sm bg-white px-4 custom-parent-border sm:px-6"
    >
      <div>
        <div className="bg-white rounded-sm shadow-2xl p-8 md:p-12 lg:p-16 border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 items-center relative z-10">
            <div className="space-y-8 order-2 lg:order-1">
              {features.map((feature, idx) => {
                const Icon = sectionIconMap[feature.iconName] || sectionIconMap.FileText;
                return (
                  <div key={idx} className="flex items-center space-x-5 group">
                    <div
                      className={`w-14 h-14 ${feature.bgColorClass} rounded-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <Icon className={`w-7 h-7 ${feature.iconColorClass}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-500 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">{feature.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative inline-block group cursor-pointer mb-8">
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-40 blur-lg group-hover:opacity-60 transition-opacity duration-500" />

                <div className="relative w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  href={sectionData.ctaLink || "#"}
                  className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-sm font-bold text-lg group transition-all duration-300 shadow-lg hover:shadow-red-500/30 flex items-center gap-2 transform hover:-translate-y-1"
                >
                  {sectionData.ctaText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="space-y-6 order-3">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-6 bg-slate-50/80 hover:bg-white rounded-sm border border-transparent hover:border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`text-3xl font-extrabold mb-1 ${stat.colorClass}`}>{stat.value}</div>
                  <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection24;
