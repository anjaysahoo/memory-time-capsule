# Design File Augmentations - Brand Guidelines

## Purpose
These sections should be added to the design system files to provide clear brand guidelines for implementation.

---

## Augmentation 1: Add to 03-design-system.md

**Location**: After line 510 (after "## Mobile Performance Optimizations" section)
**Insert**:

```markdown
---

## Brand Usage Guidelines

### LineShadowText Component Usage

The `LineShadowText` component is a signature brand element that must be used sparingly to maintain impact.

#### When to Use
```tsx
// ✅ APPROVED: Main capsule title on countdown state
<h1>
  <LineShadowText className="italic" shadowColor="white">
    {capsule.title}
  </LineShadowText>
</h1>

// ✅ APPROVED: Hero moments (H1-level emphasis only)
<LineShadowText shadowColor="white">
  Time Capsule Unlocked
</LineShadowText>
```

#### When NOT to Use
```tsx
// ❌ NEVER: Sender names (too subtle for emphasis)
<p>From <LineShadowText>{sender}</LineShadowText></p>

// ❌ NEVER: Body text (overwhelming, illegible)
<p><LineShadowText>This is a message...</LineShadowText></p>

// ❌ NEVER: Multiple times per state (dilutes impact)
<LineShadowText>Title</LineShadowText>
<LineShadowText>Subtitle</LineShadowText>

// ❌ NEVER: Small text (caption, labels - illegible)
<span className="text-xs">
  <LineShadowText>Days</LineShadowText>
</span>
```

#### Usage Rules
1. **Maximum once per page state** (only the primary headline)
2. **H1-level headlines only** (32px+ font size)
3. **Always italic** for emphasis differentiation
4. **Correct shadow color**:
   - White shadow on dark backgrounds
   - Black shadow on light backgrounds (unlocked state)
5. **Must be readable without effect** (accessibility requirement)

#### Current Countdown Page Usage
- **Countdown state**: Capsule title ✅
- **Pending state**: Regular text (no emphasis needed)
- **PIN entry**: Regular bold text (confetti provides emphasis)
- **Unlocked state**: Consider for title with black shadow

---

### Particle & Confetti Guidelines

Particles and confetti are **rewards for patience**, not decorations. They must be used exclusively for celebration moments.

#### Approved Use Cases

**1. Unlock Celebration** (PIN success → unlocked state)
```tsx
<CelebrationEffect
  trigger={isUnlocked}
  particleCount={isMobile ? 50 : 200}
  duration={isMobile ? 2000 : 3000}
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']}
  onComplete={() => setShowConfetti(false)}
/>
```
- **Desktop**: 200 particles, 3000ms duration
- **Mobile**: 50 particles, 2000ms duration
- **Colors**: 6-color palette (only time we break black/white)
- **Physics**: Gravity-based, realistic motion
- **Cleanup**: Auto-remove from DOM after completion

**2. Pending → PIN Entry Transition** (brief burst)
```tsx
<CelebrationEffect
  trigger={pinReady}
  particleCount={50}
  duration={1000}
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']} // Subset of confetti colors
/>
```
- **All devices**: 50 particles
- **Duration**: 1000ms (quick celebration)
- **Purpose**: Celebrates PIN arrival, not overwhelming

#### When NOT to Use
```tsx
// ❌ NEVER: Page load decoration
useEffect(() => {
  setShowParticles(true) // NO - no reward yet
}, [])

// ❌ NEVER: Background ambiance (stars are sufficient)
<ParticleBackground /> // NO - we have StarsBackground

// ❌ NEVER: Error states (inappropriate mood)
if (incorrectPIN) {
  setShowConfetti(true) // NO - wrong emotional tone
}

// ❌ NEVER: Continuously (must clear)
<CelebrationEffect trigger={true} duration={Infinity} /> // NO
```

#### Performance Requirements
```typescript
// Mobile: Reduce complexity for 60fps
const mobileParticles = {
  count: 50,
  size: 6-10, // Smaller particles
  physics: "simplified", // Linear motion, less calculation
  duration: 2000 // Shorter lifecycle
}

// Desktop: Full experience
const desktopParticles = {
  count: 200,
  size: 6-12,
  physics: "full", // Gravity, velocity, rotation
  duration: 3000
}

