/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import React, { useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection27, Section27Data, ICourseCard, Section27Payload, Section27Props } from "./data";

const Check = iconMap.Check;
const Clock = iconMap.Clock;
const BookOpen = iconMap.FileText;
const MapPin = iconMap.MapPin;
const ArrowRight = iconMap.ArrowRight;

const CourseCard: React.FC<ICourseCard> = ({
  title,
  level,
  levelColorClass,
  description,
  features,
  duration,
  classes,
  price,
  popular = false,
  schedule = [],
}) => (
  <div
    className={`relative bg-white rounded-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border flex flex-col h-full ${
      popular ? "border-red-200 ring-2 ring-red-100" : "border-gray-100"
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-1">
          <span>🔥 Most Popular</span>
        </div>
      </div>
    )}

    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 bg-red-50 rounded-sm flex items-center justify-center shrink-0">
          <BookOpen className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{title}</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${levelColorClass}`}
          >
            {level}
          </span>
        </div>
      </div>
    </div>

    {price && (
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-red-500 tracking-tight">{price}</span>
          <span className="text-gray-400 text-sm font-medium">/ course</span>
        </div>
      </div>
    )}

    <p className="text-gray-600 mb-6 leading-relaxed text-sm flex-grow">{description}</p>

    {schedule && schedule.length > 0 && (
      <div className="mb-6 bg-red-50/50 p-4 rounded-sm border border-red-100/50">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-red-500" />
          Class Schedule
        </h4>
        <div className="space-y-2">
          {schedule.map((time, index) => (
            <div key={index} className="flex items-center text-gray-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2.5"></div>
              {time}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-gray-600 text-sm font-medium">{feature}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
      <div className="bg-gray-50 rounded-sm p-3 text-center border border-gray-100">
        <div className="text-lg font-bold text-gray-900 mb-0.5">{duration}</div>
        <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Duration</div>
      </div>
      <div className="bg-gray-50 rounded-sm p-3 text-center border border-gray-100">
        <div className="text-lg font-bold text-gray-900 mb-0.5">{classes}</div>
        <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Classes</div>
      </div>
    </div>

    <button
      className={`w-full py-4 rounded-sm font-bold text-base transition-all duration-300 flex items-center justify-center group ${
        popular
          ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-red-500/30"
          : "bg-white text-gray-900 border-2 border-gray-200 hover:border-red-500 hover:text-red-500"
      }`}
    >
      Enroll Now
      <ArrowRight
        className={`w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 ${popular ? "text-white" : "text-gray-400 group-hover:text-red-500"}`}
      />
    </button>
  </div>
);

const QuerySection27 = ({ data }: Section27Props) => {
  const isVisible = true;
  const [activeTab, setActiveTab] = useState("offline");

  let sectionData: Section27Data = defaultDataSection27;
  let paddingX = 0;
  let paddingY = 0;
  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as Partial<Section27Payload>;
        sectionData = { ...defaultDataSection27, ...parsed } as Section27Data;
        paddingX = Math.max(0, Number(parsed.paddingX) || 0);
        paddingY = Math.max(0, Number(parsed.paddingY) || 0);
      } catch (e) {
        console.error("Failed to parse section data", e);
      }
    } else {
      sectionData = { ...defaultDataSection27, ...data } as Section27Data;
      paddingX = Math.max(0, Number((data as Partial<Section27Payload>).paddingX) || 0);
      paddingY = Math.max(0, Number((data as Partial<Section27Payload>).paddingY) || 0);
    }
  }

  const courses = sectionData.courses || defaultDataSection27.courses;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-7xl custom-parent-border bg-white px-4 md:px-8"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div>
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div className="inline-flex items-center bg-white border border-red-100 text-red-600 px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {sectionData.badgeText}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            {sectionData.headingPrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              {sectionData.headingHighlight}
            </span>{" "}
            {sectionData.headingSuffix}
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {sectionData.subTitle}
          </p>

          <div className="flex justify-center mb-14">
            <div className="bg-white p-1.5 rounded-sm shadow-xl border border-gray-100 inline-flex relative">
              <button
                onClick={() => setActiveTab("offline")}
                className={`px-8 py-3 rounded-sm font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === "offline"
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-500 hover:text-red-500 hover:bg-gray-50"
                }`}
              >
                {sectionData.tab1Label}
              </button>
              <button
                onClick={() => setActiveTab("online")}
                className={`px-8 py-3 rounded-sm font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === "online"
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-500 hover:text-red-500 hover:bg-gray-50"
                }`}
              >
                {sectionData.tab2Label}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuerySection27;
