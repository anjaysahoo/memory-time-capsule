# Phase 1 → Phase 2 Handoff Document

**Project:** Memory Time Capsule Landing Page Revamp
**From:** UX Research & Planning (Phase 1)
**To:** UI Design & Visual System (Phase 2)
**Date:** 2025-11-17

---

## Executive Summary

Phase 1 UX research complete. Comprehensive layout structure, interaction patterns, and media requirements defined for transforming basic landing page into conversion-optimized experience. Current implementation has solid information architecture but lacks visual sophistication, trust indicators, and engagement mechanisms.

**Key Deliverable:** 9-section landing page replacing current 4-section basic layout.

**Critical Changes:**
- Replace ALL emojis (🎁1️⃣2️⃣3️⃣🎥🔒⏰📧💰📱) with Lucide icons
- Add svgl brand logos (GitHub, Gmail, WhatsApp)
- Add 5 new sections (Trust Bar, Interactive Demo, Use Cases, Social Proof, FAQ)
- Implement 80+ micro-interactions and animations
- Integrate photos via Unsplash/Pexels MCP servers
- Achieve WCAG 2.1 AA accessibility compliance

**Estimated Impact:**
- Conversion rate: +15-30%
- Time on page: +40-60%
- Bounce rate: -20-30%

---

## Sections Overview

### Complete 9-Section Flow

**User Journey:** Hook → Trust → Educate → Experience → Discover → Relate → Validate → Clarify → Convert

| # | Section | Type | User Benefit | Priority |
|---|---------|------|--------------|----------|
| 1 | Hero Section | Enhanced | Immediate value communication, emotional connection | Must Have |
| 2 | Trust Indicators Bar | NEW | Instant credibility via GitHub/Gmail branding | Must Have |
| 3 | How It Works | Redesigned | Process clarity with visual timeline (no emoji numbers) | Must Have |
| 4 | Interactive Demo | NEW | Experiential learning of capsule lifecycle | Should Have |
| 5 | Features Grid | Enhanced | Comprehensive feature understanding (no emoji icons) | Must Have |
| 6 | Use Cases / Examples | NEW | Application clarity through real scenarios | Should Have |
| 7 | Social Proof | NEW (Placeholder) | Peer validation (future testimonials) | Should Have |
| 8 | FAQ Section | NEW | Objection handling before conversion | Must Have |
| 9 | Final CTA | Enhanced | Last conversion push with reinforced value | Must Have |

**Current Implementation:** 4 sections (Hero, How It Works, Features, CTA)
**Proposed Implementation:** 9 sections (5 new/enhanced)

**Deferred to Later:**
- Video Product Demo (implementation complexity)
- Technology & Security Deep-Dive (not required for initial launch)

---

## Layout Structure

### Section 1: Hero Section (Enhanced)

**Positioning:** Top of page, above fold
**Rationale:** First impression, must capture attention immediately

**Spacing:**
- Desktop: py-32 (128px vertical), max-w-6xl container
- Mobile: py-20 (80px vertical), px-4

**Visual Hierarchy:**
1. **Headline** (Primary): text-6xl (desktop), text-4xl (mobile), font-bold, white on gradient
2. **Subtitle** (Secondary): text-2xl (desktop), text-lg (mobile), white/90 opacity
3. **CTA Button** (Tertiary): Large (px-8 py-4), high contrast
4. **Background**: Gradient + 20% opacity video overlay OR animated particles

**Content:**
- Headline: "Send Messages to the Future" (NO emoji)
- Subtitle: Current copy maintained
- CTA: Dynamic (authenticated: "Create Time Capsule" / guest: "Get Started Free")
- NEW: GitHub + Gmail logos below CTA ("Powered by...")
- NEW: Animated scroll indicator (ChevronDown icon, bouncing)

**Media Requirements:**
- Background video: 10-15s loop, time progression theme, <5MB, 20% opacity
- Alternative: CSS particle animation
- Brand logos: GitHub, Gmail (24px, subtle integration)

**Responsive:**
- Desktop: Full viewport height, large text, background video
- Tablet: min-h-[600px], medium text, video or static
- Mobile: Natural height, smaller text, static background image

---

### Section 2: Trust Indicators Bar (NEW)

**Positioning:** Immediately below hero
**Rationale:** Capitalize on initial interest with instant credibility

**Spacing:**
- All breakpoints: py-8 (32px), max-w-7xl, gap-8 between badges

