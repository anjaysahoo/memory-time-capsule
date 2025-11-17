# Brand Guidelines Quick Reference

**Project:** Memory Time Capsule
**Last Updated:** 2025-11-17
**For:** Phase 3 Frontend Implementation

---

## Brand Essence (One-Liner)

**Memory Time Capsule bridges present to future, wrapping meaningful moments in trust (GitHub/Gmail) and delivering them with precision and emotion.**

---

## Color Palette (TO BE DEFINED BY UI DESIGNER)

### Primary Colors

```css
/* Awaiting UI Designer decision */
:root {
  --brand-primary: [H] [S%] [L%];      /* Time/Future theme */
  --brand-secondary: [H] [S%] [L%];    /* Trust/Technical */
  --brand-accent: [H] [S%] [L%];       /* Memory/Warmth */
}
```

**Options for Designer Consideration:**

| Theme | Color | Hex | Use Case |
|-------|-------|-----|----------|
| Time/Future | Deep Purple | `#6B46C1` | Current gradient uses purple-700 |
| Time/Future | Teal | `#0D9488` | Modern, fresh alternative |
| Memory/Warmth | Amber | `#F59E0B` | Warm accent for emotional moments |
| Trust | GitHub Dark | `#181717` | Literal brand integration |

### Semantic Colors (Approved)

```css
:root {
  --success: 142 76% 36%;     /* Green #10B981 */
  --warning: 38 92% 50%;      /* Amber #F59E0B */
  --error: 0 84% 60%;         /* Red #EF4444 */
  --info: 217 91% 60%;        /* Blue #3B82F6 */
}
```

### Usage Rules

**DO:**
- Primary: CTA buttons, icons, links, focus states
- Accent: Hover states, highlights, warm emotional sections
- Secondary: Supporting UI elements, borders, muted areas
- Gradients: Hero, CTA sections (primary → accent)

**DON'T:**
- Use more than 3 brand colors on single element
- Use accent as main CTA (reserve for warmth/emotion)
- Mix gradients inconsistently (define 2-3 gradient patterns max)

---

## Icon System (APPROVED)

### Primary Library: Lucide React

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```tsx
import { Clock, Shield, Mail } from 'lucide-react';

<Clock className="w-12 h-12 text-primary" />
```

### Icon Replacement Map

| Current Emoji | Lucide Icon | Component | Size |
|--------------|-------------|-----------|------|
| 🎁 | `Gift` | Hero | 24px |
| 1️⃣ | `Link` or `GitBranch` | Timeline Step 1 | 48px |
| 2️⃣ | `Upload` or `FileVideo` | Timeline Step 2 | 48px |
| 3️⃣ | `Send` or `Calendar` | Timeline Step 3 | 48px |
| 🎥 | `FileVideo` | Features | 48px |
| 🔒 | `Shield` or `ShieldCheck` | Features | 48px |
| ⏰ | `Clock` | Features | 48px |
| 📧 | `Mail` | Features | 48px |
| 💰 | `Gift` or `Sparkles` | Features | 48px |
| 📱 | `Share2` | Features | 48px |

### Icon Sizing Scale

| Context | Size (px) | Tailwind Class |
|---------|-----------|----------------|
| UI elements | 16-20 | `w-4 h-4` to `w-5 h-5` |
| Hero/CTA | 24 | `w-6 h-6` |
| Section icons | 32-40 | `w-8 h-8` to `w-10 h-10` |
| Feature cards | 48 | `w-12 h-12` |
| Decorative | 64+ | `w-16 h-16` |

### Icon Colors

**Pattern:**
```tsx
// Inherit text color
<Clock className="w-12 h-12" />

// Explicit brand color
<Shield className="w-12 h-12 text-primary" />

// Muted for supporting
<FileVideo className="w-5 h-5 text-muted-foreground" />
```

### Accessibility

**Decorative icons:**
```tsx
<Clock className="w-6 h-6" aria-hidden="true" />
<span>Precise Timing</span>
```

**Functional icons (button with icon only):**
```tsx
<button aria-label="Close menu">
  <X className="w-6 h-6" />
</button>
```

---

## Brand Logos (Third-Party)

### GitHub Logo

**Source:** @svgl registry
**Fetch Command:** Use MCP shadcn tool to search svgl registry

