/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import {
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FileType2,
  ImageIcon,
  Music,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";

import { UploadButton } from "@/app/api/lib/uploadthing";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { downloadMediaZip } from "@/lib/media-export";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
  useDeleteMediaManyMutation,
  useGetMediaQuery,
  useUpdateMediaMutation,
} from "@/redux/features/dashboard/media/mediaSlice";
import { type MediaItem } from "@/redux/features/dashboard/types";

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;
const PAGE_SIZES = [10, 25, 50, 100] as const;
const MEDIA_FILTERS = [
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "video", label: "Video", icon: Video },
  { id: "audio", label: "Audio", icon: Music },
  { id: "zip", label: "ZIP", icon: Package },
  { id: "document", label: "Documents", icon: FileText },
  { id: "pdf", label: "PDF", icon: FileType2 },
] as const;
type MediaFilter = "" | (typeof MEDIA_FILTERS)[number]["id"];

function youtubeThumbnail(url: string) {
  const id = url.match(YOUTUBE_ID)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function previewFor(item: MediaItem) {
  const youtubeImage = item.uploadPlane === "Youtube" ? youtubeThumbnail(item.url) : null;
  if (youtubeImage)
    return <Image alt={item.name} className="h-full w-full object-cover" height={240} src={youtubeImage} width={320} />;
  if (item.type === "picture")
    return <Image alt={item.name} className="h-full w-full object-cover" height={240} src={item.url} width={320} />;
  if (item.type === "video") return <Video className="h-8 w-8 text-violet-700" />;
  if (item.type === "audio") return <Music className="h-8 w-8 text-emerald-700" />;
  if (item.type === "zip") return <Package className="h-8 w-8 text-amber-700" />;
  if (item.type === "pdf") return <FileType2 className="h-8 w-8 text-red-600" />;
  if (item.type === "doc") return <FileText className="h-8 w-8 text-blue-700" />;
  return <FileText className="h-8 w-8 text-stone-600" />;
}

function mediaIconFor(item: MediaItem) {
  if (item.uploadPlane === "Youtube" || item.type === "video") return Video;
  if (item.type === "audio") return Music;
  if (item.type === "zip") return Package;
  if (item.type === "pdf") return FileType2;
  if (item.type === "doc" || item.type === "txt") return FileText;
  return ImageIcon;
}

function providerBadge(item: MediaItem) {
  const badges = {
    imageBB: ["ImageBB", "bg-amber-100 text-amber-900"],
    Uploadthings: ["UploadThings", "bg-emerald-100 text-emerald-900"],
    Youtube: ["YouTube", "bg-red-100 text-red-800"],
  } as const;
  return badges[item.uploadPlane];
}

export default function MediaPage() {
  const { data, error, isFetching, isLoading, refetch } = useGetMediaQuery();
  const [create] = useCreateMediaMutation();
  const [update] = useUpdateMediaMutation();
  const [remove] = useDeleteMediaMutation();
  const [removeMany, removeManyState] = useDeleteMediaManyMutation();
  const confirm = useConfirmDelete();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState<MediaItem | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [toast, setToast] = useState("");
  const [refreshRemaining, setRefreshRemaining] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!refreshRemaining) return;
    const interval = window.setInterval(() => setRefreshRemaining((remaining) => Math.max(remaining - 1, 0)), 1000);
    return () => window.clearInterval(interval);
  }, [refreshRemaining]);

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.items ?? []).filter((item) => {
      const matchesFilter =
        !filter ||
        (filter === "image"
          ? item.type === "picture" && item.uploadPlane !== "Youtube"
          : filter === "video"
            ? item.type === "video" || item.uploadPlane === "Youtube"
            : filter === "document"
              ? item.type === "doc" || item.type === "txt"
              : item.type === filter);
      const haystack = `${item.name} ${item.author} ${item.uploadPlane} ${item.url}`.toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [data, filter, query]);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleItems = items.slice((activePage - 1) * pageSize, activePage * pageSize);
  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selected.includes(item.id));
  const pageBusy = isFetching || removeManyState.isLoading || exporting;

  async function deleteItem(item: MediaItem) {
    if (!(await confirm(`Delete “${item.name}”? This also removes the uploaded remote file when possible.`))) return;
    try {
      await remove(item.id).unwrap();
      setToast("Media deleted successfully.");
    } catch (deleteError) {
      setToast(messageFrom(deleteError, "Could not delete media."));
    }
  }

  async function deleteSelected() {
    const ids = selected.filter((id) => items.some((item) => item.id === id));
    if (!ids.length || !(await confirm(`Delete ${ids.length} selected media item${ids.length === 1 ? "" : "s"}?`)))
      return;
    try {
      await removeMany(ids).unwrap();
      setSelected([]);
      setToast(`${ids.length} media item${ids.length === 1 ? "" : "s"} deleted successfully.`);
    } catch (deleteError) {
      setToast(messageFrom(deleteError, "Could not delete selected media."));
    }
  }

  function toggleSelection(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }
  function toggleVisibleSelection() {
    const ids = visibleItems.map((item) => item.id);
    setSelected((current) =>
      allVisibleSelected ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])],
    );
  }
  function exportRows(rows: MediaItem[], kind: "export" | "bulk-export") {
    if (!rows.length) return setToast("Select at least one media item to export.");
    setExporting(true);
    try {
      downloadMediaZip(rows, kind);
      setToast(`${rows.length} media item${rows.length === 1 ? "" : "s"} exported successfully.`);
    } catch {
      setToast("Could not create the export file.");
    } finally {
      setExporting(false);
    }
  }

  async function saveEdit(name: string) {
    if (!editing) return;
    try {
      await update({ id: editing.id, name }).unwrap();
      setEditing(null);
      setToast("Media title updated successfully.");
    } catch (updateError) {
      setToast(messageFrom(updateError, "Could not update media."));
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setToast("Media URL copied to clipboard.");
    } catch {
      setToast("Could not copy the media URL.");
    }
  }

  async function refresh() {
    if (refreshRemaining) return;
    try {
      const result = await refetch();
      if ("error" in result) throw result.error;
      setRefreshRemaining(60);
      setToast("Media library refreshed. Refresh is locked for 60 seconds.");
    } catch {
      setToast("Could not refresh the media library.");
    }
  }

  return (
    <main className="flex-1 bg-[#fffaf0] p-4 sm:p-8">
      {pageBusy && (
        <PageLoader
          label={
            exporting
              ? "Preparing your export"
              : removeManyState.isLoading
                ? "Removing selected media"
                : "Updating media"
          }
        />
      )}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[90] rounded-sm px-4 py-3 text-sm text-white shadow-lg ${isErrorToast(toast) ? "bg-red-700" : "bg-emerald-700"}`}
          role="status"
        >
          {toast}
        </div>
      )}
      <section className="mx-auto max-w-6xl rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input min-w-48 flex-1"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, author, provider or URL"
            value={query}
          />
          <div className="flex flex-wrap gap-1" role="group" aria-label="Media type filters">
            {MEDIA_FILTERS.map(({ id, icon: Icon, label }) => (
              <button
                aria-pressed={filter === id}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-sm border px-2 py-2 text-xs font-semibold transition duration-700 ${filter === id ? "border-stone-900 bg-stone-900 text-white" : "border-[#eadfca] text-stone-700 hover:bg-amber-50"}`}
                key={id}
                onClick={() => {
                  setFilter(filter === id ? "" : id);
                  setPage(1);
                }}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[#eadfca] px-2.5 py-1.5 text-xs font-semibold transition duration-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={Boolean(refreshRemaining) || isFetching}
            onClick={() => void refresh()}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {refreshRemaining ? `Refresh (${refreshRemaining}s)` : "Refresh"}
          </button>
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] px-2.5 py-1.5 text-xs font-semibold transition duration-700 hover:bg-amber-50"
            onClick={() => exportRows(items, "export")}
            type="button"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white transition duration-700 hover:bg-amber-800"
            onClick={() => setUploadOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Media
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-amber-100 p-3">
            <span className="text-sm font-medium text-amber-900">{selected.length} selected</span>
            <div className="flex gap-2">
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                onClick={() =>
                  exportRows(
                    items.filter((item) => selected.includes(item.id)),
                    "bulk-export",
                  )
                }
                type="button"
              >
                <Download className="h-3.5 w-3.5" />
                Bulk Export
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-red-700 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                disabled={removeManyState.isLoading}
                onClick={() => void deleteSelected()}
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-5 rounded-sm bg-red-50 p-3 text-sm text-red-700">
            {messageFrom(error, "Could not load media.")}
          </p>
        )}
        {isLoading ? (
          <p className="p-8 text-sm text-stone-500">Loading media…</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.length > 0 && (
              <label className="col-span-full flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-600">
                <input
                  aria-label="Select visible media"
                  checked={allVisibleSelected}
                  className="cursor-pointer"
                  onChange={toggleVisibleSelection}
                  type="checkbox"
                />
                Select visible media
              </label>
            )}
            {visibleItems.map((item) => (
              <article
                className="group overflow-hidden rounded-sm border border-[#eadfca] bg-white transition duration-700 hover:-translate-y-1 hover:shadow-lg"
                key={item.id}
              >
                <div className="relative grid h-40 place-items-center overflow-hidden bg-amber-50">
                  {previewFor(item)}
                  {(() => {
                    const Icon = mediaIconFor(item);
                    return (
                      <span className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-sm bg-white/90 text-stone-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                    );
                  })()}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={`Select ${item.name}`}
                      checked={selected.includes(item.id)}
                      className="cursor-pointer"
                      onChange={() => toggleSelection(item.id)}
                      type="checkbox"
                    />
                    <p className="min-w-0 flex-1 truncate font-semibold text-stone-800" title={item.name}>
                      {item.name}
                    </p>
                  </div>
                  <p className="mt-1 truncate text-xs text-stone-500" title={item.author}>
                    {item.author}
                  </p>
                  {(() => {
                    const [label, classes] = providerBadge(item);
                    return (
                      <span className={`mt-2 inline-flex rounded-sm px-2 py-1 text-[10px] font-bold ${classes}`}>
                        {label}
                      </span>
                    );
                  })()}
                  <div className="mt-3 flex justify-end gap-1">
                    {item.uploadPlane !== "Youtube" && (
                      <a
                        aria-label={`Download ${item.name}`}
                        className="cursor-pointer rounded-sm p-1.5 text-stone-700 transition duration-700 hover:bg-amber-100"
                        href={`/api/dashboard/media/v1/${item.id}/download`}
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <IconButton label="Copy URL" onClick={() => void copyUrl(item.url)}>
                      <Copy />
                    </IconButton>
                    <IconButton
                      label="Open file in new tab"
                      onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                    >
                      <ExternalLink />
                    </IconButton>
                    <IconButton label="View" onClick={() => setViewing(item)}>
                      <Eye />
                    </IconButton>
                    <IconButton label="Edit title" onClick={() => setEditing(item)}>
                      <Pencil />
                    </IconButton>
                    <IconButton danger label="Delete" onClick={() => void deleteItem(item)}>
                      <Trash2 />
                    </IconButton>
                  </div>
                </div>
              </article>
            ))}
            {!visibleItems.length && (
              <div className="col-span-full rounded-sm border border-dashed border-[#eadfca] p-10 text-center text-sm text-stone-500">
                No media matches your search.
              </div>
            )}
          </div>
        )}

        {items.length > 10 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfca] pt-4 text-sm">
            <span>
              Showing {visibleItems.length ? (activePage - 1) * pageSize + 1 : 0}–
              {Math.min(activePage * pageSize, items.length)} of {items.length}
            </span>
            <div className="flex items-center gap-2">
              <select
                className="input w-auto py-1"
                onChange={(event) => {
                  setPageSize(Number(event.target.value) as typeof pageSize);
                  setPage(1);
                }}
                value={pageSize}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <button
                className="cursor-pointer rounded-sm border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={activePage === 1}
                onClick={() => setPage(activePage - 1)}
                type="button"
              >
                Previous
              </button>
              <span>
                {activePage} / {totalPages}
              </span>
              <button
                className="cursor-pointer rounded-sm border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={activePage === totalPages}
                onClick={() => setPage(activePage + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      {uploadOpen && (
        <MediaModal
          close={() => setUploadOpen(false)}
          create={create}
          refresh={() => void refetch()}
          toast={setToast}
        />
      )}
      {viewing && <ViewModal item={viewing} close={() => setViewing(null)} />}
      {editing && <EditModal item={editing} close={() => setEditing(null)} save={saveEdit} />}
    </main>
  );
}

function IconButton({
  children,
  danger = false,
  label,
  onClick,
}: {
  children: React.ReactElement<{ className?: string }>;
  danger?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`cursor-pointer rounded-sm p-1.5 transition duration-700 hover:bg-amber-100 ${danger ? "text-red-700 hover:bg-red-50" : "text-stone-700"}`}
      onClick={onClick}
      type="button"
    >
      {cloneElement(children, { className: "h-3.5 w-3.5" })}
    </button>
  );
}
function messageFrom(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data &&
    "error" in error.data &&
    typeof error.data.error === "string"
    ? error.data.error
    : fallback;
}
function isErrorToast(message: string) {
  return /could not|failed|valid|required|must |error/i.test(message);
}

