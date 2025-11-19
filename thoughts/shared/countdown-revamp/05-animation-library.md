# Animation Library

## Animation Philosophy

All animations serve one of four purposes:
1. **Entrance** - Establish hierarchy, guide attention
2. **Transition** - Communicate state changes clearly
3. **Feedback** - Confirm interactions, provide status
4. **Delight** - Create emotional moments, reinforce brand

Every animation must:
- Have a clear purpose (not decoration)
- Complete within performance budget (60fps)
- Degrade gracefully (reduced motion support)
- Enhance, not block, core functionality

---

## Entrance Animations

### Page Load Sequence
Used when any countdown state first loads (loading, countdown, pending, pin-entry).

**Timing Strategy:** Background → Container → Content (staggered)

```typescript
// 1. Background fade in (0-400ms)
const backgroundVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1] // easeOut
    }
  }
}

// 2. Card entrance (100-700ms, overlaps with background)
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
      ease: [0, 0, 0.2, 1]
    }
  }
}

// 3. Content stagger (200-800ms)
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms between each child
      delayChildren: 0.2 // Start after card begins
    }
  }
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1]
    }
  }
}
```

**Implementation:**
```tsx
<motion.div variants={backgroundVariants} initial="initial" animate="animate">
  <StarsBackground />

  <motion.div variants={cardVariants}>
    <CapsuleCard>
      <motion.div variants={containerVariants}>
        <motion.div variants={childVariants}><Icon /></motion.div>
        <motion.h1 variants={childVariants}><Title /></motion.h1>
        <motion.p variants={childVariants}><Sender /></motion.p>
        <motion.div variants={childVariants}><Preview /></motion.div>
        <motion.div variants={childVariants}><Countdown /></motion.div>
      </motion.div>
    </CapsuleCard>
  </motion.div>
</motion.div>
```

**Stagger Order (Top to Bottom):**
1. Icon (300ms start)
2. Title (380ms start)
3. Sender (460ms start)
4. Preview content (540ms start)
5. Countdown/CTA (620ms start)

**Total Duration:** 800ms (last element finishes animating)

**Reduced Motion:**
```typescript
const shouldReduceMotion = useReducedMotion()

const reducedCardVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 }
  }
}
```

---

### Fade Slide Up
Standard entrance for individual elements.

```typescript
const fadeSlideUpVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}
```

**Use Cases:**
- Alert messages
- Error notifications
- Success confirmations
- Modal content

---

### Scale In
For icons and focal elements that need emphasis.

```typescript
const scaleInVariants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] // bounce
    }
  }
}
```

**Use Cases:**
- Icons (gift, lock, celebration)
- Countdown timer initial load
- Important badges
- Success checkmarks

---

### Bounce In
Playful entrance for delight moments.

```typescript
const bounceInVariants = {
  initial: {
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  animate: {
    opacity: 1,
    scale: [0, 1.2, 0.9, 1.05, 1],
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      times: [0, 0.4, 0.6, 0.8, 1]
    }
  }
}
```

**Use Cases:**
- Celebration icon (unlocked state)
- Success icons after correct PIN
- Special badges or achievements

---

## State Transition Animations

### Countdown → Pending
Smooth crossfade when unlock time is reached but PIN not sent yet.

```typescript
const countdownToPendingSequence = {
  // 1. Countdown fades out (0-400ms)
  countdownExit: {
    opacity: [1, 0],
    scale: [1, 0.95],
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 1, 1] // easeIn
    }
  },

  // 2. Pending content fades in (200-600ms, overlaps)
  pendingEnter: {
    opacity: [0, 1],
    scale: [0.95, 1],
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: [0, 0, 0.2, 1] // easeOut
    }
  }
}
```

**Implementation:**
```tsx
<AnimatePresence mode="wait">
  {state === 'countdown' && (
    <motion.div
      key="countdown"
      variants={countdownToPendingSequence.countdownExit}
      exit="exit"
    >
      <CountdownView />
    </motion.div>
  )}
  {state === 'pending' && (
    <motion.div
      key="pending"
      variants={countdownToPendingSequence.pendingEnter}
      initial="initial"
      animate="animate"
    >
      <PendingView />
    </motion.div>
  )}
</AnimatePresence>
```

**Total Duration:** 600ms

---

### Pending → Pin Entry
Celebratory transition with confetti burst when PIN is ready.

