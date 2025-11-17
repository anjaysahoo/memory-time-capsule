# Animation Specifications: Memory Time Capsule Landing Page

**Version:** 1.0
**Date:** 2025-11-17
**Phase:** 2 (UI Design)

---

## Overview

Complete animation system for Memory Time Capsule landing page. All animations respect `prefers-reduced-motion`, use GPU-accelerated properties, and target 60fps performance.

**Animation Philosophy**: Subtle, purposeful, respectful
- Enhance understanding (timeline drawing shows process)
- Guide attention (staggered reveals direct reading order)
- Delight users (playful micro-interactions)
- Never distract or overwhelm

---

## Global Animation System

### Easing Functions

**Standard (UI Elements)**
```css
cubic-bezier(0.4, 0, 0.2, 1)  /* ease-out */
```
Use for: Most transitions, fades, slides

**Smooth (Slow Animations)**
```css
cubic-bezier(0.4, 0, 0.6, 1)  /* ease-in-out */
```
Use for: Accordion expand/collapse, modal open/close

**Playful (Delight Moments)**
```css
cubic-bezier(0.68, -0.55, 0.265, 1.55)  /* back-out */
```
Use for: Icon bounces, badge wiggles, trust bar reveals

**Sharp (Quick Actions)**
```css
cubic-bezier(0.4, 0, 1, 1)  /* ease-in */
```
Use for: Closes, dismisses, clicks

### Timing Scale

| Duration | Use Case | Example |
|----------|----------|---------|
| 100ms | Instant feedback | Button active state |
| 150ms | Quick transitions | Hover color changes |
| 200ms | Standard transitions | Card hover, button hover |
| 300ms | Moderate animations | Accordion expand, tab switch |
| 400ms | Slow transitions | Fade in on scroll |
| 600ms | Emphasis animations | Hero headline reveal |
| 1500ms | Long animations | Timeline drawing |
| 2000ms+ | Ambient animations | CTA pulse loop, icon float loop |

---

## Custom Animations

### 1. fadeInUp (Hero Elements)

**Purpose**: Hero headline, subtitle, CTA reveal on page load

**CSS**:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

**Usage**:
```jsx
<h1 className="animate-fadeInUp">Send Messages to the Future</h1>
<p className="animate-fadeInUp [animation-delay:100ms]">...</p>
<Button className="animate-fadeInUp [animation-delay:200ms]">...</Button>
```

**Stagger**: 100ms intervals (headline → subtitle → CTA)
**Duration**: 600ms
**Easing**: ease-out

---

### 2. pulse-glow (CTA Buttons)

**Purpose**: Continuous attention-drawing animation for primary CTAs

**CSS**:
```css
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(139, 126, 255, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(139, 126, 255, 0.5);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

**Usage**:
```jsx
<Button className="bg-white text-primary hover:scale-105 animate-pulse-glow">
  Get Started Free
</Button>
```

**Duration**: 2s infinite
**Easing**: ease-in-out
**Subtlety**: scale(1.02) only - barely noticeable but effective

---

### 3. drawLine (Timeline)

**Purpose**: Timeline line drawing animation from left to right (desktop) or top to bottom (mobile)

**CSS**:
```css
@keyframes drawLine {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@keyframes drawLineVertical {
  from {
    height: 0%;
  }
  to {
    height: 100%;
  }
}

.animate-drawLine {
  animation: drawLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-drawLineVertical {
  animation: drawLineVertical 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

**Usage**:
```jsx
{/* Desktop - Horizontal */}
<div className="hidden md:block h-0.5 bg-primary animate-drawLine" />

{/* Mobile - Vertical */}
<div className="md:hidden w-0.5 bg-primary animate-drawLineVertical" />
```

**Duration**: 1500ms
**Trigger**: Intersection Observer when section enters viewport
**Easing**: ease-out

---

### 4. float (Icon Hover)

**Purpose**: Gentle up/down motion for icons on card hover

**CSS**:
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}
```

**Usage**:
```jsx
<Card className="group hover:shadow-xl">
  <FileVideo className="w-6 h-6 text-primary group-hover:animate-float" />
</Card>
```

**Duration**: 2s infinite
**Range**: -5px up
**Trigger**: On card hover (group-hover)

---

### 5. bounce (Scroll Indicator)

**Purpose**: Bouncing chevron to encourage scrolling

**CSS** (Tailwind built-in):
```
className="animate-bounce"
```

**Usage**:
```jsx
<button className="absolute bottom-8 animate-bounce">
  <ChevronDown className="w-8 h-8 text-white/70" />
</button>
```

**Duration**: 1s infinite
**Built-in Tailwind**: Yes

---

### 6. spin (Loading States)

**Purpose**: Loading spinners, processing indicators

**CSS** (Tailwind built-in):
```
className="animate-spin"
```

**Usage**:
```jsx
<Loader2 className="w-4 h-4 animate-spin" />
```

**Duration**: 1s infinite linear

---

### 7. wiggle (Trust Badge Hover)

**Purpose**: Playful rotation on hover for trust badges

**CSS**:
```css
@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(3deg) scale(1.05);
  }
  75% {
    transform: rotate(-3deg) scale(1.05);
  }
}

