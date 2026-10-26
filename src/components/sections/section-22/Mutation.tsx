/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import React, { useEffect, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";

import { defaultDataSection22, defaultLayout, Section22Data, Section22Props, Section22Payload } from "./data";

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MutationSection22 = ({ data, onChange }: Section22Props) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section22Payload = (() => {
    if (typeof data !== "string")
      return data && "paddingX" in data ? data : { ...defaultDataSection22, ...defaultLayout, ...(data || {}) };
    try {
      return { ...defaultDataSection22, ...defaultLayout, ...JSON.parse(data) };
    } catch (error) {
      console.error("Error parsing section-22 data:", error);
      return { ...defaultDataSection22, ...defaultLayout };
    }
  })();
  const [localData, setLocalData] = useState<Section22Data>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...localData, paddingX, paddingY });
  }, [localData, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const handleChange = (key: keyof Section22Data, value: string) => {
    setLocalData((prev) => ({ ...prev, [key]: value }));
  };

  const isBackdrop = localData.background.includes("backdrop");

  return (
    <div className="custom-parent-border w-full max-w-7xl mx-auto border-x border-[#eadfca] bg-white font-sans text-stone-800">
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-[#eadfca] transition-all duration-500">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Component <span className="text-indigo-600">Configurator</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Customize the dimensions and appearance of your spacer block.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              Preview Mode
            </span>
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#eadfca] bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room around the spacer.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:min-w-[30rem]">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = field === "paddingX" ? paddingX : paddingY;
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    min={-300}
                    max={300}
                    step={1}
                    value={[value]}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue ?? 0)}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>-300px</span>
                    <span>0</span>
                    <span>+300px</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 min-h-[500px]">
          <div className="lg:col-span-4 bg-white p-6 md:p-8 flex flex-col gap-6 border-r border-slate-100 z-10 relative">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Height
              </label>
              <div className="relative">
                <select
                  value={localData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className="w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="h-4">h-4 (1rem)</option>
                  <option value="h-8">h-8 (2rem)</option>
                  <option value="h-12">h-12 (3rem)</option>
                  <option value="h-16">h-16 (4rem)</option>
                  <option value="h-24">h-24 (6rem)</option>
                  <option value="h-32">h-32 (8rem)</option>
                  <option value="h-48">h-48 (12rem)</option>
                  <option value="h-64">h-64 (16rem)</option>
                  <option value="h-96">h-96 (24rem)</option>
                  <option value="h-128">h-128 (32rem)</option>
                  <option value="h-256">h-256 (64rem)</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Width
              </label>
              <div className="relative">
                <select
                  value={localData.width}
                  onChange={(e) => handleChange("width", e.target.value)}
                  className="w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="w-full">Full Width</option>
                  <option value="w-1/2">1/2 Width</option>
                  <option value="w-1/3">1/3 Width</option>
                  <option value="w-2/3">2/3 Width</option>
                  <option value="w-1/4">1/4 Width</option>
                  <option value="w-2/4">2/4 Width</option>
                  <option value="w-3/4">3/4 Width</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Appearance
              </label>
              <div className="relative">
                <select
                  value={localData.background}
                  onChange={(e) => handleChange("background", e.target.value)}
                  className="w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <optgroup label="Solid Colors">
                    <option value="transparent">Transparent</option>
                    <option value="bg-white">White</option>
                    <option value="bg-gray-100">Gray 100</option>
                    <option value="bg-black">Black</option>
                  </optgroup>
                  <optgroup label="Glassmorphism / Backdrop">
                    <option value="backdrop-blur-md">Backdrop Blur MD</option>
                    <option value="backdrop-blur-xl">Backdrop Blur XL</option>
                    <option value="backdrop-blur-2xl">Backdrop Blur 2XL</option>
                    <option value="backdrop-blur-3xl">Backdrop Blur 3XL</option>
                    <option value="backdrop-blur-4xl">Backdrop Blur 4XL</option>
                  </optgroup>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Layout Mode
              </label>
              <div className="relative">
                <select
                  value={localData.display}
                  onChange={(e) => handleChange("display", e.target.value)}
                  className="w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="hidden">Hidden</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="flex-grow"></div>
          </div>

          <div className="lg:col-span-8 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
            <div
              className="absolute inset-0 z-0 opacity-40"
              style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            ></div>

            {isBackdrop && (
              <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse absolute top-1/4 left-1/4"></div>
                <div
                  className="w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse absolute bottom-1/4 right-1/4"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            )}

            <div className="relative z-10 flex h-full w-full items-start justify-start rounded-sm border-2 border-dashed border-slate-300 bg-white/30 transition-colors duration-300">
              <div className="absolute -top-3 left-4 rounded-sm bg-slate-200 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Container Context
              </div>

              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  ${localData.height} 
                  ${localData.width} 
                  ${localData.background} 
                  ${localData.display}
                  relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  border border-transparent hover:border-indigo-400/50
                  shadow-sm hover:shadow-xl hover:shadow-indigo-500/20
                  rounded-sm
                `}
              >
                <div
                  className={`
                  w-full h-full flex items-center justify-center 
                  transition-opacity duration-300
                  ${localData.background === "transparent" || isBackdrop ? "opacity-100" : "opacity-0 hover:opacity-100"}
                `}
                >
                  <div className="flex flex-col items-center gap-1 text-slate-400/80">
                    <span className="rounded-sm border border-slate-900/5 bg-slate-900/5 px-2 py-0.5 font-mono text-xs">
                      {localData.width} × {localData.height}
                    </span>
                    {isHovered && (
                      <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold animate-pulse">
                        Active Area
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-xs text-slate-400">Live Render Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection22;
