/*
|-----------------------------------------
| setting up dropdown-menu.tsx for the App
|-----------------------------------------
*/

"use client";

import * as React from "react";

import { cn } from "@/app/api/lib/utils";

type ContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DropdownContext = React.createContext<ContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <DropdownContext.Provider value={{ open, setOpen }}><div className="relative">{children}</div></DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  if (!asChild) return <button type="button" onClick={() => context.setOpen(!context.open)}>{children}</button>;
  const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  return React.cloneElement(child, {
    onClick: (event) => {
      child.props.onClick?.(event);
      context.setOpen(!context.open);
    },
  });
}

export function DropdownMenuContent({ className, children }: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  const context = React.useContext(DropdownContext);
  return context?.open ? <div className={cn("absolute right-0 z-50 mt-2 min-w-40 rounded-sm border bg-white p-1 shadow-lg", className)}>{children}</div> : null;
}

export function DropdownMenuItem({ className, onClick, children }: React.ComponentProps<"button">) {
  const context = React.useContext(DropdownContext);
  return <button type="button" className={cn("flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm", className)} onClick={(event) => { onClick?.(event); context?.setOpen(false); }}>{children}</button>;
}
