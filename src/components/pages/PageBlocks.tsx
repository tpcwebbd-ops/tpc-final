/*
|-----------------------------------------
| setting up PageBlocks.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";

import { type PublicContainerProduct } from "@/lib/dashboard/catalog";
import { type PageBlock } from "@/redux/features/dashboard/pages/pagesSlice";

import { ContainerQuery, type ContainerVariant } from "../container/ContainerIndex";
import { FormQuery, type FormVariant } from "../form/FormIndex";
import { SectionPreview, type SectionVariant } from "../sections/SectionPreviewRegistry";

import { PagePreview, type AllPageKind } from "./PageIndex";

async function submitPageForm(pageId: string, blockId: string, values: Record<string, string>) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("/api/dashboard/pages/v1/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pageId, blockId, values }),
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; item?: unknown } | null;
    if (!response.ok || !payload?.item) throw new Error(payload?.error ?? "Submission failed.");
  } finally {
    window.clearTimeout(timeout);
  }
}

export function PageBlocks({
  blocks,
  pageId,
  preview = false,
  products,
}: {
  blocks: PageBlock[];
  pageId: string;
  preview?: boolean;
  products?: PublicContainerProduct[];
}) {
  return (
    <div className="mx-auto grid max-w-7xl">
      {blocks.map((block) => {
        if (block.type === "all-page")
          return (
            <PagePreview
              data={block.data as Record<string, string>}
              key={block.id}
              kind={block.variant as AllPageKind}
            />
          );
        if (block.type === "section")
          return (
            <SectionPreview
              data={block.data as Record<string, string>}
              key={block.id}
              kind={block.variant as SectionVariant}
            />
          );
        if (block.type === "container")
          return (
            <ContainerQuery
              data={block.data as never}
              key={block.id}
              products={products}
              variant={block.variant as ContainerVariant}
            />
          );
        if (block.type === "rich-text")
          return (
            <SectionPreview
              data={{ content: typeof block.data.content === "string" ? block.data.content : "" }}
              key={block.id}
              kind="section-1"
            />
          );

        const onSubmit = preview
          ? undefined
          : (values: Record<string, string>) => submitPageForm(pageId, block.id, values);
        return (
          <FormQuery
            data={block.data as Record<string, string>}
            key={block.id}
            kind={block.variant as FormVariant}
            onSubmit={onSubmit}
          />
        );
      })}
    </div>
  );
}
