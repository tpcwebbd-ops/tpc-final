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
import {
  ArrowRight,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileCheck2,
  FileText,
  GraduationCap,
  Headphones,
  Landmark,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  defaultDataVisaRequirements,
  defaultLayout,
  type DownloadResource,
  type IVisaRequirementsData,
  type VisaRequirementsPayload,
  type VisaRequirementsProps,
  type VisaCountry,
} from "./data";

const normalizeDownloads = (downloads?: DownloadResource[]): DownloadResource[] => {
  if (!Array.isArray(downloads)) return defaultDataVisaRequirements.downloads;

  return downloads.map((resource, index) => {
    const fallback =
      defaultDataVisaRequirements.downloads.find((item) => item.id === resource.id) ||
      defaultDataVisaRequirements.downloads[index];
    return {
      ...fallback,
      ...resource,
      content: Array.isArray(resource.content) ? resource.content : fallback?.content || [resource.description],
    };
  });
};

const toPdfFileName = (value: string) =>
  `${
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "wes-associates-guide"
  }.pdf`;

const getPageData = (data?: IVisaRequirementsData | VisaRequirementsPayload | string): VisaRequirementsPayload => {
  if (!data) return { ...defaultDataVisaRequirements, ...defaultLayout };
  try {
    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as Partial<VisaRequirementsPayload>;
    return {
      ...defaultDataVisaRequirements,
      ...defaultLayout,
      ...parsed,
      pageUid: "visa-requirements-uid",
      backgroundColor: parsed.backgroundColor === "#f6f7f2" ? "#ffffff" : parsed.backgroundColor || "#ffffff",
      headingColor: parsed.headingColor?.toLowerCase() === "#132a24" ? "#251214" : parsed.headingColor || "#251214",
      textColor: parsed.textColor?.toLowerCase() === "#52645e" ? "#625457" : parsed.textColor || "#625457",
      accentColor: parsed.accentColor?.toLowerCase() === "#e76f51" ? "#EB2229" : parsed.accentColor || "#EB2229",
      accentDarkColor: "#EC1F29",
      countries: Array.isArray(parsed.countries) ? parsed.countries : defaultDataVisaRequirements.countries,
      requirementSections: Array.isArray(parsed.requirementSections)
        ? parsed.requirementSections
        : defaultDataVisaRequirements.requirementSections,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : defaultDataVisaRequirements.timeline,
      checklistGroups: Array.isArray(parsed.checklistGroups)
        ? parsed.checklistGroups
        : defaultDataVisaRequirements.checklistGroups,
      downloads: normalizeDownloads(parsed.downloads),
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultDataVisaRequirements.faqs,
    };
  } catch {
    return { ...defaultDataVisaRequirements, ...defaultLayout };
  }
};

