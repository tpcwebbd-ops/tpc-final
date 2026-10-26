/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import {
  hydrateTopBanner,
  topBannerAssets,
  TopBannerMutation,
  TopBannerPreview,
  type TopBannerData,
} from "@/components/topbanner/TopBannerIndex";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  useDeleteTopBannerMutation,
  useGetTopBannerQuery,
  useSaveTopBannerMutation,
} from "@/redux/features/dashboard/topbanner/topBannerSlice";

export default function TopBannerPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data, error, isLoading } = useGetTopBannerQuery(undefined, { skip: !session });
  const [save] = useSaveTopBannerMutation();
  const [remove] = useDeleteTopBannerMutation();
  const [selected, setSelected] = useState<TopBannerData | null>(null);
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState("");
  const current = useMemo(
    () => (data?.banner ? hydrateTopBanner(data.banner.variant, data.banner.data) : null),
    [data],
  );
  const displayed = selected ?? current;

  async function saveData(next: TopBannerData) {
    try {
      await save({ variant: next.variant, data: next as unknown as Record<string, unknown> }).unwrap();
      setSelected(next);
      setEditing(false);
      setToast("Top banner saved.");
    } catch {
      setToast("Could not save the top banner.");
    }
  }

  async function deleteData() {
    try {
      await remove().unwrap();
      setSelected(null);
      setConfirming(false);
      setToast("Top banner deleted.");
    } catch {
      setToast("Could not delete the top banner.");
    }
  }

  if (sessionPending || isLoading)
    return (
      <main className="flex-1 bg-[#fffaf0] p-6">
        <div className="mx-auto h-80 max-w-6xl animate-pulse rounded-sm border border-[#eadfca] bg-white" />
      </main>
    );
  if (!session)
    return (
      <main className="grid flex-1 place-items-center bg-[#fffaf0]">
        <Link href="/login">Sign in required</Link>
      </main>
    );

  return (
    <main className="flex-1 bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Toast message={toast} onDismiss={() => setToast("")} />
        <section className="overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-5 sm:p-7">
            <h1 className="text-lg font-semibold text-stone-900">Top banner</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setPicker(true)} size="sm" variant="outline">
                Select TopBanner
              </Button>
              <Button disabled={!selected} onClick={() => selected && void saveData(selected)} size="sm" type="button">
                Save
              </Button>
            </div>
          </header>
          <div className="p-5 sm:p-7">
            {error && <p className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">Could not load top banner.</p>}
            {displayed ? (
              <div className="overflow-hidden rounded-sm border border-stone-200">
                <TopBannerPreview data={displayed} />
                <div className="flex flex-wrap justify-end gap-2 border-t border-stone-100 bg-[#fffaf0] p-3">
                  <Button
                    onClick={() => {
                      setSelected(displayed);
                      setEditing(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  {current && (
                    <Button onClick={() => setConfirming(true)} size="sm" variant="destructive">
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffaf0] p-8 text-center">
                <div>
                  <p className="text-sm font-medium text-stone-700">Choose a top banner asset</p>
                  <Button className="mt-4" onClick={() => setPicker(true)} size="sm">
                    Select asset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {picker && (
        <Modal close={() => setPicker(false)} title="Choose top banner">
          <div className="grid gap-3 grid-cols-1">
            {topBannerAssets.map((asset) => (
              <div
                className="rounded-sm border border-stone-200 bg-[#fffaf0] p-3 text-left transition duration-700 hover:-translate-y-1 hover:border-amber-400"
                key={asset.defaultData.variant}
                onClickCapture={(event) => event.preventDefault()}
                onClick={() => {
                  setSelected(asset.defaultData);
                  setPicker(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(asset.defaultData);
                    setPicker(false);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <TopBannerPreview data={asset.defaultData} />
                <p className="mt-3 text-sm font-semibold">{asset.title}</p>
                <p className="mt-1 text-xs text-stone-500">{asset.description}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {editing && selected && (
        <Modal close={() => setEditing(false)} title={`Edit ${selected.variant}`}>
          <TopBannerMutation data={selected} onSave={saveData} />
        </Modal>
      )}
      {confirming && (
        <Modal close={() => setConfirming(false)} title="Delete top banner">
          <p className="text-sm text-stone-600">This removes the saved top banner from the database.</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button onClick={() => setConfirming(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={() => void deleteData()} size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Modal({ children, close, title }: { children: React.ReactNode; close: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-stone-950/30 p-3 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-5">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <Button aria-label="Close" onClick={close} size="sm" variant="ghost">
            ×
          </Button>
        </header>
        <div className="max-h-[calc(90vh-65px)] overflow-y-auto p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}