// Reduced Motion: Complete disable
const reducedMotionParticles = {
  particles: 0,
  fallback: <CheckCircleIcon className="text-success" /> // Static success
}
```

#### Color Justification
**Why we break the black/white palette**:
- Confetti is a **3-second celebration moment**, not persistent UI
- Colors represent **joy and reward** (earned through waiting)
- Brief duration (3s) prevents color becoming part of brand
- Only appears after **patience is rewarded** (unlock moment)
- Immediately **clears** - doesn't linger in interface

**Why these specific colors**:
- High saturation (celebratory, not muted)
- Diverse hues (rainbow effect for joy)
- Good contrast on both dark and light backgrounds
- Industry-standard celebration palette

---

### Color Palette Boundaries

#### Strict Adherence Rules
```css
/* ALL TEXT */
color: #FFFFFF; /* Pure white */
color: rgba(255, 255, 255, 0.90); /* Secondary */
color: rgba(255, 255, 255, 0.80); /* Muted */
color: rgba(255, 255, 255, 0.70); /* Subtle */

/* On light backgrounds (unlocked state) */
color: #000000; /* Pure black */
color: rgba(0, 0, 0, 0.90); /* Secondary */
color: rgba(0, 0, 0, 0.60); /* Muted */

/* ALL BACKGROUNDS */
background: #000000; /* Pure black */
background: radial-gradient(ellipse at bottom, #262626 0%, #000 100%);
background: #FFFFFF; /* Pure white (unlocked) */
background: rgba(0, 0, 0, 0.80); /* Semi-transparent cards */
background: rgba(255, 255, 255, 0.10); /* Muted backgrounds */

/* ALL BORDERS */
border-color: rgba(255, 255, 255, 0.10); /* Subtle */
border-color: rgba(255, 255, 255, 0.20); /* Default */
border-color: rgba(255, 255, 255, 1.0); /* Focus */
```

#### Approved Exceptions
```css
/* FUNCTIONAL UI ONLY */
--success: #10B981; /* PIN success, unlock confirmation */
--error: #EF4444; /* PIN error, validation failure */
--warning: #F59E0B; /* Urgency state (countdown < 1hr) */

/* CELEBRATION ONLY (3s duration) */
--confetti-1: #FF6B6B;
--confetti-2: #4ECDC4;
--confetti-3: #45B7D1;
--confetti-4: #FFA07A;
--confetti-5: #98D8C8;
--confetti-6: #F7DC6F;
```

#### NEVER Use
```css
/* ❌ Gray colors (use white/black with opacity instead) */
color: #808080; /* NO */
color: #CCCCCC; /* NO */
background: #F5F5F5; /* NO - use rgba(255,255,255,0.XX) */

/* ❌ Random brand colors */
color: #3B82F6; /* Blue - NO */
color: #8B5CF6; /* Purple - NO */
color: #F59E0B; /* Orange (except warning state) - NO */

/* ❌ Multiple colored elements simultaneously */
<Card className="bg-blue-500"> {/* NO */}
  <Badge className="bg-green-500" /> {/* NO */}
</Card>

/* ✅ EXCEPTION: Confetti burst only */
<CelebrationEffect /> {/* YES - brief, then cleared */}
```

---

### Animation Philosophy: Magical vs Gimmicky

#### What Makes It Magical ✨
```typescript
// Serves emotional journey
const magicalAnimation = {
  purpose: "Builds anticipation or celebrates reward",
  timing: "Subtle (2-3s cycles), not aggressive",
  complexity: "Simple motion, elegant execution",
  performance: "60fps on mid-range devices",
  duration: "Brief or continuous-subtle, not blocking"
}

// Examples:
- Countdown flip: Tangible time passing (functional magic)
- Stars drift: Sense of time, imperceptible (ambient magic)
- Unlock confetti: Earned reward, brief celebration (peak magic)
- Icon breathing: Adds life, doesn't distract (subtle magic)
```

#### What Makes It Gimmicky 🚫
```typescript
// Lacks purpose or blocks experience
const gimmickyAnimation = {
  purpose: "Decoration without meaning",
  timing: "Aggressive (< 1s cycles) or perpetual blocking",
  complexity: "Excessive effects, trying too hard",
  performance: "Janky on mobile, frame drops visible",
  duration: "Never-ending or blocks interaction"
}

// Examples to AVOID:
❌ Rainbow background gradients cycling
❌ Excessive particles (>200 desktop, >50 mobile)
❌ Violent shakes on errors (>10px displacement)
❌ Auto-playing videos with sound
❌ Infinite zoom/rotate loops
❌ Multiple animations fighting for attention
```

#### Decision Framework
```
Ask before adding any animation:

1. Does it serve the emotional journey? (anticipation → joy)
   YES = Potential ✅ | NO = Skip ❌

2. Does it communicate state or change?
   YES = Functional ✅ | NO = Continue to #3

3. Does it run at 60fps on iPhone 12?
   YES = Continue | NO = Simplify or skip ❌

4. Does it respect reduced motion preferences?
   YES = Continue | NO = Add fallback or skip ❌

5. Does it clear/complete within 3 seconds?
   YES (or continuous-subtle) = Delight ✅ | NO = Gimmick ❌

RESULT:
- 4-5 YES = Delight ✅ Ship it
- 2-3 YES = Functional ✅ Ship it
- 0-1 YES = Gimmick ❌ Remove it
```

---

### Mobile Performance Standards (Non-Negotiable)

#### Mandatory Requirements
- **Frame rate**: 60fps sustained on iPhone 12 / Pixel 5
- **No janky animations**: Frame drops destroy quality perception
- **Battery conscious**: Minimize GPU usage (transform/opacity only)
- **Fast loading**: < 3s on 3G connection
- **No horizontal scroll**: At any zoom level (100%-200%)

#### Mobile Simplification Strategy
```typescript
// REDUCE COMPLEXITY, NEVER QUALITY
const mobileOptimizations = {
  stars: {
    count: 500, // vs 1000 desktop
    duration: 60, // vs 50 (slower = less CPU)
    parallax: false // Disabled on mobile
  },
  confetti: {
    particles: 50, // vs 200 desktop
    duration: 2000, // vs 3000 (shorter)
    physics: "simplified" // Linear vs spring
  },
  animations: {
    easing: "linear", // vs spring (less calculation)
    glowLayers: 1, // vs 3 desktop
    shadows: "single" // vs multiple layers
  }
}

// NEVER COMPROMISE (Brand Essentials)
const brandEssentials = {
  colors: "Same black/white palette",
  typography: "Same scale (proportionally smaller)",
  countdownFlip: "Must animate smoothly (core feature)",
  starsBackground: "Must be present (signature)",
  unlockCelebration: "Must feel special (emotional peak)"
}
```

#### Performance Budget
```
INITIAL LOAD:
- HTML/CSS/JS: < 500KB gzipped
- Fonts: 0 KB (system fonts only)
- Images: Lazy loaded, progressive

RUNTIME:
- Idle CPU: < 5%
- Animating CPU: < 30%
- Memory: < 50MB total
- Frame rate: 60fps sustained (no drops)

NETWORK:
- API calls: Cached aggressively
- Images: WebP with JPEG fallback
- Videos: Streamed, not preloaded
```

#### Testing Requirements
```bash
# Device Coverage
- iPhone SE (smallest modern iOS)
- iPhone 12 (mid-range target)
- Pixel 5 (mid-range Android)
- Samsung Galaxy S20 (coverage)

# Performance Testing
- Chrome DevTools: CPU 4× throttle
- Network: Throttle to "Fast 3G"
- Lighthouse: Performance score > 90
- Frame rate: Monitor for 60fps sustained
```

---

### Loading State Philosophy

**Principle**: Loading should maintain mystery and anticipation, not create frustration.

#### Loading Sequence
```typescript
// Progressive disclosure (avoid blank screen flash)
const loadingSequence = {
  "0ms": "Blank screen (acceptable, fast loads common)",
  "400ms": "Stars fade in (background only, no spinner yet)",
  "800ms": "Spinner appears (64px gift box icon)",
  "1000ms": "Text fades in ('Preparing your capsule...')"
}

// Implementation
const [loadingStage, setLoadingStage] = useState(0)

useEffect(() => {
  const timers = [
    setTimeout(() => setLoadingStage(1), 400),  // Stars
    setTimeout(() => setLoadingStage(2), 800),  // Spinner
    setTimeout(() => setLoadingStage(3), 1000), // Text
  ]
  return () => timers.forEach(clearTimeout)
}, [])
```

#### Brand-Aligned Loading States
```tsx
// ✅ APPROVED: Mysterious, brand-aligned
<StarsBackground starColor="#fff">
  {loadingStage >= 2 && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <GiftIcon className="w-16 h-16 animate-pulse" />
    </motion.div>
  )}
  {loadingStage >= 3 && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      className="text-white/70 text-sm mt-4"
    >
      Preparing your capsule...
    </motion.p>
  )}
