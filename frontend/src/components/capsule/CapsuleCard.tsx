import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CapsuleCardProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked';
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  enableHover?: boolean;
  onAnimationComplete?: () => void;
}

// Desktop detection (min-width: 1024px)
const useIsDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

export function CapsuleCard({
  state,
  children,
  className,
  maxWidth = 'md',
  enableHover = true,
  onAnimationComplete
}: CapsuleCardProps) {
  const isUnlocked = state === 'unlocked';
  const isDesktop = useIsDesktop();

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-lg',   // 500px
    md: 'max-w-2xl',  // 600px
    lg: 'max-w-4xl',  // 900px
    xl: 'max-w-6xl'   // 1200px
  };

  // Card entrance animation
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.1,
        ease: [0, 0, 0.2, 1] // easeOut
      }
    }
  };

  // Container for staggered children
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  // Hover variants (desktop only)
  const hoverVariants = enableHover && isDesktop ? {
    rest: {
      scale: 1,
      boxShadow: isUnlocked
        ? '0 10px 15px rgba(0, 0, 0, 0.10), 0 4px 6px rgba(0, 0, 0, 0.05)'
        : '0 0 20px rgba(255, 255, 255, 0.15)'
    },
    hover: {
      scale: 1.005,
      boxShadow: isUnlocked
        ? '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.08)'
        : '0 0 25px rgba(255, 255, 255, 0.20)',
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  } : undefined;

  return (
    <motion.div
      className={cn(
        'mx-auto p-8 md:p-10 lg:p-12 rounded-2xl',
        maxWidthClasses[maxWidth],
        'my-4 md:my-8 lg:my-12',
        isUnlocked
          ? 'bg-white border border-black/10 shadow-lg'
          : 'bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)]',
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={hoverVariants ? "hover" : undefined}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Child animation variant for use inside CapsuleCard
export const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }
  }
};
