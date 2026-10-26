/*
|-----------------------------------------
| setting up Leads layout
| @author: Codex
|-----------------------------------------
*/

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/app/api/lib/auth";
import { getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";

import Navigation from "./_components/Navigation";

export default async function LeadsLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const access = await getDashboardAccessState(session);
  const role = access.roleName ?? (access.bypassed ? "Unrestricted" : "Unassigned");

  return (
    <div
      className="mx-auto grid min-w-0 w-full max-w-7xl gap-5 p-3 text-stone-800 sm:p-5 lg:gap-6 lg:p-6"
      style={{ fontFamily: "var(--font-geist-sans, Arial), sans-serif" }}
    >
      <Navigation role={role} email={session.user.email ?? "Email unavailable"} />
      {children}
    </div>
  );
}
