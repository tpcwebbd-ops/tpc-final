/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

import Link from "next/link";

import { getPublishedSearchTarget, isSearchQueryValid, normalizeSearchQuery, textLinesFrom } from "@/lib/search/server";
import type { SearchScope } from "@/types/search";

function UnavailableResult({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#fffaf0] px-4 py-12">
      <section className="w-full max-w-lg rounded-sm border border-[#eadfca] bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">Search result unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">{children}</p>
        <Link
          className="mt-5 inline-flex rounded-sm bg-amber-100 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-200"
          href="/search"
        >
          Back to search
        </Link>
      </section>
    </main>
  );
}

export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ block?: string; page?: string; q?: string; scope?: string }>;
}) {
  const { block, page, q, scope: requestedScope } = await searchParams;
  const pageId = page?.trim();
  const blockId = block?.trim();
  const query = normalizeSearchQuery(q);
  const scope: SearchScope | null = requestedScope === "page" ? "page" : blockId ? "block" : null;
  if (!pageId || !scope) return <UnavailableResult>Choose a valid result from the search page.</UnavailableResult>;
  if (!isSearchQueryValid(query))
    return <UnavailableResult>Run the search again to open a filtered result.</UnavailableResult>;

  let target: Awaited<ReturnType<typeof getPublishedSearchTarget>> = null;
  let didFail = false;
  try {
    target = await getPublishedSearchTarget({ pageId, blockId, scope });
  } catch {
    didFail = true;
  }
  if (didFail) return <UnavailableResult>Search could not load this result. Please try again.</UnavailableResult>;
  if (!target) return <UnavailableResult>This result is no longer available.</UnavailableResult>;
  const matchingBlocks = target.blocks
    .map((block) => ({ block, lines: textLinesFrom(block.data, query) }))
    .filter(({ lines }) => lines.length > 0);
  if (!matchingBlocks.length)
    return <UnavailableResult>This matching content is no longer available.</UnavailableResult>;

  return (
    <main className="flex-1 bg-[#fffaf0] py-6 sm:py-10">
      <div className="mx-auto mb-5 max-w-7xl px-4 sm:px-6">
        <Link className="text-sm font-medium text-amber-700 hover:underline" href="/search">
          ← Back to search
        </Link>
        <p className="mt-2 text-sm text-stone-500">{target.page.title}</p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-4 px-4 sm:px-6">
        {matchingBlocks.map(({ block: item, lines }) => (
          <article className="rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm sm:p-6" key={item.id}>
            <div className="space-y-3 text-sm leading-7 text-stone-700 sm:text-base">
              {lines.map((line, lineIndex) => (
                <p className="whitespace-pre-wrap break-words" key={`${item.id}-${lineIndex}`}>
                  {line}
                </p>
              ))}
            </div>
            <Link
              className="mt-5 inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-900"
              href={target.page.path}
            >
              View full page: {target.page.path}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
