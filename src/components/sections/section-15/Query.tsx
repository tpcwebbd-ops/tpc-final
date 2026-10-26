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
import React, { useState, useMemo } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";

import { defaultDataSection15, OfficeLocation, Section15Payload } from "./data";

const iconComponent = (icon: keyof typeof iconMap) => {
  const IconComponent = iconMap[icon];
  const Icon = (props: { className?: string; size?: number }) => <IconComponent {...props} />;
  Icon.displayName = `SectionIcon(${icon})`;
  return Icon;
};
const Maximize2 = iconComponent("Maximize");
const Minimize2 = iconComponent("Minimize");
const ExternalLink = iconComponent("ExternalLink");
const MapPin = iconComponent("MapPin");
const Phone = iconComponent("Phone");
const Mail = iconComponent("Mail");
const Clock = iconComponent("Clock");
const Globe2 = iconComponent("Globe");
const Navigation = iconComponent("Navigation");
const ArrowRight = iconComponent("ArrowRight");
const Copy = iconComponent("Copy");

interface LocationListProps {
  locations: OfficeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
}

const LocationList = ({ locations, activeId, onSelect }: LocationListProps) => {
  return (
    <div className="space-y-3">
      {locations.map((loc) => {
        const isActive = activeId === loc.id;
        return (
          <motion.button
            key={loc.id}
            onClick={() => onSelect(loc.id)}
            className={cn(
              "w-full text-left relative p-4 rounded-sm border transition-all duration-300 group overflow-hidden",
              isActive ? "bg-purple-500/10 border-purple-500/50" : "bg-white border-stone-200 hover:border-purple-300",
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeGlow"
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50"
              />
            )}

            <div className="relative z-10 flex items-start gap-4">
              <div
                className={cn(
                  "p-3 rounded-sm flex-shrink-0 transition-colors",
                  isActive
                    ? "bg-purple-500 text-white"
                    : "bg-stone-100 text-stone-500 group-hover:bg-stone-200 group-hover:text-stone-900",
                )}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3
                    className={cn("font-bold text-lg mb-1 truncate", isActive ? "text-purple-700" : "text-stone-800")}
                  >
                    {loc.city}
                  </h3>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white px-2 py-0.5 rounded-full"
                    >
                      Active
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 font-medium mb-2 truncate">{loc.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Globe2 className="w-3 h-3" />
                  <span className="truncate">{loc.country}</span>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const LocationDetails = ({ activeLocation }: { activeLocation: OfficeLocation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-sm p-6 mt-6 shadow-sm">
      <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-6 border-b border-stone-200 pb-4">
        Secure Link
      </h4>

      <div className="space-y-6">
        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => handleCopy(activeLocation.contact?.phone)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700 transition-colors group-hover:border-purple-400 group-hover:bg-purple-100">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Secure Line</p>
            <p className="text-stone-900 font-mono hover:text-purple-600 transition-colors">
              {activeLocation.contact?.phone}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => handleCopy(activeLocation.contact?.email)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700 transition-colors group-hover:border-purple-400 group-hover:bg-purple-100">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Encrypted Mail</p>
            <p className="text-stone-900 font-mono hover:text-purple-600 transition-colors">
              {activeLocation.contact?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Operations</p>
            <p className="text-stone-700 text-sm">{activeLocation.schedule}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button className="flex-1 bg-white text-black font-bold py-3 rounded-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm">
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
        <button
          onClick={() => handleCopy(activeLocation.address)}
          className="px-4 py-3 bg-stone-100 border border-stone-200 rounded-sm text-stone-800 hover:bg-stone-200 transition-colors flex items-center gap-2"
        >
          {copied ? <ArrowRight className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

interface QuerySection15Props {
  data?: OfficeLocation[] | Section15Payload | string;
}

export default function QuerySection15({ data }: QuerySection15Props) {
  const locations: OfficeLocation[] = useMemo(() => {
    if (!data) return defaultDataSection15;
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const normalized = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.locations)
          ? parsed.locations
          : Array.isArray(parsed?.data)
            ? parsed.data
            : [];

      return normalized.length > 0 ? normalized : defaultDataSection15;
    } catch (e) {
      console.error("Failed to parse section data", e);
      return defaultDataSection15;
    }
  }, [data]);
  const parsedLayout = useMemo(() => {
    if (!data) return { paddingX: 0, paddingY: 0 };
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return {
        paddingX: Math.max(0, Number(parsed?.paddingX) || 0),
        paddingY: Math.max(0, Number(parsed?.paddingY) || 0),
      };
    } catch {
      return { paddingX: 0, paddingY: 0 };
    }
  }, [data]);

  const [activeId, setActiveId] = useState<string>(locations[0]?.id || "");
  const [isExpanded, setIsExpanded] = useState(false);

  const activeLocation = useMemo(() => locations.find((l) => l.id === activeId) || locations[0], [locations, activeId]);

  return (
    <div
      style={{ paddingInline: `${parsedLayout.paddingX}px`, paddingBlock: `${parsedLayout.paddingY}px` }}
      className={cn(
        "custom-parent-border min-h-screen mx-auto w-full max-w-7xl bg-white text-stone-800 font-sans overflow-hidden flex flex-col",
        isExpanded ? "h-screen fixed inset-0 z-50" : "relative",
      )}
    >
      <main className="flex-1 relative flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(
            "lg:w-[450px] bg-white border-r border-stone-200 flex flex-col z-30 relative shadow-sm transition-all duration-300",
            isExpanded ? "hidden lg:hidden" : "block",
          )}
        >
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 h-full max-h-[calc(100vh-120px)]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Our Locations</h1>
              <p className="text-stone-600 text-sm">
                Global infrastructure nodes powering the decentralized web. Select a hub to initiate connection.
              </p>
            </div>

            <LocationList locations={locations} activeId={activeId} onSelect={setActiveId} />

            <LocationDetails activeLocation={activeLocation} />

            <div className="group relative mt-8 aspect-video overflow-hidden rounded-sm border border-stone-200">
              {activeLocation.image && (
                <Image
                  src={activeLocation.image}
                  alt={activeLocation.name}
                  fill
                  loading="eager"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-white/90 to-transparent p-4">
                <p className="text-sm font-medium text-stone-900">{activeLocation.name} Interior View</p>
              </div>
            </div>
          </div>
        </motion.aside>

        <div className="flex-1 relative bg-stone-100 overflow-hidden min-h-[500px]">
          <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-sm border border-stone-200 bg-white/90 p-3 text-stone-700 shadow-lg backdrop-blur-md transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button className="rounded-sm border border-stone-200 bg-white/90 p-3 text-stone-700 shadow-lg backdrop-blur-md transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocation.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-6 left-6 z-20 hidden md:block"
            >
              <div className="rounded-r-xl border-l-4 border-purple-500 bg-white/90 py-2 pl-4 pr-6 shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Current Coordinates</p>
                <p className="font-mono text-xl text-stone-900">
                  {activeLocation.coordinates.lat.toFixed(4)}° N, {Math.abs(activeLocation.coordinates.lng).toFixed(4)}°
                  W
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-0">
            <iframe
              key={activeId}
              width="100%"
              height="100%"
              style={{ filter: "none", opacity: 1 }}
              src={`https://maps.google.com/maps?q=${activeLocation.coordinates.lat},${activeLocation.coordinates.lng}&z=14&output=embed`}
              title="Google Map"
              className="h-full w-full border-0 transition-opacity duration-500 ease-in-out"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full border border-purple-500/50 bg-purple-500/10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-purple-500 fill-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white via-white/90 to-transparent p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
              {activeLocation.features.map((feature, i) => (
                <motion.div
                  key={`${activeId}-${feature}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-sm border border-stone-200 bg-white/90 p-4 shadow-sm backdrop-blur-md transition-colors hover:border-purple-300"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                  <span className="text-sm font-medium text-stone-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
