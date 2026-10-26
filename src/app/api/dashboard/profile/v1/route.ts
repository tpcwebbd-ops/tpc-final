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
import { getProfile, saveProfile, validGender } from "@/lib/services/profile";

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-profile-api", 30, 60_000);
  if (limited) return limited;
  const activeSession = await auth.api.getSession({ headers: request.headers });
  if (!activeSession) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(activeSession, "/api/dashboard/profile/v1", "GET");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  return Response.json({
    profile: await getProfile(
      activeSession.user.id,
      activeSession.user.email,
      activeSession.user.name,
      activeSession.user.image,
    ),
  });
}

export async function PATCH(request: Request) {
  const limited = await rateLimitDistributed(request, "dashboard-profile-api", 30, 60_000);
  if (limited) return limited;
  const activeSession = await auth.api.getSession({ headers: request.headers });
  if (!activeSession) return Response.json({ error: "Sign in required." }, { status: 401 });
  const authorization = await authorizeDashboardRequest(activeSession, "/api/dashboard/profile/v1", "PATCH");
  if (!authorization.allowed)
    return Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    mobileNumber?: string;
    address?: string;
    bio?: string;
    profilePicture?: string;
    gender?: string;
  } | null;
  const name = body?.name?.trim();
  if (!name) return Response.json({ error: "Name is required." }, { status: 400 });
  const gender = body?.gender ?? "";
  if (!validGender(gender)) return Response.json({ error: "Invalid gender." }, { status: 400 });
  const profilePicture = body?.profilePicture?.trim() ?? "";
  if (profilePicture && !/^https?:\/\//i.test(profilePicture))
    return Response.json({ error: "Invalid profile picture." }, { status: 400 });
  const profile = {
    name,
    email: activeSession.user.email,
    mobileNumber: body?.mobileNumber?.trim() ?? "",
    address: body?.address?.trim() ?? "",
    bio: body?.bio?.trim() ?? "",
    profilePicture,
    gender,
  };
  await saveProfile(activeSession.user.id, activeSession.user.email, profile);
  return Response.json({ profile });
}
