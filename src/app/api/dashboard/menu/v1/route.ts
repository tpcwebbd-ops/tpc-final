/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import { defaults, isMenuId, removeMenu, reorderMenus, savedMenus, saveMenu, serializeMenu } from "@/lib/services/menu";

async function access(request: Request, method: "GET" | "POST" | "DELETE") {
  const limited = await rateLimitDistributed(request, "dashboard-menu-api", 30, 60_000);
  if (limited) return { error: limited, session: null };
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session && method === "GET") return { session: null };
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }), session: null };
  const authorization = await authorizeDashboardRequest(
    session,
    method === "GET" ? "/api/dashboard/menu/v1" : "/dashboard/admin/menu",
    method,
  );
  if (!authorization.allowed)
    return {
      error: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }),
      session,
    };
  return { session };
}

export async function GET(request: Request) {
  const { error, session } = await access(request, "GET");
  if (error) return error;
  const menus = (await savedMenus()).map(serializeMenu);
  const published = menus.find((menu) => menu.data.isVisible) ?? null;
  if (!session) return Response.json({ menu: published });
  return Response.json({
    menus,
    defaults: Object.keys(defaults).map((id) => ({ menuItem: id, data: defaults[id as keyof typeof defaults] })),
  });
}

export async function POST(request: Request) {
  const { error, session } = await access(request, "POST");
  if (error || !session) return error ?? Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    menuItem?: unknown;
    data?: unknown;
    order?: unknown;
  } | null;
  if (body && Array.isArray(body.order)) {
    const order = body.order as { menuItem?: unknown; position?: unknown }[];
    if (
      !order.length ||
      order.some(
        (item) =>
          typeof item.menuItem !== "string" ||
          !item.menuItem ||
          !Number.isInteger(item.position) ||
          (item.position as number) < 0,
      )
    )
      return Response.json({ error: "Invalid menu order." }, { status: 400 });
    return Response.json({
      menus: (await reorderMenus(order as { menuItem: string; position: number }[])).map(serializeMenu),
    });
  }
  if (
    !body ||
    typeof body.menuItem !== "string" ||
    !body.menuItem ||
    body.menuItem === "site" ||
    !body.data ||
    typeof body.data !== "object" ||
    Array.isArray(body.data)
  )
    return Response.json({ error: "Invalid menu data." }, { status: 400 });
  const requestedData = body.data as Record<string, unknown>;
  if (!isMenuId(requestedData.variant)) return Response.json({ error: "Invalid menu design." }, { status: 400 });
  const data: Record<string, unknown> = { ...requestedData, variant: requestedData.variant };
  return Response.json({ menu: serializeMenu(await saveMenu(body.menuItem, requestedData.variant, data)) });
}

export async function DELETE(request: Request) {
  const { error, session } = await access(request, "DELETE");
  if (error || !session) return error ?? Response.json({ error: "Sign in required." }, { status: 401 });
  const menuItem = new URL(request.url).searchParams.get("menuItem");
  if (!menuItem || menuItem === "site") return Response.json({ error: "Invalid menu item." }, { status: 400 });
  await removeMenu(menuItem);
  return Response.json({ menuItem });
}
