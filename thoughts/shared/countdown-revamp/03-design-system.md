# Design System Tokens

## Color Palette

### Dark Theme (Locked States: Loading, Countdown, Pending, Pin-Entry)

**Background Colors:**
```css
--bg-primary: #000000 /* Pure black base */
--bg-gradient: radial-gradient(ellipse at bottom, #262626 0%, #000000 100%) /* StarsBackground */
--bg-card: rgba(0, 0, 0, 0.80) /* Semi-transparent card with backdrop-blur */
--bg-card-hover: rgba(0, 0, 0, 0.85) /* Hover state */
--bg-muted: rgba(255, 255, 255, 0.10) /* Muted backgrounds (countdown boxes, PIN boxes) */
--bg-muted-hover: rgba(255, 255, 255, 0.15) /* Hover state for muted */
--bg-accent: rgba(255, 255, 255, 0.05) /* Very subtle accent backgrounds */
```

**Text Colors:**
```css
--text-primary: #FFFFFF /* Pure white for headings */
--text-secondary: rgba(255, 255, 255, 0.90) /* High emphasis body text */
--text-muted: rgba(255, 255, 255, 0.80) /* Medium emphasis */
--text-subtle: rgba(255, 255, 255, 0.70) /* Low emphasis, metadata */
--text-faint: rgba(255, 255, 255, 0.60) /* Very low emphasis */
```

**Border Colors:**
```css
--border-default: rgba(255, 255, 255, 0.10) /* Default borders */
--border-subtle: rgba(255, 255, 255, 0.05) /* Very subtle borders */
--border-emphasis: rgba(255, 255, 255, 0.20) /* Emphasized borders */
--border-focus: rgba(255, 255, 255, 1.0) /* Focus state */
--border-glow: rgba(255, 255, 255, 0.30) /* Glow effect */
```

**State Colors (Dark Mode):**
```css
--success: #10B981 /* Green for success states */
--success-glow: rgba(16, 185, 129, 0.40) /* Success glow */
--error: #EF4444 /* Red for errors */
--error-bg: rgba(239, 68, 68, 0.10) /* Error background */
--error-border: rgba(239, 68, 68, 0.30) /* Error border */
--warning: #F59E0B /* Amber for warnings/urgency */
--warning-glow: rgba(245, 158, 11, 0.40) /* Warning glow */
```

### Light Theme (Unlocked State)

**Background Colors:**
```css
--bg-light-primary: #FFFFFF /* Pure white */
--bg-light-secondary: #F9FAFB /* Very light gray */
--bg-light-muted: #F3F4F6 /* Muted background */
--bg-light-accent: #E5E7EB /* Accent background */
--bg-light-card: #FFFFFF /* Card background */
```

**Text Colors:**
```css
--text-light-primary: #000000 /* Black headings */
--text-light-secondary: rgba(0, 0, 0, 0.90) /* High emphasis */
--text-light-muted: rgba(0, 0, 0, 0.60) /* Medium emphasis */
--text-light-subtle: rgba(0, 0, 0, 0.50) /* Low emphasis */
```

**Border Colors:**
```css
--border-light-default: rgba(0, 0, 0, 0.10) /* Default borders */
--border-light-subtle: rgba(0, 0, 0, 0.05) /* Subtle borders */
--border-light-emphasis: rgba(0, 0, 0, 0.20) /* Emphasized borders */
```

### Semantic Colors

**Celebration & Effects:**
```css
--confetti-colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'] /* Confetti particles */
--glow-primary: rgba(255, 255, 255, 0.60) /* Primary glow effect */
--glow-secondary: rgba(255, 255, 255, 0.40) /* Secondary glow */
--shadow-soft: rgba(0, 0, 0, 0.10) /* Soft shadows on light bg */
--shadow-medium: rgba(0, 0, 0, 0.20) /* Medium shadows */
--shadow-hard: rgba(0, 0, 0, 0.30) /* Hard shadows */
```

