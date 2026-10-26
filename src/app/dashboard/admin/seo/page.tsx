/*
|-----------------------------------------
| setting up SEO settings page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 October 2026
|-----------------------------------------
*/

"use client";

import { Eye, FilePenLine, Globe, Image as ImageIcon, Plus, Search, Trash2 } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  useCreateSeoSettingsMutation,
  useDeleteSeoSettingsMutation,
  useGetPublishedSeoPagesQuery,
  useGetSeoSettingsListQuery,
  useUpdateSeoSettingsMutation,
  type SeoFields,
  type SeoListItem,
  type SeoTarget,
} from "@/redux/features/dashboard/seoSettings/seoSettingsSlice";

type Draft = Omit<SeoFields, "focusKeyword"> & { target: SeoTarget };
type Notice = { text: string; error?: boolean };
const primaryButtonClass =
  " bg-amber-600/40 text-black/80 hover:bg-amber-700 hover:text-black focus-visible:ring-amber-300";
const blankDraft = (): Draft => ({
  target: { type: "layout" },
  title: "",
  description: "",
  socialImage: "/Logo.png",
  canonicalUrl: null,
});
const textField = (value: FormDataEntryValue | null) => String(value ?? "").trim() || null;
const targetValue = (target: SeoTarget) => (target.type === "layout" ? "layout" : `page:${target.pageId}`);
const errorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { error?: string } }).data;
    if (data?.error) return data.error;
  }
  return fallback;
};

function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#eadfca] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-[#eadfca] bg-white p-4 font-semibold">
          {title}
          <button aria-label="Close" className="text-xl text-stone-500" onClick={close} type="button">
            ×
          </button>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

