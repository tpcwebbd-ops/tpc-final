/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection14, Section14Data } from "./data";

const iconComponent = (icon: keyof typeof iconMap) => {
  const IconComponent = iconMap[icon];
  const Icon = (props: { className?: string; size?: number }) => <IconComponent {...props} />;
  Icon.displayName = `SectionIcon(${icon})`;
  return Icon;
};
const Calendar = iconComponent("Calendar");
const Clock = iconComponent("Clock");
const ArrowRight = iconComponent("ArrowRight");
const X = iconComponent("X");
const User = iconComponent("User");
const QuoteIcon = iconComponent("Quote");
const Sparkles = iconComponent("Sparkles");
const Hash = iconComponent("Hash");

interface Section14Props {
  data?: Section14Data | string;
}

const QuerySection14: React.FC<Section14Props> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const sectionData: Section14Data = useMemo(() => {
    if (!data) return defaultDataSection14;
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const normalized = (Array.isArray(parsed) ? parsed[0] : parsed) as Partial<Section14Data>;
      return {
        ...defaultDataSection14,
        ...normalized,
        paddingX: Math.max(-300, Math.min(300, Number(normalized.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(normalized.paddingY) || 0)),
        showEyebrow: normalized.showEyebrow !== false,
        allData: normalized.allData || defaultDataSection14.allData,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection14;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedArticle]);

  return (
    <section
      className="custom-parent-border relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-white font-sans text-stone-800"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-indigo-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-purple-100/60 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          {sectionData.showEyebrow && sectionData.badge && (
            <motion.p
              className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-700"
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {sectionData.badge}
            </motion.p>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-stone-900 tracking-tight"
          >
            {sectionData.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {sectionData.subTitle}
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionData.allData &&
            sectionData.allData.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      </AnimatePresence>
    </section>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArticleCard = ({ article, index, onClick }: { article: any; index: number; onClick: () => void }) => {
  return (
    <motion.div
      layoutId={`card-container-${article.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="group cursor-pointer relative flex flex-col h-full bg-white border border-stone-200 rounded-sm overflow-hidden hover:border-indigo-500/30 hover:bg-indigo-50/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-900/10"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <motion.div layoutId={`hero-image-${article.id}`} className="w-full h-full relative">
          {article.heroImage ? (
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-50">
              <Sparkles className="text-indigo-300" size={48} />
            </div>
          )}
        </motion.div>

        <div className="absolute top-4 left-4 z-10">
          <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-800 shadow-sm backdrop-blur-md">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6 relative">
        <div className="space-y-3 mb-6">
          <motion.h3
            layoutId={`title-${article.id}`}
            className="text-xl font-bold text-stone-900 leading-snug group-hover:text-indigo-600 transition-colors"
          >
            {article.title}
          </motion.h3>
          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">{article.subtitle}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-stone-200 pt-6 transition-colors group-hover:border-indigo-200">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-stone-200 bg-stone-50">
              {article.author.avatar ? (
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              ) : (
                <User size={16} className="m-2 text-zinc-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-stone-800">{article.author.name}</span>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                {article.publishedAt} • {article.readTime}
              </span>
            </div>
          </div>

          <div className="flex h-8 w-8 transform items-center justify-center rounded-full bg-indigo-50 text-indigo-700 transition-all duration-300 group-hover:-rotate-45 group-hover:bg-indigo-100">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArticleModal = ({ article, onClose }: { article: any; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-stone-200/85 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        layoutId={`card-container-${article.id}`}
        className="relative flex h-full w-full flex-col overflow-hidden border border-stone-200 bg-white shadow-2xl md:h-[90vh] md:max-w-5xl md:rounded-sm"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 rounded-full border border-stone-200 bg-white/90 p-2 text-stone-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="relative w-full h-[50vh] min-h-[400px]">
            <motion.div layoutId={`hero-image-${article.id}`} className="w-full h-full relative">
              {article.heroImage && (
                <Image src={article.heroImage} alt={article.title} fill className="object-cover" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent" />
            </motion.div>

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-4"
              >
                <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 rounded bg-white/90 px-2 py-1 font-mono text-xs text-stone-700 backdrop-blur">
                  <Clock size={12} /> {article.readTime}
                </span>
              </motion.div>

              <motion.h1
                layoutId={`title-${article.id}`}
                className="mb-4 text-3xl font-black leading-tight text-stone-900 md:text-5xl lg:text-6xl"
              >
                {article.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 text-stone-700"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                    {article.author.avatar ? (
                      <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                    ) : (
                      <User className="m-2" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{article.author.name}</p>
                    <p className="text-xs opacity-70">{article.author.role}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-stone-200" />
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} /> {article.publishedAt}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-12 pb-24">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-4 border-indigo-500 pl-6 text-xl font-medium leading-relaxed text-stone-700 md:text-2xl"
            >
              {article.subtitle}
            </motion.p>

            <div className="space-y-8">
              {article.content &&
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                article.content.map((block: any, i: number) => <ContentBlock key={i} block={block} index={i} />)}
            </div>

            <div className="mt-12 border-t border-stone-200 pt-12">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-4">Related Topics</p>
              <div className="flex flex-wrap gap-2">
                {article.tags &&
                  article.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="flex cursor-default items-center gap-1 rounded-sm border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-indigo-300 hover:text-indigo-700"
                    >
                      <Hash size={12} className="text-indigo-500" /> {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContentBlock = ({ block }: { block: any; index: number }) => {
  const commonAnim = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: 0.1, duration: 0.5 },
  };

  switch (block.type) {
    case "heading":
      return (
        <motion.h3 {...commonAnim} className="mb-6 mt-12 text-2xl font-bold text-stone-900 md:text-3xl">
          {block.content}
        </motion.h3>
      );

    case "text":
      return (
        <motion.p {...commonAnim} className="text-lg leading-8 text-stone-600">
          {block.content}
        </motion.p>
      );

    case "quote":
      return (
        <motion.div {...commonAnim} className="my-10 relative">
          <QuoteIcon className="absolute top-[-20px] left-[-10px] text-indigo-500/20 w-16 h-16 transform -scale-x-100" />
          <blockquote className="relative z-10 px-4 text-center font-serif text-2xl italic leading-tight text-indigo-800 md:px-12 md:text-3xl">
            &ldquo;{block.content}&rdquo;
          </blockquote>
          <div className="text-center mt-6 text-sm font-bold text-indigo-400 uppercase tracking-widest">
            — {block.author}
          </div>
        </motion.div>
      );

    case "image":
      return (
        <motion.figure {...commonAnim} className="my-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-stone-200 bg-stone-50">
            <Image src={block.src} alt={block.alt} fill className="object-cover" />
          </div>
          {block.caption && (
            <figcaption className="text-center text-sm text-zinc-500 mt-3 italic">{block.caption}</figcaption>
          )}
        </motion.figure>
      );

    default:
      return null;
  }
};

export default QuerySection14;