.hover\:animate-wiggle:hover {
  animation: wiggle 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Usage**:
```jsx
<div className="hover:animate-wiggle">
  <Gift className="w-6 h-6 text-secondary" />
</div>
```

**Duration**: 300ms
**Rotation**: ±3deg
**Easing**: back-out (playful overshoot)
**Trigger**: On hover

---

### 8. shimmer (Loading Skeleton)

**Purpose**: Skeleton loading states for content

**CSS**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}
```

**Usage**:
```jsx
<Skeleton className="animate-shimmer h-20 w-full" />
```

**Duration**: 2s infinite
**Use**: Image/content loading placeholders

---

## Section-Specific Animations

### Hero Section

**Load Cascade** (Sequential reveals)
```
Headline:  fadeInUp 600ms, delay 0ms
Subtitle:  fadeInUp 600ms, delay 100ms
CTA:       fadeInUp 600ms, delay 200ms
Logos:     fadeInUp 600ms, delay 300ms
Indicator: bounce (infinite), delay 500ms
```

**Implementation**:
```jsx
<div className="space-y-6">
  <h1 className="animate-fadeInUp">...</h1>
  <p className="animate-fadeInUp [animation-delay:100ms]">...</p>
  <Button className="animate-fadeInUp [animation-delay:200ms]">...</Button>
  <div className="animate-fadeInUp [animation-delay:300ms]">...</div>
  <div className="animate-bounce [animation-delay:500ms]">...</div>
</div>
```

**Background Video** (if used)
```css
.hero-video {
  animation: fadeIn 0.8s ease-out;
}
```

---

### Trust Indicators Bar

**Staggered Reveal**
```
Badge 1: delay 0ms
Badge 2: delay 100ms
Badge 3: delay 200ms
Badge 4: delay 300ms
```

**Implementation**:
```jsx
{badges.map((badge, i) => (
  <div
    key={i}
    className="animate-fadeInUp"
    style={{animationDelay: `${i * 100}ms`}}
  >
    {badge}
  </div>
))}
```

**Icon Hover**: Wiggle animation
```jsx
<div className="hover:animate-wiggle">
  <Icon className="w-6 h-6" />
</div>
```

**"Free" Badge Special**: Double pulse on load
```css
@keyframes doublePulse {
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(1.1); }
  20% { transform: scale(1); }
}

.free-badge {
  animation: doublePulse 1s ease-out;
  animation-delay: 2s;
}
```

---

### How It Works Timeline

**Animation Sequence**:
1. Timeline line draws (1500ms)
2. Node 1 reveals with pulse (delay 400ms)
3. Node 2 reveals with pulse (delay 900ms)
4. Node 3 reveals with pulse (delay 1400ms)
5. Content stagger for each node (+100ms per element)

**Timeline Drawing**:
```jsx
<div className="relative">
  <div className="absolute h-0.5 bg-muted w-full" />
  <div className="absolute h-0.5 bg-primary animate-drawLine" />
