# PHASE 3: Frontend Development & Implementation

**Agents**: frontend-developer → whimsy-injector (sequential)
**Goal**: Implement all components and refactor Open.tsx per design specs

---

## Context

Read these files in order:
1. `thoughts/shared/countdown-revamp/01-ux-research.md`
2. `thoughts/shared/countdown-revamp/02-ux-layout-specs.md`
3. `thoughts/shared/countdown-revamp/03-design-system.md`
4. `thoughts/shared/countdown-revamp/04-component-specs.md`
5. `thoughts/shared/countdown-revamp/05-animation-library.md`
6. `frontend/src/pages/Open.tsx` - Current implementation (PRESERVE ALL FUNCTIONALITY)

---

## frontend-developer Tasks

### Pre-Implementation

**Directory Setup**:
```bash
mkdir -p frontend/src/components/capsule
```

**Verify Dependencies** (should already exist):
- framer-motion (motion/react)
- lucide-react
- @/components/ui/* (shadcn)
- @/components/animate-ui/components/backgrounds/stars

### Task 1: Build CapsuleBackground Component

**File**: `frontend/src/components/capsule/CapsuleBackground.tsx`

**Requirements** (from 04-component-specs.md):
- Wraps StarsBackground
- Accepts `state` prop to adjust appearance
- Transitions smoothly between states
- Reduces star count on mobile

**Implementation Checklist**:
- [ ] TypeScript interface matches spec
- [ ] State-based background switching
- [ ] Mobile detection for performance
- [ ] Smooth transitions (1s fade)
- [ ] Children render properly

**Example Structure**:
```tsx
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { motion, AnimatePresence } from 'motion/react';

interface CapsuleBackgroundProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked';
  children: React.ReactNode;
}

export function CapsuleBackground({ state, children }: CapsuleBackgroundProps) {
  // Detect mobile for performance
  // Render StarsBackground for dark states
  // Render light background for unlocked state
  // Transition smoothly
}
```

### Task 2: Build AnimatedCountdown Component

**File**: `frontend/src/components/capsule/AnimatedCountdown.tsx`

**Requirements**:
- Replace existing Countdown component
- Flip animation when numbers change
- Pulsing glow as time approaches
- Confetti on completion
- Responsive sizing

**Implementation Checklist**:
- [ ] Interface matches original Countdown
- [ ] Flip animation on number change (rotateX)
- [ ] Pulsing effect (motion.div with animate prop)
- [ ] Confetti trigger on zero
- [ ] Mobile-optimized sizes
- [ ] Accessibility: announce changes to screen readers

**Animation Details** (from 05-animation-library.md):
- Flip: 300ms, easeOut
- Pulse: 2s cycle, scale 1.0 → 1.05
- Approaching glow: opacity 0.5 → 1.0 (last hour)

### Task 3: Build UnlockAnimation Component

**File**: `frontend/src/components/capsule/UnlockAnimation.tsx`

**Requirements**:
- Lock → Unlock transition
- Used in pin-entry state
- Shake on incorrect PIN
- Celebration on correct PIN

**Implementation Checklist**:
- [ ] SVG lock icon (can use lucide-react Lock/Unlock)
- [ ] Breathing animation (idle state)
- [ ] Shake animation (error)
- [ ] Unlock animation (success)
- [ ] Confetti integration

**Animation Sequence**:
1. Shake: 200ms, ±3px horizontal
2. Unlock: 300ms, rotate shackle 45deg
3. Confetti: trigger CelebrationEffect

### Task 4: Build CelebrationEffect Component

**File**: `frontend/src/components/capsule/CelebrationEffect.tsx`

**Requirements**:
- Reusable particle system
- Configurable count, colors, duration
- Auto-cleanup
- Performance-optimized

**Implementation Checklist**:
- [ ] Canvas-based or CSS particles
- [ ] Gravity effect
- [ ] Fade out after 2s
- [ ] Cleanup on unmount
- [ ] Respects prefers-reduced-motion

**Consider using**: `react-confetti` library or custom CSS animation

### Task 5: Build CapsuleCard Component

**File**: `frontend/src/components/capsule/CapsuleCard.tsx`

**Requirements**:
- Glass morphism variant
- Solid variant
- Optional glow effect
- Hover animations

**Implementation Checklist**:
- [ ] Variant prop ('glass' | 'solid')
- [ ] Glow prop (boolean)
- [ ] Hover: lift + shadow increase
- [ ] Mobile: reduced hover effects
- [ ] Proper backdrop-blur for glass

### Task 6: Refactor Open.tsx

**File**: `frontend/src/pages/Open.tsx` (REFACTOR, DON'T REWRITE)

**Critical**: PRESERVE ALL EXISTING FUNCTIONALITY
- All state logic must remain identical
- API calls unchanged
- Error handling unchanged
- PIN verification flow unchanged

**Changes to Make**:

#### Imports
```tsx
import { CapsuleBackground } from '@/components/capsule/CapsuleBackground';
import { AnimatedCountdown } from '@/components/capsule/AnimatedCountdown';
import { UnlockAnimation } from '@/components/capsule/UnlockAnimation';
import { CelebrationEffect } from '@/components/capsule/CelebrationEffect';
import { CapsuleCard } from '@/components/capsule/CapsuleCard';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import { motion, AnimatePresence } from 'motion/react';
```

#### Wrap Each State Return

**Loading State** (lines 100-108):
```tsx
return (
  <CapsuleBackground state="loading">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-16"
    >
      {/* existing loading content */}
    </motion.div>
  </CapsuleBackground>
);
```

**Countdown State** (lines 158-202):
```tsx
return (
  <CapsuleBackground state="countdown">
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <CapsuleCard variant="glass" glow>
          <CardContent className="pt-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-6">🎁</div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-4">
              <LineShadowText shadowColor="white">
                {capsule.title}
              </LineShadowText>
            </h1>

            {/* Replace Countdown with AnimatedCountdown */}
            <AnimatedCountdown
              targetDate={new Date(capsule.unlockAt * 1000)}
              onComplete={loadCapsule}
            />

            {/* Rest of countdown state content */}
          </CardContent>
        </CapsuleCard>
      </div>
    </div>
  </CapsuleBackground>
);
```

**Pin Entry State** (lines 205-254):
```tsx
return (
  <CapsuleBackground state="pin-entry">
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <CapsuleCard variant="glass" glow>
          <CardContent className="pt-6 text-center">
            <UnlockAnimation state={pinError ? 'locked' : 'unlocking'} />

            {/* Existing pin entry content */}
          </CardContent>
        </CapsuleCard>
      </div>
    </div>
  </CapsuleBackground>
);
```

**Unlocked State** (lines 257-313):
```tsx
return (
  <>
    <CelebrationEffect trigger={true} />
    <CapsuleBackground state="unlocked">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16"
      >
        {/* Existing unlocked content */}
      </motion.div>
    </CapsuleBackground>
  </>
);
```

**Refactor Checklist**:
- [ ] All states wrapped with CapsuleBackground
- [ ] Countdown → AnimatedCountdown
- [ ] LineShadowText on titles
- [ ] CapsuleCard wrapping content
- [ ] Motion entrance animations
- [ ] All functionality preserved
- [ ] No TypeScript errors
- [ ] No runtime errors

### Task 7: Mobile Optimization

**Test on viewports**:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1440px

**Optimizations**:
```tsx
// Detect mobile for performance
const isMobile = window.innerWidth < 768;

