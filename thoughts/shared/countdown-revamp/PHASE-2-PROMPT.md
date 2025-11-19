# PHASE 2: UI Design & Component Specification

**Agents**: ui-designer + brand-guardian (run in parallel)
**Goal**: Create detailed design specs and component APIs ready for implementation

---

## Context

Read these files first:
1. `thoughts/shared/countdown-revamp/01-ux-research.md` - User journey & insights
2. `thoughts/shared/countdown-revamp/02-ux-layout-specs.md` - Layout specs
3. `frontend/src/pages/Home.tsx` - Design language reference
4. `frontend/src/components/animate-ui/components/backgrounds/stars.tsx` - StarsBackground component
5. `frontend/src/components/ui/line-shadow-text.tsx` - LineShadowText component

---

## ui-designer Tasks

### Task 1: Design System Tokens

Create a design system file defining:

**Colors**:
```typescript
// Dark theme (matching hero)
background: {
  primary: '#000000',
  gradient: 'radial-gradient(ellipse at bottom, #262626 0%, #000 100%)',
  card: 'rgba(255, 255, 255, 0.05)', // Glass morphism
}
text: {
  primary: '#ffffff',
  secondary: 'rgba(255, 255, 255, 0.9)',
  muted: 'rgba(255, 255, 255, 0.6)',
}
accent: {
  glow: '#ffffff',
  shadow: 'rgba(255, 255, 255, 0.2)',
}
// Light theme (unlocked state)
[Define light palette]
```

**Typography**:
```typescript
// Matching Home.tsx hero scale
heading: {
  h1: '3rem', // Mobile: 2rem
  h2: '2.5rem', // Mobile: 1.75rem
  weight: 700,
  lineHeight: 1.2,
}
body: {
  large: '1.25rem',
  base: '1rem',
  small: '0.875rem',
}
```

**Spacing**:
```typescript
// 8px base unit
spacing: {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  xxl: '4rem',    // 64px
}
```

**Effects**:
```typescript
shadow: {
  sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
  md: '0 4px 16px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(255, 255, 255, 0.3)',
}
borderRadius: {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
}
```

**Animation Curves**:
```typescript
easing: {
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}
duration: {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  verySlow: '800ms',
}
```

### Task 2: Component Specifications

For each component to be built, define:

#### CapsuleBackground
```typescript
// Purpose: Wrapper for StarsBackground with state-aware styling
interface CapsuleBackgroundProps {
  state: 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked';
  children: React.ReactNode;
}

// Visual specs:
- loading: Full stars, dark background
- countdown: Full stars, dark background
- pending: Full stars, dark background
- pin-entry: Full stars, dark background, slight glow
- unlocked: Fade stars, transition to light background (1s)

// Responsive: Mobile should reduce star count for performance
```

#### AnimatedCountdown
```typescript
// Purpose: Enhanced countdown with flip animations
interface AnimatedCountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

// Visual specs:
- Each time unit: 80x80px card on mobile, 100x100px on desktop
- Cards have subtle glow effect
- Numbers flip when changing (300ms)
- Pulsing glow intensifies as time approaches (last hour)
- Sparkle particles around boxes (subtle)

// Animations:
- Number change: Flip animation (rotateX)
- Approaching: Pulse scale 1.0 → 1.05 every 2s
- Complete: Confetti burst
```

#### UnlockAnimation
```typescript
// Purpose: Lock → Unlock transition for pin-entry state
interface UnlockAnimationProps {
  state: 'locked' | 'unlocking' | 'unlocked';
}

// Visual specs:
- locked: Padlock icon (64px), subtle breathing
- unlocking: Shake, then unlock (500ms)
- unlocked: Explode into confetti

// Animation sequence:
1. Shake (200ms, ±3px)
2. Lock opens (300ms, rotate shackle)
3. Confetti burst (1s, fade out)
```

#### CelebrationEffect
```typescript
// Purpose: Reusable particle system for celebrations
interface CelebrationEffectProps {
  trigger: boolean;
  particleCount?: number; // default 50
  colors?: string[]; // default white/gold
  duration?: number; // default 3000ms
}

// Visual specs:
- Particles spawn from center
- Gravity effect (fall down)
- Fade out after 2s
- Auto-cleanup after duration
```

#### CapsuleCard
```typescript
// Purpose: Animated card wrapper with hover states
interface CapsuleCardProps {
  variant?: 'glass' | 'solid';
  glow?: boolean;
  children: React.ReactNode;
}

// Visual specs:
- glass: rgba(255,255,255,0.05), backdrop-blur
- solid: white bg, shadow
- glow: Subtle white shadow on hover
- Hover: Lift 4px, increase shadow
```

### Task 3: State-by-State Design

For each state, define complete visual composition:

