/*
|-----------------------------------------
| setting up auth-client.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { createAuthClient } from "better-auth/react";

const authBaseUrl =
  typeof window === "undefined" ? (process.env.BETTER_AUTH_URL ?? "http://localhost:3000") : window.location.origin;

export const authClient = createAuthClient({ baseURL: authBaseUrl, basePath: "/api/auth/v1" });
