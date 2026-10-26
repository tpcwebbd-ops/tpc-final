/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import React from "react";

import { defaultDataSection31, Section31Data, Section31Payload, Section31Props } from "./data";

const QuerySection31 = ({ data }: Section31Props) => {
  let sectionData: Section31Data = defaultDataSection31;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section31Payload>;
        sectionData = { ...defaultDataSection31, ...parsed } as Section31Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection31, ...data } as Section31Data;
      paddingX = Math.max(0, Number((data as Partial<Section31Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section31Payload>).paddingY) || 0);
    }
  }

  const stats = sectionData.stats?.length ? sectionData.stats : defaultDataSection31.stats;

  return (
    <section
      className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center custom-parent-border bg-white px-4 sm:px-6 lg:px-8"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="w-full">
        <div className="text-center mb-20 relative">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            {sectionData.headingPrefix}{" "}
            <span className="text-red-500 relative inline-block">
              {sectionData.headingHighlight}
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-red-500 rounded-full opacity-40"></div>
            </span>{" "}
            {sectionData.headingSuffix}
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 bg-white/40 backdrop-blur-sm rounded-sm border border-white/50 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-red-500 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out">
                {stat.number}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wide text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection31;
