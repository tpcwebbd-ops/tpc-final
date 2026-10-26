/*
|-----------------------------------------
| setting up switch.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/app/api/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-stone-300 p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 data-[checked]:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-4"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