function ViewModal({ close, item }: { close: () => void; item: MediaItem }) {
  return (
    <Modal close={close} title="Media details">
      <div className="grid h-56 place-items-center overflow-hidden rounded-sm bg-amber-50">{previewFor(item)}</div>
      <dl className="mt-4 divide-y rounded-sm border border-[#eadfca] bg-white text-sm">
        {[
          ["ID", item.id],
          ["Name", item.name],
          ["Author", item.author],
          ["Provider", item.uploadPlane],
          ["Type", item.type],
          ["URL", item.url],
          [
            "Created",
            new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(item.createdAt),
            ),
          ],
        ].map(([label, value]) => (
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3" key={label}>
            <dt className="font-medium text-stone-600">{label}</dt>
            <dd className="break-words text-stone-900">{value}</dd>
          </div>
        ))}
      </dl>
      <a
        className="mt-4 inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[#eadfca] bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-800"
        href={item.url}
        rel="noreferrer"
        target="_blank"
      >
        Open original file
      </a>
      <button
        className="ml-2 cursor-pointer rounded-sm border border-[#eadfca] bg-white px-2.5 py-1.5 text-xs font-semibold"
        onClick={close}
        type="button"
      >
        Close
      </button>
    </Modal>
  );
}
function EditModal({
  close,
  item,
  save,
}: {
  close: () => void;
  item: MediaItem;
  save: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(item.name);
  const [saving, setSaving] = useState(false);
  return (
    <Modal close={close} title="Edit media">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaving(true);
          void save(name.trim()).finally(() => setSaving(false));
        }}
      >
        <label className="block text-sm font-medium text-stone-700" htmlFor="media-name">
          Name / title
        </label>
        <input
          autoFocus
          className="input mt-2 w-full"
          id="media-name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
        <button
          className="mt-4 cursor-pointer rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white transition duration-700 hover:bg-amber-800 disabled:opacity-60"
          disabled={!name.trim() || saving}
          type="submit"
        >
          {saving ? "Saving…" : "Save title"}
        </button>
        <button
          className="ml-2 cursor-pointer rounded-sm border border-[#eadfca] bg-white px-2.5 py-1.5 text-xs font-semibold"
          disabled={saving}
          onClick={close}
          type="button"
        >
          Cancel
        </button>
      </form>
    </Modal>
  );
}
function Modal({ children, close, title }: { children: React.ReactNode; close: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-sm bg-[#fffaf0] p-4 shadow-2xl sm:p-5"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="truncate font-semibold text-stone-800">{title}</h2>
          <button
            aria-label="Close"
            className="cursor-pointer rounded-sm p-1 transition duration-700 hover:bg-amber-100"
            onClick={close}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PageLoader({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm" role="status">
      <div className="grid min-w-56 place-items-center rounded-sm border border-[#eadfca] bg-white px-8 py-7 shadow-xl">
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute h-14 w-14 animate-ping rounded-full border border-amber-300" />
          <span className="absolute h-10 w-10 animate-[spin_1.1s_linear_infinite] rounded-full border-2 border-amber-200 border-t-amber-700" />
          <RefreshCw className="h-5 w-5 text-amber-700" />
        </div>
        <p className="mt-4 text-sm font-semibold text-stone-800">{label}</p>
      </div>
    </div>
  );
}

function MediaModal({
  close,
  create,
  refresh,
  toast,
}: {
  close: () => void;
  create: ReturnType<typeof useCreateMediaMutation>[0];
  refresh: () => void;
  toast: (message: string) => void;
}) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [showYoutube, setShowYoutube] = useState(false);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  async function uploadImageBB(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("ImageBB accepts image files only.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const response = await fetch("/api/dashboard/media/v1/imagebb", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      refresh();
      toast("Image uploaded successfully.");
      close();
    } catch (uploadError) {
      toast(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setBusy(false);
    }
  }
  async function saveYoutube(event: React.FormEvent) {
    event.preventDefault();
    if (!youtubeThumbnail(url)) {
      toast("Enter a valid YouTube video URL.");
      return;
    }
    try {
      await create({ name: "YouTube video", url, type: "video", uploadPlane: "Youtube" }).unwrap();
      toast("YouTube URL saved successfully.");
      close();
    } catch (saveError) {
      toast(messageFrom(saveError, "Could not save YouTube URL."));
    }
  }
  return (
    <Modal close={close} title="Add media">
      <div className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 pb-12 md:pb-0">
        <button
          className="relative cursor-pointer rounded-sm border border-amber-200 bg-amber-50 p-6 text-left transition duration-700 hover:-translate-y-1 hover:bg-amber-100 disabled:opacity-60"
          disabled={busy}
          onClick={() => imageInput.current?.click()}
          type="button"
        >
          <ProviderBadge provider="ImageBB" />
          <b className="inline-flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image
          </b>
          <span className="mt-1 block text-xs text-stone-500">Images only</span>
        </button>
        <button
          className="relative cursor-pointer rounded-sm border border-red-200 bg-red-50 p-6 text-left transition duration-700 hover:-translate-y-1 hover:bg-red-100"
          onClick={() => setShowYoutube((open) => !open)}
          type="button"
        >
          <ProviderBadge provider="YouTube" />
          <b className="inline-flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video URL
          </b>
          <span className="mt-1 block text-xs text-stone-500">Save a video link</span>
        </button>
        <UploadTile endpoint="imageUploader" label="Image" type="picture" create={create} close={close} toast={toast} />
        <UploadTile endpoint="videoUploader" label="Video" type="video" create={create} close={close} toast={toast} />
        <UploadTile endpoint="audioUploader" label="Audio" type="audio" create={create} close={close} toast={toast} />
        <UploadTile endpoint="zipUploader" label="ZIP" type="zip" create={create} close={close} toast={toast} />
        <DocumentTextUploadTile create={create} close={close} toast={toast} />
        <UploadTile endpoint="pdfUploader" label="PDF" type="pdf" create={create} close={close} toast={toast} />
      </div>
      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadImageBB(file);
          event.currentTarget.value = "";
        }}
        ref={imageInput}
        type="file"
      />
      {showYoutube && (
        <form
          className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4"
          onSubmit={(event) => void saveYoutube(event)}
        >
          <label className="text-sm font-medium" htmlFor="youtube-url">
            YouTube URL
          </label>
          <input
            className="input mt-2 w-full"
            id="youtube-url"
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            required
            value={url}
          />
          <button
            className="mt-3 cursor-pointer rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white transition duration-700 hover:bg-red-800"
            type="submit"
          >
            Save URL
          </button>
        </form>
      )}
    </Modal>
  );
}

function DocumentTextUploadTile({
  create,
  close,
  toast,
}: {
  create: ReturnType<typeof useCreateMediaMutation>[0];
  close: () => void;
  toast: (message: string) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const openPicker = (target: EventTarget | null) => {
    if (target instanceof HTMLElement && target.closest("button, input, label")) return;
    pickerRef.current?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };
  const save = async (file: { name: string; ufsUrl: string; key: string } | undefined, type: "doc" | "txt") => {
    if (!file) return;
    try {
      await create({
        name: file.name,
        url: file.ufsUrl,
        type,
        uploadPlane: "Uploadthings",
        fileKey: file.key,
      }).unwrap();
      toast("File uploaded successfully.");
      close();
    } catch (saveError) {
      toast(messageFrom(saveError, "Upload completed, but media could not be saved."));
    }
  };
  return (
    <div
      className="relative cursor-pointer rounded-sm border border-emerald-200 bg-emerald-50 p-4 transition duration-700 hover:-translate-y-1 hover:bg-emerald-100"
      onClick={(event) => openPicker(event.target)}
      ref={pickerRef}
    >
      <ProviderBadge provider="UploadThings" />
      <b className="inline-flex items-center gap-2 text-sm">
        <FileText className="h-4 w-4" />
        Documents
      </b>
      <UploadButton
        appearance={{
          allowedContent: "text-stone-700",
          button:
            "cursor-pointer rounded-sm bg-slate-600 px-3 py-2 text-sm font-medium text-amber-950 transition hover:bg-slate-800 text-sm",
        }}
        className="mt-3"
        content={{ button: "Upload file", allowedContent: "DOC, DOCX or TXT" }}
        endpoint="documentTextUploader"
        onClientUploadComplete={(result) => {
          const file = result?.[0];
          void save(file, file?.name.toLowerCase().endsWith(".txt") ? "txt" : "doc");
        }}
        onUploadError={(uploadError) => toast(uploadError.message)}
      />
    </div>
  );
}

function UploadTile({
  endpoint,
  label,
  type,
  create,
  close,
  toast,
}: {
  endpoint:
    | "imageUploader"
    | "videoUploader"
    | "audioUploader"
    | "zipUploader"
    | "documentUploader"
    | "pdfUploader"
    | "textUploader";
  label: string;
  type: Extract<MediaItem["type"], "picture" | "video" | "audio" | "zip" | "doc" | "pdf" | "txt">;
  create: ReturnType<typeof useCreateMediaMutation>[0];
  close: () => void;
  toast: (message: string) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const openPicker = (target: EventTarget | null) => {
    if (target instanceof HTMLElement && target.closest("button, input, label")) return;
    pickerRef.current?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };
  const allowedContent =
    type === "picture"
      ? "Images only"
      : type === "video"
        ? "Videos only"
        : type === "audio"
          ? "Audio only"
          : type === "zip"
            ? "ZIP only"
            : type === "doc"
              ? "DOC or DOCX only"
              : type === "pdf"
                ? "PDF only"
                : "TXT only";
  const Icon =
    type === "picture"
      ? ImageIcon
      : type === "video"
        ? Video
        : type === "audio"
          ? Music
          : type === "zip"
            ? Package
            : type === "pdf"
              ? FileType2
              : FileText;
  return (
    <div
      className="relative cursor-pointer rounded-sm border border-emerald-200 bg-emerald-50 p-4 transition duration-700 hover:-translate-y-1 hover:bg-emerald-100"
      onClick={(event) => openPicker(event.target)}
      ref={pickerRef}
    >
      <ProviderBadge provider="UploadThings" />
      <b className="inline-flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </b>
      <UploadButton
        appearance={{
          allowedContent: "text-stone-700",
          button:
            "cursor-pointer rounded-sm bg-slate-600 px-3 py-2 text-sm font-medium text-amber-950 transition hover:bg-slate-800 text-sm",
        }}
        className="mt-3"
        content={{ allowedContent }}
        endpoint={endpoint}
        onClientUploadComplete={async (result) => {
          const file = result?.[0];
          if (!file) return;
          try {
            await create({
              name: file.name,
              url: file.ufsUrl,
              type,
              uploadPlane: "Uploadthings",
              fileKey: file.key,
            }).unwrap();
            toast("File uploaded successfully.");
            close();
          } catch (saveError) {
            toast(messageFrom(saveError, "Upload completed, but media could not be saved."));
          }
        }}
        onUploadError={(uploadError) => toast(uploadError.message)}
      />
    </div>
  );
}

function ProviderBadge({ provider }: { provider: "ImageBB" | "YouTube" | "UploadThings" }) {
  const colors =
    provider === "ImageBB"
      ? "bg-amber-200 text-amber-950"
      : provider === "YouTube"
        ? "bg-red-200 text-red-900"
        : "bg-emerald-200 text-emerald-950";
  return (
    <span
      className={`absolute -top-3 right-3 z-10 rounded-sm border border-white px-2 py-1 text-[10px] font-bold shadow-sm ${colors}`}
    >
      {provider}
    </span>
  );
}
