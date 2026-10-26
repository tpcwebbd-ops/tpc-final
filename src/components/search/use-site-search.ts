/*
|-----------------------------------------
| setting up use-site-search.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import type { SearchResponse, SearchResult } from "@/types/search";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 3000;

export function normalizeSearchQuery(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function useSiteSearch(query: string, enabled = true, limit?: number) {
  const [items, setItems] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [settledQuery, setSettledQuery] = useState("");
  const normalizedQuery = normalizeSearchQuery(query);
  const isValid = enabled && normalizedQuery.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isValid || settledQuery === normalizedQuery) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: normalizedQuery, ...(limit ? { limit: String(limit) } : {}) });
        const response = await fetch(`/api/search/v1?${params}`, {
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as (SearchResponse & { error?: string }) | null;
        if (!response.ok || !payload) throw new Error(payload?.error ?? "Could not search the site.");
        setItems(payload.items);
        setTotal(payload.total);
        setError("");
        setSettledQuery(normalizedQuery);
      } catch (reason) {
        if (controller.signal.aborted) return;
        setItems([]);
        setTotal(0);
        setError(reason instanceof Error ? reason.message : "Could not search the site.");
        setSettledQuery(normalizedQuery);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isValid, limit, normalizedQuery, settledQuery]);

  if (!isValid || settledQuery !== normalizedQuery) return { error: "", isLoading: isValid, items: [], total: 0 };
  return { error, isLoading: false, items, total };
}
