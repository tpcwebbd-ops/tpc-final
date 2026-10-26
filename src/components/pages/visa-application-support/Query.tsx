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
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  CircleCheckBig,
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  Globe2,
  GraduationCap,
  Handshake,
  Headphones,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  PlaneTakeoff,
  Route,
  ScanSearch,
  SearchCheck,
  ShieldCheck,
  Stamp,
  UploadCloud,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import {
  defaultDataVisaApplicationSupport,
  defaultLayout,
  type IVisaApplicationSupportData,
  type VisaApplicationSupportPayload,
  type VisaApplicationSupportProps,
} from "./data";

const getPageData = (
  data?: IVisaApplicationSupportData | VisaApplicationSupportPayload | string,
): VisaApplicationSupportPayload => {
  if (!data) return { ...defaultDataVisaApplicationSupport, ...defaultLayout };
  try {
    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<VisaApplicationSupportPayload>;
    return {
      ...defaultDataVisaApplicationSupport,
      ...defaultLayout,
      ...parsed,
      pageUid: "visa-application-support-uid",
      stats: Array.isArray(parsed.stats) ? parsed.stats : defaultDataVisaApplicationSupport.stats,
      services: Array.isArray(parsed.services) ? parsed.services : defaultDataVisaApplicationSupport.services,
      processSteps: Array.isArray(parsed.processSteps)
        ? parsed.processSteps
        : defaultDataVisaApplicationSupport.processSteps,
      documentGroups: Array.isArray(parsed.documentGroups)
        ? parsed.documentGroups
        : defaultDataVisaApplicationSupport.documentGroups,
      supportLocations: Array.isArray(parsed.supportLocations)
        ? parsed.supportLocations
        : defaultDataVisaApplicationSupport.supportLocations,
      features: Array.isArray(parsed.features) ? parsed.features : defaultDataVisaApplicationSupport.features,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultDataVisaApplicationSupport.faqs,
    };
  } catch {
    return { ...defaultDataVisaApplicationSupport, ...defaultLayout };
  }
};

const serviceIcons = [SearchCheck, ListChecks, Banknote, BookOpenCheck, ClipboardCheck, MessageCircle];
const processIcons = [Handshake, Route, UploadCloud, ScanSearch, Stamp, PlaneTakeoff];
const featureIcons = [Building2, Globe2, UserCheck, CalendarCheck2, ShieldCheck, Users];