```typescript
const pendingToPinSequence = {
  // 1. Hourglass spins out (0-500ms)
  hourglassExit: {
    rotate: [0, 180],
    scale: [1, 0],
    opacity: [1, 0],
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1]
    }
  },

  // 2. Confetti burst (300ms start, 3s duration)
  confettiBurst: {
    trigger: true,
    delay: 0.3,
    duration: 3000
  },

  // 3. Lock icon scales in (300-900ms)
  lockEnter: {
    opacity: [0, 1],
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.34, 1.56, 0.64, 1] // bounce
    }
  },

  // 4. PIN content fades in (500-1100ms)
  pinContentEnter: {
    opacity: [0, 1],
    y: [20, 0],
    transition: {
      duration: 0.6,
      delay: 0.5,
      ease: [0, 0, 0.2, 1]
    }
  }
}
```

**Total Duration:** 1100ms (excluding confetti which continues for 3s)

---

### Pin Entry → Unlocked (Success!)
The most important transition - needs to feel rewarding and celebratory.

```typescript
const pinToUnlockedSequence = {
  // 1. PIN boxes flash green (0-200ms)
  pinSuccess: {
    backgroundColor: ['rgba(255,255,255,0.10)', 'rgba(16,185,129,0.30)', 'rgba(16,185,129,0.20)'],
    borderColor: ['rgba(255,255,255,0.20)', 'rgba(16,185,129,0.60)', 'rgba(16,185,129,0.40)'],
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },

  // 2. Page shake (200-600ms)
  pageShake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: "easeInOut"
    }
  },

  // 3. Confetti explosion (200ms start, 3s duration)
  confettiExplosion: {
    trigger: true,
    delay: 0.2,
    particleCount: 200, // Desktop, 50 on mobile
    duration: 3000
  },

  // 4. Lock transforms to unlocked (200-800ms)
  lockTransform: {
    // See UnlockAnimation component for details
    shackleLift: true,
    iconSwap: true,
    glowBurst: true,
    delay: 0.2,
    duration: 0.6
  },

  // 5. PIN content fades out (600-1000ms)
  pinContentExit: {
    opacity: [1, 0],
    y: [0, -20],
    transition: {
      duration: 0.4,
      delay: 0.6,
      ease: [0.4, 0, 1, 1]
    }
  },

  // 6. Background dark → light (800-2000ms)
  backgroundTransition: {
    background: [
      'radial-gradient(ellipse at bottom, #262626 0%, #000 100%)',
      'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)'
    ],
    transition: {
      duration: 1.2,
      delay: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  },

  // 7. Stars fade out (800-1600ms)
  starsFadeOut: {
    opacity: [1, 0],
    transition: {
      duration: 0.8,
      delay: 0.8,
      ease: "easeOut"
    }
  },

  // 8. Unlocked content fades in (1000-1600ms)
  unlockedContentEnter: {
    opacity: [0, 1],
    y: [30, 0],
    scale: [0.95, 1],
    transition: {
      duration: 0.6,
      delay: 1.0,
      ease: [0, 0, 0.2, 1]
    }
  }
}
```

**Implementation:**
```tsx
const handleCorrectPin = async () => {
  // 1. Flash PIN boxes green
  setPinState('success')

  // 2. Trigger shake and confetti
  await delay(200)
  setPageShake(true)
  setShowConfetti(true)

  // 3. Transform lock icon
  setLockState('unlocking')
  await delay(200)
  setLockState('unlocked')

  // 4. Begin background transition
  await delay(600)
  setBackgroundState('unlocked')

  // 5. Load unlocked content
  await delay(200)
  navigate('/capsule/unlocked')
}
```

**Total Duration:** 2000ms (excluding confetti which lasts 3s)

**Timing Diagram:**
```
0ms    |████████| PIN flash green (200ms)
200ms  |████████████| Page shake (400ms)
200ms  |███████████████████████████████████████| Confetti (3000ms)
200ms  |████████████| Lock transform (600ms)
600ms  |████████| PIN fade out (400ms)
800ms  |████████████████████████| Background transition (1200ms)
800ms  |████████████| Stars fade (800ms)
1000ms |████████████| Content fade in (600ms)
```

---

### Pin Entry → Pin Entry (Error)
Gentle shake to indicate wrong PIN without being punishing.

```typescript
const pinErrorVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  flashRed: {
    borderColor: [
      'rgba(255,255,255,0.20)',
      'rgba(239,68,68,0.70)',
      'rgba(239,68,68,0.70)',
      'rgba(255,255,255,0.20)'
    ],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.8, 1]
    }
  }
}
```

