/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { PageBlocks } from "@/components/pages/PageBlocks";
import { LoadingState } from "@/components/ui/loading-state";
import { useGetPagesQuery } from "@/redux/features/dashboard/pages/pagesSlice";
export default function Preview() {
  const path = useSearchParams().get("path") ?? "";
  const { data, isLoading, isError } = useGetPagesQuery();
  const page = useMemo(() => data?.items.find((p) => p.path === path), [data, path]);
  if (isLoading) return <LoadingState label="Loading page preview" />;
  if (isError) return <main className="flex-1 p-8">Could not load pages.</main>;
  if (!page) return <main className="flex-1 p-8">Page not found.</main>;
  return (
    <main className="flex-1 bg-[#fffaf0]">
      <div className="border-b bg-white p-3 text-center text-sm text-stone-500">Preview — not published</div>
      <PageBlocks blocks={page.blocks} pageId={page.id} preview />
    </main>
  );
}
