/*
|-----------------------------------------
| setting up slider.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import * as React from 'react';

import { cn } from '@/app/api/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, value, defaultValue, onValueChange, ...props }, ref) => {
  const inputProps = value === undefined ? { defaultValue: defaultValue?.[0] } : { value: value[0] ?? 0 };

  return (
    <input
      ref={ref}
      type="range"
      className={cn('h-2 w-full cursor-pointer accent-blue-500 disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
      {...inputProps}
      onChange={event => onValueChange?.([Number(event.target.value)])}
    />
  );
});

Slider.displayName = 'Slider';

export { Slider };
