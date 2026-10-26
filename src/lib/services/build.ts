/*
|-----------------------------------------
| setting up build service for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { findBuildPages, findBuildRecord, findBuildRecords, saveBuildCooldowns } from "@/lib/models/site-settings";

const cooldownMs = 3 * 60_000;
export type BuildTarget =
  "all" | "topbanner" | "menu" | "footer" | "whatsapp" | "user-navigation" | "dashboard-navigation" | `page:${string}`;
export type BuildItem = { id: BuildTarget; name: string; path?: string; kind: "component" | "page" };
const codedPagePaths: Array<[string, string]> = [
  ["/", "Home"],
  ["/forgot-password", "Forgot Password"],
  ["/login", "Login"],
  ["/registration", "Registration"],
];
const codedPages: BuildItem[] = codedPagePaths.map(([path, name]) => ({
  id: `page:${path}` as BuildTarget,
  name,
  path,
  kind: "page",
}));
const excluded = (path: string) =>
  path === "/login" ||
  path === "/registration" ||
  path === "/forgot-password" ||
  path.startsWith("/forgot-password/") ||
  path === "/dashboard" ||
  path.startsWith("/dashboard/") ||
  path === "/tools" ||
  path.startsWith("/tools/");
export const buildResponse = (cooldowns: Record<string, string | null> = {}, count = 0, items: BuildItem[] = []) => ({
  cooldowns,
  count,
  items,
});

export async function getBuildItems() {
  const dynamic = await findBuildPages();
  const components: BuildItem[] = [
    "topbanner",
    "menu",
    "footer",
    "whatsapp",
    "user-navigation",
    "dashboard-navigation",
  ].map(
    (id) =>
      ({
        id,
        name:
          id === "topbanner"
            ? "Top banner"
            : id
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join(" "),
        kind: "component",
      }) as BuildItem,
  );
  const pages = dynamic
    .filter((page) => page.path && !excluded(page.path))
    .map((page) => ({
      id: `page:${page.path}` as BuildTarget,
      name: page.title || page.path,
      path: page.path,
      kind: "page" as const,
    }));
  return [...new Map([...components, ...codedPages, ...pages].map((item) => [item.id, item])).values()];
}
export async function getBuildStatus(items: BuildItem[]) {
  const records = await findBuildRecords([...items.map((item) => item.id), "all"]);
  return Object.fromEntries(records.map((record) => [record.key, record.cooldownUntil.toISOString()]));
}
export async function revalidateBuild(target: BuildTarget, items: BuildItem[]) {
  const now = new Date(),
    existing = await findBuildRecord(target);
  if (existing?.cooldownUntil && existing.cooldownUntil > now)
    return { kind: "cooldown" as const, until: existing.cooldownUntil };
  const targets = target === "all" ? items.map((item) => item.id) : [target];
  let count = 0;
  if (target === "all" || ["topbanner", "menu", "footer", "whatsapp"].includes(target)) {
    revalidatePath("/", "layout");
    count += 1;
  }
  if (target === "all" || target === "user-navigation" || target === "dashboard-navigation") {
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/developer/navigation");
    count += 1;
  }
  if (target === "all") {
    revalidatePath("/", "page");
    revalidatePath("/dashboard", "layout");
    items.filter((item) => item.kind === "page" && item.path).forEach((item) => revalidatePath(item.path!));
    count += items.filter((item) => item.kind === "page").length;
  }
  if (target.startsWith("page:")) {
    revalidatePath(target.slice(5));
    count += 1;
  }
  revalidateTag("site-pages", "max");
  if (target === "all" || target.startsWith("page:")) revalidateTag("public-page-search", { expire: 0 });
  const cooldownUntil = new Date(Date.now() + cooldownMs);
  const keys = target === "all" ? ["all", ...targets] : targets;
  await saveBuildCooldowns(keys, cooldownUntil, now);
  return {
    kind: "revalidated" as const,
    count,
    cooldowns: Object.fromEntries(keys.map((key) => [key, cooldownUntil.toISOString()])),
  };
}
