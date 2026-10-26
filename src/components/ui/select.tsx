/*
|-----------------------------------------
| setting up select.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| reusable select UI primitive
|-----------------------------------------
*/

"use client";

import * as React from "react";

import { cn } from "@/app/api/lib/utils";

type SelectContextValue = { value?: string; setValue: (value: string) => void; open: boolean; setOpen: (open: boolean) => void };
const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <SelectContext.Provider value={{ value, setValue: (nextValue) => { onValueChange?.(nextValue); setOpen(false); }, open, setOpen }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");
  return <button type="button" aria-expanded={context.open} className={cn("flex w-full items-center justify-between", className)} onClick={() => context.setOpen(!context.open)} {...props}>{children}</button>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  return <span>{context?.value ?? placeholder}</span>;
}

export function SelectContent({ className, children }: React.ComponentProps<"div">) {
  const context = React.useContext(SelectContext);
  return context?.open ? <div role="listbox" className={cn("relative z-50 mt-1 rounded-md p-1 shadow-lg", className)}>{children}</div> : null;
}

export function SelectItem({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");
  return <button type="button" role="option" aria-selected={context.value === value} className={cn("block w-full rounded px-2 py-1 text-left", className)} onClick={() => context.setValue(value)}>{children}</button>;
}
