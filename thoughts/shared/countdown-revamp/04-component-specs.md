# Component Specifications

## Component Architecture Overview

The countdown page uses 5 custom components built on top of existing design primitives:
1. **CapsuleBackground** - Wrapper managing StarsBackground with state transitions
2. **AnimatedCountdown** - Enhanced countdown timer with flip animations
3. **UnlockAnimation** - Lock icon with opening animation
4. **CelebrationEffect** - Reusable confetti/particle system
5. **CapsuleCard** - Animated card wrapper with consistent styling

---

## 1. CapsuleBackground Component

### Purpose
Wraps StarsBackground with state-aware theming, handles dark-to-light transition on unlock, manages loading states.

### TypeScript Interface
```typescript
interface CapsuleBackgroundProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked'
  children: React.ReactNode
  className?: string
  enableParallax?: boolean // Desktop only, default true
  onTransitionComplete?: () => void // Callback when theme transitions finish
}
```

### Visual Specifications

**Dark States (loading, countdown, pending, pin-entry):**
- Background: StarsBackground component unchanged
- Star color: `#fff` (white)
- Star layers: 3 layers (1000/400/200 stars)
- Animation speed: `50s` (desktop), `60s` (mobile for performance)
- Gradient: `radial-gradient(ellipse at bottom, #262626 0%, #000 100%)`
- Z-index: `0` (behind all content)

**Light State (unlocked):**
- Background: Solid light gradient
- Color: `linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)`
- Stars: Fade out completely
- Transition duration: `1200ms`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)

**Mobile Optimizations:**
```typescript
const starConfig = {
  mobile: {
    layers: [
      { count: 500, size: 1, duration: 60 },
      { count: 200, size: 2, duration: 120 },
      { count: 100, size: 3, duration: 180 }
    ]
  },
  desktop: {
    layers: [
      { count: 1000, size: 1, duration: 50 },
      { count: 400, size: 2, duration: 100 },
      { count: 200, size: 3, duration: 150 }
    ]
  }
}
```

### Animation Details

**Initial Load (All Dark States):**
```typescript
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1] // ease-out
    }
  }
}
```

**Dark to Light Transition (Unlock):**
```typescript
const unlockTransition = {
  initial: {
    opacity: 1,
    background: 'radial-gradient(ellipse at bottom, #262626 0%, #000 100%)'
  },
  animate: {
    opacity: 1,
    background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
    transition: {
      duration: 1.2,
      delay: 0.8, // After confetti starts
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
```

**Stars Fade Out (During Unlock):**
- Stars opacity: `1 → 0` over `800ms`
- Starts at same time as background transition (`delay: 0.8s`)
- Easing: `ease-out`

### Code Implementation
```tsx
export function CapsuleBackground({
  state,
  children,
  className,
  enableParallax = true,
  onTransitionComplete
}: CapsuleBackgroundProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isUnlocked = state === 'unlocked'
  const starCount = isMobile ? starConfig.mobile : starConfig.desktop

  return (
    <motion.div
      className={cn('relative min-h-screen overflow-hidden', className)}
      initial="initial"
      animate={isUnlocked ? "unlocked" : "animate"}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        unlocked: {
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)',
          transition: { duration: 1.2, delay: 0.8 }
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
          >
            <StarsBackground
              starColor="#fff"
              speed={isMobile ? 60 : 50}
              pointerEvents={enableParallax && !isMobile}
              className="absolute inset-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
```

### Responsive Behavior
- Mobile: Disable parallax, reduce star count, slower animation
- Tablet: Full star count, parallax enabled
- Desktop: Full fidelity, parallax with mouse movement

### Accessibility
- No interactive elements, purely decorative
- `aria-hidden="true"` on stars
- Background transition announced via live region: "Time capsule unlocked" (handled by parent)

---

## 2. AnimatedCountdown Component

### Purpose
Replaces basic Countdown.tsx with flip animations, urgency states, and breathing effects.

### TypeScript Interface
```typescript
interface AnimatedCountdownProps {
  unlockDate: Date
  className?: string
  onComplete?: () => void
  showLabels?: boolean // Default true
  urgencyThreshold?: number // Minutes, default 60 (1 hour)
}

interface CountdownUnit {
  value: number
  label: string
  key: 'days' | 'hours' | 'minutes' | 'seconds'
}
```

### Visual Specifications

**Box Dimensions:**
- Mobile: `64x64px`
- Tablet: `80x80px`
- Desktop: `96x96px`
- Gap: `8px` (mobile), `12px` (desktop)
- Border-radius: `8px`

