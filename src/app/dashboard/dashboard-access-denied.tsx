/*
|-----------------------------------------
| setting up dashboard-access-denied.tsx for the App
| @author: Codex
|-----------------------------------------
*/

"use client";

import { LogOut } from "lucide-react";

import { authClient } from "@/app/api/lib/auth-client";

type DashboardAccessDeniedProps = {
  blocked: boolean;
  message: string;
};

export function DashboardAccessDenied({ blocked, message }: DashboardAccessDeniedProps) {
  async function logout() {
    await authClient.signOut();
    window.location.assign("/login");
  }

  return (
    <main className="grid min-h-[calc(100vh-65px)] flex-1 place-items-center bg-[#fffaf0] p-4 sm:p-8">
      <section className="w-full max-w-lg rounded-sm border border-red-200 bg-white p-6 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-10">
        {blocked ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-red-700">Blocked</p>
            <h1 className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl">Your account is blocked</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">{message}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-red-700">Unauthorized</p>
            <h1 className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl">You cannot access this area</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {message} Ask an administrator to assign a role with the required permission.
            </p>
          </>
        )}
        <button
          className="mt-6 cursor-pointer inline-flex items-center gap-2 rounded-sm bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
          onClick={logout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>
    </main>
  );
}
