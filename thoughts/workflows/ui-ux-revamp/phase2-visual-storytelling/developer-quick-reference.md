# Developer Quick Reference: Visual Implementation

**Purpose:** Fast lookup for developers implementing visual narrative
**Companion to:** visual-narrative-guide.md (strategy) + visual-flow-diagram.md (structure)

---

## Color Palette (Copy-Paste Ready)

### Primary Gradient (Hero + Final CTA)

```css
background: linear-gradient(
  180deg,
  hsl(262, 83%, 58%) 0%,
  hsl(252, 75%, 48%) 50%,
  hsl(242, 85%, 38%) 100%
);
```

**Tailwind equivalent:**
```jsx
className="bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800"
```

---

### Section Backgrounds

```jsx
Hero:             bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800
Trust Bar:        bg-background (white)
How It Works:     bg-muted/20
Interactive Demo: bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5
Features:         bg-background (white)
Use Cases:        bg-gradient-to-b from-background via-muted/10 to-background
Social Proof:     bg-muted/50
FAQ:              bg-background (white)
Final CTA:        bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800
```

---

## Typography Scale

```jsx
Hero Headline:    text-6xl md:text-7xl lg:text-8xl font-extrabold
Hero Subtitle:    text-xl md:text-2xl
Section Titles:   text-4xl font-bold
Card Titles:      text-2xl font-semibold
Body Text:        text-base leading-relaxed
Small Text:       text-sm text-muted-foreground
Badges:           text-xs font-medium
```

---

## Spacing Scale

```jsx
Section Padding (Desktop):
  py-24    - Standard sections (How It Works, Features, Social Proof, FAQ)
  py-32    - Emphasized sections (Hero, Demo, Use Cases, Final CTA)

Section Padding (Mobile):
  py-16    - Standard
  py-20    - Emphasized

Container Max Widths:
  max-w-3xl  - Final CTA (narrow focus)
  max-w-4xl  - FAQ (readability)
  max-w-5xl  - Interactive Demo
  max-w-6xl  - Features, Social Proof, How It Works
  max-w-7xl  - Use Cases, Trust Bar (wide)

Gap Between Items:
  gap-4   - Tight (FAQ items)
  gap-6   - Standard (card interior)
  gap-8   - Generous (feature cards, use cases)
  gap-12  - Extra (use case cards)
  gap-16  - Section spacing (social proof columns)
```

---

## Icon Specifications

### Icon Sizes

```jsx
UI Icons (nav, menu):        w-5 h-5  (20px)
Section Icons:               w-8 h-8  (32px)
Feature Card Icons:          w-10 h-10 or w-12 h-12 (40-48px)
Timeline Node Icons:         w-10 h-10 (40px)
Trust Bar Icons:             w-8 h-8  (32px)
Scroll Indicator:            w-10 h-10 (40px)
```

### Icon Colors

```jsx
Primary Icons:      text-primary
Muted Icons:        text-muted-foreground
White Icons:        text-white (on gradients)
Brand Logos:        [Use full color SVGs, don't apply text color]
```

### Icon Backgrounds (Feature Cards, Timeline Nodes)

```jsx
// Circle container for icon
<div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
  <Icon className="w-10 h-10 text-primary" />
</div>

// Alternative with gradient background
<div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
  <Icon className="w-10 h-10 text-primary" />
</div>
```

---

## Animation Snippets

### 1. Hero Fade-In Cascade

```jsx
// Framer Motion example
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  Headline
</motion.h1>

<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
>
  Subtitle
</motion.p>

<motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.6 }}
>
  CTA
</motion.button>
```

---

### 2. CTA Button Pulse (Continuous)

```jsx
// Tailwind + Custom CSS
<button className="animate-pulse-subtle">
  Create Time Capsule
</button>

// In CSS
@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}
```

---

### 3. Scroll Indicator Bounce

```jsx
<ChevronDown className="w-10 h-10 animate-bounce" />

// Or custom bounce (slower)
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 1.5s ease-in-out infinite;
}
```

---

### 4. Timeline Line Drawing