**Visual Hierarchy:**
- Equal weight distribution (all badges same size)
- Horizontal flex (desktop), 2x2 grid (mobile)
- Each badge: 32px icon + text-sm + subtext

**Content (4-5 Badges):**
1. **GitHub Integration**: Github icon, "Powered by GitHub", "Your data, your repo"
2. **Gmail Delivery**: Mail icon, "Sent via Gmail", "Reliable delivery"
3. **Security**: Shield icon, "Encrypted Storage", "Private & secure"
4. **Free Forever**: Gift icon, "100% Free", "No credit card"
5. **Auto Delivery** (optional): Clock icon, "Automated", "Hourly precision"

**Media Requirements:**
- Icons: Lucide (Github, Mail, Shield, Gift, Clock) at 32px
- Brand logos: GitHub, Gmail

**Responsive:**
- Desktop: Horizontal row, all visible
- Mobile: 2x2 grid, 24px icons

---

### Section 3: How It Works (Redesigned)

**Positioning:** After trust bar
**Rationale:** Users need process understanding before feature details

**Spacing:**
- Desktop: py-24, max-w-6xl, gap-16 between steps
- Mobile: py-16, px-4, gap-8 vertical

**Visual Hierarchy:**
1. **Section header**: text-4xl font-bold, center-aligned, mb-16
2. **Timeline line**: Horizontal (desktop) / vertical (mobile), 2-4px, primary color
3. **Step nodes**: 64px circular badges with icons (NO emoji numbers)
4. **Step content**: text-2xl title + text-base description

**Content:**
- **Step 1 - Connect**: Link icon, "Connect Your Accounts", "~2 min" badge
- **Step 2 - Create**: Upload icon, "Create Your Capsule", file type icons
- **Step 3 - Deliver**: Send icon, "Automatic Unlock", email preview mockup

**CRITICAL:** Replace 1️⃣2️⃣3️⃣ emoji with Lucide icons (Link, Upload, Send)

**Media Requirements:**
- Icons: Lucide (Link/GitBranch, Upload/FileVideo, Send/Calendar) at 48px
- Supporting icons: Github, Mail, FileVideo, FileAudio, FileImage, FileText at 20px
- Timeline line: Animated SVG or CSS gradient

**Responsive:**
- Desktop: 3 columns, horizontal timeline
- Mobile: Vertical stack, left-aligned with left border line

---

### Section 4: Interactive Demo (NEW)

**Positioning:** After How It Works
**Rationale:** Experiential learning increases engagement

**Spacing:**
- Desktop: py-32 (larger for emphasis), max-w-5xl, gap-8
- Mobile: py-20, px-4, gap-6
- Background: bg-muted/30 (differentiate from white)

**Visual Hierarchy:**
1. **Section title**: text-4xl + subheading
2. **Interactive component**: Large elevated card with shadow
3. **Demo visuals**: 70% width, mockups of UI
4. **Controls**: Tabs or prev/next buttons

**Content:**
- Title: "See It In Action"
- Subheading: "Click through a sample time capsule journey"
- **3 States**: Create (upload UI) → Storage (GitHub repo) → Delivery (email mockup)
- Navigation: Tabs with progress (1/3, 2/3, 3/3)
- Auto-advance option (3s intervals, pauseable)

**Media Requirements:**
- UI mockups: 3 screens showing workflow
- Icons: Circle (progress), ChevronLeft/Right, Play/Pause
- Sample data: "Birthday message.mp4", "Dec 25, 2025", "friend@email.com"

**Responsive:**
- Desktop: Side-by-side controls + visual
- Mobile: Stacked, swipe gesture support

---

### Section 5: Features Grid (Enhanced)

**Positioning:** After interactive demo
**Rationale:** Detailed feature exploration after process understanding

**Spacing:**
- Desktop: py-24, max-w-6xl, gap-8 between cards
- Mobile: py-16, px-4, gap-6

**Visual Hierarchy:**
- Section header: text-4xl, center, mb-16
- Feature cards: Equal size, grid-cols-3 (desktop) / grid-cols-1 (mobile)
- Card layout: 48px icon → text-2xl title → text-base description

**Content (6 Cards):**

1. **Rich Media Support**: FileVideo icon, "Videos up to 100MB, audio, photos, or text"
2. **Bank-Level Security**: Shield icon, "AES-256 encryption, private GitHub storage"
3. **Hourly Precision**: Clock icon, "GitHub Actions cron, any future date"
4. **Reliable Notifications**: Mail icon, "Gmail delivery with PIN access"
5. **Forever Free**: Gift icon, "Free tiers of GitHub/Gmail/Cloudflare, 1GB storage"
6. **WhatsApp Integration**: Share2 icon, "Pre-filled sharing messages"