---

## Typography Scale

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Weights
```css
--font-normal: 400 /* Body text, paragraphs */
--font-medium: 500 /* Prompts, labels, emphasis */
--font-semibold: 600 /* Section headings, H2 */
--font-bold: 700 /* Titles, countdown numbers, H1 */
```

### Type Scale (Mobile-First)

**Mobile (375px - 767px):**
```css
--text-display: 36px / 40px /* Hero moments, special emphasis */
--text-h1: 32px / 38.4px /* Page titles, capsule titles */
--text-h2: 24px / 32px /* Section headings */
--text-h3: 20px / 28px /* Subsection headings */
--text-body-large: 18px / 28.8px /* Prompts, important messages */
--text-body: 16px / 25.6px /* Default body text */
--text-body-small: 14px / 21px /* Secondary text, metadata */
--text-caption: 12px / 16.8px /* Very small text, timestamps */
--text-label: 11px / 15.4px /* Countdown labels, uppercase */
```
Letter spacing: `-0.02em` for headlines, `0` for body

**Tablet (768px - 1023px):**
```css
--text-display: 44px / 48px
--text-h1: 40px / 48px
--text-h2: 28px / 36.4px
--text-h3: 22px / 30.8px
--text-body-large: 20px / 32px
--text-body: 18px / 28.8px
--text-body-small: 16px / 24px
--text-caption: 14px / 19.6px
--text-label: 12px / 16.8px
```

**Desktop (1024px+):**
```css
--text-display: 48px / 52.8px /* Matching Home.tsx hero */
--text-h1: 48px / 57.6px
--text-h2: 32px / 41.6px
--text-h3: 24px / 33.6px
--text-body-large: 22px / 35.2px
--text-body: 18px / 28.8px
--text-body-small: 16px / 24px
--text-caption: 14px / 19.6px
--text-label: 14px / 19.6px
```

Line height formula: `font-size × 1.6` for readability on mobile

---

## Spacing System

### Base Grid: 4px
All spacing uses multiples of 4px for pixel-perfect alignment.

**Spacing Tokens:**
```css
--space-1: 4px   /* 0.25rem - Tight spacing, icon margins */
--space-2: 8px   /* 0.5rem - Default small gap, countdown boxes */
--space-3: 12px  /* 0.75rem - PIN box gaps, component spacing */
--space-4: 16px  /* 1rem - Default padding, margins */
--space-5: 20px  /* 1.25rem - Comfortable spacing */
--space-6: 24px  /* 1.5rem - Section spacing, icon-to-title */
--space-8: 32px  /* 2rem - Major section breaks, card padding */
--space-10: 40px /* 2.5rem - Large spacing (tablet) */
--space-12: 48px /* 3rem - Hero spacing, desktop padding */
--space-16: 64px /* 4rem - Extra large spacing */
```

**Component-Specific Spacing:**
```css
--container-padding-mobile: 24px 16px /* Vertical 24px, Horizontal 16px */
--container-padding-tablet: 32px 24px
--container-padding-desktop: 40px 32px
--element-gap-mobile: 16px /* Between stacked elements */
--element-gap-tablet: 20px
--element-gap-desktop: 24px
```

---

## Effects

### Shadows

**Dark Theme Glows:**
```css
--glow-soft: 0 0 20px rgba(255, 255, 255, 0.15) /* Subtle glow */
--glow-medium: 0 0 30px rgba(255, 255, 255, 0.25) /* Medium glow */
--glow-strong: 0 0 40px rgba(255, 255, 255, 0.35) /* Strong glow */
--glow-countdown: 0 0 24px rgba(255, 255, 255, 0.20) /* Countdown boxes */
--glow-focus: 0 0 0 2px rgba(255, 255, 255, 1.0), 0 0 20px rgba(255, 255, 255, 0.30) /* Focus ring + glow */
--glow-success: 0 0 30px rgba(16, 185, 129, 0.50) /* Success state */
--glow-error: 0 0 20px rgba(239, 68, 68, 0.40) /* Error state */
```

