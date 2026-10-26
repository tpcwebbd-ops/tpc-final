/*
|-----------------------------------------
| setting up dashboard-nav.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { ChevronDown, LogOut, PanelLeft, Pin, PinOff, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { iconMap } from "@/components/all-icons/all-icons";
import { useGetSidebarsQuery } from "@/redux/features/dashboard/sidebars/sidebarSlice";
import { type SidebarItem } from "@/redux/features/dashboard/types";

type SidebarNode = SidebarItem & { children: SidebarNode[] };

function createTree(items: SidebarItem[]) {
  const nodes = new Map(items.map((item) => [item.id, { ...item, children: [] as SidebarNode[] }]));
  const roots: SidebarNode[] = [];

  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortNodes = (entries: SidebarNode[]) => {
    entries.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
    entries.forEach((entry) => sortNodes(entry.children));
  };
  sortNodes(roots);
  return roots;
}

function SidebarLink({
  item,
  depth,
  expanded,
  pathname,
  onNavigate,
}: {
  item: SidebarNode;
  depth: number;
  expanded: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`));
  const [manuallyOpen, setManuallyOpen] = useState<boolean | null>(null);
  const childrenOpen = manuallyOpen ?? active;
  const hasChildren = item.children.length > 0;
  const icon = iconMap[item.icon] ?? <PanelLeft size={16} />;

  return (
    <div className="dashboard-nav-item">
      <div className="flex items-center gap-1">
        <Link
          aria-label={item.name}
          className={`dashboard-nav-link flex min-w-0 flex-1 items-center gap-3 rounded-sm py-2.5 text-sm font-medium ${expanded ? "px-3" : "justify-center px-2"} ${active ? "bg-amber-100/80 text-amber-950 shadow-[3px_3px_0_rgba(217,119,6,.12)] ring-1 ring-inset ring-amber-200" : "text-stone-600 hover:bg-amber-100 hover:text-amber-900"}`}
          href={item.url || "/dashboard"}
          onClick={onNavigate}
          title={!expanded ? item.name : undefined}
        >
          <span className="shrink-0">{icon}</span>
          <span className={`dashboard-nav-label truncate ${expanded ? "dashboard-nav-label-open" : ""}`}>
            {item.name}
          </span>
        </Link>
        {hasChildren && expanded && (
          <button
            aria-label={`Toggle ${item.name}`}
            aria-expanded={childrenOpen}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-stone-500 transition hover:bg-amber-100"
            onClick={() => setManuallyOpen(!childrenOpen)}
            type="button"
          >
            <ChevronDown
              className={`transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${childrenOpen ? "rotate-0" : "-rotate-90"}`}
              size={16}
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <div className={`dashboard-nav-accordion ${expanded && childrenOpen ? "dashboard-nav-accordion-open" : ""}`}>
          <div className="dashboard-nav-accordion-inner ml-4 border-l border-[#eadfca] pl-2">
            {item.children.map((child) => (
              <SidebarLink
                depth={depth + 1}
                expanded={expanded}
                item={child}
                key={child.id}
                onNavigate={onNavigate}
                pathname={pathname}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data, isLoading, isError, refetch } = useGetSidebarsQuery(undefined, {
    skip: !session,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const items = useMemo(() => createTree(data?.items ?? []), [data?.items]);
  const expanded = !collapsed || hoverExpanded;
  const navigationLoading = sessionPending || isLoading;

  useEffect(() => {
    const toggleMobileSidebar = () => setMobileOpen((open) => !open);
    window.addEventListener("speed-box-dashboard-sidebar-toggle", toggleMobileSidebar);
    return () => window.removeEventListener("speed-box-dashboard-sidebar-toggle", toggleMobileSidebar);
  }, []);

  async function logout() {
    await authClient.signOut();
    window.location.reload();
  }

  return (
    <>
      <aside
        className={`dashboard-sidebar fixed inset-y-0 left-0 z-[60] flex w-64 border-r border-[#eadfca] bg-[#fffaf0] transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none md:z-40 md:pointer-events-auto md:sticky md:top-[65px] md:h-[calc(100vh-65px)] md:translate-x-0 md:opacity-100 ${mobileOpen ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-full opacity-0"} ${expanded ? "md:w-64" : "md:w-[72px]"}`}
        onMouseEnter={() => collapsed && setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
      >
        <div
          className={`relative flex h-full w-full min-w-0 flex-col overflow-hidden p-3 pb-10 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none md:pb-3 md:translate-x-0 md:opacity-100 ${mobileOpen ? "translate-x-0 opacity-100 delay-75" : "-translate-x-3 opacity-0"}`}
        >
          <div className={`flex h-10 items-center ${expanded ? "justify-between px-2" : "justify-center"}`}>
            <Link
              className={`dashboard-brand text-xs font-bold tracking-[.22em] text-amber-900 ${expanded ? "dashboard-brand-open" : ""}`}
              href="/dashboard"
            >
              Dashboard
            </Link>
            <button
              aria-label="Close dashboard navigation"
              className="grid h-8 w-8 place-items-center rounded-sm text-stone-600 hover:bg-amber-100 md:hidden"
              onClick={() => setMobileOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              aria-label={collapsed ? "Pin sidebar open" : "Unpin sidebar"}
              className="sidebar-pin-control group relative hidden h-8 w-8 place-items-center rounded-sm text-stone-600 md:grid"
              onClick={() => setCollapsed((value) => !value)}
              type="button"
            >
              <span className="transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110 group-hover:rotate-12">
                {collapsed ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </span>
              <span className="sidebar-pin-tooltip" role="tooltip">
                {collapsed ? "Pin sidebar" : "Unpin sidebar"}
              </span>
            </button>
          </div>

          <nav className="mt-5 min-h-0 flex-1 content-start grid gap-1 overflow-x-hidden overflow-y-auto">
            {navigationLoading && (
              <p role="status" className="px-3 text-sm text-stone-500">
                Loading navigation…
              </p>
            )}
            {isError && (
              <button type="button" className="px-3 text-sm text-red-700" onClick={() => void refetch()}>
                Navigation failed. Retry
              </button>
            )}
            {!navigationLoading && !isError && !items.length && (
              <p className="px-3 text-sm text-stone-500">No permitted sections.</p>
            )}
            {items.map((item) => (
              <SidebarLink
                depth={0}
                expanded={expanded}
                item={item}
                key={item.id}
                onNavigate={() => setMobileOpen(false)}
                pathname={pathname}
              />
            ))}
          </nav>

          <div className="pointer-events-none absolute bottom-16 left-8 h-20 w-20 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-amber-200/50 blur-xl" />
          <button
            aria-label="Logout"
            className={`relative mt-auto flex items-center gap-3 rounded-sm py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 hover:text-red-800 ${expanded ? "px-3" : "justify-center px-2"}`}
            onClick={logout}
            title={!expanded ? "Logout" : undefined}
            type="button"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={`dashboard-nav-label ${expanded ? "dashboard-nav-label-open" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      <button
        aria-label="Close dashboard navigation"
        className={`fixed inset-0 z-40 bg-stone-950/20 backdrop-blur-[1px] transition-opacity duration-500 ease-out motion-reduce:transition-none md:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
        type="button"
      />
    </>
  );
}