**CRITICAL:** Replace 🎥🔒⏰📧💰📱 emoji with Lucide icons

**Media Requirements:**
- Icons: Lucide (FileVideo, Shield, Clock, Mail, Gift, Share2) at 48px
- Supporting badges: "AES-256", Gmail logo, WhatsApp logo

**Responsive:**
- Desktop: 3 columns, 2 rows
- Tablet: 2 columns, 3 rows
- Mobile: Single column stack

**Interactions:**
- Hover: Card lift (translateY-2), shadow increase, icon float

---

### Section 6: Use Cases / Examples (NEW)

**Positioning:** After features
**Rationale:** Help users visualize personal application

**Spacing:**
- Desktop: py-32, max-w-7xl, gap-12 between cards
- Mobile: py-20, px-4, gap-8
- Background: Subtle gradient (bg-gradient-to-b from-background to-muted/30)

**Visual Hierarchy:**
- Section header: text-4xl + text-xl subheading, center, mb-16
- Use case cards: Large with photos (400px width on desktop)
- Alternating layout (desktop): Image left/right alternating
- Card content: Photo 50%, text 50%

**Content (4 Use Cases):**

1. **Personal Milestones**: Birthday/anniversary, family photo, "I recorded a message to my daughter for her 18th birthday when she was 10"
2. **Professional Reminders**: Business calendar, "I use it for quarterly business reviews 90 days apart"
3. **Long-Distance Connections**: Two people connecting, "My partner's deployment is 6 months. I scheduled weekly messages"
4. **Family Time Capsules**: Multi-generational family, "Every New Year's Eve, we record a family video"

**Media Requirements:**
- 4 photos: 800x600px (4:3 ratio), WebP + JPG, under 100KB each
- Icons: Lucide (Cake, Briefcase, Heart, Camera) at 40px
- Photo sources: Unsplash/Pexels (authentic, diverse, warm)

**Responsive:**
- Desktop: Alternating image/text sides
- Mobile: Stacked (image top, text bottom)

---

### Section 7: Social Proof (NEW - Placeholder)

**Positioning:** After use cases
**Rationale:** Developer audience needs technical transparency

**Spacing:**
- Desktop: py-24, max-w-6xl, two-column gap-16
- Mobile: py-16, px-4, single column stack
- Background: bg-muted/50

**Visual Hierarchy:**
- Section header: text-4xl + subheading, left-aligned, mb-16
- Two columns: Tech Stack (left) + Security (right)
- Each column: text-2xl title, bullet lists with 32px icons

**Content:**

**Left Column - Tech Stack:**
- GitHub Storage: Database icon, "Private repo (1GB free)"
- GitHub Actions: Workflow icon, "Cron-based (99.9% uptime)"
- Gmail API: Mail icon, "OAuth2 (token-based auth)"
- Cloudflare Workers: Cloud icon, "Edge computing (<100ms)"
- React + TypeScript: Code icon, "Open source, auditable"

**Right Column - Security:**
- Encryption: Lock icon, "AES-256 for all files"
- Zero-Knowledge: EyeOff icon, "We can't access your content"
- OAuth2: Key icon, "Revocable permissions"
- PIN Protection: Hash icon, "6-digit recipient PIN"
- Audit Trail: FileText icon, "GitHub activity logs"
- GDPR: CheckCircle icon, "EU data protection"

**Media Requirements:**
- Icons: Lucide (Database, Workflow, Mail, Cloud, Code, Lock, Key, etc.) at 32px
- Brand logos: GitHub, Gmail, Cloudflare at 40px
- Optional: Architecture diagram SVG

**Responsive:**
- Desktop: 2 columns
- Mobile: Stacked (tech then security)

---

### Section 8: Video Product Demo (NEW)

**Positioning:** After tech/security
**Rationale:** Highly interested users benefit from visual walkthrough

**Spacing:**
- Desktop: py-32, max-w-5xl, video max-w-4xl
- Mobile: py-20, px-4, full-width video
- Background: Subtle brand gradient (primary/5 to purple/5)

**Visual Hierarchy:**
1. **Section title**: text-4xl, center, mb-4
2. **Subheading**: text-lg text-muted, mb-8
3. **Video player**: 16:9 aspect ratio, large, centered, elevated shadow
4. **CTA below**: "Ready to Try?" button

