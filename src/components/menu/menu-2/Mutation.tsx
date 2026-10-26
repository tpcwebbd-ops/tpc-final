/*
|-----------------------------------------
| setting up Mutation.tsx for the App
|-----------------------------------------
*/

import type { MenuData } from "../menu-1/data";

/** Menu-2 owns this merge point for future compact-layout fields. */
export const mutateMenuTwo = (data: MenuData, patch: Partial<MenuData>): MenuData => ({
  ...data,
  ...patch,
  variant: "menu-2",
});
