/*
|-----------------------------------------
| setting up scroll-area.tsx for the App
|-----------------------------------------
*/

import { cn } from "@/app/api/lib/utils";

function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("overflow-auto", className)} {...props}>{children}</div>;
}

export { ScrollArea };
