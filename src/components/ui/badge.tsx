/*
|-----------------------------------------
| setting up badge.tsx for the App
|-----------------------------------------
*/

import { cn } from "@/app/api/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span"> & { variant?: "default" | "outline" }) {
  return <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium", className)} {...props} />;
}

export { Badge };
