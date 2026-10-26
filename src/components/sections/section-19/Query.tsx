/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";

import { defaultDataSection19, Section19Data, STYLE_PRESETS, Section19Payload, Section19Props } from "./data";

const ChevronLeft = iconMap.ChevronLeft;
const ChevronRight = iconMap.ChevronRight;

const QuerySection19 = ({ data }: Section19Props) => {
  let sliderData = defaultDataSection19;
  let paddingX = 0;
  let paddingY = 0;

  if (data && typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section19Payload>;
      sliderData = { ...defaultDataSection19, ...parsed } as Section19Data;
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-19 data:", error);
    }
  } else if (data && typeof data === "object") {
    sliderData = { ...defaultDataSection19, ...data } as Section19Data;
    if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
    if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { tags, autoplaySpeed, isAutoplay, infiniteLoop, itemsPerSlide, navPosition, tagStyle, gap, pauseOnHover } =
    sliderData;

  const totalItems = tags.length;
  const safeItemsPerSlide = itemsPerSlide || 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= totalItems - safeItemsPerSlide) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalItems - safeItemsPerSlide) : 0;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!isAutoplay || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalItems - safeItemsPerSlide) return infiniteLoop ? 0 : prev;
        return prev + 1;
      });
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, totalItems, safeItemsPerSlide, infiniteLoop]);

  const gapClass = {
    sm: "px-1",
    md: "px-2",
    lg: "px-4",
  }[gap || "md"];

  const getTagStyle = (hasLink: boolean) => {
    const base =
      "flex items-center justify-center w-full h-12 rounded-sm transition-all duration-300 font-medium text-sm whitespace-nowrap";
    const cursor = hasLink ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default";

    return cn(base, cursor, STYLE_PRESETS[tagStyle || "glassy"]);
  };

  const navClasses = {
    "middle-outside": { container: "relative flex items-center", prev: "-left-10", next: "-right-10", wrapper: "" },
    "bottom-outside": {
      container: "relative flex flex-col gap-4",
      prev: "left-[40%] bottom-0 translate-y-full",
      next: "right-[40%] bottom-0 translate-y-full",
      wrapper: "order-first",
    },
    hidden: { container: "relative", prev: "hidden", next: "hidden", wrapper: "" },
  }[navPosition || "middle-outside"];

  const itemWidth = `${100 / safeItemsPerSlide}%`;

  if (tags.length === 0) return null;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className={cn(
        "mx-auto w-full max-w-3xl md:max-w-7xl custom-parent-border bg-white text-stone-800 px-8 overflow-hidden",
        navPosition === "bottom-outside" ? "mb-12" : "",
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className={navClasses.container}>
        {navPosition !== "hidden" && totalItems > safeItemsPerSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className={cn(
              "absolute z-10 h-8 w-8 rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900",
              navClasses.prev,
              !infiniteLoop && currentIndex === 0 && "opacity-30 cursor-not-allowed",
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div className={cn("overflow-hidden w-full", navClasses.wrapper)}>
          <div
            className="flex transition-transform duration-500 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * (100 / safeItemsPerSlide)}%)` }}
          >
            {tags.map((tag) => (
              <div key={tag.id} className={cn("flex-shrink-0", gapClass)} style={{ width: itemWidth }}>
                {tag.link ? (
                  <Link href={tag.link} className={getTagStyle(true)}>
                    {tag.text}
                  </Link>
                ) : (
                  <div className={getTagStyle(false)}>{tag.text}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {navPosition !== "hidden" && totalItems > safeItemsPerSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className={cn(
              "absolute z-10 h-8 w-8 rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900",
              navClasses.next,
              !infiniteLoop && currentIndex >= totalItems - safeItemsPerSlide && "opacity-30 cursor-not-allowed",
            )}
            disabled={!infiniteLoop && currentIndex >= totalItems - safeItemsPerSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuerySection19;
