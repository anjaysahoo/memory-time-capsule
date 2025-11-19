import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface AnimatedCountdownProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
  showLabels?: boolean;
  urgencyThreshold?: number; // Minutes
}

interface CountdownUnit {
  value: number;
  label: string;
  key: 'days' | 'hours' | 'minutes' | 'seconds';
}

export function AnimatedCountdown({
  targetDate,
  className,
  onComplete,
  showLabels = true,
  urgencyThreshold = 60
}: AnimatedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownUnit[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        onComplete?.();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft([
        { value: days, label: 'Days', key: 'days' },
        { value: hours, label: 'Hours', key: 'hours' },
        { value: minutes, label: 'Mins', key: 'minutes' },
        { value: seconds, label: 'Secs', key: 'seconds' }
      ]);

      // Check urgency (less than threshold in minutes)
      const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
      setIsUrgent(totalMinutes < urgencyThreshold);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, urgencyThreshold, onComplete]);

  // Flip animation variants
  const flipVariants = {
    initial: {
      rotateX: 0,
      opacity: 1,
      scale: 1
    },
    exit: {
      rotateX: 90,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] // easeIn
      }
    },
    enter: {
      rotateX: -90,
      opacity: 0,
      scale: 0.8
    },
    animate: {
      rotateX: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1] // easeOut
      }
    }
  };

  // Pulse animation variants
  const pulseVariants = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: isUrgent ? 1.5 : 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div
      className={cn('flex gap-2 md:gap-3', className)}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {timeLeft.map((unit) => (
        <div key={unit.key} className="flex flex-col items-center">
          {/* Box with pulse animation */}
          <motion.div
            className={cn(
              'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
              'bg-white/10 border rounded-lg',
              'flex items-center justify-center',
              'relative',
              isUrgent
                ? 'border-[rgba(245,158,11,0.4)] shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                : 'border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.2)]'
            )}
            variants={pulseVariants}
            animate="animate"
            style={{ perspective: 1000 }}
          >
            {/* Flipping Number */}
            <AnimatePresence mode="wait">
              <motion.span
                key={unit.value}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                variants={flipVariants}
                initial="enter"
                animate="animate"
                exit="exit"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Label */}
          {showLabels && (
            <span className="text-xs md:text-sm lg:text-base uppercase text-white/70 mt-2 tracking-wide">
              {unit.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
