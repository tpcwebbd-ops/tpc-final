/*
|-----------------------------------------
| setting up pwa-controls.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/actions";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function urlBase64ToUint8Array(value: string) {
  const padded = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`.replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function PwaControls() {
  const [supported, setSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const initialize = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    };
    queueMicrotask(initialize);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }

    queueMicrotask(() => {
      setSupported(true);
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => registration.pushManager.getSubscription())
        .then(setSubscription)
        .catch(() => setStatus("Service worker registration failed."));
    });

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setStatus(choice.outcome === "accepted" ? "NexaMart was installed." : "Installation was dismissed.");
    setInstallEvent(null);
  }

  async function subscribe() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      setStatus("Add NEXT_PUBLIC_VAPID_PUBLIC_KEY to .env.local before subscribing.");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      await subscribeUser(
        sub.toJSON() as { endpoint: string; expirationTime: number | null; keys: { auth: string; p256dh: string } },
      );
      setSubscription(sub);
      setStatus("Push notifications are enabled.");
    } catch {
      setStatus("Notification permission was not granted.");
    }
  }

  async function unsubscribe() {
    await subscription?.unsubscribe();
    await unsubscribeUser();
    setSubscription(null);
    setStatus("Push notifications are disabled.");
  }

  async function sendTest() {
    const result = await sendNotification(message);
    setStatus(result.success ? "Test notification sent." : (result.error ?? "Notification failed."));
    if (result.success) setMessage("");
  }

  return (
    <div className="mt-8 space-y-6">
      {!isStandalone && (
        <div className="rounded-2xl bg-zinc-100 p-5 dark:bg-zinc-800">
          <h2 className="font-semibold text-zinc-950 dark:text-white">Install NexaMart</h2>
          {installEvent ? (
            <button
              className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={install}
            >
              Install app
            </button>
          ) : isIOS ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              In Safari, tap Share then “Add to Home Screen”.
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Your browser will show an install option when available.
            </p>
          )}
        </div>
      )}
      <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h2 className="font-semibold text-zinc-950 dark:text-white">Push notifications</h2>
        {!supported ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Push notifications are not supported in this browser.
          </p>
        ) : subscription ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Notifications are enabled.</p>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-600"
              placeholder="Test notification message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="flex gap-3">
              <button
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={sendTest}
              >
                Send test
              </button>
              <button
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-600"
                onClick={unsubscribe}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Enable notifications to receive updates.</p>
            <button
              className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={subscribe}
            >
              Enable notifications
            </button>
          </div>
        )}
      </div>
      {status && (
        <p className="text-sm text-zinc-600 dark:text-zinc-300" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