**Light Theme Shadows:**
```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05) /* Very subtle */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06) /* Small elevation */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06) /* Medium elevation */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.10), 0 4px 6px rgba(0, 0, 0, 0.05) /* Large elevation */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.10), 0 10px 10px rgba(0, 0, 0, 0.04) /* Extra large */
```

### Backdrop Blur
```css
--blur-card: blur(24px) /* Card backgrounds on stars */
--blur-overlay: blur(8px) /* Light overlay effects */
```

### Border Radius
```css
--radius-sm: 8px /* Small components, alerts */
--radius-md: 12px /* Default, PIN boxes, preview cards */
--radius-lg: 16px /* Large cards, containers */
--radius-xl: 20px /* Extra large, final CTA */
--radius-full: 9999px /* Circular elements, icons */
```

### Opacity Levels
```css
--opacity-disabled: 0.40 /* Disabled states */
--opacity-muted: 0.60 /* Muted content */
--opacity-secondary: 0.80 /* Secondary text */
--opacity-primary: 0.90 /* High emphasis text */
--opacity-full: 1.0 /* Maximum emphasis */
```

---

## Animation Curves

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1) /* Entrances, decelerating */
--ease-in: cubic-bezier(0.4, 0, 1, 1) /* Exits, accelerating */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) /* Interactive, smooth both ends */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1) /* Playful bounce on entrance */
--ease-linear: linear /* Constant speed, backgrounds */
```

### Spring Physics (Framer Motion)
```javascript
// Standard spring for UI elements
const springDefault = { stiffness: 260, damping: 20 }

// Gentle spring for large movements
const springGentle = { stiffness: 100, damping: 15 }

// Bouncy spring for delight moments
const springBouncy = { stiffness: 400, damping: 10 }

// Slow spring for backgrounds
const springSlow = { stiffness: 50, damping: 20 }
```

### Duration Tokens
```css
--duration-instant: 0ms /* Immediate, no animation */
--duration-fast: 150ms /* Quick micro-interactions */
--duration-normal: 300ms /* Standard transitions */
--duration-slow: 500ms /* Deliberate state changes */
--duration-slower: 800ms /* Major transitions */
--duration-entrance: 600ms /* Page/state entrances */
--duration-celebration: 2000ms /* Unlock celebration sequence */
```

**Animation Type Guidelines:**
- **Micro-interactions (hover, tap):** 150-200ms, ease-in-out
- **Standard transitions (fades, slides):** 300-400ms, ease-out
- **State changes (countdown → PIN):** 400-600ms, ease-out
- **Celebrations (unlock):** 2000-3000ms, orchestrated sequence
- **Background animations (stars):** 50-120s, linear, infinite

---

## Responsive Breakpoints

### Breakpoint Values
```css
--breakpoint-sm: 640px /* Small devices */
--breakpoint-md: 768px /* Tablets (primary breakpoint) */
--breakpoint-lg: 1024px /* Desktops (primary breakpoint) */
--breakpoint-xl: 1280px /* Large desktops */
--breakpoint-2xl: 1536px /* Extra large screens */
```

### Media Queries (Mobile-First)
```css
/* Base: Mobile (0-767px) */
/* All base styles apply here */

/* Tablet and up */
@media (min-width: 768px) {
  /* Increase font sizes by ~20% */
  /* Increase spacing by 1-2 levels */
  /* Activate hover effects */
}