**Example for Countdown State**:
```markdown
## Countdown State Design

### Visual Hierarchy (top to bottom)
1. Gift emoji (64px) - animated pulse
2. Capsule title (h1) - LineShadowText effect on title
3. Sender name (text-lg, muted) - fade in 200ms after title
4. Preview photo (if exists) - scale-in animation, hover effect
5. Preview message (if exists) - fade in 300ms
6. Countdown timer - enter with stagger
7. Metadata (unlock date) - fade in last

### Spacing
- Gift to title: 24px
- Title to sender: 16px
- Sender to preview: 32px
- Preview to countdown: 48px
- Countdown to metadata: 32px

### Animations
- Entrance: Sequential fade + slide up
- Gift icon: Continuous pulse (2s cycle)
- Preview photo hover: Scale 1.05, shadow increase
- Countdown: Flip on change

### Colors
- Background: StarsBackground
- Title: white (LineShadowText)
- Sender: white/90
- Card: glass morphism
```

[Create similar specs for all 5 states]

---

## brand-guardian Tasks

### Task 1: Brand Consistency Check

Review ui-designer outputs and verify:

**Visual Consistency**:
- [ ] Colors match Home.tsx hero palette
- [ ] Typography scale aligns
- [ ] Animation style feels cohesive
- [ ] Spacing rhythm consistent

**Brand Voice**:
- [ ] Animations feel "magical" not "gimmicky"
- [ ] Delight moments are subtle, not overwhelming
- [ ] Loading states maintain anticipation
- [ ] Error states are friendly, not harsh

### Task 2: Delight Guidelines

Define specific "brand moments":

**When to use LineShadowText**:
- Capsule title in countdown state
- "Unlocked!" message in pin-entry success

**When to use particles/confetti**:
- PIN verified successfully
- Countdown reaches zero
- (NOT on every interaction)

**Color Palette Boundaries**:
- Primary: Black/white (high contrast)
- Accents: Subtle glows, no bright colors
- Transitions: Smooth, never jarring

**Animation Philosophy**:
- Entrances: Welcoming, not flashy (300-500ms)
- Exits: Quick, graceful (200ms)
- Idle: Breathing, pulsing (slow, 2-4s cycles)
- Interactions: Responsive, immediate (<100ms)

### Task 3: Mobile Experience

Define mobile-specific brand guidelines:

**Performance**:
- Reduce particle count on mobile (50 → 20)
- Simplify star background (fewer stars)
- Disable complex animations on `prefers-reduced-motion`

**Touch Interactions**:
- Tap states should be delightful (scale feedback)
- Loading states should feel fast
- Swipe-friendly spacing

**Visual Adjustments**:
- Larger typography for readability
- More spacing between interactive elements
- Simplified hover effects (use focus instead)

---

## Deliverables

### File 1: `03-design-system.md`

```markdown
# Design System - Countdown Page

## Color Tokens
[Complete color definitions]

## Typography
[Scale, weights, line heights]

## Spacing
[8px grid system]

## Effects
[Shadows, glows, borders]

## Animation Curves
[Easing functions, durations]

## Responsive Breakpoints
[Mobile, tablet, desktop specs]
```

### File 2: `04-component-specs.md`

```markdown
# Component Specifications

## CapsuleBackground
[Props, visual specs, responsive behavior]

## AnimatedCountdown
[Props, animation details, state changes]

## UnlockAnimation
[Animation sequence, timing]

## CelebrationEffect
[Particle system specs]

## CapsuleCard
[Variants, hover states]

[Include code snippets for complex animations]
```

### File 3: `05-animation-library.md`

```markdown
# Animation Library

## Entrance Animations

### Fade Slide Up
- Duration: 500ms
- Easing: easeOut
- Transform: translateY(20px) → 0
- Opacity: 0 → 1

[Define all animation types used]

## State Transition Animations

### Countdown → Pin Entry
1. Countdown fades out (300ms)
2. Lock icon fades in (200ms, delay 100ms)
3. PIN inputs appear (300ms, stagger 50ms)

[Define all state transitions]

## Micro-Interactions

### Button Hover
- Scale: 1 → 1.05
- Shadow: md → lg
- Duration: 150ms
- Easing: easeOut

[Define all micro-interactions]
```

---

## Success Criteria

- [ ] Complete design system tokens defined
- [ ] All 5 components fully specified
- [ ] State-by-state visual composition documented
- [ ] Brand consistency verified
- [ ] Mobile optimizations specified
- [ ] Animation library comprehensive

---

## Save Instructions

Save to:
- `thoughts/shared/countdown-revamp/03-design-system.md`
- `thoughts/shared/countdown-revamp/04-component-specs.md`
- `thoughts/shared/countdown-revamp/05-animation-library.md`

Then update `thoughts/shared/countdown-revamp/07-handoff.md`:
```markdown
## Phase 2: UI Design & Component Specification ✅ COMPLETE

**Completed**: [Date]

**Deliverables**:
- [x] 03-design-system.md
- [x] 04-component-specs.md
- [x] 05-animation-library.md

**Key Design Decisions**:
[Bullet points of 3-5 important decisions]

**Brand Approval**: ✅ brand-guardian verified consistency

**Next Steps**:
Phase 3 frontend-developer should implement per these specs.
```

---

## Important Notes

- Use Home.tsx hero as design north star
- Every animation should have a purpose (don't animate for sake of it)
- Mobile performance is critical (reduce complexity if needed)
- Accessibility is non-negotiable (reduced motion, screen readers)
- When in doubt, be subtle

---

**Ready to design? Start by extracting tokens from Home.tsx hero section.**
