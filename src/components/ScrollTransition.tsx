/*
|-----------------------------------------
| setting up ScrollTransition.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August 2026
|-----------------------------------------
*/

"use client";

import { useEffect } from "react";

const SCROLL_SETTLE_DELAY = 180;

export function ScrollTransition() {
  useEffect(() => {
    const root = document.documentElement;
    let settleTimer: number | undefined;

    const markScrolling = () => {
      root.dataset.scrolling = "true";
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        delete root.dataset.scrolling;
      }, SCROLL_SETTLE_DELAY);
    };

    window.addEventListener("scroll", markScrolling, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", markScrolling, true);
      if (settleTimer) window.clearTimeout(settleTimer);
      delete root.dataset.scrolling;
    };
  }, []);

  return <span aria-hidden="true" className="scroll-transition" />;
}
