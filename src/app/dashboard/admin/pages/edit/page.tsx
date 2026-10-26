/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Columns3,
  Edit3,
  Eye,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  ContainerMutation,
  ContainerQuery,
  containerContainers,
  getContainerDefaults,
  type ContainerVariant,
} from "@/components/container/ContainerIndex";
import {
  FormMutation,
  FormPreview,
  FormQuery,
  formChoices,
  formDefaults,
  type FormVariant,
} from "@/components/form/FormIndex";
import {
  allPageChoices,
  allPageDefaults,
  PageMutation,
  PagePreview,
  type AllPageKind,
} from "@/components/pages/PageIndex";
import {
  SectionMutation,
  SectionPreview,
  sectionChoices,
  sectionDefaults,
  type SectionVariant,
} from "@/components/sections/SectionIndex";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";
import {
  useGetPagesQuery,
  useUpdatePageMutation,
  type PageBlock,
  type SitePage,
} from "@/redux/features/dashboard/pages/pagesSlice";
function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-sm bg-white shadow-2xl">
        <header className="flex justify-between border-b p-4 font-semibold">
          {title}
          <button onClick={close}>×</button>
        </header>
        <div className="p-4">{children}</div>
      </section>
    </div>
  );
}

function FullScreenEditModal({
  title,
  close,
  apply,
  children,
}: {
  title: string;
  close: () => void;
  apply: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] h-screen w-full bg-stone-950/30 p-0 backdrop-blur-sm">
      <section aria-modal="true" role="dialog" className="flex h-screen w-full flex-col bg-[#fffaf0]">
        <header className="flex flex-none items-center justify-between gap-3 border-b border-[#eadfca] bg-white px-4 py-3 sm:px-6">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <Button aria-label="Close editor" size="icon-sm" title="Close" variant="outline" onClick={close}>
            <X />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl rounded-sm border border-[#eadfca] bg-white">{children}</div>
        </div>
        <footer className="flex flex-none justify-end gap-2 border-t border-[#eadfca] bg-white p-3 sm:px-6">
          <Button size="sm" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button size="sm" onClick={apply}>
            Apply changes
          </Button>
        </footer>
      </section>
    </div>
  );
}

type PickerColumns = 1 | 2 | 3;
type PickerItem<T extends string> = { description?: string; label: string; variant: T };
type BlockViewMode = "hidden" | "partial" | "full";

