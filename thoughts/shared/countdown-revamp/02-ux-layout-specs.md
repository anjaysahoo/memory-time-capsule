# Layout Specifications - All States

## Responsive Breakpoints
- **Mobile**: 0-767px (primary design target)
- **Tablet**: 768-1023px (transitional)
- **Desktop**: 1024px+ (enhanced)

**Design Philosophy**: Mobile-first with progressive enhancement. All functionality must work perfectly on 375px viewport.

---

## State 1: Loading

### Mobile (375px)
```
┌─────────────────────────────────┐
│   [Stars Background - Full]     │
│                                  │
│                                  │
│        ┌─────────────┐          │
│        │   [Spinner] │          │
│        │   [56x56px] │          │
│        └─────────────┘          │
│                                  │
│   "Preparing your capsule..."   │
│        [14px, opacity 0.7]      │
│                                  │
│                                  │
└─────────────────────────────────┘
```

**Vertical Layout**:
- Content vertically centered in viewport
- Spinner: 56x56px animated gift box icon
- Text: Below spinner, 16px margin-top
- Container padding: 16px horizontal

**Visual Hierarchy**:
1. Stars background (immediate)
2. Spinner (200ms delay)
3. Text (1000ms delay, only if load > 800ms)

### Tablet (768px)
- Spinner increases to 72x72px
- Text size: 16px
- Container padding: 24px

### Desktop (1440px)
- Spinner: 96x96px
- Text size: 18px
- Max-width: None (full viewport)
- Content centered both axes

---

## State 2: Countdown

### Mobile (375px)
```
┌─────────────────────────────────┐
│   [Stars Background - Full]     │
│                                  │
│ ┌─────────────────────────────┐│
│ │     🎁 [Gift Icon 64px]     ││
│ │                             ││
│ │   [Capsule Title]           ││
│ │   32px bold, line 1.2       ││
│ │   LineShadowText            ││
│ │                             ││
│ │   From [Sender Name]        ││
│ │   16px, opacity 0.9         ││
│ │                             ││
│ │ ┌─────────────────────────┐ ││
│ │ │  [Preview Photo]        │ ││
│ │ │  Full width, max 300px  │ ││
│ │ │  rounded-lg             │ ││
│ │ └─────────────────────────┘ ││
│ │                             ││
│ │ ┌─────────────────────────┐ ││
│ │ │ "Preview message..."    │ ││
│ │ │ italic, 14px, bg-muted  │ ││
│ │ └─────────────────────────┘ ││
│ │                             ││
│ │ ┌───┐ ┌───┐ ┌───┐ ┌───┐  ││
│ │ │ D │ │ H │ │ M │ │ S │  ││
│ │ │12 │ │05 │ │43 │ │22 │  ││
│ │ └───┘ └───┘ └───┘ └───┘  ││
│ │ Days  Hours  Mins  Secs   ││
│ │                             ││
│ │ [Unlock Date Info]          ││
│ │ 14px, opacity 0.8           ││
│ │                             ││
│ └─────────────────────────────┘│
│                                  │
└─────────────────────────────────┘
```

**Element Stacking** (top to bottom):
1. Gift icon (64x64px, margin-bottom: 24px)
2. Title (32px, max-width: 90%, margin-bottom: 12px)
3. Sender name (16px, margin-bottom: 32px)
4. Preview photo (if exists, margin-bottom: 16px)
5. Preview message (if exists, margin-bottom: 32px)
6. Countdown timer (margin-bottom: 32px)
7. Divider border-top (1px, opacity 0.2)
8. Unlock info (padding-top: 32px)

**Container**:
- Background: Semi-transparent card (bg-black/80, backdrop-blur)
- Border: 1px white/10
- Border-radius: 16px
- Padding: 32px 24px
- Max-width: 600px (on all devices)
- Margin: 16px (mobile), 32px (tablet+)

**Countdown Timer Boxes**:
- Box size: 64x64px each
- Gap between boxes: 8px
- Background: white/10 with glow
- Border: 1px white/20
- Border-radius: 8px
- Number: 28px bold, white
- Label: 11px uppercase, white/70, margin-top: 8px

**Typography**:
- Title: 32px, font-bold, line-height: 1.2, white
- Sender: 16px, white/90
- Preview message: 14px, italic, white/80
- Date info: 14px, white/80, line-height: 1.6

**Touch Targets**:
- Preview photo (if interactive): Minimum 48px tap area
- All text: Non-interactive, good spacing

