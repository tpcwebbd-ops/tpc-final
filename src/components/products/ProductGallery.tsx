/*
|-----------------------------------------
| setting up ProductGallery.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 07 September, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images.filter(Boolean);
  const [selected, setSelected] = useState(0);
  const image = safeImages[selected] ?? "";
  return (
    <div className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-amber-50 via-stone-50 to-orange-100 ring-1 ring-stone-200">
        {image ? (
          <Image
            alt={name}
            className="object-contain p-7 transition duration-700 ease-out group-hover:scale-105"
            fill
            loading="eager"
            sizes="(min-width: 1024px) 52vw, 100vw"
            src={image}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-stone-400">Product image coming soon</div>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((item, index) => (
            <button
              aria-label={`View image ${index + 1}`}
              className={`relative size-16 shrink-0 overflow-hidden rounded-sm border-2 bg-white transition ${selected === index ? "border-amber-500 shadow-md" : "border-transparent hover:border-stone-300"}`}
              key={item}
              onClick={() => setSelected(index)}
              type="button"
            >
              <Image alt="" className="object-contain p-1" fill sizes="64px" src={item} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
