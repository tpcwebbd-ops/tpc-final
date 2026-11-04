/*
|-----------------------------------------
| setting up AnimatedText.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import type { CSSProperties } from "react";

import styles from "./home.module.css";

export default function AnimatedText({ text }: { text: string }) {
  return (
    <span className={styles.animatedText} data-aos="text-reveal">
      {text.split(/(\s+)/u).map((word, index) =>
        /^\s+$/u.test(word) ? (
          word
        ) : (
          <span className={styles.word} key={index} style={{ "--word-index": Math.min(index, 18) } as CSSProperties}>
            {word}
          </span>
        ),
      )}
    </span>
  );
}
