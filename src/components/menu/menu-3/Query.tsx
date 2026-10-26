/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import { Icon, iconMap } from "@/components/all-icons/all-icons";
import { CartButton } from "@/components/cart/CartButton";
import CroppedLogo from "@/components/menu/CroppedLogo";
import type { MenuButton, MenuData, MenuLink } from "@/components/menu/menu-1/data";
import { normalizeSearchQuery, useSiteSearch } from "@/components/search/use-site-search";

const borderClass: Record<NonNullable<MenuButton["border"]>, string> = {
  none: "border-0",
  xs: "border",
  sm: "border",
  md: "border-2",
  xl: "border-4",
};
const radiusClass: Record<MenuButton["radius"], string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};
const imageRadiusClass = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export default function MenuThreeQuery({ data, pending }: { data: MenuData; pending: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const { query, searchOpen, searchRef, setQuery, setSearchOpen } = useMenuSearch();
  const search = useSiteSearch(query, searchOpen, 6);
  const links = data.links.filter((item) => item.visible);
  const mobileLinks = (data.mobile.enabled ? data.mobile.links : data.links).filter((item) => item.visible);
  const position = data.position === "scroll" ? "relative" : data.position;
  const logoSpacing = logoSpacingStyle(data);
  const buttonSpacing = buttonSpacingStyle(data.button);
  const mobilePanelClass = mobileOpen
    ? "absolute inset-x-0 top-full grid grid-rows-[1fr] overflow-hidden border-b border-[#dce3ed] bg-[inherit] px-4 opacity-100 transition-[grid-template-rows,opacity,margin] duration-300 ease-out md:hidden"
    : "absolute inset-x-0 top-full grid grid-rows-[0fr] overflow-hidden border-b border-[#dce3ed] bg-[inherit] px-4 opacity-0 transition-[grid-template-rows,opacity,margin] duration-300 ease-out md:hidden";
  const mobileNavClass = "mx-auto flex min-h-0 w-full max-w-7xl flex-col gap-1 py-3";

  return (
    <header
      className="relative z-50 border-b border-[#dce3ed] px-4 md:px-6"
      onMouseLeave={() => setOpenItemId(null)}
      style={
        {
          ...logoSpacing,
          "--menu-font-size": `${data.fontSize}px`,
          "--menu-accent": data.accent,
          background: rgba(data.background, data.transparency),
          color: data.foreground,
          fontFamily: data.fontFamily,
          position,
          top: position === "relative" ? undefined : 0,
        } as CSSProperties
      }
    >
      <div className="relative mx-auto flex min-h-[56px] max-w-7xl items-center justify-center px-4">
        {(data.showLogo && data.logoUrl) || data.showBrand ? (
          <Link
            className="absolute left-4 flex items-center gap-2 px-[var(--logo-padding-x-mobile)] py-[var(--logo-padding-y-mobile)] mx-[var(--logo-margin-x-mobile)] my-[var(--logo-margin-y-mobile)] md:px-[var(--logo-padding-x-desktop)] md:py-[var(--logo-padding-y-desktop)] md:mx-[var(--logo-margin-x-desktop)] md:my-[var(--logo-margin-y-desktop)]"
            href="/"
          >
            {data.showLogo && data.logoUrl ? <CroppedLogo data={data} heightClassName="h-6 md:h-7" /> : null}
            {data.showBrand ? (
              <span
                className="whitespace-nowrap font-semibold leading-none"
                style={{ color: data.brandColor, fontFamily: data.brandFontFamily, fontSize: data.brandFontSize }}
              >
                {data.brand}
              </span>
            ) : null}
          </Link>
        ) : null}

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {links.map((item) => {
            const children = item.children?.filter((child) => child.visible) ?? [];
            const hasChildren = children.length > 0;
            const isOpen = hasChildren && openItemId === item.id;
            return (
              <div className="relative" key={item.id}>
                <Link
                  aria-expanded={hasChildren ? isOpen : undefined}
                  className={`relative flex items-center gap-1.5 py-0 text-[length:var(--menu-font-size)] font-semibold leading-5 transition-colors hover:text-[var(--menu-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--menu-accent)] ${isOpen ? "text-[var(--menu-accent)]" : ""}`}
                  href={item.url}
                  onFocus={() => hasChildren && setOpenItemId(item.id)}
                  onMouseEnter={() => hasChildren && setOpenItemId(item.id)}
                >
                  <MenuLinkVisual item={item} size="main" />
                  <span>{item.label}</span>
                  {hasChildren ? (
                    <span
                      aria-hidden="true"
                      className={`grid size-3.5 place-items-center text-slate-600 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <Icon name="ChevronDown" />
                    </span>
                  ) : null}
                </Link>
                {isOpen ? (
                  <div className="animate-in fade-in-0 slide-in-from-top-1 absolute left-1/2 top-full z-10 mt-3 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-[#dce3ed] bg-white px-4 py-3 duration-200 ease-out shadow-[0_14px_24px_rgba(15,23,42,0.06)]">
                    <div className="grid grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                      {children.map((child) => (
                        <DropdownCard item={child} key={child.id} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="absolute right-4 flex items-center gap-2">
          <button
            aria-controls="menu-three-search"
            aria-expanded={searchOpen}
            aria-label="Open search"
            className="grid size-8 place-items-center rounded-sm border border-slate-200 p-0 transition hover:bg-slate-100"
            onClick={() => {
              setOpenItemId(null);
              setSearchOpen(true);
            }}
            type="button"
          >
            <Icon name="Search" />
          </button>
          <CartButton className="border-slate-200 hover:bg-slate-100" />
          {pending ? (
            <span className="h-8 w-16 animate-pulse rounded-full bg-slate-100" />
          ) : data.button.visible !== false ? (
            <Link
              className={`menu-action-button inline-flex shrink-0 items-center gap-1.5 px-[var(--button-padding-x-mobile)] py-[var(--button-padding-y-mobile)] mx-[var(--button-margin-x-mobile)] my-[var(--button-margin-y-mobile)] text-sm font-semibold transition-colors md:px-[var(--button-padding-x-desktop)] md:py-[var(--button-padding-y-desktop)] md:mx-[var(--button-margin-x-desktop)] md:my-[var(--button-margin-y-desktop)] ${borderClass[data.button.border ?? "none"]} ${radiusClass[data.button.radius]}`}
              href={data.button.url}
              style={{
                ...buttonSpacing,
                background: data.button.transparentBackground
                  ? rgba(data.button.background, data.button.transparency)
                  : data.button.background,
                borderColor: data.button.foreground,
                color: data.button.foreground,
              }}
            >
              {data.button.showIcon && data.button.icon ? <Icon name={data.button.icon} /> : null}
              {data.button.label}
            </Link>
          ) : null}
          <button
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
            className="grid size-8 place-items-center rounded-sm border border-slate-200 p-0 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            <Icon name={mobileOpen ? "X" : "Menu"} />
          </button>
        </div>
      </div>

      {searchOpen ? (
        <MenuSearchPanel
          accent={data.accent}
          id="menu-three-search"
          onClear={() => setQuery("")}
          onQueryChange={setQuery}
          panelRef={searchRef}
          query={query}
          search={search}
        />
      ) : null}

      <div className={mobilePanelClass}>
        <nav className={mobileNavClass}>
          {mobileLinks
            .slice(0, data.mobile.layout === "flex" ? (data.mobile.flexItems ?? 4) : undefined)
            .map((item) => (
              <MobileLink
                align={data.mobile.layout === "flex" ? (data.mobile.flexTextAlign ?? "center") : undefined}
                item={item}
                key={item.id}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
        </nav>
      </div>
    </header>
  );
}

function MenuSearchPanel({
  accent,
  id,
  onClear,
  onQueryChange,
  panelRef,
  query,
  search,
}: {
  accent: string;
  id: string;
  onClear: () => void;
  onQueryChange: (query: string) => void;
  panelRef: RefObject<HTMLElement | null>;
  query: string;
  search: ReturnType<typeof useSiteSearch>;
}) {
  const hasSearchQuery = query.trim().length >= 3;
  return (
    <section
      aria-label="Site search"
      className="absolute inset-x-0 top-full z-20 border-b border-[#dce3ed] bg-white px-4 py-3 shadow-[0_14px_24px_rgba(15,23,42,0.06)]"
      id={id}
      ref={panelRef}
      role="search"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-2 rounded-lg border border-[#dce3ed] bg-slate-50 p-1.5">
          <span className="pl-2">
            <Icon name="Search" />
          </span>
          <label className="sr-only" htmlFor={`${id}-input`}>
            Search site
          </label>
          <input
            autoFocus
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
            id={`${id}-input`}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
            type="text"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search text"
              className="grid size-8 shrink-0 place-items-center rounded-md transition hover:bg-slate-200"
              onClick={onClear}
              style={{ color: accent }}
              type="button"
            >
              <Icon name="X" />
            </button>
          ) : null}
        </div>
        {hasSearchQuery ? <MenuSearchResults query={query} search={search} /> : null}
      </div>
    </section>
  );
}

function MenuSearchResults({ query, search }: { query: string; search: ReturnType<typeof useSiteSearch> }) {
  const normalizedQuery = normalizeSearchQuery(query);
  const destination = `/search?q=${encodeURIComponent(normalizedQuery)}`;
  return (
    <div className="mt-2 rounded-lg border border-[#dce3ed] bg-white p-2 text-sm text-slate-700 shadow-sm">
      {search.isLoading ? <p className="px-2 py-1.5">Searching…</p> : null}
      {!search.isLoading && search.error ? <p className="px-2 py-1.5 text-red-700">{search.error}</p> : null}
      {!search.isLoading && !search.error && !search.items.length ? (
        <p className="px-2 py-1.5 text-slate-500">No results found.</p>
      ) : null}
      {!search.isLoading && !search.error
        ? search.items.slice(0, 6).map((item) => (
            <Link
              className="block rounded-md px-2 py-2 transition hover:bg-slate-100"
              href={
                item.scope === "page"
                  ? `/search/result?page=${encodeURIComponent(item.pageId)}&scope=page&q=${encodeURIComponent(normalizedQuery)}`
                  : `/search/result?page=${encodeURIComponent(item.pageId)}&block=${encodeURIComponent(item.blockId ?? "")}&q=${encodeURIComponent(normalizedQuery)}`
              }
              key={item.id}
            >
              <span className="block font-medium text-slate-900">{item.pageTitle}</span>
              <span className="block truncate text-xs text-slate-500">{item.excerpt}</span>
            </Link>
          ))
        : null}
      {!search.isLoading && !search.error && search.total > 6 ? (
        <Link
          className="mt-1 block rounded-md bg-slate-100 px-3 py-2 text-center font-medium hover:bg-slate-200"
          href={destination}
        >
          Search Page
        </Link>
      ) : null}
    </div>
  );
}

function useMenuSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !searchRef.current?.contains(event.target)) {
        setQuery("");
        setSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [searchOpen]);

  return { query, searchOpen, searchRef, setQuery, setSearchOpen };
}

function DropdownCard({ item }: { item: MenuLink }) {
  const children = item.children?.filter((child) => child.visible) ?? [];
  return (
    <div className="group relative">
      <Link
        className="flex min-h-[56px] items-center gap-2 rounded-xl bg-[#f5f6fb] px-4 py-2 text-[15px] font-medium text-slate-800 transition-colors hover:bg-[#eceff7]"
        href={item.url}
      >
        <MenuLinkVisual item={item} size="card" />
        <span className="min-w-0 truncate">{item.label}</span>
        {children.length ? (
          <span className="ml-auto text-slate-400">
            <Icon name="ChevronRight" />
          </span>
        ) : null}
      </Link>
      {children.length ? (
        <div className="invisible absolute left-full top-0 z-10 w-72 border border-[#dce3ed] bg-white p-1.5 opacity-0 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition-opacity duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          {children.map((child) => (
            <SubSubmenuLink item={child} key={child.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SubSubmenuLink({ item }: { item: MenuLink }) {
  return (
    <Link
      className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-[#f5f6fb] hover:text-slate-950"
      href={item.url}
    >
      <MenuLinkVisual item={item} size="sub" />
      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  );
}

function MobileLink({
  item,
  align,
  onNavigate,
}: {
  item: MenuLink;
  align?: "left" | "center" | "right";
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const children = item.children?.filter((child) => child.visible) ?? [];
  const hasChildren = children.length > 0;
  const alignment = align
    ? { left: "justify-start text-left", center: "justify-center text-center", right: "justify-end text-right" }[align]
    : "justify-start text-left";
  return (
    <div className="w-full">
      <div className="flex w-full items-center rounded-lg bg-slate-50">
        <Link
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-slate-100 ${alignment}`}
          href={item.url}
          onClick={onNavigate}
        >
          <MenuLinkVisual item={item} size="sub" />
          <span className="min-w-0 truncate">{item.label}</span>
        </Link>
        {hasChildren ? (
          <button
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
            className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <Icon name={open ? "ChevronDown" : "ChevronRight"} />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="ml-3 border-l border-slate-200 pl-2 pt-1">
              {children.map((child) => (
                <MobileLink item={child} key={child.id} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLinkVisual({ item, size }: { item: MenuLink; size: "main" | "card" | "sub" }) {
  const dimensions = {
    main:
      item.imageCrop === "16:9"
        ? { className: "h-4 w-7", height: 16, width: 28 }
        : { className: "size-4", height: 16, width: 16 },
    card:
      item.imageCrop === "16:9"
        ? { className: "h-6 w-10", height: 24, width: 40 }
        : { className: "size-6", height: 24, width: 24 },
    sub:
      item.imageCrop === "16:9"
        ? { className: "h-4 w-7", height: 16, width: 28 }
        : { className: "size-4", height: 16, width: 16 },
  }[size];
  if (item.showImage && item.imageUrl)
    return (
      <Image
        alt=""
        className={`shrink-0 ${dimensions.className} ${item.imageCrop === "full" ? "object-contain" : "object-cover"} ${imageRadiusClass[item.imageRadius ?? "none"]}`}
        height={dimensions.height}
        src={item.imageUrl}
        width={dimensions.width}
      />
    );
  if (item.showIcon && item.icon && iconMap[item.icon])
    return (
      <span className="grid shrink-0 place-items-center text-slate-600">
        <Icon name={item.icon} />
      </span>
    );
  return null;
}

function rgba(color: string, opacity: number) {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const value = Number.parseInt(hex, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${opacity / 100})`;
}
function logoSpacingStyle(data: MenuData): CSSProperties {
  return {
    "--logo-padding-x-mobile": `${data.logoMobilePaddingX ?? data.logoPaddingX ?? 0}px`,
    "--logo-padding-y-mobile": `${data.logoMobilePaddingY ?? data.logoPaddingY ?? 0}px`,
    "--logo-margin-x-mobile": `${data.logoMobileMarginX ?? data.logoMarginX ?? 0}px`,
    "--logo-margin-y-mobile": `${data.logoMobileMarginY ?? data.logoMarginY ?? 0}px`,
    "--logo-padding-x-desktop": `${data.logoDesktopPaddingX ?? data.logoPaddingX ?? 0}px`,
    "--logo-padding-y-desktop": `${data.logoDesktopPaddingY ?? data.logoPaddingY ?? 0}px`,
    "--logo-margin-x-desktop": `${data.logoDesktopMarginX ?? data.logoMarginX ?? 0}px`,
    "--logo-margin-y-desktop": `${data.logoDesktopMarginY ?? data.logoMarginY ?? 0}px`,
  } as CSSProperties;
}
function buttonSpacingStyle(button: MenuButton): CSSProperties {
  return {
    "--button-padding-x-mobile": `${button.mobilePaddingX ?? button.paddingX}px`,
    "--button-padding-y-mobile": `${button.mobilePaddingY ?? button.paddingY}px`,
    "--button-margin-x-mobile": `${button.mobileMarginX ?? button.marginX ?? 0}px`,
    "--button-margin-y-mobile": `${button.mobileMarginY ?? button.marginY ?? 0}px`,
    "--button-padding-x-desktop": `${button.desktopPaddingX ?? button.paddingX}px`,
    "--button-padding-y-desktop": `${button.desktopPaddingY ?? button.paddingY}px`,
    "--button-margin-x-desktop": `${button.desktopMarginX ?? button.marginX ?? 0}px`,
    "--button-margin-y-desktop": `${button.desktopMarginY ?? button.marginY ?? 0}px`,
  } as CSSProperties;
}
