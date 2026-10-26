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
import { createMediaForApi, isValidImageBBDeleteUrl, serializeMedia } from "@/lib/services/media";

const maxImageSize = 32 * 1024 * 1024;

export async function POST(request: Request) {
  const limited = await rateLimitDistributed(request, "imagebb-upload");
  if (limited) return limited;

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/media/v1/imagebb", "POST");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) return Response.json({ error: "ImageBB is not configured." }, { status: 503 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");
  if (!(file instanceof File) || !file.type.startsWith("image/"))
    return Response.json({ error: "Please choose a valid image file." }, { status: 400 });
  if (file.size > maxImageSize) return Response.json({ error: "Image must be 32 MB or smaller." }, { status: 400 });

  const imageData = new FormData();
  imageData.append("image", file, file.name);
  imageData.append("name", file.name.replace(/\.[^.]+$/, ""));
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body: imageData,
  });
  const result = (await response.json().catch(() => null)) as {
    data?: { delete_url?: string; display_url?: string; url?: string; url_viewer?: string };
    error?: { message?: string };
    success?: boolean;
  } | null;
  if (
    !response.ok ||
    !result?.success ||
    !result.data ||
    !result.data.delete_url ||
    !isValidImageBBDeleteUrl(result.data.delete_url)
  )
    return Response.json(
      { error: result?.error?.message ?? "ImageBB upload failed." },
      { status: response.ok ? 502 : response.status },
    );

  const url = result.data.display_url ?? result.data.url;
  if (!url) return Response.json({ error: "ImageBB upload failed." }, { status: 502 });
  const created = await createMediaForApi(
    {
      name: file.name,
      url,
      type: "picture",
      uploadPlane: "imageBB",
      deleteUrl: result.data.delete_url,
    },
    session.user.email,
  );
  if (created.kind !== "created") return Response.json({ error: "ImageBB media could not be saved." }, { status: 500 });
  return Response.json({ item: serializeMedia(created.item) }, { status: 201 });
}
