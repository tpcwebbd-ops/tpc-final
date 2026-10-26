/*
|-----------------------------------------
| setting up ContainerIndex.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

import type { ComponentType } from "react";

export type ContainerVariant = "container-1" | "container-2";
export type ContainerData = Record<string, unknown>;

type ContainerProps = {
  data?: ContainerData | string;
};

type MutationProps = ContainerProps & {
  onChange?: (values: ContainerData) => void;
  onSubmit?: (values: ContainerData) => void;
};

function CommingSoon() {
  return (
    <section className="custom-parent-border mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6">
      <h2 className="text-2xl font-semibold text-stone-800">Comming Soon</h2>
    </section>
  );
}

const PlaceholderQuery = () => <CommingSoon />;
const PlaceholderMutation = () => <CommingSoon />;

type Definition = {
  defaultData: ContainerData;
  description: string;
  Mutation: ComponentType<MutationProps>;
  Query: ComponentType<ContainerProps>;
  title: string;
};

const defaultData: ContainerData = {};

export const containerIndex: Record<ContainerVariant, Definition> = {
  "container-1": {
    defaultData,
    description: "A blank content section.",
    Mutation: PlaceholderMutation,
    Query: PlaceholderQuery,
    title: "Container 1",
  },
  "container-2": {
    defaultData,
    description: "A blank content section.",
    Mutation: PlaceholderMutation,
    Query: PlaceholderQuery,
    title: "Container 2",
  },
};

export const containerContainers = Object.entries(containerIndex).map(([variant, container]) => ({
  variant: variant as ContainerVariant,
  ...container,
}));

export const getContainerDefinition = (variant: string) => containerIndex[variant as ContainerVariant];

export const getContainerDefaults = (variant: ContainerVariant): ContainerData =>
  structuredClone(containerIndex[variant].defaultData);

export function ContainerQuery({ variant }: { variant: ContainerVariant } & ContainerProps) {
  const Query = getContainerDefinition(variant)?.Query ?? PlaceholderQuery;
  return <Query />;
}

export function ContainerMutation({
  variant,
}: { variant: ContainerVariant } & Omit<MutationProps, "onSubmit"> & {
    onSubmit: (values: ContainerData) => void;
  }) {
  const Mutation = getContainerDefinition(variant)?.Mutation ?? PlaceholderMutation;
  return <Mutation />;
}
