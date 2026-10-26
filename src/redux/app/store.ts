/*
|-----------------------------------------
| setting up store.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| RTK Query cache store
|-----------------------------------------
*/

import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useSelector } from "react-redux";

import { apiSlice } from "@/redux/api/apiSlice";

export const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