```jsx
// SVG with CSS animation
<svg>
  <line
    x1="0" y1="0" x2="100%" y2="0"
    stroke="currentColor"
    strokeWidth="4"
    className="timeline-line"
  />
</svg>

<style>
.timeline-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 1.5s ease-in-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
```

---

### 5. Feature Card Hover

```jsx
<div className="group rounded-2xl border border-border/40 p-8 bg-card shadow-sm hover:shadow-lg transition-all duration-250 hover:-translate-y-2">
  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
    <Icon className="w-10 h-10 text-primary group-hover:animate-float" />
  </div>
  <h3>Feature Title</h3>
  <p>Description...</p>
</div>

// Float animation
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

---

### 6. FAQ Accordion

```jsx
// React state-based
const [expanded, setExpanded] = useState(false);

<div className="border-b border-border/50 py-4">
  <button
    onClick={() => setExpanded(!expanded)}
    className="w-full flex items-center justify-between text-left hover:bg-muted/20 p-2 rounded transition-colors"
  >
    <span className="text-lg font-semibold">Question?</span>
    <ChevronDown
      className={`w-6 h-6 transition-transform duration-300 ${
        expanded ? 'rotate-180' : 'rotate-0'
      }`}
    />
  </button>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
    }`}
  >
    <p className="text-base text-muted-foreground leading-relaxed pr-12">
      Answer content...
    </p>
  </div>
</div>
```

---

### 7. Scroll-Based Reveal (Intersection Observer)

```jsx
import { useEffect, useRef, useState } from 'react';

function ScrollReveal({ children, className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Usage
<ScrollReveal>
  <h2>Section Title</h2>
</ScrollReveal>
```

---

### 8. Staggered Card Reveal

```jsx
// Framer Motion with stagger
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms between each
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

<motion.div
  className="grid grid-cols-3 gap-8"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
>
  {features.map((feature, i) => (
    <motion.div key={i} variants={item}>
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

---

## Reduced Motion Support

```jsx
// Add to global CSS
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// Or use Tailwind's motion-safe/motion-reduce:
<div className="motion-safe:animate-pulse motion-reduce:animate-none">
  Content
</div>
```

---

## Button Styles

### Primary CTA (Large)

```jsx
<button className="px-12 py-6 text-xl font-semibold bg-white text-primary rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-200">
  Create Time Capsule
</button>
```

### Primary CTA (Standard)

```jsx
<button className="px-8 py-4 text-lg font-semibold bg-primary text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  Get Started
</button>
```

### Secondary Button

```jsx
<button className="px-6 py-3 text-base font-medium bg-transparent border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200">
  Learn More
</button>
```

---

## Card Styles

### Feature Card

```jsx
<div className="group rounded-2xl border border-border/40 p-8 bg-card shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-250">
  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
    <Icon className="w-10 h-10 text-primary group-hover:animate-float" />
  </div>
  <h3 className="text-2xl font-semibold mb-3">Feature Title</h3>
  <p className="text-base text-muted-foreground leading-relaxed">
    Description of the feature goes here...
  </p>
</div>
```

### Use Case Card (Alternating Layout)

```jsx
// Card 1 (Image Left)
<div className="flex flex-col md:flex-row rounded-3xl bg-card shadow-xl overflow-hidden">
  <div className="md:w-1/2">
    <img src="..." alt="..." className="w-full h-full object-cover transition-transform duration-400 hover:scale-105" />
  </div>
  <div className="md:w-1/2 p-10">
    <Icon className="w-12 h-12 text-primary mb-4" />
    <span className="text-sm font-semibold uppercase tracking-wider text-primary">Personal Milestones</span>
    <h3 className="text-3xl font-bold mb-4">Title Here</h3>
    <blockquote className="text-xl italic text-muted-foreground mb-4">"Quote here..."</blockquote>
    <p className="text-base leading-relaxed">Description...</p>
  </div>
</div>

// Card 2 (Image Right) - reverse flex direction
<div className="flex flex-col md:flex-row-reverse rounded-3xl bg-card shadow-xl overflow-hidden">
  {/* Same content, flex-row-reverse */}
