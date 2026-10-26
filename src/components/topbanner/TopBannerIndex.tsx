/*
|-----------------------------------------
| setting up TopBannerIndex.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import type { ComponentType } from "react";

import { defaultData as defaultOne, type TopBannerOneData } from "./topbanner-1/data";
import MutationOne from "./topbanner-1/Mutation";
import QueryOne from "./topbanner-1/Query";
import { defaultData as defaultTwo, type TopBannerTwoData } from "./topbanner-2/data";
import MutationTwo from "./topbanner-2/Mutation";
import QueryTwo from "./topbanner-2/Query";
import { defaultData as defaultThree, type TopBannerThreeData } from "./topbanner-3/data";
import MutationThree from "./topbanner-3/Mutation";
import QueryThree from "./topbanner-3/Query";

export type TopBannerData = TopBannerOneData | TopBannerTwoData | TopBannerThreeData;
export type TopBannerVariant = TopBannerData["variant"];
export type StoredTopBanner = { variant: string; data: Record<string, unknown> };

type Definition = {
  defaultData: TopBannerData;
  description: string;
  Mutation: ComponentType<{ initialData: TopBannerData; onSave: (data: TopBannerData) => Promise<void> }>;
  Query: ComponentType<{ data: TopBannerData }>;
  title: string;
};

export const topBannerIndex: Record<TopBannerVariant, Definition> = {
  "topbanner-1": {
    defaultData: defaultOne,
    description: "Icons left, account action right",
    Mutation: MutationOne as unknown as Definition["Mutation"],
    Query: QueryOne as unknown as Definition["Query"],
    title: "Social links",
  },
  "topbanner-2": {
    defaultData: defaultTwo,
    description: "Flowing text with social icons",
    Mutation: MutationTwo as unknown as Definition["Mutation"],
    Query: QueryTwo as unknown as Definition["Query"],
    title: "Moving message",
  },
  "topbanner-3": {
    defaultData: defaultThree,
    description: "Lifetime offer with a call to action",
    Mutation: MutationThree as unknown as Definition["Mutation"],
    Query: QueryThree as unknown as Definition["Query"],
    title: "Offer banner",
  },
};

export const topBannerAssets = Object.values(topBannerIndex);

export function getTopBannerDefinition(variant: string) {
  return topBannerIndex[variant as TopBannerVariant];
}

export function hydrateTopBanner(variant: string, data: Record<string, unknown>): TopBannerData | null {
  const definition = getTopBannerDefinition(variant);
  if (!definition) return null;
  return { ...definition.defaultData, ...data, variant: definition.defaultData.variant } as TopBannerData;
}

export function TopBannerPreview({ data }: { data: TopBannerData }) {
  const definition = getTopBannerDefinition(data.variant);
  if (!definition) return null;
  const Query = definition.Query;
  return <Query data={data} />;
}

export function TopBannerMutation({
  data,
  onSave,
}: {
  data: TopBannerData;
  onSave: (data: TopBannerData) => Promise<void>;
}) {
  const definition = getTopBannerDefinition(data.variant);
  if (!definition) return null;
  const Mutation = definition.Mutation;
  return <Mutation initialData={data} onSave={onSave} />;
}
