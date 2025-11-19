import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CelebrationEffectProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
  className?: string;
}

interface Particle {
  id: number;
  x: number; // Start position X (viewport %)
  y: number; // Start position Y (viewport %)
  color: string;
  size: number; // 6-12px
  velocityX: number; // -5 to 5
  velocityY: number; // -10 to -5 (upward)
  rotation: number; // 0-360
  rotationSpeed: number; // degrees per animation
}

// Mobile detection
const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Check for reduced motion preference
const usePrefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function CelebrationEffect({
  trigger,
  duration = 3000,
  particleCount,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
  onComplete,
  className
}: CelebrationEffectProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const count = particleCount ?? (isMobile ? 50 : 200);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger || prefersReducedMotion) return;

    // Generate particles
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50, // Center of screen
      y: 40, // Slightly above center
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 6, // 6-12px
      velocityX: (Math.random() - 0.5) * 10, // -5 to 5
      velocityY: -(Math.random() * 5 + 5), // -10 to -5 (shoots upward)
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 16 // -8 to 8 degrees
    }));

    setParticles(newParticles);

    // Cleanup after duration
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [trigger, count, colors, duration, onComplete, prefersReducedMotion]);

  // Don't render if reduced motion or no particles
  if (prefersReducedMotion || !trigger || particles.length === 0) return null;

  // Particle animation variants
  const particleVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0
    },
    animate: (particle: Particle) => ({
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0.8],
      x: particle.velocityX * 50, // Travel distance
      y: particle.velocityY * 50,
      rotate: particle.rotation + (particle.rotationSpeed * 60),
      transition: {
        duration: duration / 1000, // Convert ms to seconds
        ease: "easeOut",
        times: [0, 0.1, 0.8, 1] // Opacity keyframes
      }
    })
  };

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-50', className)}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <span className="sr-only">Celebration!</span>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            willChange: 'transform, opacity'
          }}
          custom={particle}
          variants={particleVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}
