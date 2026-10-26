/*
|-----------------------------------------
| setting up provider.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| client Redux provider for RTK Query cache
|-----------------------------------------
*/

"use client";

import { Provider } from "react-redux";

import { store } from "@/redux/app/store";

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}
