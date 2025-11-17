# Media Assets Specification: Memory Time Capsule Landing Page

## Executive Summary

This document catalogs all visual and media assets required for the landing page revamp, including photos, videos, animations, icons, and illustrations. Each asset includes purpose, placement, technical specifications, and placeholder recommendations.

**Total Asset Categories:**
- Icons: 40+ (via Lucide React library)
- Brand Logos: via svgl (GitHub, Gmail, WhatsApp)
- Photos: 4 required (via Unsplash/Pexels MCP servers)
- Videos: 1 optional (hero background)
- Animations: 10+ micro-interactions
- Illustrations: 2-4 custom graphics

---

## 1. Icon System

### Recommended Library: Lucide React

**Rationale:**
- Already in common use with ShadCN UI
- Tree-shakeable (import only needed icons)
- Consistent design system
- MIT license (permissive)
- TypeScript support
- 1000+ icons available
- Regular updates

**Installation:**
```bash
npm install lucide-react
# or
yarn add lucide-react
```

**Usage Pattern:**
```tsx
import { Github, Mail, Shield, Clock } from 'lucide-react';

<Github className="w-6 h-6 text-primary" />
```

### Icon Inventory by Section

#### Hero Section
- **GitHub Logo:** `Github` (24px, muted color)
- **Gmail Logo:** `Mail` (24px, muted color) or custom Gmail SVG
- **Scroll Indicator:** `ChevronDown` (32px, animated)

#### Trust Indicators Bar
- **GitHub:** `Github` (32px)
- **Gmail:** `Mail` (32px) or custom
- **Security:** `Shield` or `ShieldCheck` (32px)
- **Free Badge:** `Gift` or `Sparkles` (32px)
- **Clock:** `Clock` or `Zap` (32px)

#### How It Works Timeline
- **Connect:** `Link` or `GitBranch` (48px, primary color)
- **Create:** `Upload` or `FileVideo` (48px, primary color)
- **Deliver:** `Send` or `Calendar` (48px, primary color)
- **Supporting Icons:**
  - GitHub logo: `Github` (20px)
  - Gmail logo: `Mail` (20px)
  - Video file: `FileVideo` (20px)
  - Audio file: `FileAudio` (20px)
  - Image file: `FileImage` (20px)
  - Text file: `FileText` (20px)

#### Interactive Demo
- **Progress Indicators:** `Circle` (filled/unfilled, 16px)
- **Navigation:** `ChevronLeft`, `ChevronRight` (24px)
- **Play/Pause:** `Play`, `Pause` (32px)
- **States:**
  - Upload: `Upload` (32px)
  - Storage: `Database` or `Archive` (32px)
  - Email: `Mail` (32px)

#### Features Grid
- **Multiple Content Types:** `FileVideo` or `Film` (48px)
- **Secure & Private:** `Shield` or `ShieldCheck` (48px)
- **Precise Timing:** `Clock` or `Timer` (48px)
- **Email Delivery:** `Mail` or `Send` (48px)
- **100% Free:** `Gift` or `Sparkles` (48px)
- **Easy Sharing:** `Share2` or `MessageCircle` (48px)

#### Use Cases
- **Personal Milestones:** `Cake` or `Gift` (40px)
- **Professional:** `Briefcase` or `Calendar` (40px)
- **Relationships:** `Heart` or `Users` (40px)
- **Creative:** `Camera` or `Archive` (40px)

#### Technology Stack
- **Database:** `Database` (32px)
- **Workflow:** `Workflow` or `Zap` (32px)
- **Cloud:** `Cloud` or `Server` (32px)
- **Code:** `Code` or `Terminal` (32px)
- **Security Icons:** `Lock`, `Key`, `EyeOff`, `Hash` (32px)
- **Checkmark:** `CheckCircle` (32px)

#### FAQ Section
- **Expand/Collapse:** `ChevronDown`, `ChevronUp` (20px)
- **Help Icon:** `HelpCircle` (20px, optional)

#### General UI
- **External Link:** `ExternalLink` (16px)
- **Menu:** `Menu` (24px)
- **Close:** `X` (24px)
- **User:** `User` or `UserCircle` (24px)
- **Settings:** `Settings` (24px)
- **Logout:** `LogOut` (24px)

