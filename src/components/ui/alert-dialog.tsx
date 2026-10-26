/*
|-----------------------------------------
| setting up alert-dialog.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function AlertDialog({
  open,
  title,
  description,
  busy,
  confirmLabel = "Delete",
  busyLabel = "Deleting…",
  className,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  busy?: boolean;
  confirmLabel?: string;
  busyLabel?: string;
  className?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div
      aria-modal="true"
      className={`fixed inset-0 z-[110] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-xs ${className ?? ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) {
          onCancel();
        }
      }}
      role="alertdialog"
    >
      <section className="w-full max-w-sm rounded-sm border border-[#eadfca] bg-white p-5 shadow-xl transition duration-700">
        <ScrollArea className="max-h-48">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-sm text-stone-600">{description}</p>
        </ScrollArea>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            className="cursor-pointer transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200"
            disabled={busy}
            onClick={onCancel}
            size="sm"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:-translate-y-0.5 hover:bg-red-200"
            disabled={busy}
            onClick={onConfirm}
            size="sm"
            variant="destructive"
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

export { AlertDialog };
