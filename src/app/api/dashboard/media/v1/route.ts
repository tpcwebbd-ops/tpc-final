/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest, getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import {
  createMediaForApi,
  listMediaForApi,
  mediaIsAdministrator,
  serializeMedia,
  type Media,
} from "@/lib/services/media";

export type { Media };
const uploadPlanes = new Set<Media["uploadPlane"]>(["imageBB", "Youtube", "Uploadthings"]);
const mediaTypes = new Set<Media["type"]>(["picture", "video", "audio", "zip", "doc", "pdf", "txt"]);
const youtubeUrl =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}(?:[?&/#].*)?$/i;

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "media-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/media/v1", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const access = await getDashboardAccessState(session);
  return Response.json({
    items: await listMediaForApi(!(access.bypassed || mediaIsAdministrator(access.roleName)), session.user.email),
  });
}

export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "media-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/media/v1", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Partial<Media> | null;
  if (
    !body?.name?.trim() ||
    !body.url?.trim() ||
    !body.uploadPlane ||
    !body.type ||
    !uploadPlanes.has(body.uploadPlane) ||
    !mediaTypes.has(body.type)
  )
    return Response.json({ error: "Valid media details are required." }, { status: 400 });
  if (body.uploadPlane === "Youtube" && !youtubeUrl.test(body.url.trim()))
    return Response.json({ error: "A valid YouTube URL is required." }, { status: 400 });
  if (body.uploadPlane === "imageBB")
    return Response.json(
      { error: "ImageBB media must be created through the provider upload endpoint." },
      { status: 400 },
    );
  if (body.uploadPlane === "Uploadthings") {
    const fileKey = body.fileKey?.trim();
    if (!fileKey) return Response.json({ error: "UploadThing file details are required." }, { status: 400 });
  }
  const result = await createMediaForApi(
    {
      name: body.name.trim(),
      url: body.url.trim(),
      uploadPlane: body.uploadPlane,
      type: body.type,
      ...(body.uploadPlane === "Uploadthings" && typeof body.fileKey === "string" ? { fileKey: body.fileKey } : {}),
    },
    session.user.email,
  );
  if (result.kind === "not-owner")
    return Response.json({ error: "This UploadThing file was not uploaded by your account." }, { status: 403 });
  if (result.kind === "duplicate")
    return Response.json({ error: "This UploadThing file is already in the media library." }, { status: 409 });
  return Response.json({ item: serializeMedia(result.item) }, { status: 201 });
}
