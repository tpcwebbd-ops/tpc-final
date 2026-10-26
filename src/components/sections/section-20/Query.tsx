/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";

import { defaultDataSection20, Section20Payload, Section20Props } from "./data";

const ChevronLeft = iconMap.ChevronLeft;
const ChevronRight = iconMap.ChevronRight;

const QuerySection20 = ({ data }: Section20Props) => {
  let logoData = defaultDataSection20;
  let paddingX = 0;
  let paddingY = 0;

  if (data && typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section20Payload>;
      logoData = {
        ...defaultDataSection20,
        ...parsed,
        logos: parsed.logos ?? defaultDataSection20.logos,
        responsive: parsed.responsive ?? defaultDataSection20.responsive,
      };
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-20 data:", error);
    }
  } else if (data && typeof data === "object") {
    logoData = {
      ...defaultDataSection20,
      ...data,
      logos: data.logos ?? defaultDataSection20.logos,
      responsive: data.responsive ?? defaultDataSection20.responsive,
    };
    if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
    if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(logoData.responsive.desktop);
  const [isPaused, setIsPaused] = useState(false);

  const { logos, autoplaySpeed, isAutoplay, infiniteLoop, navPosition, gap, pauseOnHover, grayscale } = logoData;

  const totalItems = logos.length;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(logoData.responsive.mobile);
      } else if (width < 1024) {
        setVisibleCount(logoData.responsive.tablet);
      } else {
        setVisibleCount(logoData.responsive.desktop);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [logoData.responsive]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= totalItems - visibleCount) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalItems - visibleCount) : 0;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!isAutoplay || isPaused) return;

    if (totalItems <= visibleCount && !infiniteLoop) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalItems - visibleCount) return infiniteLoop ? 0 : prev;
        return prev + 1;
      });
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, totalItems, visibleCount, infiniteLoop]);

  const gapMap = {
    sm: "px-2",
    md: "px-4",
    lg: "px-6",
    xl: "px-8",
  }[gap || "lg"];

  const navClasses = {
    "middle-outside": { container: "relative flex items-center", prev: "-left-12", next: "-right-12", wrapper: "" },
    "bottom-outside": {
      container: "relative flex flex-col gap-6",
      prev: "left-[40%] bottom-0 translate-y-full",
      next: "right-[40%] bottom-0 translate-y-full",
      wrapper: "order-first",
    },
    hidden: { container: "relative", prev: "hidden", next: "hidden", wrapper: "" },
  }[navPosition || "hidden"];

  if (logos.length === 0) return null;

  const itemWidth = 100 / visibleCount;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className={cn(
        "mx-auto w-full max-w-7xl custom-parent-border bg-white px-4 text-stone-800 sm:px-8",
        navPosition === "bottom-outside" ? "mb-12" : "",
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className={navClasses.container}>
        {navPosition !== "hidden" && totalItems > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className={cn(
              "absolute z-10 h-10 w-10 rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900",
              navClasses.prev,
              !infiniteLoop && currentIndex === 0 && "opacity-30 cursor-not-allowed",
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        <div className={cn("overflow-hidden w-full", navClasses.wrapper)}>
          <div
            className="flex items-center transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * itemWidth}%)` }}
          >
            {logos.map((logo) => (
              <div
                key={logo.id}
                className={cn("flex-shrink-0 flex items-center justify-center", gapMap)}
                style={{ width: `${itemWidth}%` }}
              >
                {logo.link ? (
                  <Link
                    href={logo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/logo w-full flex justify-center"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={logo.image}
                      alt={logo.alt}
                      className={cn(
                        "max-w-full h-12 w-auto object-contain transition-all duration-300",
                        grayscale
                          ? "grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110"
                          : "hover:scale-105",
                      )}
                    />
                  </Link>
                ) : (
                  <div className="group/logo w-full flex justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={logo.image}
                      alt={logo.alt}
                      className={cn(
                        "max-w-full h-12 w-auto object-contain transition-all duration-300",
                        grayscale
                          ? "grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110"
                          : "hover:scale-105",
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {navPosition !== "hidden" && totalItems > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className={cn(
              "absolute z-10 h-10 w-10 rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900",
              navClasses.next,
              !infiniteLoop && currentIndex >= totalItems - visibleCount && "opacity-30 cursor-not-allowed",
            )}
            disabled={!infiniteLoop && currentIndex >= totalItems - visibleCount}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuerySection20;
