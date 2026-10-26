/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useRef } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";

import { CategoryIconKey, defaultDataSection36, Section36Data, Section36Payload, Section36Props } from "./data";

const sectionIconMap: Record<CategoryIconKey, React.ElementType> = {
  "shopping-basket": iconMap.ShoppingCart,
  wheat: iconMap.Sparkles,
  sparkles: iconMap.Sparkles,
  laptop: iconMap.Layout,
  plug: iconMap.Link,
  heart: iconMap.Heart,
};
const ChevronLeft = iconMap.ChevronLeft;
const ChevronRight = iconMap.ChevronRight;

const QuerySection36 = ({ data }: Section36Props) => {
  let settings: Section36Data = { ...defaultDataSection36 };
  let paddingX = 0;
  let paddingY = 0;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section36Payload>;
      settings = {
        ...defaultDataSection36,
        ...parsed,
        categories: parsed.categories ?? defaultDataSection36.categories,
      };
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-36 data:", error);
    }
  } else if (data) {
    settings = {
      ...defaultDataSection36,
      ...data,
      categories: data.categories ?? defaultDataSection36.categories,
    } as Section36Data;
    paddingX = Math.max(0, Number((data as Partial<Section36Payload>).paddingX) || 0);
    paddingY = Math.max(0, Number((data as Partial<Section36Payload>).paddingY) || 0);
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const isDragging = useRef(false);

  const scroll = (direction: "left" | "right") => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const isAtStart = carousel.scrollLeft <= 4;
    const isAtEnd = carousel.scrollLeft >= maxScrollLeft - 4;

    if (settings.loop && direction === "left" && isAtStart) {
      carousel.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }
    if (settings.loop && direction === "right" && isAtEnd) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    carousel.scrollBy({ left: direction === "left" ? -360 : 360, behavior: "smooth" });
  };

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel || settings.categories.length < 2) return;

    const autoplay = window.setInterval(() => {
      const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const atEnd = carousel.scrollLeft >= maxScrollLeft - 4;
      if (atEnd) {
        if (settings.loop) carousel.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      carousel.scrollTo({ left: carousel.scrollLeft + carousel.clientWidth, behavior: "smooth" });
    }, 3500);

    return () => window.clearInterval(autoplay);
  }, [settings.categories.length, settings.loop]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = scrollRef.current;
    if (!carousel) return;
    isDragging.current = true;
    dragStartX.current = event.clientX;
    dragStartScrollLeft.current = carousel.scrollLeft;
    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = scrollRef.current;
    if (!carousel || !isDragging.current) return;
    carousel.scrollLeft = dragStartScrollLeft.current - (event.clientX - dragStartX.current);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current?.hasPointerCapture(event.pointerId)) {
      scrollRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className="relative mx-auto w-full max-w-7xl overflow-hidden border border-[#eadfca] custom-parent-border bg-white"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="relative mx-auto flex max-w-7xl items-center px-10 sm:px-14">
        {settings.showNavigationButtons && (
          <Button
            type="button"
            size="sm"
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="absolute left-2 z-10 size-8 cursor-pointer rounded-full border border-gray-100 bg-white p-0 text-gray-600 shadow-lg transition-all duration-700 hover:scale-110 hover:bg-slate-600 hover:text-gray-50 sm:left-4 sm:size-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        )}

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className="scrollbar-hide flex snap-x gap-3 overflow-x-auto px-1 py-2 touch-pan-y cursor-grab active:cursor-grabbing sm:gap-6 sm:px-2 sm:py-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {settings.categories.map((cat, index) => {
            const Icon = sectionIconMap[cat.icon] ?? sectionIconMap["shopping-basket"];

            return (
              <div
                key={cat.id}
                className="group flex h-36 basis-[calc((100vw-3rem)/2)] flex-shrink-0 snap-center cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-2 md:h-44 md:basis-[calc((100vw-5rem)/3)] lg:h-48 lg:basis-[calc((100vw-6rem)/4)] 2xl:basis-[calc((min(1152px,100vw)-6rem)/5)] sm:gap-4 sm:rounded-sm"
                style={{ backgroundColor: settings.cardBackgroundColor, transitionDelay: `${index * 25}ms` }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg shadow-blue-200 transition-colors sm:h-16 sm:w-16"
                  style={
                    {
                      backgroundColor: settings.iconBackgroundColor,
                      "--category-hover-bg": settings.iconHoverBackgroundColor,
                    } as React.CSSProperties
                  }
                >
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <span className="max-w-full px-1 text-center text-xs font-semibold text-gray-700 sm:text-base">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {settings.showNavigationButtons && (
          <Button
            type="button"
            size="sm"
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="absolute right-2 z-10 size-8 cursor-pointer rounded-full border border-gray-100 bg-white p-0 text-gray-600 shadow-lg transition-all duration-700 hover:scale-110 hover:bg-slate-600 hover:text-gray-50 sm:right-4 sm:size-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .group:hover [style*="--category-hover-bg"] {
          background-color: var(--category-hover-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default QuerySection36;