**Content:**
- Title: "See Time Capsule in 90 Seconds"
- Video: 60-90s screen recording walkthrough
- Content outline: Intro (5s) → Problem (10s) → Demo (50s) → CTA (10s)
- Player: HTML5 controls, no autoplay, captions required

**Media Requirements:**
- Video file: MP4 (H.264) + WebM, 1280x720 or 1920x1080, <10MB
- Poster image: Compelling thumbnail
- Captions: .vtt file for accessibility
- Fallback: "Watch on YouTube" link if video fails

**Responsive:**
- Desktop: 80-90% container width
- Mobile: Full width, encourage fullscreen

---

### Section 9: Social Proof (NEW - Placeholder)

**Positioning:** After use cases
**Rationale:** Peer validation reduces final hesitation

**Spacing:**
- Desktop: py-24, max-w-6xl, gap-8 between cards
- Mobile: py-16, px-4, gap-6

**Visual Hierarchy:**
- Section header: text-4xl, center, mb-16
- Testimonial cards: grid-cols-3 (desktop), carousel (mobile)
- Card layout: Avatar (64px) → Quote → Name/context → Rating

**Content:**

**Initial State Options:**
- **Option A**: "Be Among the First" with beta messaging
- **Option B**: Repurpose use case quotes with avatars
- **Option C**: GitHub stars/metrics ("Open source on GitHub")

**Future State (3 Testimonials):**
1. Personal user: Parent testimonial, 5 stars
2. Developer user: Engineer praising GitHub storage, 5 stars
3. Business user: Founder using for reminders, 5 stars

**Media Requirements:**
- Avatars: 128x128px (circular), placeholder or real photos
- Star icons: Lucide Star (filled) at 16px
- Optional: Logo cloud if featured anywhere

**Responsive:**
- Desktop: 3 columns
- Mobile: Swipeable carousel with dots

---

### Section 8: FAQ Section (NEW)

**Positioning:** After social proof, before final CTA
**Rationale:** Address objections before conversion attempt

**Spacing:**
- Desktop: py-24, max-w-4xl (narrow for readability), gap-4 between items
- Mobile: py-16, px-4, gap-3
- Background: bg-muted/30

**Visual Hierarchy:**
- Section header: text-4xl + subheading, center, mb-12
- FAQ items: Accordion design (expandable)
- Question: text-lg font-semibold + ChevronDown icon
- Answer: text-base text-muted, hidden until clicked

**Content (8-10 Questions):**

1. Is it really free?
2. How does scheduled delivery work?
3. Is my content secure and private?
4. What file types can I send?
5. What happens if I delete my GitHub account?
6. Can I edit or cancel a capsule?
7. Why do you need Gmail access?
8. How long can I set a capsule?
9. Will recipients know it's from an app?
10. What if recipient doesn't have PIN?

**Bottom Element:** "Still have questions? Contact Support" link

**Media Requirements:**
- Icons: Lucide ChevronDown/Up at 20px
- Optional: HelpCircle icon at 20px

**Responsive:**
- Desktop: Single column, hover states
- Mobile: Full-width, larger tap targets (44px min)

**Interactions:**
- Smooth accordion expand/collapse (300ms)
- Chevron rotation (180deg) when expanded
- Keyboard navigation (arrow keys)

---

### Section 9: Final CTA (Enhanced)

**Positioning:** Bottom of page, after FAQ
**Rationale:** Last conversion opportunity for engaged scrollers

**Spacing:**
- Desktop: py-32, max-w-3xl (narrow for focus)
- Mobile: py-20, px-4
- Margin: mb-16 (space before footer)

**Visual Hierarchy:**
1. **Headline**: text-5xl (desktop) / text-3xl (mobile), font-bold, center
2. **Value prop**: text-xl / text-lg, text-muted
3. **CTA button**: Extra large (px-12 py-6, text-lg), primary bg, pulse animation
4. **Supporting text**: "No credit card required" below button

**Content:**
- Headline: "Ready to Send a Message to the Future?"
- Value prop: "Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes."
- CTA: Dynamic (same as hero)
- Trust elements: GitHub + Gmail logos below

**Background Options:**
- Option A: Gradient matching hero (visual bookend)
- Option B: Elevated card on muted bg
- Option C: Full-width banner with illustration

**Media Requirements:**
- Optional: Illustration or time capsule graphic
- Brand logos: GitHub, Gmail at 24px