</div>
```

**Node Pulse** (after line reaches it):
```css
@keyframes nodePulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-nodePulse {
  animation: nodePulse 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
```

**Content Stagger** (within each step):
```
Icon:        delay 0ms
Title:       delay 100ms
Description: delay 200ms
Badges:      delay 300ms
```

---

### Interactive Demo

**Tab Switch Animation**:
```css
@keyframes tabFade {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tab-content {
  animation: tabFade 0.4s ease-out;
}
```

**Progress Dots**:
```css
.progress-dot {
  transition: background-color 0.3s ease-out, transform 0.3s ease-out;
}

.progress-dot.active {
  transform: scale(1.5);
}
```

**Auto-Advance Progress Bar**:
```css
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.progress-bar {
  animation: progressFill 3s linear;
}
```

---

### Features Grid

**Staggered Card Reveal** (on scroll into view):
```jsx
{features.map((feature, i) => (
  <Card
    key={i}
    className="opacity-0 animate-fadeInUp"
    style={{animationDelay: `${i * 80}ms`}}
  >
    {feature}
  </Card>
))}
```
**Stagger**: 80ms intervals
**Total sequence**: 480ms for 6 cards

**Card Hover**:
```css
.feature-card {
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

**Icon Float** (on card hover):
```jsx
<Card className="group">
  <Icon className="group-hover:animate-float" />
</Card>
```

---

### Use Cases

**Alternating Entrance** (on scroll):
- Odd cards: Slide from left
- Even cards: Slide from right

```css
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**Image Hover Zoom**:
```css
.use-case-image {
  transition: transform 0.5s ease-out;
}

.use-case-image:hover {
  transform: scale(1.05);
}
```
**Duration**: 500ms (slower for photos)

---

### FAQ Accordion

**Expand/Collapse** (ShadCN accordion built-in):
```css
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}
```
**Duration**: 200ms (configured in tailwind.config.js)
**Easing**: ease-out

**Chevron Rotation**:
```css
.accordion-trigger svg {
  transition: transform 0.2s ease-out;
}

.accordion-trigger[data-state="open"] svg {
  transform: rotate(180deg);
}
```

---

### Final CTA

**Background Gradient Shift** (subtle, slow):
```css
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.cta-gradient {
  background: linear-gradient(
    135deg,
    hsl(var(--primary)),
    hsl(var(--secondary)),
    hsl(var(--primary))
  );
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
}
```
**Duration**: 10s infinite
**Subtlety**: Very slow, barely perceptible

**Button Pulse Glow**:
```jsx
<Button className="animate-pulse-glow">Get Started Free</Button>
```

**Magnetic Hover** (optional, advanced):
```css
.cta-button {
  transition: transform 0.2s ease-out;
}

.cta-button:hover {
  transform: translateY(-3px);
}
```

---

## Scroll-Based Animations

### Intersection Observer Setup

**JavaScript Implementation**:
```javascript
// Animate elements on scroll into view
const observerOptions = {
  threshold: 0.1, // Trigger when 10% visible
  rootMargin: '0px 0px -100px 0px' // Start before fully in view
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // Animate once only
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

**CSS**:
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

**Usage**:
```jsx
<section className="animate-on-scroll">
  {/* Content animates in when scrolled into view */}
</section>
```

---

## Accessibility: Reduced Motion

### CSS Media Query

**All animations MUST respect prefers-reduced-motion**:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Keep essential state changes, remove motion */
  .animate-fadeInUp {
    animation: fadeIn 0.01ms !important;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Disable transform-based animations */
  .animate-bounce,
  .animate-float,
  .animate-pulse-glow {
    animation: none !important;
  }

  /* Keep visibility changes for accordions */
  .accordion-trigger[data-state="open"] svg {
    transform: rotate(180deg);
    transition: none !important;
  }
}
```

### JavaScript Detection:

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable background video
  document.querySelectorAll('video').forEach(v => v.pause());

  // Skip timeline animation, show immediately
  document.querySelector('.timeline').classList.add('no-animation');
}
```

---

## Performance Optimization

### GPU Acceleration

**Only animate these properties** (GPU-accelerated):
- `transform` (translateX, translateY, scale, rotate)
- `opacity`

**Avoid animating** (CPU-intensive):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`

### Will-Change Property

**Use sparingly** for complex animations:
```css
.timeline-line {
  will-change: width;
}

.feature-card:hover {
  will-change: transform, box-shadow;
}

/* Remove after animation */
.timeline-line.animated {
  will-change: auto;
}
```

**Guidelines**:
- Only apply to elements actively animating
- Remove after animation completes
- Don't apply to more than 3-4 elements simultaneously

### Animation Frame Budget

**Target**: 60fps = 16.67ms per frame

**Budget Allocation**:
- Layout: <5ms
- Paint: <5ms
- Composite: <3ms
- JavaScript: <4ms

**Testing**:
```javascript
// Chrome DevTools Performance tab
// Check for:
// - No layout thrashing
// - Minimal paint areas
// - GPU compositing for animations
```

---

## Animation Timing Cheat Sheet

| Element | Animation | Duration | Easing | Delay |
|---------|-----------|----------|--------|-------|
| Hero headline | fadeInUp | 600ms | ease-out | 0ms |
| Hero subtitle | fadeInUp | 600ms | ease-out | 100ms |
| Hero CTA | fadeInUp + pulse-glow | 600ms + 2s loop | ease-out | 200ms |
| Trust badge 1-4 | fadeInUp | 400ms | ease-out | 0-300ms (stagger 100ms) |
| Trust icon hover | wiggle | 300ms | back-out | on hover |
| Timeline line | drawLine | 1500ms | ease-out | on scroll |
| Timeline nodes | nodePulse | 600ms | back-out | 400/900/1400ms |
| Feature cards | fadeInUp | 400ms | ease-out | 0-480ms (stagger 80ms) |
| Feature card hover | lift + shadow | 250ms | ease-out | on hover |
| Feature icon hover | float | 2s loop | ease-in-out | on hover |
| Use case image | zoom | 500ms | ease-out | on hover |
| Accordion item | accordion-down/up | 200ms | ease-out | on click |
| FAQ chevron | rotate | 200ms | ease-out | on click |
| Scroll indicator | bounce | 1s loop | built-in | 500ms |
| CTA gradient | gradientShift | 10s loop | ease | 0ms |
| CTA button | pulse-glow | 2s loop | ease-in-out | 0ms |

---

## Tailwind Config Extensions

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'drawLine': 'drawLine 1.5s ease-out forwards',
        'float': 'float 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 20px rgba(139, 126, 255, 0.3)',
          },
          '50%': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 30px rgba(139, 126, 255, 0.5)',
          },
        },
        drawLine: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg) scale(1.05)' },
          '75%': { transform: 'rotate(-3deg) scale(1.05)' },
        },
      },
    },
  },
};
```

---

## Implementation Checklist

- [ ] Add all custom animations to index.css
- [ ] Extend Tailwind config with keyframes
- [ ] Implement Intersection Observer for scroll animations
- [ ] Add prefers-reduced-motion media query
- [ ] Test all animations at 60fps (Chrome DevTools Performance)
- [ ] Verify GPU compositing (Chrome Layers panel)
- [ ] Test reduced motion mode (System Settings)
- [ ] Validate animation accessibility (no flashing/strobing)
- [ ] Add loading states with shimmer animation
- [ ] Implement stagger patterns for card grids
- [ ] Test on mobile devices (reduced animation complexity)
- [ ] Optimize will-change usage
- [ ] Add keyboard focus animations (outline transitions)

---

**Performance Target**:
- 60fps for all animations
- <16ms per frame
- No jank on scroll
- Smooth on mid-range devices (iPhone 12, Pixel 5)

**Accessibility Target**:
- Complete reduced motion support
- No seizure-inducing flashing
- Keyboard navigation smooth
- Screen reader compatible (no content hidden by animations)

---

**Next**: See media-integration.md for photo/video specifications