### Custom Icons Needed

**Gmail Logo (Full Color):**
- Cannot use Lucide's generic Mail icon for brand representation
- Source: Google Brand Resources (https://about.google/brand-resources/)
- Format: SVG
- Size: 24px and 32px variants
- License: Use in context of Gmail integration is permitted

**WhatsApp Logo:**
- Source: WhatsApp Brand Guidelines
- Format: SVG
- Size: 24px
- Color: #25D366 (WhatsApp green)

**Cloudflare Logo:**
- Source: Cloudflare Brand Assets
- Format: SVG
- Size: 32px
- Color: #F38020 (Cloudflare orange) or white

### Icon Design Specifications

**Sizing:**
- Hero/CTA: 24px
- Section icons: 32-48px
- Feature cards: 40-48px
- UI elements: 16-24px

**Colors:**
- Primary icons: var(--primary) or gradient
- Muted icons: var(--muted-foreground)
- Brand logos: Original brand colors
- Monochrome option: currentColor (inherits text color)

**States:**
- Default: Base color
- Hover: Slightly lighter or scale(1.1)
- Active: Darker or scale(0.95)
- Disabled: opacity-50

**Accessibility:**
- Decorative icons: aria-hidden="true"
- Functional icons: aria-label="Description"
- Minimum contrast: 3:1 against background

---

## 2. Photography Assets

### Photo Inventory

#### Use Case Section (4 Photos)

**Photo 1: Personal Milestone**
- **Subject:** Birthday celebration or family gathering
- **Style:** Candid, warm, authentic (not stock-looking)
- **Composition:** People celebrating, cake/gifts visible
- **Dimensions:** 800x600px (4:3 ratio)
- **Format:** WebP with JPG fallback
- **Placement:** Use case card #1
- **Placeholder:** Unsplash search: "birthday celebration family"
- **Alt Text:** "Family celebrating birthday with cake and candles"

**Photo 2: Professional Setting**
- **Subject:** Calendar, desk workspace, or business planning
- **Style:** Clean, professional, modern
- **Composition:** Calendar/planner in focus, neutral background
- **Dimensions:** 800x600px (4:3 ratio)
- **Format:** WebP with JPG fallback
- **Placement:** Use case card #2
- **Placeholder:** Unsplash search: "calendar planning workspace"
- **Alt Text:** "Professional workspace with calendar and planning materials"

**Photo 3: Long-Distance Connection**
- **Subject:** Two people connecting (video call, embrace, or hands holding)
- **Style:** Emotional, warm, human connection
- **Composition:** Focus on connection (hands, faces, interaction)
- **Dimensions:** 800x600px (4:3 ratio)
- **Format:** WebP with JPG fallback
- **Placement:** Use case card #3
- **Placeholder:** Unsplash search: "people connecting relationship"
- **Alt Text:** "Two people embracing, showing connection and relationship"

**Photo 4: Family Time Capsule**
- **Subject:** Family photo, children, or treasure box
- **Style:** Nostalgic, warm, multi-generational
- **Composition:** Diverse family or time capsule box
- **Dimensions:** 800x600px (4:3 ratio)
- **Format:** WebP with JPG fallback
- **Placement:** Use case card #4
- **Placeholder:** Unsplash search: "family memories time capsule"
- **Alt Text:** "Multi-generational family creating memories together"

### Photo Selection Criteria

**Avoid:**
- Overly posed stock photos
- Unnatural smiling
- Generic office settings
- Cliché clock/hourglass imagery
- Single ethnicity representation

**Prefer:**
- Diverse representation (age, ethnicity, ability)
- Authentic moments (candid, not staged)
- Emotional resonance
- Technology integration where appropriate
- Natural lighting

### Photo Optimization

**Responsive Images:**
```html
<picture>
  <source
    srcset="image-800w.webp 800w, image-1200w.webp 1200w"
    type="image/webp"
  />
  <source
    srcset="image-800w.jpg 800w, image-1200w.jpg 1200w"
    type="image/jpeg"
  />
  <img
    src="image-800w.jpg"
    alt="Description"
    loading="lazy"
    decoding="async"
  />
</picture>
```

**Compression:**
- Tool: TinyPNG, Squoosh, or ImageOptim
- Target: Under 100KB per image
- Quality: 80-85% (sweet spot for web)

**Formats:**
- Primary: WebP (better compression)
- Fallback: JPG (universal support)
- Avoid: PNG for photos (larger file size)

### Additional Photo Opportunities

**Hero Background (Optional):**
- **Subject:** Abstract time/future concept (light trails, stars, clock elements)
- **Style:** Blurred, subtle, non-distracting
- **Dimensions:** 1920x1080px (16:9)
- **Placement:** Hero section background (20% opacity)
- **Placeholder:** Unsplash search: "abstract light trails time"

**Testimonial Avatars (Future):**
- **Subject:** User profile photos or initial-based avatars
- **Style:** Circular crop, consistent sizing
- **Dimensions:** 128x128px (display at 64x64px for retina)
- **Placement:** Social proof section
- **Placeholder:** Generate with UI Avatars API or similar

---

## 3. Video Assets

### Video Inventory

#### Hero Background Video

**Purpose:** Create dynamic, engaging first impression
**Placement:** Hero section background (20-30% opacity overlay)
**Duration:** 10-15 seconds (seamless loop)

**Content Options:**

**Option A: Time Progression Animation**
- Clock hands moving fast-forward
- Calendar pages flipping
- Sunrise to sunset time-lapse
- Subtle, abstract representation of time

**Option B: Light Trails / Particles**
- Animated particles floating upward (like messages to future)
- Light streaks traveling across screen
- Bokeh effect with drifting lights
- More abstract, less literal

**Option C: Code/Data Animation**
- GitHub commit graph animating
- Data flowing through network visualization
- Matrix-style code rain (subtle)
- Appeals to developer audience

**Technical Specifications:**
- **Resolution:** 1920x1080px (Full HD)
- **Format:** MP4 (H.264) + WebM (VP9) for compatibility
- **Codec:** H.264 High Profile
- **Bitrate:** 1-2 Mbps (balance quality and size)
- **File Size:** Under 5MB (critical for page load)
- **Frame Rate:** 24-30fps
- **Audio:** None (muted, no audio track)
- **Loop:** Seamless (first and last frames match)
- **Poster Image:** First frame as fallback (JPG, under 100KB)

**Implementation:**
```html
<video
  autoplay
  muted
  loop
  playsinline
  poster="hero-bg-poster.jpg"
  className="absolute inset-0 w-full h-full object-cover opacity-20"
>
  <source src="hero-bg.webm" type="video/webm" />
  <source src="hero-bg.mp4" type="video/mp4" />
</video>
```

**Mobile Consideration:**
- Replace with static poster image on mobile (performance/battery)
- Use `prefers-reduced-motion` media query to show static image

**Placeholder Source:**
- Coverr.co (free stock videos)
- Pexels Videos
- Search: "abstract time lapse" or "particles light"

---

#### Product Demo Video

**Purpose:** Show actual product workflow in 60-90 seconds
**Placement:** Video Demo section

**Content Outline:**
1. **Intro (0:00-0:05):** Logo + "Memory Time Capsule in 90 Seconds"
2. **Problem Statement (0:05-0:15):** "Want to send a message to the future?"
3. **Solution (0:15-0:30):** Quick overview of concept
4. **Demo Walkthrough (0:30-1:10):**
   - Connect GitHub (screen recording): 0:30-0:40
   - Connect Gmail (screen recording): 0:40-0:50
   - Create capsule (upload file, set date, add email): 0:50-1:05
   - Show delivery email preview: 1:05-1:10
5. **CTA (1:10-1:20):** "Start creating today - it's free"

**Technical Specifications:**
- **Resolution:** 1920x1080px (Full HD) or 1280x720px (HD)
- **Format:** MP4 (H.264) primary, WebM fallback
- **Aspect Ratio:** 16:9
- **Duration:** 60-90 seconds
- **File Size:** Under 10MB (compression critical)
- **Frame Rate:** 30fps
- **Audio:** Voiceover or music (optional, but recommended)
- **Captions:** Embedded or .vtt file (accessibility requirement)
- **Poster Image:** Compelling thumbnail (JPG, under 100KB)

**Production Notes:**
- Screen recording: Use OBS, ScreenFlow, or Camtasia
- Editing: DaVinci Resolve (free) or Adobe Premiere
- Voiceover: Clear, enthusiastic, not robotic
- Music: Royalty-free from Epidemic Sound or Artlist
- Captions: Auto-generate with YouTube, then refine

**Implementation:**
```html
<video
  controls
  poster="product-demo-poster.jpg"
  className="w-full rounded-lg shadow-2xl"
  preload="metadata"
>
  <source src="product-demo.mp4" type="video/mp4" />
  <source src="product-demo.webm" type="video/webm" />
  <track
    kind="captions"
    src="product-demo-en.vtt"
    srclang="en"
    label="English"
  />
  Your browser does not support video playback.
</video>
```

**Placeholder:**
- Initially: Link to YouTube/Vimeo embed
- Production: Create actual screen recording after feature completion

---

#### Interactive Demo Animations (Micro-Videos)

**Purpose:** Show UI states in interactive timeline demo
**Placement:** Interactive Demo section

**3 Short Clips (or Animated GIFs):**

1. **Create State Animation:**
   - Duration: 3-5 seconds
   - Content: Mockup of upload interface with file being dragged in
   - Format: GIF or MP4 (small file size)
   - Size: Under 500KB

2. **Storage State Animation:**
   - Duration: 3-5 seconds
   - Content: File appearing in GitHub repo structure
   - Format: GIF or MP4
   - Size: Under 500KB

3. **Delivery State Animation:**
   - Duration: 3-5 seconds
   - Content: Email notification appearing in inbox
   - Format: GIF or MP4
   - Size: Under 500KB

**Alternative:** Use static screenshots with CSS animations (more performant)

---

## 4. Animation Specifications

### CSS/JavaScript Animations

#### Hero Section Animations

**1. Headline Fade-In**
- **Type:** CSS animation (fade + slide up)
- **Timing:** 0.6s ease-out, delay 0.2s after page load
- **Effect:** opacity 0→1, translateY(20px)→0
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
```

**2. CTA Button Pulse**
- **Type:** CSS animation (subtle scale pulse)
- **Timing:** 2s infinite ease-in-out
- **Effect:** scale(1)→scale(1.05)→scale(1)
- **Trigger:** On hover or after 3s idle
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

**3. Scroll Indicator Bounce**
- **Type:** CSS animation (bounce down)
- **Timing:** 1.5s infinite
- **Effect:** translateY(0)→translateY(10px)→translateY(0)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
```

#### Trust Indicators Bar

**4. Fade-In on Scroll**
- **Type:** Intersection Observer + CSS transition
- **Timing:** 0.4s ease-out, stagger each indicator by 0.1s
- **Effect:** opacity 0→1, scale(0.9)→scale(1)
- **Trigger:** When section enters viewport

#### How It Works Timeline

**5. Timeline Progress Animation**
- **Type:** CSS animation (line drawing)
- **Timing:** 1.5s ease-in-out
- **Effect:** width 0%→100% (horizontal) or height 0%→100% (vertical)
- **Trigger:** On scroll into view
```css
@keyframes drawLine {
  from { width: 0%; }
  to { width: 100%; }
}
```

**6. Step Node Pulse**
- **Type:** CSS animation (ripple effect)
- **Timing:** 0.6s ease-out
- **Effect:** Circle expands from node
- **Trigger:** After line reaches node

**7. Icon Rotate/Scale**
- **Type:** CSS transition
- **Timing:** 0.3s ease-out
- **Effect:** scale(1)→scale(1.1), rotate(0deg)→rotate(5deg)
- **Trigger:** On hover

#### Interactive Demo

**8. Tab Transition**
- **Type:** CSS transition (fade + slide)
- **Timing:** 0.4s ease-in-out
- **Effect:** Content fades out left, new content fades in right
- **Trigger:** On tab click or auto-advance

**9. Progress Indicator Fill**
- **Type:** CSS transition
- **Timing:** 0.3s ease-out
- **Effect:** Fill color from muted to primary
- **Trigger:** On step change

#### Features Grid

**10. Card Hover Lift**
- **Type:** CSS transition
- **Timing:** 0.2s ease-out
- **Effect:** translateY(0)→translateY(-8px), shadow increase
- **Trigger:** On hover (desktop only)
```css
.feature-card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

**11. Icon Float**
- **Type:** CSS animation
- **Timing:** 2s infinite ease-in-out
- **Effect:** translateY(0)→translateY(-5px)→translateY(0)
- **Trigger:** On card hover

#### FAQ Accordion

**12. Accordion Expand/Collapse**
- **Type:** CSS/JS animation (height transition)
- **Timing:** 0.3s ease-in-out
- **Effect:** max-height 0→auto, rotate chevron 0deg→180deg
- **Trigger:** On click
```css
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}
.faq-answer.open {
  max-height: 500px; /* or use JS to calculate actual height */
}
```

#### Final CTA

**13. Background Gradient Shift**
- **Type:** CSS animation
- **Timing:** 10s infinite alternate
- **Effect:** background-position shift (subtle color movement)
- **Trigger:** Always active
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
```