### Tablet (768px)
**Changes from mobile**:
- Gift icon: 80px
- Title: 40px
- Countdown boxes: 80x80px
- Number size: 36px
- Container padding: 40px 32px
- Container margin: 32px
- Preview photo max-height: 400px

### Desktop (1440px)
**Changes from tablet**:
- Gift icon: 96px
- Title: 48px (matching hero scale)
- Countdown boxes: 96x96px with 12px gap
- Number size: 44px
- Container padding: 48px 40px
- Container max-width: 700px
- Preview photo max-height: 500px
- Hover effects active (scale on photo, glow on timer)

---

## State 3: Pending

### Mobile (375px)
```
┌─────────────────────────────────┐
│   [Stars Background - Full]     │
│                                  │
│ ┌─────────────────────────────┐│
│ │    ⏳ [Hourglass 64px]      ││
│ │    [Animated sand falling]  ││
│ │                             ││
│ │   Capsule Unlocking...      ││
│ │   28px bold                 ││
│ │                             ││
│ │   This capsule has reached  ││
│ │   its unlock time and is    ││
│ │   being processed.          ││
│ │   16px, line 1.6            ││
│ │                             ││
│ │   You should receive an     ││
│ │   email with the PIN shortly││
│ │   16px, line 1.6            ││
│ │                             ││
│ │ ─────────────────────────── ││
│ │                             ││
│ │   Usually takes < 1 hour    ││
│ │   14px, opacity 0.7         ││
│ │                             ││
│ └─────────────────────────────┘│
│                                  │
└─────────────────────────────────┘
```

**Element Stacking**:
1. Hourglass icon (64px, margin-bottom: 24px)
2. Headline (28px, margin-bottom: 24px)
3. Primary message (16px, margin-bottom: 16px)
4. Email reminder (16px, margin-bottom: 32px)
5. Divider (border-top, opacity 0.2)
6. Timeline info (padding-top: 24px)

**Container**:
- Same styling as Countdown state
- Padding: 32px 24px
- Max-width: 500px (narrower than countdown)
- Text-align: center

**Animation Note**:
- Hourglass rotates 180deg every 3s
- Background pulses subtly (opacity shift)

### Tablet (768px)
- Hourglass: 80px
- Headline: 32px
- Body text: 18px
- Container padding: 40px 32px

### Desktop (1440px)
- Hourglass: 96px
- Headline: 36px
- Container max-width: 600px
- Padding: 48px 40px

---

## State 4: Pin Entry

### Mobile (375px)
```
┌─────────────────────────────────┐
│   [Stars Background - Full]     │
│                                  │
│ ┌─────────────────────────────┐│
│ │     🔓 [Unlock 64px]        ││
│ │                             ││
│ │  Time Capsule Unlocked!     ││
│ │  28px bold                  ││
│ │                             ││
│ │  From [Sender Name]         ││
│ │  16px                       ││
│ │                             ││
│ │ ┌─────────────────────────┐ ││
│ │ │  [Preview Content]      │ ││
│ │ │  (Photo + Message)      │ ││
│ │ └─────────────────────────┘ ││
│ │                             ││
│ │  Enter your 4-digit PIN     ││
│ │  18px medium                ││
│ │                             ││
│ │  ┌──┐ ┌──┐ ┌──┐ ┌──┐     ││
│ │  │  │ │  │ │  │ │  │     ││
│ │  │ 9│ │ 2│ │ 3│ │ 4│     ││
│ │  │  │ │  │ │  │ │  │     ││
│ │  └──┘ └──┘ └──┘ └──┘     ││
│ │                             ││
│ │  [Error message if wrong]   ││
│ │  Red alert box              ││
│ │                             ││
│ │  3 attempts remaining       ││
│ │  14px, opacity 0.7          ││
│ │                             ││
│ │ ─────────────────────────── ││
│ │                             ││
│ │  Check email for PIN        ││
│ │  14px                       ││
│ │                             ││
│ └─────────────────────────────┘│
│                                  │
└─────────────────────────────────┘
```

**Element Stacking**:
1. Unlock icon (64px, margin-bottom: 24px)
2. Headline (28px, margin-bottom: 12px)
3. Sender name (16px, margin-bottom: 32px)
4. Preview content block (margin-bottom: 32px)
5. PIN prompt (18px, margin-bottom: 24px)
6. PIN input boxes (margin-bottom: 16px)
7. Error alert (if active, margin-bottom: 16px)
8. Attempts remaining (14px, margin-bottom: 32px)
9. Divider
10. Email hint (padding-top: 24px)