const unique = (values: Array<string | undefined>) => [
  ...new Set(values.filter((value): value is string => Boolean(value))),
];
const allValue = "All";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterSelect = ({ label, value, options, onChange }: FilterSelectProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full rounded-sm border-slate-200 bg-white text-slate-700 shadow-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const factItems = [
  { key: "tuitionRange", label: "Tuition", icon: GraduationCap },
  { key: "processingTime", label: "Processing", icon: CalendarClock },
  { key: "requiredFunds", label: "Required funds", icon: WalletCards },
  { key: "workHours", label: "Work rights", icon: BriefcaseBusiness },
] as const;

const QueryVisaRequirements = ({ data }: VisaRequirementsProps) => {
  const pageData = getPageData(data);
  const reduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [studyLevel, setStudyLevel] = useState(allValue);
  const [visaType, setVisaType] = useState(allValue);
  const [english, setEnglish] = useState(allValue);
  const [tuition, setTuition] = useState(allValue);
  const [processing, setProcessing] = useState(allValue);
  const [finance, setFinance] = useState(allValue);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<VisaCountry | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [downloadingResourceId, setDownloadingResourceId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("wes-visa-checklist-v1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setCompleted(new Set(JSON.parse(saved) as string[]));
    } catch {
      // Local progress is optional.
    }
  }, []);

  const toggleChecklist = (id: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem("wes-visa-checklist-v1", JSON.stringify([...next]));
      } catch {
        // The checklist remains usable when browser storage is unavailable.
      }
      return next;
    });
  };

  const downloadResourcePdf = async (resource: DownloadResource) => {
    setDownloadingResourceId(resource.id);
    setDownloadError("");

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = 0;

      const addPageHeader = () => {
        pdf.setFillColor(235, 34, 41);
        pdf.rect(0, 0, pageWidth, 8, "F");
        pdf.setTextColor(37, 18, 20);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(pageData.downloadCompanyName, margin, 20);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(98, 84, 87);
        pdf.text(`Email: ${pageData.downloadCompanyEmail}`, margin, 27);
        pdf.text(`Contact: ${pageData.downloadCompanyContact}`, margin, 32);
        pdf.setDrawColor(226, 220, 221);
        pdf.line(margin, 38, pageWidth - margin, 38);
        cursorY = 49;
      };

      const ensureSpace = (requiredHeight: number) => {
        if (cursorY + requiredHeight <= pageHeight - 22) return;
        pdf.addPage();
        addPageHeader();
      };

      addPageHeader();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(37, 18, 20);
      const titleLines = pdf.splitTextToSize(resource.title, contentWidth) as string[];
      pdf.text(titleLines, margin, cursorY);
      cursorY += titleLines.length * 9 + 3;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(98, 84, 87);
      const descriptionLines = pdf.splitTextToSize(resource.description, contentWidth) as string[];
      pdf.text(descriptionLines, margin, cursorY);
      cursorY += descriptionLines.length * 6 + 8;

      pdf.setFillColor(252, 244, 244);
      pdf.roundedRect(margin, cursorY, contentWidth, 13, 2, 2, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(235, 34, 41);
      pdf.text("PLANNING CHECKLIST", margin + 5, cursorY + 8.5);
      cursorY += 21;

      const content = resource.content.length > 0 ? resource.content : [resource.description];
      content.forEach((item, index) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10.5);
        const itemLines = pdf.splitTextToSize(`${index + 1}. ${item}`, contentWidth - 3) as string[];
        const itemHeight = itemLines.length * 5.5 + 5;
        ensureSpace(itemHeight);
        pdf.setTextColor(55, 48, 50);
        pdf.text(itemLines, margin + 1, cursorY);
        cursorY += itemHeight;
      });

      ensureSpace(24);
      cursorY += 3;
      pdf.setDrawColor(235, 34, 41);
      pdf.setLineWidth(0.6);
      pdf.line(margin, cursorY, margin + 24, cursorY);
      cursorY += 8;
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8.5);
      pdf.setTextColor(110, 100, 102);
      const notice = pdf.splitTextToSize(
        "Indicative planning information only. Confirm current rules, fees, and evidence with the official immigration authority and relevant embassy before applying.",
        contentWidth,
      ) as string[];
      pdf.text(notice, margin, cursorY);

      const pageCount = pdf.getNumberOfPages();
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        pdf.setPage(pageNumber);
        pdf.setDrawColor(226, 220, 221);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(120, 110, 112);
        pdf.text(
          `${pageData.downloadCompanyName} | ${pageData.downloadCompanyEmail} | ${pageData.downloadCompanyContact}`,
          margin,
          pageHeight - 9,
        );
        pdf.text(`${pageNumber} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
      }

      pdf.save(toPdfFileName(resource.title));
    } catch (error) {
      console.error("Unable to generate the PDF download.", error);
      setDownloadError("The PDF could not be prepared. Please try again.");
    } finally {
      setDownloadingResourceId(null);
    }
  };

  const filterOptions = useMemo(
    () => ({
      studyLevels: unique(pageData.countries.flatMap((item) => item.studyLevels || [])),
      visaTypes: unique(pageData.countries.map((item) => item.visaType)),
      english: unique(pageData.countries.map((item) => item.englishRequirement)),
      tuition: unique(pageData.countries.map((item) => item.tuitionBand)),
      processing: unique(pageData.countries.map((item) => item.processingBand)),
      finance: unique(pageData.countries.map((item) => item.financialBand)),
    }),
    [pageData.countries],
  );

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pageData.countries.filter(
      (item) =>
        (!term || item.name.toLowerCase().includes(term)) &&
        (studyLevel === allValue || item.studyLevels?.includes(studyLevel)) &&
        (visaType === allValue || item.visaType === visaType) &&
        (english === allValue || item.englishRequirement === english) &&
        (tuition === allValue || item.tuitionBand === tuition) &&
        (processing === allValue || item.processingBand === processing) &&
        (finance === allValue || item.financialBand === finance),
    );
  }, [english, finance, pageData.countries, processing, search, studyLevel, tuition, visaType]);

  const filteredFaqs = useMemo(() => {
    const term = faqSearch.trim().toLowerCase();
    return pageData.faqs.filter((item) => !term || `${item.question} ${item.answer}`.toLowerCase().includes(term));
  }, [faqSearch, pageData.faqs]);

  const totalChecklistItems = pageData.checklistGroups.reduce((total, group) => total + group.items.length, 0);
  const completedCount = pageData.checklistGroups.reduce(
    (total, group) => total + group.items.filter((_, index) => completed.has(`${group.id}-${index}`)).length,
    0,
  );
  const progress = totalChecklistItems ? Math.round((completedCount / totalChecklistItems) * 100) : 0;
  const hasFilters = [search, studyLevel, visaType, english, tuition, processing, finance].some(
    (value) => value && value !== allValue,
  );

  const clearFilters = () => {
    setSearch("");
    setStudyLevel(allValue);
    setVisaType(allValue);
    setEnglish(allValue);
    setTuition(allValue);
    setProcessing(allValue);
    setFinance(allValue);
  };

  const themeStyle = {
    "--visa-background": pageData.backgroundColor,
    "--visa-surface": pageData.surfaceColor,
    "--visa-heading": pageData.headingColor,
    "--visa-text": pageData.textColor,
    "--visa-accent": pageData.accentColor,
    "--visa-accent-dark": pageData.accentDarkColor,
  } as CSSProperties;

  return (
    <main
      className="overflow-hidden bg-[var(--visa-background)] text-[var(--visa-text)] dark:bg-slate-950 dark:text-slate-300 custom-parent-border"
      style={{
        ...themeStyle,
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
    >
      <section className="relative isolate min-h-[720px] overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div
          className="pointer-events-none absolute -right-24 top-10 -z-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: "var(--visa-accent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 -z-20 h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "var(--visa-accent-dark)" }}
        />
        {[
          { top: "12%", left: "8%", size: 9 },
          { top: "20%", right: "12%", size: 15 },
          { bottom: "20%", left: "18%", size: 12 },
          { bottom: "12%", right: "22%", size: 8 },
        ].map((dot, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className="absolute -z-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
            style={{ ...dot, width: dot.size * 4, height: dot.size * 4 }}
            animate={reduceMotion ? undefined : { y: [0, index % 2 ? 18 : -18, 0], rotate: [0, 18, 0] }}
            transition={{ duration: 5.5 + index, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="mx-auto flex min-h-[520px] w-full max-w-7xl items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl rounded-sm border border-white/80 bg-white/75 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-10 lg:p-14"
            style={{
              background: "linear-gradient(135deg, var(--visa-surface), #ffffffd9)",
              boxShadow: "0 28px 80px color-mix(in srgb, var(--visa-accent) 12%, transparent)",
            }}
          >
            {pageData.showEyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Sparkles className="h-4 w-4 text-[var(--visa-accent)]" /> {pageData.eyebrow}
              </span>
            )}
            <h1 className="mt-7 max-w-4xl text-[clamp(3.25rem,8vw,7.2rem)] font-black leading-[0.88] tracking-[-0.07em] text-[var(--visa-heading)]">
              {pageData.heroTitle}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--visa-text)] sm:text-xl sm:leading-9">
              {pageData.heroDescription}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={pageData.exploreButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--visa-accent)] px-7 font-bold text-white shadow-[0_18px_50px_rgba(235,34,41,.2)] outline-none transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-red-200"
              >
                {pageData.exploreButtonText} <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={pageData.checklistButtonUrl}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm border border-[var(--visa-accent)]/30 bg-white/50 px-7 font-bold text-[var(--visa-accent-dark)] backdrop-blur outline-none transition hover:bg-white focus-visible:ring-4 focus-visible:ring-red-200"
              >
                <Download className="h-4 w-4" /> {pageData.checklistButtonText}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="countries" className="scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.7rem)] font-black leading-[0.98] tracking-[-0.055em] text-[var(--visa-heading)] dark:text-white">
              {pageData.countriesTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8">{pageData.countriesDescription}</p>
          </div>

          <div className="mt-10 rounded-sm border border-slate-200/80 bg-white p-4 shadow-[0_20px_70px_rgba(16,44,36,.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={pageData.searchPlaceholder}
                aria-label="Search countries"
                className="h-14 rounded-sm border-slate-200 bg-slate-50 pl-12 text-base dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">
                <strong className="text-[var(--visa-heading)] dark:text-white">{filteredCountries.length}</strong>{" "}
                countries match your plan
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => setFiltersOpen((open) => !open)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {filtersOpen ? "Hide filters" : "Show filters"}
              </Button>
            </div>
            {filtersOpen && (
              <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <FilterSelect
                    label="Study level"
                    value={studyLevel}
                    options={filterOptions.studyLevels}
                    onChange={setStudyLevel}
                  />
                  <FilterSelect
                    label="Visa type"
                    value={visaType}
                    options={filterOptions.visaTypes}
                    onChange={setVisaType}
                  />
                  <FilterSelect label="English" value={english} options={filterOptions.english} onChange={setEnglish} />
                  <FilterSelect
                    label="Tuition fee"
                    value={tuition}
                    options={filterOptions.tuition}
                    onChange={setTuition}
                  />
                  <FilterSelect
                    label="Processing"
                    value={processing}
                    options={filterOptions.processing}
                    onChange={setProcessing}
                  />
                  <FilterSelect label="Funds" value={finance} options={filterOptions.finance} onChange={setFinance} />
                </div>
                {hasFilters && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
                    <RotateCcw className="mr-2 h-4 w-4" /> Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {filteredCountries.length > 0 ? (
            <div className="mt-9 grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredCountries.map((item, index) => (
                <motion.article
                  key={item.id || item.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05 }}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  className="group flex h-full flex-col rounded-sm border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_rgba(16,44,36,.05)] transition-shadow hover:shadow-[0_24px_60px_rgba(16,44,36,.12)] dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <span
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-sm bg-slate-100 text-3xl shadow-inner dark:bg-slate-800"
                        aria-hidden="true"
                      >
                        {item.flag}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-black tracking-[-0.035em] text-[var(--visa-heading)] dark:text-white">
                          {item.name}
                        </h3>
                        <p className="mt-1 truncate text-sm">{item.visaType}</p>
                      </div>
                    </div>
                    {item.successRate && (
                      <Badge className="shrink-0 border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {item.successRate}
                      </Badge>
                    )}
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-slate-100 py-5 dark:border-slate-800">
                    {factItems.map(({ key, label, icon: Icon }) => (
                      <div key={key}>
                        <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </dt>
                        <dd className="mt-1.5 text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">
                          {item[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">PR opportunity</p>
                      <p className="mt-1 text-sm font-bold text-[var(--visa-heading)] dark:text-white">
                        {item.prOpportunity}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setSelectedCountry(item)}
                      className="shrink-0 rounded-sm bg-[var(--visa-accent-dark)] text-white hover:brightness-110"
                    >
                      View <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-9 rounded-sm border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/60">
              <Search className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-5 text-2xl font-black text-[var(--visa-heading)] dark:text-white">
                {pageData.emptyStateTitle}
              </h3>
              <p className="mt-2">{pageData.emptyStateDescription}</p>
              <Button type="button" variant="outline" onClick={clearFilters} className="mt-6">
                <RotateCcw className="mr-2 h-4 w-4" /> Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(selectedCountry)}
        onOpenChange={(open) => {
          if (!open) setSelectedCountry(null);
        }}
      >
        <DialogContent className="flex max-h-[calc(100dvh-6rem)] w-full max-w-6xl flex-col gap-0 overflow-hidden rounded-sm border-0 bg-white p-0 dark:bg-slate-950 sm:w-full md:min-w-5xl md:w-3xl mt-10">
          {selectedCountry && (
            <>
              <DialogHeader className="border-b border-slate-200 bg-[var(--visa-accent-dark)] text-slate-900/50 md:p-4 pr-14 text-left dark:border-slate-800 sm:p-2">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-16 w-16 place-items-center rounded-sm bg-white/10 text-4xl text-slate-900"
                    aria-hidden="true"
                  >
                    {selectedCountry.flag}
                  </span>
                  <div>
                    <DialogTitle className="md:text-3xl font-black tracking-[-0.04em] sm:text-xl text-slate-700/90">
                      {selectedCountry.name} student visa
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-slate-600/70">
                      {selectedCountry.visaType} · {selectedCountry.processingTime}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Tuition", selectedCountry.tuitionRange],
                    ["Funds", selectedCountry.requiredFunds],
                    ["Work", selectedCountry.workHours],
                    ["PR outlook", selectedCountry.prOpportunity],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-sm bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
                      <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 rounded-sm border border-slate-200 p-5 dark:border-slate-800">
                  <h3 className="flex items-center gap-2 text-lg font-black text-[var(--visa-heading)] dark:text-white">
                    <Landmark className="h-5 w-5 text-[var(--visa-accent)]" /> Overview
                  </h3>
                  <p className="mt-3 leading-7">{selectedCountry.overview}</p>
                </div>
                <Accordion
                  type="multiple"
                  defaultValue={["req-initial"]}
                  className="mt-5 rounded-sm border border-slate-200 px-5 dark:border-slate-800"
                >
                  {pageData.requirementSections
                    .filter((section) => section.id !== "req-overview")
                    .map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="py-5 text-base font-bold text-slate-800 hover:no-underline dark:text-slate-100">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 pb-2">
                            {section.items.map((item, index) => (
                              <li key={`${section.id}-${index}`} className="flex gap-3 leading-6">
                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--visa-accent)]" />{" "}
                                <span>{item}</span>
                              </li>
                            ))}
                            {section.id === "req-country" &&
                              selectedCountry.countrySpecificRequirements.map((item, index) => (
                                <li key={`country-${index}`} className="flex gap-3 leading-6">
                                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--visa-accent)]" />{" "}
                                  <span>{item}</span>
                                </li>
                              ))}
                            {section.id === "req-costs" &&
                              selectedCountry.estimatedCosts.map((item, index) => (
                                <li key={`cost-${index}`} className="flex gap-3 leading-6">
                                  <CircleDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-[var(--visa-accent)]" />{" "}
                                  <span>{item}</span>
                                </li>
                              ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={pageData.primaryButtonUrl}
                    className="inline-flex min-h-12 items-center justify-center rounded-sm border border-slate-200 px-6 font-bold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-slate-200 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                  >
                    Ask an advisor
                  </a>
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-400 pb-14 md:pb-1">
                  Indicative planning information only. Confirm current rules, fees, and evidence with the official
                  immigration authority and relevant embassy before applying.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <section className="bg-slate-50 px-4 py-20 text-[var(--visa-text)] dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            {pageData.showTimelineEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--visa-accent)]">
                {pageData.timelineEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--visa-heading)] dark:text-white">
              {pageData.timelineTitle}
            </h2>
          </div>
          <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-[1.45rem] before:top-8 before:w-px before:bg-slate-200 dark:before:bg-slate-700 sm:before:left-[2rem]">
            {pageData.timeline.map((step, index) => (
              <motion.li
                key={step.id}
                initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : Math.min(index, 4) * 0.06 }}
                className="relative flex gap-4 rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:gap-6 sm:p-6"
              >
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 font-black text-[var(--visa-accent)] dark:border-slate-700 dark:bg-slate-950 sm:h-16 sm:w-16">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="pt-1 sm:pt-2">
                  <h3 className="text-xl font-black text-[var(--visa-heading)] dark:text-white sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            {pageData.showChecklistEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--visa-accent)]">
                {pageData.checklistEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--visa-heading)] dark:text-white">
              {pageData.checklistTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.checklistDescription}</p>
            <div className="mt-8 rounded-sm bg-[var(--visa-accent-dark)] p-6 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Your progress</p>
                  <p className="mt-1 text-4xl font-black">{progress}%</p>
                </div>
                <p className="text-sm font-semibold text-white/70">
                  {completedCount} of {totalChecklistItems}
                </p>
              </div>
              <div
                className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Checklist progress"
              >
                <motion.div
                  className="h-full rounded-full bg-[var(--visa-accent)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.45 }}
                />
              </div>
            </div>
          </div>

          <Accordion
            type="multiple"
            defaultValue={[pageData.checklistGroups[0]?.id].filter(Boolean)}
            className="overflow-hidden rounded-sm border border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-900 sm:px-7"
          >
            {pageData.checklistGroups.map((group) => {
              const groupCompleted = group.items.filter((_, index) => completed.has(`${group.id}-${index}`)).length;
              return (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="py-5 text-left text-base font-black text-[var(--visa-heading)] hover:no-underline dark:text-white sm:text-lg">
                    <span className="flex items-center gap-3">
                      <FileCheck2 className="h-5 w-5 text-[var(--visa-accent)]" />
                      {group.title}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {groupCompleted}/{group.items.length}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="space-y-2">
                      {group.items.map((item, index) => {
                        const id = `${group.id}-${index}`;
                        const checked = completed.has(id);
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 transition ${checked ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"}`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleChecklist(id)}
                              aria-label={`Mark ${item} as ${checked ? "incomplete" : "complete"}`}
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

      <section
        id="download-centre"
        className="scroll-mt-8 border-y border-slate-200/70 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            {pageData.showDownloadsEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--visa-accent)]">
                {pageData.downloadsEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--visa-heading)] dark:text-white">
              {pageData.downloadsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.downloadsDescription}</p>
          </div>
          {downloadError && (
            <p
              className="mt-6 rounded-sm border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
              role="alert"
            >
              {downloadError}
            </p>
          )}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.downloads.map((resource, index) => {
              const icons = [BookOpenCheck, FileCheck2, Banknote, FileText, Headphones];
              const Icon = icons[index % icons.length];
              const isDownloading = downloadingResourceId === resource.id;
              return (
                <motion.button
                  key={resource.id}
                  type="button"
                  onClick={() => downloadResourcePdf(resource)}
                  disabled={Boolean(downloadingResourceId)}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  className="group rounded-sm border border-slate-200 bg-[var(--visa-background)] p-6 text-left outline-none transition-shadow hover:shadow-xl focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-sm bg-[var(--visa-accent-dark)] text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <Badge variant="outline" className="rounded-full">
                      PDF
                    </Badge>
                  </div>
                  <h3 className="mt-7 text-xl font-black text-[var(--visa-heading)] dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-3 leading-7">{resource.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--visa-accent)]">
                    {isDownloading ? "Preparing PDF..." : "Download PDF"}
                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            {pageData.showFaqEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--visa-accent)]">
                {pageData.faqEyebrow}
              </p>
            )}
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--visa-heading)] dark:text-white">
              {pageData.faqTitle}
            </h2>
            <p className="mt-6 text-lg leading-8">{pageData.faqDescription}</p>
          </div>
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={faqSearch}
                onChange={(event) => setFaqSearch(event.target.value)}
                placeholder={pageData.faqSearchPlaceholder}
                aria-label="Search frequently asked questions"
                className="h-14 rounded-sm border-slate-200 bg-white pl-12 text-base dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <Accordion
              type="single"
              collapsible
              className="mt-5 overflow-hidden rounded-sm border border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-900 sm:px-7"
            >
              {filteredFaqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="py-5 text-base font-black text-[var(--visa-heading)] hover:no-underline dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-7">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaqs.length === 0 && (
              <div className="mt-5 rounded-sm border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                No questions match “{faqSearch}”.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-14 text-center text-[var(--visa-heading)] shadow-[0_28px_80px_rgba(15,23,42,.09)] dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:px-10 lg:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full border-[50px] border-slate-100 dark:border-slate-800/70" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full border-[55px] border-slate-100 dark:border-slate-800/70" />
          <div className="relative mx-auto max-w-3xl">
            <ShieldCheck className="mx-auto h-10 w-10 text-[var(--visa-accent)]" />
            <h2 className="mt-5 text-[clamp(2.35rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.055em]">
              {pageData.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {pageData.ctaDescription}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={pageData.primaryButtonUrl}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[var(--visa-accent)] px-7 font-bold text-white outline-none transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-4 focus-visible:ring-red-200"
              >
                {pageData.primaryButtonText} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={pageData.secondaryButtonUrl}
                className="inline-flex min-h-14 items-center justify-center rounded-sm border border-slate-300 bg-slate-50 px-7 font-bold text-[var(--visa-heading)] outline-none transition hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
              >
                {pageData.secondaryButtonText}
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="sr-only" aria-live="polite">
        {filteredCountries.length} countries shown. Checklist {progress}% complete.
      </div>
    </main>
  );
};

export default QueryVisaRequirements;