**Implementation:**
```tsx
const handleIncorrectPin = () => {
  // Shake PIN boxes
  controls.start('shake')

  // Flash red border
  controls.start('flashRed')

  // Show error message
  setError('Incorrect PIN. Please try again.')

  // Clear PIN inputs after animation
  setTimeout(() => {
    clearPinInputs()
  }, 500)
}
```

**Total Duration:** 500ms

---

## Micro-Interactions

### Button Hover (Desktop)
Subtle scale and glow increase.

```typescript
const buttonHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)'
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}
```

**Usage:**
```tsx
<motion.button
  variants={buttonHoverVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
>
  Click me
</motion.button>
```

---

### Button Tap (Mobile)
Quick scale down and up for tactile feedback.

```typescript
const buttonTapVariants = {
  tap: {
    scale: [1, 0.95, 1.02, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.2, 0.6, 1],
      ease: "easeOut"
    }
  }
}
```

**With Haptic Feedback:**
```tsx
const handleTap = () => {
  // Trigger animation
  controls.start('tap')

  // Haptic feedback (if supported)
  if (navigator.vibrate) {
    navigator.vibrate(10) // 10ms vibration
  }
}
```

---

### Countdown Box Hover
Glow intensity increases, subtle lift.

```typescript
const countdownBoxHoverVariants = {
  rest: {
    y: 0,
    boxShadow: '0 0 24px rgba(255, 255, 255, 0.20)'
  },
  hover: {
    y: -2,
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.30)',
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
}
```

---

### PIN Box Focus
Glow appears, border brightens.

```typescript
const pinBoxFocusVariants = {
  blur: {
    borderColor: 'rgba(255, 255, 255, 0.20)',
    boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)'
  },
  focus: {
    borderColor: 'rgba(255, 255, 255, 1.0)',
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.30)',
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
}
```

**With Auto-Advance Boop:**
```typescript
const pinDigitEnteredVariants = {
  boop: {
    scale: [1, 0.9, 1.05, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.3, 0.7, 1],
      ease: "easeOut"
    }
  }
}
```

---

### Preview Photo Hover
Lift and glow to make it feel precious.

```typescript
const previewPhotoHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.10), 0 4px 6px rgba(0, 0, 0, 0.10)'
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.20), 0 10px 15px rgba(0, 0, 0, 0.20), 0 0 30px rgba(255, 255, 255, 0.15)',
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}
```

---

### Card Hover (Desktop)
Very subtle scale and shadow increase.

```typescript
const cardHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)'
  },
  hover: {
    scale: 1.005, // Almost imperceptible
    boxShadow: '0 0 25px rgba(255, 255, 255, 0.20)',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}
```

---

## Idle Animations

### Icon Breathing (All States)
Subtle pulse to indicate life/activity.

