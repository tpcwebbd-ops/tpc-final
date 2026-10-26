/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Codex
|-----------------------------------------
*/

"use client";

import { ArrowUpRight, FolderTree, ImageIcon, PanelLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { iconMap } from "@/components/all-icons/all-icons";
import { LoadingState } from "@/components/ui/loading-state";
import { dashboardCan } from "@/lib/dashboard/permissions";
import { removeRetiredSidebarDescendants } from "@/lib/dashboard/retired-routes";
import { useGetCategoriesQuery } from "@/redux/features/dashboard/categories/categoriesSlice";
import { useGetMediaQuery } from "@/redux/features/dashboard/media/mediaSlice";
import { useGetSidebarsQuery } from "@/redux/features/dashboard/sidebars/sidebarSlice";

const sidebarCardColors = ["#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6", "#f97316"];

export default function DashboardHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const { data, isLoading, isError } = useGetSidebarsQuery(undefined, { skip: !session });
  const items = useMemo(() => removeRetiredSidebarDescendants(data?.items ?? []), [data?.items]);
  const sidebarItemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const canReadMedia = dashboardCan(data?.access, "/dashboard/media", "read");
  const canReadCategories = dashboardCan(data?.access, "/dashboard/category", "read");
  const { data: mediaData, isLoading: mediaLoading } = useGetMediaQuery(undefined, { skip: !canReadMedia });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery(
    { page: 1, pageSize: 1 },
    { skip: !canReadCategories },
  );
  const mediaTypes = mediaData?.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const topMediaType = Object.entries(mediaTypes ?? {}).sort((a, b) => b[1] - a[1])[0];
  const liveSections = [
    canReadMedia && {
      name: "Media",
      href: "/dashboard/media",
      icon: ImageIcon,
      color: "#0ea5e9",
      value: mediaLoading ? null : (mediaData?.items.length ?? 0),
      detail: topMediaType ? `${topMediaType[1]} ${topMediaType[0]} files` : "No media files yet",
    },
    canReadCategories && {
      name: "Categories",
      href: "/dashboard/category",
      icon: FolderTree,
      color: "#f59e0b",
      value: categoriesLoading ? null : (categoriesData?.total ?? 0),
      detail: `${categoriesData?.items.filter((item) => item.status === "active").length ?? 0} active on this page`,
    },
  ].filter(Boolean) as {
    name: string;
    href: string;
    icon: typeof PanelLeft;
    color: string;
    value: number | null;
    detail: string;
  }[];
  const profileDetails = [
    { label: "Name", value: session?.user.name?.trim() || "—" },
    { label: "Email", value: session?.user.email?.trim() || "—" },
    { label: "Role", value: data?.roleName?.trim() || "Not assigned" },
  ];
  if (isPending || isLoading) return <LoadingState label="Loading dashboard" />;
  if (isError) return <DashboardError />;

  return (
    <main className="min-h-[calc(100vh-65px)] flex-1 overflow-hidden bg-[#fffaf0] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section
          aria-labelledby="dashboard-profile-heading"
          className="mb-6 rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm sm:p-6"
        >
          <h1 className="text-xl font-semibold text-stone-900" id="dashboard-profile-heading">
            Profile
          </h1>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {profileDetails.map(({ label, value }) => (
              <div className="rounded-sm bg-[#fffaf0] p-4" key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
                <dd className="mt-1 truncate text-sm font-semibold text-stone-900" title={value}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        {liveSections.length > 0 && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Live business summary</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Current totals from the dashboard areas your role can access.
                </p>
              </div>
              <span className="rounded-sm bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                Live data
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {liveSections.map((section) => (
                <LiveSummaryCard key={section.name} section={section} />
              ))}
            </div>
          </section>
        )}
        <section aria-labelledby="dashboard-sections-heading" className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-800">Navigation</p>
              <h2 className="mt-1 text-xl font-semibold text-stone-900" id="dashboard-sections-heading">
                Your dashboard sections
              </h2>
              <p className="mt-1 text-sm text-stone-600">Quick links to the areas available to your role.</p>
            </div>
            <span className="rounded-sm bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
              {items.length} {items.length === 1 ? "section" : "sections"}
            </span>
          </div>
          {items.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => {
                const parentName = item.parentId ? sidebarItemById.get(item.parentId)?.name : null;
                const color = sidebarCardColors[index % sidebarCardColors.length];
                const icon = iconMap[item.icon] ?? <PanelLeft className="h-5 w-5" />;

                return (
                  <Link
                    className="group relative isolate flex min-h-40 animate-[sidebar-editor-row-enter_420ms_cubic-bezier(.22,1,.36,1)_both] flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm transition duration-500 ease-out hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_24px_50px_-28px_rgba(120,53,15,.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:animate-none motion-reduce:transition-none"
                    href={item.url || "/dashboard"}
                    key={item.id}
                    style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                    title={`Open ${item.name}`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-9 -top-10 -z-10 h-32 w-32 rounded-full blur-2xl transition duration-700 group-hover:scale-150"
                      style={{ backgroundColor: `${color}2b` }}
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-sm text-white shadow-sm transition duration-500 group-hover:rotate-6 group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      >
                        {icon}
                      </span>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-800" />
                    </span>
                    <span className="mt-4 block min-w-0">
                      {parentName && (
                        <span className="mb-1 block truncate text-[11px] font-medium uppercase tracking-wide text-stone-400">
                          {parentName}
                        </span>
                      )}
                      <span className="block truncate font-semibold text-stone-900 transition-colors group-hover:text-amber-900">
                        {item.name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-stone-500">{item.url}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ backgroundColor: color }}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-sm border border-dashed border-[#dfd2bb] bg-white/70 p-8 text-center text-sm text-stone-600">
              No sidebar sections are available for your account yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function LiveSummaryCard({
  section,
}: {
  section: { name: string; href: string; icon: typeof PanelLeft; color: string; value: number | null; detail: string };
}) {
  const Icon = section.icon;
  return (
    <Link
      className="group rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm transition duration-700 hover:-translate-y-1 hover:shadow-[0_18px_38px_-28px_rgba(120,53,15,.5)]"
      href={section.href}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-sm text-white"
          style={{ backgroundColor: section.color }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-stone-400 transition duration-700 group-hover:text-amber-800" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-stone-900">{section.value ?? "…"}</p>
      <h3 className="mt-1 font-semibold text-stone-900">{section.name}</h3>
      <p className="mt-1 text-xs leading-5 text-stone-600">{section.detail}</p>
    </Link>
  );
}
function DashboardError() {
  return (
    <main className="grid min-h-[calc(100vh-65px)] flex-1 place-items-center bg-[#fffaf0] p-6">
      <section className="w-full max-w-lg rounded-sm border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">Could not load your dashboard summary</h1>
        <p className="mt-2 text-sm text-stone-600">Please refresh the page and try again.</p>
      </section>
    </main>
  );
}
