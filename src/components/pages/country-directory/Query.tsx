/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  CountryItem,
  defaultDataCountryDirectory,
  defaultLayout,
  getDefaultCountryDescription,
  getFlagImageFromEmoji,
  CountryDirectoryPayload,
  COUNTRY_DIRECTORY_REGIONS,
  CountryDirectoryProps,
  Region,
} from "./data";

const normalizeData = (value: unknown): CountryDirectoryPayload => {
  if (!value || typeof value !== "object") return { ...defaultDataCountryDirectory, ...defaultLayout };
  const data = value as Partial<CountryDirectoryPayload>;
  if (!Array.isArray(data.countries)) return { ...defaultDataCountryDirectory, ...defaultLayout };

  return {
    ...defaultDataCountryDirectory,
    ...defaultLayout,
    ...data,
    countries: data.countries.map((country, index) => {
      const name = country.name || "Unnamed Country";
      const flag = country.flag || "🏳️";
      const region = COUNTRY_DIRECTORY_REGIONS.includes(country.region) ? country.region : "Asia";

      return {
        id: country.id || `country-${index + 1}`,
        name,
        flag,
        flagImage: country.flagImage || getFlagImageFromEmoji(flag),
        region,
        description: country.description || getDefaultCountryDescription(name, region),
      };
    }),
  };
};

const parseData = (data: CountryDirectoryProps["data"]): CountryDirectoryPayload => {
  if (!data) return { ...defaultDataCountryDirectory, ...defaultLayout };
  if (typeof data !== "string") return normalizeData(data);

  try {
    return normalizeData(JSON.parse(data));
  } catch {
    return { ...defaultDataCountryDirectory, ...defaultLayout };
  }
};

const RegionSection = ({
  region,
  countries,
  index,
  titlePrefix,
  onSelect,
}: {
  region: Region;
  countries: CountryItem[];
  index: number;
  titlePrefix: string;
  onSelect: (country: CountryItem) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="mb-16 last:mb-0"
  >
    <div className="mb-8 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-slate-400">{region}</span>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">
        {titlePrefix} <span className="text-blue-600">{region}</span>
      </h2>
    </div>
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map((country) => (
        <button
          key={country.id}
          type="button"
          onClick={() => onSelect(country)}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 text-left transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-slate-100 text-xl leading-none shadow-sm">
            {country.flag}
            {country.flagImage && (
              <Image
                src={country.flagImage}
                alt={`${country.name} flag`}
                className="absolute inset-0 h-full w-full object-cover"
                fill
                sizes="56px"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </span>
          <span className="text-sm text-slate-700 transition-colors group-hover:text-blue-600">{country.name}</span>
        </button>
      ))}
    </div>
  </motion.div>
);

const QueryCountryDirectory = ({ data }: CountryDirectoryProps) => {
  const pageData = parseData(data);
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<Region | "All">("All");
  const [selectedCountry, setSelectedCountry] = useState<CountryItem | null>(null);

  useEffect(() => {
    if (!selectedCountry) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCountry(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCountry]);

  const filteredByRegion = useMemo(
    () =>
      activeRegion === "All"
        ? pageData.countries
        : pageData.countries.filter((country) => country.region === activeRegion),
    [activeRegion, pageData.countries],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return filteredByRegion;
    return filteredByRegion.filter((country) => country.name.toLowerCase().includes(normalizedQuery));
  }, [filteredByRegion, query]);

  const groupedByRegion = useMemo(
    () =>
      COUNTRY_DIRECTORY_REGIONS.map((region) => ({
        region,
        countries: filtered.filter((country) => country.region === region),
      })).filter((group) => group.countries.length > 0),
    [filtered],
  );

  return (
    <section
      className="bg-slate-50 px-6 py-16 custom-parent-border"
      style={{
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
    >
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={pageData.searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeRegion === "All" ? "default" : "outline"}
            onClick={() => setActiveRegion("All")}
            className={cn(activeRegion === "All" && "bg-blue-700 hover:bg-blue-700/90")}
          >
            {pageData.viewAllLabel}
          </Button>
          {COUNTRY_DIRECTORY_REGIONS.map((region) => (
            <Button
              key={region}
              type="button"
              size="sm"
              variant={activeRegion === region ? "default" : "outline"}
              onClick={() => setActiveRegion(region)}
              className={cn(activeRegion === region && "bg-blue-700 hover:bg-blue-700/90")}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {groupedByRegion.length > 0 ? (
            <motion.div
              key={`${activeRegion}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {groupedByRegion.map((group, index) => (
                <RegionSection
                  key={group.region}
                  region={group.region}
                  countries={group.countries}
                  index={index}
                  titlePrefix={pageData.sectionTitlePrefix}
                  onSelect={setSelectedCountry}
                />
              ))}
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-slate-400">
              {pageData.emptyMessage}
              {query.trim() ? <> &ldquo;{query}&rdquo;.</> : "."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedCountry(null);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="country-dialog-title"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm border border-white/70 bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedCountry(null)}
                aria-label="Close country information"
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:rotate-90 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-2 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-center">
                  <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-slate-100 text-4xl shadow-md">
                    {selectedCountry.flag}
                    {selectedCountry.flagImage && (
                      <Image
                        src={selectedCountry.flagImage}
                        alt={`${selectedCountry.name} flag`}
                        className="absolute inset-0 h-full w-full object-cover"
                        fill
                        sizes="112px"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      <Globe2 className="h-3.5 w-3.5" /> Country information
                    </span>
                    <h3 id="country-dialog-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                      {selectedCountry.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <MapPin className="h-4 w-4 text-blue-600" /> {selectedCountry.region}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">About the country</h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {selectedCountry.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default QueryCountryDirectory;