// Reduce particle count
<CelebrationEffect particleCount={isMobile ? 20 : 50} />

// Simplify animations
{!isMobile && <ComplexAnimation />}

// Respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

**Mobile Checklist**:
- [ ] Touch targets ≥ 44px
- [ ] Typography scales appropriately
- [ ] Animations smooth (60fps)
- [ ] No horizontal scroll
- [ ] Star count reduced

### Task 8: Testing

**Manual Tests**:

Navigate to: `http://localhost:5178/open?t=mOJluod4gJNwk2OoBEx1NQ`

Test all states:
1. **Loading**: Refresh page, verify smooth load
2. **Countdown**: Check timer animations, preview content
3. **Pin Entry**: Enter wrong PIN (shake), enter correct PIN: 9234 (unlock + confetti)
4. **Unlocked**: Verify content displays, celebration effect

**Browser Testing**:
- [ ] Chrome (desktop + mobile devtools)
- [ ] Firefox
- [ ] Safari (if possible)

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Screen reader announces state changes
- [ ] Reduced motion respected

**Performance**:
```bash
# Run Lighthouse audit
- Performance score ≥ 90
- No layout shift
- First Contentful Paint < 1.5s
```

---

## whimsy-injector Tasks

**Run AFTER frontend-developer completes implementation**

### Task 1: Audit for Delight Opportunities

Review the implemented Open.tsx and components. Look for:

**Micro-Interactions to Add**:
- [ ] Preview photo: Add subtle zoom on hover (1.02x)
- [ ] PIN input: Sparkle on focus
- [ ] Sender name: Gentle fade-in with delay
- [ ] Metadata: Subtle slide-up entrance

