/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import type { PublicContainerProduct } from "@/lib/dashboard/catalog";

import { resolveContainerProducts } from "../product-data";

import {
  containerGridItemWidth,
  containerMobileGridItemWidth,
  ContainerProps,
  defaultDataContainer2,
  IContainerData,
  TemplateItem,
  templateImagePlaceholder,
} from "./data";
import RenderItem from "./RenderItem";

const cn = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

const mobileItemsPerSlide: Record<IContainerData["mobileGridLayout"], number> = {
  "1x1": 1,
  "1x2": 2,
};

const desktopItemsPerSlide: Record<IContainerData["gridLayout"], number> = {
  "1x1": 1,
  "1x2": 2,
  "1x3": 3,
};

const noProducts: PublicContainerProduct[] = [];

const legacyDemoProductUids = new Set(["THEME-001", "THEME-002", "THEME-003", "THEME-004"]);

const normalizeTemplate = (template: Partial<TemplateItem>, index: number): TemplateItem => ({
  id: Number.isFinite(Number(template.id)) ? Number(template.id) : index + 1,
  sourceProductId: typeof template.sourceProductId === "string" ? template.sourceProductId : undefined,
  productUID: typeof template.productUID === "string" ? template.productUID : "",
  title: typeof template.title === "string" && template.title.trim() ? template.title : "Untitled Product",
  price: typeof template.price === "string" ? template.price : "0৳",
  views: typeof template.views === "string" ? template.views : "0",
  rating: Math.min(5, Math.max(0, Number(template.rating) || 0)),
  image: typeof template.image === "string" && template.image ? template.image : templateImagePlaceholder,
  url: typeof template.url === "string" ? template.url : "",
  visible: template.visible ?? true,
});

const resolveData = (data?: IContainerData | string): IContainerData => {
  if (!data) return defaultDataContainer2;

  try {
    const parsedData = typeof data === "string" ? (JSON.parse(data) as Partial<IContainerData>) : data;
    const settings = {
      ...defaultDataContainer2,
      ...parsedData,
      title: parsedData.title || parsedData.sectionTitle || defaultDataContainer2.title,
      sortMode: parsedData.sortMode || defaultDataContainer2.sortMode,
      gridLayout: parsedData.gridLayout || defaultDataContainer2.gridLayout,
      mobileGridLayout: parsedData.mobileGridLayout || defaultDataContainer2.mobileGridLayout,
      showSeeMore: parsedData.showSeeMore ?? defaultDataContainer2.showSeeMore,
      showBottomNavigation: parsedData.showBottomNavigation ?? defaultDataContainer2.showBottomNavigation,
      paddingX: String(
        Math.max(-300, Math.min(300, Number(parsedData.paddingX ?? defaultDataContainer2.paddingX) || 0)),
      ),
      paddingY: String(
        Math.max(-300, Math.min(300, Number(parsedData.paddingY ?? defaultDataContainer2.paddingY) || 0)),
      ),
      titleFontFamily: parsedData.titleFontFamily || defaultDataContainer2.titleFontFamily,
      titleFontSize: parsedData.titleFontSize || defaultDataContainer2.titleFontSize,
      titleFontColor: parsedData.titleFontColor || defaultDataContainer2.titleFontColor,
      titleFontWeight: parsedData.titleFontWeight || defaultDataContainer2.titleFontWeight,
      seeMore: {
        ...defaultDataContainer2.seeMore,
        ...(parsedData.seeMore || {}),
        name: parsedData.seeMore?.name || parsedData.viewMoreText || defaultDataContainer2.seeMore.name,
      },
      templates: (parsedData.templates?.length ? parsedData.templates : defaultDataContainer2.templates)
        .filter((template) => !legacyDemoProductUids.has(template.productUID || ""))
        .map(normalizeTemplate),
    };

    return {
      ...settings,
      templates: settings.templates.filter((template) => template.visible),
    };
  } catch {
    return defaultDataContainer2;
  }
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
};