</StarsBackground>

// ❌ AVOID: Generic, breaks brand
<div className="bg-white flex items-center justify-center">
  <Spinner className="w-8 h-8" /> {/* Generic spinner */}
  <p>Loading...</p> {/* Too technical */}
  <ProgressBar value={progress} /> {/* Breaks anticipation */}
</div>
```

#### Spinner Design
```typescript
// Gift box icon (brand-aligned, not generic circle)
const LoadingSpinner = () => (
  <motion.div
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Gift className="w-16 h-16 text-white" />
  </motion.div>
)

// NOT a generic spinner
<svg className="animate-spin">...</svg> // ❌ NO
```

---

### Error State Philosophy

**Principle**: Errors are frustrating - brand must be empathetic, not punishing.

#### Error Message Patterns
```typescript
// ❌ BAD: Technical, blaming, unhelpful
"Invalid PIN entered"
"Error 401: Unauthorized"
"You entered the wrong code"
"PIN validation failed"

// ✅ GOOD: Friendly, helpful, actionable
"Incorrect PIN. Please try again."
"That PIN doesn't match. Check your email for the correct code."
"Hmm, that's not quite right. 3 attempts remaining."
"PIN not recognized. Need help? Check your email."

// TONE GUIDELINES
✅ Use "please" and "try again" (polite)
✅ Suggest solutions ("Check your email")
✅ Avoid "you" language (less accusatory)
✅ Show attempts remaining (transparency)
✅ Use gentle emojis sparingly (🔐 not ❌)
❌ Never use technical jargon
❌ Never blame the user
❌ Never show error codes without context
```

#### Error Animations
```typescript
// Gentle shake (not violent)
const errorShake = {
  x: [0, -10, 10, -10, 10, 0], // 10px displacement (not 50px)
  transition: {
    duration: 0.4, // Quick but not jarring
    ease: "easeInOut"
  }
}

