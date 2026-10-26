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

import { authClient } from "@/app/api/lib/auth-client";
import { Icon } from "@/components/all-icons/all-icons";
import { CartButton } from "@/components/cart/CartButton";
import CroppedLogo from "@/components/menu/CroppedLogo";
import { normalizeSearchQuery, useSiteSearch } from "@/components/search/use-site-search";

import type { MenuButton, MenuData, MenuLink } from "./data";

const sizeClass: Record<number, string> = {
  12: "text-xs",
  14: "text-sm",
  16: "text-base",
  20: "text-xl",
  24: "text-2xl",
  30: "text-3xl",
  36: "text-4xl",
};
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
const mobileFlexAlignment: Record<"left" | "center" | "right", string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};
function background(color: string, opacity: number) {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const n = Number.parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity / 100})`;
}
function NavLink({
  item,
  depth = 0,
  mobileFlexAlign,
}: {
  item: MenuLink;
  depth?: number;
  mobileFlexAlign?: "left" | "center" | "right";
}) {
  const itemIcon = item.showIcon && item.icon ? item.icon : null;
  const imageRadius = {
    none: "rounded-none",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[item.imageRadius ?? "none"];
  const imageCrop = item.imageCrop ?? "1:1";
  const imageWidth = imageCrop === "16:9" ? 36 : 20;
  const imageHeight = 20;
  const children = item.children?.filter((child) => child.visible) ?? [];
  const hasChildren = children.length > 0;
  const label = item.label.length > 30 ? `${item.label.slice(0, 30)}...` : item.label;
  return (
    <div className={`relative ${mobileFlexAlign ? "w-full" : ""}`}>
      <Link
        className={`peer flex items-center gap-1 rounded-sm px-3 py-2 font-medium text-[length:var(--menu-font-size)] transition-colors duration-200 hover:bg-orange-50 hover:text-orange-900 ${depth > 0 ? "w-full justify-between gap-4" : ""} ${mobileFlexAlign ? `w-full ${mobileFlexAlignment[mobileFlexAlign]}` : ""}`}
        href={item.url}
        title={item.label}
      >
        {item.showImage && item.imageUrl ? (
          <Image
            alt=""
            className={`${imageCrop === "16:9" ? "h-5 w-9" : "size-5"} ${imageCrop === "full" ? "object-contain" : "object-cover"} ${imageRadius}`}
            height={imageHeight}
            src={item.imageUrl}
            width={imageWidth}
          />
        ) : itemIcon ? (
          <Icon name={itemIcon} />
        ) : null}
        <span className="min-w-0 truncate">{label}</span>
        {hasChildren ? (
          <span aria-hidden="true" className="ml-1 grid size-4 shrink-0 place-items-center text-stone-500">
            <Icon name={depth === 0 ? "ChevronDown" : "ChevronRight"} />
          </span>
        ) : null}
      </Link>
      {hasChildren ? (
        <div
          className={`invisible absolute z-[60] w-max max-w-[calc(100vw-2rem)] whitespace-nowrap rounded-sm border border-stone-200 bg-white p-1.5 opacity-0 shadow-xl transition duration-200 peer-hover:visible peer-hover:opacity-100 hover:visible hover:opacity-100 ${depth === 0 ? "left-0 top-full" : "left-full top-0"}`}
        >
          {children.map((child) => (
            <NavLink depth={depth + 1} item={child} key={child.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
function MobileNavLink({
  item,
  mobileFlexAlign,
  onNavigate,
}: {
  item: MenuLink;
  mobileFlexAlign?: "left" | "center" | "right";
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const itemIcon = item.showIcon && item.icon ? item.icon : null;
  const imageRadius = {
    none: "rounded-none",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[item.imageRadius ?? "none"];
  const imageCrop = item.imageCrop ?? "1:1";
  const imageWidth = imageCrop === "16:9" ? 36 : 20;
  const imageHeight = 20;
  const children = item.children?.filter((child) => child.visible) ?? [];
  const hasChildren = children.length > 0;
  const label = item.label.length > 30 ? `${item.label.slice(0, 30)}...` : item.label;

  return (
    <div className="w-full">
      <div className="flex w-full items-center rounded-sm border-b border-stone-100">
        <Link
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-sm px-3 py-3 font-medium text-[length:var(--menu-font-size)] transition-colors hover:bg-orange-50 hover:text-orange-900 ${mobileFlexAlign ? mobileFlexAlignment[mobileFlexAlign] : ""}`}
          href={item.url}
          onClick={onNavigate}
          title={item.label}
        >
          {item.showImage && item.imageUrl ? (
            <Image
              alt=""
              className={`${imageCrop === "16:9" ? "h-5 w-9" : "size-5"} ${imageCrop === "full" ? "object-contain" : "object-cover"} ${imageRadius}`}
              height={imageHeight}
              src={item.imageUrl}
              width={imageWidth}
            />
          ) : itemIcon ? (
            <Icon name={itemIcon} />
          ) : null}
          <span className="min-w-0 truncate">{label}</span>
        </Link>
        {hasChildren ? (
          <button
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
            className="grid size-10 shrink-0 place-items-center rounded-sm text-stone-500 transition-colors hover:bg-orange-50 hover:text-orange-900"
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
            <div className="ml-3 border-l border-stone-200 pl-2">
              {children.map((child) => (
                <MobileNavLink item={child} key={child.id} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
function buttonCopy(button: MenuButton, signedIn: boolean) {
  if (button.type === "dashboard" || button.type === "login")
    return signedIn ? { label: "Dashboard", url: "/dashboard" } : { label: "Login", url: "/login" };
  return { label: button.label || "Continue", url: button.url || "/" };
}
export default function MenuOneQuery({ data, pending }: { data: MenuData; pending: boolean }) {
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { query, searchOpen, searchRef, setQuery, setSearchOpen } = useMenuSearch();
  const search = useSiteSearch(query, searchOpen, 6);
  const button = buttonCopy(data.button, Boolean(session?.user));
  const position = data.position === "scroll" ? "relative" : data.position;
  const mobileLinks = (data.mobile.enabled ? data.mobile.links : data.links).filter((item) => item.visible);
  const logoSpacing = logoSpacingStyle(data);
  const buttonSpacing = buttonSpacingStyle(data.button);
  return (
    <header
      className="z-50 border-b border-stone-200 py-3 shadow-sm backdrop-blur"
      style={
        {
          ...logoSpacing,
          "--menu-font-size": `${data.fontSize}px`,
          background: background(data.background, data.transparency),
          color: data.foreground,
          position,
          top: position === "relative" ? undefined : 0,
        } as CSSProperties
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <Link
          className="flex min-w-0 items-center gap-2 px-[var(--logo-padding-x-mobile)] py-[var(--logo-padding-y-mobile)] mx-[var(--logo-margin-x-mobile)] my-[var(--logo-margin-y-mobile)] md:px-[var(--logo-padding-x-desktop)] md:py-[var(--logo-padding-y-desktop)] md:mx-[var(--logo-margin-x-desktop)] md:my-[var(--logo-margin-y-desktop)] font-bold"
          href="/"
          style={logoSpacing}
        >
          {data.showLogo && data.logoUrl ? <CroppedLogo data={data} heightClassName="h-9" /> : null}
          {data.showBrand ? (
            <span
              className={sizeClass[data.brandFontSize] ?? "text-base"}
              style={{ color: data.brandColor, fontFamily: data.brandFontFamily }}
            >
              {data.brand}
            </span>
          ) : null}
        </Link>
        <nav className="hidden items-center gap-1 md:flex" style={{ fontFamily: data.fontFamily }}>
          {data.links
            .filter((item) => item.visible)
            .map((item) => (
              <NavLink item={item} key={item.id} />
            ))}
        </nav>
        {pending ? (
          <span className="h-8 w-16 animate-pulse rounded-sm bg-stone-100" />
        ) : (
          <div className="flex items-center gap-2">
            <button
              aria-controls="menu-one-search"
              aria-expanded={searchOpen}
              aria-label="Open search"
              className="grid size-9 place-items-center rounded-sm border border-stone-200 p-0 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-900"
              onClick={() => setSearchOpen(true)}
              type="button"
            >
              <Icon name="Search" />
            </button>
            <CartButton className="size-9 border-stone-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-900" />
            {data.button.visible !== false ? (
              <Link
                className={`menu-action-button inline-flex items-center gap-1 px-[var(--button-padding-x-mobile)] py-[var(--button-padding-y-mobile)] mx-[var(--button-margin-x-mobile)] my-[var(--button-margin-y-mobile)] md:px-[var(--button-padding-x-desktop)] md:py-[var(--button-padding-y-desktop)] md:mx-[var(--button-margin-x-desktop)] md:my-[var(--button-margin-y-desktop)] ${borderClass[data.button.border ?? "none"]} ${radiusClass[data.button.radius]}`}
                href={button.url}
                style={{
                  ...buttonSpacing,
                  background: data.button.transparentBackground
                    ? background(data.button.background, data.button.transparency)
                    : data.button.background,
                  borderColor: data.button.foreground,
                  color: data.button.foreground,
                }}
              >
                {data.button.showIcon && data.button.icon ? <Icon name={data.button.icon} /> : null}
                {button.label}
              </Link>
            ) : null}
            <button
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
              className="grid size-9 place-items-center rounded-sm border border-stone-200 p-0 transition-colors hover:bg-orange-50 md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              type="button"
            >
              <Icon name={mobileOpen ? "X" : "Menu"} />
            </button>
          </div>
        )}
      </div>
      {searchOpen ? (
        <MenuSearchPanel
          accent={data.accent}
          id="menu-one-search"
          onClear={() => setQuery("")}
          onQueryChange={setQuery}
          panelRef={searchRef}
          query={query}
          search={search}
        />
      ) : null}
      <div
        className={`absolute inset-x-0 top-full grid overflow-hidden border-b border-stone-200 bg-[inherit] px-4 shadow-lg transition-[grid-template-rows,opacity,margin] duration-300 ease-out md:hidden ${mobileOpen ? "mt-0 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}
      >
        <nav
          className="mx-auto flex min-h-0 w-full max-w-6xl flex-col gap-1 py-3"
          style={{ fontFamily: data.fontFamily }}
        >
          {mobileLinks
            .slice(0, data.mobile.layout === "flex" ? (data.mobile.flexItems ?? 4) : undefined)
            .map((item) => (
              <MobileNavLink
                item={item}
                key={item.id}
                mobileFlexAlign={data.mobile.layout === "flex" ? (data.mobile.flexTextAlign ?? "center") : undefined}
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
      className="absolute inset-x-0 top-full z-[70] border-b border-stone-200 bg-white px-4 py-3 shadow-xl"
      id={id}
      ref={panelRef}
      role="search"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-2 rounded-sm border border-stone-200 bg-white p-1.5 shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <span className="pl-2">
            <Icon name="Search" />
          </span>
          <label className="sr-only" htmlFor={`${id}-input`}>
            Search site
          </label>
          <input
            autoFocus
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-stone-400"
            id={`${id}-input`}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
            type="text"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search text"
              className="grid size-8 shrink-0 place-items-center rounded-sm transition-colors hover:bg-orange-50"
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
    <div className="mt-2 rounded-sm border border-stone-200 bg-white p-2 text-sm text-stone-700 shadow-lg">
      {search.isLoading ? <p className="px-2 py-1.5">Searching…</p> : null}
      {!search.isLoading && search.error ? <p className="px-2 py-1.5 text-red-700">{search.error}</p> : null}
      {!search.isLoading && !search.error && !search.items.length ? (
        <p className="px-2 py-1.5 text-stone-500">No results found.</p>
      ) : null}
      {!search.isLoading && !search.error
        ? search.items.slice(0, 6).map((item) => (
            <Link
              className="block rounded-sm px-2 py-2 transition-colors hover:bg-orange-50"
              href={
                item.scope === "page"
                  ? `/search/result?page=${encodeURIComponent(item.pageId)}&scope=page&q=${encodeURIComponent(normalizedQuery)}`
                  : `/search/result?page=${encodeURIComponent(item.pageId)}&block=${encodeURIComponent(item.blockId ?? "")}&q=${encodeURIComponent(normalizedQuery)}`
              }
              key={item.id}
            >
              <span className="block font-medium text-stone-900">{item.pageTitle}</span>
              <span className="block truncate text-xs text-stone-500">{item.excerpt}</span>
            </Link>
          ))
        : null}
      {!search.isLoading && !search.error && search.total > 6 ? (
        <Link
          className="mt-1 block rounded-sm bg-orange-100 px-3 py-2 text-center font-medium text-orange-950 transition-colors hover:bg-orange-200"
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
