/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/app/api/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