### Animation Performance Optimization

**GPU Acceleration:**
- Use `transform` and `opacity` (GPU-accelerated properties)
- Avoid animating `width`, `height`, `top`, `left` (CPU-intensive)
- Add `will-change: transform` for complex animations (sparingly)

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Intersection Observer Pattern:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

---

## 5. Illustrations & Graphics

### Custom Illustrations Needed

#### 1. Timeline Visualization (How It Works)

**Description:** Visual representation of 3-step process with connecting line
**Style:** Line art, minimal color (primary + muted)
**Components:**
- Three circular nodes (64px diameter)
- Connecting line (horizontal desktop, vertical mobile)
- Icons inside nodes (Link, Upload, Send)
- Small supporting graphics (GitHub logo, file types, email preview)

**Dimensions:**
- Desktop: 1200x300px (wide horizontal)
- Mobile: 400x800px (tall vertical)

**Format:** SVG (scalable, small file size)

**Placeholder:** Create with Figma, Illustrator, or code with SVG
- Alternative: Use pure CSS with icons

---

#### 2. Interactive Demo Mockups

**Description:** Simplified UI mockups for interactive demo states
**Style:** Clean, minimal, branded colors
**Required Mockups:**
- Upload interface (file drop zone, date picker, email field)
- GitHub repository view (file tree, commit indicator)
- Email inbox preview (Gmail-style email preview)