function TemplatePicker<T extends string>({
  title,
  items,
  close,
  onAdd,
  renderPreview,
  renderForm,
}: {
  title: string;
  items: PickerItem<T>[];
  close: () => void;
  onAdd: (variant: T) => void;
  renderPreview: (variant: T) => React.ReactNode;
  renderForm?: (variant: T) => React.ReactNode;
}) {
  const [columns, setColumns] = useState<PickerColumns>(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState<T | null>(null);
  const [activeCardTabs, setActiveCardTabs] = useState<Record<string, "preview" | "form">>({});
  const totalPages = Math.ceil(items.length / columns);
  const visibleChoices = items
    .map((item, index) => ({ item, index }))
    .slice((currentPage - 1) * columns, currentPage * columns);
  const setLayout = (value: PickerColumns) => {
    setColumns(value);
    setCurrentPage(1);
  };
  const layouts: { value: PickerColumns; label: string; Icon: typeof Square }[] = [
    { value: 1, label: "Single Column", Icon: Square },
    { value: 2, label: "Two Columns", Icon: Columns2 },
    { value: 3, label: "Three Columns", Icon: Columns3 },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[70] h-screen w-full bg-stone-950/30 p-0 backdrop-blur-sm">
        <section aria-modal="true" role="dialog" className="flex h-screen w-full flex-col bg-[#fffaf0]">
          <header className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-[#eadfca] bg-white px-4 py-3 sm:px-6">
            <div>
              <h2 className="font-semibold text-stone-900">Choose a {title} template</h2>
              <p className="text-sm text-stone-500">Preview a template, then add it to this page.</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div aria-label="Template layout" className="flex rounded-sm border border-[#eadfca] bg-stone-50 p-1">
                {layouts.map(({ value, label, Icon }) => (
                  <Button
                    aria-pressed={columns === value}
                    className={columns === value ? "bg-amber-100 hover:bg-amber-200" : "bg-transparent hover:bg-white"}
                    key={value}
                    size="sm"
                    title={label}
                    variant="ghost"
                    onClick={() => setLayout(value)}
                  >
                    <Icon />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
              <Button aria-label="Close template picker" size="icon-sm" title="Close" variant="outline" onClick={close}>
                <X />
              </Button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:overflow-visible sm:p-6">
            <div
              className={`grid min-h-0 grid-cols-1 gap-3 sm:h-full sm:gap-4 ${columns === 1 ? "sm:grid-cols-1" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
            >
              {visibleChoices.map(({ item, index }) => (
                <article
                  key={item.variant}
                  className="flex min-h-0 flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm"
                >
                  {renderForm && (
                    <div className="flex flex-none gap-1 border-b border-[#eadfca] bg-stone-50 p-2">
                      <button
                        aria-pressed={(activeCardTabs[item.variant] ?? "preview") === "preview"}
                        className={`rounded-sm px-3 py-1.5 text-xs font-medium ${(activeCardTabs[item.variant] ?? "preview") === "preview" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:bg-white"}`}
                        onClick={() => setActiveCardTabs((tabs) => ({ ...tabs, [item.variant]: "preview" }))}
                        type="button"
                      >
                        Preview
                      </button>
                      <button
                        aria-pressed={activeCardTabs[item.variant] === "form"}
                        className={`rounded-sm px-3 py-1.5 text-xs font-medium ${activeCardTabs[item.variant] === "form" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:bg-white"}`}
                        onClick={() => setActiveCardTabs((tabs) => ({ ...tabs, [item.variant]: "form" }))}
                        type="button"
                      >
                        Form
                      </button>
                    </div>
                  )}
                  <div className="h-26 overflow-y-auto p-2.5 sm:h-auto sm:min-h-0 sm:flex-1 sm:p-4">
                    {renderForm && activeCardTabs[item.variant] === "form"
                      ? renderForm(item.variant)
                      : renderPreview(item.variant)}
                  </div>
                  <footer className="flex flex-none flex-col items-stretch gap-2 border-t border-[#eadfca] bg-white p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
                    <p
                      className="min-w-0 truncate text-sm font-medium text-stone-800"
                      title={`${index + 1}. ${item.label}`}
                    >
                      {index + 1}. {item.label}
                    </p>
                    {item.description && <p className="text-xs text-stone-500">{item.description}</p>}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                      <Button
                        className="w-full sm:w-auto"
                        size="sm"
                        variant="outline"
                        onClick={() => setPreview(item.variant)}
                      >
                        <Eye />
                        Preview
                      </Button>
                      <Button className="w-full sm:w-auto" size="sm" onClick={() => onAdd(item.variant)}>
                        Add
                      </Button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <footer className="flex flex-none items-center justify-center gap-2 border-t border-[#eadfca] bg-white p-3">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((value) => value - 1)}
            >
              <ChevronLeft />
              Previous
            </Button>
            <span className="text-sm text-stone-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((value) => value + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          </footer>
        </section>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[80] h-screen w-full bg-stone-950/40 p-0 backdrop-blur-sm">
          <section aria-modal="true" role="dialog" className="flex h-screen w-full flex-col bg-[#fffaf0]">
            <header className="flex flex-none items-center justify-between gap-3 border-b border-[#eadfca] bg-white px-4 py-3 sm:px-6">
              <div>
                <h2 className="font-semibold text-stone-900">
                  {(() => {
                    const itemIndex = items.findIndex((item) => item.variant === preview);
                    const item = items[itemIndex];
                    return item ? `${itemIndex + 1}. ${item.label}` : null;
                  })()}
                </h2>
                <p className="text-sm text-stone-500">Template preview</p>
              </div>
              <Button
                aria-label="Close preview"
                size="icon-sm"
                title="Close"
                variant="outline"
                onClick={() => setPreview(null)}
              >
                <X />
              </Button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-7xl rounded-sm bg-white shadow-sm">{renderPreview(preview)}</div>
            </div>
            <footer className="flex flex-none justify-end gap-2 border-t border-[#eadfca] bg-white p-3 sm:px-6">
              <Button size="sm" variant="outline" onClick={() => setPreview(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => onAdd(preview)}>
                Add
              </Button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
// The editor needs a local, mutable copy of persisted blocks once the page query arrives.

export default function EditPage() {
  const path = useSearchParams().get("path") ?? "";
  const { data, isLoading, isError } = useGetPagesQuery();
  const page = useMemo(() => data?.items.find((p) => p.path === path), [data, path]);
  if (isLoading) return <LoadingState label="Loading page editor" />;
  if (isError) return <main className="flex-1 p-8">Could not load pages.</main>;
  if (!page) return <main className="flex-1 p-8">Loading page…</main>;
  return <PageEditor key={page.id} page={page} />;
}

function PageEditor({ page }: { page: SitePage }) {
  const router = useRouter();
  const [update, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [blocks, setBlocks] = useState<PageBlock[]>(() =>
    page.blocks.map((block) =>
      block.type === "rich-text" ? { ...block, type: "section", variant: "section-1" } : block,
    ),
  );
  const [description, setDescription] = useState(page.description);
  const [choice, setChoice] = useState<"form" | "section" | "all-page" | "container" | null>(null);
  const [editing, setEditing] = useState<PageBlock | null>(null);
  const [deleting, setDeleting] = useState<PageBlock | null>(null);
  const [titleEditor, setTitleEditor] = useState<PageBlock | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [blockViewMode, setBlockViewMode] = useState<BlockViewMode>("hidden");
  const [showPageInfo, setShowPageInfo] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);
  const add = (variant: PageBlock["variant"]) => {
    const type = choice === "all-page" ? "all-page" : choice!;
    const data =
      type === "all-page"
        ? allPageDefaults(variant as AllPageKind)
        : type === "section"
          ? sectionDefaults(variant as SectionVariant)
          : type === "container"
            ? getContainerDefaults(variant as ContainerVariant)
            : formDefaults(variant as FormVariant);
    setBlocks((b) => [
      ...b,
      { id: crypto.randomUUID(), type, variant, data: data as unknown as Record<string, unknown> },
    ]);
    setChoice(null);
  };
  const save = async () => {
    try {
      await update({ id: page.id, blocks, description }).unwrap();
      setMessage("Page saved and cache refreshed.");
    } catch {
      setMessage("Could not save page.");
    }
  };
  const moveBlock = async (blockId: string, direction: "up" | "down") => {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    const targetIndex = currentIndex + (direction === "up" ? -1 : 1);
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= blocks.length) return;

    const nextBlocks = [...blocks];
    [nextBlocks[currentIndex], nextBlocks[targetIndex]] = [nextBlocks[targetIndex], nextBlocks[currentIndex]];
    try {
      const { item } = await update({ id: page.id, blocks: nextBlocks }).unwrap();
      setBlocks(item.blocks);
      setMessage("Block order saved and client view refreshed.");
    } catch {
      setMessage("Could not move block. Its previous order was kept.");
    }
  };
  const saveBlockTitle = async () => {
    if (!titleEditor) return;
    const nextBlocks = blocks.map((block) =>
      block.id === titleEditor.id ? { ...block, title: titleDraft.trim() } : block,
    );
    try {
      const { item } = await update({ id: page.id, blocks: nextBlocks }).unwrap();
      setBlocks(item.blocks);
      setTitleEditor(null);
      setMessage("Block title saved and client view refreshed.");
    } catch {
      setMessage("Could not save block title.");
    }
  };
  const updatePublication = async (published: boolean) => {
    try {
      await update({ id: page.id, published }).unwrap();
      setMessage(`Page is now ${published ? "published" : "a draft"}.`);
    } catch {
      setMessage("Could not update publication status.");
    }
  };
  const blockTitle = (block: PageBlock) => {
    const fallback = `${block.type === "all-page" ? "Page" : block.type === "form" ? "Form" : block.type === "container" ? "Container" : "Section"} · ${block.variant.replace(/-/g, " ")}`;
    return block.title?.trim() || fallback;
  };
  return (
    <main className="flex-1 bg-[#fffaf0] p-5 sm:p-8">
      <Toast message={message} />
      {isUpdating && <LoadingState label="Saving page" overlay />}
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center rounded-sm border border-[#eadfca] bg-white p-1 shadow-sm">
            <Button
              className="rounded-sm border-0 bg-transparent text-stone-700 shadow-none hover:bg-amber-50 hover:text-amber-900"
              size="sm"
              variant="ghost"
              onClick={() => router.push("/dashboard/admin/pages")}
            >
              <ArrowLeft />
              Go Pages
            </Button>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-[#eadfca]" />
            <Button
              className="rounded-sm shadow-none"
              size="sm"
              variant={blockViewMode === "hidden" ? "default" : "ghost"}
              onClick={() => setBlockViewMode("hidden")}
            >
              Hide
            </Button>
            <Button
              className="rounded-sm shadow-none"
              size="sm"
              variant={blockViewMode === "partial" ? "default" : "ghost"}
              onClick={() => setBlockViewMode("partial")}
            >
              Partial Open
            </Button>
            <Button
              className="rounded-sm shadow-none"
              size="sm"
              variant={blockViewMode === "full" ? "default" : "ghost"}
              onClick={() => setBlockViewMode("full")}
            >
              Full Open
            </Button>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-[#eadfca]" />
            <Button
              aria-pressed={showPageInfo}
              className="rounded-sm shadow-none"
              size="sm"
              variant={showPageInfo ? "default" : "ghost"}
              onClick={() => setShowPageInfo((isVisible) => !isVisible)}
            >
              Info
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-sm">
            <span className="font-medium text-stone-700">{page.published ? "Published" : "Draft"}</span>
            <Switch
              aria-label={`Set ${page.title} publication status`}
              checked={page.published}
              onCheckedChange={updatePublication}
            />
          </div>
        </div>
        {showPageInfo && (
          <section className="rounded-sm border border-[#eadfca] bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-stone-700">
                Page Name
                <input value={page.title} readOnly className="rounded-sm border bg-stone-50 p-2 text-sm font-normal" />
              </label>
              <label className="grid gap-1 text-sm font-medium text-stone-700">
                Page Path
                <input value={page.path} readOnly className="rounded-sm border bg-stone-50 p-2 text-sm font-normal" />
              </label>
            </div>
            <label className="mt-3 grid gap-1 text-sm font-medium text-stone-700">
              <p>
                Description <span className="text-[10px]">( For SEO )</span>
              </p>
              <textarea
                aria-label="SEO description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="resize-y rounded-sm border p-2 text-sm font-normal"
              />
            </label>
          </section>
        )}
        <div className="mt-5 grid gap-4">
          {blocks.map((block, index) => (
            <article
              key={block.id}
              className="mx-auto w-full max-w-7xl overflow-hidden rounded-sm border border-[#eadfca] bg-white"
            >
              <header className="sticky top-0 z-20 flex flex-col items-stretch gap-2 border-b border-[#eadfca] bg-white/95 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h2 className="min-w-0 truncate text-sm font-semibold text-stone-900" title={blockTitle(block)}>
                    {blockTitle(block)}
                  </h2>
                  <button
                    aria-label="Edit block title"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isUpdating}
                    title="Edit title"
                    type="button"
                    onClick={() => {
                      setTitleDraft(block.title ?? "");
                      setTitleEditor(block);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex shrink-0 justify-end gap-2">
                  <button
                    aria-label="Move block up"
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-stone-200 bg-white px-2 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isUpdating || index === 0}
                    title="Move up"
                    type="button"
                    onClick={() => void moveBlock(block.id, "up")}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Up</span>
                  </button>
                  <button
                    aria-label="Move block down"
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-stone-200 bg-white px-2 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isUpdating || index === blocks.length - 1}
                    title="Move down"
                    type="button"
                    onClick={() => void moveBlock(block.id, "down")}
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Down</span>
                  </button>
                  <button
                    aria-label="Edit block"
                    title="Edit"
                    type="button"
                    onClick={() => setEditing(block)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-800 hover:bg-amber-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    aria-label="Delete block"
                    title="Delete"
                    type="button"
                    onClick={() => setDeleting(block)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </header>
              <div
                className={`p-4 ${
                  blockViewMode === "hidden"
                    ? "hidden"
                    : blockViewMode === "partial"
                      ? "max-h-[400px] overflow-hidden"
                      : ""
                }`}
              >
                {block.type === "all-page" ? (
                  <PagePreview data={block.data as Record<string, string>} kind={block.variant as AllPageKind} />
                ) : block.type === "form" ? (
                  <FormQuery data={block.data as Record<string, string>} kind={block.variant as FormVariant} />
                ) : block.type === "container" ? (
                  <ContainerQuery data={block.data as never} variant={block.variant as ContainerVariant} />
                ) : (
                  <SectionPreview data={block.data as Record<string, string>} kind={block.variant as SectionVariant} />
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="sticky bottom-4 mt-6 flex flex-wrap justify-between gap-2 rounded-sm border border-[#eadfca] bg-white p-3 shadow-lg">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setChoice("form")}>
              Form
            </Button>
            <Button size="sm" variant="outline" onClick={() => setChoice("section")}>
              Sections
            </Button>
            <Button size="sm" variant="outline" onClick={() => setChoice("all-page")}>
              All Pages
            </Button>
            <Button size="sm" variant="outline" onClick={() => setChoice("container")}>
              Container
            </Button>
          </div>
          <div className="flex basis-full justify-end gap-2 sm:basis-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/dashboard/admin/pages/preview?path=${encodeURIComponent(page.path)}`)}
            >
              Preview
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(page.path, "_blank")}>
              Live
            </Button>
            <Button size="sm" onClick={() => void save()}>
              Save
            </Button>
          </div>
        </div>
      </div>
      {choice === "all-page" ? (
        <TemplatePicker
          close={() => setChoice(null)}
          items={allPageChoices}
          title="All Pages"
          onAdd={(variant) => add(variant)}
          renderPreview={(variant) => <PagePreview data={allPageDefaults(variant)} kind={variant} />}
        />
      ) : choice === "section" ? (
        <TemplatePicker
          close={() => setChoice(null)}
          items={sectionChoices}
          title="Section"
          onAdd={(variant) => add(variant)}
          renderPreview={(variant) => <SectionPreview data={sectionDefaults(variant)} kind={variant} />}
        />
      ) : choice === "form" ? (
        <TemplatePicker
          close={() => setChoice(null)}
          items={formChoices}
          title="Form"
          onAdd={(variant) => add(variant)}
          renderPreview={(variant) => <FormPreview data={formDefaults(variant)} kind={variant} />}
          renderForm={(variant) => <FormQuery data={formDefaults(variant)} kind={variant} />}
        />
      ) : choice === "container" ? (
        <TemplatePicker
          close={() => setChoice(null)}
          items={containerContainers.map((container) => ({
            description: container.description,
            label: container.title,
            variant: container.variant,
          }))}
          title="Container"
          onAdd={(variant) => add(variant)}
          renderPreview={(variant) => <ContainerQuery data={getContainerDefaults(variant)} variant={variant} />}
        />
      ) : null}
      {editing && (
        <FullScreenEditModal
          title={`Edit ${editing.type === "all-page" ? "page template" : editing.variant}`}
          close={() => setEditing(null)}
          apply={() => {
            setBlocks((b) => b.map((x) => (x.id === editing.id ? editing : x)));
            setEditing(null);
          }}
        >
          {editing.type === "all-page" ? (
            <PageMutation
              data={editing.data as Record<string, string>}
              kind={editing.variant as AllPageKind}
              onChange={(data) => setEditing({ ...editing, data })}
            />
          ) : editing.type === "form" ? (
            editing.variant === "form-1" ? (
              <FormMutation
                data={editing.data as Record<string, string>}
                kind={editing.variant as FormVariant}
                onChange={(data) => setEditing({ ...editing, data })}
              />
            ) : (
              <FormMutation
                data={editing.data as Record<string, string>}
                kind={editing.variant as FormVariant}
                onChange={(data) => setEditing({ ...editing, data })}
              />
            )
          ) : editing.type === "container" ? (
            <ContainerMutation
              data={editing.data as never}
              variant={editing.variant as ContainerVariant}
              onChange={(data) => setEditing({ ...editing, data: data as unknown as Record<string, unknown> })}
              onSubmit={(data) => setEditing({ ...editing, data: data as unknown as Record<string, unknown> })}
            />
          ) : (
            <SectionMutation
              data={editing.data as Record<string, string>}
              kind={editing.variant as SectionVariant}
              onChange={(data) => setEditing({ ...editing, data })}
            />
          )}
        </FullScreenEditModal>
      )}
      {titleEditor && (
        <Modal title="Edit block title" close={() => setTitleEditor(null)}>
          <label className="grid gap-1 text-sm font-medium text-stone-700">
            Title
            <input
              autoFocus
              className="rounded-sm border border-[#eadfca] p-2 text-sm font-normal"
              placeholder={blockTitle(titleEditor)}
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
            />
            <span className="text-xs font-normal text-stone-500">
              Leave empty to use the default {blockTitle({ ...titleEditor, title: "" })} name.
            </span>
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setTitleEditor(null)}>
              Cancel
            </Button>
            <Button size="sm" disabled={isUpdating} onClick={() => void saveBlockTitle()}>
              Save title
            </Button>
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete item" close={() => setDeleting(null)}>
          <p className="text-sm">
            Delete this {deleting.type === "all-page" ? "page template" : deleting.type}? This will be applied when you
            save the page.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setBlocks((items) => items.filter((item) => item.id !== deleting.id));
                setDeleting(null);
              }}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
