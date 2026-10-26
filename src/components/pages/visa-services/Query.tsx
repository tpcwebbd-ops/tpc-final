/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
  FileBadge2,
  FileCheck2,
  Fingerprint,
  Headphones,
  Mail,
  Map,
  MessageCircleMore,
  Phone,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import {
  defaultDataVisaServices,
  defaultLayout,
  type IVisaServicesData,
  type VisaServicesPayload,
  type VisaServicesProps,
} from "./data";

const serviceIcons = [Fingerprint, BookOpenCheck, Map, FileBadge2];
const processIcons = [MessageCircleMore, Target, WandSparkles, BadgeCheck];
const benefitIcons = [FileCheck2, Headphones, ScanSearch, Sparkles, CheckCircle2, ShieldCheck];

const cloneData = (data: IVisaServicesData): IVisaServicesData => JSON.parse(JSON.stringify(data)) as IVisaServicesData;

const parsePageData = (data?: IVisaServicesData | VisaServicesPayload | string): VisaServicesPayload => {
  if (!data) return { ...cloneData(defaultDataVisaServices), ...defaultLayout };

  try {
    const parsed = typeof data === "string" ? (JSON.parse(data) as Partial<VisaServicesPayload>) : data;
    return {
      ...defaultDataVisaServices,
      ...defaultLayout,
      ...parsed,
      pageUid: "visa-services-uid",
      pageName: "Service Catalogue",
      stats: Array.isArray(parsed.stats) ? parsed.stats : defaultDataVisaServices.stats,
      services: Array.isArray(parsed.services) ? parsed.services : defaultDataVisaServices.services,
      processSteps: Array.isArray(parsed.processSteps) ? parsed.processSteps : defaultDataVisaServices.processSteps,
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : defaultDataVisaServices.benefits,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultDataVisaServices.faqs,
    };
  } catch {
    return { ...cloneData(defaultDataVisaServices), ...defaultLayout };
  }
};

