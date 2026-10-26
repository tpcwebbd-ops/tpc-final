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
  BrainCircuit,
  BriefcaseBusiness,
  CircleCheckBig,
  ClipboardCheck,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  HandCoins,
  Headphones,
  HeartHandshake,
  Lightbulb,
  ListChecks,
  Mail,
  MapPinned,
  MessageCircle,
  MessagesSquare,
  PlaneTakeoff,
  Quote,
  Route,
  Scale,
  SearchCheck,
  ShieldCheck,
  Target,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import {
  defaultDataVisaConsultancy,
  defaultLayout,
  type IVisaConsultancyData,
  type VisaConsultancyPayload,
  type VisaConsultancyProps,
} from "./data";

const getPageData = (data?: IVisaConsultancyData | VisaConsultancyPayload | string): VisaConsultancyPayload => {
  if (!data) return { ...defaultDataVisaConsultancy, ...defaultLayout };
  try {
    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<VisaConsultancyPayload>;
    return {
      ...defaultDataVisaConsultancy,
      ...defaultLayout,
      ...parsed,
      pageUid: "visa-consultancy-uid",
      stats: Array.isArray(parsed.stats) ? parsed.stats : defaultDataVisaConsultancy.stats,
      services: Array.isArray(parsed.services) ? parsed.services : defaultDataVisaConsultancy.services,
      journeySteps: Array.isArray(parsed.journeySteps) ? parsed.journeySteps : defaultDataVisaConsultancy.journeySteps,
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : defaultDataVisaConsultancy.destinations,
      readinessGroups: Array.isArray(parsed.readinessGroups)
        ? parsed.readinessGroups
        : defaultDataVisaConsultancy.readinessGroups,
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : defaultDataVisaConsultancy.benefits,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultDataVisaConsultancy.testimonials,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultDataVisaConsultancy.faqs,
    };
  } catch {
    return { ...defaultDataVisaConsultancy, ...defaultLayout };
  }
};

const serviceIcons = [SearchCheck, Compass, GraduationCap, HandCoins, FileCheck2, MessagesSquare];
const journeyIcons = [MessageCircle, BrainCircuit, Route, ClipboardCheck, BadgeCheck, PlaneTakeoff];
const benefitIcons = [Scale, Target, Users, ListChecks, Lightbulb, ShieldCheck];

