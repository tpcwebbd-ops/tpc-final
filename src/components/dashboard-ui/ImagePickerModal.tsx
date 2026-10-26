/*
|-----------------------------------------
| setting up ImagePickerModal.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 31 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { UploadButton } from "@/app/api/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateMediaMutation, useGetMediaQuery } from "@/redux/features/dashboard/media/mediaSlice";

const PAGE_SIZE = 12;

export type ImagePickerModalProps = {
  close: () => void;
  onSelect: (url: string) => void;
  selectedUrl?: string;
  title?: string;
  description?: string;
  uploadLabel?: string;
};

export default function ImagePickerModal({
  close,
  onSelect,
  selectedUrl = "",
  title = "Choose image",
  description = "Select an image from the Media Library or upload a new one.",
  uploadLabel = "Upload image",
}: ImagePickerModalProps) {
  const { data, isLoading, isError, refetch } = useGetMediaQuery();
  const [create] = useCreateMediaMutation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
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
    setUploadError("");
    try {
      const created = await create({
        name: file.name,
        url: file.ufsUrl,
        type: "picture",
        uploadPlane: "Uploadthings",
        fileKey: file.key,
      }).unwrap();
      onSelect(created.item.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image could not be added to the Media Library.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        aria-labelledby="image-picker-title"
        className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
        role="dialog"
      >
        <header className="flex items-start justify-between border-b border-[#eadfca] p-5">
          <div>
            <h2 className="font-semibold text-stone-900" id="image-picker-title">
              {title}
            </h2>
            <p className="mt-1 text-xs text-stone-500">{description}</p>
          </div>
          <Button
            aria-label="Close image picker"
            disabled={uploading}
            onClick={close}
            size="sm"
            type="button"
            variant="ghost"
          >
            ×
          </Button>
        </header>
        <ScrollArea className="max-h-[75vh] p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              aria-label="Search images"
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
              onUploadError={(error) => {
                setUploading(false);
                setUploadError(error.message || "Image upload failed.");
              }}
            />
          </div>
          {uploadError && (
            <p className="mt-3 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {uploadError}
            </p>
          )}
          {isLoading ? (
            <div aria-label="Loading images" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" role="status">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="aspect-square animate-pulse rounded-sm bg-amber-100" key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="mt-5 rounded-sm border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
              <p>Could not load the Media Library.</p>
              <Button className="mt-3" onClick={() => void refetch()} size="sm" type="button" variant="outline">
                Try again
              </Button>
            </div>
          ) : visible.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visible.map((item) => {
                const selected = item.url === selectedUrl;
                return (
                  <button
                    aria-pressed={selected}
                    className={`group cursor-pointer overflow-hidden rounded-sm border bg-white text-left transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg ${selected ? "border-amber-600 ring-2 ring-amber-300" : "border-[#eadfca]"}`}
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
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-sm border border-dashed border-[#d9c9aa] p-8 text-center text-sm text-stone-500">
              No images found. Upload an image to add it to the Media Library.
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
                type="button"
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={safePage === totalPages || uploading}
                onClick={() => setPage((current) => current + 1)}
                size="sm"
                type="button"
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