**Styling:**
```css
Background: rgba(255, 255, 255, 0.10)
Border: 1px solid rgba(255, 255, 255, 0.20)
Box-shadow: 0 0 24px rgba(255, 255, 255, 0.20) /* Glow */
```

**Number Typography:**
- Mobile: `28px`, `font-bold`, `white`
- Tablet: `36px`
- Desktop: `44px`
- Alignment: Center (flex center)

**Label Typography:**
- Mobile: `11px`, `uppercase`, `white/70`, `tracking-wide`
- Tablet: `12px`
- Desktop: `14px`
- Position: Below box, `8px` margin-top

**Urgency State (< 60 minutes):**
```css
/* Color shift to warm */
Border: 1px solid rgba(245, 158, 11, 0.40) /* Warning color */
Box-shadow: 0 0 30px rgba(245, 158, 11, 0.40) /* Warning glow */
Animation: Pulse faster (1.5s vs 2.5s)
```

### Animation Details

**Flip Animation (When Number Changes):**
```typescript
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
      ease: [0.4, 0, 1, 1] // ease-in (accelerating out)
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
      ease: [0, 0, 0.2, 1] // ease-out (decelerating in)
    }
  }
}
```

**Breathing Pulse (Idle):**
```typescript
const pulseVariants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 2.5, // Normal state
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Urgency state (< 60 min)
const urgentPulseVariants = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 1.5, // Faster pulse
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

**Glow Pulse (Continuous):**
```typescript
const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 255, 255, 0.20)',
      '0 0 30px rgba(255, 255, 255, 0.30)',
      '0 0 20px rgba(255, 255, 255, 0.20)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

### Code Implementation
```tsx
export function AnimatedCountdown({
  unlockDate,
  className,
  onComplete,
  showLabels = true,
  urgencyThreshold = 60
}: AnimatedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownUnit[]>([])
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = unlockDate.getTime() - now

      if (distance < 0) {
        clearInterval(interval)
        onComplete?.()
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft([
        { value: days, label: 'Days', key: 'days' },
        { value: hours, label: 'Hours', key: 'hours' },
        { value: minutes, label: 'Mins', key: 'minutes' },
        { value: seconds, label: 'Secs', key: 'seconds' }
      ])

      // Check urgency
      const totalMinutes = days * 24 * 60 + hours * 60 + minutes
      setIsUrgent(totalMinutes < urgencyThreshold)
    }, 1000)

    return () => clearInterval(interval)
  }, [unlockDate, urgencyThreshold, onComplete])

  return (
    <div className={cn('flex gap-2 md:gap-3', className)}>
      {timeLeft.map((unit) => (
        <div key={unit.key} className="flex flex-col items-center">
          {/* Box */}
          <motion.div
            className={cn(
              'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
              'bg-white/10 border rounded-lg',
              'flex items-center justify-center',
              isUrgent
                ? 'border-warning/40 shadow-[0_0_30px_rgba(245,158,11,0.40)]'
                : 'border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.20)]'
            )}
            variants={isUrgent ? urgentPulseVariants : pulseVariants}
            animate="animate"
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
  )
}
```

### Responsive Behavior
- Mobile: Smaller boxes (64px), tighter gaps (8px), smaller text
- Tablet: Medium boxes (80px), medium gaps (12px)
- Desktop: Large boxes (96px), comfortable gaps (12px), hover glow increase

### Accessibility
- `role="timer"` on container
- `aria-live="polite"` updates every minute (not every second to avoid spam)
- `aria-atomic="true"` reads entire time remaining
- Screen reader text: "{days} days, {hours} hours, {minutes} minutes remaining"

---

## 3. UnlockAnimation Component

### Purpose
Animated lock icon that transitions from locked to unlocked state, provides visual feedback for unlock moment.

### TypeScript Interface
```typescript
interface UnlockAnimationProps {
  state: 'locked' | 'unlocking' | 'unlocked'
  size?: number // Default 64 (mobile), 80 (tablet), 96 (desktop)
  className?: string
  onUnlockComplete?: () => void
}
```

### Visual Specifications

**Icon Sizes:**
- Mobile: `64x64px`
- Tablet: `80x80px`
- Desktop: `96x96px`

**States:**
1. **Locked:** Padlock icon (from lucide-react), subtle pulse
2. **Unlocking:** Shake animation, glow intensifies
3. **Unlocked:** Shackle lifts up, transforms to unlock icon, glow burst

