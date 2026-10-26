/*
|-----------------------------------------
| setting up LogoMediaPicker.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { UploadButton } from "@/app/api/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateMediaMutation, useGetMediaQuery } from "@/redux/features/dashboard/media/mediaSlice";

const PAGE_SIZE = 10;

export default function LogoMediaPicker({
  close,
  onSelect,
  title = "Choose logo",
  description = "Select an image from media or upload a new one.",
  uploadLabel = "Upload image",
}: {
  close: () => void;
  onSelect: (url: string) => void;
  title?: string;
  description?: string;
  uploadLabel?: string;
}) {
  const { data, isLoading } = useGetMediaQuery();
  const [create] = useCreateMediaMutation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const images = useMemo(
    () =>
      (data?.items ?? []).filter(
        (item) =>
          item.type === "picture" && `${item.name} ${item.author}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [data?.items, query],
  );
  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = images.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  async function saveUpload(result: { name: string; ufsUrl: string; key: string }[] | undefined) {
    const file = result?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await create({
        name: file.name,
        url: file.ufsUrl,
        type: "picture",
        uploadPlane: "Uploadthings",
        fileKey: file.key,
      }).unwrap();
      onSelect(file.ufsUrl);
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="w-full max-w-3xl animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
          <div>
            <h2 className="font-semibold text-stone-900">{title}</h2>
            <p className="mt-1 text-xs text-stone-500">{description}</p>
          </div>
          <Button aria-label="Close" disabled={uploading} onClick={close} size="sm" variant="ghost">
            ×
          </Button>
        </header>
        <ScrollArea className="max-h-[75vh] p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="h-9 min-w-0 flex-1 rounded-sm border border-stone-200 bg-white px-3 text-sm"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search images"
              value={query}
            />
            <UploadButton
              appearance={{
                button:
                  "cursor-pointer rounded-sm bg-slate-600 px-3 py-2 text-sm font-medium text-amber-950 transition hover:bg-slate-800 text-sm",
                allowedContent: "text-stone-500",
              }}
              content={{ button: uploading ? "Uploading…" : uploadLabel, allowedContent: "Images only" }}
              endpoint="imageUploader"
              onClientUploadComplete={(result) => void saveUpload(result)}
              onUploadError={() => setUploading(false)}
            />
          </div>
          {isLoading ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="aspect-square animate-pulse rounded-sm bg-amber-100" key={index} />
              ))}
            </div>
          ) : visible.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visible.map((item) => (
                <button
                  className="group cursor-pointer overflow-hidden rounded-sm border border-[#eadfca] bg-white text-left transition duration-700 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg"
                  disabled={uploading}
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  type="button"
                >
                  <Image
                    alt={item.name}
                    className="aspect-square w-full object-contain p-2"
                    height={160}
                    src={item.url}
                    width={160}
                  />
                  <span className="block truncate border-t border-stone-100 px-2 py-2 text-xs text-stone-600">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-sm border border-dashed border-[#d9c9aa] p-8 text-center text-sm text-stone-500">
              No images found. Upload a logo to add it to the media library.
            </div>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
            <span className="text-xs text-stone-500">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                disabled={safePage === 1 || uploading}
                onClick={() => setPage((current) => current - 1)}
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={safePage === totalPages || uploading}
                onClick={() => setPage((current) => current + 1)}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </ScrollArea>
      </section>
    </div>
  );
}
