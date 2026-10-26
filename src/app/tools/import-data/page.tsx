/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import {
  useGetImportStatusQuery,
  useImportDataMutation,
  useResetImportDataMutation,
} from "@/app/tools/import-data/importData";
import { iconMap } from "@/components/all-icons/all-icons";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { pageDefaults, sidebarDefaults } from "@/lib/defaults/import-data";

import ImportLeads from "./ImportLeads";

const defaultPaths = sidebarDefaults.flatMap((group) => [group.url, ...(group.children ?? []).map((item) => item.url)]);

export default function ImportDataPage() {
  const { data: session, isPending } = authClient.useSession();
  const {
    data: inventory,
    isLoading: sidebarsLoading,
    error: inventoryError,
    refetch: refetchInventory,
  } = useGetImportStatusQuery(undefined, { skip: !session });
  const pagesLoading = sidebarsLoading;
  const [importData, { isLoading: importing }] = useImportDataMutation();
  const [resetImportData, { isLoading: resetting }] = useResetImportDataMutation();
  const [toast, setToast] = useState<{ error?: boolean; message: string } | null>(null);
  const [refreshRemaining, setRefreshRemaining] = useState(0);
  const [activeTab, setActiveTab] = useState<"sidebar" | "leads">("sidebar");
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [selectedSidebarUrls, setSelectedSidebarUrls] = useState(() => new Set(defaultPaths));
  const [selectedPagePaths, setSelectedPagePaths] = useState(() => new Set(pageDefaults.map((page) => page.path)));

  const savedSidebarPaths = useMemo(() => new Set(inventory?.sidebarUrls ?? []), [inventory?.sidebarUrls]);
  const savedPagePaths = useMemo(() => new Set(inventory?.pagePaths ?? []), [inventory?.pagePaths]);
  const sidebarReady = [...selectedSidebarUrls].every((path) => savedSidebarPaths.has(path));
  const pagesReady = [...selectedPagePaths].every((path) => savedPagePaths.has(path));
  const ready = sidebarReady && pagesReady;
  const hasSelection = Boolean(
    (inventory?.canImportSidebars && selectedSidebarUrls.size > 0) ||
    (inventory?.canImportPages && selectedPagePaths.size > 0),
  );
  const resettableCount = (inventory?.resettableSidebarCount ?? 0) + (inventory?.resettablePageCount ?? 0);

  useEffect(() => {
    if (!refreshRemaining) return;
    const timer = window.setInterval(() => setRefreshRemaining((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [refreshRemaining]);

  async function handleImport() {
    try {
      const result = await importData({
        sidebarUrls: inventory?.canImportSidebars ? [...selectedSidebarUrls] : [],
        pagePaths: inventory?.canImportPages ? [...selectedPagePaths] : [],
      }).unwrap();
      setToast({
        message: `Import complete: ${result.inserted} added, ${result.updated} sidebar records aligned, ${result.pagesInserted} pages created.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error &&
              "data" in error &&
              typeof error.data === "object" &&
              error.data &&
              "error" in error.data &&
              typeof error.data.error === "string"
            ? error.data.error
            : "Could not import the default data.";
      setToast({ error: true, message });
    }
  }

  function toggleSidebar(url: string, checked: boolean) {
    const group = sidebarDefaults.find((item) => item.url === url);
    const parent = sidebarDefaults.find((item) => item.children?.some((child) => child.url === url));
    setSelectedSidebarUrls((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(url);
        if (parent) next.add(parent.url);
      } else {
        next.delete(url);
        if (group) group.children?.forEach((child) => next.delete(child.url));
      }
      return next;
    });
  }

  async function handleRefresh() {
    if (refreshRemaining) return;
    try {
      await refetchInventory().unwrap();
      setRefreshRemaining(60);
      setToast({ message: "Import status refreshed." });
    } catch {
      setToast({ error: true, message: "Could not refresh import status." });
    }
  }

  async function handleReset() {
    try {
      const result = await resetImportData().unwrap();
      setConfirmingReset(false);
      setToast({
        message: `Reset complete: ${result.sidebarsDeleted} sidebar records and ${result.pagesDeleted} pages deleted.`,
      });
      void refetchInventory();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error &&
              "data" in error &&
              typeof error.data === "object" &&
              error.data &&
              "error" in error.data &&
              typeof error.data.error === "string"
            ? error.data.error
            : "Could not reset the imported sidebar and pages.";
      setToast({ error: true, message });
    }
  }

  if (isPending) return <ImportSkeleton />;
  if (!session)
    return (
      <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-4">
        <Link
          className="cursor-pointer rounded-sm bg-amber-100 px-2.5 py-1.5 text-[0.8rem] font-medium text-amber-950 transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200"
          href="/login"
        >
          Sign in required
        </Link>
      </main>
    );

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      {toast ? <Toast error={toast.error} message={toast.message} onDismiss={() => setToast(null)} /> : null}
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-200/50 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm bg-amber-100 text-amber-900">
              {iconMap.Database}
            </span>
            <div>
              <h1 className="text-xl font-semibold text-stone-900">Data importer</h1>
              <p className="mt-1 text-sm text-stone-500">
                Default navigation, pages, and Leads demo data in one place.
              </p>
            </div>
          </div>
          {activeTab === "sidebar" && (
            <div className="flex flex-wrap gap-2">
              <Button
                className="cursor-pointer border-[#eadfca] transition duration-700 hover:-translate-y-0.5 hover:bg-amber-50"
                disabled={sidebarsLoading || pagesLoading || importing || Boolean(refreshRemaining)}
                onClick={() => void handleRefresh()}
                size="sm"
                variant="outline"
              >
                <span className={sidebarsLoading || pagesLoading ? "animate-spin" : ""}>{iconMap.RefreshCw}</span>
                {refreshRemaining ? `Refresh ${refreshRemaining}s` : "Refresh"}
              </Button>
              <Button
                className="cursor-pointer bg-emerald-100 text-emerald-900 transition duration-700 hover:-translate-y-0.5 hover:bg-emerald-200"
                disabled={importing || !hasSelection}
                onClick={() => void handleImport()}
                size="sm"
              >
                {iconMap.Database}
                {importing ? "Importing…" : ready ? "Sync selected" : "Import selected"}
              </Button>
            </div>
          )}
        </div>
        <div aria-label="Import type" className="relative mt-6 flex gap-2 border-b border-[#eadfca]" role="tablist">
          {[
            { id: "sidebar", label: "Import Sidebar", icon: iconMap.Menu },
            { id: "leads", label: "Import Leads", icon: iconMap.Users },
          ].map((tab) => (
            <button
              aria-controls={`import-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${activeTab === tab.id ? "border-amber-600 text-amber-800" : "border-transparent text-stone-500 hover:text-stone-800"}`}
              id={`import-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "sidebar" | "leads")}
              role="tab"
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "sidebar" ? (
          <div
            aria-labelledby="import-tab-sidebar"
            className="relative mt-6 grid gap-4 lg:grid-cols-2"
            id="import-sidebar"
            role="tabpanel"
          >
            {inventoryError && (
              <p role="alert" className="text-sm text-red-700">
                Could not load import status. Use Refresh to try again.
              </p>
            )}
            <fieldset disabled={!inventory?.canImportSidebars} className="min-w-0 disabled:opacity-60">
              <ImportGroup
                complete={sidebarReady}
                count={inventory?.sidebarUrls.length ?? 0}
                loading={sidebarsLoading}
                title="Sidebar"
              >
                {sidebarDefaults.map((group) => (
                  <div className="rounded-sm border border-[#eadfca] bg-white p-3" key={group.url}>
                    <ImportRow
                      checked={selectedSidebarUrls.has(group.url)}
                      complete={savedSidebarPaths.has(group.url)}
                      icon={group.icon}
                      label={group.name}
                      onCheckedChange={(checked) => toggleSidebar(group.url, checked)}
                    />
                    <div className="mt-2 grid gap-1 border-l border-[#eadfca] pl-3">
                      {(group.children ?? []).map((child) => (
                        <ImportRow
                          complete={savedSidebarPaths.has(child.url)}
                          checked={selectedSidebarUrls.has(child.url)}
                          icon={child.icon}
                          key={child.url}
                          label={child.name}
                          onCheckedChange={(checked) => toggleSidebar(child.url, checked)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </ImportGroup>
            </fieldset>
            <fieldset disabled={!inventory?.canImportPages} className="min-w-0 disabled:opacity-60">
              <ImportGroup
                complete={pagesReady}
                count={inventory?.pagePaths.length ?? 0}
                loading={pagesLoading}
                title="Pages"
              >
                {pageDefaults.map((page) => (
                  <ImportRow
                    complete={savedPagePaths.has(page.path)}
                    checked={selectedPagePaths.has(page.path)}
                    icon="FileText"
                    key={page.path}
                    label={page.title}
                    path={page.path}
                    onCheckedChange={(checked) =>
                      setSelectedPagePaths((current) => {
                        const next = new Set(current);
                        if (checked) next.add(page.path);
                        else next.delete(page.path);
                        return next;
                      })
                    }
                  />
                ))}
              </ImportGroup>
            </fieldset>
          </div>
        ) : (
          <div aria-labelledby="import-tab-leads" className="relative mt-6" id="import-leads" role="tabpanel">
            <ImportLeads onNotice={setToast} />
          </div>
        )}
        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#eadfca] pt-5">
          <div>
            <h2 className="font-semibold text-stone-900">Reset imported data</h2>
            <p className="mt-1 text-sm text-stone-500">
              Deletes only the sidebar and pages created by this importer. Leads and other data stay untouched.
            </p>
          </div>
          <Button
            className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:-translate-y-0.5 hover:bg-red-200"
            disabled={resetting || !inventory?.canReset || resettableCount === 0}
            onClick={() => setConfirmingReset(true)}
            size="sm"
            variant="destructive"
          >
            {iconMap.Trash2}
            Reset All
          </Button>
        </div>
        <AlertDialog
          busy={resetting}
          busyLabel="Resetting…"
          confirmLabel="Reset All"
          description="This permanently deletes only sidebar and page records created by this importer. It does not delete Leads or other data."
          onCancel={() => setConfirmingReset(false)}
          onConfirm={() => void handleReset()}
          open={confirmingReset}
          title="Reset imported data?"
        />
      </section>
    </main>
  );
}

function ImportGroup({
  children,
  complete,
  count,
  loading,
  title,
}: {
  children: ReactNode;
  complete: boolean;
  count: number;
  loading: boolean;
  title: string;
}) {
  return (
    <section className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <p className="mt-0.5 text-xs text-stone-500">{loading ? "Checking…" : `${count} saved`}</p>
        </div>
        <span className={complete ? "text-emerald-700" : "text-amber-700"}>
          {complete ? iconMap.Check : iconMap.RefreshCw}
        </span>
      </div>
      <div className="grid gap-2">{loading ? <ImportSkeleton compact /> : children}</div>
    </section>
  );
}

function ImportRow({
  checked,
  complete,
  icon,
  label,
  onCheckedChange,
  path,
}: {
  checked: boolean;
  complete: boolean;
  icon: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  path?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
      <Checkbox aria-label={`Import ${label}`} checked={checked} onCheckedChange={onCheckedChange} />
      <span className="shrink-0 text-stone-500">{iconMap[icon] ?? iconMap.FileText}</span>
      <span className={`min-w-0 flex-1 truncate ${complete ? "text-stone-500" : "text-stone-800"}`} title={label}>
        {label}
      </span>
      {path ? (
        <span className="max-w-24 truncate text-xs text-stone-400" title={path}>
          {path}
        </span>
      ) : null}
      <span className={complete ? "shrink-0 text-emerald-700" : "shrink-0 text-amber-700"}>
        {complete ? iconMap.Check : iconMap.Plus}
      </span>
    </div>
  );
}

function ImportSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <div className="grid gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-4">
      <div className="w-full max-w-5xl rounded-sm border border-[#eadfca] bg-white p-7">
        <Skeleton className="size-10" />
        <Skeleton className="mt-5 h-7 w-52" />
        <Skeleton className="mt-3 h-5 w-80 max-w-full" />
      </div>
    </main>
  );
}