**Dimensions:** 800x600px each (4:3 ratio)

**Format:** PNG (with transparency) or SVG

**Creation Tool:** Figma mockup, screenshot of actual UI, or hand-coded

---

#### 3. Technology Architecture Diagram

**Description:** Visual showing data flow: User → GitHub → GitHub Actions → Gmail
**Style:** Flowchart with icons and arrows
**Components:**
- User icon
- Arrows showing direction
- GitHub, GitHub Actions, Gmail logos
- Data/file icons

**Dimensions:** 1000x400px (horizontal)

**Format:** SVG

**Placeholder:** Draw with Excalidraw, Figma, or Mermaid diagram

---

#### 4. Security/Encryption Visualization

**Description:** Visual metaphor for encryption and security
**Style:** Lock/shield iconography with data symbols
**Components:**
- Shield or lock icon (central)
- Data particles or file icons (surrounding)
- Checkmarks or security badges

**Dimensions:** 600x600px (square)

**Format:** SVG or PNG

**Placeholder:** Icon composition or Lucide icon combinations

---

#### 5. Empty State Illustrations

**Description:** Friendly graphics for sections without data (e.g., no testimonials yet)
**Style:** Welcoming, not corporate, slight whimsy
**Examples:**
- "No testimonials yet" → People with speech bubbles
- "No capsules" → Empty treasure box or gift box

