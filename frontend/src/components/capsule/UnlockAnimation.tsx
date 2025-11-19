import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnlockAnimationProps {
  state: 'locked' | 'unlocking' | 'unlocked';
  size?: number;
  className?: string;
  onUnlockComplete?: () => void;
}

export function UnlockAnimation({
  state,
  size = 64,
  className,
  onUnlockComplete
}: UnlockAnimationProps) {
  const isUnlocked = state === 'unlocked';
  const Icon = isUnlocked ? Unlock : Lock;

  // Locked state - subtle pulse
  const lockedVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.9, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Unlocking - shake animation
  const unlockingVariants = {
    animate: {
      rotate: [0, -5, 5, -5, 5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Unlocked - scale in with bounce
  const unlockedVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: [0.8, 1.1, 1],
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.34, 1.56, 0.64, 1] // bounce
      }
    }
  };

  // Get animation variant based on state
  const getVariants = () => {
    if (state === 'locked') return lockedVariants;
    if (state === 'unlocking') return unlockingVariants;
    return unlockedVariants;
  };

  // Get glow color based on state
  const getGlow = () => {
    if (state === 'locked') return '0 0 20px rgba(255, 255, 255, 0.20)';
    if (state === 'unlocking') return '0 0 40px rgba(255, 255, 255, 0.40)';
    return '0 0 40px rgba(16, 185, 129, 0.40)'; // Success green
  };

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      initial={false}
      animate="animate"
      variants={getVariants()}
      onAnimationComplete={() => {
        if (state === 'unlocked') onUnlockComplete?.();
      }}
      aria-label={state === 'locked' ? 'Locked' : state === 'unlocking' ? 'Unlocking' : 'Unlocked'}
      role="img"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: getGlow()
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-full h-full text-white" strokeWidth={1.5} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