const QueryVisaApplicationSupport = ({ data }: VisaApplicationSupportProps) => {
  const pageData = getPageData(data);
  const reduceMotion = useReducedMotion();
  const [completedDocuments, setCompletedDocuments] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("wes-bangladesh-visa-checklist-v1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setCompletedDocuments(new Set(JSON.parse(saved) as string[]));
    } catch {
      // Checklist persistence is optional.
    }
  }, []);

  const toggleDocument = (id: string) => {
    setCompletedDocuments((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem("wes-bangladesh-visa-checklist-v1", JSON.stringify([...next]));
      } catch {
        // Keep the checklist interactive in restricted browsers.
      }
      return next;
    });
  };

  const totalDocuments = useMemo(
    () => pageData.documentGroups.reduce((total, group) => total + group.items.length, 0),
    [pageData.documentGroups],
  );
  const documentProgress = totalDocuments ? Math.round((completedDocuments.size / totalDocuments) * 100) : 0;

  const themeStyle = {
    "--bd-background": pageData.backgroundColor,
    "--bd-surface": pageData.surfaceColor,
    "--bd-heading": pageData.headingColor,
    "--bd-text": pageData.textColor,
    "--bd-red": pageData.accentColor,
    "--bd-green": pageData.accentDarkColor,
  } as CSSProperties;

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduceMotion ? 0 : 0.55, ease: "easeOut" as const },
  };

  return (
    <main
      style={{
        ...themeStyle,
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
      className="min-h-screen overflow-hidden bg-[var(--bd-background)] text-[var(--bd-text)] selection:bg-emerald-100 selection:text-emerald-950 custom-parent-border"
    >
      <section className="relative isolate overflow-hidden bg-white px-4 py-16 text-[var(--bd-heading)] sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_16%_18%,rgba(244,42,65,.10),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(0,106,78,.10),transparent_24%)]" />
        <div className="absolute inset-0 -z-20 opacity-[0.04] [background-image:linear-gradient(rgba(15,23,42,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.4)_1px,transparent_1px)] [background-size:52px_52px]" />
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { scale: [1, 1.07, 1], y: [0, 16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-24 -top-20 -z-10 h-96 w-96 rounded-full border-[64px] border-white/[0.045]"
        />

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -36 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.72 }}
          >
            {pageData.showHeroEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.heroEyebrow}
              </p>
            )}
            <h1 className="mt-7 max-w-4xl text-[clamp(2rem,5vw,4.7rem)] font-black leading-[0.9] tracking-[-0.065em] text-[var(--bd-heading)]">
              {pageData.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--bd-text)] sm:text-xl sm:leading-9">
              {pageData.heroDescription}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={pageData.primaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--bd-red)] px-7 font-bold text-white shadow-[0_18px_50px_rgba(244,42,65,.28)] outline-none transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-red-200/40"
              >
                {pageData.primaryButtonText} <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={pageData.secondaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center rounded-sm border border-slate-200 bg-white px-7 font-bold text-[var(--bd-heading)] shadow-sm outline-none backdrop-blur transition hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                {pageData.secondaryButtonText}
              </motion.a>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bd-red)]" /> {pageData.heroNotice}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 36, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-sm bg-white/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-sm border border-slate-200/80 bg-white/70 p-5 shadow-xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-200">Bangladesh visa desk</p>
                  <h2 className="mt-2 text-2xl font-black text-[var(--bd-heading)]">Your file at a glance</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-sm bg-emerald-50">
                  <Fingerprint className="h-6 w-6 text-[var(--bd-green)]" />
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {pageData.processSteps.slice(0, 5).map((step, index) => {
                  const Icon = processIcons[index % processIcons.length];
                  return (
                    <div
                      key={step.id}
                      className="flex items-center gap-4 rounded-sm border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-emerald-50 text-[var(--bd-green)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[var(--bd-heading)]">{step.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{step.outcome}</p>
                      </div>
                      {index === 0 ? (
                        <BadgeCheck className="h-5 w-5 text-[var(--bd-red)]" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-sm bg-white p-4 text-slate-900">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Visa guidance by</p>
                  <p className="mt-1 font-black">{pageData.companyName}</p>
                </div>
                <span className="text-3xl" aria-label="Bangladesh">
                  🇧🇩
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        aria-label="Visa support statistics"
        className="border-b border-emerald-100 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-emerald-100 dark:divide-slate-800 lg:grid-cols-4">
          {pageData.stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.06 }}
              className="px-3 py-7 text-center sm:px-6 sm:py-9"
            >
              <p className="text-2xl font-black tracking-tight text-[var(--bd-green)] dark:text-emerald-300 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            {pageData.showServicesEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.servicesEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)] dark:text-white">
              {pageData.servicesTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.servicesDescription}</p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pageData.services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <motion.article
                  key={service.id}
                  {...reveal}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -7 }}
                  className="group relative overflow-hidden rounded-sm border border-emerald-100 bg-[var(--bd-surface)] p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-sm bg-emerald-50 transition group-hover:bg-red-50" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-sm bg-[var(--bd-green)] text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-7 text-xl font-black text-[var(--bd-heading)] dark:text-white">
                    {service.title}
                  </h3>
                  <p className="relative mt-3 leading-7">{service.description}</p>
                  <p className="relative mt-6 flex items-start gap-2 border-t border-emerald-100 pt-5 text-sm font-bold text-[var(--bd-green)] dark:border-slate-800 dark:text-emerald-300">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0" /> {service.highlight}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="visa-process"
        className="scroll-mt-24 bg-[var(--bd-surface)] px-4 py-20 text-[var(--bd-text)] sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...reveal} className="lg:sticky lg:top-24 lg:self-start">
            {pageData.showProcessEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.processEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)]">
              {pageData.processTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-[var(--bd-text)]">{pageData.processDescription}</p>
          </motion.div>

          <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-[1.5rem] before:top-8 before:w-px before:bg-emerald-200 sm:before:left-[2rem]">
            {pageData.processSteps.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return (
                <motion.li
                  key={step.id}
                  initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
                  className="relative flex gap-4 rounded-sm border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:gap-6 sm:p-6"
                >
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-emerald-200 bg-white text-[var(--bd-red)] sm:h-16 sm:w-16">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <div className="min-w-0 pt-1 sm:pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-[var(--bd-heading)] sm:text-2xl">{step.title}</h3>
                      {/* <Badge className="border border-emerald-100 bg-emerald-50 text-[var(--bd-green)]">
                        {step.outcome}
                      </Badge> */}
                    </div>
                    <p className="mt-3 leading-7 text-[var(--bd-text)]">{step.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...reveal} className="lg:sticky lg:top-24 lg:self-start">
            {pageData.showDocumentsEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.documentsEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)] dark:text-white">
              {pageData.documentsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.documentsDescription}</p>
            <div className="mt-8 rounded-sm bg-[var(--bd-green)] p-6 text-white shadow-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-50/65">Documents prepared</p>
                  <p className="mt-1 text-4xl font-black">{documentProgress}%</p>
                </div>
                <p className="text-sm font-bold text-emerald-50/75">
                  {completedDocuments.size}/{totalDocuments}
                </p>
              </div>
              <div
                className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Bangladesh student visa document progress"
                aria-valuenow={documentProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="h-full rounded-full bg-[var(--bd-red)]"
                  animate={{ width: `${documentProgress}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.45 }}
                />
              </div>
            </div>
          </motion.div>

          <Accordion
            type="multiple"
            defaultValue={[pageData.documentGroups[0]?.id].filter(Boolean)}
            className="overflow-hidden rounded-sm border border-emerald-100 bg-white px-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7"
          >
            {pageData.documentGroups.map((group, groupIndex) => {
              const ready = group.items.filter((_, itemIndex) =>
                completedDocuments.has(`${group.id}-${itemIndex}`),
              ).length;
              const icons = [Fingerprint, GraduationCap, WalletCards, FileCheck2];
              const Icon = icons[groupIndex % icons.length];
              return (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-emerald-50 text-[var(--bd-green)] dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-black text-[var(--bd-heading)] dark:text-white">{group.title}</span>
                        <span className="mt-1 block text-xs font-medium text-slate-500">
                          {ready} of {group.items.length} prepared
                        </span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="mb-4 leading-7">{group.description}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((item, itemIndex) => {
                        const id = `${group.id}-${itemIndex}`;
                        const checked = completedDocuments.has(id);
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 transition ${
                              checked
                                ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30"
                                : "border-slate-200 bg-slate-50/70 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-950"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleDocument(id)}
                              aria-label={`Mark ${item} as ${checked ? "not prepared" : "prepared"}`}
                              className="mt-0.5"
                            />
                            <span
                              className={checked ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"}
                            >
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
            {pageData.showLocationsEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.locationsEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)] dark:text-white">
              {pageData.locationsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.locationsDescription}</p>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.supportLocations.map((location, index) => (
              <motion.article
                key={location.id}
                {...reveal}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05 }}
                className="group rounded-sm border border-emerald-100 bg-emerald-50/40 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-sm bg-[var(--bd-green)] text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--bd-red)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-black text-[var(--bd-heading)] dark:text-white">{location.city}</h3>
                <p className="mt-2 font-bold text-[var(--bd-green)] dark:text-emerald-300">{location.mode}</p>
                <p className="mt-3 leading-7">{location.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            {pageData.showFeaturesEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.featuresEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)] dark:text-white">
              {pageData.featuresTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.featuresDescription}</p>
          </motion.div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-emerald-100 bg-emerald-100 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.features.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <motion.article
                  key={feature.id}
                  {...reveal}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05 }}
                  className="group bg-white p-6 transition hover:bg-emerald-50/70 dark:bg-slate-900 dark:hover:bg-emerald-950/20 sm:p-8"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-sm bg-emerald-50 text-[var(--bd-green)] transition group-hover:bg-[var(--bd-green)] group-hover:text-white dark:bg-slate-800 dark:text-emerald-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-black text-[var(--bd-heading)] dark:text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...reveal}>
            {pageData.showFaqEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.faqEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--bd-heading)] dark:text-white">
              {pageData.faqTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.faqDescription}</p>
            <div className="mt-8 rounded-sm border border-emerald-100 bg-emerald-50/50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <Headphones className="h-6 w-6 text-[var(--bd-green)] dark:text-emerald-300" />
              <p className="mt-4 font-black text-[var(--bd-heading)] dark:text-white">Ask Site</p>
              <a
                href={`mailto:${pageData.companyEmail}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--bd-red)] hover:underline"
              >
                <Mail className="h-4 w-4" /> {pageData.companyEmail}
              </a>
            </div>
          </motion.div>

          <Accordion
            type="single"
            collapsible
            defaultValue={pageData.faqs[0]?.id}
            className="overflow-hidden rounded-sm border border-emerald-100 bg-white px-5 dark:border-slate-800 dark:bg-slate-900 sm:px-7"
          >
            {pageData.faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="py-5 text-left text-base font-black text-[var(--bd-heading)] hover:no-underline dark:text-white sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-7">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-slate-200/80 bg-white/75 px-6 py-14 text-center text-[var(--bd-heading)] shadow-[0_28px_80px_rgba(15,23,42,.10)] backdrop-blur-xl sm:px-10 lg:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-sm border-[50px] border-emerald-100/80" />
          <div className="pointer-events-none absolute -bottom-36 -right-20 h-80 w-80 rounded-sm bg-red-100/60 blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,106,78,.08),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(244,42,65,.08),transparent_32%)]" />
          <div className="relative mx-auto max-w-3xl">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-sm bg-emerald-50 text-[var(--bd-green)]">
              <BriefcaseBusiness className="h-7 w-7" />
            </span>
            {pageData.showCtaEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--bd-red)]">
                {pageData.ctaEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.055em]">
              {pageData.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--bd-text)]">{pageData.ctaDescription}</p>
            <motion.a
              href={pageData.ctaButtonUrl}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--bd-red)] px-8 font-bold text-white outline-none shadow-xl transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-red-200/40"
            >
              {pageData.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </motion.a>
            <p className="mt-6 text-sm text-slate-500">
              {pageData.companyName} · {pageData.companyContact} · {pageData.officeAddress}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="sr-only" aria-live="polite">
        Bangladesh visa document checklist {documentProgress}% complete.
      </div>
    </main>
  );
};

export default QueryVisaApplicationSupport;
