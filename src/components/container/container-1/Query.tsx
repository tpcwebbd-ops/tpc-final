/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";

import type { PublicContainerProduct } from "@/lib/dashboard/catalog";

import { resolveContainerProducts } from "../product-data";

import { ContainerProps, defaultDataContainer1, IContainerData, TemplateItem, templateImagePlaceholder } from "./data";
import RenderItem from "./RenderItem";

const mobileGridLayoutClasses: Record<IContainerData["mobileGridLayout"], string> = {
  "1x1": "grid-cols-1",
  "1x2": "grid-cols-2",
};

const gridLayoutClasses: Record<IContainerData["gridLayout"], string> = {
  "1x1": "md:grid-cols-1",
  "1x2": "md:grid-cols-2",
  "1x3": "md:grid-cols-3",
};

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
  if (!data) return defaultDataContainer1;

  try {
    const parsedData = typeof data === "string" ? (JSON.parse(data) as Partial<IContainerData>) : data;
    const settings = {
      ...defaultDataContainer1,
      ...parsedData,
      title: parsedData.title || parsedData.sectionTitle || defaultDataContainer1.title,
      sortMode: parsedData.sortMode || defaultDataContainer1.sortMode,
      gridLayout: parsedData.gridLayout || defaultDataContainer1.gridLayout,
      mobileGridLayout: parsedData.mobileGridLayout || defaultDataContainer1.mobileGridLayout,
      showSeeMore: parsedData.showSeeMore ?? defaultDataContainer1.showSeeMore,
      paddingX: String(
        Math.max(-300, Math.min(300, Number(parsedData.paddingX ?? defaultDataContainer1.paddingX) || 0)),
      ),
      paddingY: String(
        Math.max(-300, Math.min(300, Number(parsedData.paddingY ?? defaultDataContainer1.paddingY) || 0)),
      ),
      titleFontFamily: parsedData.titleFontFamily || defaultDataContainer1.titleFontFamily,
      titleFontSize: parsedData.titleFontSize || defaultDataContainer1.titleFontSize,
      titleFontColor: parsedData.titleFontColor || defaultDataContainer1.titleFontColor,
      titleFontWeight: parsedData.titleFontWeight || defaultDataContainer1.titleFontWeight,
      seeMore: {
        ...defaultDataContainer1.seeMore,
        ...(parsedData.seeMore || {}),
        name: parsedData.seeMore?.name || parsedData.viewMoreText || defaultDataContainer1.seeMore.name,
      },
      templates: (parsedData.templates?.length ? parsedData.templates : defaultDataContainer1.templates)
        .filter((template) => !legacyDemoProductUids.has(template.productUID || ""))
        .map(normalizeTemplate),
    };

    return {
      ...settings,
      templates: settings.templates.filter((template) => template.visible),
    };
  } catch {
    return defaultDataContainer1;
  }
};

const QueryContainer1 = ({ data, products }: ContainerProps & { products?: PublicContainerProduct[] }) => {
  const settings = resolveData(data);
  const templates = resolveContainerProducts(settings.templates, products ?? [], settings.sortMode);
  const paddingX = Math.max(0, Number(settings.paddingX) || 0);
  const paddingY = Math.max(0, Number(settings.paddingY) || 0);

  const titleStyle: React.CSSProperties = {
    fontFamily:
      settings.titleFontFamily && settings.titleFontFamily !== "inherit" ? settings.titleFontFamily : undefined,
    fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : undefined,
    color: settings.titleFontColor || undefined,
    fontWeight: settings.titleFontWeight || undefined,
  };

  const mobileGridClassName =
    mobileGridLayoutClasses[settings.mobileGridLayout] ||
    mobileGridLayoutClasses[defaultDataContainer1.mobileGridLayout];
  const gridClassName = gridLayoutClasses[settings.gridLayout] || gridLayoutClasses[defaultDataContainer1.gridLayout];

  return (
    <section
      className="custom-parent-border mx-auto w-full max-w-7xl bg-[#fffdf9]"
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
          <div className={`grid items-stretch gap-3 sm:gap-4 ${mobileGridClassName} ${gridClassName}`}>
            {templates.map((template, index) => (
              <RenderItem
                key={template.id}
                item={template}
                priority={index === 0}
                loading={index < 4 ? "eager" : "lazy"}
                settings={settings}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default QueryContainer1;
