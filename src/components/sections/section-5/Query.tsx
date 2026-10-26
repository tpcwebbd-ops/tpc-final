/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, User, Hash, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { Button } from "@/components/ui/button";

import { BlogPost, defaultDataSection5, Section5Data } from "./data";

interface Section5Props {
  data?: Section5Data | string;
}

const QuerySection5: React.FC<Section5Props> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const sectionData: Section5Data = useMemo(() => {
    if (!data) return defaultDataSection5;
    try {
      const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<Section5Data>;
      return {
        ...defaultDataSection5,
        ...parsed,
        showEyebrow: parsed.showEyebrow !== false,
        paddingX: Math.max(-300, Math.min(300, Number(parsed.paddingX) || 0)),
        paddingY: Math.max(-300, Math.min(300, Number(parsed.paddingY) || 0)),
        categories: parsed.categories || defaultDataSection5.categories,
        allData: parsed.allData || defaultDataSection5.allData,
      };
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection5;
    }
  }, [data]);
  const paddingX = Math.max(0, sectionData.paddingX);
  const paddingY = Math.max(0, sectionData.paddingY);

  const posts = useMemo(() => sectionData.allData || [], [sectionData]);
  const categories = useMemo(() => sectionData.categories || ["All"], [sectionData]);

  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let base = posts;
    if (selectedCategory !== "All") {
      base = base.filter((p) => p.category === selectedCategory);
    } else {
      if (featuredPost) {
        base = base.filter((p) => p.id !== featuredPost.id);
      }
    }
    return base;
  }, [posts, selectedCategory, featuredPost]);

  return (
    <section
      className="custom-parent-border relative min-h-screen w-full overflow-hidden bg-white font-sans text-stone-800 selection:bg-amber-100"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-amber-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-rose-100/50 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-20 border-[#eadfca] border-t-0">
        {featuredPost && selectedCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group rounded-sm overflow-hidden border border-[#eadfca] bg-[#fffaf0] hover:border-amber-300 transition-all duration-700"
          >
            <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
              <div className="relative h-[300px] lg:h-full overflow-hidden">
                {featuredPost.coverImage && (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="eager"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-6 left-6">
                  {sectionData.showEyebrow && (
                    <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/95 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                      <Sparkles size={12} /> Featured Story
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8 lg:p-16 flex flex-col justify-center relative">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-stone-500 font-mono">
                    <span className="text-indigo-400 font-bold">{featuredPost.category}</span>
                    <span>•</span>
                    <span>{featuredPost.publishedAt}</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-[1.1] tracking-tight group-hover:text-amber-800 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-lg text-stone-600 leading-relaxed max-w-md">{featuredPost.excerpt}</p>

                  <div className="pt-8 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#eadfca] bg-amber-50">
                        {featuredPost.author.avatar ? (
                          <Image
                            src={featuredPost.author.avatar}
                            alt="Author"
                            fill
                            sizes="40px"
                            loading="eager"
                            className="object-cover"
                          />
                        ) : (
                          <User className="p-2 text-stone-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{featuredPost.author.name}</p>
                        <p className="text-xs text-stone-500">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-[#eadfca] mx-2" />
                    <Button className="rounded-sm bg-amber-100 text-amber-950 hover:bg-amber-200 font-bold px-6">
                      Read Article <ArrowUpRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              Latest Posts{" "}
              <span className="text-sm font-normal text-stone-500 font-mono bg-stone-50 border border-[#eadfca] px-2 py-1 rounded-sm">
                {filteredPosts.length}
              </span>
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                    selectedCategory === cat
                      ? "bg-amber-100 text-amber-950 border-amber-300 shadow-sm"
                      : "bg-stone-50 text-stone-600 border-[#eadfca] hover:border-amber-300 hover:text-amber-900",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-stone-500 border border-dashed border-[#d9c9aa] rounded-sm bg-[#fffaf0]"
            >
              No posts found in this category.
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-6 bg-stone-100 border border-[#eadfca] group-hover:border-amber-300 transition-colors">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="eager"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
            <Hash size={48} className="opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-amber-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-sm bg-white/90 backdrop-blur border border-[#eadfca] text-[10px] font-bold uppercase tracking-wider text-amber-900">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {post.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight cursor-pointer">
          {post.title}
        </h3>

        <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-stone-600 px-2 py-1 bg-stone-50 rounded-sm border border-[#eadfca] group-hover:border-amber-300 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-[#eadfca] flex items-center gap-3 mt-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-amber-50 border border-[#eadfca]">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="24px"
                loading="eager"
                className="object-cover"
              />
            ) : (
              <User size={12} className="m-1 text-stone-500" />
            )}
          </div>
          <span className="text-xs font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
            {post.author.name}
          </span>
          <ArrowUpRight
            size={14}
            className="ml-auto text-stone-400 group-hover:text-amber-700 transition-colors transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QuerySection5;
