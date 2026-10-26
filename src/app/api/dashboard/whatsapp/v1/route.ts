/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";
import type {
  WhatsAppPadding as Padding,
  WhatsAppPosition as Position,
  WhatsAppSettings,
} from "@/lib/models/site-settings";
import { getWhatsAppSettings, updateWhatsAppSettings } from "@/lib/services/whatsapp";

const paddings = ["0", "small", "medium", "large", "extra-large", "xxl", "3xl", "4xl", "5xl"] as const;
const positions = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

async function access(request: Request, method: "GET" | "PATCH") {
  const limited = await rateLimitDistributed(request, "dashboard-whatsapp-api", 30, 60_000);
  if (limited) return { error: limited };

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };

  const authorization = await authorizeDashboardRequest(session, "/dashboard/admin/whatsapp", method);
  if (!authorization.allowed)
    return { error: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }) };

  return {};
}

export async function GET(request: Request) {
  const result = await access(request, "GET");
  if ("error" in result) return result.error;
  return Response.json({ settings: await getWhatsAppSettings() });
}

export async function PATCH(request: Request) {
  const result = await access(request, "PATCH");
  if ("error" in result) return result.error;

  const body = (await request.json().catch(() => null)) as Partial<WhatsAppSettings> | null;
  const number = body?.number?.trim().replace(/[^+\d]/g, "") ?? "";
  const defaultMessage = body?.defaultMessage?.trim() ?? "";
  if (number && !/^\+?\d{7,15}$/.test(number))
    return Response.json({ error: "Enter a valid WhatsApp number." }, { status: 400 });
  if (
    !paddings.includes(body?.paddingX as Padding) ||
    !paddings.includes(body?.paddingY as Padding) ||
    !paddings.includes(body?.marginX as Padding) ||
    !paddings.includes(body?.marginY as Padding) ||
    !positions.includes(body?.position as Position) ||
    typeof body?.isVisible !== "boolean" ||
    typeof body?.desktopTextVisible !== "boolean"
  )
    return Response.json({ error: "Invalid WhatsApp settings." }, { status: 400 });

  const settings = {
    key: "site" as const,
    number,
    paddingX: body.paddingX as Padding,
    paddingY: body.paddingY as Padding,
    marginX: body.marginX as Padding,
    marginY: body.marginY as Padding,
    position: body.position as Position,
    defaultMessage: defaultMessage.slice(0, 1000),
    isVisible: body.isVisible,
    desktopTextVisible: body.desktopTextVisible,
    updatedAt: new Date(),
  };
  return Response.json({ settings: await updateWhatsAppSettings(settings) });
}
