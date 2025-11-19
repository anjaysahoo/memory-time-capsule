'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwapCountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  blur?: boolean;
}

interface TimeUnitProps {
  value: number;
  label: string;
  blur?: boolean;
}

function TimeUnit({ value, label, blur = false }: TimeUnitProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [isSwapping, setIsSwapping] = React.useState(false);

  React.useEffect(() => {
    if (value !== displayValue) {
      setIsSwapping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsSwapping(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-24 md:w-28 md:h-32 overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center text-4xl md:text-6xl font-bold tabular-nums',
            'rounded-lg border-2 border-primary/20 bg-card',
            'transition-all duration-300',
            isSwapping && 'scale-95 opacity-0',
            blur && isSwapping && 'blur-sm'
          )}
        >
          {String(displayValue).padStart(2, '0')}
        </div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function SwapCountdown({
  days,
  hours,
  minutes,
  seconds,
  blur = true,
  className,
  ...props
}: SwapCountdownProps) {
  return (
    <div
      className={cn('flex gap-3 md:gap-6 justify-center', className)}
      {...props}
    >
      {days > 0 && <TimeUnit value={days} label="Days" blur={blur} />}
      <TimeUnit value={hours} label="Hours" blur={blur} />
      <TimeUnit value={minutes} label="Minutes" blur={blur} />
      <TimeUnit value={seconds} label="Seconds" blur={blur} />
    </div>
  );
}