const QueryVisaConsultancy = ({ data }: VisaConsultancyProps) => {
  const pageData = getPageData(data);
  const reduceMotion = useReducedMotion();
  const [readyItems, setReadyItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("wes-consultancy-readiness-v1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setReadyItems(new Set(JSON.parse(saved) as string[]));
    } catch {
      // Readiness persistence is optional.
    }
  }, []);

  const toggleReadyItem = (id: string) => {
    setReadyItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem("wes-consultancy-readiness-v1", JSON.stringify([...next]));
      } catch {
        // Keep the planner usable when storage is unavailable.
      }
      return next;
    });
  };

  const totalReadinessItems = useMemo(
    () => pageData.readinessGroups.reduce((total, group) => total + group.items.length, 0),
    [pageData.readinessGroups],
  );
  const readinessProgress = totalReadinessItems ? Math.round((readyItems.size / totalReadinessItems) * 100) : 0;

  const themeStyle = {
    "--consult-background": pageData.backgroundColor,
    "--consult-surface": pageData.surfaceColor,
    "--consult-heading": pageData.headingColor,
    "--consult-text": pageData.textColor,
    "--consult-accent": pageData.accentColor,
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
      className="min-h-screen overflow-hidden bg-[var(--consult-background)] text-[var(--consult-text)] selection:bg-red-100 selection:text-red-950 custom-parent-border"
    >
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="absolute inset-0 -z-30 bg-gradient-to-b from-white via-slate-50/60 to-white" />
        <div className="absolute inset-0 -z-20 opacity-60 [background-image:linear-gradient(rgba(23,32,51,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(23,32,51,.035)_1px,transparent_1px)] [background-size:56px_56px]" />
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { rotate: [0, 5, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-28 top-16 -z-10 h-96 w-96 rounded-full border-[60px] border-red-100/50"
        />

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -36 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.72 }}
          >
            {pageData.showHeroEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.eyebrow}
              </p>
            )}
            <h1 className="mt-7 max-w-4xl text-[clamp(3rem,7vw,6.8rem)] font-black leading-[0.89] tracking-[-0.067em] text-[var(--consult-heading)]">
              {pageData.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 sm:text-xl sm:leading-9">{pageData.heroDescription}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={pageData.primaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--consult-accent)] px-7 font-bold text-white shadow-[0_18px_50px_rgba(235,34,41,.25)] outline-none transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-red-200"
              >
                {pageData.primaryButtonText} <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={pageData.secondaryButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center rounded-sm border border-slate-300 bg-white px-7 font-bold text-[var(--consult-heading)] outline-none transition hover:border-slate-400 focus-visible:ring-4 focus-visible:ring-slate-200"
              >
                {pageData.secondaryButtonText}
              </motion.a>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--consult-accent)]" /> {pageData.heroNote}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 36, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-sm bg-slate-100/70 blur-2xl" />
            <div className="relative overflow-hidden rounded-sm border border-slate-200 bg-white p-6 text-[var(--consult-text)] shadow-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[var(--consult-heading)]">Your decisions, connected</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-sm bg-slate-100 text-[var(--consult-accent)]">
                  <HeartHandshake className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  ["Study goal", "Clear direction", GraduationCap],
                  ["Destination", "Evidence-led fit", Globe2],
                  ["Funding", "Realistic plan", WalletCards],
                  ["Visa file", "Consistent evidence", FileCheck2],
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                    <Icon className="h-5 w-5 text-[var(--consult-accent)]" />
                    <p className="mt-4 text-xs font-semibold text-slate-500">{label as string}</p>
                    <p className="mt-1 font-black text-[var(--consult-heading)]">{value as string}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-sm bg-white p-4 text-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Your consultancy partner</p>
                    <p className="mt-1 font-black">{pageData.companyName}</p>
                  </div>
                  <BadgeCheck className="h-7 w-7 text-[var(--consult-accent)]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        aria-label="Visa consultancy highlights"
        className="border-y border-slate-200 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 lg:grid-cols-4">
          {pageData.stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.06 }}
              className="px-3 py-7 text-center sm:px-6 sm:py-9"
            >
              <p className="text-2xl font-black text-[var(--consult-heading)] sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="consultancy-services" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            {pageData.showServicesEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.servicesEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
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
                  className="group rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-red-200 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-sm bg-slate-100 text-[var(--consult-heading)] transition group-hover:bg-[var(--consult-accent)] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-7 text-xl font-black text-[var(--consult-heading)]">{service.title}</h3>
                  <p className="mt-3 leading-7">{service.description}</p>
                  <p className="mt-6 flex items-start gap-2 border-t border-slate-200 pt-5 text-sm font-bold text-[var(--consult-accent)]">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0" /> {service.outcome}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
            {pageData.showJourneyEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.journeyEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.journeyTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{pageData.journeyDescription}</p>
          </motion.div>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pageData.journeySteps.map((step, index) => {
              const Icon = journeyIcons[index % journeyIcons.length];
              return (
                <motion.li
                  key={step.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
                  className="relative overflow-hidden rounded-sm border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="absolute right-5 top-4 text-5xl font-black text-slate-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative grid h-12 w-12 place-items-center rounded-sm bg-red-50 text-[var(--consult-accent)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-black text-[var(--consult-heading)]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            {pageData.showDestinationsEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.destinationsEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.destinationsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.destinationsDescription}</p>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.destinations.map((destination, index) => (
              <motion.article
                key={destination.id}
                {...reveal}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
                className="group rounded-sm border border-slate-200 bg-slate-50/60 p-6 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-sm bg-white text-3xl shadow-sm"
                    aria-hidden="true"
                  >
                    {destination.flag}
                  </span>
                  <MapPinned className="h-5 w-5 text-slate-300 transition group-hover:text-[var(--consult-accent)]" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-[var(--consult-heading)]">{destination.country}</h3>
                <p className="mt-2 font-bold text-[var(--consult-accent)]">{destination.focus}</p>
                <p className="mt-4 leading-7">{destination.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...reveal} className="lg:sticky lg:top-24 lg:self-start">
            {pageData.showReadinessEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.readinessEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.readinessTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.readinessDescription}</p>
            <div className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-6 text-[var(--consult-heading)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Consultation readiness</p>
                  <p className="mt-1 text-4xl font-black">{readinessProgress}%</p>
                </div>
                <p className="text-sm font-bold text-slate-300">
                  {readyItems.size}/{totalReadinessItems}
                </p>
              </div>
              <div
                className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-label="Consultation readiness progress"
                aria-valuenow={readinessProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="h-full rounded-full bg-[var(--consult-accent)]"
                  animate={{ width: `${readinessProgress}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.45 }}
                />
              </div>
            </div>
          </motion.div>

          <Accordion
            type="multiple"
            defaultValue={[pageData.readinessGroups[0]?.id].filter(Boolean)}
            className="overflow-hidden rounded-sm border border-slate-200 bg-white px-5 shadow-sm sm:px-7"
          >
            {pageData.readinessGroups.map((group, groupIndex) => {
              const ready = group.items.filter((_, itemIndex) => readyItems.has(`${group.id}-${itemIndex}`)).length;
              const icons = [Compass, GraduationCap, Banknote, BriefcaseBusiness];
              const Icon = icons[groupIndex % icons.length];
              return (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-red-50 text-[var(--consult-accent)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-black text-[var(--consult-heading)]">{group.title}</span>
                        <span className="mt-1 block text-xs font-medium text-slate-500">
                          {ready} of {group.items.length} available
                        </span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="mb-4 leading-7">{group.description}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((item, itemIndex) => {
                        const id = `${group.id}-${itemIndex}`;
                        const checked = readyItems.has(id);
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 transition ${checked ? "border-emerald-200 bg-emerald-50/80" : "border-slate-200 bg-slate-50/70 hover:border-red-200"}`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleReadyItem(id)}
                              aria-label={`Mark ${item} as ${checked ? "not available" : "available"}`}
                              className="mt-0.5"
                            />
                            <span className={checked ? "text-slate-400 line-through" : "text-slate-700"}>{item}</span>
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

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-3xl">
            {pageData.showBenefitsEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.benefitsEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.benefitsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">{pageData.benefitsDescription}</p>
          </motion.div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <motion.article
                  key={benefit.id}
                  {...reveal}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05 }}
                  className="group bg-white p-6 transition hover:bg-slate-50 sm:p-8"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-sm bg-red-50 text-[var(--consult-accent)] transition group-hover:bg-[var(--consult-accent)] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-black text-[var(--consult-heading)]">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{benefit.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
            {pageData.showStoriesEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.storiesEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,4.8rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.storiesTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.storiesDescription}</p>
          </motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pageData.testimonials.map((story, index) => (
              <motion.figure
                key={story.id}
                {...reveal}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.08 }}
                className="relative rounded-sm border border-slate-200 bg-slate-50/60 p-7"
              >
                <Quote className="h-9 w-9 text-red-200" />
                <blockquote className="mt-6 text-lg font-semibold leading-8 text-[var(--consult-heading)]">
                  “{story.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-slate-200 pt-5">
                  <p className="font-black text-[var(--consult-heading)]">{story.name}</p>
                  <p className="mt-1 text-sm text-[var(--consult-accent)]">{story.journey}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...reveal}>
            {pageData.showFaqEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.faqEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.97] tracking-[-0.055em] text-[var(--consult-heading)]">
              {pageData.faqTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.faqDescription}</p>
            <div className="mt-8 rounded-sm border border-slate-200 bg-white p-5">
              <Headphones className="h-6 w-6 text-[var(--consult-accent)]" />
              <p className="mt-4 font-black text-[var(--consult-heading)]">Ask a consultant</p>
              <a
                href={`mailto:${pageData.companyEmail}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--consult-accent)] hover:underline"
              >
                <Mail className="h-4 w-4" /> {pageData.companyEmail}
              </a>
            </div>
          </motion.div>
          <Accordion
            type="single"
            collapsible
            defaultValue={pageData.faqs[0]?.id}
            className="overflow-hidden rounded-sm border border-slate-200 bg-white px-5 sm:px-7"
          >
            {pageData.faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="py-5 text-left text-base font-black text-[var(--consult-heading)] hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-7">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-slate-200 bg-slate-50 px-6 py-14 text-center text-[var(--consult-heading)] shadow-sm sm:px-10 lg:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full border-[50px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full border-[55px] border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <HeartHandshake className="mx-auto h-11 w-11" />
            {pageData.showCtaEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--consult-accent)]">
                {pageData.ctaEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.055em]">
              {pageData.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">{pageData.ctaDescription}</p>
            <motion.a
              href={pageData.ctaButtonUrl}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--consult-accent)] px-8 font-bold text-white outline-none transition focus-visible:ring-4 focus-visible:ring-red-200"
            >
              {pageData.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </motion.a>
            <p className="mt-6 text-sm text-slate-500">
              {pageData.companyName} · {pageData.companyContact}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="sr-only" aria-live="polite">
        Consultation readiness {readinessProgress}% complete.
      </div>
    </main>
  );
};

export default QueryVisaConsultancy;
