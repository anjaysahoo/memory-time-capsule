import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';

interface CapsuleBackgroundProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked';
  children: React.ReactNode;
  className?: string;
  enableParallax?: boolean;
  onTransitionComplete?: () => void;
}

// Mobile detection (max-width: 767px)
const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Easter egg: Detect if Shift key held during page load
const useShiftKeyEasterEgg = () => {
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    // Check if shift is already pressed on mount
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return shiftPressed;
};

export function CapsuleBackground({
  state,
  children,
  className,
  enableParallax = true,
  onTransitionComplete
}: CapsuleBackgroundProps) {
  const isMobile = useIsMobile();
  const isUnlocked = state === 'unlocked';
  const shiftPressed = useShiftKeyEasterEgg();

  // Star configuration based on device and easter egg
  const baseStarSpeed = isMobile ? 60 : 50;
  const starSpeed = shiftPressed ? baseStarSpeed * 0.5 : baseStarSpeed; // Slower when shift pressed (more stars)

  return (
    <motion.div
      className={cn('relative min-h-screen overflow-hidden', className)}
      initial="initial"
      animate={isUnlocked ? "unlocked" : "animate"}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
        unlocked: {
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
          transition: { duration: 1.2, delay: 0.8, ease: [0.4, 0, 0.2, 1] }
        }
      }}
      onAnimationComplete={onTransitionComplete}
    >
      {/* Stars (fade out on unlock) */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            key="stars"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.8 } }}
            className="absolute inset-0"
          >
            <StarsBackground
              starColor="#fff"
              speed={starSpeed}
              pointerEvents={enableParallax && !isMobile}
              className="absolute inset-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter egg indicator - subtle hint */}
      {shiftPressed && !isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 text-white/50 text-xs z-20 select-none pointer-events-none"
        >
          ✨ Extra stars mode
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
