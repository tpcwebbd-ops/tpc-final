/*
|-----------------------------------------
| setting up ContainerIndex for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

import type { ComponentType } from "react";

import type { PublicContainerProduct } from "@/lib/dashboard/catalog";

import { defaultDataContainer1, type IContainerData } from "./container-1/data";
import MutationContainer1 from "./container-1/Mutation";
import QueryContainer1 from "./container-1/Query";
import { defaultDataContainer2, type IContainerData as IContainerTwoData } from "./container-2/data";
import MutationContainer2 from "./container-2/Mutation";
import QueryContainer2 from "./container-2/Query";

export type ContainerVariant = "container-1" | "container-2";
export type ContainerData = IContainerData | IContainerTwoData;

type Definition = {
  defaultData: ContainerData;
  description: string;
  Mutation: ComponentType<{
    data?: ContainerData;
    onChange?: (values: ContainerData) => void;
    onSubmit: (values: ContainerData) => void;
  }>;
  Query: ComponentType<{ data?: ContainerData | string; products?: PublicContainerProduct[] }>;
  title: string;
};

export const containerIndex: Record<ContainerVariant, Definition> = {
  "container-1": {
    defaultData: defaultDataContainer1,
    description: "A configurable product-template grid with cart actions.",
    Mutation: MutationContainer1 as unknown as Definition["Mutation"],
    Query: QueryContainer1 as unknown as Definition["Query"],
    title: "Template grid",
  },
  "container-2": {
    defaultData: defaultDataContainer2,
    description: "A configurable template carousel with optional bottom navigation.",
    Mutation: MutationContainer2 as unknown as Definition["Mutation"],
    Query: QueryContainer2 as unknown as Definition["Query"],
    title: "Template carousel",
  },
};

export const containerContainers = Object.entries(containerIndex).map(([variant, container]) => ({
  variant: variant as ContainerVariant,
  ...container,
}));

export const getContainerDefinition = (variant: string) => containerIndex[variant as ContainerVariant];

export const getContainerDefaults = (variant: ContainerVariant): ContainerData =>
  structuredClone(containerIndex[variant].defaultData);

export function ContainerQuery({
  variant,
  data,
  products,
}: {
  variant: ContainerVariant;
  data?: ContainerData | string;
  products?: PublicContainerProduct[];
}) {
  const Query = getContainerDefinition(variant)?.Query;
  return Query ? <Query data={data} products={products} /> : null;
}

export function ContainerMutation({
  variant,
  data,
  onChange,
  onSubmit,
}: {
  variant: ContainerVariant;
  data?: ContainerData;
  onChange?: (values: ContainerData) => void;
  onSubmit: (values: ContainerData) => void;
}) {
  const Mutation = getContainerDefinition(variant)?.Mutation;
  return Mutation ? <Mutation data={data} onChange={onChange} onSubmit={onSubmit} /> : null;
}
