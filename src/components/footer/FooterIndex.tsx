/*
|-----------------------------------------
| setting up FooterIndex.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/
import type { ComponentType } from "react";

import { defaultData as one, type FooterOneData } from "./footer-1/data";
import M1 from "./footer-1/Mutation";
import Q1 from "./footer-1/Query";
import { defaultData as two, type FooterTwoData } from "./footer-2/data";
import M2 from "./footer-2/Mutation";
import Q2 from "./footer-2/Query";
import { defaultData as three, type FooterThreeData } from "./footer-3/data";
import M3 from "./footer-3/Mutation";
import Q3 from "./footer-3/Query";
export type FooterData = FooterOneData | FooterTwoData | FooterThreeData;
export type FooterVariant = FooterData["variant"];
type Definition = {
  defaultData: FooterData;
  title: string;
  description: string;
  Mutation: ComponentType<{ initialData: FooterData; onSave: (data: FooterData) => Promise<void> }>;
  Query: ComponentType<{ data: FooterData }>;
};
export const footerIndex: Record<FooterVariant, Definition> = {
  "footer-1": {
    defaultData: one,
    title: "Multi-column footer",
    description: "Brand, navigation, and contact details",
    Mutation: M1 as unknown as Definition["Mutation"],
    Query: Q1 as unknown as Definition["Query"],
  },
  "footer-2": {
    defaultData: two,
    title: "Compact footer",
    description: "Centered responsive navigation",
    Mutation: M2 as unknown as Definition["Mutation"],
    Query: Q2 as unknown as Definition["Query"],
  },
  "footer-3": {
    defaultData: three,
    title: "NexaMart",
    description: "Study-abroad links and legal footer",
    Mutation: M3 as unknown as Definition["Mutation"],
    Query: Q3 as unknown as Definition["Query"],
  },
};
export const footerAssets = Object.values(footerIndex);
export const getFooterDefinition = (variant: string) => footerIndex[variant as FooterVariant];
export const hydrateFooter = (variant: string, data: Record<string, unknown>): FooterData | null => {
  const definition = getFooterDefinition(variant);
  if (!definition) return null;
  const hydrated = { ...definition.defaultData, ...data, variant: definition.defaultData.variant } as FooterData;
  if (hydrated.variant === "footer-1" && hydrated.legalBackground.toLowerCase() === "#000000") {
    hydrated.legalBackground = "#fffaf0";
  }
  return hydrated;
};
export function FooterPreview({ data }: { data: FooterData }) {
  const Query = getFooterDefinition(data.variant)?.Query;
  return Query ? <Query data={data} /> : null;
}
export function FooterMutation({ data, onSave }: { data: FooterData; onSave: (data: FooterData) => Promise<void> }) {
  const Mutation = getFooterDefinition(data.variant)?.Mutation;
  return Mutation ? <Mutation initialData={data} onSave={onSave} /> : null;
}
