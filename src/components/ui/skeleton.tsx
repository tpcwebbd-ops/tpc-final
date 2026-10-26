/*
|-----------------------------------------
| setting up skeleton.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { cn } from "@/app/api/lib/utils";

function Skeleton({ className }: { className?: string }) { return <div className={cn("animate-pulse rounded-sm bg-amber-100/70", className)} />; }

export { Skeleton };