**Colors:**
- Icon: `white` (on dark background)
- Glow (locked): `0 0 20px rgba(255, 255, 255, 0.20)`
- Glow (unlocking): `0 0 40px rgba(255, 255, 255, 0.40)`
- Glow (unlocked): `0 0 60px rgba(16, 185, 129, 0.60)` (success green)

### Animation Details

**Locked State (Idle Pulse):**
```typescript
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
}
```

**Unlocking Animation (Shake):**
```typescript
const unlockingVariants = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}
```

**Unlocked Animation (Shackle Lift + Icon Swap):**
```typescript
const unlockedSequence = {
  // 1. Shackle lifts (first 400ms)
  shackleLift: {
    y: [0, -20],
    opacity: [1, 0],
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1]
    }
  },
  // 2. Icon swap (at 200ms, overlapping)
  iconSwap: {
    opacity: [0, 1],
    scale: [0.8, 1.1, 1],
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.34, 1.56, 0.64, 1] // bounce
    }
  },
  // 3. Glow burst (at 300ms)
  glowBurst: {
    boxShadow: [
      '0 0 20px rgba(255, 255, 255, 0.20)',
      '0 0 80px rgba(16, 185, 129, 0.80)',
      '0 0 40px rgba(16, 185, 129, 0.40)'
    ],
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: "easeOut"
    }
  }
}
```

### Code Implementation
```tsx
import { Lock, Unlock } from 'lucide-react'

export function UnlockAnimation({
  state,
  size = 64,
  className,
  onUnlockComplete
}: UnlockAnimationProps) {
  const isUnlocked = state === 'unlocked'
  const Icon = isUnlocked ? Unlock : Lock

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      initial={false}
      animate={state}
      variants={{
        locked: lockedVariants.animate,
        unlocking: unlockingVariants.animate,
        unlocked: unlockedSequence.iconSwap
      }}
      onAnimationComplete={() => {
        if (state === 'unlocked') onUnlockComplete?.()
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: state === 'locked'
            ? '0 0 20px rgba(255, 255, 255, 0.20)'
            : state === 'unlocking'
            ? '0 0 40px rgba(255, 255, 255, 0.40)'
            : '0 0 40px rgba(16, 185, 129, 0.40)'
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
          <Icon className="w-full h-full text-white" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
```

### Responsive Behavior
- Size adjusts via prop (64/80/96)
- Animation timing same across all sizes
- Glow scales proportionally with icon size

### Accessibility
- `aria-label` based on state: "Locked", "Unlocking", "Unlocked"
- `role="img"`
- State changes announced via parent component's live region

---

## 4. CelebrationEffect Component

### Purpose
Reusable confetti/particle system for unlock moment, can be triggered multiple times.

### TypeScript Interface
```typescript
interface CelebrationEffectProps {
  trigger: boolean // Set to true to start celebration
  duration?: number // Default 3000ms
  particleCount?: number // Default 200 (desktop), 50 (mobile)
  colors?: string[] // Default confetti colors from design system
  onComplete?: () => void
  className?: string
}

interface Particle {
  id: number
  x: number // Start position X (viewport %)
  y: number // Start position Y (viewport %)
  color: string
  size: number // 6-12px
  velocityX: number // -5 to 5
  velocityY: number // -10 to -5 (upward)
  rotation: number // 0-360
  rotationSpeed: number // degrees per frame
}
```

### Visual Specifications

**Particle Properties:**
- Shape: Small squares (`6x6px` to `12x12px`)
- Colors: `['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']` (from design tokens)
- Count: `50` (mobile), `200` (desktop)
- Duration: `3000ms` total flight time
- Spread: Full viewport width from center point

**Physics:**
- Gravity: `0.5` pixels/frame downward acceleration
- Initial velocity Y: `-10` to `-5` (shoots upward)
- Initial velocity X: `-5` to `5` (spreads horizontally)
- Rotation speed: `2` to `8` degrees/frame
- Fade out: Last `500ms` of duration

**Emission Pattern:**
- Origin: Center of screen (50% x, 40% y)
- Burst: All particles emit simultaneously
- Spread angle: 360 degrees (full circle)

### Animation Details

**Particle Lifecycle:**
```typescript
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
      duration: 3,
      ease: "easeOut",
      times: [0, 0.1, 0.8, 1] // Opacity keyframes
    }
  })
}
```

**Performance Optimization:**
- Use `transform` and `opacity` only (GPU accelerated)
- Limit particle count on mobile (50 vs 200)
- Remove particles from DOM after animation completes
- Use `will-change: transform` only during animation

