import { useState, useEffect, useRef } from "react";

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );
  const completedRef = useRef(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        // Call onComplete callback once when countdown reaches zero
        if (!completedRef.current && onComplete) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  // Reset completed flag when targetDate changes
  useEffect(() => {
    completedRef.current = false;
  }, [targetDate]);

  if (!timeRemaining) {
    return null;
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[80px]">
        <div className="text-4xl font-bold">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2 font-medium uppercase">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center gap-4">
      <TimeUnit value={timeRemaining.days} label="Days" />
      <TimeUnit value={timeRemaining.hours} label="Hours" />
      <TimeUnit value={timeRemaining.minutes} label="Minutes" />
      <TimeUnit value={timeRemaining.seconds} label="Seconds" />
    </div>
  );
}
