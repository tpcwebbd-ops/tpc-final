/*
|-----------------------------------------
| setting up server.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

import "server-only";

import { unstable_cache } from "next/cache";

import { allPageDefaults, type AllPageKind } from "@/components/pages/PageIndex";
import { pagesCollection } from "@/lib/models/pages";
import type { PageBlock, SitePage } from "@/redux/features/dashboard/pages/pagesSlice";
import type { SearchResponse, SearchResult, SearchScope } from "@/types/search";

const MIN_QUERY_LENGTH = 3;

type SearchablePage = Pick<SitePage, "id" | "title" | "path" | "description" | "published" | "blocks">;
type TextValue = { field: string; value: string };

export function normalizeSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function isSearchQueryValid(value: string | null | undefined) {
  return normalizeSearchQuery(value).length >= MIN_QUERY_LENGTH;
}

function hydratedBlock(block: PageBlock): PageBlock {
  if (block.type !== "all-page") return block;
  return { ...block, data: { ...allPageDefaults(block.variant as AllPageKind), ...block.data } };
}

function valuesFrom(value: unknown, field: string): TextValue[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed) || (parsed && typeof parsed === "object")) return valuesFrom(parsed, field);
    } catch {
      // Plain text is already searchable.
    }
    const text = trimmed
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? [{ field, value: text }] : [];
  }
  if (typeof value === "number" || typeof value === "boolean") return [{ field, value: String(value) }];
  if (Array.isArray(value)) return value.flatMap((item, index) => valuesFrom(item, `${field}[${index}]`));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => valuesFrom(item, `${field}.${key}`));
}

export function textLinesFrom(value: unknown, query?: string) {
  const normalizedQuery = query ? normalizeSearchQuery(query) : "";
  return valuesFrom(value, "data")
    .filter(
      ({ field, value: text }) =>
        !/(?:image|url|uid|padding|forceupdate|color)$/i.test(field) && !/^(?:https?:|\/|data:)/i.test(text),
    )
    .filter(({ value: text }) => !normalizedQuery || text.toLocaleLowerCase().includes(normalizedQuery))
    .map(({ value: text }) => text);
}

function excerpt(value: string, query: string) {
  const normalizedValue = value.toLocaleLowerCase();
  const index = normalizedValue.indexOf(query);
  if (index < 0) return value.slice(0, 180);
  const start = Math.max(0, index - 70);
  const end = Math.min(value.length, index + query.length + 110);
  return `${start ? "…" : ""}${value.slice(start, end)}${end < value.length ? "…" : ""}`;
}

function resultFor(
  page: SearchablePage,
  scope: SearchScope,
  fields: TextValue[],
  query: string,
  block?: PageBlock,
): SearchResult | null {
  const matches = fields.filter(({ value }) => value.toLocaleLowerCase().includes(query));
  if (!matches.length) return null;
  const first = matches[0];
  return {
    id: `${page.id}:${scope}:${block?.id ?? "page"}`,
    pageId: page.id,
    pagePath: page.path,
    pageTitle: page.title,
    ...(block ? { blockId: block.id, blockVariant: block.variant } : {}),
    excerpt: excerpt(first.value, query),
    matchedFields: matches.map(({ field }) => field),
    scope,
    text: first.value,
  };
}

function resultPriority(result: SearchResult, query: string) {
  const title = result.pageTitle.toLocaleLowerCase();
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (result.scope === "page") return 2;
  return 3;
}

export async function searchPublishedPages(rawQuery: string, limit?: number): Promise<SearchResponse> {
  const query = normalizeSearchQuery(rawQuery);
  if (!isSearchQueryValid(query)) return { items: [], query, total: 0 };

  return unstable_cache(
    async () => {
      const pages = await pagesCollection()
        .find({ published: true }, { projection: { _id: 0, id: 1, title: 1, path: 1, description: 1, blocks: 1 } })
        .toArray();

      const items = pages
        .flatMap((page) => {
          const pageResult = resultFor(
            page,
            "page",
            valuesFrom({ title: page.title, path: page.path, description: page.description }, "page"),
            query,
          );
          const blockResults = page.blocks
            .map(hydratedBlock)
            .flatMap((block) =>
              resultFor(page, "block", valuesFrom(block.data, `blocks.${block.id}.data`), query, block),
            )
            .filter((result): result is SearchResult => Boolean(result));
          return pageResult ? [pageResult, ...blockResults] : blockResults;
        })
        .sort((left, right) => {
          const priority = resultPriority(left, query) - resultPriority(right, query);
          return priority || left.pageTitle.localeCompare(right.pageTitle) || left.id.localeCompare(right.id);
        });

      return { items: typeof limit === "number" ? items.slice(0, limit) : items, query, total: items.length };
    },
    ["public-page-search", query, String(limit ?? "all")],
    { revalidate: 60, tags: ["public-page-search"] },
  )();
}

export async function getPublishedSearchTarget({
  pageId,
  blockId,
  scope,
}: {
  pageId: string;
  blockId?: string;
  scope: SearchScope;
}) {
  const page = await pagesCollection().findOne(
    { id: pageId, published: true },
    { projection: { _id: 0, id: 1, title: 1, path: 1, description: 1, blocks: 1 } },
  );
  if (!page) return null;

  const blocks = page.blocks.map(hydratedBlock);
  if (scope === "page") return { page, blocks };
  const block = blocks.find((item) => item.id === blockId);
  return block ? { page, blocks: [block] } : null;
}
