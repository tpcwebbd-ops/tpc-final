/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  ArrowRight,
  Clock,
  DollarSign,
  ChevronDown,
  Building2,
  Globe,
  Search,
  BookOpenCheck,
  Sparkles,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";

import { defaultDataSection7, Section7Data } from "./data";

const classNames = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export interface Section7Props {
  data?: Section7Data | string;
}

const ClientSection7: React.FC<Section7Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [expandedUni, setExpandedUni] = useState<string | null>(null);

  const sectionData: Section7Data = useMemo(() => {
    if (!data) return defaultDataSection7;
    try {
      return typeof data === "string"
        ? { ...defaultDataSection7, ...JSON.parse(data) }
        : { ...defaultDataSection7, ...data };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection7;
    }
  }, [data]);
  const paddingX = Math.max(0, Number.isFinite(sectionData.paddingX) ? sectionData.paddingX : 0);
  const paddingY = Math.max(0, Number.isFinite(sectionData.paddingY) ? sectionData.paddingY : 0);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(sectionData.city || []));
    return ["All", ...uniqueCities];
  }, [sectionData.city]);

  const filteredUniversities = useMemo(() => {
    if (activeTab === "All") return sectionData.universitys;
    return sectionData.universitys.filter(
      (uni) =>
        uni.location?.toLowerCase().includes(activeTab.toLowerCase()) ||
        activeTab.toLowerCase().includes(uni.location?.toLowerCase()),
    );
  }, [activeTab, sectionData.universitys]);

  const toggleUni = (id: string) => {
    setExpandedUni(expandedUni === id ? null : id);
  };

  const getApplyUrl = (params: string[]) => {
    const [country, city, university, subject] = params || [];
    const queryParams = new URLSearchParams();

    if (country) queryParams.set("country", country);
    if (city) queryParams.set("City", city);
    if (university) queryParams.set("University", university);
    if (subject) queryParams.set("Subject", subject);

    return `/application?${queryParams.toString()}`;
  };

  return (
    <section
      className="custom-parent-border relative min-h-screen w-full max-w-7xl overflow-hidden bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent" />
        <div className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] bg-indigo-200/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[20%] -left-[10%] w-[30vw] h-[30vw] bg-blue-200/20 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full shadow-sm text-indigo-600 text-xs font-bold tracking-wider uppercase"
          >
            <Globe size={12} />
            {sectionData.showEyebrow && <span>{sectionData.eyebrow}</span>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Study in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                {sectionData.country}
              </span>
            </h1>

            <div className="absolute -top-6 -right-6 md:-right-12 rotate-12 bg-yellow-400 text-yellow-950 text-xs font-black px-3 py-1.5 rounded-sm shadow-lg border-2 border-white transform hover:rotate-0 transition-transform cursor-default z-20">
              {sectionData.universitys.length} Universities
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Explore top-ranked institutions in {sectionData.country} across {sectionData.city.length} vibrant cities.
            Find the perfect campus for your future.
          </motion.p>
        </div>

        <LayoutGroup>
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {cities.map((city) => {
              const isActive = activeTab === city;
              return (
                <button
                  key={city}
                  onClick={() => setActiveTab(city)}
                  className={classNames(
                    "relative px-6 py-2.5 rounded-full text-sm hover:cursor-pointer font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    isActive ? "text-slate-50" : "text-slate-500 hover:text-slate-900 hover:bg-white/50",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {city !== "All" && <MapPin size={14} className={isActive ? "text-indigo-300" : "text-slate-400"} />}
                    {city === "All" ? "All Cities" : city}
                  </span>
                </button>
              );
            })}
          </motion.div>

          <motion.div layout className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((uni) => (
                  <motion.div
                    layout
                    key={uni.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className={classNames(
                      "bg-white rounded-sm overflow-hidden border transition-all duration-300",
                      expandedUni === uni.id
                        ? "border-indigo-500/30 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                        : "border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200",
                    )}
                  >
                    <div onClick={() => toggleUni(uni.id)} className="cursor-pointer group relative p-5 sm:p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-sm overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                          {uni.image ? (
                            <Image
                              src={uni.image}
                              alt={uni.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Building2 size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 truncate pr-4 group-hover:text-indigo-600 transition-colors">
                              {uni.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                <GraduationCap size={12} />
                                {uni.courses.length} Courses
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" />
                              {uni.location}
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="truncate text-slate-400 max-w-[200px] sm:max-w-md">{uni.description}</div>
                          </div>
                        </div>

                        <div
                          className={classNames(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                            expandedUni === uni.id
                              ? "bg-indigo-600 border-indigo-600 text-slate-900 rotate-180"
                              : "bg-white border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600",
                          )}
                        >
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedUni === uni.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-8 space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-sm shrink-0">
                                <BookOpenCheck size={20} />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">Available Programs</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                  Browse the list of available courses and degrees at {uni.name}.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {uni.courses.map((course, idx) => (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  key={course.id}
                                  className="group/card relative bg-white rounded-sm p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                >
                                  <div className="flex-grow">
                                    <div className="mb-4">
                                      <h5 className="font-bold text-slate-900 group-hover/card:text-indigo-600 transition-colors text-lg">
                                        {course.name}
                                      </h5>
                                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {course.description}
                                      </p>
                                    </div>

                                    {course.degreeLevelInfo && course.degreeLevelInfo.length > 0 ? (
                                      <div className="space-y-2 mb-4">
                                        {course.degreeLevelInfo.map((info) => (
                                          <div
                                            key={info.id}
                                            className="bg-slate-50 rounded-sm p-2.5 border border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-xs hover:border-indigo-100 transition-colors"
                                          >
                                            <div className="flex items-center gap-1.5 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
                                              <Award size={12} />
                                              {info.degreeLevel}
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                              <div className="flex items-center gap-1">
                                                <Clock size={11} className="text-slate-400" />
                                                {info.duration}
                                              </div>
                                              <span className="hidden xs:block w-px h-3 bg-slate-300/50"></span>
                                              <div className="flex items-center gap-1">
                                                <DollarSign size={11} className="text-slate-400" />
                                                {info.tutionFees}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-slate-100 text-slate-600 text-xs font-bold">
                                          <Clock size={12} className="text-slate-400" />
                                          {course.duration}
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                          <DollarSign size={12} />
                                          {course.tutionFees}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-auto">
                                    <Link
                                      href={getApplyUrl(course.applyBtnParms)}
                                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-amber-200 text-amber-950 text-xs font-bold hover:bg-amber-300 transition-all duration-700 shadow-sm group/btn"
                                    >
                                      <span>Apply Now</span>
                                      <ArrowRight
                                        size={12}
                                        className="group-hover/btn:translate-x-0.5 transition-transform"
                                      />
                                    </Link>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {uni.courses.length === 0 && (
                              <div className="text-center py-8 bg-slate-100/50 rounded-sm border border-dashed border-slate-300">
                                <p className="text-slate-500 text-sm">No courses listed currently.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 bg-white rounded-sm border border-dashed border-slate-200"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
                    <Search size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Universities Found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    We couldn&apos;t find any universities in{" "}
                    <span className="font-semibold text-slate-700">{activeTab}</span>.
                  </p>
                  <button
                    onClick={() => setActiveTab("All")}
                    className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    View All Cities
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Sparkles size={14} />
            <span>Discover your potential with premier education</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection7;