/* Desktop and up */
@media (min-width: 1024px) {
  /* Increase font sizes by ~50% from mobile */
  /* Increase spacing by 2-3 levels */
  /* More elaborate animations */
  /* Parallax effects */
}
```

### Container Max-Widths
```css
--container-max-countdown: 600px /* Locked states (narrow, focused) */
--container-max-pending: 500px /* Pending state (narrowest, centered message) */
--container-max-pin-entry: 600px /* PIN entry (same as countdown) */
--container-max-unlocked: 900px /* Unlocked state (wider for content) */
```

---

## Tailwind CSS Utilities Reference

### Background Classes
```
Dark theme card: bg-black/80 backdrop-blur-3xl
Muted background: bg-white/10
Light theme card: bg-white shadow-lg
Gradient background: bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]
```

### Text Classes
```
Heading: text-white font-bold text-3xl md:text-4xl lg:text-5xl
Body: text-white/90 text-base md:text-lg
Muted: text-white/80 text-sm md:text-base
Caption: text-white/70 text-xs md:text-sm uppercase tracking-wide
```

### Border Classes
```
Default: border border-white/10
Emphasis: border-2 border-white/20
Focus: ring-2 ring-white ring-offset-2 ring-offset-black
Rounded: rounded-lg (12px), rounded-xl (16px), rounded-2xl (20px)
```

### Spacing Classes
```
Padding card: p-6 md:p-8 lg:p-10 (24px → 32px → 40px)
Margin sections: mb-6 md:mb-8 lg:mb-12 (24px → 32px → 48px)
Gap between items: gap-4 md:gap-6 lg:gap-8 (16px → 24px → 32px)
```

### Layout Classes
```
Container: max-w-2xl mx-auto px-4 md:px-6 lg:px-8
Flex column: flex flex-col items-center justify-center gap-6
Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

---

## Accessibility Tokens

### Focus States
```css
--focus-ring-width: 2px
--focus-ring-offset: 2px
--focus-ring-color: rgba(255, 255, 255, 1.0) /* Dark theme */
--focus-ring-color-light: rgba(0, 0, 0, 1.0) /* Light theme */
```

### Touch Targets (Mobile)
```css
--touch-target-min: 44px /* iOS guideline */
--touch-target-comfortable: 56px /* Preferred for primary actions */
--touch-spacing-min: 8px /* Minimum gap between targets */
--touch-spacing-comfortable: 12px /* Preferred spacing */
```

### Contrast Ratios (WCAG AA)
```
Normal text: 4.5:1 minimum
Large text (18px+): 3:1 minimum
UI components: 3:1 minimum

Tested combinations:
- white on bg-black/80: ✅ Passes (>7:1)
- white/90 on bg-black/80: ✅ Passes (>6:1)
- white/80 on bg-black/80: ✅ Passes (>5:1)
- white/70 on bg-black/80: ⚠️ Use for large text only (>4:1)
- black on bg-white: ✅ Passes (21:1)
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations except opacity */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Allow essential opacity fades */
  .essential-fade {
    transition: opacity 200ms ease-out;
  }
}
```

---

## Design Token Usage Examples

### Countdown Box (Dark Theme)
```tsx
<div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:w-24
                bg-white/10 border border-white/20 rounded-lg
                shadow-[0_0_24px_rgba(255,255,255,0.20)]
                hover:bg-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]
                transition-all duration-300">
  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
    12
  </span>
</div>
```

### PIN Input Box
```tsx
<input className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20
                  bg-white/10 border-2 border-white/20 rounded-xl
                  text-white text-3xl md:text-4xl font-bold text-center
                  focus:border-white focus:ring-2 focus:ring-white/30
                  focus:bg-white/15
                  transition-all duration-200" />
```

### Card Container (Dark)
```tsx
<div className="max-w-2xl mx-auto p-8 md:p-10 lg:p-12
                bg-black/80 backdrop-blur-3xl
                border border-white/10 rounded-2xl
                shadow-[0_0_20px_rgba(255,255,255,0.15)]">
  {/* Content */}
</div>
```

### Light Theme Card (Unlocked)
```tsx
<div className="max-w-4xl mx-auto p-8 md:p-10 lg:p-12
                bg-white border border-black/10 rounded-2xl
                shadow-lg">
  {/* Unlocked content */}
</div>
```

---

## Key Design Decisions