export default function SeoSettingsPage() {
  const { data, error, isLoading } = useGetSeoSettingsListQuery();
  const { data: pageData, error: pagesError, isLoading: pagesLoading } = useGetPublishedSeoPagesQuery();
  const [create, createState] = useCreateSeoSettingsMutation();
  const [update, updateState] = useUpdateSeoSettingsMutation();
  const [remove] = useDeleteSeoSettingsMutation();
  const confirmDelete = useConfirmDelete();
  const [editing, setEditing] = useState<{ draft: Draft; originalTarget: SeoTarget | null } | null>(null);
  const [preview, setPreview] = useState<SeoListItem | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const items = data?.items ?? [];
  const publishedPages = pageData?.items ?? [];
  const selectedValue = editing ? targetValue(editing.draft.target) : "layout";
  const duplicate =
    editing?.originalTarget === null && items.some(({ setting }) => setting.targetKey === selectedValue);
  const saving = createState.isLoading || updateState.isLoading;

  function openAdd() {
    setEditing({ draft: blankDraft(), originalTarget: null });
    setNotice(null);
  }
  function openEdit(item: SeoListItem) {
    const { setting } = item;
    setEditing({
      originalTarget: setting.target,
      draft: {
        target: setting.target,
        title: setting.title,
        description: setting.description,
        socialImage: setting.socialImage,
        canonicalUrl: setting.canonicalUrl,
      },
    });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload: Draft = {
      target: editing.draft.target,
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      socialImage: textField(form.get("socialImage")),
      canonicalUrl: textField(form.get("canonicalUrl")),
    };
    try {
      if (editing.originalTarget) await update({ ...payload, target: editing.originalTarget }).unwrap();
      else await create(payload).unwrap();
      setEditing(null);
      setNotice({ text: editing.originalTarget ? "SEO settings updated." : "SEO settings added." });
    } catch (cause) {
      setNotice({ text: errorMessage(cause, "Could not save SEO settings."), error: true });
    }
  }
  async function destroy(item: SeoListItem) {
    const label = item.setting.target.type === "layout" ? "Layout" : (item.page?.title ?? "this page");
    if (!(await confirmDelete(`Delete SEO settings for ${label}? This cannot be undone.`))) return;
    try {
      await remove(item.setting.target).unwrap();
      setNotice({ text: "SEO settings deleted." });
    } catch (cause) {
      setNotice({ text: errorMessage(cause, "Could not delete SEO settings."), error: true });
    }
  }

  return (
    <main className="min-h-full flex-1 bg-[#fffaf0] p-5 sm:p-8">
      <Toast error={notice?.error} message={notice?.text ?? ""} />
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900">SEO Settings</h1>
          </div>
          <Button className={primaryButtonClass} onClick={openAdd}>
            <Plus /> Add SEO Settings
          </Button>
        </header>

        {error && (
          <p className="mb-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Could not load SEO settings. Refresh the page and try again.
          </p>
        )}
        {isLoading ? (
          <div aria-label="Loading SEO settings" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-52 animate-pulse rounded-sm border border-[#eadfca] bg-white" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-sm border border-dashed border-[#d9cdb8] bg-white p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-stone-400" />
            <h2 className="mt-3 font-semibold text-stone-800">No SEO settings saved</h2>
            <p className="mt-1 text-sm text-stone-500">Add settings for Layout or a published CMS page.</p>
            <Button className={`mt-4 ${primaryButtonClass}`} size="sm" onClick={openAdd}>
              <Plus /> Add SEO Settings
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const { setting, page } = item;
              const label = setting.target.type === "layout" ? "Layout" : (page?.title ?? "Published page");
              return (
                <article
                  key={setting.targetKey}
                  className="flex min-w-0 flex-col rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                        <Globe className="h-3 w-3" />
                        {label}
                      </span>
                      <p
                        className="mt-2 truncate text-xs text-stone-500"
                        title={page?.path ?? "Site-wide Layout settings"}
                      >
                        {page?.path ?? "Site-wide Layout settings"}
                      </p>
                    </div>
                    {setting.socialImage && (
                      <ImageIcon className="h-4 w-4 shrink-0 text-stone-400" aria-label="Social image set" />
                    )}
                  </div>
                  <h2 className="mt-4 line-clamp-2 font-semibold text-stone-900">{setting.title}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-stone-600">{setting.description}</p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-stone-100 pt-3">
                    <CardActionButton label="View" tone="view" onClick={() => setPreview(item)}>
                      <Eye />
                    </CardActionButton>
                    <CardActionButton label="Edit" tone="edit" onClick={() => openEdit(item)}>
                      <FilePenLine />
                    </CardActionButton>
                    <CardActionButton label="Delete" tone="delete" onClick={() => void destroy(item)}>
                      <Trash2 />
                    </CardActionButton>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.originalTarget ? "Edit SEO Settings" : "Add SEO Settings"} close={() => setEditing(null)}>
          <form className="grid gap-4" onSubmit={(event) => void save(event)}>
            <label className="grid gap-1 text-sm font-medium text-stone-700">
              Target
              <select
                className="rounded-sm border border-[#eadfca] bg-white p-2 font-normal"
                disabled={Boolean(editing.originalTarget) || pagesLoading}
                value={selectedValue}
                onChange={(event) => {
                  const selectedTarget = event.target.value;
                  const pageId = selectedTarget.slice("page:".length);
                  const selectedPage = publishedPages.find((page) => page.id === pageId);
                  setEditing((current) =>
                    current
                      ? {
                          ...current,
                          draft: {
                            ...current.draft,
                            target: selectedTarget === "layout" ? { type: "layout" } : { type: "page", pageId },
                            canonicalUrl: selectedTarget === "layout" ? null : (selectedPage?.canonicalUrl ?? null),
                          },
                        }
                      : current,
                  );
                }}
              >
                <option value="layout">Layout (default)</option>
                {publishedPages.map((page) => (
                  <option key={page.id} value={`page:${page.id}`}>
                    {page.title} — {page.path}
                  </option>
                ))}
              </select>
            </label>
            {pagesError && (
              <p className="rounded-sm bg-red-50 p-2 text-sm text-red-700">
                Published pages could not be loaded. You can still choose Layout.
              </p>
            )}
            {duplicate && (
              <p className="rounded-sm bg-amber-50 p-2 text-sm text-amber-800">
                SEO settings already exist for this target. Edit the saved record instead.
              </p>
            )}
            <label className="grid gap-1 text-sm font-medium text-stone-700">
              Title
              <input
                required
                maxLength={200}
                name="title"
                defaultValue={editing.draft.title}
                className="rounded-sm border border-[#eadfca] p-2 font-normal"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700">
              Description
              <textarea
                required
                maxLength={500}
                name="description"
                rows={3}
                defaultValue={editing.draft.description}
                className="rounded-sm border border-[#eadfca] p-2 font-normal"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700">
              Social sharing image URL
              <input
                maxLength={2048}
                name="socialImage"
                type="text"
                defaultValue={editing.draft.socialImage ?? ""}
                placeholder="https://… or /images/share.jpg"
                className="rounded-sm border border-[#eadfca] p-2 font-normal"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-stone-700">
              Canonical URL
              <input
                maxLength={2048}
                name="canonicalUrl"
                type="url"
                onChange={(event) => {
                  const canonicalUrl = textField(event.currentTarget.value);
                  setEditing((current) =>
                    current ? { ...current, draft: { ...current.draft, canonicalUrl } } : current,
                  );
                }}
                placeholder="https://your-site.example/path"
                value={editing.draft.canonicalUrl ?? ""}
                className="rounded-sm border border-[#eadfca] p-2 font-normal"
              />
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                className={`${primaryButtonClass} ${editing.originalTarget ? "" : "border border-current shadow-sm"}`}
                disabled={saving || Boolean(duplicate)}
                type="submit"
              >
                {saving ? "Saving…" : "Save settings"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {preview && (
        <Modal title="SEO Preview" close={() => setPreview(null)}>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {preview.setting.target.type === "layout"
              ? "Layout"
              : `${preview.page?.title ?? "Published page"} · ${preview.page?.path ?? ""}`}
          </p>
          <div className="mt-4 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4">
            <h2 className="text-lg font-semibold text-blue-800">{preview.setting.title}</h2>
            <p className="mt-1 break-all text-sm text-green-800">
              {preview.setting.canonicalUrl ?? preview.page?.path ?? "Site-wide Layout"}
            </p>
            <p className="mt-2 text-sm text-stone-700">{preview.setting.description}</p>
            {preview.setting.socialImage && (
              <p className="mt-3 break-all text-xs text-stone-500">Social image: {preview.setting.socialImage}</p>
            )}
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function CardActionButton({
  label,
  tone,
  onClick,
  children,
}: {
  label: string;
  tone: "view" | "edit" | "delete";
  onClick: () => void;
  children: ReactNode;
}) {
  const toneClass = {
    view: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
    edit: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100",
    delete: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  }[tone];

  return (
    <button
      aria-label={label}
      className={`inline-flex h-7 items-center gap-1 rounded-sm border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 [&_svg]:size-3.5 ${toneClass}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
      {label}
    </button>
  );
}
