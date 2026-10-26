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

import { defaultDataSection29, Section29Data, Section29Payload, Section29Props } from "./data";

const Calendar = iconMap.Calendar;
const PlayCircle = iconMap.Play;

const QuerySection29 = ({ data }: Section29Props) => {
  let sectionData: Section29Data = defaultDataSection29;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section29Payload>;
        sectionData = { ...defaultDataSection29, ...parsed } as Section29Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection29, ...data } as Section29Data;
      paddingX = Math.max(0, Number((data as Partial<Section29Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section29Payload>).paddingY) || 0);
    }
  }

  return (
    <div
      className="mx-auto w-full max-w-7xl custom-parent-border bg-white px-4 md:px-6"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div>
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_40%)] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-sm">{sectionData.title}</h2>
            <p className="text-lg md:text-xl mb-10 opacity-95 font-medium max-w-2xl mx-auto leading-relaxed">
              {sectionData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10">
              <button className="bg-white text-red-600 hover:bg-slate-50 px-8 py-4 rounded-sm font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center group min-w-[200px] justify-center">
                {sectionData.buttonPrimaryText}
                <Calendar className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform text-red-500" />
              </button>

              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-sm font-bold text-lg border border-white/40 transition-all duration-300 flex items-center group hover:-translate-y-1 active:translate-y-0 active:scale-95 min-w-[200px] justify-center shadow-lg">
                <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {sectionData.buttonSecondaryText}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 inline-block px-8">
              <p className="opacity-90 mb-2 text-sm md:text-base font-medium uppercase tracking-wide">
                {sectionData.contactLabel}
              </p>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">{sectionData.contactNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection29;
