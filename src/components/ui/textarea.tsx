import { cn } from "@/app/api/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-sm border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition duration-700 placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-stone-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
