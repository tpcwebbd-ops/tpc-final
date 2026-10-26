/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { FooterMutation, FooterPreview, footerAssets, hydrateFooter } from "@/components/footer/FooterIndex";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Toast } from "@/components/ui/toast";
import {
  useDeleteFooterMutation,
  useGetFooterQuery,
  useSaveFooterMutation,
  type FooterData,
} from "@/redux/features/dashboard/footer/footerSlice";

const assets = footerAssets.map((asset) => ({
  variant: asset.defaultData.variant,
  title: asset.title,
  description: asset.description,
  data: asset.defaultData,
}));

export default function FooterPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data, isLoading, error } = useGetFooterQuery(undefined, { skip: !session });
  const [save, { isLoading: isSaving }] = useSaveFooterMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteFooterMutation();
  const confirmDelete = useConfirmDelete();
  const [selected, setSelected] = useState<FooterData | null>(null);
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");
  const current = useMemo(() => (data?.footer ? hydrateFooter(data.footer.variant, data.footer.data) : null), [data]);
  const choices = useMemo(() => data?.defaults ?? assets.map((asset) => asset.data), [data]);
  async function saveData(next: FooterData) {
    try {
      await save({ variant: next.variant, data: next }).unwrap();
      setSelected(next);
      setEditing(false);
      setToast("Footer saved successfully.");
    } catch {
      setToast("Could not save the footer.");
    }
  }
  async function deleteData() {
    if (!(await confirmDelete("Delete the saved footer?"))) return;
    try {
      await remove().unwrap();
      setSelected(null);
      setToast("Footer deleted successfully.");
    } catch {
      setToast("Could not delete the footer.");
    }
  }
  const isUpdating = isSaving || isDeleting;
  if (sessionPending || isLoading)
    return (
      <main className="flex-1">
        <LoadingState label="Loading footer" />
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
      {isUpdating && <LoadingState label={isDeleting ? "Removing footer" : "Saving footer"} overlay />}
      <div className="mx-auto max-w-6xl">
        <Toast message={toast} onDismiss={() => setToast("")} />
        <section className="overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-5 sm:p-7">
            <h1 className="text-lg font-semibold text-stone-900">Footer</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="cursor-pointer transition duration-700"
                disabled={isUpdating}
                onClick={() => setPicker(true)}
                size="sm"
                variant="outline"
              >
                Select Footer
              </Button>
              <Button
                disabled={!selected || isUpdating}
                onClick={() => selected && void saveData(selected)}
                size="sm"
                type="button"
              >
                Save
              </Button>
            </div>
          </header>
          <div className="p-5 sm:p-7">
            {error && <p className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">Could not load footer.</p>}
            {current ? (
              <div className="overflow-hidden rounded-sm border border-stone-200">
                <Preview data={current} />
                <div className="flex flex-wrap justify-end gap-2 border-t border-stone-100 bg-[#fffaf0] p-3">
                  <Button
                    className="cursor-pointer transition duration-700"
                    onClick={() => {
                      setSelected(current);
                      setEditing(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    className="cursor-pointer transition duration-700"
                    onClick={() => void deleteData()}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center rounded-sm border border-dashed border-[#d9c9aa] bg-[#fffaf0] p-8 text-center">
                <div>
                  <p className="text-sm font-medium text-stone-700">Choose a footer asset</p>
                  <Button
                    className="mt-4 cursor-pointer transition duration-700"
                    onClick={() => setPicker(true)}
                    size="sm"
                  >
                    Select asset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {picker && (
        <Modal title="Choose footer" close={() => setPicker(false)}>
          <div className="grid min-w-0 grid-cols-1 gap-4">
            {choices.map((choice) => (
              <div
                className="min-w-0 w-full rounded-sm border border-stone-200 bg-[#fffaf0] p-3 text-left transition duration-700 hover:-translate-y-1 hover:border-amber-400"
                key={choice.variant}
                onClick={() => {
                  void saveData(choice);
                  setPicker(false);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  void saveData(choice);
                  setPicker(false);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="pointer-events-none min-w-0 overflow-hidden">
                  <Preview data={choice} />
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {assets.find((item) => item.variant === choice.variant)?.title}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {assets.find((item) => item.variant === choice.variant)?.description}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {editing && selected && (
        <Modal title={`Edit ${selected.variant}`} close={() => setEditing(false)}>
          <FooterMutation data={selected} onSave={saveData} />
        </Modal>
      )}
    </main>
  );
}
function Preview({ data }: { data: FooterData }) {
  return <FooterPreview data={data} />;
}
function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-stone-950/30 p-3 backdrop-blur-sm sm:p-4">
      <section
        aria-modal="true"
        className="max-h-[90vh] w-full min-w-0 max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-4">
          <h2 className="truncate font-semibold text-stone-900">{title}</h2>
          <Button
            aria-label="Close"
            className="cursor-pointer transition duration-700"
            onClick={close}
            size="sm"
            variant="ghost"
          >
            ×
          </Button>
        </header>
        <div className="max-h-[calc(90vh-65px)] overflow-x-hidden overflow-y-auto p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}
