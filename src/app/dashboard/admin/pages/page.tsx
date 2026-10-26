/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";
import { Database, ExternalLink, Eye, FilePenLine, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useGetPagesQuery,
  useRevalidatePagesMutation,
  useUpdatePageMutation,
  type SitePage,
} from "@/redux/features/dashboard/pages/pagesSlice";
function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-sm bg-white shadow-2xl">
        <header className="flex justify-between border-b p-4 font-semibold">
          {title}
          <button onClick={close}>×</button>
        </header>
        <div className="p-4">{children}</div>
      </section>
    </div>
  );
}
export default function Pages() {
  const { data, isLoading, error } = useGetPagesQuery();
  const [create] = useCreatePageMutation();
  const [update] = useUpdatePageMutation();
  const [remove] = useDeletePageMutation();
  const [all] = useRevalidatePagesMutation();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<SitePage | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);
  const items = useMemo(
    () => data?.items.filter((p) => `${p.title} ${p.path}`.toLowerCase().includes(q.toLowerCase())) ?? [],
    [data, q],
  );
  const groups = Object.entries(
    items.reduce<Record<string, SitePage[]>>((a, p) => {
      const group = p.path.split("/").filter(Boolean)[0] || "home";
      (a[group] ??= []).push(p);
      return a;
    }, {}),
  );
  async function add(fd: FormData) {
    try {
      await create({
        title: String(fd.get("title")),
        path: String(fd.get("path")),
        description: String(fd.get("description")),
      }).unwrap();
      setAdding(false);
      setMessage("Page created and cache refreshed.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not create page.");
    }
  }
  return (
    <main className="flex-1 bg-[#fffaf0] p-5 sm:p-8">
      <Toast message={message} />
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or path"
              className="w-full rounded-sm border border-[#eadfca] bg-white py-2 pl-9 pr-3"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                void all()
                  .unwrap()
                  .then((r) => setMessage(`${r.count} pages refreshed.`))
                  .catch(() => setMessage("Could not refresh pages."))
              }
            >
              <RefreshCw />
              Update all page
            </Button>
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus />
              Add page
            </Button>
          </div>
        </header>
        {error && <p className="rounded-sm bg-red-50 p-3 text-red-700">Could not load pages.</p>}
        {isLoading ? (
          <div className="h-48 animate-pulse rounded-sm bg-white" />
        ) : groups.length === 0 ? (
          <div className="rounded-sm border border-dashed p-10 text-center text-stone-500">No pages found.</div>
        ) : (
          groups.map(([group, pages]) => {
            const isGroup = pages.length > 1;
            return (
              <section
                key={group}
                className={isGroup ? "mb-7 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-5" : "mb-7"}
              >
                <div className="mb-3 flex items-center gap-2">
                  <h1 className="text-sm font-bold uppercase tracking-wider text-stone-600">{group}</h1>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                    {pages.length} {pages.length === 1 ? "page" : "pages"}
                  </span>
                </div>
                <div className={isGroup ? "grid gap-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
                  {pages.map((p) => (
                    <article
                      key={p.id}
                      className={
                        isGroup
                          ? "flex min-w-0 flex-col gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 sm:flex-row sm:items-center sm:justify-between"
                          : "relative rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm"
                      }
                    >
                      <div className={isGroup ? "min-w-0 flex-1" : ""}>
                        <div
                          className={
                            isGroup
                              ? "flex flex-wrap items-center gap-2"
                              : "absolute right-3 top-3 flex items-center gap-2 text-xs"
                          }
                        >
                          {!isGroup && <span>{p.published ? "Published" : "Draft"}</span>}
                          {isGroup && (
                            <span className="text-xs font-medium text-stone-500">
                              {p.published ? "Published" : "Draft"}
                            </span>
                          )}
                          <Switch
                            aria-label={`Publish ${p.title}`}
                            checked={p.published}
                            onCheckedChange={(published) =>
                              void update({ id: p.id, published })
                                .unwrap()
                                .catch(() => setMessage("Could not update publication."))
                            }
                          />
                        </div>
                        <h2 className={isGroup ? "truncate font-semibold text-stone-900" : "pr-24 font-semibold"}>
                          {p.title}
                        </h2>
                        <p className="mt-1 truncate text-sm text-stone-500" title={p.path}>
                          {p.path}
                        </p>
                      </div>
                      <div className="flex shrink-0 justify-end gap-1">
                        <IconLink
                          label="Edit"
                          href={`/dashboard/admin/pages/edit?path=${encodeURIComponent(p.path)}`}
                          icon={<FilePenLine />}
                        />
                        <IconLink
                          label="Database"
                          href={`/dashboard/admin/pages/database?path=${encodeURIComponent(p.path)}`}
                          icon={<Database />}
                        />
                        <IconLink
                          label="Preview"
                          href={`/dashboard/admin/pages/preview?path=${encodeURIComponent(p.path)}`}
                          icon={<Eye />}
                        />
                        <IconLink label="Live" href={p.path} icon={<ExternalLink />} />
                        <button
                          aria-label={`Update ${p.title}`}
                          title="Update page cache"
                          onClick={() =>
                            void all({ path: p.path })
                              .unwrap()
                              .then(() => setMessage(`${p.title} refreshed.`))
                              .catch(() => setMessage("Could not refresh page."))
                          }
                          className="grid h-7 w-7 place-items-center rounded-sm text-stone-600 hover:bg-amber-100"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Delete"
                          title="Delete"
                          onClick={() => setDeleting(p)}
                          className="grid h-7 w-7 place-items-center rounded-sm text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
      {adding && (
        <Modal title="Add page" close={() => setAdding(false)}>
          <form action={add} className="grid gap-3">
            <input required name="title" placeholder="Page title" className="rounded-sm border p-2" />
            <input required name="path" placeholder="/your-path" className="rounded-sm border p-2" />
            <textarea
              name="description"
              placeholder="SEO description (not shown on page)"
              className="rounded-sm border p-2"
            />
            <Button type="submit">Save</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete page" close={() => setDeleting(null)}>
          <p className="text-sm">Delete “{deleting.title}”? This cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                void remove(deleting.id)
                  .unwrap()
                  .then(() => {
                    setDeleting(null);
                    setMessage("Page deleted.");
                  })
                  .catch(() => setMessage("Could not delete page."))
              }
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
function IconLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      aria-label={label}
      title={label}
      href={href}
      className="grid h-7 w-7 place-items-center rounded-sm text-stone-600 hover:bg-amber-100"
    >
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
    </Link>
  );
}
