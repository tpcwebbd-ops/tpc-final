/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/* eslint-disable react-hooks/preserve-manual-memoization */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarDays, Clock3, Compass, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  defaultDataVisaInsights,
  defaultLayout,
  type BlogPost,
  type IVisaInsightsData,
  type VisaInsightsPayload,
  type VisaInsightsProps,
} from "./data";

const cloneData = (data: IVisaInsightsData): IVisaInsightsData => JSON.parse(JSON.stringify(data)) as IVisaInsightsData;

const parseData = (data?: IVisaInsightsData | VisaInsightsPayload | string): VisaInsightsPayload => {
  if (!data) return { ...cloneData(defaultDataVisaInsights), ...defaultLayout };
  try {
    const parsed = typeof data === "string" ? (JSON.parse(data) as Partial<VisaInsightsPayload>) : data;
    return {
      ...defaultDataVisaInsights,
      ...defaultLayout,
      ...parsed,
      pageUid: "visa-insights-uid",
      pageName: "Blog Page",
      topics: Array.isArray(parsed.topics) ? parsed.topics : defaultDataVisaInsights.topics,
      blogs: Array.isArray(parsed.blogs) ? parsed.blogs : defaultDataVisaInsights.blogs,
    };
  } catch {
    return { ...cloneData(defaultDataVisaInsights), ...defaultLayout };
  }
};