**PIN Input Boxes**:
- Box size: 64x64px each (thumb-friendly)
- Gap: 12px between boxes
- Background: white/10
- Border: 2px white/20
- Border-radius: 12px
- Number: 32px bold, white, centered
- Focus state: Border white, glow effect
- Error state: Border red/70, shake animation

**Container**:
- Max-width: 500px
- Padding: 32px 24px
- Background: Semi-transparent black/80
- Text-align: center

**Error Alert**:
- Background: red/10
- Border: 1px red/30
- Border-radius: 8px
- Padding: 12px 16px
- Text: 14px, red/90

**Touch Targets**:
- Each PIN box: 64x64px (well above 44px minimum)
- Spacing ensures no accidental taps

### Tablet (768px)
- Unlock icon: 80px
- Headline: 32px
- PIN boxes: 72x72px
- Number size: 36px
- Gap: 16px
- Container padding: 40px 32px

### Desktop (1440px)
- Unlock icon: 96px
- Headline: 36px
- PIN boxes: 80x80px
- Number size: 40px
- Container max-width: 600px
- Padding: 48px 40px
- Hover effects on boxes (glow increase)

---

## State 5: Unlocked

### Mobile (375px)
```
┌─────────────────────────────────┐
│   [Light Background - No Stars] │
│                                  │
│ ┌─────────────────────────────┐│
│ │      🎉 [Celebration]       ││
│ │      64px                   ││
│ │                             ││
│ │   [Capsule Title]           ││
│ │   32px bold                 ││
│ │                             ││
│ │   From [Sender]             ││
│ │   16px muted                ││
│ │                             ││
│ │ ┌─────────────────────────┐ ││
│ │ │  [Preview Content]      │ ││
│ │ └─────────────────────────┘ ││
│ │                             ││
│ │ ┌─────────────────────────┐ ││
│ │ │                         │ ││
│ │ │  [MAIN CONTENT]         │ ││
│ │ │  Photo/Video/Audio/Text │ ││
│ │ │                         │ ││
│ │ │  Full width display     │ ││
│ │ │                         │ ││
│ │ └─────────────────────────┘ ││
│ │                             ││
│ │ ─────────────────────────── ││
│ │                             ││
│ │  Created: Jan 15, 2025      ││
│ │  Unlocked: Feb 14, 2025     ││
│ │  14px, muted, centered      ││
│ │                             ││
│ └─────────────────────────────┘│
│                                  │
└─────────────────────────────────┘
```

**Element Stacking**:
1. Celebration icon (64px, margin-bottom: 16px)
2. Title (32px, margin-bottom: 8px)
3. Sender (16px, margin-bottom: 32px)
4. Preview content (margin-bottom: 32px)
5. Main content (margin-bottom: 32px)
6. Divider
7. Metadata (padding-top: 32px)

**Container**:
- Background: White (or light theme)
- Border: 1px border/20
- Border-radius: 16px
- Padding: 32px 24px
- Max-width: 900px (wider for content)
- Shadow: Subtle elevation
- No backdrop blur (solid background)

**Main Content Area**:
- Photo: Full width, max-height: 600px, object-fit: contain
- Video: Full width, 16:9 aspect ratio, custom controls
- Audio: Full width player, styled controls
- Text: 16px, line-height: 1.8, max-width: 65ch (readability)

**Typography**:
- Title: 32px bold, dark text
- Sender: 16px, text-muted-foreground
- Metadata: 14px, text-muted-foreground, center-aligned

**Background Transition**:
- On unlock, dark stars fade to light solid over 1200ms
- Content maintains position, only background shifts

### Tablet (768px)
- Celebration icon: 80px
- Title: 40px
- Container padding: 40px 32px
- Max-width: 1000px
- Photo max-height: 700px
- Text size: 18px

### Desktop (1440px)
- Celebration icon: 96px
- Title: 48px
- Container padding: 48px 40px
- Max-width: 1200px
- Photo max-height: 800px
- Video: Enhanced controls with hover states
- Text: 18px, max-width: 70ch
- Parallax scroll effect on content (subtle)

---

## Typography Scale