```typescript
const iconBreathingVariants = {
  breathe: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

**State-Specific Timing:**
- Gift icon (countdown): `2.5s`
- Hourglass (pending): `3s` (also rotates 180deg every 3s)
- Lock (pin-entry): `3s`
- Celebration (unlocked): `4s` with slight bounce

**Hourglass Flip:**
```typescript
const hourglassFlipVariants = {
  flip: {
    rotateX: [0, 180],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 2.2, // Every 3 seconds total
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
```

---

### Countdown Pulse
Continuous breathing on countdown boxes.

```typescript
const countdownPulseVariants = {
  normal: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  urgent: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 1.5, // Faster when urgent (< 1 hour)
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

**Glow Pulse (Synchronized):**
```typescript
const glowPulseVariants = {
  pulse: {
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

---

### Stars Drift
Slow upward-right drift to create sense of time passing.

```typescript
// Implemented in StarsBackground component
const starsDriftConfig = {
  layer1: {
    y: [0, -2000],
    duration: 50, // Desktop
    // duration: 60 // Mobile (slower for performance)
    ease: 'linear',
    repeat: Infinity
  },
  layer2: {
    y: [0, -2000],
    duration: 100, // 2x slower
    ease: 'linear',
    repeat: Infinity
  },
  layer3: {
    y: [0, -2000],
    duration: 150, // 3x slower
    ease: 'linear',
    repeat: Infinity
  }
}
```

**Direction:** Vertical upward (simulates rising, ascending, forward movement)

---

### Loading Spinner
Smooth rotation for loading state.

```typescript
const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}
```

**With Pulse:**
```typescript
const spinnerPulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

---

## Number Flip Animation (Countdown)

### Implementation Details
Airport-style flip when countdown number changes.

```typescript
const flipVariants = {
  // Top half flips up and fades
  exit: {
    rotateX: 90,
    opacity: 0,
    transformOrigin: "50% 100%", // Rotate from bottom edge
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] // easeIn
    }
  },
  // Bottom half comes from below
  enter: {
    rotateX: -90,
    opacity: 0,
    transformOrigin: "50% 0%", // Rotate from top edge
  },
  // Settles into place
  center: {
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] // easeOut
    }
  }
}
```

**Usage:**
```tsx
<AnimatePresence mode="wait">
  <motion.span
    key={currentValue}
    variants={flipVariants}
    initial="enter"
    animate="center"
    exit="exit"
    style={{ perspective: 1000 }}
  >
    {currentValue.toString().padStart(2, '0')}
  </motion.span>
</AnimatePresence>
```

**Perspective Settings:**
```css
.countdown-number {
  perspective: 1000px;
  transform-style: preserve-3d;
}
```

---

## Alert/Toast Animations

### Slide Down (Error Messages)
Appears from top, slides down into place.

```typescript
const alertSlideDownVariants = {
  initial: {
    opacity: 0,
    y: -20,
    height: 0
  },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}
```

**With Auto-Dismiss:**
```tsx
const [showAlert, setShowAlert] = useState(true)

useEffect(() => {
  const timeout = setTimeout(() => setShowAlert(false), 5000)
  return () => clearTimeout(timeout)
}, [])

<AnimatePresence>
  {showAlert && (
    <motion.div
      variants={alertSlideDownVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {errorMessage}
    </motion.div>
  )}
</AnimatePresence>
```

---

### Success Toast
Bounces in from bottom right.

```typescript
const successToastVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    x: 100,
    y: 100
  },
  animate: {
    opacity: 1,
    scale: [0.8, 1.1, 1],
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
}
```

---

## Loading States

### Skeleton Shimmer
While content is loading, show shimmering skeleton.

```typescript
const shimmerVariants = {
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}
```

**CSS:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
}
```

---

### Progressive Image Load
Blur to sharp transition for preview photos.

```typescript
const imageLoadVariants = {
  loading: {
    filter: 'blur(10px)',
    opacity: 0.6,
    scale: 1.05
  },
  loaded: {
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1]
    }
  }
}
```

**Implementation:**
```tsx
const [isLoaded, setIsLoaded] = useState(false)

<motion.img
  src={imageUrl}
  variants={imageLoadVariants}
  initial="loading"
  animate={isLoaded ? "loaded" : "loading"}
  onLoad={() => setIsLoaded(true)}
/>
```

---

## Scroll Animations (Unlocked State)

### Parallax Content
Subtle parallax effect on unlocked content (desktop only).

```typescript
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 300], [0, -50])

<motion.div style={{ y }}>
  <UnlockedContent />
