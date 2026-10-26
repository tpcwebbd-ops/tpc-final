/*
|-----------------------------------------
| setting up CroppedLogo.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

import Image from "next/image";
import type { CSSProperties } from "react";

import type { MenuData } from "@/app/dashboard/admin/menu/data";

type CroppedLogoProps = { data: MenuData; heightClassName: string };

export default function CroppedLogo({ data, heightClassName }: CroppedLogoProps) {
  const crop = data.logoCrop ?? { left: 0, right: 0, top: 0, bottom: 0 };
  const left = clamp(crop.left);
  const right = clamp(crop.right, 99 - left);
  const top = clamp(crop.top);
  const bottom = clamp(crop.bottom, 99 - top);
  const visibleWidth = Math.max(1, 100 - left - right);
  const visibleHeight = Math.max(1, 100 - top - bottom);
  const aspect = data.logoAspect ?? "full";

  if (aspect === "full" && !left && !right && !top && !bottom) {
    return (
      <Image
        alt={data.logoAlt}
        className={`${heightClassName} w-auto max-w-[12rem] object-contain`}
        height={64}
        loading="eager"
        src={data.logoUrl}
        style={{ transform: `scale(${(data.logoZoom ?? 100) / 100})`, width: "auto" }}
        width={192}
      />
    );
  }

  const aspectClass = aspect === "1:1" ? "aspect-square" : aspect === "16:9" ? "aspect-video" : "aspect-[19/6]";
  const imageStyle = {
    height: `${(100 / visibleHeight) * 100}%`,
    maxWidth: "none",
    transform: `translate(-${(left / visibleWidth) * 100}%, -${(top / visibleHeight) * 100}%) scale(${(data.logoZoom ?? 100) / 100})`,
    transformOrigin: "top left",
    width: `${(100 / visibleWidth) * 100}%`,
  } as CSSProperties;

  return (
    <span className={`relative block shrink-0 overflow-hidden ${heightClassName} ${aspectClass}`}>
      <Image
        alt={data.logoAlt}
        className="absolute left-0 top-0 object-fill"
        height={100}
        src={data.logoUrl}
        style={imageStyle}
        width={100}
      />
    </span>
  );
}

function clamp(value: number, max = 90) {
  return Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), max);
}