### Mobile (Base)
- **H1 (Page Title)**: 32px, font-bold, line-height: 1.2, letter-spacing: -0.02em
- **H2 (Section Heading)**: 24px, font-semibold, line-height: 1.3
- **H3 (Subsection)**: 20px, font-medium, line-height: 1.4
- **Body Large**: 18px, font-medium, line-height: 1.6
- **Body**: 16px, font-normal, line-height: 1.6
- **Body Small**: 14px, font-normal, line-height: 1.5
- **Caption**: 12px, font-normal, line-height: 1.4, opacity: 0.7

### Tablet (Scale +10%)
- **H1**: 40px
- **H2**: 28px
- **H3**: 22px
- **Body Large**: 20px
- **Body**: 18px
- **Body Small**: 16px
- **Caption**: 14px

### Desktop (Scale +15% from mobile)
- **H1**: 48px (matching hero)
- **H2**: 32px
- **H3**: 24px
- **Body Large**: 22px
- **Body**: 18px
- **Body Small**: 16px
- **Caption**: 14px

**Font Family**: System font stack (consistent with hero)
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Font Weights**:
- Bold: 700 (titles, countdown numbers)
- Semibold: 600 (section headings)
- Medium: 500 (prompts, labels)
- Normal: 400 (body text)

---

## Touch Targets (Mobile)

### Minimum Sizes (iOS/Android Guidelines)
- **Buttons**: 44x44px minimum (iOS), 48x48px (Material)
- **Links**: 44x44px tap area (padding if needed)
- **PIN Inputs**: 64x64px (larger for comfort)
- **Interactive Cards**: Full width, 56px minimum height

### Spacing Between Targets
- Vertical spacing: 16px minimum between interactive elements
- Horizontal spacing: 12px minimum (e.g., PIN boxes)
- If smaller spacing needed, increase target size

### Thumb Zones (Mobile Portrait)
**Comfortable Reach**:
- Bottom third of screen: Primary actions (PIN entry, buttons)
- Middle third: Content viewing (passive)
- Top third: Secondary info (dates, metadata)

**Current Layout Compliance**:
- PIN boxes: Center screen, comfortable reach ✅
- Countdown: Center, passive viewing ✅
- Preview photo: May need scroll, but tap area adequate ✅

---

## Spacing System

### Base Unit
- **4px grid system**: All spacing is multiples of 4
- **8px standard**: Most common spacing unit
- **16px section**: Between distinct sections
- **32px major**: Between major content blocks
- **48px large**: Between states/pages

### Container Padding
- **Mobile**: 16px horizontal, 24px vertical
- **Tablet**: 24px horizontal, 32px vertical
- **Desktop**: 32px horizontal, 40px vertical

### Vertical Rhythm (Gap Between Elements)
- **Icon → Title**: 24px
- **Title → Subtitle**: 12px
- **Subtitle → Content**: 32px
- **Content sections**: 24px
- **Content → Divider**: 32px
- **Divider → Footer**: 24px (padding-top)

### Component Internal Spacing
- **Countdown timer**: 8px gap between boxes (mobile), 12px (desktop)
- **PIN boxes**: 12px gap (mobile), 16px (desktop)
- **Preview card**: 16px padding
- **Alert box**: 12px padding vertical, 16px horizontal

---

## Component Sizes

### Countdown Timer

**Mobile**:
- Box: 64x64px
- Gap: 8px
- Number: 28px bold
- Label: 11px uppercase, 8px margin-top
- Total width: (64×4) + (8×3) = 280px

**Tablet**:
- Box: 80x80px
- Gap: 12px
- Number: 36px
- Label: 12px, 8px margin-top
- Total width: 356px

**Desktop**:
- Box: 96x96px
- Gap: 12px
- Number: 44px
- Label: 14px, 8px margin-top
- Total width: 420px

### Icons (Emoji/SVG)

**Mobile**: 64x64px
**Tablet**: 80x80px
**Desktop**: 96x96px

All icons centered above content with margin-bottom: 24px

### Preview Content

**Photo**:
- Mobile: Full width, max-height: 300px
- Tablet: Full width, max-height: 400px
- Desktop: Full width, max-height: 500px
- Object-fit: contain
- Border-radius: 12px
- Border: 1px white/10 (on dark bg)

**Message Box**:
- Full width
- Padding: 16px
- Background: muted/50 (dark bg) or muted (light bg)
- Border: 1px border
- Border-radius: 12px
- Text: 14px italic

### PIN Input Boxes

