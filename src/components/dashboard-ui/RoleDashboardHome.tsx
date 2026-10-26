/*
|-----------------------------------------
| setting up RoleDashboardHome.tsx for the App
| @author: Codex
|-----------------------------------------
*/

import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  FileText,
  type LucideIcon,
  Menu,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/app/api/lib/auth";
import { getDashboardAccessState } from "@/app/api/lib/dashboard-authorization";
import { dashboardCanEnter } from "@/lib/dashboard/permissions";

type RoleHomeLink = { title: string; description: string; href: string; icon: LucideIcon };

const content = {
  developer: {
    eyebrow: "Developer workspace",
    title: "Build, secure, and maintain the dashboard.",
    description:
      "Developer tools keep the technical foundation reliable: user identities, session health, verification records, navigation, and dashboard structure.",
    accent: "bg-amber-100 text-amber-900",
    primary: { label: "Manage users", href: "/dashboard/developer/users" },
    secondary: { label: "Configure navigation", href: "/dashboard/developer/navigation" },
    highlights: ["Identity controls", "Session oversight", "Dashboard structure"],
    links: [
      {
        title: "Users",
        description: "Review user records and account details.",
        href: "/dashboard/developer/users",
        icon: Users,
      },
      {
        title: "Sessions",
        description: "Inspect active sessions and authentication activity.",
        href: "/dashboard/developer/session",
        icon: ShieldCheck,
      },
      {
        title: "Verification",
        description: "Review account verification records.",
        href: "/dashboard/developer/verification",
        icon: CheckCircle2,
      },
      {
        title: "Sidebar",
        description: "Organize the dashboard navigation hierarchy.",
        href: "/dashboard/developer/sidebar",
        icon: Menu,
      },
      {
        title: "Navigation",
        description: "Manage public and dashboard navigation settings.",
        href: "/dashboard/developer/navigation",
        icon: Wrench,
      },
      {
        title: "Accounts",
        description: "Review linked account providers and access details.",
        href: "/dashboard/developer/account",
        icon: Settings,
      },
    ] satisfies RoleHomeLink[],
  },
  admin: {
    eyebrow: "Administrator workspace",
    title: "Manage access, content, and publishing.",
    description:
      "Administrator tools help you control who can work in the dashboard, update site content, and publish changes safely across your storefront.",
    accent: "bg-emerald-100 text-emerald-900",
    primary: { label: "Manage access", href: "/dashboard/admin/access" },
    secondary: { label: "Open pages", href: "/dashboard/admin/pages" },
    highlights: ["Role-based access", "Content management", "Safe publishing"],
    links: [
      {
        title: "Access",
        description: "Assign roles and control dashboard access.",
        href: "/dashboard/admin/access",
        icon: ShieldCheck,
      },
      {
        title: "Roles",
        description: "Define permissions for each dashboard role.",
        href: "/dashboard/admin/role",
        icon: Users,
      },
      {
        title: "Pages",
        description: "Create, edit, and manage published pages.",
        href: "/dashboard/admin/pages",
        icon: FileText,
      },
      {
        title: "Menu",
        description: "Edit storefront menus and navigation layouts.",
        href: "/dashboard/admin/menu",
        icon: Menu,
      },
      {
        title: "Build",
        description: "Revalidate pages after publishing changes.",
        href: "/dashboard/admin/build",
        icon: RefreshCw,
      },
      {
        title: "Tracking",
        description: "Manage marketing and analytics integrations.",
        href: "/dashboard/admin/tracking",
        icon: BarChart3,
      },
    ] satisfies RoleHomeLink[],
  },
} as const;

export async function RoleDashboardHome({ role }: { role: keyof typeof content }) {
  const data = content[role];
  const session = await auth.api.getSession({ headers: await headers() });
  const access = session ? await getDashboardAccessState(session) : undefined;
  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-10">
            <div>
              <p
                className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-[.16em] ${data.accent}`}
              >
                {data.eyebrow}
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {data.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{data.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {dashboardCanEnter(access, data.primary.href) && (
                  <Link className="primary-button" href={data.primary.href}>
                    {data.primary.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
                {dashboardCanEnter(access, data.secondary.href) && (
                  <Link className="secondary-button" href={data.secondary.href}>
                    {data.secondary.label}
                  </Link>
                )}
              </div>
            </div>
            <aside className="rounded-sm border border-[#eadfca] bg-[#fffdfa] p-5">
              <p className="text-sm font-semibold text-stone-900">Your responsibilities</p>
              <ul className="mt-4 space-y-3">
                {data.highlights.map((item) => (
                  <li className="flex items-center gap-2 text-sm text-stone-700" key={item}>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">Quick access</h2>
              <p className="mt-1 text-sm text-stone-600">Choose an area to continue your work.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.links
              .filter((item) => dashboardCanEnter(access, item.href))
              .map(({ title, description, href, icon: Icon }) => (
                <Link
                  className="group rounded-sm border border-[#eadfca] bg-white p-5 transition duration-700 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
                  href={href}
                  key={href}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-sm bg-amber-100 text-amber-800">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-stone-400 transition group-hover:text-amber-800" />
                  </div>
                  <h3 className="mt-4 font-semibold text-stone-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
