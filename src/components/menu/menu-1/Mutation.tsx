/*
|-----------------------------------------
| setting up Mutation.tsx for the App
|-----------------------------------------
*/

import type { MenuData } from "./data";

/** Menu-1's editor boundary. Keep variant-specific fields while editing shared fields. */
export const mutateMenuOne = (data: MenuData, patch: Partial<MenuData>): MenuData => ({
  ...data,
  ...patch,
  variant: "menu-1",
});
