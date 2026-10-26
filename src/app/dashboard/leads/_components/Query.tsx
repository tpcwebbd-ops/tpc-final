/*
|-----------------------------------------
| setting up Leads lists, filters, and bulk actions
| @author: Codex
|-----------------------------------------
*/

"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/global-toast";
import { Input } from "@/components/ui/input";
import {
  normalizeLeadMobile,
  leadCan,
  leadIsManager,
  type LeadCustomer,
  type LeadItem,
  type LeadKind,
  type LeadListParams,
} from "@/lib/dashboard/leads";
import { useDashboardPermissions } from "@/lib/dashboard/use-dashboard-permissions";
import {
  useGetLeadsQuery,
  useGetLeadsCouncilorSummariesQuery,
  useLazyGetLeadsQuery,
  useMutateLeadsMutation,
  type LeadMutation,
} from "@/redux/features/dashboard/leads/leadsSlice";

import CouncilorSummary from "./CouncilorSummary";
import { exportLeadExcel, readLeadExcel } from "./excel";
import Mutation from "./Mutation";
import { leadInput, leadPanel, leadPresentation } from "./presentation";
import {
  Action,
  EmptyState,
  errorMessage,
  LeadAvatar,
  LeadsModal,
  LeadSelect,
  LeadsSkeleton,
  Pagination,
  PageHeading,
  RecordSelect,
  StatusBadge,
  useRefreshCooldown,
} from "./ui";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const customerColumnOptions = [
  { id: "select", label: "Select" },
  { id: "name", label: "Name" },
  { id: "mobile", label: "Mobile" },
  { id: "email", label: "Email" },
  { id: "funnel", label: "Funnel" },
  { id: "councilor", label: "Councilor" },
  { id: "blocked", label: "Block" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
] as const;
type CustomerColumn = (typeof customerColumnOptions)[number]["id"];
const customerColumnIds = customerColumnOptions.map(({ id }) => id);

function savedCustomerColumns(value: string | null): CustomerColumn[] {
  if (!value) return [...customerColumnIds];
  try {
    const stored = JSON.parse(value);
    if (
      Array.isArray(stored) &&
      stored.every((column): column is CustomerColumn => customerColumnIds.includes(column as CustomerColumn))
    )
      return customerColumnIds.filter((column) => stored.includes(column));
  } catch {
    // Ignore invalid browser storage and preserve the default table layout.
  }
  return [...customerColumnIds];
}
function noteDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date)} · Asia/Dhaka`;
}
export default function Query({ kind, mine = false }: { kind: LeadKind; mine?: boolean }) {
  const [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(10);
  const [organizeOpen, setOrganizeOpen] = useState(false);
  const [text, setText] = useState(""),
    [search, setSearch] = useState("");
  const [status, setStatus] = useState(""),
    [funnelId, setFunnelId] = useState("");
  const [assignment, setAssignment] = useState(""),
    [councilor, setCouncilor] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editor, setEditor] = useState<{ item?: LeadItem } | null>(null);
  const [view, setView] = useState<LeadItem | null>(null);
  const [assigning, setAssigning] = useState<LeadCustomer | null>(null);
  const [assignee, setAssignee] = useState("");
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const [noting, setNoting] = useState<LeadCustomer | null>(null);
  const [note, setNote] = useState("");
  const [deleting, setDeleting] = useState<string[] | null>(null);
  const [workingFile, setWorkingFile] = useState(false);
  const [fileProgress, setFileProgress] = useState("");
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: { row: number; error: string }[];
  } | null>(null);
  const [errorPage, setErrorPage] = useState(1),
    [errorPageSize, setErrorPageSize] = useState(10);
  const [visibleCustomerColumns, setVisibleCustomerColumns] = useState<CustomerColumn[]>(customerColumnIds);
  const [columnPickerOpen, setColumnPickerOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const params: LeadListParams = { kind, mine, page, pageSize, search, status, funnelId, assignment, councilor };
  const area = mine && kind === "customers" ? "my-leads" : kind;
  const customerColumnStorageKey = `shop-leads-${mine ? "my-leads" : "customers"}-columns-v1`;
  const { data: permissionData } = useDashboardPermissions(`/dashboard/leads/${area}`);
  const actor = permissionData?.leadsActor ?? undefined;
  const canRead = leadCan(actor, area, "read");
  const canUpdate = leadCan(actor, area, "update");
  const canRemove = leadCan(actor, area, "delete");
  const { currentData, isLoading, isFetching, error, refetch } = useGetLeadsQuery(params, { skip: !canRead });
  // Never show another page/filter's rows while the new scoped query is pending.
  const result = currentData;
  const [load] = useLazyGetLeadsQuery();
  const [mutate, { isLoading: mutating }] = useMutateLeadsMutation();
  const cooldown = useRefreshCooldown();
  const isAdmin = Boolean(actor && leadIsManager(actor));
  const canViewCustomerDistribution = isAdmin && leadCan(actor, "councilors", "read");
  const {
    data: councilorSummaryData,
    isLoading: councilorSummariesLoading,
    error: councilorSummariesError,
  } = useGetLeadsCouncilorSummariesQuery(undefined, {
    skip: mine || (kind !== "councilors" && kind !== "customers" && kind !== "funnels") || !canViewCustomerDistribution,
  });
  const canManage = (item: LeadItem) => isAdmin || (item.kind === "customers" && item.assignedTo === actor?.email);
  const canCreate = leadCan(actor, area, "create") && (isAdmin || kind === "customers");
  const busy = mutating || workingFile;
  const term = text.trim().toLowerCase();
  const mobileTerm = normalizeLeadMobile(text);
  const items = (result?.items ?? []).filter(
    (item) =>
      !term ||
      [
        item.name,
        ...(item.kind === "funnels" ? [item.description, String(item.position)] : [item.mobile, item.email]),
      ].some((value) => value.toLowerCase().includes(term)) ||
      (item.kind !== "funnels" && mobileTerm && item.mobile === mobileTerm),
  );
  const manageable = items.filter((item) => canManage(item) && (canUpdate || canRemove));
  const activeSelection = selected.filter((id) => manageable.some((item) => item.id === id));
  const title = mine ? "My Leads" : kind === "funnels" ? "Funnels" : kind === "councilors" ? "Councilors" : "Customers";
  const presentation = leadPresentation[area];
  const recordName = kind === "funnels" ? "funnel" : kind === "councilors" ? "councilor" : "customer";
  const isCustomerColumnVisible = (column: CustomerColumn) =>
    kind !== "customers" || visibleCustomerColumns.includes(column);
  useEffect(() => {
    if (kind !== "customers") return;
    const savedColumns = savedCustomerColumns(window.localStorage.getItem(customerColumnStorageKey));
    const restore = window.setTimeout(() => setVisibleCustomerColumns(savedColumns), 0);
    return () => window.clearTimeout(restore);
  }, [customerColumnStorageKey, kind]);

  function setCustomerColumnVisibility(column: CustomerColumn, visible: boolean) {
    const next = visible
      ? customerColumnIds.filter((id) => visibleCustomerColumns.includes(id) || id === column)
      : visibleCustomerColumns.filter((id) => id !== column);
    setVisibleCustomerColumns(next);
    window.localStorage.setItem(customerColumnStorageKey, JSON.stringify(next));
  }
  function resetCustomerColumnVisibility() {
    setVisibleCustomerColumns([...customerColumnIds]);
    window.localStorage.setItem(customerColumnStorageKey, JSON.stringify(customerColumnIds));
  }
  function resetPage() {
    setPage(1);
    setSelected([]);
  }
  async function run(change: Omit<LeadMutation, "kind" | "mine">, message: string) {
    try {
      const response = await mutate({ kind, mine, ...change }).unwrap();
      toast.success(message);
      setSelected([]);
      return response;
    } catch (failure) {
      toast.error(errorMessage(failure));
      return null;
    }
  }
  async function refresh() {
    if (cooldown.remaining || isFetching || busy) return;
    cooldown.start();
    try {
      await refetch().unwrap();
      toast.success("Leads refreshed.");
    } catch (failure) {
      toast.error(errorMessage(failure));
    }
  }
  async function exportExcel() {
    setWorkingFile(true);
    try {
      const first = await load({ ...params, page: 1, pageSize: 100, search: text.trim() }, false).unwrap();
      const all = [...first.items];
      const pages = Math.ceil(first.total / 100);
      for (let next = 2; next <= pages; next++) {
        setFileProgress(`Exporting page ${next} of ${pages}…`);
        const response = await load({ ...params, page: next, pageSize: 100, search: text.trim() }, false).unwrap();
        all.push(...response.items);
      }
      await exportLeadExcel(kind, all);
      toast.success(`Exported ${all.length} records matching the current filters.`);
    } catch (failure) {
      toast.error(errorMessage(failure));
    } finally {
      setWorkingFile(false);
      setFileProgress("");
    }
  }
  async function importExcel(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setWorkingFile(true);
    setFileProgress("Reading Excel…");
    try {
      const rows = await readLeadExcel(file, kind);
      setFileProgress("Importing records…");
      const response = await mutate({ operation: "import", kind, mine, rows }).unwrap();
      const outcome = { imported: response.imported ?? 0, errors: response.errors ?? [] };
      setImportResult(outcome);
      setErrorPage(1);
      resetPage();
      if (outcome.errors.length)
        toast.error(`Imported ${outcome.imported}; ${outcome.errors.length} rows need correction.`);
      else toast.success(`Imported ${outcome.imported} records.`);
    } catch (failure) {
      toast.error(errorMessage(failure));
    } finally {
      setWorkingFile(false);
      setFileProgress("");
    }
  }
  return (
    <section className="grid min-w-0 gap-5 bg-transparent">
      <PageHeading
        title={title}
        icon={mine ? "FileText" : kind === "funnels" ? "Filter" : kind === "councilors" ? "User" : "Users"}
        iconClass={presentation.iconClass}
        hideTitleOnMobile
      >
        <Action onClick={refresh} disabled={!canRead || Boolean(cooldown.remaining) || isFetching || busy}>
          <Icon name="RefreshCw" className={isFetching ? "animate-spin" : ""} />
          {cooldown.remaining ? `Refresh (${cooldown.remaining}s)` : "Refresh"}
        </Action>
        {canCreate && (
          <Action tone="primary" onClick={() => setEditor({})} disabled={busy}>
            <Icon name="Plus" />
            Add {recordName}
          </Action>
        )}
      </PageHeading>
      {!mine && (kind === "councilors" || kind === "customers" || kind === "funnels") && canViewCustomerDistribution && (
        <CouncilorSummary
          data={councilorSummaryData}
          isLoading={councilorSummariesLoading}
          error={councilorSummariesError}
          groupBy={kind === "councilors" ? "councilor" : "funnel"}
        />
      )}
      <section className={`${leadPanel} overflow-visible p-4 sm:p-5`}>
        <button
          type="button"
          aria-expanded={organizeOpen}
          aria-controls="leads-find-organize-panel"
          onClick={() => setOrganizeOpen((open) => !open)}
          className={`flex w-full items-center justify-between gap-3 text-left ${organizeOpen ? "border-b border-[#eadfca] pb-4" : ""}`}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="grid size-8 place-items-center rounded-sm bg-amber-50 text-amber-700">
              <Icon name="Filter" className="size-4" />
            </span>
            Find and organize
          </span>
          <Icon
            name="ChevronDown"
            className={`size-4 shrink-0 text-slate-500 transition-transform ${organizeOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div id="leads-find-organize-panel" className={organizeOpen ? "mt-4 grid gap-4" : "hidden"}>
          <div className="flex flex-wrap items-start gap-2">
            <div className="relative min-w-0 flex-1 basis-full sm:min-w-48 sm:basis-auto">
              <Icon name="Search" className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-slate-400" />
              <Input
                aria-label={`Search loaded ${title.toLowerCase()}`}
                className={`${leadInput} pl-9`}
                placeholder={`Search ${kind} by ${kind === "funnels" ? "name or position" : "name, mobile, or email"}…`}
                value={text}
                maxLength={160}
                onChange={(event) => {
                  setText(event.target.value);
                  setSelected([]);
                  if (!event.target.value.trim()) {
                    setSearch("");
                    setPage(1);
                  }
                }}
              />
            </div>
            <LeadSelect
              label="Filter by status"
              value={status}
              options={statusOptions}
              onChange={(value) => {
                setStatus(value);
                resetPage();
              }}
              disabled={busy}
            />
            {kind !== "funnels" && (
              <>
                <Action className="h-10" disabled={!canRead || busy || isFetching || !actor} onClick={exportExcel}>
                  <Icon name="Download" />
                  Export Excel
                </Action>
                {canCreate && (
                  <>
                    <Action className="h-10" disabled={busy} onClick={() => fileInput.current?.click()}>
                      <Icon name="Upload" />
                      Import Excel
                    </Action>
                    <input
                      ref={fileInput}
                      type="file"
                      accept=".xlsx,.xls"
                      aria-label="Import Excel file"
                      className="hidden"
                      onChange={importExcel}
                      disabled={busy}
                    />
                  </>
                )}
              </>
            )}
          </div>
          {kind === "customers" && (
            <div className="grid gap-3 border-t border-[#eadfca] pt-4 sm:grid-cols-3">
              <div className="grid content-start gap-2">
                <p className="text-[11px] font-bold tracking-wide text-slate-500">Funnel</p>
                <RecordSelect
                  kind="funnels"
                  label="All funnels"
                  value={funnelId}
                  onChange={(value) => {
                    setFunnelId(value);
                    resetPage();
                  }}
                  disabled={busy}
                />
              </div>
              <div className="grid content-start gap-2">
                <p className="text-[11px] font-bold tracking-wide text-slate-500">Assignment</p>
                <div className="rounded-sm border border-[#eadfca] bg-[#fffdf7] p-2.5">
                  <LeadSelect
                    label="Filter by assignment"
                    value={assignment}
                    options={[
                      { value: "", label: "All assignments" },
                      { value: "assigned", label: "Assigned" },
                      { value: "unassigned", label: "Unassigned" },
                    ]}
                    onChange={(value) => {
                      setAssignment(value);
                      resetPage();
                    }}
                    disabled={busy}
                  />
                  {!mine && (
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      Filter by assigned or unassigned customers.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid content-start gap-2">
                <p className="text-[11px] font-bold tracking-wide text-slate-500">Councilor</p>
                <RecordSelect
                  kind="councilors"
                  label="All councilors"
                  value={councilor}
                  onChange={(value) => {
                    setCouncilor(value);
                    resetPage();
                  }}
                  disabled={busy}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      {busy && (
        <p
          className="flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          role="status"
        >
          <Icon name="RefreshCw" className="size-4 animate-spin" />
          {fileProgress || "Saving changes…"}
        </p>
      )}
      <div className={leadPanel}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eadfca] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{mine ? "Your customers" : `${title} directory`}</h2>
            {canRead && result && (
              <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                {result.total.toLocaleString()}
              </span>
            )}
          </div>
          {(!canRead || !result || kind === "funnels") && (
            <p className="text-xs text-slate-500">
              {canRead && result ? `${items.length} shown on this page` : "Customer relationship management"}
            </p>
          )}
          {kind === "customers" && (
            <div className="relative">
              <Action
                aria-controls="customer-column-picker"
                aria-expanded={columnPickerOpen}
                onClick={() => setColumnPickerOpen((open) => !open)}
              >
                <Icon name="Settings" />
                Columns
              </Action>
              {columnPickerOpen && (
                <div
                  id="customer-column-picker"
                  className="absolute right-0 z-30 mt-2 w-56 rounded-sm border border-[#eadfca] bg-white p-3 shadow-lg shadow-stone-200/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-800">Visible columns</p>
                    <Action className="h-7 px-2 text-[11px]" onClick={resetCustomerColumnVisibility}>
                      Reset
                    </Action>
                  </div>
                  <div className="mt-2 grid gap-1 border-t border-[#eadfca] pt-2">
                    {customerColumnOptions.map((column) => {
                      const visible = isCustomerColumnVisible(column.id);
                      return (
                        <label
                          key={column.id}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-xs text-slate-600 hover:bg-amber-50"
                        >
                          <span>{column.label}</span>
                          <Checkbox
                            aria-label={`${visible ? "Hide" : "Show"} ${column.label} column`}
                            checked={visible}
                            onCheckedChange={(checked) => setCustomerColumnVisibility(column.id, checked)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {activeSelection.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-amber-100 bg-amber-50 px-4 py-3 text-xs sm:px-5">
            <span className="mr-1 font-semibold text-amber-900">{activeSelection.length} selected</span>
            {kind === "customers" && !mine && isAdmin && (
              <Action
                tone="save"
                disabled={!canUpdate || busy || isFetching}
                onClick={() => {
                  setAssignee("");
                  setBulkAssigning(true);
                }}
              >
                Assign to councilor
              </Action>
            )}
            <Action
              disabled={!canUpdate || busy || isFetching}
              tone="save"
              onClick={() =>
                void run({ operation: "status", ids: activeSelection, status: "active" }, "Selected records activated.")
              }
            >
              Set active
            </Action>
            <Action
              disabled={!canUpdate || busy || isFetching}
              onClick={() =>
                void run(
                  { operation: "status", ids: activeSelection, status: "inactive" },
                  "Selected records deactivated.",
                )
              }
            >
              Set inactive
            </Action>
            <Action
              tone="delete"
              disabled={!canRemove || busy || isFetching}
              onClick={() => setDeleting(activeSelection)}
            >
              <Icon name="Trash2" />
              Delete selected
            </Action>
            <Action disabled={busy} onClick={() => setSelected([])}>
              Clear
            </Action>
          </div>
        )}
        {!canRead ? (
          <EmptyState
            icon="Lock"
            title="Read access required"
            description="Read permission is required to display existing records."
          />
        ) : error ? (
          <div role="alert">
            <EmptyState icon="AlertCircle" title="Could not load records" description={errorMessage(error)} />
          </div>
        ) : isLoading || (isFetching && !result) ? (
          <LeadsSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm lg:table-fixed [&_td]:px-4 [&_td]:py-4 [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:whitespace-nowrap">
                <thead className="border-b border-[#eadfca] bg-[#fffdf9] text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    {isCustomerColumnVisible("select") && (
                      <th className="w-10 p-3">
                        <Checkbox
                          aria-label="Select manageable records on this page"
                          disabled={busy || !manageable.length}
                          checked={manageable.length > 0 && activeSelection.length === manageable.length}
                          onCheckedChange={(checked) => setSelected(checked ? manageable.map((item) => item.id) : [])}
                        />
                      </th>
                    )}
                    {isCustomerColumnVisible("name") && <th className="p-3">Name</th>}
                    {kind === "funnels" ? (
                      <>
                        <th className="p-3">Position</th>
                        <th className="p-3">Description</th>
                      </>
                    ) : (
                      <>
                        {isCustomerColumnVisible("mobile") && <th className="p-3">Mobile</th>}
                        {isCustomerColumnVisible("email") && <th className="p-3">Email</th>}
                      </>
                    )}
                    {kind === "customers" && (
                      <>
                        {isCustomerColumnVisible("funnel") && <th className="p-3">Funnel</th>}
                        {isCustomerColumnVisible("councilor") && <th className="p-3">Councilor</th>}
                        {isCustomerColumnVisible("blocked") && <th className="p-3">Block</th>}
                      </>
                    )}
                    {isCustomerColumnVisible("status") && <th className="p-3">Status</th>}
                    {isCustomerColumnVisible("actions") && (
                      <th className="w-56 p-3 lg:sticky lg:right-0 lg:z-20 lg:border-l lg:border-[#eadfca] lg:bg-[#fffdf9] lg:shadow-[-8px_0_12px_-10px_rgba(120,80,30,0.24)]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-[#eadfca] transition-colors duration-700 last:border-0 hover:bg-amber-50/45 ${activeSelection.includes(item.id) ? "bg-amber-50/80" : "bg-white"}`}
                    >
                      {isCustomerColumnVisible("select") && (
                        <td className="p-3">
                          <Checkbox
                            aria-label={`Select ${item.name}`}
                            checked={activeSelection.includes(item.id)}
                            disabled={busy || !canManage(item) || (!canUpdate && !canRemove)}
                            onCheckedChange={(checked) =>
                              setSelected((previous) =>
                                checked
                                  ? [...new Set([...previous, item.id])]
                                  : previous.filter((id) => id !== item.id),
                              )
                            }
                          />
                        </td>
                      )}
                      {isCustomerColumnVisible("name") && (
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            {item.kind === "funnels" ? (
                              <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-violet-100 bg-violet-50 text-violet-600">
                                <Icon name="Filter" className="size-4" />
                              </span>
                            ) : (
                              <LeadAvatar
                                name={item.name}
                                className={
                                  item.kind === "councilors" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : ""
                                }
                              />
                            )}
                            <span className="max-w-40 truncate font-semibold text-slate-800" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                        </td>
                      )}
                      {item.kind === "funnels" ? (
                        <>
                          <td className="p-3">
                            <span className="inline-flex min-w-8 justify-center rounded-sm border border-violet-100 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                              {item.position}
                            </span>
                          </td>
                          <td className="w-52 max-w-52 truncate p-3 text-slate-500" title={item.description}>
                            {item.description || "—"}
                          </td>
                        </>
                      ) : (
                        <>
                          {isCustomerColumnVisible("mobile") && (
                            <td
                              className="w-36 max-w-36 truncate whitespace-nowrap p-3 text-xs text-slate-600 tabular-nums"
                              title={item.mobile}
                            >
                              {item.mobile}
                            </td>
                          )}
                          {isCustomerColumnVisible("email") && (
                            <td className="w-44 max-w-44 truncate p-3 text-xs text-slate-500" title={item.email}>
                              {item.email || "—"}
                            </td>
                          )}
                        </>
                      )}
                      {item.kind === "customers" && (
                        <>
                          {isCustomerColumnVisible("funnel") && (
                            <td
                              className="w-40 max-w-40 truncate p-3 text-xs text-violet-700"
                              title={item.funnelName ?? item.funnelId}
                            >
                              {item.funnelName ?? item.funnelId}
                            </td>
                          )}
                          {isCustomerColumnVisible("councilor") && (
                            <td
                              className="w-44 max-w-44 truncate p-3 text-xs text-slate-500"
                              title={item.assignedName || item.assignedTo || "Unassigned"}
                            >
                              {item.assignedName || item.assignedTo || "Unassigned"}
                            </td>
                          )}
                          {isCustomerColumnVisible("blocked") && (
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${item.blocked ? "text-red-600" : "text-slate-500"}`}
                              >
                                <Icon name={item.blocked ? "Lock" : "ShieldCheck"} className="size-3.5" />
                                {item.blocked ? "Blocked" : "No"}
                              </span>
                            </td>
                          )}
                        </>
                      )}
                      {isCustomerColumnVisible("status") && (
                        <td className="p-3">
                          <StatusBadge status={item.status} />
                        </td>
                      )}
                      {isCustomerColumnVisible("actions") && (
                        <td className="w-56 p-3 lg:sticky lg:right-0 lg:z-10 lg:border-l lg:border-[#eadfca] lg:bg-inherit lg:shadow-[-8px_0_12px_-10px_rgba(120,80,30,0.24)]">
                          <div className="flex min-w-max gap-1.5">
                            <Action
                              className="size-8 px-0"
                              title={`View ${item.name}`}
                              aria-label={`View ${item.name}`}
                              disabled={busy}
                              onClick={() => setView(item)}
                            >
                              <Icon name="Eye" />
                            </Action>
                            {canManage(item) && (
                              <>
                                <Action
                                  className="size-8 px-0"
                                  title={`Edit ${item.name}`}
                                  aria-label={`Edit ${item.name}`}
                                  disabled={!canUpdate || busy}
                                  onClick={() => setEditor({ item })}
                                >
                                  <Icon name="Edit2" />
                                </Action>
                                <Action
                                  tone="delete"
                                  className="size-8 px-0"
                                  title={`Delete ${item.name}`}
                                  aria-label={`Delete ${item.name}`}
                                  disabled={!canRemove || busy}
                                  onClick={() => setDeleting([item.id])}
                                >
                                  <Icon name="Trash2" />
                                </Action>
                              </>
                            )}
                            {item.kind === "customers" && isAdmin && canUpdate && !mine && (
                              <Action
                                disabled={busy}
                                onClick={() => {
                                  setAssigning(item);
                                  setAssignee(item.assignedTo ?? "");
                                }}
                              >
                                Assign
                              </Action>
                            )}
                            {item.kind === "customers" &&
                              mine &&
                              canUpdate &&
                              item.assignedTo === actor?.email &&
                              (actor?.bypassed || actor?.role === "councilor") && (
                                <Action
                                  disabled={busy}
                                  title={`Add note for ${item.name}`}
                                  onClick={() => {
                                    setNoting(item);
                                    setNote("");
                                  }}
                                >
                                  <Icon name="MessageSquare" />
                                  Add note
                                </Action>
                              )}
                            {item.kind === "customers" &&
                              actor?.role === "councilor" &&
                              canUpdate &&
                              !mine &&
                              !item.assignedTo &&
                              !item.blocked &&
                              item.status === "active" && (
                                <Action
                                  tone="save"
                                  disabled={busy}
                                  onClick={() =>
                                    void run({ operation: "claim", id: item.id }, "Customer assigned to you.")
                                  }
                                >
                                  Take assignment
                                </Action>
                              )}
                            {item.kind === "customers" &&
                              item.assignedTo === actor?.email &&
                              canUpdate &&
                              !item.blocked &&
                              item.status === "active" && (
                                <Action
                                  tone="save"
                                  disabled={busy}
                                  onClick={() =>
                                    void run({ operation: "counsel", id: item.id }, "Counselling recorded.")
                                  }
                                >
                                  Mark counselled
                                </Action>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!items.length && (
              <EmptyState
                icon={term ? "Search" : kind === "funnels" ? "Filter" : "Users"}
                title={term ? "No matches in the loaded records" : "No records match these filters"}
                description={
                  term
                    ? "Try another search term or search all records in the database."
                    : `Your ${kind} will appear here. Adjust your filters${canCreate ? ` or add a ${recordName} to get started` : ""}.`
                }
              >
                {term && search !== text.trim() && (
                  <Action
                    tone="primary"
                    disabled={isFetching || busy}
                    onClick={() => {
                      setSearch(text.trim());
                      resetPage();
                    }}
                  >
                    <Icon name="Database" />
                    Search database
                  </Action>
                )}
                {term && search === text.trim() && <p className="text-xs text-slate-500">Database search completed.</p>}
              </EmptyState>
            )}
            <Pagination
              page={result?.page ?? page}
              total={result?.total ?? 0}
              pageSize={pageSize}
              onPage={(next) => {
                setPage(next);
                setSelected([]);
              }}
              onSize={(size) => {
                setPageSize(size);
                resetPage();
              }}
              disabled={busy || isFetching}
            />
          </>
        )}
        {isFetching && (
          <p
            role="status"
            className="flex items-center gap-2 border-t border-[#eadfca] px-5 py-3 text-xs text-amber-800"
          >
            <Icon name="RefreshCw" className="size-3 animate-spin" />
            Loading records…
          </p>
        )}
      </div>
      {editor && (
        <Mutation
          key={editor.item?.id ?? "new"}
          kind={kind}
          mine={mine}
          item={editor.item}
          onClose={() => setEditor(null)}
        />
      )}
      {view && (
        <LeadsModal title="Record details" onClose={() => setView(null)}>
          <dl className="grid gap-1 p-5 text-sm">
            {Object.entries(view)
              .filter(([key]) => key !== "kind" && key !== "notes")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-1.5 border-b border-[#eadfca] py-3 last:border-0 sm:grid-cols-[140px_1fr]"
                >
                  <dt className="text-xs font-medium text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="min-w-0 break-words whitespace-pre-wrap">
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "—"}
                  </dd>
                </div>
              ))}
          </dl>
          {view.kind === "customers" && (
            <section className="border-t border-[#eadfca] p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-800">Notes</h3>
                <span className="text-xs text-slate-500">{view.notes?.length ?? 0}</span>
              </div>
              {view.notes?.length ? (
                <div className="mt-3 grid gap-3">
                  {view.notes.map((entry) => (
                    <article key={entry.id} className="rounded-sm border border-[#eadfca] bg-[#fffdf7] p-3 text-sm">
                      <p className="break-words whitespace-pre-wrap text-slate-700">{entry.note}</p>
                      <p className="mt-2 break-words text-xs text-slate-500">
                        {entry.authorName} · {entry.authorEmail} · {noteDate(entry.createdAt)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No notes have been added yet.</p>
              )}
            </section>
          )}
        </LeadsModal>
      )}
      {noting && (
        <LeadsModal
          title={`Add note for ${noting.name}`}
          busy={mutating}
          onClose={() => {
            setNoting(null);
            setNote("");
          }}
        >
          <form
            className="grid gap-4 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                const response = await run({ operation: "note", id: noting.id, note: note.trim() }, "Note saved.");
                if (response) {
                  setNoting(null);
                  setNote("");
                }
              })();
            }}
          >
            <div className="rounded-sm border border-[#eadfca] bg-[#fffdf7] p-3">
              <p className="text-sm font-semibold text-slate-800">{noting.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                Your councilor identity and the Bangladesh time are saved automatically.
              </p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Note
              <textarea
                aria-label={`Note for ${noting.name}`}
                className={`${leadInput} min-h-32 resize-y py-2.5`}
                disabled={mutating}
                maxLength={2000}
                placeholder="Write the customer note…"
                required
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <span className="text-right text-xs font-normal text-slate-500">{note.length}/2000</span>
            </label>
            <div className="flex justify-end gap-2 border-t border-[#eadfca] pt-4">
              <Action
                disabled={mutating}
                onClick={() => {
                  setNoting(null);
                  setNote("");
                }}
                type="button"
              >
                Cancel
              </Action>
              <Action tone="save" disabled={mutating || !note.trim()} type="submit">
                {mutating ? "Saving…" : "Save note"}
              </Action>
            </div>
          </form>
        </LeadsModal>
      )}
      {assigning && (
        <LeadsModal title="Assign councilor" busy={mutating} onClose={() => setAssigning(null)}>
          <div className="grid gap-4 p-5">
            <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-[#fffdf7] p-3">
              <LeadAvatar name={assigning.name} />
              <p className="break-words text-sm font-semibold">{assigning.name}</p>
            </div>
            <RecordSelect
              kind="councilors"
              value={assignee}
              label="Unassigned"
              selectedLabel={assigning.assignedName || assigning.assignedTo || undefined}
              onChange={setAssignee}
              activeOnly
              disabled={mutating}
            />
            <div className="flex justify-end gap-2 border-t border-[#eadfca] pt-4">
              <Action disabled={mutating} onClick={() => setAssigning(null)}>
                Cancel
              </Action>
              <Action
                tone="save"
                disabled={mutating}
                onClick={async () => {
                  const response = await run(
                    { operation: "assign", id: assigning.id, assignedTo: assignee || null },
                    "Assignment updated.",
                  );
                  if (response) setAssigning(null);
                }}
              >
                {mutating ? "Saving…" : "Save assignment"}
              </Action>
            </div>
          </div>
        </LeadsModal>
      )}
      {bulkAssigning && (
        <LeadsModal title={`Assign ${activeSelection.length} customers`} busy={mutating} onClose={() => setBulkAssigning(false)}>
          <div className="grid gap-4 p-5">
            <p className="text-sm leading-6 text-slate-600">
              Assign all {activeSelection.length} selected customers to one active councilor.
            </p>
            <RecordSelect
              kind="councilors"
              value={assignee}
              label="Choose a councilor"
              onChange={setAssignee}
              activeOnly
              disabled={mutating}
            />
            <div className="flex justify-end gap-2 border-t border-[#eadfca] pt-4">
              <Action disabled={mutating} onClick={() => setBulkAssigning(false)}>
                Cancel
              </Action>
              <Action
                tone="save"
                disabled={!assignee || mutating || !activeSelection.length}
                onClick={async () => {
                  const response = await run(
                    { operation: "assign", ids: activeSelection, assignedTo: assignee },
                    "Selected customers assigned to the councilor.",
                  );
                  if (response) setBulkAssigning(false);
                }}
              >
                {mutating ? "Saving…" : "Assign customers"}
              </Action>
            </div>
          </div>
        </LeadsModal>
      )}
      <AlertDialog
        open={Boolean(deleting)}
        busy={mutating}
        title={`Delete ${deleting?.length ?? 0} record(s)?`}
        description="This permanently deletes the selected records. Funnels and councilors with assigned customers must be cleared or reassigned first."
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          const response = await run({ operation: "delete", ids: deleting }, "Selected records deleted.");
          if (response) setDeleting(null);
        }}
      />
      {importResult && (
        <LeadsModal title="Import results" onClose={() => setImportResult(null)}>
          <div className="grid gap-3 p-5 text-sm">
            <p>
              {importResult.imported} imported · {importResult.errors.length} failed. Correct failed rows and import
              only those rows again.
            </p>
            {importResult.errors.slice((errorPage - 1) * errorPageSize, errorPage * errorPageSize).map((failure) => (
              <p key={failure.row} className="break-words rounded-sm border border-red-200 bg-red-50 p-2">
                Row {failure.row}: {failure.error}
              </p>
            ))}
            {importResult.errors.length > 10 && (
              <Pagination
                page={errorPage}
                total={importResult.errors.length}
                pageSize={errorPageSize}
                onPage={setErrorPage}
                onSize={(size) => {
                  setErrorPageSize(size);
                  setErrorPage(1);
                }}
              />
            )}
          </div>
        </LeadsModal>
      )}
    </section>
  );
}