const QueryVisaServices = ({ data }: VisaServicesProps) => {
  const pageData = parsePageData(data);
  const reduceMotion = useReducedMotion();
  const telHref = `tel:${pageData.companyContact.replace(/[^\d+]/g, "")}`;
  const theme = {
    "--catalogue-bg": pageData.backgroundColor,
    "--catalogue-surface": pageData.surfaceColor,
    "--catalogue-heading": pageData.headingColor,
    "--catalogue-text": pageData.textColor,
    "--catalogue-accent": pageData.accentColor,
    "--catalogue-accent-dark": pageData.accentDarkColor,
  } as CSSProperties;

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <main
      style={{
        ...theme,
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
      className="overflow-hidden bg-[var(--catalogue-bg)] text-[var(--catalogue-text)] selection:bg-red-200 selection:text-red-950 custom-parent-border"
    >
      <section
        aria-labelledby="service-catalogue-title"
        className="relative isolate min-h-[88svh] overflow-hidden bg-white text-[var(--catalogue-heading)]"
      >
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_15%_20%,rgba(229,34,42,.10),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(59,130,246,.10),transparent_24%)]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(15,23,42,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.35)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid min-h-[88svh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.04fr_.96fr] lg:px-8 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {pageData.showEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                {pageData.eyebrow}
              </p>
            )}
            <h1
              id="service-catalogue-title"
              className="mt-7 text-[clamp(3rem,7.2vw,6.5rem)] font-black leading-[0.9] tracking-[-0.065em] text-[var(--catalogue-heading)]"
            >
              {pageData.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--catalogue-text)] sm:text-lg">
              {pageData.heroDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={pageData.primaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--catalogue-accent)] px-6 font-bold text-white shadow-[0_18px_50px_rgba(229,34,42,.3)] outline-none transition hover:bg-[var(--catalogue-accent-dark)] focus-visible:ring-4 focus-visible:ring-red-300/40"
              >
                {pageData.primaryButtonText} <ArrowDown className="h-4 w-4" />
              </motion.a>
              <a
                href={pageData.secondaryButtonUrl}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-6 font-bold text-[var(--catalogue-heading)] shadow-sm outline-none transition hover:border-red-200 hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-200"
              >
                {pageData.secondaryButtonText} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-7 flex items-start gap-2 text-sm text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {pageData.trustNote}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.12 }}
            className="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-3 lg:max-w-none"
            aria-label="A preview of the four available services"
          >
            {pageData.services.slice(0, 4).map((service, index) => (
              <motion.a
                key={service.id}
                href={`#${service.slug}`}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className={`group relative overflow-hidden rounded-sm border border-slate-200 bg-slate-100 shadow-xl ${
                  index === 0 || index === 3 ? "aspect-[4/5]" : "mt-8 aspect-[4/5]"
                }`}
              >
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 768px) 45vw, 24vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/5 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold leading-5 text-white sm:p-5 sm:text-base">
                  {service.title}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        aria-label="Service highlights"
        className="relative z-10 border-b border-slate-200 bg-white px-4 py-7 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
          {pageData.stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              {...reveal}
              transition={{ ...reveal.transition, delay: reduceMotion ? 0 : index * 0.05 }}
              className="px-4 py-5 text-center sm:px-6"
            >
              <p className="text-2xl font-black tracking-tight text-[var(--catalogue-heading)] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="services" aria-labelledby="catalogue-overview-title" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              {pageData.showCatalogueEyebrow && (
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                  {pageData.catalogueEyebrow}
                </p>
              )}
              <h2
                id="catalogue-overview-title"
                className="mt-5 max-w-4xl text-[clamp(2.7rem,5.4vw,5.4rem)] font-black leading-[0.94] tracking-[-0.06em] text-[var(--catalogue-heading)]"
              >
                {pageData.catalogueTitle}
              </h2>
            </div>
            <p className="text-lg leading-8">{pageData.catalogueDescription}</p>
          </motion.div>

          <nav aria-label="Service catalogue" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pageData.services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <motion.a
                  key={service.id}
                  href={`#${service.slug}`}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: reduceMotion ? 0 : index * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  className="group flex min-h-40 flex-col justify-between rounded-sm border border-slate-200 bg-[var(--catalogue-surface)] p-5 shadow-sm outline-none transition hover:border-red-200 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-red-200"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-sm bg-red-50 text-[var(--catalogue-accent)] transition group-hover:bg-[var(--catalogue-accent)] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-8 flex items-end justify-between gap-4">
                    <span className="font-black text-[var(--catalogue-heading)]">{service.title}</span>
                    <ArrowDown className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[var(--catalogue-accent)]" />
                  </span>
                </motion.a>
              );
            })}
          </nav>
        </div>
      </section>

      {pageData.services.map((service, index) => {
        const Icon = serviceIcons[index % serviceIcons.length];
        const imageFirst = index % 2 === 0;

        return (
          <section
            key={service.id}
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            className={`scroll-mt-20 border-t border-slate-200/80 px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${
              index % 2 === 0 ? "bg-white" : "bg-[var(--catalogue-surface)]"
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: imageFirst ? -35 : 35 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduceMotion ? 0 : 0.68, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="group relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-200 shadow-[0_32px_80px_rgba(15,23,42,.18)]">
                    <Image
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                  </div>
                  <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { rotate: [0, 6, 0], y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-4 -top-5 grid h-16 w-16 place-items-center rounded-sm bg-[var(--catalogue-accent)] text-white shadow-xl sm:-right-6 sm:h-20 sm:w-20"
                  >
                    <Icon className="h-7 w-7 sm:h-9 sm:w-9" />
                  </motion.span>
                </motion.div>

                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: reduceMotion ? 0 : 0.12 }}
                  className={`relative ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
                >
                  {service.showEyebrow !== false && (
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                      {service.eyebrow}
                    </p>
                  )}
                  <h2
                    id={`${service.slug}-title`}
                    className={`mt-5 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] ${"text-[var(--catalogue-heading)]"}`}
                  >
                    {service.title}
                  </h2>
                  <p className="mt-6 text-lg leading-8">{service.description}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1.5 ${
                        index % 2 === 0
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <Clock3 className="mr-2 h-3.5 w-3.5" /> {service.duration}
                    </Badge>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <CircleCheckBig className="h-4 w-4 text-emerald-600" /> Human-reviewed support
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.18 }}
                className="mt-12 border-t border-slate-200/80 pt-10 lg:mt-16 lg:pt-12"
              >
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                      What you receive
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[var(--catalogue-heading)]">
                      A clearer route from preparation to submission
                    </h3>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-slate-500">
                    Practical details, thoughtful review, and a process designed around your next confident step.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {service.features.map((feature) => (
                    <motion.div
                      key={feature}
                      whileHover={reduceMotion ? undefined : { y: -5 }}
                      className={`flex items-start gap-3 rounded-sm border p-4 ${
                        index % 2 === 0 ? "border-slate-200 bg-slate-50/80" : "border-slate-200 bg-white/75"
                      }`}
                    >
                      <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-[var(--catalogue-accent)]" />
                      <span className="text-sm font-semibold leading-6 text-slate-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
                  <div className="rounded-sm border border-slate-200 bg-white p-6">
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--catalogue-heading)]">
                      Your service flow
                    </p>
                    <ol className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                      {service.process.map((step, stepIndex) => (
                        <li key={step} className="flex items-start gap-3 text-sm leading-6">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--catalogue-accent)] text-[11px] font-black text-white">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex flex-col justify-between rounded-sm bg-[var(--catalogue-heading)] p-6 text-white">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-200">Expected outcome</p>
                      <p className="mt-3 text-xl font-bold leading-8">{service.outcome}</p>
                    </div>
                    <motion.a
                      href={service.ctaUrl}
                      whileHover={reduceMotion ? undefined : { x: 5 }}
                      className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-sm bg-[var(--catalogue-accent)] px-5 font-bold text-white outline-none transition hover:bg-[var(--catalogue-accent-dark)] focus-visible:ring-4 focus-visible:ring-red-200"
                    >
                      {service.ctaText} <ArrowRight className="h-4 w-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="catalogue-process-title" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
            {pageData.showProcessEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                {pageData.processEyebrow}
              </p>
            )}
            <h2
              id="catalogue-process-title"
              className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] text-[var(--catalogue-heading)]"
            >
              {pageData.processTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.processDescription}</p>
          </motion.div>

          <ol className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pageData.processSteps.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return (
                <motion.li
                  key={step.id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: reduceMotion ? 0 : index * 0.08 }}
                  className="group relative overflow-hidden rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="absolute right-5 top-3 text-6xl font-black text-slate-100 transition group-hover:text-red-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative grid h-12 w-12 place-items-center rounded-sm bg-[var(--catalogue-heading)] text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-8 text-xl font-black text-[var(--catalogue-heading)]">{step.title}</h3>
                  <p className="mt-3 leading-7">{step.description}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="catalogue-benefits-title" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[.8fr_1fr] lg:items-end">
            <div>
              {pageData.showBenefitsEyebrow && (
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                  {pageData.benefitsEyebrow}
                </p>
              )}
              <h2
                id="catalogue-benefits-title"
                className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] text-[var(--catalogue-heading)]"
              >
                {pageData.benefitsTitle}
              </h2>
            </div>
            <p className="text-lg leading-8">{pageData.benefitsDescription}</p>
          </motion.div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <motion.article
                  key={benefit.id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05 }}
                  className="group bg-white p-7 transition hover:bg-red-50/70 sm:p-8"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-sm bg-slate-100 text-slate-700 transition group-hover:bg-[var(--catalogue-accent)] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-black text-[var(--catalogue-heading)]">{benefit.title}</h3>
                  <p className="mt-3 leading-7">{benefit.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="catalogue-faq-title" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <motion.div {...reveal}>
            {pageData.showFaqEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--catalogue-accent)]">
                {pageData.faqEyebrow}
              </p>
            )}
            <h2
              id="catalogue-faq-title"
              className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] text-[var(--catalogue-heading)]"
            >
              {pageData.faqTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.faqDescription}</p>
            <div className="mt-8 rounded-sm border border-slate-200 bg-white p-5">
              <Headphones className="h-6 w-6 text-[var(--catalogue-accent)]" />
              <p className="mt-4 font-black text-[var(--catalogue-heading)]">Prefer to ask directly?</p>
              <a
                href={`mailto:${pageData.companyEmail}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--catalogue-accent)] hover:underline"
              >
                <Mail className="h-4 w-4" /> {pageData.companyEmail}
              </a>
            </div>
          </motion.div>

          <Accordion
            type="single"
            collapsible
            defaultValue={pageData.faqs[0]?.id}
            className="overflow-hidden rounded-sm border border-slate-200 bg-white px-5 shadow-sm sm:px-7"
          >
            {pageData.faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="py-5 text-left text-base font-black text-[var(--catalogue-heading)] hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-7">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section aria-labelledby="catalogue-cta-title" className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-slate-200/80 bg-white/75 px-6 py-14 text-center text-[var(--catalogue-heading)] shadow-[0_28px_80px_rgba(15,23,42,.10)] backdrop-blur-xl sm:px-10 lg:py-20"
        >
          <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full border-[54px] border-red-100/80" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full border-[64px] border-blue-100/80" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(229,34,42,.08),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(59,130,246,.08),transparent_32%)]" />
          <div className="relative mx-auto max-w-3xl">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-sm bg-red-50 text-[var(--catalogue-accent)] shadow-sm">
              <Check className="h-7 w-7" />
            </span>
            <h2
              id="catalogue-cta-title"
              className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em]"
            >
              {pageData.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--catalogue-text)]">
              {pageData.ctaDescription}
            </p>
            <motion.a
              href={pageData.ctaButtonUrl}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--catalogue-accent)] px-8 font-bold text-white shadow-[0_14px_30px_rgba(229,34,42,.22)] outline-none transition hover:bg-[var(--catalogue-accent-dark)] focus-visible:ring-4 focus-visible:ring-red-200"
            >
              {pageData.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </motion.a>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row sm:gap-6">
              <a
                href={`mailto:${pageData.companyEmail}`}
                className="inline-flex items-center gap-2 transition hover:text-[var(--catalogue-accent)]"
              >
                <Mail className="h-4 w-4" /> {pageData.companyEmail}
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 transition hover:text-[var(--catalogue-accent)]"
              >
                <Phone className="h-4 w-4" /> {pageData.companyContact}
              </a>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {pageData.companyName}
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default QueryVisaServices;