**Mobile**:
- Size: 64x64px per box
- Gap: 12px
- Border-radius: 12px
- Number: 32px centered

**Tablet**:
- Size: 72x72px
- Gap: 16px
- Number: 36px

**Desktop**:
- Size: 80x80px
- Gap: 16px
- Number: 40px

---

## Z-Index Hierarchy

**Layering Strategy**:
```
100 - Modals/Overlays (future)
50  - Confetti particles (temporary)
40  - Toast notifications (future)
30  - PIN input focus rings
20  - Card content
10  - Card backgrounds
5   - Stars background particles
0   - Page background
```

**Current Usage**:
- StarsBackground: z-index: 0 (behind everything)
- Card container: z-index: 10 (above background)
- Card content: z-index: 20 (above card)
- PIN focus states: z-index: 30 (above other inputs)
- Confetti (unlock): z-index: 50 (above all content, temporary)

**Fixed/Sticky Elements**: None in current scope

---

## Responsive Behavior Summary

### Breakpoint Strategy
1. **Mobile-first CSS**: Base styles for 375px
2. **Tablet adjustments**: `@media (min-width: 768px)`
3. **Desktop enhancements**: `@media (min-width: 1024px)`

### Key Transformations

**375px → 768px**:
- Font sizes +10-20%
- Icon sizes +16px
- Padding increases +8-16px
- Countdown boxes +16px
- Max-widths increase

**768px → 1024px+**:
- Font sizes +15-25% from mobile
- Icon sizes +32px from mobile
- Hover effects activate
- Animations more elaborate
- Parallax effects (unlocked state)

### No Breakpoints For
- Color scheme (consistent across all sizes)
- Border radius (consistent proportions)
- Component stacking order (always vertical on mobile)

### Mobile-Only Considerations
- No hover states (use tap)
- Larger touch targets
- Simplified animations (performance)
- Single column layout always
- Scroll behavior (snap points not needed)

### Desktop-Only Enhancements
- Hover glow effects
- Cursor changes (pointer on interactive)
- Keyboard shortcuts
- More elaborate particle systems
- Parallax scrolling (unlocked content)

---

## Layout Testing Checklist

### Viewports to Test
- [ ] 375x667 (iPhone SE)
- [ ] 390x844 (iPhone 12/13)
- [ ] 414x896 (iPhone 11 Pro Max)
- [ ] 360x800 (Samsung Galaxy S20)
- [ ] 768x1024 (iPad Portrait)
- [ ] 1024x768 (iPad Landscape)
- [ ] 1440x900 (Desktop standard)
- [ ] 1920x1080 (Desktop HD)

### Orientation
- [ ] Portrait (primary)
- [ ] Landscape (ensure no horizontal scroll, content fits)

### Edge Cases
- [ ] Very long capsule title (3+ lines)
- [ ] Very long sender name
- [ ] No preview content (message/photo missing)
- [ ] Very long preview message (paragraph)
- [ ] Large preview photo (high res)
- [ ] Small preview photo (thumbnail)

### Browser Zoom
- [ ] 100% (default)
- [ ] 150% (common accessibility)
- [ ] 200% (WCAG requirement)

Ensure no horizontal scroll and all text readable at 200% zoom.

---

## Implementation Notes

### CSS Architecture
- Use Tailwind utility classes for consistency with hero
- Custom components for countdown/PIN (Framer Motion)
- CSS variables for theme tokens (dark/light)
- Mobile-first media queries

### Grid/Flexbox Strategy
- Container: Flexbox column, center-aligned
- Countdown timer: Flexbox row, gap-8 (mobile)
- PIN boxes: Flexbox row, gap-12
- Content: Block stacking, no grid needed

### Performance Optimization
- Use `transform` and `opacity` for animations
- `will-change` only during active animations
- Lazy load preview images
- Debounce resize handlers
- Reduce particle count on mobile (50 vs 200)

### Accessibility
- Semantic HTML (header, main, section)
- Proper heading hierarchy (h1 → h2)
- Focus management on state changes
- Live regions for countdown
- ARIA labels on icons

### Component Reusability
- `CapsuleBackground`: Wraps StarsBackground, handles dark/light
- `AnimatedCountdown`: Replaces basic Countdown.tsx
- `CapsuleCard`: Wrapper with common styling
- `CelebrationEffect`: Particle system for unlock

This spec provides pixel-perfect layout instructions for all states across all breakpoints, ensuring consistent implementation.
