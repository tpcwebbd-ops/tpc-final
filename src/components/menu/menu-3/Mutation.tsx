/*
|-----------------------------------------
| setting up Mutation.tsx for the App
|-----------------------------------------
*/

import type { MenuData } from "../menu-1/data";

/** Menu-3 preserves arbitrary mixed layout JSON while applying dashboard changes. */
export const mutateMenuThree = (data: MenuData, patch: Partial<MenuData>): MenuData => ({
  ...data,
  ...patch,
  variant: "menu-3",
});
