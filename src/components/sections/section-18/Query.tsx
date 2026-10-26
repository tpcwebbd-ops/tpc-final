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

import { defaultDataSection18, Section18Data, Section18Payload, Section18Props } from "./data";

const ChevronLeft = iconMap.ChevronLeft;
const ChevronRight = iconMap.ChevronRight;

const QuerySection18 = ({ data }: Section18Props) => {
  let sliderData = defaultDataSection18;
  let paddingX = 0;
  let paddingY = 0;

  if (data && typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section18Payload>;
      sliderData = { ...defaultDataSection18, ...parsed } as Section18Data;
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-18 data:", error);
    }
  } else if (data && typeof data === "object") {
    sliderData = { ...defaultDataSection18, ...data } as Section18Data;
    if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
    if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const {
    slides,
    autoplaySpeed,
    isAutoplay,
    infiniteLoop,
    itemsPerSlide,
    height,
    navPosition,
    showArrowsOnHover,
    overlayOpacity,
  } = sliderData;

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= totalSlides - itemsPerSlide) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalSlides - itemsPerSlide) : 0;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!isAutoplay || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalSlides - itemsPerSlide) return infiniteLoop ? 0 : prev;
        return prev + 1;
      });
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, totalSlides, itemsPerSlide, infiniteLoop]);

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const heightClass = {
    auto: "h-auto aspect-video",
    "fixed-sm": "h-[300px]",
    "fixed-md": "h-[500px]",
    "fixed-lg": "h-[700px]",
    screen: "h-screen",
  }[height];

  const getNavClasses = () => {
    switch (navPosition) {
      case "middle-outside":
        return { prev: "-left-12", next: "-right-12", container: "top-1/2 -translate-y-1/2" };
      case "bottom-overlay":
        return { prev: "left-4 bottom-4", next: "left-16 bottom-4", container: "" };
      case "bottom-outside":
        return { prev: "left-0 -bottom-12", next: "left-12 -bottom-12", container: "" };
      case "middle-inside":
      default:
        return { prev: "left-4", next: "right-4", container: "top-1/2 -translate-y-1/2" };
    }
  };
  const navClasses = getNavClasses();

  const itemWidthPercent = 100 / itemsPerSlide;

  if (!slides.length) return <div className="p-10 text-center text-gray-500">No slides configured.</div>;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className={cn(
        "relative group mx-auto w-full max-w-7xl select-none overflow-hidden custom-parent-border bg-white text-stone-800",
        navPosition === "middle-outside" || navPosition === "bottom-outside" ? "mb-12" : "",
      )}
      onMouseEnter={() => sliderData.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => sliderData.pauseOnHover && setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={cn("max-h-[200px] w-full overflow-hidden bg-stone-50 md:max-h-none", heightClass)}>
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${currentIndex * itemWidthPercent}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slide.id} className="flex-shrink-0 h-full relative" style={{ width: `${itemWidthPercent}%` }}>
              <div className="relative w-full h-full overflow-hidden">
                {slide.image ? (
                  <Image
                    width={2200}
                    height={2200}
                    src={slide.image}
                    alt={slide.title}
                    loading={slideIndex === 0 ? "eager" : "lazy"}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-[1800ms] ease-out md:group-hover:scale-105",
                      slideIndex === currentIndex ? "scale-105" : "scale-100",
                    )}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-500">
                    No Image
                  </div>
                )}

                {(slide.title || slide.description) && (
                  <div
                    className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-12"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,${Math.max(0.55, overlayOpacity / 100)}) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)`,
                    }}
                  >
                    <div
                      key={`${slide.id}-${currentIndex}`}
                      className="max-w-xl space-y-2.5 animate-[section18-copy-in_700ms_cubic-bezier(0.22,1,0.36,1)_both] sm:space-y-3"
                    >
                      {slide.title && (
                        <h3 className="text-xl font-bold leading-tight text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] sm:text-3xl md:text-4xl lg:text-5xl">
                          {slide.title}
                        </h3>
                      )}
                      {slide.description && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-base md:text-lg">
                          {slide.description}
                        </p>
                      )}

                      {slide.buttonText && (
                        <Button
                          nativeButton={false}
                          size="sm"
                          className="mt-4 rounded-sm border border-amber-100 bg-[#fffaf0]/95 text-stone-800 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                          render={<Link href={slide.buttonLink || "#"}>{slide.buttonText}</Link>}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSlides > itemsPerSlide && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className={cn(
              "absolute z-10 h-10 w-10 cursor-pointer rounded-full border-stone-200 bg-white/90 text-stone-700 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-indigo-700",
              navClasses.container,
              navClasses.prev,
              showArrowsOnHover
                ? "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                : "opacity-100",
              !infiniteLoop && currentIndex === 0 && "cursor-not-allowed opacity-30 hover:bg-white/90",
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className={cn(
              "absolute z-10 h-10 w-10 cursor-pointer rounded-full border-stone-200 bg-white/90 text-stone-700 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-indigo-700",
              navClasses.container,
              navClasses.next,
              showArrowsOnHover
                ? "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                : "opacity-100",
              !infiniteLoop &&
                currentIndex >= totalSlides - itemsPerSlide &&
                "cursor-not-allowed opacity-30 hover:bg-white/90",
            )}
            disabled={!infiniteLoop && currentIndex >= totalSlides - itemsPerSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: Math.ceil(totalSlides - itemsPerSlide + 1) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 shadow-sm",
              idx === currentIndex ? "w-8 bg-[#f6c866]" : "w-1.5 bg-white/80 hover:bg-[#fff4d6]",
            )}
          />
        ))}
      </div>
      <style>{`
        @keyframes section18-copy-in {
          from { opacity: 0; transform: translateY(28px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
};

export default QuerySection18;
