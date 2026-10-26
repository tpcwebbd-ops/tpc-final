/*
|-----------------------------------------
| setting up global-toast.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

export type GlobalToastType = "success" | "error" | "info";

export interface GlobalToastOptions {
  duration?: number;
  type?: GlobalToastType;
}

interface ToastState extends Required<GlobalToastOptions> {
  id: number;
  message: string;
}

const TOAST_EVENT = "speed-box:global-toast";

const emitToast = (message: string, options: GlobalToastOptions = {}) => {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(new CustomEvent<ToastState>(TOAST_EVENT, {
    detail: { duration: 4000, id: Date.now(), message, type: "info", ...options },
  }));
};

export const toast = {
  error: (message: string, options?: Omit<GlobalToastOptions, "type">) => emitToast(message, { ...options, type: "error" }),
  info: (message: string, options?: Omit<GlobalToastOptions, "type">) => emitToast(message, { ...options, type: "info" }),
  success: (message: string, options?: Omit<GlobalToastOptions, "type">) => emitToast(message, { ...options, type: "success" }),
};

/** Compatibility component for existing templates. Notifications still render globally. */
export function Toast({
  duration = 4000,
  error,
  message,
  onDismiss,
}: {
  duration?: number;
  error?: boolean;
  message: string;
  onDismiss?: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const isError = error ?? message.toLowerCase().startsWith("could not");
    if (isError) toast.error(message, { duration });
    else toast.success(message, { duration });
    const timer = window.setTimeout(() => onDismiss?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, error, message, onDismiss]);

  return null;
}

const colorByType: Record<GlobalToastType, string> = {
  error: "bg-red-700",
  info: "bg-stone-700",
  success: "bg-emerald-700",
};

export function GlobalToast() {
  const [current, setCurrent] = useState<ToastState | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => setCurrent((event as CustomEvent<ToastState>).detail);
    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(() => setCurrent(null), current.duration);
    return () => window.clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed right-4 top-4 z-[100] max-w-[calc(100vw-2rem)] overflow-hidden rounded-sm text-sm font-medium text-white shadow-xl transition duration-700 ${colorByType[current.type]}`}
      role="status"
    >
      <p className="px-4 py-3">{current.message}</p>
      <span aria-hidden="true" className="block h-1 bg-white/40" />
    </div>
  );
}
