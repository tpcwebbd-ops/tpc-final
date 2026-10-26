/*
|-----------------------------------------
| setting up actions.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use server";

import webpush from "web-push";

type StoredSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: { auth: string; p256dh: string };
};

let subscription: StoredSubscription | null = null;

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured. Add them to .env.local first.");
  }

  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:admin@example.com", publicKey, privateKey);
}

export async function subscribeUser(sub: StoredSubscription) {
  subscription = sub;
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error("No push subscription is available.");

  configureWebPush();

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "NexaMart",
        body: message.trim() || "You have a new notification.",
        icon: "/Logo.png",
        url: "/",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Unable to send push notification", error);
    return { success: false, error: "Failed to send notification." };
  }
}