</motion.div>
```

**Use Sparingly:** Only on hero content, not on entire page (causes motion sickness).

---

### Fade In on Scroll
Elements fade in as they enter viewport.

```typescript
const fadeInScrollVariants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1]
    }
  }
}
```

**Usage with viewport detection:**
```tsx
<motion.div
  variants={fadeInScrollVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  <Content />
</motion.div>
```

---

## Animation Orchestration Patterns

### Sequential Sequence
Run animations one after another.

```typescript
const sequence = async () => {
  await controls.start('step1')
  await controls.start('step2')
  await controls.start('step3')
}
```

---

### Parallel Animations
Run multiple animations simultaneously.

```typescript
const parallel = () => {
  controls.start('animation1')
  controls.start('animation2')
  controls.start('animation3')
}
```

---

### Staggered Children
Automatically stagger child animations.

```typescript
const parentVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

<motion.div variants={parentVariants} initial="initial" animate="animate">
  {items.map(item => (
    <motion.div key={item.id} variants={childVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Performance Optimization

### GPU Acceleration
Only animate transform and opacity.

```typescript
// ✅ Good (GPU accelerated)
const goodVariants = {
  animate: {
    x: 100,
    y: 50,
    scale: 1.2,
    rotate: 45,
    opacity: 0.5
  }
}

// ❌ Bad (CPU intensive)
const badVariants = {
  animate: {
    width: '200px',
    height: '100px',
    margin: '20px',
    padding: '10px',
    top: '50px',
    left: '100px'
  }
}
```

---

### will-change Management
Apply only during animation, remove when done.

```typescript
const [isAnimating, setIsAnimating] = useState(false)

<motion.div
  style={{ willChange: isAnimating ? 'transform, opacity' : 'auto' }}
  onAnimationStart={() => setIsAnimating(true)}
  onAnimationComplete={() => setIsAnimating(false)}
  animate={...}
/>
```

---

### Reduce Particle Count on Mobile
```typescript
const particleCount = useMediaQuery('(max-width: 767px)') ? 50 : 200
```

---

### Disable Expensive Animations on Slow Devices
```typescript
const slowConnection = navigator.connection?.effectiveType === '2g'
const enableHeavyAnimations = !slowConnection && !isMobile

{enableHeavyAnimations ? (
  <CelebrationEffect particleCount={200} />
) : (
  <SimpleCheckmark />
)}
```

---

## Reduced Motion Support

### Detection
```typescript
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()
```

---

### Fallback Patterns
```typescript
const variants = shouldReduceMotion
  ? {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } }
    }
  : {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0, 0, 0.2, 1] }
      }
    }
```

---

### Complete Disable for Critical Elements
```typescript
{shouldReduceMotion ? (
  <div className="opacity-100">{content}</div>
) : (
  <motion.div variants={complexAnimation}>{content}</motion.div>
)}
```

---

### Particles Completely Disabled
```typescript
{!shouldReduceMotion && <CelebrationEffect />}
```

---

## Easing Function Reference

### Standard Easings
```typescript
const easings = {
  easeOut: [0, 0, 0.2, 1],          // Decelerate (entrances)
  easeIn: [0.4, 0, 1, 1],           // Accelerate (exits)
  easeInOut: [0.4, 0, 0.2, 1],      // Smooth both ends (interactions)
  bounce: [0.34, 1.56, 0.64, 1],    // Playful overshoot (delight)
  linear: [0, 0, 1, 1]              // Constant speed (backgrounds)
}
```

---

### Spring Physics
```typescript
const springs = {
  default: { stiffness: 260, damping: 20 },
  gentle: { stiffness: 100, damping: 15 },
  bouncy: { stiffness: 400, damping: 10 },
  slow: { stiffness: 50, damping: 20 }
}
```

---

## Animation Testing Checklist

### Performance Targets
- [ ] All animations run at 60fps on iPhone 12 / Pixel 5
- [ ] No frame drops on state transitions
- [ ] Confetti doesn't cause lag on mobile
- [ ] Stars drift smoothly without stuttering

### Cross-Browser
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox
- [ ] Edge

### Accessibility
- [ ] `prefers-reduced-motion` respected
- [ ] No animations block functionality
- [ ] State changes announced to screen readers
- [ ] Keyboard navigation works during animations

### Edge Cases
- [ ] Very fast countdown (<10 seconds) doesn't break flip animation
- [ ] Multiple rapid PIN errors don't stack animations
- [ ] Slow network doesn't cause animation jank
- [ ] Tab switching (hidden) doesn't break continuous animations

---

## Key Animation Decisions

### 1. Bounce on Delight, Ease on Function
**Decision:** Use bounce easing for delight moments (icons, celebrations), smooth ease-out for functional transitions.
**Rationale:** Bounce feels playful and rewarding but can be distracting; reserve for emotional peaks.

### 2. Stagger Everything
**Decision:** All page loads use staggered children, never instant appearance.
**Rationale:** Creates hierarchy, guides eye, feels polished. Timing (80ms gaps) is fast enough not to annoy.

### 3. Dark-to-Light Happens Last
**Decision:** Background transition is final step in unlock sequence (after confetti, lock transform, content fade).
**Rationale:** Background change is jarring; delay until user is focused on content, creates dramatic reveal.

### 4. Overlap Transitions
**Decision:** Exit and enter animations overlap by 200ms (crossfade).
**Rationale:** Prevents blank frames, feels smoother, maintains continuity.

### 5. Mobile Gets Simpler Physics
**Decision:** Reduce particle count, disable parallax, slower star drift on mobile.
**Rationale:** 60fps is non-negotiable; users won't miss details on small screens.

---

This animation library provides all timing, easing, and orchestration patterns needed to implement the countdown page with smooth, purposeful, delightful motion that enhances (not distracts from) the core experience.