const BlogImage = ({
  blog,
  className,
  priority = false,
}: {
  blog: BlogPost;
  className: string;
  priority?: boolean;
}) => (
  <div className={`relative min-h-px overflow-hidden bg-slate-200 ${className}`}>
    {blog.imageUrl ? (
      <Image
        alt={blog.imageAlt || blog.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        src={blog.imageUrl}
        loading={priority ? "eager" : "lazy"}
      />
    ) : (
      <div className="grid h-full w-full place-items-center bg-slate-100 text-slate-300">
        <BookOpen className="h-12 w-12" />
      </div>
    )}
  </div>
);

const BlogLink = ({ blog, children, className }: { blog: BlogPost; children: React.ReactNode; className: string }) => {
  const href = /^https?:\/\//i.test(blog.url) || blog.url.startsWith("/") || blog.url.startsWith("#") ? blog.url : "#";
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href || "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
};

const QueryVisaInsights = ({ data }: VisaInsightsProps) => {
  const pageData = parseData(data);
  const reduceMotion = useReducedMotion();
  const [activeTopic, setActiveTopic] = useState("All");
  const [subscribed, setSubscribed] = useState(false);
  const featured = pageData.blogs.find((blog) => blog.featured) || pageData.blogs[0];
  const popular = pageData.blogs.filter((blog) => blog.popular).slice(0, 4);
  const filteredBlogs = useMemo(() => {
    return pageData.blogs.filter((blog) => {
      const matchesTopic = activeTopic === "All" || blog.category === activeTopic;
      return matchesTopic;
    });
  }, [activeTopic, pageData.blogs]);

  const theme = {
    "--blog-bg": pageData.backgroundColor,
    "--blog-surface": pageData.surfaceColor,
    "--blog-heading": pageData.headingColor,
    "--blog-text": pageData.textColor,
    "--blog-accent": pageData.accentColor,
  } as CSSProperties;

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <main
      style={{
        ...theme,
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
      className="overflow-hidden bg-[var(--blog-bg)] text-[var(--blog-text)] custom-parent-border"
    >
      {featured && (
        <section aria-labelledby="featured-blog-title" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.article
              {...reveal}
              className="group grid overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.12fr_.88fr]"
            >
              <BlogImage blog={featured} priority className="aspect-[16/10] lg:aspect-auto lg:min-h-[480px]" />
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                {pageData.heroEyebrowVisible && pageData.heroEyebrow ? (
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--blog-accent)]">
                    {pageData.heroEyebrow}
                  </p>
                ) : null}
                <h2
                  id="featured-blog-title"
                  className="mt-6 text-[clamp(2.3rem,4vw,4.4rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--blog-heading)]"
                >
                  {featured.title}
                </h2>
                <p className="mt-5 text-lg leading-8">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />{" "}
                    <time dateTime={featured.publishedAt}>{featured.publishedAt}</time>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" /> {featured.readTime}
                  </span>
                </div>
                <BlogLink
                  blog={featured}
                  className="mt-8 inline-flex items-center gap-2 font-black text-[var(--blog-accent)]"
                >
                  Read article <ArrowRight className="h-4 w-4" />
                </BlogLink>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      <section aria-label="Blog topics" className="bg-white px-4 -pb-5 sm:px-6 lg:px-8 mt-12">
        <motion.div {...reveal} className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black">Trending Topic</h1>
            </div>
            <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
              {pageData.topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopic(topic.label)}
                  aria-pressed={activeTopic === topic.label}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition cursor-pointer ${
                    activeTopic === topic.label
                      ? "border border-slate-300 bg-slate-100 text-[var(--blog-heading)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-[var(--blog-accent)]"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      </section>

      <section aria-label="Latest blog articles" className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
                className="group overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <BlogImage blog={blog} className="aspect-[16/10]" />
                <div className="p-6">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs text-slate-400">{blog.readTime}</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black leading-tight text-[var(--blog-heading)]">{blog.title}</h3>
                  <p className="mt-3 line-clamp-3 leading-7">{blog.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
                    <span>{blog.author}</span>
                    <time dateTime={blog.publishedAt}>{blog.publishedAt}</time>
                  </div>
                  <BlogLink
                    blog={blog}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--blog-accent)]"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </BlogLink>
                </div>
              </motion.article>
            ))}
          </div>
          {filteredBlogs.length === 0 && (
            <div className="mt-10 rounded-sm border border-dashed border-slate-300 p-12 text-center">
              <Search className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-bold text-slate-500">No matching articles.</p>
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="popular-guides-title"
        className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <h2 id="popular-guides-title" className="text-3xl font-black text-[var(--blog-heading)] sm:text-5xl">
              {pageData.popularTitle}
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {popular.map((blog, index) => (
              <motion.article
                key={blog.id}
                {...reveal}
                className="group flex gap-4 rounded-sm border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
              >
                <BlogImage blog={blog} className="h-28 w-32 shrink-0 rounded-sm sm:w-40" />
                <div className="min-w-0 py-1">
                  <span className="text-3xl font-black text-slate-200">0{index + 1}</span>
                  <h3 className="mt-2 line-clamp-2 text-lg font-black leading-6 text-[var(--blog-heading)]">
                    {blog.title}
                  </h3>
                  <BlogLink
                    blog={blog}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--blog-accent)] hover:underline"
                  >
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </BlogLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="newsletter-title" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          {...reveal}
          className="mx-auto grid max-w-7xl gap-8 rounded-sm bg-white p-7 shadow-xl sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:p-14"
        >
          <div>
            {pageData.newsletterEyebrowVisible && pageData.newsletterEyebrow ? (
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--blog-accent)]">
                {pageData.newsletterEyebrow}
              </p>
            ) : null}
            <h2
              id="newsletter-title"
              className="mt-3 text-3xl font-black leading-tight text-[var(--blog-heading)] sm:text-5xl"
            >
              {pageData.newsletterTitle}
            </h2>
            <p className="mt-4 leading-7">{pageData.newsletterDescription}</p>
          </div>
          {subscribed ? (
            <div className="rounded-sm bg-emerald-50 p-6 font-bold text-emerald-700">Thanks for subscribing.</div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubscribed(true);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <Input
                  required
                  type="email"
                  placeholder="Email address"
                  className="h-13 rounded-sm border-slate-200 bg-slate-50"
                />
              </label>
              <Button className="h-13 rounded-sm bg-[var(--blog-accent)] px-6 text-white hover:brightness-90">
                {pageData.newsletterButtonText}
              </Button>
            </form>
          )}
        </motion.div>
      </section>

      <section aria-labelledby="blog-cta-title" className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-slate-200 bg-slate-50 px-6 py-14 text-center text-[var(--blog-heading)] sm:px-10 lg:py-18"
        >
          <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full border-[50px] border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <Compass className="mx-auto h-10 w-10" />
            <h2 id="blog-cta-title" className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              {pageData.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-600">{pageData.ctaDescription}</p>
            <a
              href={pageData.ctaButtonUrl}
              className="mt-8 inline-flex min-h-13 items-center gap-2 rounded-sm bg-white px-7 font-black text-[var(--blog-accent)]"
            >
              {pageData.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default QueryVisaInsights;