</div>
```

---

## Timeline Component

```jsx
<div className="relative">
  {/* Timeline Line (Desktop: Horizontal, Mobile: Vertical) */}
  <div className="absolute top-10 left-0 w-full h-1 md:block hidden">
    <div className="h-full bg-gradient-to-r from-primary to-purple-600 timeline-line"></div>
  </div>
  <div className="absolute left-10 top-0 h-full w-1 md:hidden block">
    <div className="w-full bg-gradient-to-b from-primary to-purple-600 timeline-line"></div>
  </div>

  {/* Steps */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
    {steps.map((step, i) => (
      <div key={i} className="relative">
        {/* Node */}
        <div className="w-20 h-20 mx-auto rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center mb-6 relative z-10">
          <Icon className="w-10 h-10 text-primary" />
        </div>

        {/* Content */}
        <div className="text-center md:text-center">
          <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
          <p className="text-base text-muted-foreground mb-3">{step.description}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {step.time}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Interactive Demo States

```jsx
const [activeState, setActiveState] = useState(0);
const states = ['create', 'storage', 'delivery'];

<div className="bg-card rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
  {/* Tabs */}
  <div className="flex gap-2 mb-8">
    {states.map((state, i) => (
      <button
        key={state}
        onClick={() => setActiveState(i)}
        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          activeState === i
            ? 'bg-primary text-white'
            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
        }`}
      >
        {state.charAt(0).toUpperCase() + state.slice(1)}
      </button>
    ))}
  </div>

  {/* Content Panel */}
  <div className="relative h-96">
    {states.map((state, i) => (
      <div
        key={state}
        className={`absolute inset-0 transition-opacity duration-300 ${
          activeState === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* State-specific content */}
        <div className="flex gap-8">
          <div className="w-2/3">
            <img src={`mockup-${state}.png`} alt={state} className="w-full rounded-lg border-2 border-border/20" />
          </div>
          <div className="w-1/3">
            <h4 className="text-xl font-bold mb-3">Step {i + 1}</h4>
            <p className="text-base text-muted-foreground">Description...</p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Progress Dots */}
  <div className="flex justify-center gap-2 mt-6">
    {states.map((_, i) => (
      <div
        key={i}
        className={`transition-all duration-200 rounded-full ${
          activeState === i
            ? 'w-3 h-3 bg-primary'
            : 'w-2 h-2 bg-muted-foreground/30'
        }`}
      />
    ))}
  </div>
</div>
```

---

## Trust Bar Badges

```jsx
const badges = [
  { icon: Github, label: 'Powered by GitHub', sublabel: 'Your data, your repo' },
  { icon: Mail, label: 'Sent via Gmail', sublabel: 'Reliable delivery' },
  { icon: Shield, label: 'Encrypted Storage', sublabel: 'Private & secure' },
  { icon: Gift, label: '100% Free', sublabel: 'No credit card', special: true },
  { icon: Clock, label: 'Automated', sublabel: 'Hourly precision' },
];

<div className="flex flex-wrap justify-center gap-8 py-8">
  {badges.map((badge, i) => (
    <div
      key={i}
      className={`flex flex-col items-center text-center hover:bg-muted/30 hover:-translate-y-1 p-4 rounded-lg transition-all duration-200 ${
        badge.special ? 'animate-pulse-twice' : ''
      }`}
    >
      <badge.icon className="w-8 h-8 text-primary mb-2 group-hover:rotate-6 transition-transform" />
      <span className="text-sm font-semibold">{badge.label}</span>
      <span className="text-xs text-muted-foreground">{badge.sublabel}</span>
    </div>
  ))}
</div>

// Double pulse animation for "Free" badge
@keyframes pulse-twice {
  0%, 40%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.15);
  }
}

.animate-pulse-twice {
  animation: pulse-twice 2s ease-in-out;
  animation-delay: 2s;
}
```

---

## Responsive Image Component

```jsx
<picture>
  <source
    srcSet="/images/use-case-1-800w.webp 800w, /images/use-case-1-1200w.webp 1200w"
    type="image/webp"
  />
  <source
    srcSet="/images/use-case-1-800w.jpg 800w, /images/use-case-1-1200w.jpg 1200w"
    type="image/jpeg"
  />
  <img
    src="/images/use-case-1-800w.jpg"
    alt="Family celebrating birthday with cake and candles"
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover"
  />
</picture>
```

---

## Accessibility Helpers

### Skip Navigation

```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

### Screen Reader Only Text

```jsx
<span className="sr-only">Additional context for screen readers</span>

// Or use Tailwind's sr-only class
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Visible Rings

```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Button
</button>
```

---

## Testing Checklist

### Visual QA
- [ ] All gradients render correctly
- [ ] Icons are consistent size/stroke
- [ ] Spacing feels balanced (not cramped/too loose)
- [ ] Typography hierarchy is clear
- [ ] Colors meet contrast ratios (use browser DevTools)

### Animation QA
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No jank/stutter (60fps maintained)
- [ ] Timing feels natural (not too fast/slow)
- [ ] Scroll-triggered animations fire at right moment

### Responsive QA
- [ ] Test at 320px, 768px, 1024px, 1920px widths
- [ ] Touch targets are 44x44px minimum (mobile)
- [ ] Text remains readable at all sizes
- [ ] Images don't distort (maintain aspect ratio)

### Accessibility QA
- [ ] Keyboard navigation works (tab through all interactive elements)
- [ ] Focus indicators are visible
- [ ] Screen reader announces content logically
- [ ] Color isn't sole conveyor of information
- [ ] All images have alt text

### Performance QA
- [ ] Total page weight <2MB
- [ ] Images are lazy-loaded
- [ ] Critical CSS is inline
- [ ] Lighthouse score >90

---

## Common Gotchas

1. **Gradient not showing:** Ensure parent has height/min-height
2. **Animation not triggering:** Check Intersection Observer threshold
3. **Icons misaligned:** Use `flex items-center justify-center`
4. **Text unreadable on gradient:** Add text shadow or overlay
5. **Hover states on mobile:** Use `md:hover:` prefix to disable on touch
6. **FAQ height jump:** Use max-height with buffer (not exact height)
7. **Timeline line not drawing:** SVG needs viewBox attribute
8. **Images loading slow:** Compress to <100KB, use WebP

---

## File Structure Reference

```
/src
  /components
    /landing
      Hero.tsx
      TrustBar.tsx
      HowItWorks.tsx
      InteractiveDemo.tsx
      Features.tsx
      UseCases.tsx
      SocialProof.tsx
      FAQ.tsx
      FinalCTA.tsx
  /lib
    /animations
      scroll-reveal.tsx
      stagger-children.tsx
    /utils
      cn.ts (classnames utility)
  /styles
    globals.css (includes animation keyframes)

/public
  /images
    /hero
      hero-bg.mp4
      hero-bg-poster.jpg
    /use-cases
      personal-milestone.webp
      professional-reminder.webp
      long-distance.webp
      family-capsule.webp
    /logos
      github.svg
      gmail.svg
      whatsapp.svg
```

---

## Environment-Specific Notes

### Development
- Use placeholder images (via Unsplash URLs)
- Enable verbose animation logging
- Show visual guides (outlines, grids)

### Production
- Compress all images
- Minify CSS/JS
- Enable lazy loading
- Set up CDN for static assets

---

## Quick Troubleshooting

**Problem:** Animations not smooth
**Solution:** Use `transform` and `opacity` only, add `will-change: transform` sparingly

**Problem:** Layout shift on scroll animations
**Solution:** Reserve space with min-height or skeleton loaders

**Problem:** Colors look different across browsers
**Solution:** Use HSL values (better browser consistency than hex)

**Problem:** Reduced motion not working
**Solution:** Ensure media query is at root level, use `!important`

**Problem:** Icons fuzzy
**Solution:** Ensure SVG viewBox is correct, size is even numbers

---

## Additional Resources

- **Tailwind Docs:** tailwindcss.com
- **Framer Motion:** framer.com/motion
- **Lucide Icons:** lucide.dev
- **Accessibility:** webaim.org/resources/contrastchecker
- **Performance:** web.dev/measure

---

*Keep this doc open while coding - it's your visual implementation cheat sheet.*
