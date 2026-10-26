/*
|-----------------------------------------
| setting up FooterLinksEditor.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { Button } from "@/components/ui/button";

export type EditableLink = { id: string; label: string; url: string; visible: boolean };
export type EditableColumn = { title: string; links: EditableLink[] };

export default function FooterLinksEditor({
  columns,
  onColumnsChange,
  links,
  onLinksChange,
  singleTitle = "Links",
}: {
  columns?: EditableColumn[];
  onColumnsChange?: (columns: EditableColumn[]) => void;
  links?: EditableLink[];
  onLinksChange?: (links: EditableLink[]) => void;
  singleTitle?: string;
}) {
  function updateLink(linkIndex: number, field: keyof EditableLink, value: string | boolean) {
    onLinksChange?.((links ?? []).map((link, index) => (index === linkIndex ? { ...link, [field]: value } : link)));
  }
  return (
    <div className="grid min-w-0 gap-4">
      {columns && onColumnsChange && (
        <>
          {columns.map((column, columnIndex) => (
            <fieldset
              className="grid min-w-0 gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3"
              key={`${column.title}-${columnIndex}`}
            >
              <legend className="flex max-w-full items-center gap-2 px-1 text-sm font-semibold">
                <input
                  className="h-8 min-w-0 rounded-sm border border-stone-200 bg-white px-2"
                  onChange={(event) =>
                    onColumnsChange(
                      columns.map((item, index) =>
                        index === columnIndex ? { ...item, title: event.target.value } : item,
                      ),
                    )
                  }
                  value={column.title}
                />
                <Button
                  aria-label="Delete column"
                  className="cursor-pointer text-red-700"
                  onClick={() => onColumnsChange(columns.filter((_, index) => index !== columnIndex))}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  Delete
                </Button>
              </legend>
              {column.links.map((link, linkIndex) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  onChange={(field, value) =>
                    onColumnsChange(
                      columns.map((item, index) =>
                        index === columnIndex
                          ? {
                              ...item,
                              links: item.links.map((current, currentIndex) =>
                                currentIndex === linkIndex ? { ...current, [field]: value } : current,
                              ),
                            }
                          : item,
                      ),
                    )
                  }
                  onDelete={() =>
                    onColumnsChange(
                      columns.map((item, index) =>
                        index === columnIndex
                          ? { ...item, links: item.links.filter((_, currentIndex) => currentIndex !== linkIndex) }
                          : item,
                      ),
                    )
                  }
                />
              ))}
              <Button
                className="w-fit cursor-pointer"
                onClick={() =>
                  onColumnsChange(
                    columns.map((item, index) =>
                      index === columnIndex
                        ? {
                            ...item,
                            links: [
                              ...item.links,
                              { id: `link-${Date.now()}`, label: "New link", url: "/", visible: true },
                            ],
                          }
                        : item,
                    ),
                  )
                }
                size="sm"
                type="button"
                variant="outline"
              >
                Add link
              </Button>
            </fieldset>
          ))}
          <Button
            className="w-fit cursor-pointer"
            onClick={() => onColumnsChange([...columns, { title: "New column", links: [] }])}
            size="sm"
            type="button"
            variant="outline"
          >
            Add column
          </Button>
        </>
      )}
      {links && onLinksChange && (
        <fieldset className="grid min-w-0 gap-3 rounded-sm border border-stone-200 bg-[#fffaf0] p-3">
          <legend className="px-1 text-sm font-semibold">{singleTitle}</legend>
          {links.map((link, index) => (
            <LinkRow
              key={link.id}
              link={link}
              onChange={(field, value) => updateLink(index, field, value)}
              onDelete={() => onLinksChange(links.filter((_, linkIndex) => linkIndex !== index))}
            />
          ))}
          <Button
            className="w-fit cursor-pointer"
            onClick={() =>
              onLinksChange([...links, { id: `link-${Date.now()}`, label: "New link", url: "/", visible: true }])
            }
            size="sm"
            type="button"
            variant="outline"
          >
            Add link
          </Button>
        </fieldset>
      )}
    </div>
  );
}

function LinkRow({
  link,
  onChange,
  onDelete,
}: {
  link: EditableLink;
  onChange: (field: keyof EditableLink, value: string | boolean) => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
      <label className="flex items-center gap-2 text-xs">
        <input checked={link.visible} onChange={(event) => onChange("visible", event.target.checked)} type="checkbox" />
        Visible
      </label>
      <input
        aria-label="Link label"
        className="h-9 min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
        onChange={(event) => onChange("label", event.target.value)}
        value={link.label}
      />
      <input
        aria-label="Link URL"
        className="h-9 min-w-0 rounded-sm border border-stone-200 bg-white px-3 text-sm"
        onChange={(event) => onChange("url", event.target.value)}
        value={link.url}
      />
      <Button
        aria-label="Delete link"
        className="cursor-pointer text-red-700"
        onClick={onDelete}
        size="sm"
        type="button"
        variant="destructive"
      >
        Delete
      </Button>
    </div>
  );
}
