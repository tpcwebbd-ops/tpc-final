/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection23, Section23Data, Section23Payload, Section23Props } from "./data";

const QuerySection23 = ({ data }: Section23Props) => {
  let sectionData = defaultDataSection23;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section23Payload>;
        sectionData = { ...defaultDataSection23, ...parsed } as Section23Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection23, ...data };
      if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
      if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
    }
  }

  const cards = sectionData.cards || defaultDataSection23.cards;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto w-full max-w-7xl rounded-sm bg-white px-4 text-slate-900 custom-parent-border sm:px-6 lg:px-8"
    >
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = iconMap[card.iconName] || iconMap.Star;

            return (
              <div
                key={idx}
                className="group relative bg-white rounded-sm p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div
                  className={`w-14 h-14 rounded-sm bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} className={`${"text-white"}`} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-colors">
                  {card.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600">{card.description}</p>

                <div
                  className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${card.gradient} group-hover:w-full transition-all duration-500 ease-in-out`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuerySection23;