**Variants:**
- Black mark (#181717) on light backgrounds
- White mark (#FFFFFF) on dark backgrounds

**Sizes:**
- Hero: 24px height
- Trust Bar: 32px height
- Timeline: 20px height
- Tech section: 40px height

**Clear Space:** Minimum 1x logo height on all sides

**Usage:**
```tsx
// Placeholder until svgl fetch
<img src="/logos/github.svg" alt="GitHub" className="h-6" />
```

**Placement:**
- Below hero CTA: "Powered by GitHub & Gmail"
- Trust Indicators Bar: Icon + "GitHub Storage"
- How It Works Step 1: Supporting icon

---

### Gmail Logo

**Source:** @svgl registry (or Lucide `Mail` fallback)

**Variants:**
- Full color (red/blue/yellow/green)
- Monochrome alternative: Lucide `Mail` in primary color

**Sizes:** Same as GitHub (24px, 32px, 20px, 40px)

**Usage:**
```tsx
// Option 1: Official logo
<img src="/logos/gmail.svg" alt="Gmail" className="h-6" />

// Option 2: Lucide fallback
<Mail className="w-6 h-6 text-primary" />
```

**Placement:**
- Below hero CTA
- Trust Indicators Bar: Icon + "Gmail Delivery"
- How It Works Step 3: Supporting icon
- Features: Email Notifications card

---

### WhatsApp Logo

**Source:** @svgl registry

**Variant:** Official green (#25D366) or white

**Size:** 24px, 32px, 48px

**Usage:**
```tsx
<img src="/logos/whatsapp.svg" alt="WhatsApp" className="h-12" />
```

**Placement:**
- Features: WhatsApp Sharing card (48px icon)

---

## Typography (TO BE DEFINED BY UI DESIGNER)

### Font Families (Pending)

**Options for Designer:**
1. **Modern Sans:** Inter, Manrope, Outfit
2. **System Stack:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
3. **Google Fonts:** Poppins, Work Sans, DM Sans

**Recommendation:** System stack for performance, Google Font for brand personality if needed.

### Type Scale (Tailwind Default - Approved)

| Name | Size | Tailwind | Use Case |
|------|------|----------|----------|
| xs | 12px | `text-xs` | Fine print, captions |
| sm | 14px | `text-sm` | Supporting text, labels |
| base | 16px | `text-base` | Body text |
| lg | 18px | `text-lg` | Large body, subheadings |
| xl | 20px | `text-xl` | Subheadings |
| 2xl | 24px | `text-2xl` | Card titles |
| 3xl | 30px | `text-3xl` | Small headings |
| 4xl | 36px | `text-4xl` | Section headings |
| 5xl | 48px | `text-5xl` | Page title (mobile) |
| 6xl | 60px | `text-6xl` | Page title (desktop) |

### Font Weights (Approved)

| Weight | Value | Tailwind | Use Case |
|--------|-------|----------|----------|
| Normal | 400 | `font-normal` | Body text |
| Medium | 500 | `font-medium` | UI elements, emphasis |
| Semibold | 600 | `font-semibold` | Subheadings, card titles |
| Bold | 700 | `font-bold` | Headings, CTAs |

### Line Heights

| Context | Line Height | Tailwind |
|---------|-------------|----------|
| Headings | 1.2 | `leading-tight` |
| Body text | 1.5 | `leading-normal` |
| UI elements | 1 | `leading-none` |

---

## Spacing System (Approved)

### Tailwind Scale (8px base)

```javascript
padding/margin: {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
}
```

### Section Padding

| Breakpoint | Vertical Padding | Tailwind |
|------------|------------------|----------|
| Mobile | 64-80px | `py-16` to `py-20` |
| Tablet | 80-96px | `py-20` to `py-24` |
| Desktop | 96-128px | `py-24` to `py-32` |

**Hero/CTA:** `py-32` (128px) for emphasis

### Component Spacing

| Component | Gap Between Items | Tailwind |
|-----------|-------------------|----------|
| Timeline steps | 48px | `gap-12` |
| Feature cards | 32px | `gap-8` |
| FAQ items | 16px | `gap-4` |
| Trust badges | 32px | `gap-8` |

---

## Component Styles

### Buttons

**Primary CTA:**
```tsx
<Button
  size="lg"
  className="bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
>
  Get Started Free
</Button>
```

**States:**
- Default: `bg-primary text-white`
- Hover: `hover:bg-primary/90 hover:scale-105`
- Active: `active:scale-95`
- Focus: `focus:outline-2 focus:outline-offset-4 focus:outline-primary`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

**Secondary/Outline:** (Define in Phase 2 if needed)

### Cards

**Feature Cards:**
```tsx
<Card className="transition-all duration-250 hover:-translate-y-2 hover:shadow-xl hover:border-primary">
  <CardHeader>
    <Shield className="w-12 h-12 text-primary mb-2" aria-hidden="true" />
    <CardTitle>Secure & Private</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Description text...</p>
  </CardContent>
</Card>
```

**States:**
- Default: `bg-white border-border shadow-sm`
- Hover: `hover:-translate-y-2 hover:shadow-xl hover:border-primary`

### Shadows (TO BE REFINED BY UI DESIGNER)

| Name | Tailwind | Use Case |
|------|----------|----------|
| Small | `shadow-sm` | Default cards |
| Medium | `shadow-md` | Dropdowns, tooltips |
| Large | `shadow-lg` | Modals, overlays |
| XL | `shadow-xl` | Card hover states |
| 2XL | `shadow-2xl` | Video player, major elements |

---

## Animation System

### Timing & Easing

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-timeline: 1500ms;

  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Common Animations

**Button Hover:**
```tsx
className="transition-all duration-200 hover:scale-105"
```

**Card Hover:**
```tsx
className="transition-all duration-250 hover:-translate-y-2"
```

**Fade In (Scroll):**
```tsx
className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-600"
```

**Timeline Line Draw:**
```css
@keyframes drawLine {
  from { width: 0%; }
  to { width: 100%; }
}

.timeline-line {
  animation: drawLine 1500ms ease-in-out;
}
```

### Reduced Motion Support (CRITICAL)

**Global:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Component-level:**
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Conditional animation
<div className={prefersReducedMotion ? 'opacity-100' : 'animate-fade-in'}>
```

---

## Accessibility Standards

### Color Contrast Requirements

**WCAG AA:**
- Normal text (16px): **4.5:1** minimum
- Large text (18pt/24px bold): **3:1** minimum
- UI components/icons: **3:1** minimum against adjacent colors
- Focus indicators: **3:1** minimum

**Testing Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Browser DevTools: Built-in contrast checker in Inspect Element

### Focus Indicators

**Visible focus ring:**
```tsx
className="focus:outline-2 focus:outline-offset-4 focus:outline-primary"
```

**Ensure 3:1 contrast** against background.

### Touch Targets

**Minimum size:** 44x44px on mobile (WCAG 2.1 Level AA)

```tsx
<button className="min-w-[44px] min-h-[44px]">
```

### Semantic HTML

**DO:**
```tsx
<main>
  <section aria-labelledby="how-it-works">
    <h2 id="how-it-works">How It Works</h2>
    ...
  </section>
</main>
```

**DON'T:**
```tsx
<div> {/* Should be <main> */}
  <div> {/* Should be <section> */}
    <span className="text-4xl">How It Works</span> {/* Should be <h2> */}
  </div>
</div>
```

### Alt Text

**Informative images:**
```tsx
<img src="family.jpg" alt="Multi-generational family celebrating birthday with cake and candles" />
```

**Decorative images:**
```tsx
<img src="gradient-bg.jpg" alt="" role="presentation" />
```

---

## Responsive Breakpoints

### Tailwind Defaults (Approved)

| Breakpoint | Min Width | Tailwind Prefix |
|------------|-----------|-----------------|
| Mobile | 0px | (default) |
| Small | 640px | `sm:` |
| Medium | 768px | `md:` |
| Large | 1024px | `lg:` |
| XL | 1280px | `xl:` |
| 2XL | 1536px | `2xl:` |

### Layout Patterns

**Mobile (default):**
- Single column
- Stacked sections
- Full-width buttons
- 24px+ icons
- py-16 to py-20 spacing

**Tablet (md:):**
- 2-column grids (features)
- Side-by-side layouts (use cases)
- py-20 to py-24 spacing

**Desktop (lg:):**
- 3-column grids (features, timeline)
- Max-width containers (max-w-6xl)
- 32-48px icons
- py-24 to py-32 spacing
- Hover states active

---

## Brand Voice & Messaging

### Tone Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| **Warm** | Genuine emotion, not saccharine | "Create time capsules for moments that matter" |
| **Smart** | Technical credibility, not elitist | "Stored in your private GitHub repository" |
| **Hopeful** | Optimistic, not naive | "Send messages to the future" |
| **Playful** | Delightful, not childish | Gentle animations, Easter eggs |

### Writing Guidelines

**DO:**
- Use "you/your" (personal)
- Be specific ("100MB", "hourly precision", "6-digit PIN")
- Lead with benefits ("Unlock exactly when you want")
- Show, don't tell ("I recorded a message to my daughter...")

**DON'T:**
- Use jargon without explanation
- Make empty promises ("best", "perfect", "revolutionary")
- Be overly formal or corporate
- Rely on clichés

---

## Implementation Checklist

### Phase 3 Frontend Development

**Week 1 - Icon System:**
- [ ] Install `lucide-react`
- [ ] Replace all 9 emojis with Lucide icons (see replacement map above)
- [ ] Add `aria-hidden="true"` to decorative icons
- [ ] Test icon sizing at all breakpoints

**Week 1 - Color Palette:**
- [ ] Implement brand color tokens in `index.css`
- [ ] Update gradient backgrounds (hero, CTA)
- [ ] Test all color contrast ratios (WCAG AA)
- [ ] Define focus ring colors

**Week 1 - Logo Integration:**
- [ ] Fetch GitHub, Gmail, WhatsApp logos from @svgl
- [ ] Add logos to hero section (below CTA)
- [ ] Create Trust Indicators Bar (new Section 2)
- [ ] Test logo contrast on all backgrounds

**Week 2 - Component Styling:**
- [ ] Implement button hover/focus/active states
- [ ] Add card hover animations
- [ ] Define shadow system
- [ ] Test all interactive states

**Week 2 - Photography:**
- [ ] Integrate 4 use case photos
- [ ] Add alt text to all images
- [ ] Implement lazy loading
- [ ] Test responsive image sizing

**Week 3 - Animations:**
- [ ] Timeline line drawing animation
- [ ] Scroll-triggered fade-ins
- [ ] Button/card micro-interactions
- [ ] Implement `prefers-reduced-motion` support

**Week 3 - Accessibility:**
- [ ] Test keyboard navigation (all interactive elements)
- [ ] Verify focus indicators (3:1 contrast)
- [ ] Run WAVE or axe accessibility audit
- [ ] Test with screen reader

---

## Quick Reference: DO's and DON'Ts

### Visual Design

**DO:**
- Use Lucide icons (consistent, professional)
- Show GitHub/Gmail logos (build trust)
- Use warm accent colors (emotional connection)
- Add authentic photography (human touch)
- Implement smooth animations (modern polish)

**DON'T:**
- Use emojis as icons (inconsistent, platform-dependent)
- Hide brand integrations (lost trust opportunity)
- Use only cold colors (lacks warmth/memory theme)
- Rely on abstract graphics only (lacks human connection)
- Overanimate (distracting, not accessible)

### Accessibility

**DO:**
- Test all color contrasts (4.5:1 / 3:1)
- Provide alt text for images
- Ensure 44x44px touch targets (mobile)
- Support `prefers-reduced-motion`
- Use semantic HTML (`<main>`, `<section>`, `<h1-6>`)

**DON'T:**
- Assume default ShadCN colors pass WCAG (test!)
- Use generic alt text ("image", "photo")
- Make tap targets smaller than 44px
- Ignore motion preferences
- Use divs for everything

### Brand Voice

**DO:**
- Be warm and personal
- Show real use cases
- Explain technical terms
- Lead with benefits

**DON'T:**
- Be corporate or cold
- Use abstract examples only
- Use jargon without context
- List features without explaining why they matter

---

## Contact & Support

**For brand questions:** Reference `brand-consistency-audit.md` (comprehensive analysis)
**For implementation help:** Reference this document (quick answers)
**For UX decisions:** Reference `handoff-to-ui.md` (layout structure)
**For media assets:** Reference `media-assets.md` (complete inventory)

**Color/typography decisions pending:** UI Designer to complete in Phase 2, then update this document.

---

**Last Updated:** 2025-11-17
**Next Update:** After UI Designer defines color palette and typography (Week 1 Phase 2)