// Brief red flash (not persistent red state)
const errorFlash = {
  borderColor: [
    'rgba(255, 255, 255, 0.20)', // Normal
    'rgba(239, 68, 68, 0.70)',   // Error
    'rgba(239, 68, 68, 0.70)',   // Hold
    'rgba(255, 255, 255, 0.20)'  // Back to normal
  ],
  transition: {
    duration: 0.5,
    times: [0, 0.2, 0.8, 1] // Hold red for 300ms
  }
}

// ❌ AVOID: Violent shakes, persistent red
const violentShake = {
  x: [0, -50, 50, -50, 50, 0], // ❌ Too aggressive
  rotate: [0, -10, 10, -10, 10, 0], // ❌ Disorienting
  transition: { duration: 0.1 } // ❌ Too fast
}
```

#### Error Recovery
```typescript
// Help user recover immediately
const handlePinError = () => {
  // 1. Trigger error animation
  controls.start('shake')
  controls.start('flashRed')

  // 2. Show helpful message
  setError('Incorrect PIN. Check your email for the correct code.')

  // 3. Auto-clear incorrect PIN
  setTimeout(() => {
    clearPinInputs()
    focusFirstBox()
  }, 500)

  // 4. Keep error message until next attempt
  // (Don't auto-clear - user needs to read it)
}

// ❌ AVOID: Leaving user stuck
const badErrorHandling = () => {
  setError('Error') // Unhelpful
  // No auto-clear - user must manually delete
  // No auto-focus - user must click
  // Error disappears in 2s - user can't read
}
```

---

This completes the brand usage guidelines. All design decisions must align with these principles to maintain brand consistency.
```

---

## Augmentation 2: Add to 04-component-specs.md

**Location**: After line 1121 (after "## Key Design Decisions" section, before end of file)
**Insert**:

```markdown
---

## Brand Compliance Checklist

Use this checklist before implementing any component to ensure brand consistency.

### Pre-Implementation Review

#### Color Compliance
- [ ] All text uses black or white with opacity variants (no grays)
- [ ] Backgrounds use black gradients or white only
- [ ] Borders use white/black with opacity (0.10, 0.20, 1.0)
- [ ] Functional colors only for UI feedback (success/error/warning)
- [ ] Confetti colors only for celebration (3s duration, then cleared)
- [ ] No arbitrary brand colors (blues, purples, etc.)

#### Typography Compliance
- [ ] Uses system font stack (no custom fonts)
- [ ] Font sizes match design scale (32px→48px for H1)
- [ ] Font weights correct (700 bold, 600 semibold, 500 medium, 400 normal)
- [ ] Line heights appropriate (1.6 for body, 1.2 for headlines)
- [ ] Letter spacing correct (-0.02em for headlines, 0 for body)
- [ ] LineShadowText used max once per state (H1 only)

#### Animation Compliance
- [ ] Framer Motion used exclusively (no CSS animations for complexity)
- [ ] Easing curves match brand (easeOut, easeIn, easeInOut, bounce)
- [ ] Durations appropriate (150-200ms micro, 300-500ms standard)
- [ ] GPU-accelerated (transform/opacity only, no width/height)
- [ ] `will-change` applied only during active animation
- [ ] Reduced motion fallback exists (`useReducedMotion` hook)

#### Mobile Compliance
- [ ] Touch targets ≥ 44px (iOS guideline)
- [ ] Comfortable touch targets ≥ 56px (preferred)
- [ ] Spacing between targets ≥ 8px minimum
- [ ] Works in thumb zones (bottom 2/3 of screen)
- [ ] No horizontal scroll at any zoom (100%-200%)
- [ ] Typography scales appropriately (mobile-first)

#### Performance Compliance
- [ ] 60fps on iPhone 12 / Pixel 5 (mid-range target)
- [ ] Stars reduced on mobile (500 vs 1000)
- [ ] Particles reduced on mobile (50 vs 200)
- [ ] Parallax disabled on mobile
- [ ] Animation durations shorter on mobile (2s vs 3s)
- [ ] No janky animations (frame drops visible)

#### Accessibility Compliance
- [ ] ARIA labels on icons and interactive elements
- [ ] Focus indicators visible (2px ring, 2px offset)
- [ ] Keyboard navigation works (tab order logical)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Screen reader announcements for state changes
- [ ] Live regions for countdown and status updates
- [ ] Semantic HTML (header, main, section, article)

#### Brand Element Compliance
- [ ] StarsBackground present on dark states
- [ ] LineShadowText usage follows guidelines (once per state)
- [ ] Particles only for celebration (unlock, PIN ready)
- [ ] Error messages friendly and actionable
- [ ] Loading states maintain anticipation (mysterious)
- [ ] Animations serve emotional journey (not decoration)

### Component-Specific Checks

#### CapsuleBackground
- [ ] StarsBackground unchanged from Home.tsx
- [ ] Star count appropriate (500 mobile, 1000 desktop)
- [ ] Dark-to-light transition smooth (1200ms)
- [ ] Stars fade gracefully on unlock (800ms)
- [ ] Parallax disabled on mobile

#### AnimatedCountdown
- [ ] Flip animation smooth (400ms easeInOut)
- [ ] Box dimensions correct (64px mobile, 96px desktop)
- [ ] Glow effect subtle (pulsing, not strobing)
- [ ] Urgency shift activates (< 60min remaining)
- [ ] Numbers accessible (aria-live="polite")

#### UnlockAnimation
- [ ] Lock icon animates smoothly (shackle lift)
- [ ] Glow transitions correctly (white → success green)
- [ ] Timing coordinated with confetti (starts at 200ms)
- [ ] Icon swap smooth (opacity crossfade)
- [ ] Accessible (aria-label updates with state)

#### CelebrationEffect
- [ ] Particle count appropriate (50 mobile, 200 desktop)
- [ ] Duration correct (2000ms mobile, 3000ms desktop)
- [ ] Confetti colors approved palette
- [ ] Auto-cleanup after completion
- [ ] Completely disabled for reduced motion

#### CapsuleCard
- [ ] Background correct (black/80 dark, white light)
- [ ] Backdrop blur applied (24px)
- [ ] Border opacity correct (white/10)
- [ ] Padding scales (32px→48px mobile→desktop)
- [ ] Max-width appropriate (500-900px by state)
- [ ] Entrance animation staggered (80ms children)

### Final Checks

#### Visual Polish
- [ ] All hover states smooth (200ms transitions)
- [ ] Focus states visible and consistent
- [ ] Loading states don't flash (400ms delay before showing)
- [ ] Error states shake gently (10px, 400ms)
- [ ] Success states celebrate appropriately (confetti, glow)

#### Performance Validation
- [ ] Lighthouse score > 90 (mobile)
- [ ] No layout shifts during load
- [ ] Images lazy loaded
- [ ] Fonts use system stack (0 KB download)
- [ ] Bundle size < 500KB gzipped

#### Cross-Browser Testing
- [ ] Chrome desktop
- [ ] Chrome mobile (Android)
- [ ] Safari desktop
- [ ] Safari mobile (iOS)
- [ ] Firefox
- [ ] Edge

#### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] Desktop (1440px)

---

## Implementation Priority

Components should be built in this order to maximize reusability:

1. **CapsuleBackground** (foundation)
   - Wraps all states
   - Handles theme transitions
   - Most complex, used everywhere

2. **CapsuleCard** (container)
   - Common wrapper
   - Entrance animations
   - Used by all states

3. **AnimatedCountdown** (core feature)
   - Most visible component
   - Requires polish
   - State 2 dependency

4. **UnlockAnimation** (key moment)
   - PIN entry state
   - Unlock celebration trigger
   - Coordinates with confetti

5. **CelebrationEffect** (delight)
   - Reusable particle system
   - Multiple trigger points
   - Performance-critical

---

This checklist ensures every component maintains brand consistency from conception to implementation.
```

---

## Augmentation 3: Add to 05-animation-library.md

**Location**: After line 1367 (after "### 5. Mobile Gets Simpler Physics" in Key Animation Decisions)
**Insert**:

```markdown
---

### 6. Mobile Performance is Non-Negotiable

**Decision**: 60fps on mid-range devices is mandatory, even if features must be cut.

**Rationale**:
- Janky animations destroy brand perception of quality more than missing features
- Users will tolerate fewer particles over stuttering motion
- Battery drain on mobile creates negative sentiment
- Smooth simple animations > complex janky animations

**Mobile Optimizations** (Always Applied):
```typescript
// Reduce complexity, never compromise quality
const mobileOptimizations = {
  stars: {
    count: 500, // vs 1000 desktop
    duration: 60, // vs 50 (slower = less CPU)
    parallax: false, // Disabled completely
    layers: 2 // vs 3 desktop
  },
  confetti: {
    particles: 50, // vs 200 desktop
    duration: 2000, // vs 3000 desktop
    physics: "simplified", // Linear motion vs spring
    rotation: false // Disable rotation animation
  },
  animations: {
    easing: "linear", // vs spring (less calculation)
    glowLayers: 1, // vs 3 desktop (single shadow)
    springs: false, // Use cubic-bezier instead
    willChange: "minimal" // Only critical elements
  }
}

// Never compromise (Brand essentials)
const brandEssentials = {
  colors: "Identical palette (no mobile-specific grays)",
  typography: "Same scale (proportionally smaller)",
  countdownFlip: "Must work smoothly (core feature)",
  starsBackground: "Must be present (signature element)",
  unlockCelebration: "Must feel special (emotional peak)"
}
```

**Testing Protocol**:
```bash
# 1. Device Testing
✅ iPhone 12 (primary target)
✅ Pixel 5 (primary target)
✅ iPhone SE (minimum spec)
✅ Budget Android (Samsung A series)

# 2. Chrome DevTools
- CPU: 4× slowdown
- Network: Fast 3G
- Memory: Monitor for leaks
- Frame rate: 60fps sustained

# 3. Acceptance Criteria
- No dropped frames during:
  ✅ Countdown flip animation
  ✅ Confetti burst
  ✅ Stars drifting
  ✅ Entrance sequences
- CPU usage:
  ✅ Idle: < 5%
  ✅ Animating: < 30%
  ✅ Confetti: < 40% (brief spike OK)
```

**Fallback Strategy**:
```typescript
// If performance fails, progressive degradation
const performanceFallbacks = {
  stars: "Reduce to 250 particles if < 60fps",
  confetti: "Reduce to 25 particles if < 60fps",
  glow: "Disable if < 60fps (border only)",
  parallax: "Always disabled on mobile (no conditions)"
}

// NEVER degrade
const sacred = {
  colors: "Never change palette",
  countdown: "Flip must work (reduce FPS before removing)",
  unlock: "Confetti required (reduce count, don't remove)"
}
```

---

### 7. Error State Empathy

**Decision**: All error states use friendly, helpful language with gentle animations.

**Rationale**:
- Frustrated users blame the product, not themselves
- Empathetic errors maintain brand trust during failure
- Recovery assistance reduces abandonment
- Gentle feedback prevents user defensiveness

**Error Message Philosophy**:
```typescript
// ❌ BAD: Technical, blaming, unhelpful
const badErrors = [
  "Invalid PIN entered", // Technical, passive-aggressive
  "Error 401: Unauthorized", // System-centric, confusing
  "You entered the wrong code", // Blaming, accusatory
  "PIN validation failed", // Technical jargon
  "Authentication error" // Generic, unhelpful
]

// ✅ GOOD: Friendly, helpful, actionable
const goodErrors = [
  "Incorrect PIN. Please try again.", // Clear, polite
  "That PIN doesn't match. Check your email for the correct code.", // Helpful hint
  "Hmm, that's not quite right. 3 attempts remaining.", // Gentle, informative
  "PIN not recognized. Need help? Check your email.", // Suggests solution
  "Let's try that again. Double-check your email for the PIN." // Encouraging
]

// TONE GUIDELINES
✅ Use "please" and "try again" (polite, not demanding)
✅ Suggest solutions ("Check your email", not just "wrong")
✅ Avoid "you" language (less accusatory: "incorrect" vs "you entered wrong")
✅ Show attempts remaining (transparency, not threat)
✅ Use gentle emojis sparingly (🔐 helpful, ❌ accusatory)
✅ Conversational ("Hmm" vs "Error")
❌ Never use technical jargon
❌ Never blame the user explicitly
❌ Never show error codes without plain-language context
❌ Never use all caps or exclamation points
```

**Error Animations**:
```typescript
// Gentle shake (communicates error without violence)
const errorShake = {
  x: [0, -10, 10, -10, 10, 0], // 10px displacement (subtle)
  transition: {
    duration: 0.4, // Quick enough not to annoy
    ease: "easeInOut" // Smooth, not jarring
  }
}

// Brief red flash (feedback without persistent red state)
const errorFlash = {
  borderColor: [
    'rgba(255, 255, 255, 0.20)', // Normal white border
    'rgba(239, 68, 68, 0.70)',   // Flash red (error color)
    'rgba(239, 68, 68, 0.70)',   // Hold briefly
    'rgba(255, 255, 255, 0.20)'  // Return to normal
  ],
  transition: {
    duration: 0.5,
    times: [0, 0.2, 0.8, 1] // Hold red for 300ms (20%-80%)
  }
}