**Responsive:**
- Desktop: Centered, large text
- Mobile: Full-width button, compact padding

**Interactions:**
- Button pulse/glow animation (continuous subtle)
- Hover: scale(1.05) + shadow increase

---

## Media Assets Required

### Icons (40+ total)

**Primary Library:** Lucide React (UI icons, tree-shakeable, MIT license)

**Installation:**
```bash
npm install lucide-react
```

**Brand Logos:** Use **svgl via shadcn MCP** for high-quality brand SVGs
- svgl added to components.json registries
- Use `mcp__shadcn__search_items_in_registries` to find logos
- Use `mcp__shadcn__view_items_in_registries` to view logo details
- Required logos: GitHub, Gmail, WhatsApp
- Optional: Cloudflare (for future sections)

**Critical Replacements (Remove ALL Emojis):**
- Hero: Remove 🎁
- Timeline: Replace 1️⃣2️⃣3️⃣ with Lucide icons (Link, Upload, Send)
- Features: Replace 🎥🔒⏰📧💰📱 with Lucide icons (FileVideo, Shield, Clock, Mail, Gift, Share2)

**Complete Icon Inventory:**

**Lucide Icons:**
- **Hero**: ChevronDown (scroll indicator)
- **Trust Bar**: Shield, Gift, Clock (Lucide) + GitHub/Gmail logos (svgl)
- **Timeline**: Link, Upload, Send + FileVideo, FileAudio, FileImage, FileText
- **Features**: FileVideo, Shield, Clock, Mail, Gift, Share2
- **Use Cases**: Cake, Briefcase, Heart, Camera
- **FAQ**: ChevronDown, ChevronUp
- **UI**: ExternalLink, Menu, X, User, Settings, LogOut

**Brand Logos (svgl):**
- GitHub: Hero, Trust Bar, Timeline
- Gmail: Hero, Trust Bar, Timeline, Features
- WhatsApp: Features section

**Sizing:**
- Brand logos: 24-32px
- Section icons (Lucide): 32-48px
- Feature cards: 40-48px
- UI elements: 16-24px

---

### Photos (4 required, 8-12 total)

**Use Case Section (4 Required):**

1. **Personal Milestone**
   - Subject: Birthday celebration, family gathering
   - Style: Candid, warm, authentic
   - Dimensions: 800x600px (4:3)
   - Format: WebP + JPG fallback
   - Source: Unsplash "birthday celebration family"
   - Target: <100KB optimized

2. **Professional Reminder**
   - Subject: Calendar, workspace, planner
   - Style: Clean, professional, modern
   - Dimensions: 800x600px
   - Source: Unsplash "calendar planning workspace"

3. **Long-Distance Connection**
   - Subject: People connecting, embrace, hands
   - Style: Emotional, warm, human
   - Dimensions: 800x600px
   - Source: Unsplash "people connecting relationship"

4. **Family Time Capsule**
   - Subject: Multi-generational family, treasure box
   - Style: Nostalgic, warm, diverse
   - Dimensions: 800x600px
   - Source: Unsplash "family memories time capsule"

**Photo Selection Criteria:**
- ✅ Diverse representation (age, ethnicity, ability)
- ✅ Authentic candid moments (not overly posed)
- ✅ Emotional resonance
- ✅ Natural lighting
- ❌ Avoid cliché stock photos
- ❌ Avoid clock/hourglass imagery
- ❌ Avoid single ethnicity

**Optimization:**
- WebP primary, JPG fallback
- Compression: 80-85% quality
- Lazy loading: `loading="lazy"`
- Responsive srcset: 800w, 1200w variants

---

### Videos (1 file)

**1. Hero Background Video (Optional)**
- **Purpose**: Dynamic first impression
- **Duration**: 10-15s seamless loop
- **Content**: Time progression (clock fast-forward, calendar flip) OR light trails/particles
- **Format**: MP4 (H.264) + WebM fallback
- **Dimensions**: 1920x1080 (16:9)
- **File Size**: <5MB (aggressive compression)
- **Opacity**: 20-30% overlay
- **Mobile**: Replace with static poster image
- **Autoplay**: Muted, pause when scrolled away

**Deferred to Later:**
- Product Demo Video (60-90s walkthrough) - implementation complexity
- Can be added in future iteration when ready

---

### Animations & Illustrations

