/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Region = "Asia" | "Africa" | "Europe" | "North America" | "South America" | "Oceania";

interface Country {
  name: string;
  flag: string;
  region: Region;
}

const REGIONS: Region[] = ["Asia", "Africa", "Europe", "North America", "South America", "Oceania"];

const COUNTRIES: Country[] = [
  { name: "Hong Kong", flag: "🇭🇰", region: "Asia" },
  { name: "Philippines", flag: "🇵🇭", region: "Asia" },
  { name: "Thailand", flag: "🇹🇭", region: "Asia" },
  { name: "Singapore", flag: "🇸🇬", region: "Asia" },
  { name: "Myanmar", flag: "🇲🇲", region: "Asia" },
  { name: "Lebanon", flag: "🇱🇧", region: "Asia" },
  { name: "Kazakhstan", flag: "🇰🇿", region: "Asia" },
  { name: "Laos", flag: "🇱🇦", region: "Asia" },
  { name: "Iraq", flag: "🇮🇶", region: "Asia" },
  { name: "Brunei", flag: "🇧🇳", region: "Asia" },
  { name: "Bahrain", flag: "🇧🇭", region: "Asia" },
  { name: "Malaysia", flag: "🇲🇾", region: "Asia" },
  { name: "Pakistan", flag: "🇵🇰", region: "Asia" },
  { name: "Turkey", flag: "🇹🇷", region: "Asia" },
  { name: "The People's Republic of China", flag: "🇨🇳", region: "Asia" },
  { name: "Sri Lanka", flag: "🇱🇰", region: "Asia" },
  { name: "Qatar", flag: "🇶🇦", region: "Asia" },
  { name: "Maldives", flag: "🇲🇻", region: "Asia" },
  { name: "Japan", flag: "🇯🇵", region: "Asia" },
  { name: "Kuwait", flag: "🇰🇼", region: "Asia" },
  { name: "Indonesia", flag: "🇮🇩", region: "Asia" },
  { name: "South Korea", flag: "🇰🇷", region: "Asia" },
  { name: "Cambodia", flag: "🇰🇭", region: "Asia" },
  { name: "Afghanistan", flag: "🇦🇫", region: "Asia" },
  { name: "India", flag: "🇮🇳", region: "Asia" },
  { name: "Taiwan", flag: "🇹🇼", region: "Asia" },
  { name: "Vietnam", flag: "🇻🇳", region: "Asia" },
  { name: "Tajikistan", flag: "🇹🇯", region: "Asia" },
  { name: "Saudi Arabia", flag: "🇸🇦", region: "Asia" },
  { name: "Oman", flag: "🇴🇲", region: "Asia" },
  { name: "Mongolia", flag: "🇲🇳", region: "Asia" },
  { name: "Jordan", flag: "🇯🇴", region: "Asia" },
  { name: "Kyrgyzstan", flag: "🇰🇬", region: "Asia" },
  { name: "Iran", flag: "🇮🇷", region: "Asia" },
  { name: "East Timor", flag: "🇹🇱", region: "Asia" },
  { name: "Armenia", flag: "🇦🇲", region: "Asia" },
  { name: "Nepal", flag: "🇳🇵", region: "Asia" },
  { name: "Bhutan", flag: "🇧🇹", region: "Asia" },

  { name: "Gambia", flag: "🇬🇲", region: "Africa" },
  { name: "Tanzania", flag: "🇹🇿", region: "Africa" },
  { name: "Sudan", flag: "🇸🇩", region: "Africa" },
  { name: "Seychelles", flag: "🇸🇨", region: "Africa" },
  { name: "Morocco", flag: "🇲🇦", region: "Africa" },
  { name: "Niger", flag: "🇳🇪", region: "Africa" },
  { name: "Mauritania", flag: "🇲🇷", region: "Africa" },
  { name: "Liberia", flag: "🇱🇷", region: "Africa" },
  { name: "Kenya", flag: "🇰🇪", region: "Africa" },
  { name: "Republic of the Congo", flag: "🇨🇬", region: "Africa" },
  { name: "Somalia", flag: "🇸🇴", region: "Africa" },
  { name: "Sao Tome and Principe", flag: "🇸🇹", region: "Africa" },
  { name: "Nigeria", flag: "🇳🇬", region: "Africa" },
  { name: "Mozambique", flag: "🇲🇿", region: "Africa" },
  { name: "Malawi", flag: "🇲🇼", region: "Africa" },
  { name: "Mauritius", flag: "🇲🇺", region: "Africa" },
  { name: "Libya", flag: "🇱🇾", region: "Africa" },
  { name: "Ivory Coast", flag: "🇨🇮", region: "Africa" },
  { name: "Democratic Republic of the Congo", flag: "🇨🇩", region: "Africa" },
  { name: "South Sudan", flag: "🇸🇸", region: "Africa" },
  { name: "Senegal", flag: "🇸🇳", region: "Africa" },
  { name: "South Africa", flag: "🇿🇦", region: "Africa" },
  { name: "Namibia", flag: "🇳🇦", region: "Africa" },
  { name: "Mali", flag: "🇲🇱", region: "Africa" },
  { name: "Lesotho", flag: "🇱🇸", region: "Africa" },
  { name: "Madagascar", flag: "🇲🇬", region: "Africa" },
  { name: "Gabon", flag: "🇬🇦", region: "Africa" },
  { name: "Ghana", flag: "🇬🇭", region: "Africa" },
  { name: "Guinea", flag: "🇬🇳", region: "Africa" },
  { name: "Guinea-Bissau", flag: "🇬🇼", region: "Africa" },
  { name: "Equatorial Guinea", flag: "🇬🇶", region: "Africa" },
  { name: "Eritrea", flag: "🇪🇷", region: "Africa" },
  { name: "Ethiopia", flag: "🇪🇹", region: "Africa" },
  { name: "Egypt", flag: "🇪🇬", region: "Africa" },
  { name: "Djibouti", flag: "🇩🇯", region: "Africa" },
  { name: "Dominica", flag: "🇩🇲", region: "Africa" },
  { name: "Burkina Faso", flag: "🇧🇫", region: "Africa" },
  { name: "Cameroon", flag: "🇨🇲", region: "Africa" },
  { name: "Cape Verde", flag: "🇨🇻", region: "Africa" },
  { name: "Chad", flag: "🇹🇩", region: "Africa" },
  { name: "Burundi", flag: "🇧🇮", region: "Africa" },
  { name: "Benin", flag: "🇧🇯", region: "Africa" },
  { name: "Algeria", flag: "🇩🇿", region: "Africa" },
  { name: "Angola", flag: "🇦🇴", region: "Africa" },

  { name: "Czech Republic", flag: "🇨🇿", region: "Europe" },
  { name: "Spain", flag: "🇪🇸", region: "Europe" },
  { name: "Slovenia", flag: "🇸🇮", region: "Europe" },
  { name: "Portugal", flag: "🇵🇹", region: "Europe" },
  { name: "Montenegro", flag: "🇲🇪", region: "Europe" },
  { name: "Monaco", flag: "🇲🇨", region: "Europe" },
  { name: "Lithuania", flag: "🇱🇹", region: "Europe" },
  { name: "Kosovo", flag: "🇽🇰", region: "Europe" },
  { name: "Italy", flag: "🇮🇹", region: "Europe" },
  { name: "Greece", flag: "🇬🇷", region: "Europe" },
  { name: "France", flag: "🇫🇷", region: "Europe" },
  { name: "Croatia", flag: "🇭🇷", region: "Europe" },
  { name: "Austria", flag: "🇦🇹", region: "Europe" },
  { name: "Belgium", flag: "🇧🇪", region: "Europe" },
  { name: "Netherlands", flag: "🇳🇱", region: "Europe" },
  { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { name: "Switzerland", flag: "🇨🇭", region: "Europe" },
  { name: "San Marino", flag: "🇸🇲", region: "Europe" },
  { name: "Serbia", flag: "🇷🇸", region: "Europe" },
  { name: "Russia", flag: "🇷🇺", region: "Europe" },
  { name: "Malta", flag: "🇲🇹", region: "Europe" },
  { name: "Latvia", flag: "🇱🇻", region: "Europe" },
  { name: "Luxembourg", flag: "🇱🇺", region: "Europe" },
  { name: "Hungary", flag: "🇭🇺", region: "Europe" },
  { name: "Georgia", flag: "🇬🇪", region: "Europe" },
  { name: "Estonia", flag: "🇪🇪", region: "Europe" },
  { name: "Cyprus", flag: "🇨🇾", region: "Europe" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦", region: "Europe" },
  { name: "Azerbaijan", flag: "🇦🇿", region: "Europe" },
  { name: "Andorra", flag: "🇦🇩", region: "Europe" },
  { name: "Romania", flag: "🇷🇴", region: "Europe" },
  { name: "Sweden", flag: "🇸🇪", region: "Europe" },
  { name: "Slovakia", flag: "🇸🇰", region: "Europe" },
  { name: "Poland", flag: "🇵🇱", region: "Europe" },
  { name: "Norway", flag: "🇳🇴", region: "Europe" },
  { name: "Moldova", flag: "🇲🇩", region: "Europe" },
  { name: "Liechtenstein", flag: "🇱🇮", region: "Europe" },
  { name: "North Macedonia", flag: "🇲🇰", region: "Europe" },
  { name: "Iceland", flag: "🇮🇸", region: "Europe" },
  { name: "Germany", flag: "🇩🇪", region: "Europe" },
  { name: "Finland", flag: "🇫🇮", region: "Europe" },
  { name: "Denmark", flag: "🇩🇰", region: "Europe" },
  { name: "Bulgaria", flag: "🇧🇬", region: "Europe" },
  { name: "Belarus", flag: "🇧🇾", region: "Europe" },
  { name: "Ireland", flag: "🇮🇪", region: "Europe" },
  { name: "Albania", flag: "🇦🇱", region: "Europe" },

  { name: "United States", flag: "🇺🇸", region: "North America" },
  { name: "Nicaragua", flag: "🇳🇮", region: "North America" },
  { name: "Haiti", flag: "🇭🇹", region: "North America" },
  { name: "El Salvador", flag: "🇸🇻", region: "North America" },
  { name: "Barbados", flag: "🇧🇧", region: "North America" },
  { name: "Canada", flag: "🇨🇦", region: "North America" },
  { name: "The Dominican Republic", flag: "🇩🇴", region: "North America" },
  { name: "Mexico", flag: "🇲🇽", region: "North America" },
  { name: "Grenada", flag: "🇬🇩", region: "North America" },
  { name: "Costa Rica", flag: "🇨🇷", region: "North America" },
  { name: "Belize", flag: "🇧🇿", region: "North America" },
  { name: "Panama", flag: "🇵🇦", region: "North America" },
  { name: "Jamaica", flag: "🇯🇲", region: "North America" },
  { name: "Guatemala", flag: "🇬🇹", region: "North America" },
  { name: "Cuba", flag: "🇨🇺", region: "North America" },
  { name: "Antigua and Barbuda", flag: "🇦🇬", region: "North America" },

  { name: "Uruguay", flag: "🇺🇾", region: "South America" },
  { name: "Paraguay", flag: "🇵🇾", region: "South America" },
  { name: "Chile", flag: "🇨🇱", region: "South America" },
  { name: "Brazil", flag: "🇧🇷", region: "South America" },
  { name: "Suriname", flag: "🇸🇷", region: "South America" },
  { name: "Guyana", flag: "🇬🇾", region: "South America" },
  { name: "Colombia", flag: "🇨🇴", region: "South America" },
  { name: "Argentina", flag: "🇦🇷", region: "South America" },
  { name: "Peru", flag: "🇵🇪", region: "South America" },
  { name: "Ecuador", flag: "🇪🇨", region: "South America" },
  { name: "Bolivia", flag: "🇧🇴", region: "South America" },

  { name: "Samoa", flag: "🇼🇸", region: "Oceania" },
  { name: "Nauru", flag: "🇳🇷", region: "Oceania" },
  { name: "Fiji", flag: "🇫🇯", region: "Oceania" },
  { name: "Palau", flag: "🇵🇼", region: "Oceania" },
  { name: "New Zealand", flag: "🇳🇿", region: "Oceania" },
  { name: "Australia", flag: "🇦🇺", region: "Oceania" },
  { name: "Papua New Guinea", flag: "🇵🇬", region: "Oceania" },
  { name: "Kiribati", flag: "🇰🇮", region: "Oceania" },
];

function RegionSection({ region, countries, index }: { region: Region; countries: Country[]; index: number }) {
  return (
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
          List of embassy countries in <span className="text-blue-600">{region}</span>
        </h2>
      </div>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <div
            key={country.name}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
          >
            <span className="text-xl leading-none">{country.flag}</span>
            <span className="text-sm text-slate-700 transition-colors group-hover:text-blue-600">{country.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Country() {
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<Region | "All">("All");

  const filteredByRegion = useMemo(
    () => (activeRegion === "All" ? COUNTRIES : COUNTRIES.filter((country) => country.region === activeRegion)),
    [activeRegion],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredByRegion;
    return filteredByRegion.filter((country) => country.name.toLowerCase().includes(q));
  }, [filteredByRegion, query]);

  const groupedByRegion = useMemo(() => {
    return REGIONS.map((region) => ({
      region,
      countries: filtered.filter((country) => country.region === region),
    })).filter((group) => group.countries.length > 0);
  }, [filtered]);

  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a country"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            variant={activeRegion === "All" ? "default" : "outline"}
            onClick={() => setActiveRegion("All")}
            className={cn(activeRegion === "All" && "bg-blue-700 hover:bg-blue-700/90")}
          >
            View All
          </Button>
          {REGIONS.map((region) => (
            <Button
              key={region}
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
                <RegionSection key={group.region} region={group.region} countries={group.countries} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-slate-400">
              No countries match &ldquo;{query}&rdquo;.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
