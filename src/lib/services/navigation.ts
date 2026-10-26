/*
|-----------------------------------------
| setting up navigation service for the App
|-----------------------------------------
*/
import "server-only";

import { revalidatePath } from "next/cache";

import type { NavigationData } from "@/app/api/dashboard/navigation/v1/route";
import { findNavigation, saveNavigation } from "@/lib/models/site-settings";
export const mergeNavigation = (defaults: NavigationData, data?: Partial<NavigationData>): NavigationData => ({
  user: { ...defaults.user, ...data?.user, items: data?.user?.items ?? defaults.user.items },
  dashboard: { ...defaults.dashboard, ...data?.dashboard, items: data?.dashboard?.items ?? defaults.dashboard.items },
});
export const getNavigation = async (defaults: NavigationData) =>
  mergeNavigation(defaults, (await findNavigation<{ key: "mobile"; data: NavigationData }>())?.data);
export async function updateNavigation(data: NavigationData) {
  await saveNavigation(data);
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/developer/navigation");
}