const QueryContainer2 = ({ data, products }: ContainerProps & { products?: PublicContainerProduct[] }) => {
  const settings = useMemo(() => resolveData(data), [data]);
  const templates = useMemo(
    () => resolveContainerProducts(settings.templates, products ?? noProducts, settings.sortMode),
    [products, settings],
  );
  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const paddingX = Math.max(0, Number(settings.paddingX) || 0);
  const paddingY = Math.max(0, Number(settings.paddingY) || 0);

  const titleStyle: React.CSSProperties = {
    fontFamily:
      settings.titleFontFamily && settings.titleFontFamily !== "inherit" ? settings.titleFontFamily : undefined,
    fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : undefined,
    color: settings.titleFontColor || undefined,
    fontWeight: settings.titleFontWeight || undefined,
  };

  const visibleItems = isDesktop
    ? desktopItemsPerSlide[settings.gridLayout] || desktopItemsPerSlide[defaultDataContainer2.gridLayout]
    : mobileItemsPerSlide[settings.mobileGridLayout] || mobileItemsPerSlide[defaultDataContainer2.mobileGridLayout];
  const maxIndex = Math.max(0, templates.length - visibleItems);
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);
  const canSlide = templates.length > visibleItems;
  const shouldShowBottomNavigation = settings.showBottomNavigation && canSlide;
  const itemWidth = isDesktop
    ? containerGridItemWidth[settings.gridLayout] || containerGridItemWidth[defaultDataContainer2.gridLayout]
    : containerMobileGridItemWidth[settings.mobileGridLayout] ||
      containerMobileGridItemWidth[defaultDataContainer2.mobileGridLayout];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const currentIndex = Math.min(prev, maxIndex);
      return currentIndex >= maxIndex ? 0 : currentIndex + 1;
    });
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const currentIndex = Math.min(prev, maxIndex);
      return currentIndex <= 0 ? maxIndex : currentIndex - 1;
    });
  }, [maxIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!canSlide || isPaused || prefersReducedMotion) return;

    const interval = window.setInterval(nextSlide, 3500);
    return () => window.clearInterval(interval);
  }, [canSlide, isPaused, nextSlide, prefersReducedMotion]);

  return (
    <section
      className="custom-parent-border mx-auto w-full min-w-0 max-w-7xl bg-[#fffdf9]"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4 sm:mb-6 sm:pb-5">
          <h2
            className="min-w-0 text-xl font-bold leading-tight text-stone-900 sm:text-2xl md:text-3xl"
            style={titleStyle}
          >
            {settings.title}
          </h2>
          {settings.showSeeMore && (
            <Link
              href={settings.seeMore.url || "#"}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-sm border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none"
            >
              {settings.seeMore.name}
            </Link>
          )}
        </div>

        {templates.length === 0 ? (
          <div className="rounded-sm border border-dashed border-stone-300 bg-white px-5 py-10 text-center sm:py-14">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700"
            >
              ⌕
            </span>
            <h3 className="mt-3 text-base font-semibold text-stone-900">No products to show yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-stone-600">
              No visible products are assigned to this section yet.
            </p>
            {settings.showSeeMore && (
              <Link
                href={settings.seeMore.url || "#"}
                className="mt-4 inline-flex min-h-11 items-center rounded-sm bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {settings.seeMore.name}
              </Link>
            )}
          </div>
        ) : (
          <div
            className="relative w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
            }}
          >
            {canSlide && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-1 top-1/2 z-10 h-11 w-11 -translate-y-1/2 cursor-pointer rounded-sm border border-stone-200 bg-white/95 text-stone-800 shadow-sm transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none sm:left-2"
                aria-label="Previous template"
              >
                <Icon name="ArrowLeft" />
              </Button>
            )}

            <div
              className="overflow-hidden"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div
                className="flex items-stretch transition-transform duration-500 ease-in-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${safeCurrentIndex * (100 / visibleItems)}%)` }}
              >
                {templates.map((template, index) => (
                  <div
                    key={template.id}
                    className={cn("flex min-w-0 shrink-0 px-1.5 py-1 sm:px-2")}
                    style={{ flexBasis: itemWidth, maxWidth: itemWidth }}
                  >
                    <div className="flex h-full w-full min-w-0">
                      <RenderItem
                        item={template}
                        priority={index === 0}
                        loading={index < 4 ? "eager" : "lazy"}
                        settings={settings}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canSlide && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-1 top-1/2 z-10 h-11 w-11 -translate-y-1/2 cursor-pointer rounded-sm border border-stone-200 bg-white/95 text-stone-800 shadow-sm transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none sm:right-2"
                aria-label="Next template"
              >
                <Icon name="ArrowRight" />
              </Button>
            )}

            {shouldShowBottomNavigation && (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                  const isActive = index === safeCurrentIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className="flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-transparent px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transition-none"
                      aria-label={`Show product group ${index + 1}`}
                      aria-pressed={isActive}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-2.5 rounded-full border border-amber-300 transition-all motion-reduce:transition-none",
                          isActive ? "w-8 bg-amber-500" : "w-2.5 bg-white hover:bg-amber-100",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default QueryContainer2;