**CSS Animations (10+ patterns):**
- Page load cascade (hero fade-in)
- Scroll indicator bounce
- CTA button pulse
- Timeline line drawing (1500ms)
- Node reveal with bounce overshoot
- Card hover lift (translateY-2)
- FAQ accordion expand/collapse (300ms)
- Trust badge stagger (100ms intervals)

**Illustrations (4-6 graphics):**
- Timeline visualization (SVG)
- Architecture diagram (data flow GitHub → Gmail)
- Security visualization (encryption concept)
- Empty state graphics (FAQ no results)

**All animations must:**
- Respect `prefers-reduced-motion`
- Use GPU-accelerated properties only (transform, opacity)
- Target 60fps
- Include fallback for reduced motion

---

## Interaction Patterns

### Global Patterns

**Button States (All CTA Buttons):**
- **Default**: Base style
- **Hover**: scale(1.05) + shadow increase + brightness(1.1), 200ms
- **Active**: scale(0.95), 100ms
- **Focus**: 2px outline + 4px ring, high visibility
- **Reduced Motion**: Shadow/color only, no scale

**Card Interactions:**
- **Hover**: translateY(-2px) + shadow elevation, 250ms
- **Icon float**: Supporting icons gentle float (translateY -5px loop)

**Scroll Animations:**
- **Trigger**: Intersection Observer (threshold 0.2)
- **Pattern**: Fade in + slide up (translateY 30px → 0)
- **Stagger**: 80-100ms between sequential items
- **Reduced Motion**: Fade only

---

### Section-Specific Interactions

**Hero Section:**
- Load cascade: Headline (0ms) → Subtitle (100ms) → CTA (200ms)
- Background video fade: 400-800ms
- Scroll indicator bounce: Infinite 1500ms loop
- CTA hover: Scale + shadow + brightness

**Trust Bar:**
- Staggered reveal: 100ms intervals (4 badges)
- Icon wiggle hover: rotate(5deg) scale(1.1), playful bounce easing
- "Free" badge double pulse (delight moment)

**Timeline (How It Works):**
- Line drawing: 0% → 100% width, 1500ms
- Node reveal: Sequential with bounce overshoot (400ms, 900ms, 1400ms)
- Node pulse: Ripple effect after reveal (800ms)
- Content stagger: Title (+100ms) → Description (+200ms) → Badge (+300ms)

**Interactive Demo:**
- Tab transitions: Smooth slide (300ms)
- Auto-advance: 3s intervals with progress bar
- Panel slide: translateX animation between states

**Features Grid:**
- Staggered card reveal: 80ms stagger
- Hover lift: translateY(-2px) + shadow
- Icon float: Gentle up/down (2s loop)

**Use Cases:**
- Alternating entrance: Odd from left, even from right
- Image zoom hover: scale(1.05) on photo

**Video Demo:**
- Custom player controls (optional)
- Loading states with spinner
- Fullscreen transition

**FAQ:**
- Accordion expand: Height + opacity, 300ms
- Chevron rotation: 180deg on expand
- Keyboard: Arrow keys navigate, Enter toggles

**Final CTA:**
- Continuous gradient shift (subtle, slow)
- Magnetic hover effect (optional)
- Ripple click animation

---

### Accessibility Accommodations

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- All animations: Fade only, no transform
- Videos: Static poster images
- Autoplay: Disabled

**Keyboard Navigation:**
- All interactive elements: Tab reachable
- Visible focus rings: 2px outline + 4px ring
- Logical tab order: Top to bottom, left to right
- Skip navigation: "Jump to main content" link
- FAQ accordion: Arrow keys navigate, Enter/Space toggle

**Screen Reader:**
- Proper heading hierarchy: h1 → h2 → h3 (no skips)
- ARIA landmarks: `<main>`, `<nav>`, `<section aria-labelledby="...">`
- Icon handling: Decorative `aria-hidden="true"`, functional `aria-label`
- Video captions: Required .vtt file
- Form labels: Proper associations
- Dynamic content: `aria-live` regions

**Color Contrast:**
- Text on backgrounds: 4.5:1 minimum (WCAG AA)
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 against adjacent
- Focus indicators: 3:1 minimum
- Test: Browser dev tools contrast checker

---

## Responsive Breakpoints

### Mobile (320px - 768px)
- Single column layouts throughout
- Stacked sections (no side-by-side)
- Reduced padding: px-4, py-12 to py-20
- Larger touch targets: min 44x44px
- Full-width buttons
- Smaller text: text-4xl → text-3xl headers
- Carousel/swipe for multi-item sections
- Static backgrounds (no video)
- Disabled hover effects
- Icons: 24-32px (vs 32-48px desktop)

