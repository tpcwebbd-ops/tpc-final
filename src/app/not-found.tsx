/*
|-----------------------------------------
| setting up not-found.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, 27 August, 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard/");
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <section className="w-full max-w-xl rounded-sm bg-white p-8 text-center shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10 sm:p-10">
        <p className="text-sm font-semibold tracking-[0.2em] text-blue-600">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
          href={isDashboardRoute ? "/dashboard" : "/"}
        >
          {isDashboardRoute ? "Go Dashboard" : "Go home"}
        </Link>
      </section>
    </main>
  );
}
