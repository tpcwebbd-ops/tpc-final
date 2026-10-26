/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit3, Eye, RefreshCw, Search, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import {
  useBulkDeleteSubmissionsMutation,
  useDeleteSubmissionMutation,
  useGetPagesQuery,
  useGetSubmissionsQuery,
  useUpdateSubmissionMutation,
} from "@/redux/features/dashboard/pages/pagesSlice";

type Submission = { id: string; values: Record<string, string>; createdAt: string };
type Mode = "view" | "edit" | "delete" | null;
const labelFor = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function Database() {
  const router = useRouter();
  const path = useSearchParams().get("path") ?? "";
  const { data: pages, isLoading, isError } = useGetPagesQuery();
  const page = useMemo(() => pages?.items.find((item) => item.path === path), [pages, path]);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [current, setCurrent] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const { data, error, isFetching, refetch, fulfilledTimeStamp } = useGetSubmissionsQuery(
    { pageId: page?.id ?? "", page: current, limit, q: deferredQuery },
    { skip: !page },
  );
  useEffect(() => {
    if (!refreshCooldown) return;
    const timer = window.setInterval(() => setRefreshCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [refreshCooldown]);
  const [update] = useUpdateSubmissionMutation();
  const [remove] = useDeleteSubmissionMutation();
  const [bulkDelete] = useBulkDeleteSubmissionsMutation();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (isLoading) return <LoadingState label="Loading page database" />;
  if (isError) return <main className="flex-1 p-8">Could not load pages.</main>;
  if (!page) return <main className="flex-1 p-8">Page not found.</main>;

  const allCurrentSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
  const closeModal = () => {
    setMode(null);
    setSelected(null);
  };
  const toggleRow = (id: string) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  const toggleCurrentPage = () =>
    setSelectedIds((ids) =>
      allCurrentSelected
        ? ids.filter((id) => !rows.some((row) => row.id === id))
        : Array.from(new Set([...ids, ...rows.map((row) => row.id)])),
    );
  const resetPage = () => {
    setCurrent(1);
    setSelectedIds([]);
  };

  return (
    <main className="flex-1 bg-[#fffaf0] p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4">
          <Button size="sm" variant="outline" onClick={() => router.push("/dashboard/admin/pages")}>
            <ArrowLeft />
            Go Back
          </Button>
        </div>
        <section className="mb-5 rounded-sm border border-[#eadfca] bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
            <div className="flex gap-4">
              <h1 className="font-semibold">{page.title}</h1>
              <p className="mt-1 text-[10px] text-stone-700">( {page.path} )</p>
            </div>
          </div>
          <p className="mt-1 text-sm text-stone-500">Total records: {total.toLocaleString()}</p>
        </section>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 ">
          <div className="flex w-full items-center justify-between gap-2 flex-col md:flex-row">
            <label className="relative block w-full">
              <span className="sr-only">Search submitted data</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  resetPage();
                }}
                placeholder="Search submitted data"
                className="w-full rounded-sm border border-[#eadfca] bg-white py-2 pl-9 pr-3 text-sm"
              />
            </label>
            <div className="w-full flex items-center justify-end gap-2">
              <p className="w-full text-xs text-stone-500 sm:w-auto">
                Last updated:{" "}
                {fulfilledTimeStamp ? new Date(fulfilledTimeStamp).toLocaleTimeString() : "Not yet loaded"}
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled={isFetching || refreshCooldown > 0}
                onClick={() => {
                  setRefreshCooldown(180);
                  void refetch();
                }}
                title={
                  refreshCooldown
                    ? `Refresh available in ${Math.floor(refreshCooldown / 60)}:${String(refreshCooldown % 60).padStart(2, "0")}`
                    : "Refresh submissions"
                }
              >
                <RefreshCw className={isFetching ? "animate-spin" : ""} />
                {refreshCooldown
                  ? `Refresh (${Math.floor(refreshCooldown / 60)}:${String(refreshCooldown % 60).padStart(2, "0")})`
                  : "Refresh"}
              </Button>
            </div>
          </div>
          {selectedIds.length > 0 && (
            <Button size="sm" variant="destructive" onClick={() => setConfirmBulkDelete(true)}>
              <Trash2 />
              Delete selected ({selectedIds.length})
            </Button>
          )}
        </div>

        {error && <p className="mb-3 rounded-sm bg-red-50 p-3 text-red-700">Could not load submissions.</p>}
        <div
          className={`overflow-x-auto rounded-sm border border-[#eadfca] bg-white ${isFetching ? "opacity-60" : ""}`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="w-12 p-3">
                  <input
                    aria-label="Select all records on this page"
                    checked={allCurrentSelected}
                    onChange={toggleCurrentPage}
                    type="checkbox"
                  />
                </th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Data</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">
                    <input
                      aria-label={`Select submission from ${new Date(row.createdAt).toLocaleString()}`}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className="whitespace-nowrap p-3 text-stone-600">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="max-w-lg truncate p-3">
                    {Object.entries(row.values)
                      .map(([key, value]) => `${labelFor(key)}: ${value}`)
                      .join(" · ")}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label="View submission"
                        title="View submission"
                        className="grid h-8 w-8 place-items-center rounded-sm hover:bg-amber-100"
                        onClick={() => {
                          setSelected(row);
                          setMode("view");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Edit submission"
                        title="Edit submission"
                        className="grid h-8 w-8 place-items-center rounded-sm hover:bg-amber-100"
                        onClick={() => {
                          setSelected(row);
                          setMode("edit");
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete submission"
                        title="Delete submission"
                        className="grid h-8 w-8 place-items-center rounded-sm text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelected(row);
                          setMode("delete");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="p-6 text-center text-stone-500">
              {query ? "No matching submissions." : "No submitted data."}
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              resetPage();
            }}
            className="rounded-sm border bg-white p-1 text-sm"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              Page {current} of {totalPages} · {total.toLocaleString()} records
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={current === 1}
              onClick={() => {
                setCurrent((value) => value - 1);
                setSelectedIds([]);
              }}
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current >= totalPages}
              onClick={() => {
                setCurrent((value) => value + 1);
                setSelectedIds([]);
              }}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>

        {selected && mode && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
            <section aria-modal="true" role="dialog" className="w-full max-w-lg rounded-sm bg-white p-5 shadow-2xl">
              {mode === "view" ? (
                <>
                  <h1 className="text-lg font-semibold">Submission details</h1>
                  <p className="mt-1 text-sm text-stone-500">
                    Received {new Date(selected.createdAt).toLocaleString()}
                  </p>
                  <dl className="mt-5 divide-y rounded-sm border border-[#eadfca]">
                    {Object.entries(selected.values).map(([key, value]) => (
                      <div key={key} className="grid gap-1 p-3 sm:grid-cols-3">
                        <dt className="text-sm font-medium text-stone-600">{labelFor(key)}</dt>
                        <dd className="break-words text-sm text-stone-900 sm:col-span-2">{value || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : mode === "edit" ? (
                <form
                  action={async (formData) => {
                    await update({
                      id: selected.id,
                      values: Object.fromEntries(formData.entries()) as Record<string, string>,
                    }).unwrap();
                    closeModal();
                  }}
                  className="grid gap-3"
                >
                  <h1 className="text-lg font-semibold">Edit submission</h1>
                  {Object.entries(selected.values).map(([key, value]) => (
                    <label className="grid gap-1 text-sm font-medium" key={key}>
                      {labelFor(key)}
                      <input name={key} defaultValue={value} className="rounded-sm border p-2 font-normal" />
                    </label>
                  ))}
                  <Button type="submit">Save changes</Button>
                </form>
              ) : (
                <>
                  <h1 className="text-lg font-semibold">Delete submission</h1>
                  <p className="mt-2 text-sm text-stone-600">This submission will be permanently deleted.</p>
                  <Button
                    className="mt-4"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      void remove(selected.id)
                        .unwrap()
                        .then(() => {
                          resetPage();
                          closeModal();
                        })
                    }
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button className="mt-4" size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
            </section>
          </div>
        )}

        {confirmBulkDelete && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
            <section aria-modal="true" role="dialog" className="w-full max-w-md rounded-sm bg-white p-5 shadow-2xl">
              <h1 className="text-lg font-semibold">Delete selected submissions</h1>
              <p className="mt-2 text-sm text-stone-600">
                Delete {selectedIds.length} selected submission{selectedIds.length === 1 ? "" : "s"}? This cannot be
                undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setConfirmBulkDelete(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    void bulkDelete(selectedIds)
                      .unwrap()
                      .then(() => {
                        resetPage();
                        setConfirmBulkDelete(false);
                      })
                  }
                >
                  Delete selected
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
