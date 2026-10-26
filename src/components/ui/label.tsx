import { cn } from "@/app/api/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-stone-700", className)} {...props} />;
}

export { Label };
