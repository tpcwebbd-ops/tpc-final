/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 2 September, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { isSearchQueryValid, normalizeSearchQuery, searchPublishedPages } from "@/lib/search/server";

function resultLimit(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 6) : undefined;
}

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "public-site-search", 30, 60_000);
  if (limited) return limited;

  const query = normalizeSearchQuery(new URL(request.url).searchParams.get("q"));
  if (!isSearchQueryValid(query))
    return Response.json({ error: "Enter at least 3 characters to search." }, { status: 400 });

  try {
    return Response.json(
      await searchPublishedPages(query, resultLimit(new URL(request.url).searchParams.get("limit"))),
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json({ error: "Search is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
