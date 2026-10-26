/*
|-----------------------------------------
| setting up accordion.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import type { ComponentProps } from "react";

type AccordionProps = ComponentProps<"div"> & { collapsible?: boolean; type?: "single" | "multiple" };

export function Accordion({ collapsible: _collapsible, type: _type, ...props }: AccordionProps) {
  void _collapsible;
  void _type;
  return <div {...props} />;
}

export function AccordionItem({ value: _value, ...props }: ComponentProps<"details"> & { value: string }) {
  void _value;
  return <details {...props} />;
}

export function AccordionTrigger({ className, ...props }: ComponentProps<"summary">) {
  return (
    <summary className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${className ?? ""}`} {...props} />
  );
}

export function AccordionContent(props: ComponentProps<"div">) {
  return <div {...props} />;
}