### Code Implementation
```tsx
export function CelebrationEffect({
  trigger,
  duration = 3000,
  particleCount,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
  onComplete,
  className
}: CelebrationEffectProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const count = particleCount ?? (isMobile ? 50 : 200)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger) return

    // Generate particles
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50, // Center
      y: 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 6, // 6-12px
      velocityX: (Math.random() - 0.5) * 10, // -5 to 5
      velocityY: -(Math.random() * 5 + 5), // -10 to -5
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 16 // -8 to 8
    }))

    setParticles(newParticles)

    // Cleanup after duration
    const timeout = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timeout)
  }, [trigger, count, colors, duration, onComplete])

  if (!trigger || particles.length === 0) return null

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
  )
}
```

### Responsive Behavior
- Mobile: 50 particles, simpler physics
- Desktop: 200 particles, full physics
- Reduced motion: No particles, show static success icon instead

### Accessibility
- Purely decorative, `pointer-events-none`
- `aria-live="polite"` announces celebration
- Respects `prefers-reduced-motion` (disabled completely)

---

## 5. CapsuleCard Component

### Purpose
Reusable card wrapper with consistent styling, entrance animations, and hover effects across all countdown states.

### TypeScript Interface
```typescript
interface CapsuleCardProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked'
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' // Default 'md'
  enableHover?: boolean // Default true on desktop
  onAnimationComplete?: () => void
}
```

### Visual Specifications

**Dark Theme Cards (locked states):**
```css
Background: rgba(0, 0, 0, 0.80)
Backdrop-filter: blur(24px)
Border: 1px solid rgba(255, 255, 255, 0.10)
Border-radius: 16px
Box-shadow: 0 0 20px rgba(255, 255, 255, 0.15)
```

**Light Theme Card (unlocked):**
```css
Background: #FFFFFF
Border: 1px solid rgba(0, 0, 0, 0.10)
Border-radius: 16px
Box-shadow: 0 10px 15px rgba(0, 0, 0, 0.10), 0 4px 6px rgba(0, 0, 0, 0.05)
```

**Padding:**
- Mobile: `32px 24px` (vertical, horizontal)
- Tablet: `40px 32px`
- Desktop: `48px 40px`

**Max-Width:**
- `sm`: `500px` (pending state)
- `md`: `600px` (countdown, pin-entry)
- `lg`: `900px` (unlocked)
- `xl`: `1200px` (unlocked with large content)

**Margins:**
- Mobile: `16px` (from edges)
- Tablet: `32px`
- Desktop: `48px auto` (centered)

### Animation Details

**Entrance Animation:**
```typescript
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
      ease: [0, 0, 0.2, 1] // ease-out
    }
  }
}
```

**Staggered Children (for content inside):**
```typescript
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }
  }
}
```

**Hover Effect (Desktop Only):**
```typescript
const hoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)'
  },
  hover: {
    scale: 1.01,
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}
```

### Code Implementation
```tsx
export function CapsuleCard({
  state,
  children,
  className,
  maxWidth = 'md',
  enableHover = true,
  onAnimationComplete
}: CapsuleCardProps) {
  const isUnlocked = state === 'unlocked'
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const maxWidthClasses = {
    sm: 'max-w-lg', // 500px
    md: 'max-w-2xl', // 600px
    lg: 'max-w-4xl', // 900px
    xl: 'max-w-6xl' // 1200px
  }

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
      whileHover={enableHover && isDesktop ? "hover" : undefined}
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
  )
}
```

### Responsive Behavior
- Mobile: Smaller padding, full width minus margins
- Tablet: Medium padding, centered with larger margins
- Desktop: Large padding, hover effects enabled, max-width constraints

### Accessibility
- Semantic `<article>` or `<section>` wrapper (depending on context)
- Focus management: Focus moves to card heading on state change
- Keyboard navigation: Tab order flows top to bottom
- Screen reader: State changes announced via parent live region

---

## Component Usage Examples

### Example 1: Countdown State Page
```tsx
export function CountdownPage({ capsule }: { capsule: Capsule }) {
  return (
    <CapsuleBackground state="countdown" enableParallax>
      <CapsuleCard state="countdown" maxWidth="md">
        <motion.div variants={childVariants}>
          <GiftIcon size={64} />
        </motion.div>

        <motion.h1 variants={childVariants}>
          <LineShadowText>{capsule.title}</LineShadowText>
        </motion.h1>

        <motion.p variants={childVariants}>
          From {capsule.senderName}
        </motion.p>

        <motion.div variants={childVariants}>
          <PreviewContent capsule={capsule} />
        </motion.div>

        <motion.div variants={childVariants}>
          <AnimatedCountdown
            unlockDate={new Date(capsule.unlockDate)}
            urgencyThreshold={60}
          />
        </motion.div>

        <motion.div variants={childVariants}>
          <UnlockInfo unlockDate={capsule.unlockDate} />
        </motion.div>
      </CapsuleCard>
    </CapsuleBackground>
  )
}
```

