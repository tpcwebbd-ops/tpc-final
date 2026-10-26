/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { getNavigation, mergeNavigation, updateNavigation } from "@/lib/services/navigation";

type NavigationItem = { id: string; name: string; url: string; icon: string; visible?: boolean };
type NavigationStyle = {
  background: string;
  foreground: string;
  transparency: number;
  marginBottom: number;
  radius: "none" | "sm" | "xl" | "full";
  paddingX: number;
  paddingY: number;
};
export type NavigationData = {
  user: NavigationStyle & { enabled: boolean; iconCount: 4 | 5; hiddenPaths: string[]; items: NavigationItem[] };
  dashboard: NavigationStyle & { items: NavigationItem[] };
};
const defaults: NavigationData = {
  user: {
    enabled: true,
    iconCount: 4,
    hiddenPaths: ["/dashboard", "/login", "/registration", "/forgot-password", "/tools"],
    items: [
      { id: "home", name: "Home", url: "/", icon: "Home", visible: true },
      { id: "contact", name: "Contact", url: "/contact", icon: "Phone", visible: true },
      { id: "profile", name: "Profile", url: "/profile", icon: "User", visible: true },
    ],
    background: "#fffaf0",
    foreground: "#57534e",
    transparency: 96,
    marginBottom: 0,
    radius: "xl",
    paddingX: 8,
    paddingY: 8,
  },
  dashboard: {
    items: [
      { id: "dashboard-home", name: "Home", url: "/dashboard", icon: "Home", visible: true },
      { id: "profile", name: "Profile", url: "/dashboard/profile", icon: "User", visible: true },
      { id: "media", name: "Media", url: "/dashboard/media", icon: "Image", visible: true },
    ],
    background: "#fffaf0",
    foreground: "#57534e",
    transparency: 96,
    marginBottom: 0,
    radius: "xl",
    paddingX: 8,
    paddingY: 8,
  },
};
const access = async (request: Request) => {
  const limited = await rateLimitDistributed(request, "dashboard-navigation-api", 30, 60_000);
  return { limited, session: limited ? null : await auth.api.getSession({ headers: request.headers }) };
};
const isText = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;
const isNumber = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
const isStyle = (value: unknown): value is NavigationStyle => {
  if (!value || typeof value !== "object") return false;
  const style = value as Partial<NavigationStyle>;
  return (
    /^#[0-9a-f]{6}$/i.test(style.background ?? "") &&
    /^#[0-9a-f]{6}$/i.test(style.foreground ?? "") &&
    isNumber(style.transparency, 0, 100) &&
    isNumber(style.marginBottom, 0, 500) &&
    ["none", "sm", "xl", "full"].includes(style.radius ?? "") &&
    isNumber(style.paddingX, 0, 100) &&
    isNumber(style.paddingY, 0, 100)
  );
};
const isItems = (value: unknown, maximum: number) =>
  Array.isArray(value) &&
  value.length <= maximum &&
  value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      isText((item as NavigationItem).id, 100) &&
      isText((item as NavigationItem).name, 100) &&
      isText((item as NavigationItem).url, 500) &&
      (item as NavigationItem).url.startsWith("/") &&
      isText((item as NavigationItem).icon, 100) &&
      (typeof (item as NavigationItem).visible === "undefined" ||
        typeof (item as NavigationItem).visible === "boolean"),
  );
const isValidData = (value: unknown): value is NavigationData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<NavigationData>;
  return (
    isStyle(data.user) &&
    isStyle(data.dashboard) &&
    typeof data.user?.enabled === "boolean" &&
    (data.user?.iconCount === 4 || data.user?.iconCount === 5) &&
    Array.isArray(data.user?.hiddenPaths) &&
    data.user.hiddenPaths.length <= 50 &&
    data.user.hiddenPaths.every((path) => isText(path, 500) && path.startsWith("/")) &&
    isItems(data.user?.items, 50) &&
    isItems(data.dashboard?.items, 3)
  );
};
const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (new URL(request.url).searchParams.has("dashboard")) {
    if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
    const authorization = await authorizeDashboardRequest(session, "/api/dashboard/navigation/v1", "GET");
    if (!authorization.allowed)
      return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  }
  return Response.json(
    { navigation: await getNavigation(defaults), authenticated: Boolean(session) },
    { headers: noStore },
  );
}
export async function POST(request: Request) {
  const { limited, session } = await access(request);
  if (limited) return limited;
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/navigation/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!isValidData(body)) return Response.json({ error: "Navigation data is invalid." }, { status: 400 });
  const data = mergeNavigation(defaults, body);
  await updateNavigation(data);
  return Response.json({ navigation: data }, { headers: noStore });
}