**Hidden Easter Eggs** (Subtle!):
- [ ] Click gift emoji 5 times → mini confetti burst
- [ ] Hold shift while page loads → extra stars
- [ ] Konami code → special animation?

**Polish Animation Timing**:
- [ ] Review all entrance animations
- [ ] Ensure stagger delays feel natural
- [ ] Adjust easing if needed
- [ ] Test flow from state to state

### Task 2: Error State Personality

Make error states friendly:

**Error State** (lines 111-125):
```tsx
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: 'spring', damping: 10 }}
>
  <div className="text-6xl mb-4">❌</div>
</motion.div>

<motion.h2
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  Oops! Capsule Not Found
</motion.h2>
```

**PIN Error**:
```tsx
// Add gentle shake to entire card on wrong PIN
{pinError && (
  <motion.div
    animate={{ x: [-10, 10, -10, 10, 0] }}
    transition={{ duration: 0.5 }}
  >
    {/* PIN input */}
  </motion.div>
)}
```

### Task 3: Final Polish

**Checklist**:
- [ ] All animations feel smooth
- [ ] No jarring transitions
- [ ] Loading states feel fast (even if slow network)
- [ ] Success states feel celebratory
- [ ] Error states feel friendly
- [ ] Mobile taps feel responsive

---

## Deliverables

### File: `06-implementation-checklist.md`

```markdown
# Implementation Checklist

## Components Built ✅
- [x] CapsuleBackground.tsx
- [x] AnimatedCountdown.tsx
- [x] UnlockAnimation.tsx
- [x] CelebrationEffect.tsx
- [x] CapsuleCard.tsx

## Open.tsx Refactored ✅
- [x] All states wrapped
- [x] Components integrated
- [x] Functionality preserved

## Testing ✅
- [x] All 5 states work
- [x] Animations smooth
- [x] Mobile optimized
- [x] Accessibility passes

## Whimsy Added ✅
- [x] Micro-interactions polished
- [x] Easter eggs added
- [x] Error states friendly
- [x] Final polish complete

## Known Issues
[List any bugs or limitations]

## Performance Notes
- Mobile: [FPS, load time]
- Desktop: [FPS, load time]
- Lighthouse score: [X/100]

## Browser Compatibility
- Chrome: ✅
- Firefox: ✅
- Safari: [✅ / ⚠️ / ❌]
- Mobile Safari: [✅ / ⚠️ / ❌]
```

---

## Success Criteria

- [ ] All components implemented per spec
- [ ] Open.tsx refactored with functionality preserved
- [ ] Mobile experience polished
- [ ] Accessibility requirements met
- [ ] Browser compatibility verified
- [ ] Whimsy and delight added
- [ ] "Wow" factor achieved

---

## Save Instructions

Save to:
- `frontend/src/components/capsule/*.tsx` (5 new components)
- `frontend/src/pages/Open.tsx` (refactored)
- `thoughts/shared/countdown-revamp/06-implementation-checklist.md`

Update `thoughts/shared/countdown-revamp/07-handoff.md`:
```markdown
## Phase 3: Frontend Development ✅ COMPLETE

**Completed**: [Date]

**Components Created**:
- [x] CapsuleBackground
- [x] AnimatedCountdown
- [x] UnlockAnimation
- [x] CelebrationEffect
- [x] CapsuleCard

**Open.tsx**: ✅ Refactored

**Testing**: ✅ Passed
- Browser compatibility: Chrome, Firefox, Safari
- Mobile optimized: 60fps
- Accessibility: Reduced motion, screen readers
- Performance: Lighthouse 90+

**Whimsy**: ✅ Added
- Micro-interactions polished
- Easter eggs subtle
- Error states friendly

## 🎉 PROJECT COMPLETE

### Demo
URL: http://localhost:5178/open?t=mOJluod4gJNwk2OoBEx1NQ
PIN: 9234

### Ready for Review
- [ ] Code review requested
- [ ] QA testing scheduled
- [ ] Merge to main pending approval
```

---

## Important Notes

- **PRESERVE FUNCTIONALITY**: Every API call, state transition, error handling MUST work identically
- **TypeScript**: Use strict typing
- **Performance**: Mobile is critical - reduce complexity if needed
- **Accessibility**: Non-negotiable
- **When stuck**: Refer back to design specs in files 03-05

---

**Ready to code? Start with CapsuleBackground component, then AnimatedCountdown, then Open.tsx refactor.**
