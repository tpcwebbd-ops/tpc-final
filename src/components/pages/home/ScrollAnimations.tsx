/*
|-----------------------------------------
| setting up ScrollAnimations.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

"use client";

import { useEffect } from "react";

let initialized = false;

export default function ScrollAnimations() {
  useEffect(() => {
    let disposed = false;
    let refresh: (() => void) | undefined;

    // Load AOS only in the browser. Content is visible until it initializes.
    void import("aos").then(({ default: AOS }) => {
      if (disposed) return;
      if (!initialized) {
        AOS.init({
          duration: 750,
          easing: "ease-out-cubic",
          offset: 45,
          once: true,
          disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
        initialized = true;
      }
      AOS.refreshHard();
      refresh = () => AOS.refresh();
      // Lazy images and expanded course details can move later sections.
      window.addEventListener("load", refresh, true);
      document.addEventListener("toggle", refresh, true);
      void document.fonts.ready.then(() => {
        if (!disposed) AOS.refresh();
      });
    });

    return () => {
      disposed = true;
      if (refresh) {
        window.removeEventListener("load", refresh, true);
        document.removeEventListener("toggle", refresh, true);
      }
    };
  }, []);

  return null;
}
