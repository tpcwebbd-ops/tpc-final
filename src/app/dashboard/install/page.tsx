/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { useGetInstallInfoQuery } from "@/redux/features/dashboard/installinfo/installInfoSlice";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type Guide = "desktop" | "mobile" | null;
type Toast = { message: string; error?: boolean };

export default function InstallPage() {
  const { data: installInfo, error, isFetching, isLoading } = useGetInstallInfoQuery();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [guide, setGuide] = useState<Guide>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
      setStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as Navigator & { standalone?: boolean }).standalone === true,
      );
    });
    const capture = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function install() {
    if (!installEvent) {
      setGuide(isIOS ? "mobile" : "desktop");
      return;
    }
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setToast({ message: choice.outcome === "accepted" ? "App installed." : "Installation dismissed.", error: choice.outcome !== "accepted" });
      setInstallEvent(null);
    } catch {
      setToast({ message: "Could not start installation. Please try again.", error: true });
    }
  }
  if (isLoading) return <InstallPageLoader label="Preparing installation" />;
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-1 bg-[#fffaf0] p-4 sm:p-8">
      {isFetching && <InstallPageLoader label="Refreshing installation info" overlay />}
      {toast && (
        <div className={`fixed right-4 top-4 z-[90] rounded-sm px-4 py-3 text-sm text-white shadow-lg ${toast.error ? "bg-red-700" : "bg-emerald-700"}`} role="status">
          {toast.message}
        </div>
      )}
      <section className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-sm">
        <div className="relative flex w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-[#fffaf0] to-emerald-100 px-5 py-10 sm:px-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/30 blur-2xl" />
          <div className="relative mx-auto w-full max-w-3xl">
            <span className="grid h-12 w-12 place-items-center rounded-sm bg-stone-900 text-white shadow-lg">
              {iconMap.Download}
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">Install this website as an app</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">A PWA gives you a faster, focused experience with a home-screen shortcut, app-style window, and access that feels native on desktop and mobile.</p>
            <div className="mt-6 grid gap-3 text-sm text-stone-700 sm:grid-cols-3"><div className="rounded-sm border border-white/70 bg-white/60 p-4"><b>Quick launch</b><p className="mt-1 text-stone-600">Open from your home screen or desktop.</p></div><div className="rounded-sm border border-white/70 bg-white/60 p-4"><b>Focused work</b><p className="mt-1 text-stone-600">Use a clean app-style window without browser clutter.</p></div><div className="rounded-sm border border-white/70 bg-white/60 p-4"><b>Reliable access</b><p className="mt-1 text-stone-600">Keep essential pages close when you need them.</p></div></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={standalone}
                onClick={() => void install()}
                type="button"
              >
                {iconMap.Download}
                {standalone ? "Installed" : "Install app"}
              </button>
            </div>
            {error && (
              <p className="mt-4 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700" role="status">
                {getErrorMessage(error, "Could not load installation information.")}
              </p>
            )}
          </div>
        </div>
      </section>
      {guide && <GuideModal close={() => setGuide(null)} desktopHint={installInfo?.desktopHint} isIOS={isIOS} mobileHint={installInfo?.mobileHint} type={guide} />}
    </main>
  );
}
function GuideModal({ close, desktopHint, isIOS, mobileHint, type }: { close: () => void; desktopHint?: string; isIOS: boolean; mobileHint?: string; type: Exclude<Guide, null> }) {
  const steps =
    type === "desktop"
      ? [desktopHint ?? "Use your browser menu to install.", "Choose Install app."]
      : isIOS
        ? ["Open this page in Safari.", mobileHint ?? "Tap Share, then Add to Home Screen."]
        : [mobileHint ?? "Use your browser share menu to add it to your home screen.", "Choose Install app or Add to Home screen."];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="w-full max-w-md animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] rounded-sm bg-[#fffaf0] shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[#eadfca] p-5">
          <b>{type === "desktop" ? "Desktop install" : "Mobile install"}</b>
          <button
            aria-label="Close"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition duration-700 hover:bg-amber-100"
            onClick={close}
            type="button"
          >
            {iconMap.X}
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-5">
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li className="flex items-center gap-3 text-sm text-stone-700" key={step}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-amber-200 font-bold text-amber-950">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function InstallPageLoader({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={overlay ? "fixed inset-0 z-[70] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm" : "min-h-[calc(100vh-65px)] grid place-items-center bg-[#fffaf0] p-4"}
      role="status"
    >
      <div className="relative grid min-w-56 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white px-8 py-7 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.48)]">
        <div className="absolute -left-10 -top-10 h-24 w-24 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-amber-200/70 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 h-28 w-28 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-emerald-100 blur-2xl [animation-delay:1.2s]" />
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-300/70" />
          <span className="absolute inset-1 animate-[soft-pulse_1.6s_ease-in-out_infinite] rounded-full bg-amber-100" />
          <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-amber-700 border-t-transparent [animation-duration:1.1s]" />
        </div>
        <p className="relative mt-4 text-sm font-semibold text-stone-800">{label}</p>
        <div aria-hidden="true" className="relative mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") return data.error;
  }
  return fallback;
}