// ❌ AVOID: Violent, disorienting, persistent
const violentError = {
  x: [0, -50, 50, -50, 50, 0], // ❌ 50px too aggressive
  rotate: [0, -10, 10, -10, 10, 0], // ❌ Rotation disorienting
  scale: [1, 0.8, 1.2, 0.8, 1], // ❌ Scale jarring
  transition: { duration: 0.1 } // ❌ Too fast, nauseating
}

const persistentRed = {
  borderColor: 'red', // ❌ Stays red forever
  backgroundColor: 'red/20' // ❌ Persistent error state
  // Should return to normal after brief flash
}
```

**Error Recovery Flow**:
```typescript
const handlePinError = () => {
  // 1. Provide immediate visual feedback
  pinControls.start('shake') // Shake boxes
  pinControls.start('flashRed') // Flash red border

  // 2. Show helpful, friendly message
  setError({
    message: 'Incorrect PIN. Check your email for the correct code.',
    type: 'error',
    action: 'Check Email' // Optional action button
  })

  // 3. Auto-clear incorrect input (helpful, not punishing)
  setTimeout(() => {
    clearPinInputs() // Remove wrong digits
    focusFirstBox() // Auto-focus for retry
  }, 500) // After animation completes

  // 4. Keep error message visible until next attempt
  // ❌ Don't auto-hide error (user needs time to read)
  // ✅ Error clears on next input (fresh start)

  // 5. Update attempts remaining
  setAttemptsRemaining(prev => prev - 1)

  // 6. If last attempt, provide extra guidance
  if (attemptsRemaining === 1) {
    setError({
      message: 'Last attempt! Double-check your email for the PIN.',
      type: 'warning'
    })
  }
}

// ❌ AVOID: Leaving user stuck or confused
const badErrorHandling = () => {
  setError('Error') // ❌ Too vague
  // ❌ No auto-clear (user must manually delete each digit)
  // ❌ No auto-focus (user must click back)
  // ❌ Error disappears in 2s (user can't read)
  // ❌ No suggestion for how to recover
  // ❌ No indication of attempts remaining
}
```

**Error Message Hierarchy**:
```
FIRST ERROR (Attempts: 4 → 3)
"Incorrect PIN. Please try again."
→ Gentle, assumes typo

SECOND ERROR (Attempts: 3 → 2)
"That PIN doesn't match. Check your email for the correct code."
→ More specific, provides guidance

THIRD ERROR (Attempts: 2 → 1)
"Hmm, still not matching. Double-check your email—PIN should be 4 digits."
→ Extra helpful, emphasizes format

FINAL ATTEMPT (Attempts: 1 → 0)
"Last attempt! Make sure you're entering the PIN from the email exactly."
→ Urgency without panic, specific instruction

LOCKED OUT (Attempts: 0)
"Out of attempts. For security, we've locked this capsule. Please contact support."
→ Explains why, provides next step
```

**Accessibility for Errors**:
```tsx
// Announce errors to screen readers immediately
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {errorMessage}
</div>

// Visual error indicator + text (don't rely on color alone)
<Input
  aria-invalid={hasError}
  aria-describedby="pin-error"
  className={hasError ? "border-error" : ""}
/>
<p id="pin-error" className="text-error">
  {errorMessage}
</p>
```

---

### 8. Loading State Philosophy

**Decision**: Loading states must maintain mystery and anticipation, not create frustration.

**Rationale**:
- Generic spinners break brand immersion
- Progress bars reveal "wait time," killing anticipation
- First impression (loading) sets emotional tone
- Fast perceived load > actual fast load

**Loading Sequence Strategy**:
```typescript
// Progressive disclosure (avoid jarring blank-to-content flash)
const loadingSequence = {
  "0ms": {
    screen: "Blank",
    rationale: "Most loads are fast (< 400ms). Don't flash loading state unnecessarily."
  },
  "400ms": {
    screen: "Stars fade in (background only)",
    rationale: "Establish brand context before showing 'loading' state"
  },
  "800ms": {
    screen: "Gift box spinner appears (64px, center)",
    rationale: "Only show spinner if load is taking longer than expected"
  },
  "1000ms": {
    screen: "Text appears: 'Preparing your capsule...'",
    rationale: "Provide reassurance after 1 second of waiting"
  }
}

// Implementation
const [loadingStage, setLoadingStage] = useState(0)

