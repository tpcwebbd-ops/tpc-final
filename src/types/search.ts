/*
|-----------------------------------------
| setting up search.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

export type SearchScope = "block" | "page";

export type SearchResult = {
  id: string;
  pageId: string;
  pagePath: string;
  pageTitle: string;
  blockId?: string;
  blockVariant?: string;
  excerpt: string;
  matchedFields: string[];
  scope: SearchScope;
  text: string;
};

export type SearchResponse = {
  items: SearchResult[];
  query: string;
  total: number;
};
