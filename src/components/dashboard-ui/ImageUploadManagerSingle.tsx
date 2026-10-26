/*
|-----------------------------------------
| setting up ImageUploadManagerSingle.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| single image URL field for dashboard editors
|-----------------------------------------
*/

"use client";

import { Input } from "@/components/ui/input";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUploadManagerSingle({ value = "", onChange }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <Input
        aria-label="Image URL"
        className="h-auto border-0 bg-transparent p-0 text-xs text-zinc-300 focus:ring-0"
        placeholder="Paste image URL"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