useEffect(() => {
  const timers = [
    setTimeout(() => setLoadingStage(1), 400),  // Stars
    setTimeout(() => setLoadingStage(2), 800),  // Spinner
    setTimeout(() => setLoadingStage(3), 1000), // Text
  ]
  return () => timers.forEach(clearTimeout)
}, [])

return (
  <AnimatePresence mode="wait">
    {loadingStage === 0 && <div />} {/* Blank */}
    {loadingStage >= 1 && <StarsBackground />}
    {loadingStage >= 2 && <GiftSpinner />}
    {loadingStage >= 3 && <LoadingText />}
  </AnimatePresence>
)
```

**Brand-Aligned Loading Design**:
```tsx
// ✅ APPROVED: Mysterious, maintains anticipation
<div className="min-h-screen flex items-center justify-center">
  <StarsBackground starColor="#fff" className="absolute inset-0">
    <AnimatePresence>
      {showSpinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          {/* Gift box icon (brand-aligned, not generic spinner) */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Gift className="w-16 h-16 text-white" />
          </motion.div>

          {/* Mysterious text (maintains anticipation) */}
          {showText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="text-white/70 text-sm"
            >
              Preparing your capsule...
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </StarsBackground>
</div>

// ❌ AVOID: Generic, breaks brand, kills anticipation
<div className="bg-white flex items-center justify-center">
  <Spinner className="w-8 h-8" /> {/* Generic circle spinner */}
  <p>Loading...</p> {/* Too technical */}
  <ProgressBar value={loadProgress} max={100} /> {/* Reveals wait time */}
  <p>{loadProgress}% complete</p> {/* Kills mystery */}
</div>
```

**Loading State Don'ts**:
```typescript
// ❌ NEVER do these (they break brand/anticipation)
const loadingAntiPatterns = {
  progressBars: "Reveals how long user must wait (kills anticipation)",
  percentages: "Technical, utilitarian (not magical)",
  genericSpinners: "Breaks brand (use gift box icon)",
  whiteBackgrounds: "Jarring after dark hero (use StarsBackground)",
  technicalLanguage: "Loading..., Fetching data... (too technical)",
  ETACountdowns: "3 seconds remaining... (creates anxiety)",
  multipleStates: "Loading... Processing... Almost there... (confusing)"
}

// ✅ APPROVED patterns (maintain brand)
const loadingPatterns = {
  giftBoxIcon: "Brand-aligned, mysterious",
  starsBackground: "Immediate brand connection",
  mysteriousText: "'Preparing your capsule...' (not 'Loading...')",
  progressiveDisclosure: "Stars first (400ms), spinner later (800ms)",
  noETAs: "Never reveal time remaining",
  singleMessage: "One simple message (no state changes)"
}
```

**Skeleton Loading** (If Needed for Partial Content):
```tsx
// For preview content that loads after main page
// Use sparingly—stars background often sufficient

const SkeletonLoader = () => (
  <motion.div
    className="rounded-lg"
    style={{
      background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)",
      backgroundSize: "200% 100%"
    }}
    animate={{
      backgroundPosition: ["200% 0", "-200% 0"]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    {/* Content placeholder */}
  </motion.div>
)

// Usage: Only for specific slow-loading content sections
// ❌ Don't use for entire page (stars loading is better)
// ✅ Use for preview photo if image loads slowly
```

**Performance Perception Tricks**:
```typescript
// Make loading feel faster than it actually is
const perceptionTricks = {
  optimisticUI: "Show content immediately, load in background",
  stagger: "Load critical content first (title), defer preview",
  cache: "Aggressive caching (localStorage, service worker)",
  preload: "Prefetch likely-needed data on previous page",
  lazyLoad: "Defer below-fold content until scroll"
}

// Example: Show title immediately, load preview later
const [data, setData] = useState({ title: null, preview: null })

useEffect(() => {
  // Fetch title first (fast)
  fetchTitle().then(title => setData(prev => ({ ...prev, title })))

  // Fetch preview later (slower)
  fetchPreview().then(preview => setData(prev => ({ ...prev, preview })))
}, [])

// Result: User sees content in 200ms (title), full content in 1s (preview)
// Perception: Fast! vs waiting 1s for everything
```

---

This completes the comprehensive animation philosophy and brand guidelines. All loading, error, and performance decisions must align with these principles.
```

---

## Summary

These augmentations provide:

1. **03-design-system.md**: Brand usage guidelines for LineShadowText, particles, colors, animations, mobile performance, loading, and errors

2. **04-component-specs.md**: Comprehensive brand compliance checklist covering colors, typography, animations, mobile, performance, accessibility, and component-specific checks

3. **05-animation-library.md**: Additional key decisions on mobile performance (non-negotiable), error state empathy, and loading state philosophy

All augmentations maintain consistency with existing design files while adding critical brand guidelines that were missing. Ready to merge into respective files.
