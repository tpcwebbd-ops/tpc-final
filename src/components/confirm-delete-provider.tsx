/*
|-----------------------------------------
| setting up confirm-delete-provider.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

const ConfirmDeleteContext = createContext<((message: string) => Promise<boolean>) | null>(null);

export function ConfirmDeleteProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<{ message: string; resolve: (confirmed: boolean) => void } | null>(null);
  const confirmDelete = useCallback(
    (message: string) => new Promise<boolean>((resolve) => setPending({ message, resolve })),
    [],
  );
  const close = (confirmed: boolean) => {
    pending?.resolve(confirmed);
    setPending(null);
  };
  return (
    <ConfirmDeleteContext.Provider value={confirmDelete}>
      {children}
      {pending && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
            role="dialog"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-red-100 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <button
                aria-label="Close"
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center text-stone-500"
                onClick={() => close(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-sm font-medium text-stone-700">{pending.message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="cursor-pointer rounded-sm border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700"
                onClick={() => close(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-red-700 px-2.5 py-1.5 text-xs font-semibold text-white"
                onClick={() => close(true)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </ConfirmDeleteContext.Provider>
  );
}

export function useConfirmDelete() {
  const confirmDelete = useContext(ConfirmDeleteContext);
  if (!confirmDelete) throw new Error("useConfirmDelete must be used inside ConfirmDeleteProvider.");
  return confirmDelete;
}
