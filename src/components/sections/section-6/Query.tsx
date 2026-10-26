/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Globe,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import { defaultDataSection6, Section6Data } from "./data";

export interface Section6Props {
  data?: Section6Data | string;
}

const ClientSection6: React.FC<Section6Props> = ({ data }) => {
  let sectionData: Section6Data = defaultDataSection6;
  if (data) {
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section6Data>;
      sectionData = {
        ...defaultDataSection6,
        ...parsed,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
    }
  }
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      className="custom-parent-border relative w-full  bg-white font-sans text-slate-900"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-b from-blue-50 to-indigo-50/20 blur-3xl opacity-60 rounded-bl-[200px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-t from-emerald-50 to-teal-50/20 blur-3xl opacity-60 rounded-tr-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          <div className="lg:col-span-7 space-y-10">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              {sectionData.showEyebrow !== false && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-900">
                  <Award size={12} />
                  {sectionData.accreditation}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                <CalendarDays size={12} />
                Est. {sectionData.established}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                {sectionData.universityName}
              </h1>
              <div className="flex items-center gap-2 text-lg text-slate-500 font-medium">
                <MapPin className="text-blue-500" size={20} />
                {sectionData.location}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-lg text-slate-600 leading-relaxed max-w-2xl">
              {sectionData.description}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionData.features &&
                sectionData.features.map((feature, idx) => (
                  <div key={idx} className="group flex items-center gap-3 p-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="border-t border-slate-100 pt-8 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <GraduationCap size={16} />
                <span>Programs Available</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sectionData.programs &&
                  sectionData.programs.map((program, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-sm shadow-sm hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all cursor-default select-none"
                    >
                      {program}
                    </span>
                  ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={sectionData.buttonUrl || "#"}
                className="inline-flex items-center justify-center rounded-sm bg-amber-100 px-8 py-4 text-lg font-bold text-amber-950 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-600/20"
              >
                {sectionData.applyText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                target="_blank"
                href={sectionData.websiteUrl || "#"}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group"
              >
                <Globe className="mr-2 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                {sectionData.buttonText || "Visit Website"}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative perspective-1000">
            <motion.div
              variants={imageVariants}
              className="group relative overflow-hidden rounded-sm bg-[#fffaf0] shadow-2xl"
            >
              <div className="relative h-[600px] w-full">
                <Image
                  src={sectionData.bannerImage || "/placeholder.jpg"}
                  alt={sectionData.universityName}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              <div className="absolute top-6 right-6">
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-sm shadow-xl shadow-black/20 w-24 h-24 flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
                  <div className="relative w-full h-full">
                    <Image
                      src={sectionData.logoUrl || "/placeholder-logo.png"}
                      alt="Logo"
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-sm border border-amber-200 bg-[#fffaf0]/95 p-5 transition-colors hover:bg-white">
                    <div className="mb-2 flex items-center gap-2 text-amber-800">
                      <Users size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Students</span>
                    </div>
                    <p className="text-3xl font-bold text-stone-900">{sectionData.totalStudents}</p>
                  </div>

                  <div className="rounded-sm border border-amber-200 bg-[#fffaf0]/95 p-5 transition-colors hover:bg-white">
                    <div className="mb-2 flex items-center gap-2 text-amber-800">
                      <Sparkles size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-bold text-stone-900">{sectionData.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-amber-200 bg-amber-100/95 p-6 shadow-xl">
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-900">Tuition Fee</p>
                  <p className="text-4xl font-extrabold tracking-tight text-stone-900">{sectionData.tuitionFee}</p>
                  <p className="mt-2 text-xs font-medium text-stone-600">Per academic year • Financial aid available</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="absolute -bottom-6 -left-6 -right-6 z-[-1] flex flex-wrap justify-center gap-3 opacity-50 blur-sm scale-95 pointer-events-none"
            >
              {sectionData.subjects &&
                sectionData.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-200 rounded-full text-xs">
                    {subject}
                  </span>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2">
              {sectionData.subjects &&
                sectionData.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform cursor-default"
                  >
                    <BookOpen size={14} className="text-indigo-500" />
                    {subject}
                  </span>
                ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection6;
