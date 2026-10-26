/*
|-----------------------------------------
| setting up shared Leads UI
| @author: Codex
|-----------------------------------------
*/

"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/app/api/lib/utils";
import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeadKind, LeadStatus } from "@/lib/dashboard/leads";
import { useGetLeadOptionsQuery } from "@/redux/features/dashboard/leads/leadsSlice";

import { leadPanel } from "./presentation";

export const normalButton =
  "h-9 cursor-pointer gap-1.5 rounded-sm border-[#eadfca] bg-white px-3 text-xs font-semibold text-stone-600 shadow-xs transition duration-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-amber-300 motion-reduce:transition-none";
export function Action({
  tone = "normal",
  className = "",
  ...props
}: ComponentProps<typeof Button> & { tone?: "normal" | "primary" | "save" | "delete" }) {
  return (
    <Button
      {...props}
      className={`${normalButton} ${tone === "primary" ? "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-200 hover:border-amber-700 hover:bg-amber-700 hover:text-white" : tone === "save" ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900" : tone === "delete" ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-800" : ""} ${className}`}
      size="sm"
      variant="outline"
    />
  );
}
export function PageHeading({
  title,
  description,
  caption,
  icon,
  iconClass,
  children,
  hideTitleOnMobile = false,
}: {
  title: string;
  description?: string;
  caption?: string;
  icon: string;
  iconClass: string;
  children?: ReactNode;
  hideTitleOnMobile?: boolean;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-1">
      <div className={`flex min-w-0 items-start gap-3 sm:gap-4 ${hideTitleOnMobile ? "sr-only sm:not-sr-only" : ""}`}>
        <span className={`grid size-12 shrink-0 place-items-center rounded-sm border ${iconClass}`}>
          <Icon name={icon} className="size-6" />
        </span>
        <div className="min-w-0">
          {caption && (
            <p className="mb-1 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">{caption}</p>
          )}
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}
export function LeadAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-sm border border-amber-100 bg-amber-50 text-xs font-bold text-amber-700",
        className,
      )}
    >
      {initials || "—"}
    </span>
  );
}
export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${status === "active" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-[#eadfca] bg-slate-50 text-slate-500"}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-stone-400"}`}
      />
      {status}
    </span>
  );
}
export function EmptyState({
  title,
  description,
  icon = "Search",
  children,
}: {
  title: string;
  description?: string;
  icon?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid justify-items-center gap-3 px-5 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-sm border border-amber-100 bg-amber-50 text-amber-700 shadow-sm">
        <Icon name={icon} className="size-6" />
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function LeadSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className="h-10 cursor-pointer gap-3 rounded-sm border border-[#eadfca] bg-white px-3 text-xs font-medium text-stone-600 outline-none transition duration-700 hover:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-100 motion-reduce:transition-none"
          disabled={disabled}
        >
          <span className="truncate">{options.find((option) => option.value === value)?.label ?? label}</span>
          <Icon name="ChevronDown" className="size-3 shrink-0" />
        </SelectTrigger>
        <SelectContent className="absolute inset-x-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-sm border border-[#eadfca] bg-white p-1 shadow-xl shadow-slate-200/60">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              className="cursor-pointer rounded-sm py-2 text-xs text-stone-600 transition duration-700 hover:bg-amber-50 aria-selected:bg-amber-50 aria-selected:font-semibold aria-selected:text-amber-900"
              value={option.value}
            >
              <span className="block truncate" title={option.label}>
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function Pagination({
  page,
  total,
  pageSize,
  onPage,
  onSize,
  disabled,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
  onSize: (size: number) => void;
  disabled?: boolean;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfca] bg-[#fffdf7] px-4 py-3 text-xs text-slate-500 sm:px-5">
      <span aria-live="polite">
        <strong className="font-semibold text-slate-700">{total.toLocaleString()}</strong> records
        <span className="mx-2 text-slate-300">/</span>
        Page <strong className="font-semibold text-slate-700">{page}</strong> of {pages}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <LeadSelect
          label="Items per page"
          value={String(pageSize)}
          options={[10, 25, 50, 100].map((size) => ({ value: String(size), label: `${size} / page` }))}
          onChange={(size) => onSize(Number(size))}
          disabled={disabled}
        />
        <Action
          className="size-9 px-0"
          title="Previous page"
          aria-label="Previous page"
          disabled={disabled || page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <Icon name="ArrowLeft" />
        </Action>
        <span className="grid size-9 place-items-center rounded-sm border border-amber-200 bg-amber-50 font-semibold text-amber-900">
          {page}
        </span>
        <Action
          className="size-9 px-0"
          title="Next page"
          aria-label="Next page"
          disabled={disabled || page >= pages}
          onClick={() => onPage(page + 1)}
        >
          <Icon name="ChevronRight" />
        </Action>
      </div>
    </div>
  );
}
export function useRefreshCooldown() {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return { remaining, start: () => setRemaining(60) };
}
export function LeadsSkeleton() {
  return (
    <div aria-label="Loading Leads" className="grid gap-4 p-5" role="status">
      <span className="sr-only">Loading Leads…</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-sm bg-slate-100" />
        ))}
      </div>
      <div className={`${leadPanel} grid gap-4 p-4`}>
        <Skeleton className="h-9 w-1/3 rounded-sm bg-slate-100" />
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-sm bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
export function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") return data.error;
  }
  return error instanceof Error ? error.message : "Could not complete the action. Please try again.";
}
export function LeadsModal({
  title,
  onClose,
  busy,
  children,
}: {
  title: string;
  onClose: () => void;
  busy?: boolean;
  children: ReactNode;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  }, [onClose, busy]);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) ?? [],
      );
    elements()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) closeRef.current();
      if (event.key === "Tab") {
        const nodes = elements().filter((node) => node.getClientRects().length);
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-xl overflow-hidden rounded-sm border border-[#eadfca] bg-white text-slate-800 shadow-2xl shadow-slate-900/15"
      >
        <div ref={panel}>
          <DialogHeader className="flex items-center justify-between gap-3 border-b border-[#eadfca] bg-[#fffdf9] px-5 py-4">
            <DialogTitle id={titleId} className="text-lg font-semibold tracking-tight text-slate-950">
              {title}
            </DialogTitle>
            <Action className="size-8 px-0" aria-label="Close dialog" disabled={busy} onClick={onClose}>
              <Icon name="X" />
            </Action>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh]">{children}</ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Paginated selections keep large funnel/councilor lists usable on mobile. */
export function RecordSelect({
  area = "customers",
  kind,
  value,
  label,
  selectedLabel,
  onChange,
  allowEmpty = true,
  activeOnly = false,
  disabled = false,
}: {
  area?: string;
  kind: Exclude<LeadKind, "customers">;
  value: string;
  label: string;
  selectedLabel?: string;
  onChange: (value: string) => void;
  allowEmpty?: boolean;
  activeOnly?: boolean;
  disabled?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [chosenLabel, setChosenLabel] = useState(selectedLabel || value);
  const { data, isFetching, error } = useGetLeadOptionsQuery({
    kind,
    area,
    page,
    pageSize,
    search,
    ...(activeOnly ? { status: "active" } : {}),
  });
  const options = data?.items.map((item) => ({ value: item.value, label: item.name })) ?? [];
  if (value && !options.some((option) => option.value === value))
    options.unshift({ value, label: chosenLabel || value });
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 rounded-sm border border-[#eadfca] bg-[#fffdf7] p-2.5">
      <LeadSelect
        label={label}
        value={value}
        options={[...(allowEmpty ? [{ value: "", label }] : []), ...options]}
        onChange={(next) => {
          setChosenLabel(options.find((option) => option.value === next)?.label ?? next);
          onChange(next);
        }}
        disabled={disabled || isFetching}
      />
      <div className="flex gap-1.5">
        <input
          aria-label={`Search ${kind} options`}
          className="h-9 min-w-0 flex-1 rounded-sm border border-[#eadfca] bg-white px-2.5 text-xs outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`Find ${kind}`}
          maxLength={160}
          disabled={disabled}
        />
        <Action
          disabled={disabled || isFetching}
          onClick={() => {
            setSearch(text);
            setPage(1);
          }}
        >
          <Icon name={isFetching ? "RefreshCw" : "Search"} className={`size-3 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Loading…" : "Find"}
        </Action>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {errorMessage(error)}
        </p>
      )}
      {(data?.total ?? 0) > 10 && (
        <Pagination
          page={data?.page ?? page}
          total={data?.total ?? 0}
          pageSize={pageSize}
          onPage={setPage}
          onSize={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          disabled={disabled || isFetching}
        />
      )}
    </div>
  );
}
