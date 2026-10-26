/*
|-----------------------------------------
| setting up SectionPreviewRegistry.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 September, 2026
|-----------------------------------------
*/

"use client";

import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

import { hydrateSectionData, type SectionData, type SectionVariant } from "./section-defaults";

export type { SectionData, SectionVariant } from "./section-defaults";

type PreviewProps = { data?: SectionData };
type LazyPreview = LazyExoticComponent<ComponentType<PreviewProps>>;

const previewRegistry: Record<SectionVariant, LazyPreview> = {
  "section-1": lazy(() => import("./section-1/Query")) as unknown as LazyPreview,
  "section-2": lazy(() => import("./section-2/Query")) as unknown as LazyPreview,
  "section-3": lazy(() => import("./section-3/Query")) as unknown as LazyPreview,
  "section-4": lazy(() => import("./section-4/Query")) as unknown as LazyPreview,
  "section-5": lazy(() => import("./section-5/Query")) as unknown as LazyPreview,
  "section-6": lazy(() => import("./section-6/Query")) as unknown as LazyPreview,
  "section-7": lazy(() => import("./section-7/Query")) as unknown as LazyPreview,
  "section-8": lazy(() => import("./section-8/Query")) as unknown as LazyPreview,
  "section-9": lazy(() => import("./section-9/Query")) as unknown as LazyPreview,
  "section-10": lazy(() => import("./section-10/Query")) as unknown as LazyPreview,
  "section-11": lazy(() => import("./section-11/Query")) as unknown as LazyPreview,
  "section-12": lazy(() => import("./section-12/Query")) as unknown as LazyPreview,
  "section-13": lazy(() => import("./section-13/Query")) as unknown as LazyPreview,
  "section-14": lazy(() => import("./section-14/Query")) as unknown as LazyPreview,
  "section-15": lazy(() => import("./section-15/Query")) as unknown as LazyPreview,
  "section-16": lazy(() => import("./section-16/Query")) as unknown as LazyPreview,
  "section-17": lazy(() => import("./section-17/Query")) as unknown as LazyPreview,
  "section-18": lazy(() => import("./section-18/Query")) as unknown as LazyPreview,
  "section-19": lazy(() => import("./section-19/Query")) as unknown as LazyPreview,
  "section-20": lazy(() => import("./section-20/Query")) as unknown as LazyPreview,
  "section-21": lazy(() => import("./section-21/Query")) as unknown as LazyPreview,
  "section-22": lazy(() => import("./section-22/Query")) as unknown as LazyPreview,
  "section-23": lazy(() => import("./section-23/Query")) as unknown as LazyPreview,
  "section-24": lazy(() => import("./section-24/Query")) as unknown as LazyPreview,
  "section-25": lazy(() => import("./section-25/Query")) as unknown as LazyPreview,
  "section-26": lazy(() => import("./section-26/Query")) as unknown as LazyPreview,
  "section-27": lazy(() => import("./section-27/Query")) as unknown as LazyPreview,
  "section-28": lazy(() => import("./section-28/Query")) as unknown as LazyPreview,
  "section-29": lazy(() => import("./section-29/Query")) as unknown as LazyPreview,
  "section-30": lazy(() => import("./section-30/Query")) as unknown as LazyPreview,
  "section-31": lazy(() => import("./section-31/Query")) as unknown as LazyPreview,
  "section-32": lazy(() => import("./section-32/Query")) as unknown as LazyPreview,
  "section-33": lazy(() => import("./section-33/Query")) as unknown as LazyPreview,
  "section-34": lazy(() => import("./section-34/Query")) as unknown as LazyPreview,
  "section-35": lazy(() => import("./section-35/Query")) as unknown as LazyPreview,
  "section-36": lazy(() => import("./section-36/Query")) as unknown as LazyPreview,
  "section-37": lazy(() => import("./section-37/Query")) as unknown as LazyPreview,
  "section-38": lazy(() => import("./section-38/Query")) as unknown as LazyPreview,
  "section-39": lazy(() => import("./section-39/Query")) as unknown as LazyPreview,
  "section-40": lazy(() => import("./section-40/Query")) as unknown as LazyPreview,
  "section-41": lazy(() => import("./section-41/Query")) as unknown as LazyPreview,
  "section-42": lazy(() => import("./section-42/Query")) as unknown as LazyPreview,
  "section-43": lazy(() => import("./section-43/Query")) as unknown as LazyPreview,
  "section-44": lazy(() => import("./section-44/Query")) as unknown as LazyPreview,
  "section-45": lazy(() => import("./section-45/Query")) as unknown as LazyPreview,
  "section-46": lazy(() => import("./section-46/Query")) as unknown as LazyPreview,
  "section-47": lazy(() => import("./section-47/Query")) as unknown as LazyPreview,
  "section-48": lazy(() => import("./section-48/Query")) as unknown as LazyPreview,
};

export function SectionPreview({ kind, data }: { kind: SectionVariant; data: SectionData }) {
  const Query = previewRegistry[kind];
  const hydratedData = hydrateSectionData(kind, data) ?? data;
  return (
    <Suspense fallback={null}>
      <Query data={hydratedData} />
    </Suspense>
  );
}
