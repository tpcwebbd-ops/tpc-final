/*
|-----------------------------------------
| setting up dialog.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

const DialogContext = createContext(false);

export function Dialog({
  open = false,
  onOpenChange: _onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  void _onOpenChange;
  return <DialogContext.Provider value={open}>{children}</DialogContext.Provider>;
}

export function DialogContent({ className, ...props }: ComponentProps<"div">) {
  const open = useContext(DialogContext);
  return open ? (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className={className} role="dialog" {...props} />
    </div>
  ) : null;
}

export function DialogHeader(props: ComponentProps<"div">) {
  return <div {...props} />;
}
export function DialogTitle(props: ComponentProps<"h2">) {
  return <h2 {...props} />;
}
export function DialogDescription(props: ComponentProps<"p">) {
  return <p {...props} />;
}