### 1. Dark-to-Light Transition
**Decision:** Use pure black (#000) for locked states, pure white (#FFF) for unlocked.
**Rationale:** Creates dramatic emotional shift from "waiting in darkness" to "revealed in light" that mirrors the unlock moment metaphor from UX research.

### 2. White Opacity System
**Decision:** Use white text with opacity variations (100%, 90%, 80%, 70%, 60%) instead of gray colors.
**Rationale:** Matches Home.tsx hero section, ensures consistency, simplifies color palette, works perfectly on dark backgrounds with stars.

### 3. 8px Spacing Base
**Decision:** All spacing multiples of 4px, with 8px as the "default small" unit.
**Rationale:** Aligns with Tailwind's spacing scale, ensures pixel-perfect alignment on all screens, matches industry standards.

### 4. Mobile-First Typography
**Decision:** Start at 32px for H1 on mobile, scale to 48px on desktop.
**Rationale:** Matches hero section scale, ensures readability on small screens first, progressive enhancement for larger screens.

### 5. Glow Over Shadow
**Decision:** Use glowing effects (box-shadow with white) instead of traditional shadows in dark theme.
**Rationale:** Shadows don't work on black backgrounds; glows create magical, ethereal feeling that reinforces time capsule mystique.

### 6. No Pure Grays
**Decision:** Never use gray colors (#808080, etc.); always use white/black with opacity.
**Rationale:** Ensures colors adapt to background, maintains consistency with existing design system, simpler token management.

---

## Deviations from Home.tsx

### What We Kept
- ✅ StarsBackground component unchanged
- ✅ LineShadowText component for titles
- ✅ White text on dark backgrounds
- ✅ Opacity-based hierarchy (white/90, white/80, etc.)
- ✅ Border animations for buttons
- ✅ Framer Motion for all animations
- ✅ Typography scale (32px mobile → 48px desktop for H1)
- ✅ Spacing patterns (px-4, py-32, gap-4, etc.)

### What We Adjusted
- **Container backgrounds:** Hero has no card; we add semi-transparent cards (bg-black/80) for content focus
- **Max-width constraints:** Hero is full-width; we constrain to 600-900px for readability
- **Light theme addition:** Hero is dark only; we add complete light theme for unlocked state
- **State-specific colors:** Hero has no state colors; we add success/error/warning for PIN entry
- **Component tokens:** Hero has minimal components; we add countdown boxes, PIN inputs, etc.

### Why These Changes
1. **Cards needed:** Countdown page has dense information; cards create focus and hierarchy
2. **Width constraints:** Long lines hard to read; 600-900px optimal for scanning
3. **Light theme:** Unlocked moment needs emotional shift; darkness → light reinforces revelation
4. **State colors:** PIN entry needs feedback; success/error critical for usability
5. **New components:** Hero is presentation; countdown is interactive, needs component system

---

## Mobile Performance Optimizations

### Reduced Complexity
```javascript
// Mobile: Fewer stars, simpler animations
const mobileStarCount = { layer1: 500, layer2: 200, layer3: 100 } // vs desktop 1000/400/200
const mobileAnimationDuration = 60 // vs desktop 50 (slower = less processing)

// Desktop: Full fidelity
const desktopStarCount = { layer1: 1000, layer2: 400, layer3: 200 }
const desktopAnimationDuration = 50
```

### GPU Acceleration
```css
/* Always use transform and opacity for animations */
.animated-element {
  will-change: transform, opacity; /* Only during animation */
  transform: translateZ(0); /* Force GPU layer */
}

/* Avoid animating these (CPU-intensive) */
.avoid-animating {
  /* width, height, top, left, margin, padding */
}
```

### Conditional Effects
```tsx
// Disable parallax on mobile
const enableParallax = useMediaQuery('(min-width: 1024px)')

// Reduce particle count
const particleCount = isMobile ? 50 : 200
```

---

This design system provides all tokens needed for consistent, accessible, performant countdown page implementation while maintaining brand consistency with the hero section.