**Dimensions:** 400x300px

**Format:** SVG

**Placeholder:** Use illustration libraries (unDraw, Humaaans) or Lucide icon compositions

---

#### 6. Device Mockups (Optional)

**Description:** Phone/laptop frames showing product UI
**Purpose:** Make screenshots look polished
**Style:** Minimal bezels, realistic shadows
**Source:** Use mockup tools like Screely, Mockuphone, or Figma templates

---

## 6. Logo Assets

### Required Brand Logos

#### 1. GitHub Logo
- **Source:** GitHub Logos and Usage (github.com/logos)
- **Variants:**
  - Full color (black mark on transparent)
  - White version (for dark backgrounds)
  - Monochrome (inherits color)
- **Sizes:** 24px, 32px, 48px (height)
- **Format:** SVG
- **Usage:** Hero, Trust Bar, How It Works, Technology section
- **License:** Follow GitHub Brand Guidelines

#### 2. Gmail Logo
- **Source:** Google Brand Resources
- **Variants:**
  - Full color (red/blue/yellow/green)
  - Monochrome alternative (Lucide Mail icon)
- **Sizes:** 24px, 32px
- **Format:** SVG or PNG
- **Usage:** Hero, Trust Bar, How It Works, Features
- **Note:** May need custom SVG as Gmail logo isn't in Lucide