### Tablet (768px - 1024px)
- 2-column layouts (features, use cases)
- Maintained spacing: px-6, py-16 to py-24
- Standard touch targets
- Simplified animations
- Flexible button widths
- Medium text sizing
- Grid layouts with wrapping
- Optional background effects

### Desktop (1024px+)
- Multi-column layouts (3-col timeline, features)
- Generous spacing: px-8, py-24 to py-32
- Hover states and animations active
- Normal button sizing
- Large text: text-6xl hero
- Complex layouts (side-by-side, alternating)
- Background videos and effects
- Sticky elements possible

---

## Next Phase Instructions

### For Phase 2 UI Designer

You will create:

**1. Color Palette**
- Choose brand colors that resonate with "time capsule" / "messages to the future" concept
- Primary color (CTA buttons, icons, accents)
- Secondary color (supporting elements)
- Gradient definitions (hero, CTA backgrounds)
- Muted/neutral colors (backgrounds, borders)
- Semantic colors (success, warning, error)
- Consider: Deep purples/blues (time/space), warm golds (future/nostalgia), or modern teals

**2. Typography System**
- Display font (hero headlines): Bold, modern, legible
- Heading font: May match display or complement
- Body font: High readability, web-safe
- Monospace font: For code snippets (tech section)
- Scale: text-xs through text-6xl+ definitions
- Line heights: Optimize for readability
- Font weights: Define 400, 500, 600, 700 usage

**3. Spacing Tokens**
- Base unit: 8px (Tailwind default)
- Scale: 4/8/12/16/24/32/48/64/96/128px
- Section padding: py-16, py-24, py-32
- Container max-widths: 3xl, 4xl, 5xl, 6xl, 7xl
- Card gaps: gap-6, gap-8, gap-12

**4. Component Styling**
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Elevated, flat, bordered, hover states
- **Badges**: Color fills, sizes, rounded corners
- **Inputs**: Focus states, validation, disabled
- **Accordions**: Expanded/collapsed states
- **Video player**: Custom controls (optional)

**5. Animation Timing/Easing**
- Standard transitions: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Slow transitions: 300-400ms ease-out
- Playful bounces: cubic-bezier(0.68, -0.55, 0.265, 1.55)
- Timeline drawing: 1500ms
- Accordion: 300ms ease-in-out

**6. Gradient Specifications**
- Hero background: from-primary to-purple-700 (or custom)
- CTA sections: Matching hero for bookend effect
- Subtle backgrounds: Muted gradients with low opacity

**7. Shadow System**
- Card default: Subtle elevation
- Card hover: Increased elevation
- Focus rings: 0 0 0 4px rgba(primary, 0.2)
- Button shadows: 0 8px 24px rgba(0,0,0,0.15) on hover

**8. Dark Mode (Optional)**
- If implementing, define dark variants for all colors
- Ensure WCAG AA contrast in both modes

---

### Constraints

**Maintain ShadCN UI Compatibility:**
- Use existing ShadCN components where possible
- Follow Tailwind utility-first approach
- Radix UI primitives for complex interactions

**Accessibility Requirements:**
- WCAG 2.1 AA compliance minimum
- All color contrasts meet 4.5:1 (text) / 3:1 (large text)
- Focus indicators meet 3:1 contrast
- No color-only information

**Performance Budget:**
- Total page load: <2MB (excluding on-demand videos)
- CSS bundle: <150KB
- Font files: <150KB
- Critical CSS: Inline for above-fold

