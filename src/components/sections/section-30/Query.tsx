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

import { defaultDataSection30, Section30Data, Section30Payload, Section30Props } from "./data";

const sectionIconMap: { [key: string]: React.ElementType } = {
  Users: iconMap.Users,
  Award: iconMap.Award,
  BookOpen: iconMap.FileText,
  Plane: iconMap.Navigation,
  Globe: iconMap.Globe,
  Zap: iconMap.Zap,
  CheckCircle: iconMap.Check,
};
const HelpCircle = iconMap.HelpCircle;
const MapPin = iconMap.MapPin;
const Phone = iconMap.Phone;
const Globe = iconMap.Globe;
const Plane = iconMap.Navigation;
const Award = iconMap.Award;
const BookOpen = iconMap.FileText;

const QuerySection30 = ({ data }: Section30Props) => {
  let sectionData: Section30Data = defaultDataSection30;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section30Payload>;
        sectionData = { ...defaultDataSection30, ...parsed } as Section30Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection30, ...data } as Section30Data;
      paddingX = Math.max(0, Number((data as Partial<Section30Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section30Payload>).paddingY) || 0);
    }
  }

  const features = sectionData.features?.length ? sectionData.features : defaultDataSection30.features;

  return (
    <section
      className="mx-auto h-full w-full max-w-7xl overflow-hidden custom-parent-border bg-white px-4 sm:px-6 lg:px-8"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div>
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            {sectionData.headingPrefix}{" "}
            <span className="text-red-500 relative inline-block">
              {sectionData.headingHighlight}
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-red-500 rounded-full opacity-30 transform -rotate-1"></div>
            </span>{" "}
            {sectionData.headingSuffix}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            {features.map((feature, index) => {
              const Icon = sectionIconMap[feature.iconName] || HelpCircle;
              return (
                <div
                  key={index}
                  className="bg-white rounded-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
                >
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0 bg-red-50 rounded-sm p-3 group-hover:bg-red-500 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-red-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-8">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto lg:mx-0">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                {sectionData.ctaText}
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="bg-white rounded-sm p-8 md:p-10 shadow-2xl border border-gray-100 relative overflow-hidden max-w-lg mx-auto transform hover:rotate-1 transition-transform duration-500">
              <div className="absolute top-4 right-4 opacity-5">
                <Globe className="w-32 h-32 text-gray-900" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-5">
                <Plane className="w-32 h-32 text-gray-900 transform rotate-45" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {sectionData.rightCardBadge}
                  </div>
                </div>

                <div className="text-center mb-10 relative">
                  <svg
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-20 -z-10 opacity-30"
                    viewBox="0 0 200 60"
                  >
                    <path
                      d="M10,30 Q100,-20 190,30"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>

                  <div className="relative inline-block z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-orange-400 to-red-500 flex items-center justify-center shadow-xl border-4 border-white mb-4 mx-auto relative">
                      <span className="text-4xl" role="img" aria-label="Student">
                        👨‍🎓
                      </span>
                      <div className="absolute -top-2 -right-4 bg-orange-500 rounded-full p-2 shadow-md transform rotate-12 animate-pulse">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="bg-amber-800 text-white rounded-sm px-3 py-2 shadow-lg transform -rotate-6 inline-block hover:rotate-0 transition-transform cursor-pointer border-2 border-amber-900/20">
                      <div className="text-[10px] font-bold opacity-70 mb-0.5">PASSPORT</div>
                      <Globe className="w-6 h-6 mx-auto" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center px-2">
                  <div className="flex flex-col items-center gap-1 group/pin">
                    <div className="p-2 bg-red-50 rounded-full group-hover/pin:bg-red-100 transition-colors">
                      <MapPin className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {sectionData.locationLabel}
                    </span>
                  </div>

                  <div className="h-0.5 flex-1 bg-red-100 mx-4 relative">
                    <div className="absolute right-0 -top-1 w-2 h-2 bg-red-300 rounded-full" />
                  </div>

                  <div className="flex flex-col items-center gap-1 group/pin">
                    <div className="p-2 bg-green-50 rounded-full group-hover/pin:bg-green-100 transition-colors">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {sectionData.destinationLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-10 -left-6 lg:-left-12 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce z-20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-20 -right-4 lg:-right-8 bg-blue-500 rounded-full p-3 shadow-lg animate-pulse delay-700 z-20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuerySection30;
