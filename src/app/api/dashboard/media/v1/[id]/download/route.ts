/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth } from "@/app/api/lib/auth";
import { authorizeDashboardRequest, getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import { downloadMediaForApi, mediaIsAdministrator, type Media } from "@/lib/services/media";
const mimeTypeFor = (type: Media["type"]) =>
  ({
    picture: "application/octet-stream",
    video: "video/mp4",
    audio: "audio/mpeg",
    zip: "application/zip",
    doc: "application/octet-stream",
    pdf: "application/pdf",
    txt: "text/plain; charset=utf-8",
  })[type];
const safeFileName = (name: string) => name.replace(/[\\/:*?"<>|\r\n]+/g, "_").trim() || "media";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await rateLimitDistributed(request, "media-download-api");
  if (limited) return limited;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, new URL(request.url).pathname, "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const { id } = await params;
  const access = await getDashboardAccessState(session);
  const result = await downloadMediaForApi(
    id,
    access.bypassed || mediaIsAdministrator(access.roleName),
    session.user.email,
  );
  if (result.kind === "not-found") return Response.json({ error: "Media not found." }, { status: 404 });
  if (result.kind === "youtube")
    return Response.json({ error: "YouTube videos cannot be downloaded." }, { status: 400 });
  if (result.kind === "forbidden")
    return Response.json({ error: "You can only download your own media." }, { status: 403 });
  if (result.kind === "invalid-url")
    return Response.json({ error: "This media has an invalid download URL." }, { status: 422 });
  if (result.kind === "invalid-source")
    return Response.json({ error: "This media source cannot be downloaded." }, { status: 422 });
  if (result.kind === "unavailable")
    return Response.json({ error: "The media file is currently unavailable." }, { status: 502 });
  if (result.kind === "failed") return Response.json({ error: "Could not download the media file." }, { status: 502 });
  const { item, upstream } = result;
  const fileName = safeFileName(item.name);
  const asciiFileName = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "_");
  const encodedFileName = encodeURIComponent(fileName).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return new Response(upstream.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodedFileName}`,
      "Content-Type": upstream.headers.get("content-type") ?? mimeTypeFor(item.type),
      ...(upstream.headers.get("content-length") ? { "Content-Length": upstream.headers.get("content-length")! } : {}),
    },
  });
}
