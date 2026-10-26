/*
|-----------------------------------------
| setting up checkbox.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import type { ComponentProps } from "react";

type CheckboxProps = Omit<ComponentProps<"input">, "checked" | "onChange" | "type"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ checked = false, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} type="checkbox" {...props} />
  );
}
