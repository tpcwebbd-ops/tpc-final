/*
|-----------------------------------------
| setting up layout.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/app/api/lib/auth";
import { getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import MobileNavigation from "@/components/MobileNavigation";

import { DashboardAccessDenied } from "./dashboard-access-denied";
import { DashboardNav } from "./dashboard-nav";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) redirect("/login");

  if (requestHeaders.get("x-dashboard-authorization") === "denied") {
    const access = await getDashboardAccessState(session);
    const message =
      access.message ?? decodeURIComponent(requestHeaders.get("x-dashboard-authorization-message") ?? "Unauthorized.");
    return <DashboardAccessDenied blocked={access.blocked} message={message} />;
  }

  return (
    <div className="dashboard-shell flex min-h-[calc(100vh-65px)] bg-[#fffaf0]">
      <DashboardNav />
      <div className="min-w-0 flex-1 pb-16 md:pb-0">{children}</div>
      <MobileNavigation dashboard />
    </div>
  );
}