### Example 2: PIN Entry State
```tsx
export function PinEntryPage({ capsule }: { capsule: Capsule }) {
  const [unlockState, setUnlockState] = useState<'locked' | 'unlocking' | 'unlocked'>('locked')
  const [showCelebration, setShowCelebration] = useState(false)

  const handleCorrectPin = () => {
    setUnlockState('unlocking')
    setTimeout(() => {
      setUnlockState('unlocked')
      setShowCelebration(true)
    }, 500)
  }

  return (
    <CapsuleBackground state="pin-entry">
      <CapsuleCard state="pin-entry" maxWidth="md">
        <UnlockAnimation
          state={unlockState}
          onUnlockComplete={() => {
            // Transition to unlocked state
          }}
        />

        <h1>Time Capsule Unlocked!</h1>
        <p>From {capsule.senderName}</p>

        <PreviewContent capsule={capsule} />

        <PinInput onSuccess={handleCorrectPin} />
      </CapsuleCard>

      <CelebrationEffect
        trigger={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </CapsuleBackground>
  )
}
```

### Example 3: Unlocked State with Theme Transition
```tsx
export function UnlockedPage({ capsule }: { capsule: Capsule }) {
  const [transitionComplete, setTransitionComplete] = useState(false)

  return (
    <CapsuleBackground
      state="unlocked"
      onTransitionComplete={() => setTransitionComplete(true)}
    >
      <CapsuleCard state="unlocked" maxWidth="lg">
        <CelebrationIcon size={96} />

        <h1>{capsule.title}</h1>
        <p>From {capsule.senderName}</p>

        <PreviewContent capsule={capsule} />

        {/* Main content only shows after background transition */}
        <AnimatePresence>
          {transitionComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <MainContent capsule={capsule} />
            </motion.div>
          )}
        </AnimatePresence>

        <Metadata capsule={capsule} />
      </CapsuleCard>
    </CapsuleBackground>
  )
}
```

---

## Performance Considerations

### GPU Acceleration
All components use transform and opacity for animations:
```tsx
// Always animate these (GPU accelerated)
transform: translate, scale, rotate
opacity

// Never animate these (CPU intensive, causes repaints)
width, height, margin, padding, top, left
```

### will-change Usage
```tsx
// Only apply during active animations
<motion.div
  style={{ willChange: isAnimating ? 'transform, opacity' : 'auto' }}
/>
```

### Particle Count Limits
```typescript
const particleCount = {
  mobile: 50, // Low-end devices
  tablet: 100,
  desktop: 200 // High-end devices
}
```

### Reduced Motion Support
```tsx
const shouldReduceMotion = useReducedMotion()

{shouldReduceMotion ? (
  <div className="opacity-100">{content}</div>
) : (
  <motion.div animate={...}>{content}</motion.div>
)}
```

---

## Key Design Decisions

### 1. Component Composition Over Props
**Decision:** Build components that compose together (CapsuleBackground > CapsuleCard > Content) instead of monolithic components with many props.
**Rationale:** Easier to maintain, test, and customize. Follows React best practices. Allows mixing and matching.

### 2. State-Driven Styling
**Decision:** All visual changes driven by `state` prop, not internal component state.
**Rationale:** Predictable behavior, easier debugging, single source of truth, works with state machines.

### 3. Framer Motion Variants
**Decision:** Use variants pattern for all animations instead of inline values.
**Rationale:** Cleaner code, reusable, easier to orchestrate, better performance (Motion optimizes variants).

### 4. Mobile-First Animation Complexity
**Decision:** Reduce particle counts, simplify physics, disable parallax on mobile.
**Rationale:** 60fps is critical on mobile; users won't notice missing details on small screens; battery life matters.

### 5. Separate Celebration Component
**Decision:** CelebrationEffect is its own component, not built into UnlockAnimation or CapsuleCard.
**Rationale:** Can be reused in multiple states, easier to test, can be triggered multiple times, performance isolation.

---

These component specifications provide everything needed for developers to implement the countdown page with pixel-perfect accuracy, smooth animations, and excellent performance across all devices.