**Brand Guidelines:**
- GitHub logo: Official colors (#181717 or white)
- Gmail logo: Official colors (multi-color or simplified)
- Cloudflare logo: Official orange (#F38020) or white
- WhatsApp logo: Official green (#25D366)

---

## Implementation Priority

### Phase 1 (Week 1 - Must Have)
1. Hero with Lucide icons (NO emojis)
2. Trust indicators bar (GitHub/Gmail logos)
3. How It Works timeline with icons
4. Features grid with Lucide icons
5. FAQ accordion
6. Final CTA
7. All keyboard focus states
8. Reduced motion support

**Deliverable:** Functional landing page with icon system, core sections, full accessibility

### Phase 2 (Week 2 - Should Have)
7. Use cases with photos (can use placeholders)
8. Technology & Security section
9. Basic interactive demo (static states, no auto-advance)
10. Social proof placeholder
11. Scroll-based animations
12. Mobile gestures

**Deliverable:** Enhanced page with photos, advanced sections, animations

### Phase 3 (Week 3-4 - Nice to Have)
11. Background video in hero
12. Animated timeline drawing
13. Full interactive demo with auto-advance
14. Product demo video
15. Advanced delight moments (Easter eggs, magnetic effects)
16. Testimonials (when available)

**Deliverable:** Polished page with all media, full interactions, delightful details

---

## Success Criteria

**Design Phase (Phase 2) Complete When:**
- [ ] Color palette defined and documented
- [ ] Typography system specified
- [ ] Component design system created
- [ ] Animation timing/easing defined
- [ ] All sections have visual designs
- [ ] Accessibility validated (contrast, sizing)
- [ ] Responsive behavior documented
- [ ] Handoff document created for Phase 3

**Development Phase (Phase 3) Complete When:**
- [ ] All 11 sections implemented
- [ ] ALL emojis replaced with icons (zero emojis remaining)
- [ ] Photos integrated (or placeholders)
- [ ] Animations functional with reduced motion support
- [ ] Responsive at all breakpoints
- [ ] Keyboard navigation works completely
- [ ] Screen reader tested (no critical errors)
- [ ] Performance budget met (<2MB)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

---

## Files & Resources

**Phase 1 Deliverables (Reference):**
- `research.md`: UX research, competitive analysis, user psychology
- `layout-structure.md`: Complete 11-section specifications (THIS IS CRITICAL)
- `interaction-patterns.md`: 80+ micro-interactions, animations, delightful moments
- `media-assets.md`: Complete photo/video/icon catalog
- `summary.md`: Executive summary, priorities, risks

**Design Tools:**
- Figma/Sketch (optional): Visual mockups
- Coolors/Adobe Color: Palette generation
- Google Fonts: Typography exploration
- Contrast checker: WebAIM, browser dev tools

**Icon Resources:**
- Lucide React: https://lucide.dev
- GitHub brand: https://github.com/logos
- Gmail resources: Google Brand Resources

**Photo Sources:**
- **Unsplash MCP Server**: Use `mcp__unsplash__search_photos` tool for direct image search
- **Pexels MCP Server**: Use `mcp__pexels__photos_search` tool for additional options
- Criteria: Authentic, diverse, high-quality, free license
- Search queries provided in photo specifications above

**Video Resources:**
- Hero background: Stock footage (Pexels, Coverr, Mixkit)
- Product demo: Screen recording (Loom, OBS)
- Compression: HandBrake, FFmpeg

---

## Contact & Questions

**For UX Clarifications:** Reference `layout-structure.md` for detailed section specs
**For Interaction Details:** Reference `interaction-patterns.md` for timing/easing
**For Media Specs:** Reference `media-assets.md` for asset requirements

**Key Decisions to Make in Phase 2:**
1. **Color palette**: What colors best represent "time capsule" / "future messaging"?
2. **Typography**: Modern sans-serif? Serif for warmth? Monospace accents?
3. **Hero background**: Video, particles, or static gradient?
4. **Interactive demo**: Tabs or prev/next buttons?
5. **Social proof**: Which initial state (beta, use cases, or GitHub stats)?

---

## Summary

**Phase 1 deliverable:** Complete UX foundation for 9-section landing page transformation.

**Critical path items:**
1. Replace ALL emojis with Lucide icons (highest visual impact)
2. Add svgl brand logos for GitHub, Gmail, WhatsApp (professional branding)
3. Implement Trust Bar (conversion driver)
4. Add FAQ (objection handling)
5. Enhance timeline with visual animations
6. Use Cases with photos via Unsplash/Pexels MCP servers

**Expected outcomes:**
- Professional appearance (Lucide + svgl icon system vs emojis)
- Increased trust (GitHub/Gmail logos, FAQ)
- Better engagement (interactive demo, photos, animations)
- Higher conversion (FAQ, multiple CTAs, use cases)
- Full accessibility (WCAG AA, keyboard nav, reduced motion)

**Deferred Features:**
- Video Product Demo (future iteration)
- Technology & Security Deep-Dive (not required)

**Phase 2 Designer:** You have full creative freedom on visual design (colors, typography, gradients) within the constraints of the layout structure, accessibility requirements, and brand guidelines provided. Use Unsplash/Pexels MCP servers for image selection.

Ready for visual design phase. 🚀
