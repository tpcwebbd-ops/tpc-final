/*
|-----------------------------------------
| setting up SearchPageClient.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { normalizeSearchQuery, useSiteSearch } from "@/components/search/use-site-search";

function resultHref(
  { pageId, blockId, scope }: { pageId: string; blockId?: string; scope: "block" | "page" },
  query: string,
) {
  const params = new URLSearchParams({
    page: pageId,
    q: query,
    ...(scope === "page" ? { scope } : { block: blockId ?? "" }),
  });
  return `/search/result?${params}`;
}

export default function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const search = useSiteSearch(query);
  const normalizedQuery = normalizeSearchQuery(query);
  const hasValidQuery = normalizedQuery.length >= 3;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasValidQuery) return;
    router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Site search</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">Find what you need</h1>
        </header>
        <form
          className="flex gap-2 rounded-sm border border-[#eadfca] bg-white p-2 shadow-sm"
          role="search"
          onSubmit={submit}
        >
          <label className="sr-only" htmlFor="site-search-page-input">
            Search site
          </label>
          <input
            autoFocus
            className="min-w-0 flex-1 px-3 py-2 text-sm outline-none placeholder:text-stone-400"
            id="site-search-page-input"
            placeholder="Search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="inline-flex items-center gap-2 rounded-sm bg-amber-100 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!hasValidQuery || search.isLoading}
            type="submit"
          >
            {search.isLoading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
            <span>{search.isLoading ? "Searching…" : "Search"}</span>
          </button>
        </form>

        {!query.trim() ? (
          <p className="mt-5 text-sm text-stone-600">Enter at least 3 characters to search the site.</p>
        ) : null}
        {query.trim() && !hasValidQuery ? (
          <p className="mt-5 text-sm text-stone-600">Enter at least 3 characters to search the site.</p>
        ) : null}
        {search.isLoading ? <p className="mt-5 text-sm text-stone-600">Searching…</p> : null}
        {!search.isLoading && search.error ? (
          <p className="mt-5 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">{search.error}</p>
        ) : null}
        {!search.isLoading && !search.error && hasValidQuery && !search.items.length ? (
          <p className="mt-5 text-sm text-stone-600">No results found for “{normalizedQuery}”.</p>
        ) : null}
        {!search.isLoading && !search.error && search.items.length ? (
          <section aria-live="polite" className="mt-5 space-y-3">
            <p className="text-sm text-stone-600">
              {search.total} {search.total === 1 ? "result" : "results"} for “{normalizedQuery}”
            </p>
            {search.items.map((item) => (
              <article
                className="rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
                key={item.id}
              >
                <Link className="block" href={resultHref(item, normalizedQuery)}>
                  <p className="font-semibold text-stone-900">{item.pageTitle}</p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-stone-600">{item.text}</p>
                </Link>
                <p className="mt-2 text-xs font-medium text-amber-700">
                  {item.scope === "page" ? "Matching page" : "Matching section"}
                </p>
                <Link
                  className="mt-3 inline-flex text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-900"
                  href={item.pagePath}
                >
                  View full page: {item.pagePath}
                </Link>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