#### 3. Cloudflare Logo
- **Source:** Cloudflare Brand Assets
- **Variants:**
  - Full color (orange)
  - White version
- **Sizes:** 32px
- **Format:** SVG
- **Usage:** Technology section
- **License:** Use in context of "Powered by Cloudflare" permitted

#### 4. WhatsApp Logo
- **Source:** WhatsApp Brand Guidelines
- **Variants:**
  - Green icon (#25D366)
  - Black and white versions
- **Sizes:** 24px
- **Format:** SVG
- **Usage:** Features section (Easy Sharing card)
- **License:** Follow WhatsApp Brand Guidelines

#### 5. Product Logo/Wordmark
- **Name:** Memory Time Capsule
- **Needed:** Logo design or text-based wordmark
- **Variants:**
  - Full logo (icon + text)
  - Icon only (favicon)
  - White version (for dark backgrounds)
- **Sizes:** Various (nav bar, hero, footer, favicon)
- **Format:** SVG for scalability
- **Placeholder:** Text logo with icon (clock or capsule from Lucide)

---

## 7. Favicon & App Icons

### Favicon Set

**Required Sizes:**
- 16x16px (browser tab, old browsers)
- 32x32px (browser tab, modern browsers)
- 48x48px (Windows site icon)
- 180x180px (Apple Touch Icon for iOS)
- 192x192px (Android home screen)
- 512x512px (PWA splash screen)

**Format:** PNG (with transparency) or ICO

**Design:** Simple, recognizable at small size (clock, capsule, or "M" letter mark)

**Generation Tool:** RealFaviconGenerator.net (generates all sizes)

---

## 8. Asset Organization Structure

```
/public
  /images
    /hero
      hero-bg.mp4
      hero-bg.webm
      hero-bg-poster.jpg
    /use-cases
      personal-milestone.webp
      personal-milestone.jpg
      professional-reminder.webp
      professional-reminder.jpg
      long-distance.webp
      long-distance.jpg
      family-capsule.webp
      family-capsule.jpg
    /demo
      create-state.png
      storage-state.png
      delivery-state.png
    /logos
      github.svg
      gmail.svg
      cloudflare.svg
      whatsapp.svg
    /illustrations
      timeline-viz.svg
      architecture-diagram.svg
      security-viz.svg
      empty-state-testimonials.svg
  /videos
    product-demo.mp4
    product-demo.webm
    product-demo-en.vtt (captions)
  /icons
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png
    android-chrome-192x192.png
    android-chrome-512x512.png
```

---

## 9. Asset Checklist for Implementation

### Phase 1: Icons (Immediate)
- [ ] Install Lucide React
- [ ] Replace all emojis with Lucide icons
- [ ] Source GitHub, Gmail, Cloudflare, WhatsApp SVG logos
- [ ] Create/source product logo/favicon

### Phase 2: Essential Images (Week 1)
- [ ] 4 use case photos (Unsplash/Pexels)
- [ ] Optimize all photos (WebP + JPG)
- [ ] Create responsive image markup
- [ ] Test lazy loading

### Phase 3: Videos (Week 2)
- [ ] Hero background video (stock or create)
- [ ] Optimize and compress (under 5MB)
- [ ] Create poster images
- [ ] Test mobile fallback (static image)

### Phase 4: Animations (Week 2)
- [ ] Implement CSS animations (fade-in, pulse, bounce)
- [ ] Add Intersection Observer for scroll triggers
- [ ] Test prefers-reduced-motion
- [ ] Optimize animation performance

### Phase 5: Advanced Assets (Week 3)
- [ ] Product demo video (screen recording + editing)
- [ ] Add captions (.vtt file)
- [ ] Interactive demo mockups/animations
- [ ] Custom illustrations (timeline, architecture)

### Phase 6: Polish (Week 4)
- [ ] Logo design/refinement
- [ ] Favicon set generation
- [ ] Final image optimization pass
- [ ] Accessibility audit (alt text, contrast)

---

## 10. Asset Performance Budget

**Total Page Weight Target:** Under 2MB on initial load (excluding videos)

**Breakdown:**
- HTML/CSS/JS: 300KB (gzipped)
- Icons (inline SVG): 50KB
- Photos (above fold): 200KB
- Hero background video: 0KB (lazy load, or 500KB if critical)
- Product demo video: 0KB (user-initiated load)
- Illustrations: 100KB
- Fonts: 150KB
- Other assets: 200KB

**Optimization Strategies:**
- Lazy load all images below fold
- Use WebP with JPG fallback
- Compress videos aggressively
- Use SVG for icons (scalable, small)
- Inline critical icons (reduce HTTP requests)
- Defer non-critical assets

---

## 11. Placeholder Resources

### Free Photo Sources
- **Unsplash** (unsplash.com) - High quality, free license
- **Pexels** (pexels.com) - Curated free photos
- **Pixabay** (pixabay.com) - Large library, free

### Free Video Sources
- **Coverr** (coverr.co) - Free background videos
- **Pexels Videos** (pexels.com/videos) - Free stock videos
- **Mixkit** (mixkit.co) - Free video clips

### Illustration Libraries
- **unDraw** (undraw.co) - Customizable SVG illustrations
- **Humaaans** (humaaans.com) - Mix-and-match people illustrations
- **Blush** (blush.design) - Illustration packs

### Icon Tools
- **Lucide** (lucide.dev) - Primary icon library
- **Heroicons** (heroicons.com) - Alternative icon set
- **Feather Icons** (feathericons.com) - Minimal icons

### Mockup Tools
- **Screely** (screely.com) - Browser mockups
- **Mockuphone** (mockuphone.com) - Device mockups
- **Figma** - Full design and mockup tool

---

## 12. Accessibility Requirements for Media

### Images
- All images MUST have descriptive alt text
- Decorative images: alt=""
- Complex images (charts): Provide long description
- Test: Screen reader announces meaningful information

### Videos
- All videos MUST have captions (.vtt or embedded)
- Provide transcript for accessibility
- Ensure player controls are keyboard accessible
- Respect autoplay restrictions (accessibility + UX)

### Animations
- All animations MUST respect prefers-reduced-motion
- Provide pause/play controls for looping animations
- No flashing/strobing effects (seizure risk)
- Test: Animations disable cleanly in reduced motion mode

### Icons
- Decorative icons: aria-hidden="true"
- Functional icons: Include aria-label or visible text
- Ensure sufficient contrast (3:1 minimum)
- Test: Screen reader doesn't announce decorative icons

---

## Summary

This comprehensive media asset specification provides a complete inventory of all visual elements needed for the landing page revamp. Key priorities:

1. **Icons:** Lucide library handles 90% of needs; source brand logos separately
2. **Photos:** 4 use case images are highest priority; source from Unsplash/Pexels
3. **Videos:** Hero background video and product demo are high-impact additions
4. **Animations:** CSS-based micro-interactions enhance polish without complexity
5. **Illustrations:** Custom SVG graphics for timeline and architecture differentiate from stock

Implementation should follow phased approach: icons first (immediate polish), photos second (use case clarity), videos third (engagement boost), advanced animations last (refinement).

All assets must meet accessibility requirements (alt text, captions, reduced motion) and performance budget (under 2MB initial load). Use modern formats (WebP, SVG) with fallbacks for compatibility.
