/*
|-----------------------------------------
| setting up input.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 15 August, 2026
|-----------------------------------------
*/

import { cn } from "@/app/api/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn("h-8 w-full rounded-sm border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition duration-700 placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-stone-50", className)} {...props} />;
}

export { Input };
